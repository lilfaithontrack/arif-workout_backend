const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const exerciseController = require('../controllers/exercise.controller');
const { authenticate, requireRole } = require('../middleware/auth');
const validate = require('../middleware/validate');

/**
 * @route   GET /api/exercises
 * @desc    Get all exercises with filters
 * @access  Public
 */
router.get('/', exerciseController.getExercises);

/**
 * @route   GET /api/exercises/categories
 * @desc    Get exercise categories
 * @access  Public
 */
router.get('/categories', exerciseController.getCategories);

/**
 * @route   GET /api/exercises/muscle-groups
 * @desc    Get muscle groups
 * @access  Public
 */
router.get('/muscle-groups', exerciseController.getMuscleGroups);

/**
 * @route   GET /api/exercises/:id
 * @desc    Get single exercise by ID or slug
 * @access  Public
 */
router.get('/:id', exerciseController.getExercise);

/**
 * @route   POST /api/exercises
 * @desc    Create exercise
 * @access  Private (Admin/Instructor)
 */
router.post(
  '/',
  authenticate,
  requireRole('admin', 'instructor'),
  [
    body('name').trim().notEmpty().withMessage('Exercise name is required'),
    body('slug').trim().notEmpty().withMessage('Slug is required'),
    body('category').isIn(['cardio', 'strength', 'flexibility', 'balance', 'sports', 'yoga', 'pilates', 'hiit']).withMessage('Invalid category'),
    body('difficulty').isIn(['beginner', 'intermediate', 'advanced']).withMessage('Invalid difficulty')
  ],
  validate,
  exerciseController.createExercise
);

/**
 * @route   PUT /api/exercises/:id
 * @desc    Update exercise
 * @access  Private (Admin/Instructor)
 */
router.put(
  '/:id',
  authenticate,
  requireRole('admin', 'instructor'),
  exerciseController.updateExercise
);

/**
 * @route   DELETE /api/exercises/:id
 * @desc    Delete exercise
 * @access  Private (Admin only)
 */
router.delete(
  '/:id',
  authenticate,
  requireRole('admin'),
  exerciseController.deleteExercise
);

module.exports = router;
