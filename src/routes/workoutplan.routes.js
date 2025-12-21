const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const workoutPlanController = require('../controllers/workoutplan.controller');
const { authenticate, requireRole } = require('../middleware/auth');
const validate = require('../middleware/validate');

// All routes require authentication
router.use(authenticate);

/**
 * @route   GET /api/workout-plans
 * @desc    Get all workout plans for user
 * @access  Private
 */
router.get('/', workoutPlanController.getUserWorkoutPlans);

/**
 * @route   GET /api/workout-plans/stats
 * @desc    Get workout plan statistics
 * @access  Private
 */
router.get('/stats', workoutPlanController.getWorkoutPlanStats);

/**
 * @route   GET /api/workout-plans/:id
 * @desc    Get single workout plan
 * @access  Private
 */
router.get('/:id', workoutPlanController.getWorkoutPlan);

/**
 * @route   POST /api/workout-plans
 * @desc    Create workout plan
 * @access  Private
 */
router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('Plan name is required'),
    body('goal').isIn(['weight_loss', 'muscle_gain', 'endurance', 'flexibility', 'general_fitness', 'strength']).withMessage('Invalid goal'),
    body('level').isIn(['beginner', 'intermediate', 'advanced']).withMessage('Invalid level'),
    body('durationWeeks').isInt({ min: 1, max: 52 }).withMessage('Duration must be between 1-52 weeks'),
    body('daysPerWeek').isInt({ min: 1, max: 7 }).withMessage('Days per week must be between 1-7')
  ],
  validate,
  workoutPlanController.createWorkoutPlan
);

/**
 * @route   PUT /api/workout-plans/:id
 * @desc    Update workout plan
 * @access  Private
 */
router.put('/:id', workoutPlanController.updateWorkoutPlan);

/**
 * @route   POST /api/workout-plans/:id/start
 * @desc    Start workout plan
 * @access  Private
 */
router.post('/:id/start', workoutPlanController.startWorkoutPlan);

/**
 * @route   POST /api/workout-plans/:id/complete
 * @desc    Complete workout plan
 * @access  Private
 */
router.post('/:id/complete', workoutPlanController.completeWorkoutPlan);

/**
 * @route   DELETE /api/workout-plans/:id
 * @desc    Delete workout plan
 * @access  Private
 */
router.delete('/:id', workoutPlanController.deleteWorkoutPlan);

module.exports = router;
