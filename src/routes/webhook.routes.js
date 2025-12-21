const express = require('express');
const router = express.Router();
const webhookController = require('../controllers/webhook.controller');

// Webhook routes (no authentication, verified by signature)
router.post('/stripe', express.raw({ type: 'application/json' }), webhookController.stripeWebhook);
router.post('/telebirr', webhookController.telebirrWebhook);
router.post('/apple-pay', webhookController.applePayWebhook);

module.exports = router;
