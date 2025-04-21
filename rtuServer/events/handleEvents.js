const logger = require('../../log/logger.js');
const rtuBufferAccumulator = require('../request/bufferAccumulator.js');

function handleSocketEvents(socket) {
  socket.on('error', (err) => {
    rtuBufferAccumulator.reset();
    logger.error('RTU Fail sending to master');
    logger.debug(`Error reason: ${err}`);
  });

  socket.on('end', () => {
    rtuBufferAccumulator.reset();
    logger.info(
      `Client disconnected: ${socket.remoteAddress}:${socket.remotePort}`
    );
  });
  socket.on('close', () => {
    rtuBufferAccumulator.reset();
    logger.info(
      `Client connection closed: ${socket.remoteAddress}:${socket.remotePort}`
    );
  });
  socket.on('timeout', () => {
    rtuBufferAccumulator.reset();
    logger.warn(
      `Client connection timed out: ${socket.remoteAddress}:${socket.remotePort}`
    );
  });
}

module.exports = handleSocketEvents;
