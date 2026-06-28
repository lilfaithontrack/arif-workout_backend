const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ProgramWorkout = sequelize.define('ProgramWorkout', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  programId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'programs',
      key: 'id'
    }
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: 'e.g., Bodyweight Beginner Level 1'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  level: {
    type: DataTypes.ENUM('beginner', 'intermediate', 'advanced'),
    allowNull: true
  },
  weekNumber: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Which week this workout belongs to'
  },
  dayNumber: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Day within the week (1-7)'
  },
  durationMinutes: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Estimated workout duration'
  },
  exercisesCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: 'Number of exercises'
  },
  caloriesBurnEstimate: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  focusArea: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: 'e.g., Full Body, Upper Body, Lower Body, Core'
  },
  orderIndex: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: 'Display order within program'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  instructions: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Pre-workout instructions'
  },
  // NASM-specific fields
  phaseId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'phases',
      key: 'id'
    },
    comment: 'FK to phases — the OPT phase for this workout'
  },
  phase: {
    type: DataTypes.ENUM('stabilization_endurance', 'strength_endurance', 'muscular_development', 'maximal_strength', 'power'),
    allowNull: true,
    comment: 'NASM OPT Model phase (denormalized)'
  },
  phaseNumber: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Phase number in the program sequence'
  },
  isAssessment: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: 'Whether this is an assessment workout'
  },
  assessmentType: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: 'e.g., Postural Assessment, Movement Assessment'
  }
}, {
  tableName: 'program_workouts',
  timestamps: true,
  indexes: [
    { fields: ['programId', 'orderIndex'] },
    { fields: ['programId', 'weekNumber', 'dayNumber'] },
    { fields: ['level'] },
    { fields: ['isActive'] },
    { fields: ['phaseId'] }
  ]
});

module.exports = ProgramWorkout;
