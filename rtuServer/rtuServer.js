const net = require('net');
const logger = require('../log/logger.js');
const requestRouter = require('../tcpServer/request/requestRouter.js');
const rtuResponseRouter = require('./response/rtuResponseRouter.js');
const handleSocketEvents = require('./events/handleEvents.js');

const setupObj = require('../setup.json');
const handleChunk = require('./request/handleChunk.js');
const rtuRequestParser = require('./request/rtuRequestParser.js');
const PORT = setupObj.rtu.port || 50502;
const rtuServer = net.createServer();

// TODO: Реализовать отправку ответа при ошибке (зарезервированные ответы modbus)

rtuServer.on('connection', (socket) => {
  socket.on('data', (chunk) => {
    const rtuRequest = handleChunk(chunk);
    if (!rtuRequest) return;

    try {
      // Operate with registers
      const { fnCode } = rtuRequestParser.getParams(rtuRequest);
      const result = requestRouter[fnCode](rtuRequest, rtuRequestParser);

      // Prepare Response
      const response = rtuResponseRouter[fnCode](rtuRequest, result);

      // Send to Client
      socket.write(response, (err) => {
        if (err) return;
        logger.debug(`RTU response: ${response.toString('hex')}`);
        logger.info(`RTU response sent to Master`);
      });
    } catch (error) {
      logger.error(`RTU request handling error: ${error}`);
    }
  });

  // Handle socket events
  handleSocketEvents(socket);
});

rtuServer.on('error', (err) => {
  logger.error(`RTU Server error: ${err.message}`);
});

function startRtuServer() {
  rtuServer.listen(PORT, () => {
    logger.info(`Modbus RTU server is running on port: ${PORT}`);
  });
}

module.exports = startRtuServer;
