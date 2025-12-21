const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const FitnessAssessment = sequelize.define('FitnessAssessment', {
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
  assessedBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    },
    comment: 'Instructor who performed assessment'
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  assessmentType: {
    type: DataTypes.ENUM('initial', 'progress', 'final', 'periodic'),
    allowNull: false,
    defaultValue: 'initial'
  },
  // Cardiovascular fitness
  restingHeartRate: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Resting heart rate in bpm'
  },
  maxHeartRate: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Maximum heart rate in bpm'
  },
  vo2Max: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
    comment: 'VO2 max in ml/kg/min'
  },
  // Strength tests
  pushUpsMax: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Maximum push-ups in 1 minute'
  },
  sitUpsMax: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Maximum sit-ups in 1 minute'
  },
  plankTime: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Plank hold time in seconds'
  },
  squatsMax: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Maximum squats in 1 minute'
  },
  benchPressMax: {
    type: DataTypes.DECIMAL(6, 2),
    allowNull: true,
    comment: 'Maximum bench press weight in kg'
  },
  deadliftMax: {
    type: DataTypes.DECIMAL(6, 2),
    allowNull: true,
    comment: 'Maximum deadlift weight in kg'
  },
  squatMax: {
    type: DataTypes.DECIMAL(6, 2),
    allowNull: true,
    comment: 'Maximum squat weight in kg'
  },
  // Flexibility tests
  sitAndReach: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
    comment: 'Sit and reach test in cm'
  },
  shoulderFlexibility: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: 'Left/right shoulder flexibility'
  },
  // Endurance tests
  runTime1Mile: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: '1 mile run time in seconds'
  },
  runTime5K: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: '5K run time in seconds'
  },
  // Balance and agility
  balanceScore: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 0,
      max: 100
    }
  },
  agilityScore: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 0,
      max: 100
    }
  },
  // Overall scores
  overallFitnessScore: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 0,
      max: 100
    }
  },
  fitnessLevel: {
    type: DataTypes.ENUM('poor', 'below_average', 'average', 'above_average', 'excellent'),
    allowNull: true
  },
  recommendations: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Array of recommendation strings'
  },
  strengths: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Array of strength areas'
  },
  weaknesses: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Array of areas needing improvement'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'fitness_assessments',
  timestamps: true,
  indexes: [
    { fields: ['userId', 'date'] },
    { fields: ['assessedBy'] },
    { fields: ['assessmentType'] },
    { fields: ['date'] }
  ]
});

module.exports = FitnessAssessment;
