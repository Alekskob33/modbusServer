const rtuRequestParser = require('../../request/rtuRequestParser.js');
const { calcCrc } = require('./crc.js');

const rtuResponse = {
  onRead(request, resultValues) {
    const { slaveId, fnCode } = rtuRequestParser.getParams(request);

    const bytesCount = resultValues.length + 2; // +2 for CRC
    const buffer = Buffer.concat([
      Buffer.from([slaveId]),
      Buffer.from([fnCode]),
      Buffer.from([bytesCount]),
      resultValues,
    ]);
    return Buffer.concat([buffer, calcCrc(buffer)]);
  },

  onWriteMultiple(request) {
    let { slaveId, fnCode, startAddr, quantity } =
      rtuRequestParser.getParams(request);
    // TODO: refactor this (много трансформаций туда-сюда)

    startAddr = Buffer.alloc(2);
    startAddr.writeUInt16BE(startAddr, 0);
    quantity = Buffer.alloc(2);
    quantity.writeUInt16BE(quantity, 0);

    const buffer = Buffer.concat([
      Buffer.from([slaveId]),
      Buffer.from([fnCode]),
      startAddr,
      quantity,
    ]);

    return Buffer.concat([buffer, calcCrc(buffer)]);
  },
};

module.exports = rtuResponse;
