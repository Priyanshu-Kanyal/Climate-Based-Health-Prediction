import { spawn } from 'child_process';
import { promisify } from 'util';

/**
 * Test which Python command works on the system
 * Returns the first working command or null
 */
export async function findPythonCommand() {
  let winCommands = ['python', 'py', 'python3'];
  if (process.env.LOCALAPPDATA) {
    winCommands.push(`${process.env.LOCALAPPDATA}\\Programs\\Python\\Python311\\python.exe`);
    winCommands.push(`${process.env.LOCALAPPDATA}\\Programs\\Python\\Python312\\python.exe`);
  }
  const commands = process.platform === 'win32' ? winCommands : ['python3', 'python'];
  
  for (const cmd of commands) {
    try {
      const result = await testPythonCommand(cmd);
      if (result) {
        return cmd;
      }
    } catch (error) {
      // Try next command
      continue;
    }
  }
  
  return null;
}

/**
 * Test if a Python command works
 */
function testPythonCommand(cmd) {
  return new Promise((resolve) => {
    const python = spawn(cmd, ['--version'], {
      shell: process.platform === 'win32',
      stdio: 'pipe'
    });
    
    let output = '';
    python.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    python.on('close', (code) => {
      resolve(code === 0);
    });
    
    python.on('error', () => {
      resolve(false);
    });
    
    // Timeout after 5 seconds
    setTimeout(() => {
      python.kill();
      resolve(false);
    }, 5000);
  });
}

