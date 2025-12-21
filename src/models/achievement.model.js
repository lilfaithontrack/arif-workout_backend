const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Achievement = sequelize.define('Achievement', {
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
  type: {
    type: DataTypes.ENUM(
      'workout_streak',
      'weight_milestone',
      'strength_milestone',
      'distance_milestone',
      'time_milestone',
      'consistency',
      'goal_completed',
      'personal_record',
      'challenge_completed',
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
  iconUrl: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  badgeLevel: {
    type: DataTypes.ENUM('bronze', 'silver', 'gold', 'platinum', 'diamond'),
    allowNull: true
  },
  points: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: 'Points earned for this achievement'
  },
  unlockedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  criteria: {
    type: DataTypes.JSON,
    defaultValue: {},
    comment: 'Criteria met to unlock this achievement'
  },
  isPublic: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    comment: 'Show on public profile'
  },
  shareCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'achievements',
  timestamps: true,
  indexes: [
    { fields: ['userId', 'unlockedAt'] },
    { fields: ['type'] },
    { fields: ['badgeLevel'] }
  ]
});

module.exports = Achievement;
