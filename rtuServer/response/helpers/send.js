const logger = require('../../../log/logger.js');
const bufferToString = require('../../../tcpServer/libs/util.js');

function sendRtuResponse(response, socket) {
  socket.write(response, (err) => {
    if (err) return logger.error('Socket sending response fail');
    logger.debug(`RTU response: ${bufferToString(response)}`);
    logger.info(`RTU response sent to Master`);
  });
}

module.exports = sendRtuResponse;
