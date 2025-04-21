const {
  bigEndianBufferFrom16Array,
} = require('../tcpServer/libs/serialize.js');

const registers = {
  DO: new Uint16Array(250),
  DI: new Uint16Array(250),
  AO: new Uint16Array(250),
  AI: new Uint16Array(250),

  get(memorySector, { buffer, parser }) {
    const { startAddr, quantity } = parser.getParams(buffer);
    const endAddr = startAddr + quantity;
    const valuesArray = this[memorySector].subarray(startAddr, endAddr);

    const valuesBuffer = bigEndianBufferFrom16Array(valuesArray);
    return valuesBuffer;
  },

  set(memorySector, { buffer, parser }) {
    const { startAddr, newValue } = parser.getParams(buffer);

    this[memorySector][startAddr] = newValue;
    return Buffer.from([newValue]);
  },

  setMultiple(memorySector, { buffer, parser }) {
    const { startAddr, quantity, newValuesBuffer } = parser.getParams(buffer);
    const endAddr = startAddr + quantity;

    const registersArray = this[memorySector].subarray(startAddr, endAddr);
    // Write new values
    for (let i = 0; i < registersArray.length; i++) {
      registersArray[i] = newValuesBuffer.readUInt16BE(i * 2);
    }

    return newValuesBuffer;
  },
};

module.exports = { registers };
