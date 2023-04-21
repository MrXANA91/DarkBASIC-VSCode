const vscode = require('vscode');
const net = require('net');
const fs = require('fs');
const path = require('path');

function activate(context) {
  // Register the command for simulate debugging
  context.subscriptions.push(
    vscode.debug.registerDebugAdapterDescriptorFactory('darkbasic', {
      createDebugAdapterDescriptor: (session) => {
        return new vscode.DebugAdapterExecutable('node', [`${context.extensionPath}/dummyDebugAdapter.js`]);
      },
    })
  );
  
  // Register the command for generating configuration files
  context.subscriptions.push(
    vscode.commands.registerCommand('darkbasic.generateConfigFiles', async () => {
      const workspaceFolders = vscode.workspace.workspaceFolders;
      if (!workspaceFolders || workspaceFolders.length === 0) {
        vscode.window.showErrorMessage('Please open a workspace before generating configuration files.');
        return;
      }

      vscode.window.showInformationMessage('Please select the DarkBASIC compiler EXE file.');
      const selectedWorkspaceFolder = workspaceFolders[0].uri.fsPath;
      const dbCompiler = await vscode.window.showOpenDialog({
        title: 'Please select a DarkBASIC compiler executable',
        canSelectFiles: true,
        canSelectFolders: false,
        canSelectMany: false,
        filters: {
          'DarkBASIC compiler': ['exe'],
        },
      });

      if (!dbCompiler) {
        vscode.window.showErrorMessage('DarkBASIC compiler path is required.');
        return;
      }
      const dbCompilerPathUnfixed = dbCompiler[0].fsPath;
      const dbCompilerPath = dbCompilerPathUnfixed.replace(/\\/g, '\\\\');

      const dbaFile = await vscode.window.showOpenDialog({
        title: "Please select the main source file (Press 'cancel' to execute opened file each time)",
        canSelectFiles: true,
        canSelectFolders: false,
        canSelectMany: false,
        filters: {
          'DarkBASIC Main Source File': ['dba'],
        },
      });

      const mainDbaPathUnfixed = dbaFile ? dbaFile[0].fsPath : '${file}';
      const mainDbaPath = mainDbaPathUnfixed.replace(/\\/g, '\\\\');

      const tasksJsonContent = `{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Compile",
      "type": "shell",
      "command": "${dbCompilerPath}",
      "args": [
        "-c",
        "${mainDbaPath}"
      ],
      "group": "none",
      "presentation": {
        "reveal": "always"
      },
      "problemMatcher": []
    },
    {
      "label": "Display Compiler Log",
      "type": "shell",
      "command": "type DBCompile.log", // Use "cat DBCompiler.log" on macOS and Linux
      "group": "none",
      "problemMatcher": []
    },
    {
      "label": "Compile and Display Log",
      "dependsOrder": "sequence",
      "dependsOn": ["Compile", "Display Compiler Log"],
      "group": "build",
      "problemMatcher": []
    },
    {
      "label": "Compile and Execute",
      "type": "shell",
      "command": "${dbCompilerPath}",
      "args": [
        "-x",
        "${mainDbaPath}"
      ],
      "group": "none",
      "presentation": {
        "reveal": "always"
      },
      "problemMatcher": []
    },
    {
      "label": "Compile and Execute then Display Log",
      "dependsOrder": "sequence",
      "dependsOn": ["Compile and Execute", "Display Compiler Log"],
      "group": "test",
      "problemMatcher": []
    }
  ]
}`;

      const launchJsonContent = `{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Compile and Execute then Display Log",
      "type": "darkbasic",
      "request": "launch",
      "preLaunchTask": "Compile and Execute then Display Log"
    }
  ]
}`;

      const vscodeFolderPath = path.join(selectedWorkspaceFolder, '.vscode');

      if (!fs.existsSync(vscodeFolderPath)) {
        fs.mkdirSync(vscodeFolderPath);
      }

      fs.writeFileSync(path.join(vscodeFolderPath, 'tasks.json'), tasksJsonContent);
      fs.writeFileSync(path.join(vscodeFolderPath, 'launch.json'), launchJsonContent);

      vscode.window.showInformationMessage('DarkBASIC configuration files have been generated.');
    })
  );

  // Event listener for when the debug session is terminated
  vscode.debug.onDidTerminateDebugSession(async (session) => {
    if (session.type === 'darkbasic') {
      const debugConfiguration = session.configuration;
      if (debugConfiguration.preLaunchTask === 'Compile and Execute') {
        vscode.commands.executeCommand('workbench.action.debug.stop');
      }
    }
  });
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
