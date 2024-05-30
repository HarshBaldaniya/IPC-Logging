import { createConnection, Socket } from 'net';

const client: Socket = createConnection({ port: 4000 }, () => {
    // Simulate logging messages
    client.write('OrderService: New order received\n');
    client.write('OrderService: Order processing started\n');
    client.write('OrderService: Order processing completed\n');
});

client.on('error', (err: Error) => {
    console.error('Connection error:', err);
});
