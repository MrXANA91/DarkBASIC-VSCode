const net = require('net');

const server = net.createServer((socket) => {
  socket.on('data', (data) => {
    const message = JSON.parse(data.toString());
    if (message.command === 'initialize') {
      const response = {
        seq: 0,
        type: 'response',
        request_seq: message.seq,
        command: message.command,
        success: true,
        body: {
          supportsConfigurationDoneRequest: true,
          supportsCancelRequest: false,
        },
      };
      socket.write(JSON.stringify(response));
    } else if (message.command === 'disconnect') {
      const response = {
        seq: 0,
        type: 'response',
        request_seq: message.seq,
        command: message.command,
        success: true,
      };
      socket.write(JSON.stringify(response));
      socket.end();
    }
  });
});

server.listen(0, '127.0.0.1', () => {
  console.log(`Dummy debug adapter listening on port ${server.address().port}`);
});
