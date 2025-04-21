const net = require('net');
const tcpResponse = require('./response/tcpResponse.js');
const logger = require('../log/logger.js');
const bufferToString = require('./libs/util.js');
const setupObj = require('../setup.json');
const handleTcpRequest = require('./request/handleTcpRequest.js');
const handleTcpEvents = require('./events/handleEvents.js');
const ModbusError = require('../modbusErrors/ModbusError.js');
const ModbusValidator = require('../modbusValidator/modbusValidator.js');
const { TcpRequestBuffer } = require('./request/bufferAccumulator.js');

const tcpServer = net.createServer();
const PORT = setupObj.tcp.port || 502;
const HOST = setupObj.tcp.host || 'localhost';

// MODBUS-TCP SERVER
tcpServer.on('connection', (socket) => {
  const clientAddr = `${socket.remoteAddress}:${socket.remotePort}`;
  logger.info(`TCP client connected: ${clientAddr}`);
  const tcpChunksAccumulator = new TcpRequestBuffer();

  // Handle Request
  socket.on('data', (chunk) => {
    const tcpRequest = tcpChunksAccumulator.add(chunk).frame;
    if (!tcpRequest) return;

    logger.info(`Received TCP request from: ${clientAddr}`);
    logger.debug(`TCP request: ${bufferToString(tcpRequest)}`);

    try {
      new ModbusValidator('tcp', tcpRequest).validate();

      // Handle request
      const valuesResult = handleTcpRequest(tcpRequest);
      const responseData = tcpResponse.formBy(tcpRequest, valuesResult);
      // Send to client
      tcpResponse.send(responseData, socket);
    } catch (error) {
      tcpChunksAccumulator.reset();

      if (error instanceof ModbusError) {
        logger.warn(error.message);
        return tcpResponse.send(error.errorResponse, socket);
      }
      logger.error(error);
    }
  });

  // Handle socket events
  handleTcpEvents(socket, tcpChunksAccumulator);
});

function startModbusTcpServer() {
  tcpServer.listen(PORT, HOST, () => {
    logger.info(`Modbus-TCP Server is running on port: ${PORT}`);
  });
}

module.exports = startModbusTcpServer;
