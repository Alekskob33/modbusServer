const bufferAccumulator = {
  accBuffer: null,

  accumulate(buffer) {
    if (this.accBuffer) {
      this.accBuffer = Buffer.concat([this.accBuffer, buffer]);
    } else {
      this.accBuffer = buffer;
    }
    if (this.isComplete()) {
      const bufferCopy = this.accBuffer.slice();
      this.resetAccumulator();

      return bufferCopy;
    }
  },

  isComplete() {
    const realLength = this.accBuffer.length;
    const expectedLength = 6 + this.accBuffer.readUInt16BE(4); // actual for modbus TCP
    return expectedLength === realLength;
  },

  resetAccumulator() {
    this.accBuffer = Buffer.alloc(0);
  },
};

module.exports = bufferAccumulator;
