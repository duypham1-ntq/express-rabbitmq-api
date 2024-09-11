// app.js
const express = require('express');
const bodyParser = require('body-parser');
const rabbitRouter = require('./routes/rabbitRoute');
const { createChannel } = require('./rabbitmq/rabbitConnection');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/api', rabbitRouter);

// Khởi động ứng dụng và kết nối RabbitMQ
app.listen(port, async () => {
  try {
    await createChannel();
    console.log(`Server running on http://localhost:${port}`);
  } catch (error) {
    console.error('Error while starting the server:', error);
    process.exit(1);
  }
});
