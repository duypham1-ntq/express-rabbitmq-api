// rabbitService.js
const { getChannel } = require('../rabbitmq/rabbitConnection');
const { v4: uuidv4 } = require('uuid');
const { rabbitMQ } = require('../config/config');

async function sendRPCRequest(event, data) {
  const channel = getChannel();
  
  const correlationId = uuidv4();
  const responseQueue = await channel.assertQueue(event, { exclusive: true });
  return new Promise((resolve, reject) => {
    channel.consume(
      responseQueue.queue,
      (msg) => {
        console.log({msg})
        if (msg.properties.correlationId === correlationId) {
          // console.log('DATA', msg.content.toString())
          console.log({msg111: msg.content.toString()})
          resolve(msg.content.toString());
        }
      },
      { noAck: true }
    );
    // console.log({event})
    // const exchange = 'my_exchange';
       // Publish message with routing key
      //  channel.publish(correlationId, event, Buffer.from(JSON.stringify(data)), {
      //   persistent: true // Optional: makes sure the message is persistent
      // });
    channel.sendToQueue(
      event,
      Buffer.from(JSON.stringify(data)),
      { correlationId: correlationId, replyTo: responseQueue.queue },
      event
    );
  });
}
module.exports = { sendRPCRequest };
