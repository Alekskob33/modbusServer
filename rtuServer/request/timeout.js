const setupObj = require('../../setup.json');
const logger = require('../../log/logger.js');

const frameTimeout = {
  timeout: setupObj.rtu.frameTimeout || 500, // Default timeout for RTU frame in milliseconds
  timerId: null,
  _finished: false,

  start() {
    this._finished = false;

    this.timerId = setTimeout(() => {
      this._finished = true;
    }, this.timeout);
    return this.timerId;
  },

  restart() {
    clearTimeout(this.timerId);
    this.timerId = this.start();
  },

  get finished() {
    const hasFinished = this._finished;
    this.restart();
    return hasFinished;
  },
};

module.exports = frameTimeout;
