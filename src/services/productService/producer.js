const {createConnection} = require('../../common/rabbitmq');

async function sendProductAddedEvent(product){
    const channel = await createConnection();
    const exchange = 'product_exchange';
    const message = JSON.stringify(product);

    channel.publish(exchange, 'product.added', Buffer.from(message));
    console.log('Product added event sent: ',product);

}

module.exports = {sendProductAddedEvent};
