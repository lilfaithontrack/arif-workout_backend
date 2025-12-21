const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const UserWorkout = sequelize.define('UserWorkout', {
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
  workoutPlanId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'workout_plans',
      key: 'id'
    }
  },
  exerciseId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'exercises',
      key: 'id'
    }
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  startTime: {
    type: DataTypes.DATE,
    allowNull: true
  },
  endTime: {
    type: DataTypes.DATE,
    allowNull: true
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Duration in seconds'
  },
  sets: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  reps: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  weight: {
    type: DataTypes.DECIMAL(6, 2),
    allowNull: true,
    comment: 'Weight used in kg'
  },
  distance: {
    type: DataTypes.DECIMAL(8, 2),
    allowNull: true,
    comment: 'Distance in km for cardio'
  },
  caloriesBurned: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  heartRateAvg: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Average heart rate during workout'
  },
  heartRateMax: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  intensity: {
    type: DataTypes.ENUM('low', 'moderate', 'high', 'very_high'),
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('planned', 'in_progress', 'completed', 'skipped'),
    defaultValue: 'planned'
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 1,
      max: 5
    },
    comment: 'User rating of workout difficulty/satisfaction'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  mood: {
    type: DataTypes.ENUM('great', 'good', 'okay', 'tired', 'exhausted'),
    allowNull: true
  }
}, {
  tableName: 'user_workouts',
  timestamps: true,
  indexes: [
    { fields: ['userId', 'date'] },
    { fields: ['workoutPlanId'] },
    { fields: ['exerciseId'] },
    { fields: ['status'] },
    { fields: ['date'] }
  ]
});

module.exports = UserWorkout;
