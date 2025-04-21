const logger = require('../../log/logger.js');
const rtuBufferAccumulator = require('./bufferAccumulator.js');
const frameTimeout = require('./timeout.js');
const { validate } = require('./validate.js');

function handleChunk(chunk) {
  // Wait buffer
  const rtuRequest = rtuBufferAccumulator.acc(chunk).frame;
  if (!rtuRequest) return;

  if (!validate(rtuRequest)) return rtuBufferAccumulator.reset();
  if (frameTimeout.finished) return rtuBufferAccumulator.reset();

  logger.info(`Received RTU request from Master`);
  logger.debug(`RTU request: ${rtuRequest.toString('hex')}`);

  return rtuRequest;
}

module.exports = handleChunk;
