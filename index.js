const amqp = require('amqplib/callback_api');
const crypto = require('crypto');

// Device and connection details
const deviceId = 'PATTEST2';
const password = '15ef3fcc-6ec1-4878-4ca8-a2115e5744ca';
const userId = 42589;
const exchange = 'responses';

// Generate a queue name similar to the PHP version
const queueName = `${deviceId}.strict_config.${Date.now() / 1000}`;

const queueNames = [
  deviceId + ".strict_config.1725909254.313309",
  deviceId + ".strict_maintenanceAlert.1725909254.315261",
  deviceId + ".common.1725909254.316822",
  deviceId + ".profile_updates.1725909254.319762"
];

// SSL connection options (turning off peer verification as in the PHP code)
const sslOptions = {
  cert: null,
  key: null,
  passphrase: null,
  ca: null,
  rejectUnauthorized: false,  // Similar to 'verify_peer' => false in PHP
};

// Connect to RabbitMQ
amqp.connect({
  protocol: 'amqps',
  hostname: 'rabbit.zazzi.app',
  port: 5671,
  username: deviceId,
  password: password,
  vhost: '/',
  ...sslOptions,
}, (err, connection) => {
  if (err) {
    throw err;
  }

  connection.createChannel((err, channel) => {
    if (err) {
      throw err;
    }

    // Declare the queue
    channel.assertQueue(queueName, {
      durable: true
    });

    // Define the routing key
    const routingKey = `${deviceId}.*`;
    channel.bindQueue(queueName, exchange, '*');
    console.log('Routing Key:', routingKey);

    // Define the message processing function
    const handleResponseMessage = (message) => {
      console.log('\n--------\n');
      console.log('message', message)
      console.log(message.content.toString());
      console.log('\n--------\n');

      // Acknowledge the message
      channel.ack(message);

      // If the message body is 'quit', cancel the consumer
      if (message.content.toString() === 'quit') {
        channel.cancel(message.fields.consumerTag);
      }
    };

    // Consume messages from the queue
    channel.consume(queueName, handleResponseMessage, {
      noAck: false
    });

    // Function to generate UUID v4 (for requestID)
    const uuidv4 = () => {
      return crypto.randomUUID();
    };

    // Data to be sent as message :event appstart
    const data = {
      appVersion: '1.1.5',
      queues: queueNames,
      deviceID: deviceId,
      requestID: uuidv4(),
    };
    // Event profileView
    // const data = {
    //   userID: '478',
    //   requestID: uuidv4(),
    // };

    console.log(data);

    // Publish the message to the 'events' exchange
    const msg = JSON.stringify(data);

    channel.publish('events', 'appstart', Buffer.from(msg));
    console.log("Message sent to 'events' exchange");
  });
});
