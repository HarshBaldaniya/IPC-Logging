import { createServer, Socket } from 'net';
import * as fs from 'fs';
import * as path from 'path';

const logFilePath = path.resolve(__dirname, 'application.log');
const server = createServer((socket: Socket) => {
    socket.on('data', (data: Buffer) => {
        const message = data.toString();
        fs.appendFileSync(logFilePath, message + '\n', 'utf8');
        console.log('Logged:', message);
    });

    socket.on('error', (err: Error) => {
        console.error('Socket error:', err);
    });
});

server.listen(4000, () => {
    console.log('LoggingService listening on port 4000\n');
});
