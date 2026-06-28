const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const WorkoutExercise = sequelize.define('WorkoutExercise', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  programWorkoutId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'program_workouts',
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
  section: {
    type: DataTypes.ENUM(
      'warm_up',
      'core_balance_plyometric',
      'speed_agility_quickness',
      'resistance',
      'cool_down',
      'recovery',
      'main'
    ),
    defaultValue: 'main',
    allowNull: false,
    comment: 'NASM workout sections: warm_up, core_balance_plyometric, speed_agility_quickness, resistance, cool_down, recovery'
  },
  sectionName: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: 'Display name: Warm-Up, Core / Balance / Plyometric, Speed / Agility / Quickness, Resistance, Cool-Down, Recovery'
  },
  orderIndex: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: 'Order within the workout'
  },
  sets: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 3
  },
  reps: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'NULL for N/A or time-based exercises'
  },
  repsDisplay: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: 'Display text like "N/A reps" or "8-12"'
  },
  durationSeconds: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Duration for time-based exercises'
  },
  restSeconds: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 60,
    comment: 'Rest between sets'
  },
  tempo: {
    type: DataTypes.STRING(20),
    allowNull: true,
    comment: 'e.g., Slow, Medium, Fast or NASM notation like 3-1-2-0'
  },
  // NASM tempo breakdown: "3-1-2-0" = 3s eccentric, 1s isometric pause, 2s concentric, 0s rest pause
  tempoEccentric: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'NASM tempo: eccentric phase (seconds) — first number'
  },
  tempoIsometric: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'NASM tempo: isometric pause at end range (seconds) — second number'
  },
  tempoConcentric: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'NASM tempo: concentric phase (seconds) — third number'
  },
  tempoRestPause: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
    comment: 'NASM tempo: rest pause between reps (seconds) — fourth number'
  },
  weight: {
    type: DataTypes.DECIMAL(6, 2),
    allowNull: true,
    comment: 'Suggested weight in kg'
  },
  intensity: {
    type: DataTypes.ENUM('low', 'moderate', 'high', 'very_high'),
    allowNull: true
  },
  instructions: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Exercise-specific instructions for this workout'
  },
  videoUrl: {
    type: DataTypes.STRING(500),
    allowNull: true,
    comment: 'Workout-specific video if different from exercise default'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'workout_exercises',
  timestamps: true,
  indexes: [
    { fields: ['programWorkoutId', 'orderIndex'] },
    { fields: ['programWorkoutId', 'section'] },
    { fields: ['exerciseId'] },
    { fields: ['isActive'] }
  ]
});

module.exports = WorkoutExercise;
