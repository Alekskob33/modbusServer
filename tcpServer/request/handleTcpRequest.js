const requestRouter = require('./requestRouter.js');
const tcpRequestParser = require('./tcpRequestParser.js');

function handleTcpRequest(buffer) {
  const { fnCode } = tcpRequestParser.getParams(buffer);
  return requestRouter[fnCode](buffer, tcpRequestParser);
}

module.exports = handleTcpRequest;
