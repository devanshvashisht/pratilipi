const { createConnection, setupExchangesAndQueues } = require('./rabbitmq');


async function startDLQHandler() {
    const { dlq } = await setupExchangesAndQueues();


    try{
        // Create a connection to the RabbitMQ server
        const channel = await createConnection();

        // Start consuming messages from the DLQ
        channel.consume(dlq, async (msg) => {
            if (msg) {
                const messageContent = JSON.parse(msg.content.toString());
                console.log('Message in DLQ:', messageContent);

                
                // Acknowledge the message after processing
                channel.ack(msg);
            }
        }, { noAck: false });

        console.log('DLQ handler started successfully');

    }catch(error){
        console.error('Error starting DLQ handler:', error);
    }
    
}



module.exports = {startDLQHandler};
