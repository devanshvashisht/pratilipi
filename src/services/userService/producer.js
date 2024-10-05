const {createConnection} = require('../../common/rabbitmq');

async function sendUserAddedEvent(user){
    const channel = await createConnection();
    const exchange = 'user_exchange';
    const message = JSON.stringify(user);

    await channel.assertExchange(exchange, 'direct', { durable: true });


    channel.publish(exchange, 'user.added', Buffer.from(message));
    console.log('User added event sent: ',user);

}

module.exports = {sendUserAddedEvent};
