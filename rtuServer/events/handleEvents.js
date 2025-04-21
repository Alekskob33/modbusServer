const logger = require('../../log/logger.js');

function handleSocketEvents(socket, chunksAccumulator) {
  const clientAddr = `Client disconnected: ${socket.remoteAddress}:${socket.remotePort}`;

  socket.on('error', (err) => {
    chunksAccumulator.reset();
    logger.error(`Fail sending response to ${clientAddr}`);
    logger.debug(`Error reason: ${err}`);
  });

  socket.on('end', () => {
    chunksAccumulator.reset();
    logger.info(`Client disconnected: ${clientAddr}`);
  });
  socket.on('close', () => {
    chunksAccumulator.reset();
    logger.info(`Client connection closed: ${clientAddr}`);
  });
  socket.on('timeout', () => {
    chunksAccumulator.reset();
    logger.warn(`Client connection timeout: ${clientAddr}`);
  });
}

module.exports = handleSocketEvents;
