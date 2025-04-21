const handleSocketEvents = require('../../rtuServer/events/handleEvents.js');

function handleTcpEvents(socket, chunksAccumulator) {
  handleSocketEvents(socket, chunksAccumulator);
}

module.exports = handleTcpEvents;
