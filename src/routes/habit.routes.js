const express = require('express');
const router = express.Router();
const habitController = require('../controllers/habit.controller');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

/**
 * @route   POST /api/habits
 * @desc    Create a new habit
 * @access  Private
 */
router.post('/', habitController.createHabit);

/**
 * @route   GET /api/habits
 * @desc    Get all habits for the authenticated user
 * @query   category, isActive, isArchived
 * @access  Private
 */
router.get('/', habitController.getAllHabits);

/**
 * @route   GET /api/habits/dashboard
 * @desc    Get habit dashboard with summary and statistics
 * @access  Private
 */
router.get('/dashboard', habitController.getDashboard);

/**
 * @route   GET /api/habits/:habitId
 * @desc    Get a specific habit by ID
 * @access  Private
 */
router.get('/:habitId', habitController.getHabitById);

/**
 * @route   PUT /api/habits/:habitId
 * @desc    Update a habit
 * @access  Private
 */
router.put('/:habitId', habitController.updateHabit);

/**
 * @route   DELETE /api/habits/:habitId
 * @desc    Delete a habit
 * @access  Private
 */
router.delete('/:habitId', habitController.deleteHabit);

/**
 * @route   POST /api/habits/:habitId/archive
 * @desc    Archive a habit
 * @access  Private
 */
router.post('/:habitId/archive', habitController.archiveHabit);

/**
 * @route   POST /api/habits/:habitId/complete
 * @desc    Mark a habit as completed
 * @access  Private
 */
router.post('/:habitId/complete', habitController.completeHabit);

/**
 * @route   POST /api/habits/:habitId/uncomplete
 * @desc    Remove a habit completion
 * @access  Private
 */
router.post('/:habitId/uncomplete', habitController.uncompleteHabit);

/**
 * @route   GET /api/habits/:habitId/statistics
 * @desc    Get statistics for a specific habit
 * @query   period (week, month, year)
 * @access  Private
 */
router.get('/:habitId/statistics', habitController.getHabitStatistics);

module.exports = router;
