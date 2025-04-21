// Convert to "Big Endian" bytes-order
function bigEndianBufferFrom16Array(numbersArray) {
  const outputBuffer = Buffer.alloc(numbersArray.length * 2);

  numbersArray.forEach((number, i) => {
    outputBuffer.writeUInt16BE(number, i * 2);
  });

  return outputBuffer;
}

module.exports = { bigEndianBufferFrom16Array };
