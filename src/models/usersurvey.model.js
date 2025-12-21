const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

/**
 * User Survey Model
 * Stores comprehensive user fitness assessment data for AI workout plan generation
 */
const UserSurvey = sequelize.define('UserSurvey', {
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
    },
    comment: 'User who completed the survey'
  },
  
  // Personal Information
  age: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 13,
      max: 120
    }
  },
  gender: {
    type: DataTypes.ENUM('male', 'female', 'other'),
    allowNull: false
  },
  height: {
    type: DataTypes.FLOAT,
    allowNull: false,
    comment: 'Height in cm'
  },
  weight: {
    type: DataTypes.FLOAT,
    allowNull: false,
    comment: 'Current weight in kg'
  },
  targetWeight: {
    type: DataTypes.FLOAT,
    allowNull: true,
    comment: 'Target weight in kg'
  },
  
  // Fitness Goals (Primary)
  primaryGoal: {
    type: DataTypes.ENUM(
      'weight_loss',
      'muscle_gain',
      'strength',
      'endurance',
      'flexibility',
      'athletic_performance',
      'general_fitness',
      'body_recomposition',
      'rehabilitation'
    ),
    allowNull: false
  },
  secondaryGoals: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Array of secondary fitness goals'
  },
  
  // Current Fitness Level
  fitnessLevel: {
    type: DataTypes.ENUM('beginner', 'intermediate', 'advanced', 'expert'),
    allowNull: false,
    defaultValue: 'beginner'
  },
  yearsOfExperience: {
    type: DataTypes.FLOAT,
    allowNull: true,
    comment: 'Years of workout experience'
  },
  
  // Activity & Lifestyle
  activityLevel: {
    type: DataTypes.ENUM(
      'sedentary',        // Little to no exercise
      'lightly_active',   // 1-3 days/week
      'moderately_active', // 3-5 days/week
      'very_active',      // 6-7 days/week
      'extremely_active'  // Physical job + training
    ),
    allowNull: false
  },
  workoutFrequency: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Desired workouts per week',
    validate: {
      min: 1,
      max: 7
    }
  },
  workoutDuration: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Available time per workout in minutes',
    validate: {
      min: 15,
      max: 180
    }
  },
  
  // Equipment & Location
  workoutLocation: {
    type: DataTypes.ENUM('gym', 'home', 'outdoor', 'hybrid'),
    allowNull: false,
    defaultValue: 'gym'
  },
  availableEquipment: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Array of available equipment: dumbbells, barbell, machines, etc.'
  },
  
  // Physical Limitations
  injuries: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Array of current or past injuries'
  },
  medicalConditions: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Array of medical conditions to consider'
  },
  limitations: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Any physical limitations or restrictions'
  },
  
  // Preferences
  preferredExerciseTypes: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Cardio, strength, HIIT, yoga, etc.'
  },
  dislikedExercises: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Exercises to avoid'
  },
  
  // Nutrition Information
  dietaryPreference: {
    type: DataTypes.ENUM(
      'omnivore',
      'vegetarian',
      'vegan',
      'pescatarian',
      'keto',
      'paleo',
      'mediterranean',
      'flexible'
    ),
    allowNull: true
  },
  dailyCalorieTarget: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Target daily calories'
  },
  mealsPerDay: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 1,
      max: 8
    }
  },
  
  // Sleep & Recovery
  averageSleepHours: {
    type: DataTypes.FLOAT,
    allowNull: true,
    validate: {
      min: 3,
      max: 12
    }
  },
  stressLevel: {
    type: DataTypes.ENUM('low', 'moderate', 'high', 'very_high'),
    allowNull: true
  },
  
  // Body Composition (Optional)
  bodyFatPercentage: {
    type: DataTypes.FLOAT,
    allowNull: true,
    validate: {
      min: 3,
      max: 60
    }
  },
  muscleMass: {
    type: DataTypes.FLOAT,
    allowNull: true,
    comment: 'Muscle mass in kg'
  },
  
  // Performance Metrics (Optional)
  benchPressMax: {
    type: DataTypes.FLOAT,
    allowNull: true,
    comment: '1RM in kg'
  },
  squatMax: {
    type: DataTypes.FLOAT,
    allowNull: true,
    comment: '1RM in kg'
  },
  deadliftMax: {
    type: DataTypes.FLOAT,
    allowNull: true,
    comment: '1RM in kg'
  },
  runningPace: {
    type: DataTypes.FLOAT,
    allowNull: true,
    comment: 'Average pace in min/km'
  },
  
  // AI Generation Metadata
  aiScore: {
    type: DataTypes.FLOAT,
    allowNull: true,
    comment: 'AI confidence score for plan generation (0-100)'
  },
  lastPlanGenerated: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'When the last AI plan was generated'
  },
  
  // Status
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    comment: 'Whether this survey is the active one'
  },
  completedAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'user_surveys',
  timestamps: true,
  indexes: [
    { fields: ['userId'] },
    { fields: ['isActive'] },
    { fields: ['primaryGoal'] },
    { fields: ['fitnessLevel'] }
  ]
});

module.exports = UserSurvey;
