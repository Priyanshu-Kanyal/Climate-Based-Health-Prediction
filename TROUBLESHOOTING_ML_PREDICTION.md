# Troubleshooting ML Prediction 500 Error

## Common Causes and Solutions

### 1. Python Not Installed or Not in PATH

**Symptoms:**
- Error: "Failed to start prediction service"
- Error: "Python command not found"

**Solution:**
1. Install Python 3.8 or higher from [python.org](https://www.python.org/downloads/)
2. During installation, check "Add Python to PATH"
3. Verify installation:
   ```bash
   python --version
   # or
   py --version
   # or
   python3 --version
   ```

### 2. Python Dependencies Not Installed

**Symptoms:**
- Error: "No module named 'joblib'" or similar
- Error: "ModuleNotFoundError"

**Solution:**
```bash
cd "ML MODEL"
pip install -r requirements.txt
```

Or install individually:
```bash
pip install joblib pandas numpy scikit-learn
```

### 3. Model File Not Found

**Symptoms:**
- Error: "Model file not found"
- Error: "FileNotFoundError"

**Solution:**
1. Verify `disease_category_model_local.joblib` exists in `ML MODEL` folder
2. Check file permissions
3. Verify the file is not corrupted

### 4. Python Script Path Issues

**Symptoms:**
- Error: "Prediction script not found"
- Error: "Cannot find script"

**Solution:**
1. Verify `ML MODEL/predict_api.py` exists
2. Check backend can access the ML MODEL directory
3. Verify path in backend console logs

### 5. Python Command Detection Issues (Windows)

**Symptoms:**
- Error: "Python command 'py' not found"

**Solution:**
1. Try using `python` instead of `py`:
   - Edit `backend/routes/diseasePredictionRoute.js`
   - Change: `let pythonCmd = process.platform === 'win32' ? 'python' : 'python3';`
2. Or use full path to Python executable

## Quick Test Steps

### Step 1: Test Python Installation
```bash
python --version
```

### Step 2: Test Python Dependencies
```bash
python -c "import joblib; import pandas; import numpy; import sklearn; print('All dependencies installed')"
```

### Step 3: Test Python Script Manually
```bash
cd "ML MODEL"
python predict_api.py
```

Then paste this JSON:
```json
{
  "description": "Patient has high fever, body temperature 39°C, experiencing nausea and vomiting.",
  "weather": {
    "temperature": 32.5,
    "humidity": 75,
    "precipitation": 15.5
  }
}
```

Press Ctrl+D (Linux/Mac) or Ctrl+Z+Enter (Windows) to send EOF.

### Step 4: Check Backend Logs
When you click "Predict Disease Category", check the backend console for:
- Python command being used
- Paths to script and model
- Any Python errors

### Step 5: Verify Backend Server is Running
```bash
cd backend
npm start
```

Should see: "Server running on http://localhost:5000"

## Detailed Error Messages

The backend now provides detailed error messages. Check:
1. **Browser Console** (F12) - Frontend errors
2. **Backend Console** (terminal) - Backend and Python errors
3. **Network Tab** (F12) - API response details

## Common Error Messages

### "Failed to start prediction service"
- Python not installed or not in PATH
- Solution: Install Python and add to PATH

### "Prediction script not found"
- Script file missing or wrong path
- Solution: Verify `ML MODEL/predict_api.py` exists

### "Failed to load model"
- Model file missing or corrupted
- Solution: Verify `disease_category_model_local.joblib` exists

### "No module named 'X'"
- Python dependency missing
- Solution: Run `pip install -r requirements.txt`

### "No output from prediction script"
- Python script crashed or didn't return data
- Solution: Check backend console for Python errors

## Still Having Issues?

1. **Check Backend Console**: Look for detailed error messages
2. **Test Python Script Manually**: Run `predict_api.py` directly
3. **Verify All Files Exist**: Check all required files are in place
4. **Check Python Version**: Ensure Python 3.8+
5. **Reinstall Dependencies**: `pip install --upgrade -r requirements.txt`

## Contact Support

If issues persist:
1. Check backend console logs
2. Test Python script manually
3. Verify all setup steps completed
4. Share error messages from console

