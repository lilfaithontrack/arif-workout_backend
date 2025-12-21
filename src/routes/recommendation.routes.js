const express = require('express');
const router = express.Router();
const recommendationController = require('../controllers/recommendation.controller');
const { authenticate } = require('../middleware/auth');
const { requireRole } = require('../middleware/roles');
const { body, query } = require('express-validator');

/**
 * @route   POST /api/recommendations/workout-plan
 * @desc    Generate personalized workout plan
 * @access  Private
 */
router.post(
  '/workout-plan',
  authenticate,
  [
    body('duration').optional().isString(),
    body('workoutFrequency').optional().isInt({ min: 1, max: 7 }),
    body('workoutDuration').optional().isInt({ min: 15, max: 180 }),
    body('goals').optional().isArray(),
    body('fitnessLevel').optional().isIn(['beginner', 'intermediate', 'advanced'])
  ],
  recommendationController.generateWorkoutPlan
);

/**
 * @route   POST /api/recommendations/nutrition-plan
 * @desc    Generate personalized nutrition plan
 * @access  Private
 */
router.post(
  '/nutrition-plan',
  authenticate,
  [
    body('targetCalories').optional().isInt({ min: 1000, max: 5000 }),
    body('dietaryPreferences').optional().isArray(),
    body('allergens').optional().isArray(),
    body('goals').optional().isArray()
  ],
  recommendationController.generateNutritionPlan
);

/**
 * @route   POST /api/recommendations/complete-plan
 * @desc    Generate complete workout and nutrition plan
 * @access  Private
 */
router.post(
  '/complete-plan',
  authenticate,
  recommendationController.getCompletePlan
);

/**
 * @route   GET /api/recommendations/exercises
 * @desc    Get recommended exercises for user
 * @access  Private
 */
router.get(
  '/exercises',
  authenticate,
  [
    query('category').optional().isString(),
    query('muscleGroup').optional().isString(),
    query('difficulty').optional().isIn(['beginner', 'intermediate', 'advanced']),
    query('limit').optional().isInt({ min: 1, max: 100 })
  ],
  recommendationController.getRecommendedExercises
);

/**
 * @route   GET /api/recommendations/fitness-profile
 * @desc    Get user's fitness profile
 * @access  Private
 */
router.get(
  '/fitness-profile',
  authenticate,
  recommendationController.getFitnessProfile
);

/**
 * @route   PUT /api/recommendations/fitness-profile
 * @desc    Update user's fitness profile
 * @access  Private
 */
router.put(
  '/fitness-profile',
  authenticate,
  [
    body('goals').optional().isArray(),
    body('fitnessLevel').optional().isIn(['beginner', 'intermediate', 'advanced']),
    body('age').optional().isInt({ min: 13, max: 120 }),
    body('gender').optional().isIn(['male', 'female', 'other']),
    body('height').optional().isInt({ min: 100, max: 250 }),
    body('weight').optional().isInt({ min: 30, max: 300 }),
    body('targetWeight').optional().isInt({ min: 30, max: 300 }),
    body('activityLevel').optional().isIn(['sedentary', 'light', 'moderate', 'active', 'very_active']),
    body('workoutFrequency').optional().isInt({ min: 0, max: 7 }),
    body('availableEquipment').optional().isArray(),
    body('healthConditions').optional().isArray(),
    body('dietaryPreferences').optional().isArray(),
    body('allergens').optional().isArray()
  ],
  recommendationController.updateFitnessProfile
);

/**
 * @route   POST /api/recommendations/reload-databases
 * @desc    Reload recommendation databases (admin only)
 * @access  Private (Admin)
 */
router.post(
  '/reload-databases',
  authenticate,
  requireRole(['admin']),
  recommendationController.reloadDatabases
);

module.exports = router;
