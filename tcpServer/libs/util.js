function bufferToString(buffer) {
  let str = buffer.toString('hex').match(/.{2}/g).join(' ');
  return `[Buffer: ${str}]`;
}

module.exports = bufferToString;
