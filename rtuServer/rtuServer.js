const net = require('net');
const logger = require('../log/logger.js');
const requestRouter = require('../tcpServer/request/requestRouter.js');
const rtuResponseRouter = require('./response/rtuResponseRouter.js');
const handleSocketEvents = require('./events/handleEvents.js');
const setupObj = require('../setup.json');
const rtuRequestParser = require('./request/rtuRequestParser.js');
const sendRtuResponse = require('./response/helpers/send.js');
const ModbusError = require('../modbusErrors/ModbusError.js');
const ModbusValidator = require('../modbusValidator/modbusValidator.js');
const shouldIgnore = require('./request/ignore/shouldIgnore.js');
const { checkRtuTimeout } = require('./request/ignore/filters.js');
const { RtuRequestBuffer } = require('./request/bufferAccumulator.js');
const bufferToString = require('../tcpServer/libs/util.js');
const PORT = setupObj.rtu.port || 50502;
const rtuServer = net.createServer();

rtuServer.on('connection', (socket) => {
  const rtuChunksAccumulator = new RtuRequestBuffer();

  socket.on('data', (chunk) => {
    // Reset buffer by timeout
    if (checkRtuTimeout) rtuChunksAccumulator.reset();

    try {
      const rtuRequest = rtuChunksAccumulator.add(chunk).frame;
      if (!rtuRequest) return; // wait frame complete
      logger.info(`Received RTU request`);

      // Ignore requests
      if (shouldIgnore(rtuRequest)) return rtuChunksAccumulator.reset();

      logger.debug(`RTU request: ${bufferToString(rtuRequest)}`);
      // Validate data
      new ModbusValidator('rtu', rtuRequest).validate();

      // Operate with registers
      const { fnCode } = rtuRequestParser.getParams(rtuRequest);
      const result = requestRouter[fnCode](rtuRequest, rtuRequestParser);

      // Prepare Response
      const response = rtuResponseRouter[fnCode](rtuRequest, result);

      // Send to Client
      sendRtuResponse(response, socket);
    } catch (error) {
      rtuChunksAccumulator.reset();

      if (error instanceof ModbusError) {
        logger.warn(error.message);
        return sendRtuResponse(error.errorResponse, socket);
      }
      logger.error(`RTU request handling error: `, error);
    }
  });

  // Handle socket events
  handleSocketEvents(socket, rtuChunksAccumulator);
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
