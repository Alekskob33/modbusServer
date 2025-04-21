const bufferToString = require('../libs/util.js');
const logger = require('../../log/logger.js');
const registersRouter = require('../request/requestRouter.js');
const responseRouter = require('./responseRouter.js');
const handleModbusRequest = require('../request/handleTcpRequest.js');
const tcpRequestParser = require('../request/tcpRequestParser.js');

// Modbus-TCP Response
const tcpResponse = {
  formBy(requestBuffer, operationResult) {
    try {
      const { fnCode } = tcpRequestParser.getParams(requestBuffer);
      return responseRouter[fnCode](requestBuffer, operationResult);
    } catch (error) {
      throw new Error(
        `Fail to read/write registers. Request: ${bufferToString(
          requestBuffer
        )}`
      );
    }
  },

  send(responseBuffer, socket) {
    socket.write(responseBuffer, (err) => {
      if (err) return logger.error('Socket sending response fail');

      logger.debug(`TCP response: ${bufferToString(responseBuffer)}`);
      logger.info(
        `TCP response sent to client ${socket.remoteAddress}:${socket.remotePort}`
      );
    });
  },
};

module.exports = tcpResponse;
