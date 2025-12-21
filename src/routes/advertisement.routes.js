const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const advertisementController = require('../controllers/advertisement.controller');
const { authenticate, requireRole } = require('../middleware/auth');
const validate = require('../middleware/validate');

/**
 * @route   GET /api/advertisements/active
 * @desc    Get active advertisements for public display
 * @access  Public
 */
router.get('/active', advertisementController.getActiveAds);

/**
 * @route   POST /api/advertisements/:id/impression
 * @desc    Track advertisement impression
 * @access  Public
 */
router.post('/:id/impression', advertisementController.trackImpression);

/**
 * @route   POST /api/advertisements/:id/click
 * @desc    Track advertisement click
 * @access  Public
 */
router.post('/:id/click', advertisementController.trackClick);

/**
 * @route   POST /api/advertisements/:id/conversion
 * @desc    Track advertisement conversion
 * @access  Public
 */
router.post('/:id/conversion', advertisementController.trackConversion);

/**
 * @route   GET /api/advertisements
 * @desc    Get all advertisements with filters (Admin only)
 * @access  Private (Admin)
 */
router.get(
  '/',
  authenticate,
  requireRole('admin'),
  advertisementController.getAdvertisements
);

/**
 * @route   GET /api/advertisements/statistics
 * @desc    Get advertisement statistics (Admin only)
 * @access  Private (Admin)
 */
router.get(
  '/statistics',
  authenticate,
  requireRole('admin'),
  advertisementController.getStatistics
);

/**
 * @route   GET /api/advertisements/:id
 * @desc    Get single advertisement by ID
 * @access  Private (Admin)
 */
router.get(
  '/:id',
  authenticate,
  requireRole('admin'),
  advertisementController.getAdvertisement
);

/**
 * @route   GET /api/advertisements/:id/analytics
 * @desc    Get advertisement analytics
 * @access  Private (Admin)
 */
router.get(
  '/:id/analytics',
  authenticate,
  requireRole('admin'),
  advertisementController.getAnalytics
);

/**
 * @route   POST /api/advertisements
 * @desc    Create advertisement (Admin only)
 * @access  Private (Admin)
 */
router.post(
  '/',
  authenticate,
  requireRole('admin'),
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('targetUrl').trim().isURL().withMessage('Valid target URL is required'),
    body('advertiserName').trim().notEmpty().withMessage('Advertiser name is required'),
    body('type').isIn(['banner', 'popup', 'sidebar', 'inline', 'video', 'native']).withMessage('Invalid advertisement type'),
    body('category').isIn(['fitness', 'nutrition', 'equipment', 'supplements', 'apparel', 'general']).withMessage('Invalid category')
  ],
  validate,
  advertisementController.createAdvertisement
);

/**
 * @route   POST /api/advertisements/:id/upload
 * @desc    Upload media files for advertisement (Admin only)
 * @access  Private (Admin)
 */
const { uploadMultiple } = require('../middleware/advertisement-upload.middleware');
router.post(
  '/:id/upload',
  authenticate,
  requireRole('admin'),
  uploadMultiple,
  advertisementController.uploadMedia
);

/**
 * @route   PUT /api/advertisements/:id
 * @desc    Update advertisement (Admin only)
 * @access  Private (Admin)
 */
router.put(
  '/:id',
  authenticate,
  requireRole('admin'),
  advertisementController.updateAdvertisement
);

/**
 * @route   PUT /api/advertisements/:id/approve
 * @desc    Approve advertisement (Admin only)
 * @access  Private (Admin)
 */
router.put(
  '/:id/approve',
  authenticate,
  requireRole('admin'),
  advertisementController.approveAdvertisement
);

/**
 * @route   PUT /api/advertisements/:id/toggle
 * @desc    Activate/Deactivate advertisement (Admin only)
 * @access  Private (Admin)
 */
router.put(
  '/:id/toggle',
  authenticate,
  requireRole('admin'),
  advertisementController.toggleAdvertisement
);

/**
 * @route   DELETE /api/advertisements/:id
 * @desc    Delete advertisement (Admin only)
 * @access  Private (Admin)
 */
router.delete(
  '/:id',
  authenticate,
  requireRole('admin'),
  advertisementController.deleteAdvertisement
);

module.exports = router;
