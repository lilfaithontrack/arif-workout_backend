const express = require('express');
const router = express.Router();
const badgeController = require('../controllers/badge.controller');
const { authenticate, requireAdmin } = require('../middleware/auth');

// Public routes
router.get('/', badgeController.getAllBadges);
router.get('/:id', badgeController.getBadgeById);

// Admin routes (protected)
router.use(authenticate, requireAdmin);

router.get('/admin/all', badgeController.getBadgesAdmin);
router.post('/admin', badgeController.createBadge);
router.put('/admin/:id', badgeController.updateBadge);
router.delete('/admin/:id', badgeController.deleteBadge);

module.exports = router;

