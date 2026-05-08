import { Router } from 'express';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { findPythonCommand } from '../utils/testPython.js';
const router = Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the ML model directory (check both 'ML MODEL' and 'ml' directories)
const rootDir = path.join(__dirname, '..', '..');
const ML_MODEL_PATH_1 = path.join(rootDir, 'ML MODEL');
const ML_MODEL_PATH_2 = path.join(rootDir, 'ml');

// Use whichever directory exists (prefer 'ML MODEL' if both exist)
let ML_MODEL_PATH;
let PREDICT_SCRIPT;

if (fs.existsSync(ML_MODEL_PATH_1) && fs.existsSync(path.join(ML_MODEL_PATH_1, 'predict_api.py'))) {
  ML_MODEL_PATH = ML_MODEL_PATH_1;
  PREDICT_SCRIPT = path.join(ML_MODEL_PATH, 'predict_api.py');
} else if (fs.existsSync(ML_MODEL_PATH_2) && fs.existsSync(path.join(ML_MODEL_PATH_2, 'predict_api.py'))) {
  ML_MODEL_PATH = ML_MODEL_PATH_2;
  PREDICT_SCRIPT = path.join(ML_MODEL_PATH, 'predict_api.py');
} else {
  // Default to 'ml' directory
  ML_MODEL_PATH = ML_MODEL_PATH_2;
  PREDICT_SCRIPT = path.join(ML_MODEL_PATH, 'predict_api.py');
}

router.post('/predict', async (req, res) => {
  try {
    const { description, weather } = req.body;

    if (!description || typeof description !== 'string' || description.trim() === '') {
      return res.status(400).json({ 
        error: 'Description is required and must be a non-empty string' 
      });
    }

    // Log paths for debugging
    console.log('=== ML Prediction Request ===');
    console.log('ML_MODEL_PATH:', ML_MODEL_PATH);
    console.log('PREDICT_SCRIPT:', PREDICT_SCRIPT);
    console.log('Script exists:', fs.existsSync(PREDICT_SCRIPT));
    console.log('Model file exists:', fs.existsSync(path.join(ML_MODEL_PATH, 'disease_category_model_local.joblib')));
    console.log('Platform:', process.platform);

    // Check if script file exists
    if (!fs.existsSync(PREDICT_SCRIPT)) {
      console.error('Python script not found at:', PREDICT_SCRIPT);
      return res.status(500).json({ 
        error: 'Prediction script not found',
        details: `Script path: ${PREDICT_SCRIPT}`
      });
    }

    // Prepare input data
    const inputData = {
      description: description ? description.trim() : "",
      weather: weather || null,
      Lag1_Temp_Avg: req.body.Lag1_Temp_Avg,
      Lag1_Dew_Avg: req.body.Lag1_Dew_Avg,
      Lag1_Precip_Sum: req.body.Lag1_Precip_Sum
    };

    // Determine Python command based on platform
    // On Windows: try 'py', 'python', 'python3' (in order of preference)
    // On Linux/Mac: try 'python3', 'python'
    let pythonCmd = await findPythonCommand() || (process.platform === 'win32' ? 'python' : 'python3');
    console.log('Using Python command:', pythonCmd);
    console.log('Script path:', PREDICT_SCRIPT);
    console.log('Working directory:', ML_MODEL_PATH);
    console.log('If this fails, try: python, python3, or py (Windows)');
    
    // Use relative path (filename only) since we're setting cwd
    // This avoids issues with spaces in directory paths on Windows
    const scriptFileName = path.basename(PREDICT_SCRIPT);
    console.log('Script filename:', scriptFileName);
    
    // Spawn Python process to run prediction
    // We use just the filename since cwd is set to ML_MODEL_PATH
    const pythonProcess = spawn(pythonCmd, [scriptFileName], {
      cwd: ML_MODEL_PATH,  // Set working directory to ML MODEL folder
      stdio: ['pipe', 'pipe', 'pipe'],
      shell: process.platform === 'win32' // Use shell on Windows for better compatibility
    });

    let stdout = '';
    let stderr = '';
    let responseSent = false;

    // Send input data to Python script
    try {
      pythonProcess.stdin.write(JSON.stringify(inputData));
      pythonProcess.stdin.end();
    } catch (stdinError) {
      console.error('Error writing to stdin:', stdinError);
      if (!responseSent) {
        responseSent = true;
        return res.status(500).json({ 
          error: 'Failed to send data to prediction script',
          details: stdinError.message
        });
      }
    }

    // Collect output
    pythonProcess.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      stderr += data.toString();
      console.error('Python stderr:', data.toString());
    });

    // Handle process completion
    pythonProcess.on('close', (code) => {
      if (responseSent) return;
      
      console.log('Python process exited with code:', code);
      console.log('Python stdout:', stdout);
      console.log('Python stderr:', stderr);

      if (code !== 0) {
        responseSent = true;
        // Try to parse error from stderr (might be JSON)
        try {
          const errorObj = JSON.parse(stderr);
          return res.status(500).json({ 
            error: errorObj.error || 'Prediction failed',
            details: errorObj.error || stderr || 'Unknown error occurred'
          });
        } catch {
          return res.status(500).json({ 
            error: 'Prediction failed',
            details: stderr || stdout || `Python process exited with code ${code}`
          });
        }
      }

      try {
        if (!stdout || stdout.trim() === '') {
          responseSent = true;
          return res.status(500).json({ 
            error: 'No output from prediction script',
            details: 'The Python script did not return any data. Check if all dependencies are installed.'
          });
        }

        const result = JSON.parse(stdout);
        
        if (result.error) {
          responseSent = true;
          return res.status(500).json({ 
            error: result.error 
          });
        }

        responseSent = true;
        res.json({
          success: true,
          prediction: result.prediction,
          features: result.features
        });
      } catch (parseError) {
        console.error('Failed to parse Python output:', parseError);
        console.error('Python stdout:', stdout);
        console.error('Python stderr:', stderr);
        if (!responseSent) {
          responseSent = true;
          return res.status(500).json({ 
            error: 'Failed to parse prediction result',
            details: `Parse error: ${parseError.message}. Output: ${stdout || stderr}`
          });
        }
      }
    });

    // Handle process errors (e.g., Python not found)
    pythonProcess.on('error', (error) => {
      console.error('Failed to start Python process:', error);
      if (!responseSent) {
        responseSent = true;
        return res.status(500).json({ 
          error: 'Failed to start prediction service',
          details: `Python command '${pythonCmd}' not found. Please ensure Python is installed and in your PATH. Error: ${error.message}`
        });
      }
    });

    // Set a timeout for the Python process (30 seconds)
    const timeout = setTimeout(() => {
      if (!responseSent) {
        responseSent = true;
        pythonProcess.kill();
        return res.status(500).json({ 
          error: 'Prediction timeout',
          details: 'The prediction process took too long to complete (>30 seconds)'
        });
      }
    }, 30000);

    // Clear timeout when process completes
    pythonProcess.on('close', () => {
      clearTimeout(timeout);
    });

  } catch (error) {
    console.error('Disease prediction error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
});

export default router;

