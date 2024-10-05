const amqp = require('amqplib');

const RABBITMQ_URL = process.env.RABBITMQ_URL;

let connection, channel;

//function to create connection
async function createConnection() {
    if (!connection) {
        try {
            connection = await amqp.connect(RABBITMQ_URL);
            channel = await connection.createChannel();
            console.log('RabbitMQ connected');
        } catch (error) {
            console.error('Error connecting to RabbitMQ:', error);
            throw error; 
        }
    }
    return channel;
}

//function to close connection
async function closeConnection() {
    if (connection) {
        await channel.close();
        await connection.close();
        console.log('RabbitMQ connection closed');
    }

    
}

async function setupExchangesAndQueues() {
    const channel = await createConnection();

    // Product queues and exchanges
    const productExchange = 'product_exchange';
    const productDlxExchange = 'product_dlx_exchange';
    const productMainQueue = 'product_queue';
    const productDlq = 'product_dlq';

    // User queues and exchanges
    const userExchange = 'user_exchange';
    const userDlxExchange = 'user_dlx_exchange';
    const userMainQueue = 'user_queue';
    const userDlq = 'user_dlq';

    try {
        // Set up Product Exchange and Queues
        await channel.assertExchange(productExchange, 'direct', { durable: true });
        await channel.assertQueue(productMainQueue, {
            durable: true,
            arguments: {
                'x-dead-letter-exchange': productDlxExchange,
                'x-message-ttl': 10000, // Message TTL before moved to DLQ
            },
        });

        // Declare dead-letter exchange and queue for Product
        await channel.assertExchange(productDlxExchange, 'direct', { durable: true });
        await channel.assertQueue(productDlq, { durable: true });

        // Bind Product Queues
        await channel.bindQueue(productMainQueue, productExchange, 'product.added');
        await channel.bindQueue(productDlq, productDlxExchange, 'dead.product.added');

        // Set up User Exchange and Queues
        await channel.assertExchange(userExchange, 'direct', { durable: true });
        await channel.assertQueue(userMainQueue, {
            durable: true,
            arguments: {
                'x-dead-letter-exchange': userDlxExchange,
                'x-message-ttl': 10000, // Message TTL before moved to DLQ
            },
        });

        // Declare dead-letter exchange and queue for User
        await channel.assertExchange(userDlxExchange, 'direct', { durable: true });
        await channel.assertQueue(userDlq, { durable: true });

        // Bind User Queues
        await channel.bindQueue(userMainQueue, userExchange, 'user.registered');
        await channel.bindQueue(userDlq, userDlxExchange, 'dead.user.registered');

        console.log('Exchanges and Queues set up successfully');
        return { productMainQueue, productDlq, userMainQueue, userDlq };
    } catch (error) {
        console.error('Error setting up RabbitMQ queues and exchanges:', error);
        throw error;
    }
}

module.exports = {
    createConnection,
    setupExchangesAndQueues,
    closeConnection,
};
