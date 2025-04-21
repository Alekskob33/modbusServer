# Modbus TCP/RTU Server

## Implemented

- Modbus TCP server
- Modbus RTU server (over TCP)
- HTTP Server (to monitor logs)
- TCP/RTU clients (parallel requests)

## TCP/RTU Server core Features

- Setup file
- Registers state initialization
- Registers backup
- Write logs in file/console

## Others

- Send standard Modbus error-codes: 01, 02, 03
- Ignore RTU request by: slave-Id, timeout, CRC
