const {
  getResponseOnRead,
  getResponseOnWriteMultiple,
} = require('./generateBuffer.js');

const responseRouter = {
  // on Read
  0x01: getResponseOnRead,
  0x02: getResponseOnRead,
  0x03: getResponseOnRead,
  0x04: getResponseOnRead,

  // on Write
  0x05: (requestBuffer) => requestBuffer,
  0x06: (requestBuffer) => requestBuffer,

  // on Write Multiple
  0x0f: getResponseOnWriteMultiple,
  0x10: getResponseOnWriteMultiple,
};

module.exports = responseRouter;
