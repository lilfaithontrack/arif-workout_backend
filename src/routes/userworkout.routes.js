const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const userWorkoutController = require('../controllers/userworkout.controller');
const { authenticate } = require('../middleware/auth');
const validate = require('../middleware/validate');

// All routes require authentication
router.use(authenticate);

/**
 * @route   GET /api/workouts
 * @desc    Get user's workouts
 * @access  Private
 */
router.get('/', userWorkoutController.getUserWorkouts);

/**
 * @route   GET /api/workouts/stats
 * @desc    Get workout statistics
 * @access  Private
 */
router.get('/stats', userWorkoutController.getWorkoutStats);

/**
 * @route   GET /api/workouts/calendar
 * @desc    Get workout calendar
 * @access  Private
 */
router.get('/calendar', userWorkoutController.getWorkoutCalendar);

/**
 * @route   GET /api/workouts/:id
 * @desc    Get single workout
 * @access  Private
 */
router.get('/:id', userWorkoutController.getWorkout);

/**
 * @route   POST /api/workouts
 * @desc    Log a workout
 * @access  Private
 */
router.post(
  '/',
  [
    body('exerciseId').isInt().withMessage('Exercise ID is required'),
    body('status').optional().isIn(['planned', 'in_progress', 'completed', 'skipped']),
    body('intensity').optional().isIn(['low', 'moderate', 'high', 'very_high']),
    body('rating').optional().isInt({ min: 1, max: 5 }),
    body('mood').optional().isIn(['great', 'good', 'okay', 'tired', 'exhausted'])
  ],
  validate,
  userWorkoutController.logWorkout
);

/**
 * @route   PUT /api/workouts/:id
 * @desc    Update workout
 * @access  Private
 */
router.put('/:id', userWorkoutController.updateWorkout);

/**
 * @route   DELETE /api/workouts/:id
 * @desc    Delete workout
 * @access  Private
 */
router.delete('/:id', userWorkoutController.deleteWorkout);

module.exports = router;
