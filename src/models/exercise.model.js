const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Exercise = sequelize.define('Exercise', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  slug: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  category: {
    type: DataTypes.ENUM('cardio', 'strength', 'flexibility', 'balance', 'sports', 'yoga', 'pilates', 'hiit'),
    allowNull: false
  },
  muscleGroups: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Array of muscle groups: chest, back, legs, shoulders, arms, core, etc.'
  },
  primaryMuscles: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Primary muscles targeted by the exercise'
  },
  secondaryMuscles: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Secondary muscles engaged during the exercise'
  },
  equipment: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Array of equipment needed: dumbbells, barbell, resistance_band, etc.'
  },
  difficulty: {
    type: DataTypes.ENUM('beginner', 'intermediate', 'advanced'),
    allowNull: false,
    defaultValue: 'beginner'
  },
  instructions: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Array of step-by-step instructions'
  },
  videoUrl: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  imageUrl: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  caloriesBurnedPerMinute: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
    comment: 'Estimated calories burned per minute'
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Default duration in seconds'
  },
  sets: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 3
  },
  reps: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 10
  },
  restTime: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 60,
    comment: 'Rest time in seconds between sets'
  },
  tips: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Array of tips and safety notes'
  },
  variations: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Array of exercise variations'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  createdBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  tableName: 'exercises',
  timestamps: true,
  indexes: [
    { fields: ['category'] },
    { fields: ['difficulty'] },
    { fields: ['isActive'] },
    { fields: ['createdBy'] }
  ]
});

module.exports = Exercise;
