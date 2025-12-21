const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const FitnessGoal = sequelize.define('FitnessGoal', {
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
  goalType: {
    type: DataTypes.ENUM(
      'weight_loss', 
      'weight_gain', 
      'muscle_gain', 
      'fat_loss',
      'endurance',
      'strength',
      'flexibility',
      'body_recomposition',
      'maintain_weight',
      'custom'
    ),
    allowNull: false
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  targetValue: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    comment: 'Target value (weight, body fat %, etc.)'
  },
  currentValue: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    comment: 'Current value'
  },
  startValue: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    comment: 'Starting value'
  },
  unit: {
    type: DataTypes.STRING(20),
    allowNull: true,
    comment: 'kg, lbs, %, cm, etc.'
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  targetDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('active', 'completed', 'paused', 'abandoned'),
    defaultValue: 'active'
  },
  progressPercentage: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 0,
    validate: {
      min: 0,
      max: 100
    }
  },
  milestones: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Array of {value, date, achieved, notes}'
  },
  weeklyTarget: {
    type: DataTypes.DECIMAL(6, 2),
    allowNull: true,
    comment: 'Weekly target progress'
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high'),
    defaultValue: 'medium'
  },
  isPublic: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: 'Share goal with community'
  },
  completedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'fitness_goals',
  timestamps: true,
  indexes: [
    { fields: ['userId', 'status'] },
    { fields: ['goalType'] },
    { fields: ['targetDate'] },
    { fields: ['priority'] }
  ]
});

module.exports = FitnessGoal;
