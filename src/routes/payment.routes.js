const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const paymentController = require('../controllers/payment.controller');
const { authenticate } = require('../middleware/auth');
const validate = require('../middleware/validate');

// All routes require authentication
router.use(authenticate);

// Orders
router.post('/orders',
  [
    body('courseId').isMongoId(),
    body('paymentProvider').optional().isIn(['stripe', 'telebirr', 'apple_pay'])
  ],
  validate,
  paymentController.createOrder
);

router.get('/orders', paymentController.getUserOrders);

// Subscriptions
router.post('/subscriptions',
  [
    body('packageId').isMongoId(),
    body('paymentProvider').optional().isIn(['stripe', 'telebirr', 'apple_pay'])
  ],
  validate,
  paymentController.createSubscription
);

router.get('/subscriptions', paymentController.getUserSubscriptions);
router.post('/subscriptions/:id/cancel', paymentController.cancelSubscription);
router.post('/subscriptions/:id/pause', paymentController.pauseSubscription);
router.post('/subscriptions/:id/resume', paymentController.resumeSubscription);

module.exports = router;
