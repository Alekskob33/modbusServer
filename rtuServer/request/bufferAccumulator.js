class RtuRequestBuffer {
  _frame = null;
  completed = false;

  get frame() {
    if (this.completed) {
      const buffer = Buffer.from(this._frame); // copy
      this.reset();
      return buffer;
    }
  }

  add(chunk) {
    if (!this._frame) {
      this._frame = Buffer.alloc(0);
    }

    this._frame = Buffer.concat([this._frame, chunk]);

    if (this.checkComplete) {
      this.completed = true;
    }
    return this;
  }

  get checkComplete() {
    const minLength = 8;
    // No frame less than 8bits
    if (this._frame.length < minLength) return false;

    // Is complete for 1-6 fnCode
    const fnCode = this._frame[1];
    if (fnCode <= 6) return true;

    // Check for 15-16 fnCode
    const bytesCount = this._frame[6];
    const expectedLength = 7 + bytesCount + 2;
    if (fnCode === 15 || fnCode === 16) {
      return this._frame.length >= expectedLength;
    }

    // Not supported fnCode
    return true;
  }

  reset() {
    this._frame = null;
    this.completed = false;
  }
}

module.exports = { RtuRequestBuffer };
