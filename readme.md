# Modbus TCP/RTU Server

### Implemented

- Modbus TCP server
- Modbus RTU server (over TCP)
- HTTP Server (to monitor logs)
- TCP/RTU clients (to send requests)

### TCP/RTU Server Features

- Setup file
- Registers state initialization
- Registers backup
- Write logs in file/console

### Not realized

- Standard modbus error-code
- 8-bits frame: 1-bit per DO/DI address (now UInt16BE)
