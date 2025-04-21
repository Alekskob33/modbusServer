function formatMsg(status, msg) {
  const time = new Date().toISOString();
  return `[${time}] [${status.toUpperCase()}] ${msg}`;
}

module.exports = formatMsg;
