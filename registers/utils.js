// Узнаем адреса регистров для изменения
function DO_rangeIndexes(startAddr, quantity) {
  const startByteIndex = Math.floor(startAddr / 8);
  const startBitIndex = startAddr % 8; // from 0
  const endByteIndex = Math.floor((startAddr + quantity) / 8);
  const endBitIndex = ((startAddr + quantity) % 8) - 1; // from 0

  return {
    startByteIndex,
    startBitIndex,
    endByteIndex,
    endBitIndex,
  };
}

function getHighRanks(byte, startIndex) {
  return ((byte >> startIndex) & 0xff) << startIndex;
}
function getLowRanks(byte, startIndex) {
  return ((byte << startIndex) & 0xff) >> startIndex;
}

function bitView(byte) {
  return byte.toString(2).padStart(8, '0');
}

function setBit(byte, position) {
  return byte | (1 << position);
}

module.exports = {
  DO_rangeIndexes,
  getHighRanks,
  getLowRanks,
  bitView,
  setBit,
};
