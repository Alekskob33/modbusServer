const net = require('net');
const setupObj = require('../setup.json');

class ModbusClient {
  socket = new net.Socket();

  constructor(clientType = 'TCP') {
    this.clientType = clientType.toUpperCase();
    this.handleEvents();

    const rtuPort = setupObj.rtu.port;
    const tcpPort = setupObj.tcp.port;
    const port = this.clientType === 'TCP' ? tcpPort : rtuPort;
    const commonHost = setupObj.tcp.host;

    this.socket.connect(port, commonHost, () => {
      console.log(`[${this.clientType} CLIENT] Подключен к серверу`);
    });
  }

  send(request) {
    this.socket.write(request, (err) => {
      if (err) console.error(err);
    });
  }

  handleEvents() {
    this.socket.on('data', (data) => {
      console.log(`[${this.clientType} CLIENT] Ответ сервера:`, data);
      this.socket.destroy();
    });

    this.socket.on('close', () => {
      console.log(`[${this.clientType} CLIENT] Соединение закрыто`);
    });

    this.socket.on('error', (err) => {
      console.error(`[${this.clientType} CLIENT] Ошибка: ${err.message}`);
    });
  }
}

module.exports = { ModbusClient };
