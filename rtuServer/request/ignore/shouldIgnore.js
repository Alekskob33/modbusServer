const { checkSlaveId, checkByCRC } = require('./filters.js');

function shouldIgnore(request) {
  const filters = [checkSlaveId, checkByCRC];
  const results = filters.map((fn) => fn(request));

  return results.some((result) => result !== true);
}

module.exports = shouldIgnore;
