const rtuRequestParser = require('../../request/rtuRequestParser.js');
const { calcCrc } = require('./crc.js');

const rtuResponse = {
  onRead(request, resultValues) {
    const { slaveId, fnCode } = rtuRequestParser.getParams(request);

    const bytesCount = resultValues.length; // without CRC
    const buffer = Buffer.concat([
      Buffer.from([slaveId]),
      Buffer.from([fnCode]),
      Buffer.from([bytesCount]),
      resultValues,
    ]);
    return Buffer.concat([buffer, calcCrc(buffer)]);
  },

  onWriteMultiple(request) {
    const reqChunkCopy = request.slice(0, 6);
    return Buffer.concat([reqChunkCopy, calcCrc(reqChunkCopy)]);
  },
};

module.exports = rtuResponse;
