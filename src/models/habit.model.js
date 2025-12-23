const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Habit = sequelize.define('Habit', {
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
    comment: 'User who owns this habit'
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: 'Name of the habit'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Description of the habit'
  },
  category: {
    type: DataTypes.ENUM(
      'fitness',
      'nutrition',
      'sleep',
      'hydration',
      'mindfulness',
      'productivity',
      'health',
      'custom'
    ),
    allowNull: false,
    defaultValue: 'custom',
    comment: 'Category of the habit'
  },
  frequency: {
    type: DataTypes.ENUM('daily', 'weekly', 'monthly'),
    allowNull: false,
    defaultValue: 'daily',
    comment: 'How often the habit should be completed'
  },
  targetCount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    comment: 'Number of times to complete per frequency period'
  },
  icon: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: 'Icon name for the habit'
  },
  color: {
    type: DataTypes.STRING(20),
    allowNull: true,
    comment: 'Color code for the habit'
  },
  reminderEnabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: 'Whether reminders are enabled'
  },
  reminderTime: {
    type: DataTypes.TIME,
    allowNull: true,
    comment: 'Time for daily reminder'
  },
  currentStreak: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: 'Current consecutive completion streak'
  },
  longestStreak: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: 'Longest streak ever achieved'
  },
  totalCompletions: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: 'Total number of completions'
  },
  lastCompletedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Last time the habit was completed'
  },
  startDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    comment: 'Date when habit tracking started'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    comment: 'Whether the habit is currently active'
  },
  isArchived: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: 'Whether the habit is archived'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Additional notes about the habit'
  }
}, {
  tableName: 'habits',
  timestamps: true,
  indexes: [
    { fields: ['userId'] },
    { fields: ['category'] },
    { fields: ['isActive'] },
    { fields: ['startDate'] }
  ]
});

module.exports = Habit;
