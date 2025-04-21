const {
  RtuRequestBuffer,
} = require('../../rtuServer/request/bufferAccumulator.js');

class TcpRequestBuffer extends RtuRequestBuffer {
  get checkComplete() {
    const realLength = this._frame.length;
    const expectedLength = 6 + this._frame.readUInt16BE(4);
    return expectedLength === realLength;
  }
}

module.exports = { TcpRequestBuffer };
