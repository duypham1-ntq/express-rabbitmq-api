// rabbitConnection.js
const amqp = require('amqplib');

let channel = null;

async function createChannel() {
  try {
    const connection = await amqp.connect('amqps://TEST1234:3b43504f-9454-4240-422f-4612d73b651c@rabbit.zazzi.app:5671/');
    channel = await connection.createChannel();
    console.log('RabbitMQ connected!');
  } catch (error) {
    console.error('Failed to connect to RabbitMQ:', error);
    throw error;
  }
}

function getChannel() {
  if (!channel) {
    throw new Error('RabbitMQ channel is not created');
  }
  return channel;
}

module.exports = { createChannel, getChannel };
