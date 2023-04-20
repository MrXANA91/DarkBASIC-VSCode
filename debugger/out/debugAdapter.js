const { DebugSession } = require('vscode-debugadapter');
const { Subject } = require('await-notify');

class DarkBasicDebugSession extends DebugSession {
  constructor() {
    super();
    this._variableHandles = new Handles();
  }

  async initializeRequest(response, args) {
    response.body = response.body || {};

    response.body.supportsConfigurationDoneRequest = true;
    response.body.supportsTerminateRequest = true;

    this.sendResponse(response);
  }

  async launchRequest(response, args) {
    this.sendResponse(response);
    this.sendEvent(new InitializedEvent());
  }

  async configurationDoneRequest(response, args) {
    this.sendResponse(response);
  }

  async disconnectRequest(response, args) {
    this.sendResponse(response);
  }
}

DebugSession.run(DarkBasicDebugSession);
