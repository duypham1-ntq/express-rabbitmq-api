// rabbitController.js
const { sendRPCRequest } = require('../services/rabbitService');

async function listViewRequest(req, res) {
  try {
    const { event, data } = req.body;
    
    if (!event) {
      return res.status(400).json({ error: 'Event is required' });
    }

    const result = await sendRPCRequest(event, data);
    return res.status(200).json({ result });
  } catch (error) {
    console.log({error})
    return res.status(500).json({ error: 'Failed to process RabbitMQ request', error });
  }
}

module.exports = { listViewRequest };
