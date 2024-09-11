// rabbitRoute.js
const express = require('express');
const { listViewRequest } = require('../controllers/rabbitController');

const router = express.Router();

router.post('/sendEvent', listViewRequest);

module.exports = router;
