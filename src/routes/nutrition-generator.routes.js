const express = require('express');
const router = express.Router();
const nutritionGeneratorController = require('../controllers/nutrition-generator.controller');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

/**
 * @route   GET /api/nutrition-generator/plan
 * @desc    Generate personalized nutrition plan based on user survey
 * @access  Private
 */
router.get('/plan', nutritionGeneratorController.generateNutritionPlan);

/**
 * @route   GET /api/nutrition-generator/meal
 * @desc    Generate meal plan for specific meal type
 * @query   mealType (required), calories, dietaryPreference
 * @access  Private
 */
router.get('/meal', nutritionGeneratorController.generateMealByType);

/**
 * @route   GET /api/nutrition-generator/daily
 * @desc    Generate complete daily meal plan
 * @access  Private
 */
router.get('/daily', nutritionGeneratorController.generateDailyMealPlan);

/**
 * @route   GET /api/nutrition-generator/macros
 * @desc    Generate meal suggestions based on macro targets
 * @query   protein, carbs, fats, calories
 * @access  Private
 */
router.get('/macros', nutritionGeneratorController.generateByMacros);

/**
 * @route   GET /api/nutrition-generator/weekly-prep
 * @desc    Generate weekly meal prep plan
 * @access  Private
 */
router.get('/weekly-prep', nutritionGeneratorController.generateWeeklyMealPrep);

module.exports = router;
