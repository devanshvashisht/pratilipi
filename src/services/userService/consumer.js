const {createConnection, setupExchangesAndQueues} = require('../../common/rabbitmq');

async function startUserConsumer() {
    const channel = await createConnection();
    const { userMainQueue  } = await setupExchangesAndQueues(channel);


    channel.consume(userMainQueue,async (msg) => {
        const messageContent = JSON.parse(msg.content.toString());
        try {
            console.log('Processing user:', messageContent);

            await new Promise((resolve) => setTimeout(resolve, 15000));
            // Simulate failure for testing
            
            if (messageContent.userId % 2 === 0) {
                throw new Error('Simulated failure');
            }

            console.log('User processed successfully:', messageContent);
            channel.ack(msg);
        } catch (error) {
            console.error('Processing failed:', error);
            
            channel.nack(msg, false, false); // Move to DLQ on failure
        }
    });


}

module.exports = { startUserConsumer };