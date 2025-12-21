const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

/**
 * AI Workout Plan Model
 * Stores AI-generated personalized workout plans
 */
const AIWorkoutPlan = sequelize.define('AIWorkoutPlan', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  surveyId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'user_surveys',
      key: 'id'
    },
    comment: 'Survey used to generate this plan'
  },
  
  // Plan Information
  planName: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: 'AI-generated plan name'
  },
  planDescription: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Detailed description of the plan'
  },
  durationWeeks: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 12,
    comment: 'Total plan duration in weeks'
  },
  
  // Plan Structure
  workoutsPerWeek: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 7
    }
  },
  planStructure: {
    type: DataTypes.JSON,
    allowNull: false,
    comment: 'Weekly workout structure: {week1: {day1: {...}, day2: {...}}, ...}'
  },
  
  // Exercise Distribution
  exerciseDistribution: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Breakdown of exercise types: {strength: 60%, cardio: 30%, flexibility: 10%}'
  },
  
  // Nutrition Plan
  nutritionPlan: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'AI-generated nutrition recommendations'
  },
  mealPlan: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Weekly meal suggestions based on nutrition items'
  },
  
  // Progressive Overload
  progressionStrategy: {
    type: DataTypes.ENUM(
      'linear',
      'undulating',
      'block_periodization',
      'wave_loading',
      'auto_regulation'
    ),
    allowNull: false,
    defaultValue: 'linear'
  },
  progressionSchedule: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'How intensity/volume increases over time'
  },
  
  // AI Metadata
  aiVersion: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: '1.0.0',
    comment: 'Version of AI algorithm used'
  },
  confidenceScore: {
    type: DataTypes.FLOAT,
    allowNull: false,
    comment: 'AI confidence in plan effectiveness (0-100)',
    validate: {
      min: 0,
      max: 100
    }
  },
  generationMethod: {
    type: DataTypes.ENUM('rule_based', 'ml_model', 'hybrid'),
    allowNull: false,
    defaultValue: 'rule_based'
  },
  
  // Personalization Factors
  personalizationFactors: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Factors considered: {goal_weight: 0.3, fitness_level: 0.25, ...}'
  },
  
  // Expected Outcomes
  expectedOutcomes: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Predicted results: {weight_change: -5kg, strength_gain: 15%, ...}'
  },
  
  // Tracking & Analytics
  startDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  currentWeek: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    comment: 'Current week in the plan'
  },
  completionRate: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
    comment: 'Percentage of workouts completed',
    validate: {
      min: 0,
      max: 100
    }
  },
  
  // Adaptations
  adaptations: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Array of AI-suggested adaptations based on progress'
  },
  lastAdaptation: {
    type: DataTypes.DATE,
    allowNull: true
  },
  
  // Status
  status: {
    type: DataTypes.ENUM('draft', 'active', 'paused', 'completed', 'abandoned'),
    allowNull: false,
    defaultValue: 'draft'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  
  // User Feedback
  userRating: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 1,
      max: 5
    }
  },
  userFeedback: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  
  // Admin/Coach Override
  reviewedBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    },
    comment: 'Admin/coach who reviewed the plan'
  },
  reviewNotes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  isApproved: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'ai_workout_plans',
  timestamps: true,
  indexes: [
    { fields: ['userId'] },
    { fields: ['surveyId'] },
    { fields: ['status'] },
    { fields: ['isActive'] },
    { fields: ['startDate'] }
  ]
});

module.exports = AIWorkoutPlan;
