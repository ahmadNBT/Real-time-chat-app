import amqp from 'amqplib';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export const startSendOtpComsumer = async () => {
    try {
        const connection = await amqp.connect({
            protocol: 'amqp',
            hostname: process.env.RABBITMQ_HOST || 'localhost',
            port: parseInt(process.env.RABBITMQ_PORT || '5672', 10),
            username: process.env.RABBITMQ_USER || 'guest',
            password: process.env.RABBITMQ_PASSWORD || 'guest'
        });

        const channel = await connection.createChannel();
        const queue = 'send_otp';
        await channel.assertQueue(queue, { durable: true });

        console.log('✅ mail Service consumer start, lisening for otp emails', queue);

        channel.consume(queue, async (msg) => {

            if (msg !== null) {
                const messageContent = msg.content.toString();
                const { to, subject, text } = JSON.parse(messageContent);
                const transporter = nodemailer.createTransport({
                    host: 'smtp.gmail.com',
                    port: 587,
                    secure: false,
                    auth: {
                        user: process.env.EMAIL_USER,
                        pass: process.env.EMAIL_PASSWORD
                    }
                });

                await transporter.sendMail({
                    from: "Chat App <",
                    to,
                    subject,
                    text
                });
                
                console.log("OTP email sent to:", to);
                channel.ack(msg);
            }   

        });

    } catch (error) {
        console.error('Failed to start to RabbitMQ consumer', error);
        throw error;
    }
}