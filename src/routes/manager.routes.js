const express = require('express');
const router = express.Router();
const managerController = require('../controllers/manager.controller');
const { authenticate } = require('../middleware/auth');
const { requireManager } = require('../middleware/roles');

// All routes require manager authentication
router.use(authenticate);
router.use(requireManager);

// Dashboard
router.get('/dashboard', managerController.getDashboardStats);

// Users
router.get('/users', managerController.getUsers);
router.get('/users/:id', managerController.getUserDetails);

// Orders
router.get('/orders', managerController.getOrders);
router.get('/orders/:id', managerController.getOrderDetails);
router.patch('/orders/:id/status', managerController.updateOrderStatus);

// Subscriptions
router.get('/subscriptions', managerController.getSubscriptions);
router.get('/subscriptions/:id', managerController.getSubscriptionDetails);

// Payments
router.get('/payments', managerController.getPayments);

module.exports = router;
