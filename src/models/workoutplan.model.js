const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const WorkoutPlan = sequelize.define('WorkoutPlan', {
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
  instructorId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    },
    comment: 'Instructor who created the plan'
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  goal: {
    type: DataTypes.ENUM('weight_loss', 'muscle_gain', 'endurance', 'flexibility', 'general_fitness', 'strength'),
    allowNull: false
  },
  level: {
    type: DataTypes.ENUM('beginner', 'intermediate', 'advanced'),
    allowNull: false,
    defaultValue: 'beginner'
  },
  durationWeeks: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 52
    }
  },
  daysPerWeek: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 7
    }
  },
  workoutSchedule: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Array of {day, workoutId, exercises, sets, reps, rest}'
  },
  status: {
    type: DataTypes.ENUM('draft', 'active', 'completed', 'paused', 'cancelled'),
    defaultValue: 'draft'
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  completedWorkouts: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  totalWorkouts: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  progressPercentage: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 0,
    validate: {
      min: 0,
      max: 100
    }
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'workout_plans',
  timestamps: true,
  indexes: [
    { fields: ['userId', 'status'] },
    { fields: ['instructorId'] },
    { fields: ['goal'] },
    { fields: ['level'] },
    { fields: ['startDate'] }
  ]
});

module.exports = WorkoutPlan;
