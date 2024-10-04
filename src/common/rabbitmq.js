const amqp = require('amqplib');

const RABBITMQ_URL = process.env.RABBITMQ_URL;

let connection , channel ;

async function createConnection() {
    if(!connection){
        connection = await amqp.connect(RABBITMQ_URL);
        channel = await connection.createChannel();
        console.log('RabbitMQ connected');

    }

    return channel;
}

async function setupExchangesAndQueues() {
    const channel = await createConnection();
    const exchange = 'product_exchange';
    const dlxExchange = 'product_dlx_exchange';
    const mainQueue = 'product_queue';
    const dlq = 'product_dlq';
    try{
        await channel.assertExchange(exchange, 'direct', { durable: true });
        await channel.assertQueue(mainQueue, {
            durable: true,
            arguments: {
                'x-dead-letter-exchange': dlxExchange,
                'x-message-ttl': 10000, 
                
            },
        });


        // Declare dead-letter exchange and queue
        await channel.assertExchange(dlxExchange, 'direct', { durable: true });
        await channel.assertQueue(dlq, { durable: true });

        // Bind queues
        await channel.bindQueue(mainQueue, exchange, 'product.added');
        await channel.bindQueue(dlq, dlxExchange, 'dead.product.added');


        console.log('Exchanges and Queues set up successfully');
        return { mainQueue, dlq };
    }catch(error){
        console.error('Error setting up RabbitMQ queues and exchanges:', error);
        throw error;
    }
    
    
}

module.exports = {
    createConnection,
    setupExchangesAndQueues,
};