const rtuRequestParser = {
  getParams(buffer) {
    return this._parse(buffer);
  },

  _parse(buffer) {
    const details = {
      slaveId: buffer[0],
      fnCode: buffer[1],
      startAddr: buffer.readUInt16BE(2),
      crc: buffer.slice(-2).readUInt16BE(0),
    };

    if (details.fnCode < 5) {
      details.quantity = buffer.readUInt16BE(4);
    }

    if (details.fnCode === 5 || details.fnCode === 6) {
      details.newValue = buffer.readUInt16BE(4);
    }

    if (details.fnCode === 15 || details.fnCode === 16) {
      details.quantity = buffer.readUInt16BE(4);
      details.newValues = buffer.slice(7, -2);
      details.bytesCount = buffer.readUInt8(5);
    }

    return details;
  },
};

module.exports = rtuRequestParser;
