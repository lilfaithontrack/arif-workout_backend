const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const nutritionController = require('../controllers/nutrition.controller');
const { authenticate } = require('../middleware/auth');
const validate = require('../middleware/validate');

// All routes require authentication
router.use(authenticate);

/**
 * @route   GET /api/nutrition
 * @desc    Get nutrition logs
 * @access  Private
 */
router.get('/', nutritionController.getNutritionLogs);

/**
 * @route   GET /api/nutrition/daily
 * @desc    Get daily nutrition summary
 * @access  Private
 */
router.get('/daily', nutritionController.getDailySummary);

/**
 * @route   GET /api/nutrition/weekly
 * @desc    Get weekly nutrition summary
 * @access  Private
 */
router.get('/weekly', nutritionController.getWeeklySummary);

/**
 * @route   GET /api/nutrition/stats
 * @desc    Get nutrition statistics
 * @access  Private
 */
router.get('/stats', nutritionController.getNutritionStats);

/**
 * @route   GET /api/nutrition/:id
 * @desc    Get single nutrition log
 * @access  Private
 */
router.get('/:id', nutritionController.getNutritionLog);

/**
 * @route   POST /api/nutrition
 * @desc    Log a meal
 * @access  Private
 */
router.post(
  '/',
  [
    body('mealType').isIn(['breakfast', 'lunch', 'dinner', 'snack', 'pre_workout', 'post_workout']).withMessage('Invalid meal type'),
    body('foodName').trim().notEmpty().withMessage('Food name is required'),
    body('calories').isInt({ min: 0 }).withMessage('Calories must be a positive number')
  ],
  validate,
  nutritionController.logMeal
);

/**
 * @route   PUT /api/nutrition/:id
 * @desc    Update nutrition log
 * @access  Private
 */
router.put('/:id', nutritionController.updateNutritionLog);

/**
 * @route   DELETE /api/nutrition/:id
 * @desc    Delete nutrition log
 * @access  Private
 */
router.delete('/:id', nutritionController.deleteNutritionLog);

module.exports = router;
