const vscode = require('vscode');
const net = require('net');

function activate(context) {
  context.subscriptions.push(
    vscode.debug.registerDebugAdapterDescriptorFactory('darkbasic', {
      createDebugAdapterDescriptor: (session) => {
        return new vscode.DebugAdapterExecutable('node', [`${context.extensionPath}/dummyDebugAdapter.js`]);
      },
    })
  );
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
