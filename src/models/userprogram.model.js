const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const UserProgram = sequelize.define('UserProgram', {
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
  programId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'programs',
      key: 'id'
    }
  },
  currentWorkoutId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'program_workouts',
      key: 'id'
    },
    comment: 'Current workout the user is on'
  },
  currentWeek: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  currentDay: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  status: {
    type: DataTypes.ENUM('not_started', 'in_progress', 'completed', 'paused'),
    defaultValue: 'not_started'
  },
  progressPercentage: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 0,
    validate: {
      min: 0,
      max: 100
    }
  },
  completedWorkouts: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  totalWorkouts: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  completedDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 1,
      max: 5
    }
  },
  feedback: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  isFavorite: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'user_programs',
  timestamps: true,
  indexes: [
    { fields: ['userId', 'status'] },
    { fields: ['userId', 'programId'], unique: true },
    { fields: ['programId'] },
    { fields: ['status'] }
  ]
});

module.exports = UserProgram;
