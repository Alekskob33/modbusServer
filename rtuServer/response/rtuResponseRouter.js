const rtuResponse = require('./helpers/rtuResponse.js');

const rtuResponseRouter = {
  0x01: rtuResponse.onRead,
  0x02: rtuResponse.onRead,
  0x03: rtuResponse.onRead,
  0x04: rtuResponse.onRead,

  0x05: (request) => request,
  0x06: (request) => request,

  0x0f: rtuResponse.onWriteMultiple,
  0x10: rtuResponse.onWriteMultiple,
};

module.exports = rtuResponseRouter;
