const {
  DO_rangeIndexes,
  getHighRanks,
  getLowRanks,
  bitView,
} = require('./utils.js');

function DO_readValues(requestBuffer, parser, DO_store) {
  const { startAddr, quantity } = parser.getParams(requestBuffer);
  const { startByteIndex, startBitIndex, endByteIndex, endBitIndex } =
    DO_rangeIndexes(startAddr, quantity);
  const DO_slice = DO_store.slice(startByteIndex, endByteIndex + 1);
  const valuesBuffer = Buffer.alloc(Math.ceil(quantity / 8));

  valuesBuffer.forEach((byte, index, arr) => {
    let low,
      high = 0;
    low = getHighRanks(DO_slice[index], startBitIndex) >> startBitIndex;
    if (index === arr.length - 1) {
      low = ((low << (7 - endBitIndex)) & 0xff) >> (7 - endBitIndex);
    }
    const shift = 8 - startBitIndex;
    high = getLowRanks(DO_slice[index + 1], shift) << shift;
    valuesBuffer[index] = high | low;
  });
  return valuesBuffer;
}

module.exports = DO_readValues;
