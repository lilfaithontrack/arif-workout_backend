const express = require('express');
const router = express.Router();
const workoutGeneratorController = require('../controllers/workout-generator.controller');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

/**
 * @route   GET /api/workout-generator/plan
 * @desc    Generate personalized workout plan based on user survey
 * @access  Private
 */
router.get('/plan', workoutGeneratorController.generateWorkoutPlan);

/**
 * @route   GET /api/workout-generator/body-part
 * @desc    Generate workout by body part/muscle group
 * @query   bodyPart (required), difficulty, duration, equipment
 * @access  Private
 */
router.get('/body-part', workoutGeneratorController.generateByBodyPart);

/**
 * @route   GET /api/workout-generator/category
 * @desc    Generate workout by category (cardio, strength, etc.)
 * @query   category (required), difficulty, duration
 * @access  Private
 */
router.get('/category', workoutGeneratorController.generateByCategory);

/**
 * @route   GET /api/workout-generator/weekly-split
 * @desc    Generate full week workout split based on survey
 * @access  Private
 */
router.get('/weekly-split', workoutGeneratorController.generateWeeklySplit);

module.exports = router;
