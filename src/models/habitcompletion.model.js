const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const HabitCompletion = sequelize.define('HabitCompletion', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  habitId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'habits',
      key: 'id'
    },
    comment: 'Habit that was completed'
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
    comment: 'User who completed the habit'
  },
  completedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    comment: 'When the habit was completed'
  },
  completionDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    comment: 'Date of completion (for tracking daily completions)'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Optional notes about this completion'
  },
  mood: {
    type: DataTypes.ENUM('great', 'good', 'okay', 'bad', 'terrible'),
    allowNull: true,
    comment: 'User mood during completion'
  },
  difficulty: {
    type: DataTypes.ENUM('very_easy', 'easy', 'moderate', 'hard', 'very_hard'),
    allowNull: true,
    comment: 'How difficult it was to complete'
  },
  value: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Numeric value for quantifiable habits (e.g., glasses of water, minutes exercised)'
  },
  metadata: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Additional metadata about the completion'
  }
}, {
  tableName: 'habit_completions',
  timestamps: true,
  indexes: [
    { fields: ['habitId'] },
    { fields: ['userId'] },
    { fields: ['completionDate'] },
    { fields: ['completedAt'] },
    { fields: ['habitId', 'completionDate'], unique: false }
  ]
});

module.exports = HabitCompletion;
