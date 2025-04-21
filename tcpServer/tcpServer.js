const net = require('net');
const bufferAccumulator = require('./request/bufferAccumulator.js');
const tcpResponse = require('./response/tcpResponse.js');
const logger = require('../log/logger.js');
const bufferToString = require('./libs/util.js');
const setupObj = require('../setup.json');
const handleTcpRequest = require('./request/handleTcpRequest.js');
const handleTcpEvents = require('./events/handleEvents.js');

const tcpServer = net.createServer();
const PORT = setupObj.tcp.port || 502;
const HOST = setupObj.tcp.host || 'localhost';

// MODBUS-TCP SERVER
tcpServer.on('connection', (socket) => {
  logger.info(
    `TCP client connected: ${socket.remoteAddress}:${socket.remotePort}`
  );

  // Handle Request
  socket.on('data', (buffer) => {
    const requestBuffer = bufferAccumulator.accumulate(buffer);
    if (!requestBuffer) return;
    logger.info(
      `Received TCP request from: ${socket.remoteAddress}:${socket.remotePort}`
    );
    logger.debug(`TCP request: ${bufferToString(requestBuffer)}`);

    try {
      // Operate with registers
      const valuesResult = handleTcpRequest(requestBuffer);

      // Prepare Response
      const responseData = tcpResponse.formBy(requestBuffer, valuesResult);

      // Send to Client
      tcpResponse.send(responseData, socket);
    } catch (error) {
      logger.error(error);
    }
  });

  // Handle socket events
  handleTcpEvents(socket);
});

function startModbusTcpServer() {
  tcpServer.listen(PORT, HOST, () => {
    logger.info(`Modbus-TCP Server is running on port: ${PORT}`);
  });
}

module.exports = startModbusTcpServer;
