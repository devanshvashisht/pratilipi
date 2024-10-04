const {createConnection, setupExchangesAndQueues} = require('../../common/rabbitmq');

async function startProductConsumer() {
    const channel = await createConnection();
    const { mainQueue } = await setupExchangesAndQueues(channel);


    channel.consume(mainQueue, async (msg) => {
        const messageContent = JSON.parse(msg.content.toString());
        try {
            console.log('Processing product:', messageContent);

            await new Promise((resolve) => setTimeout(resolve, 10000));
            // Simulate failure for testing
            if (messageContent.productId % 2 === 0) {
                throw new Error('Simulated failure');
            }

            console.log('Product processed successfully:', messageContent);
            channel.ack(msg);
        } catch (error) {
            console.error('Processing failed:', error);
            console.log('Devansh');
            channel.nack(msg, false, false); // Move to DLQ on failure
        }
    });


}

module.exports = { startProductConsumer };