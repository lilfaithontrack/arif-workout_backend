const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const bodyMeasurementController = require('../controllers/bodymeasurement.controller');
const { authenticate } = require('../middleware/auth');
const validate = require('../middleware/validate');

// All routes require authentication
router.use(authenticate);

/**
 * @route   GET /api/measurements
 * @desc    Get all body measurements
 * @access  Private
 */
router.get('/', bodyMeasurementController.getBodyMeasurements);

/**
 * @route   GET /api/measurements/latest
 * @desc    Get latest measurement
 * @access  Private
 */
router.get('/latest', bodyMeasurementController.getLatestMeasurement);

/**
 * @route   GET /api/measurements/trends
 * @desc    Get measurement trends
 * @access  Private
 */
router.get('/trends', bodyMeasurementController.getMeasurementTrends);

/**
 * @route   GET /api/measurements/compare
 * @desc    Compare two measurements
 * @access  Private
 */
router.get('/compare', bodyMeasurementController.compareMeasurements);

/**
 * @route   GET /api/measurements/:id
 * @desc    Get single measurement
 * @access  Private
 */
router.get('/:id', bodyMeasurementController.getBodyMeasurement);

/**
 * @route   POST /api/measurements
 * @desc    Log body measurement
 * @access  Private
 */
router.post('/', bodyMeasurementController.logBodyMeasurement);

/**
 * @route   PUT /api/measurements/:id
 * @desc    Update body measurement
 * @access  Private
 */
router.put('/:id', bodyMeasurementController.updateBodyMeasurement);

/**
 * @route   DELETE /api/measurements/:id
 * @desc    Delete body measurement
 * @access  Private
 */
router.delete('/:id', bodyMeasurementController.deleteBodyMeasurement);

module.exports = router;
