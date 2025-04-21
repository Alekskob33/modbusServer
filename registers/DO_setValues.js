const {
  DO_rangeIndexes,
  getHighRanks,
  getLowRanks,
  bitView,
  setBit,
} = require('./utils.js');

function DO_setValues(requestBuffer, requestParser, DO_store) {
  const { newValues, fnCode, startAddr, quantity } =
    requestParser.getParams(requestBuffer);
  const { startByteIndex, startBitIndex, endByteIndex, endBitIndex } =
    DO_rangeIndexes(startAddr, quantity);

  for (let i = startByteIndex; i <= endByteIndex; i++) {
    const currentValue = DO_store[i];
    const newValue = newValues[i];
    let currentLowRank, newHighRank;
    // TODO: could I simplify this? similar to "DO_readValues"
    if (i === 0) {
      currentLowRank = getLowRanks(currentValue, startBitIndex);
      newHighRank = getLowRanks(newValue, startBitIndex) << startBitIndex;
    }
    if (i > 0 && i < endByteIndex) {
      const lowRankShift = 8 - startBitIndex;
      const prevValuesBuffer = newValues[i - 1];
      const newLowRank =
        getHighRanks(prevValuesBuffer, lowRankShift) >> lowRankShift;

      newHighRank = (getLowRanks(newValue, 0) << startBitIndex) & 0xff;
      currentLowRank = newLowRank;
    }
    if (i === endByteIndex) {
      const lowRankShift = 8 - startBitIndex;
      const prevValuesBuffer = newValues[i - 1];
      const newLowRank =
        getHighRanks(prevValuesBuffer, lowRankShift) >> lowRankShift;

      newHighRank = getLowRanks(newValue, endBitIndex) << startBitIndex;

      const currentHighRank = getHighRanks(currentValue, endBitIndex);

      newHighRank = newHighRank | currentHighRank;
      currentLowRank = newLowRank;
    }

    // Write byte value
    DO_store[i] = newHighRank | currentLowRank;
  }
  return newValues;
}

module.exports = { DO_setValues };
