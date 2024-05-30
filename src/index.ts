import { fork } from 'child_process';
import * as path from 'path';
import * as net from 'net';

// Function to check if the logging service is up
function waitForLoggingService(port: number, timeout: number): Promise<void> {
    return new Promise((resolve, reject) => {
        const start = Date.now();

        const check = () => {
            const socket = new net.Socket();

            socket.on('connect', () => {
                socket.end();
                resolve();
            });

            socket.on('error', (err) => {
                if (Date.now() - start >= timeout) {
                    reject(new Error('Timeout while waiting for LoggingService'));
                } else {
                    setTimeout(check, 100);
                }
            });

            socket.connect(port, '127.0.0.1');
        };

        check();
    });
}

// Start LoggingService
const loggingService = fork(path.resolve(__dirname, 'loggingService.ts'));

loggingService.on('exit', (code) => {
    console.log(`LoggingService exited with code ${code}`);
});

// Wait for LoggingService to be ready
waitForLoggingService(4000, 5000)
    .then(() => {
        console.log('LoggingService is ready. Starting other services...\n');

        // Start OrderService
        const orderService = fork(path.resolve(__dirname, 'orderService.ts'));
        orderService.on('message', (message) => {
            console.log('OrderService:', message);
        });
        orderService.on('exit', (code) => {
            console.log(`OrderService exited with code ${code}`);
        });

        // Start PaymentService
        const paymentService = fork(path.resolve(__dirname, 'paymentService.ts'));
        paymentService.on('message', (message) => {
            console.log('PaymentService:', message);
        });
        paymentService.on('exit', (code) => {
            console.log(`PaymentService exited with code ${code}`);
        });

    })
    .catch((err) => {
        console.error(err.message);
        process.exit(1);
    });
