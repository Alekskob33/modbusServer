const logger = require('../../log/logger.js');
const bufferAccumulator = require('../request/bufferAccumulator.js');

function handleTcpEvents(socket) {
  // Handle Error
  socket.on('error', (err) => {
    bufferAccumulator.resetAccumulator();
    logger.error('Socket error:', err);
  });

  socket.on('end', () => {
    bufferAccumulator.resetAccumulator();
    logger.info(
      `Client disconnected: ${socket.remoteAddress}:${socket.remotePort}`
    );
  });
  socket.on('close', () => {
    bufferAccumulator.resetAccumulator();
    logger.info(
      `Client connection closed: ${socket.remoteAddress}:${socket.remotePort}`
    );
  });
  socket.on('timeout', () => {
    bufferAccumulator.resetAccumulator();
    logger.warn(
      `Client connection timed out: ${socket.remoteAddress}:${socket.remotePort}`
    );
  });
}

module.exports = handleTcpEvents;
