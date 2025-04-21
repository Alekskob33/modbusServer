const tcpRequestParser = {
  fnCode(buffer) {
    return buffer.readUInt8(7);
  },
  getParams(buffer) {
    if (this.fnCode(buffer) <= 4) return this._getReadParams(buffer);
    if (this.fnCode(buffer) <= 6) return this._getWriteParams(buffer);
    if (this.fnCode(buffer) <= 16) return this._getMultipleWriteParams(buffer);
  },

  _getReadParams(buffer) {
    return {
      startAddr: buffer.readUInt16BE(8),
      quantity: buffer.readUInt16BE(10),
    };
  },
  _getWriteParams(buffer) {
    return {
      startAddr: buffer.readUInt16BE(8),
      newValue: buffer.readUInt16BE(10),
    };
  },
  _getMultipleWriteParams(buffer) {
    return {
      startAddr: buffer.readUInt16BE(8),
      quantity: buffer.readUInt16BE(10),
      newValuesBuffer: buffer.slice(13),
    };
  },
};

module.exports = tcpRequestParser;
