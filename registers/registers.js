const ModbusError = require('../modbusErrors/ModbusError.js');
const {
  bigEndianBufferFrom16Array,
} = require('../tcpServer/libs/serialize.js');
const DO_readValues = require('./DO_readValues.js');
const { DO_setValues } = require('./DO_setValues.js');
const { setBit } = require('./utils.js');

const registers = {
  DO: new Uint8Array(250),
  DI: new Uint8Array(250),
  AO: new Uint16Array(250),
  AI: new Uint16Array(250),

  get(memorySector, { buffer, parser }) {
    const { fnCode, startAddr, quantity } = parser.getParams(buffer);

    // Read DO/DI
    if (fnCode <= 2) {
      return DO_readValues(buffer, parser, this[memorySector]);
    }

    const endAddr = startAddr + quantity;

    // Read AO/AI
    const valuesArray = this[memorySector].subarray(startAddr, endAddr);
    const valuesBuffer = bigEndianBufferFrom16Array(valuesArray);
    return valuesBuffer;
  },

  set(memorySector, { buffer, parser }) {
    const { startAddr, fnCode, newValue } = parser.getParams(buffer);

    // Set DO
    if (fnCode === 0x05) {
      const startByteIndex = Math.floor(startAddr / 8);
      const startBitIndex = startAddr % 8;
      const byte = this.DO[startByteIndex];

      if (newValue !== 0) {
        this[memorySector][startByteIndex] = setBit(byte, startBitIndex);
      }
      return Buffer.from([newValue]);
    }
    // Set AO
    this[memorySector][startAddr] = newValue;
    return Buffer.from([newValue]);
  },

  setMultiple(memorySector, { buffer, parser }) {
    const { fnCode, startAddr, quantity, newValues } = parser.getParams(buffer);
    const endAddr = startAddr + quantity;
    const registersArray = this[memorySector].subarray(startAddr, endAddr);

    // Set multiple DO
    if (fnCode === 0x0f) {
      return DO_setValues(buffer, parser, this[memorySector]);
    }
    // Set multiple AO
    for (let i = 0; i < registersArray.length; i++) {
      registersArray[i] = newValues.readUInt16BE(i * 2);
    }

    return newValues;
  },
};

module.exports = { registers };
