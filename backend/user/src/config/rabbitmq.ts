import amqp from 'amqplib';

let channel: amqp.Channel;

export const connectRabbitMQ = async () => {
    try {
        const connection = await amqp.connect({
            protocol: 'amqp',
            hostname: process.env.RABBITMQ_HOST || 'localhost',
            port: parseInt(process.env.RABBITMQ_PORT || '5672', 10),
            username: process.env.RABBITMQ_USER || 'guest',
            password: process.env.RABBITMQ_PASSWORD || 'guest'
        });
        channel = await connection.createChannel();
        console.log('✅ Connected to RabbitMQ');
    } catch (error) {
        console.error('Failed to connect to RabbitMQ', error);
        throw error;
    }
};

export const publishToQueue = async (queue: string, message: string) => {
    if (!channel) {
        throw new Error('RabbitMQ channel is not established. Call connectRabbitMQ first.');
    }
    await channel.assertQueue(queue, { durable: true });
    channel.sendToQueue(queue, Buffer.from(message), { persistent: true });
    console.log(`Message sent to queue ${queue}: ${message}`);
};
