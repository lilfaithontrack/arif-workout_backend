const recommendationService = require('../services/recommendation.service');
const { validationResult } = require('express-validator');

/**
 * Generate personalized workout plan
 */
exports.generateWorkoutPlan = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const userId = req.user.id;
    const preferences = req.body;

    const workoutPlan = await recommendationService.generateWorkoutPlan(userId, preferences);

    res.status(200).json({
      success: true,
      data: workoutPlan,
      message: 'Workout plan generated successfully'
    });
  } catch (error) {
    console.error('Error generating workout plan:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate workout plan',
      error: error.message
    });
  }
};

/**
 * Generate personalized nutrition plan
 */
exports.generateNutritionPlan = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const userId = req.user.id;
    const preferences = req.body;

    const nutritionPlan = await recommendationService.generateNutritionPlan(userId, preferences);

    res.status(200).json({
      success: true,
      data: nutritionPlan,
      message: 'Nutrition plan generated successfully'
    });
  } catch (error) {
    console.error('Error generating nutrition plan:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate nutrition plan',
      error: error.message
    });
  }
};

/**
 * Get recommended exercises
 */
exports.getRecommendedExercises = async (req, res) => {
  try {
    const userId = req.user.id;
    const filters = {
      category: req.query.category,
      muscleGroup: req.query.muscleGroup,
      difficulty: req.query.difficulty,
      limit: parseInt(req.query.limit) || 20
    };

    const exercises = await recommendationService.getRecommendedExercises(userId, filters);

    res.status(200).json({
      success: true,
      data: exercises,
      count: exercises.length,
      message: 'Recommended exercises retrieved successfully'
    });
  } catch (error) {
    console.error('Error getting recommended exercises:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get recommended exercises',
      error: error.message
    });
  }
};

/**
 * Update user fitness profile
 */
exports.updateFitnessProfile = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const userId = req.user.id;
    const User = require('../models/user.model');
    
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Merge existing profile with new data
    const currentProfile = user.fitness_profile || {};
    const updatedProfile = {
      ...currentProfile,
      ...req.body,
      updatedAt: new Date()
    };

    await user.update({ fitness_profile: updatedProfile });

    res.status(200).json({
      success: true,
      data: updatedProfile,
      message: 'Fitness profile updated successfully'
    });
  } catch (error) {
    console.error('Error updating fitness profile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update fitness profile',
      error: error.message
    });
  }
};

/**
 * Get user fitness profile
 */
exports.getFitnessProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const User = require('../models/user.model');
    
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const profile = user.fitness_profile || {
      message: 'No fitness profile found. Please complete your profile to get personalized recommendations.'
    };

    res.status(200).json({
      success: true,
      data: profile
    });
  } catch (error) {
    console.error('Error getting fitness profile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get fitness profile',
      error: error.message
    });
  }
};

/**
 * Reload recommendation databases (admin only)
 */
exports.reloadDatabases = async (req, res) => {
  try {
    recommendationService.reloadDatabases();

    res.status(200).json({
      success: true,
      message: 'Recommendation databases reloaded successfully'
    });
  } catch (error) {
    console.error('Error reloading databases:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reload databases',
      error: error.message
    });
  }
};

/**
 * Get combined workout and nutrition plan
 */
exports.getCompletePlan = async (req, res) => {
  try {
    const userId = req.user.id;
    const preferences = req.body;

    // Generate both plans in parallel
    const [workoutPlan, nutritionPlan] = await Promise.all([
      recommendationService.generateWorkoutPlan(userId, preferences),
      recommendationService.generateNutritionPlan(userId, preferences)
    ]);

    res.status(200).json({
      success: true,
      data: {
        workout: workoutPlan,
        nutrition: nutritionPlan,
        generatedAt: new Date()
      },
      message: 'Complete personalized plan generated successfully'
    });
  } catch (error) {
    console.error('Error generating complete plan:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate complete plan',
      error: error.message
    });
  }
};
