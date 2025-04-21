const getResponseOnRead = (requestBuffer, registersValueBuffer) => {
  const header = requestBuffer.slice(0, 7);
  const fnCode = requestBuffer.readUInt8(7);
  const valuesLength = registersValueBuffer.length;
  const PDU = Buffer.concat([
    Buffer.from([fnCode, valuesLength]),
    registersValueBuffer,
  ]);
  const lengthFromUnitId = PDU.length + 1;
  header.writeUInt16BE(lengthFromUnitId, 4); // actual 'length' in header

  const result = Buffer.concat([header, PDU]);
  return result;
};

const getResponseOnWriteMultiple = (requestBuffer) => {
  const responseBuffer = requestBuffer.slice(0, 13);
  responseBuffer.writeUInt16BE(6, 4); // actual 'length' in header

  return responseBuffer;
};

module.exports = {
  getResponseOnRead,
  getResponseOnWriteMultiple,
};
