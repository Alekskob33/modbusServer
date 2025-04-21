const tcpRequestParser = {
  getParams(buffer) {
    return this._parse(buffer);
  },

  _parse(buffer) {
    const details = {
      fnCode: buffer.readUInt8(7),
      startAddr: buffer.readUInt16BE(8),
    };

    if (details.fnCode < 5) {
      details.quantity = buffer.readUInt16BE(10);
    }

    if (details.fnCode === 5 || details.fnCode === 6) {
      details.newValue = buffer.readUInt16BE(10);
    }

    if (details.fnCode === 15 || details.fnCode === 16) {
      details.quantity = buffer.readUInt16BE(10);
      details.newValues = buffer.slice(13);
      details.bytesCount = buffer.readUInt8(12);
    }

    return details;
  },
};

module.exports = tcpRequestParser;
