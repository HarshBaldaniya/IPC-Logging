import { createConnection, Socket } from 'net';

const client: Socket = createConnection({ port: 4000 }, () => {
    // Simulate logging messages
    client.write('PaymentService: Payment initiated\n');
    client.write('PaymentService: Payment processed\n');
    client.write('PaymentService: Payment completed\n');
});

client.on('error', (err: Error) => {
    console.error('Connection error:', err);
});
