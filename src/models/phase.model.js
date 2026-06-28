const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Phase = sequelize.define('Phase', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  phaseNumber: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    comment: '1-5 (OPT Model phase number)'
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: 'Stabilization Endurance, Strength Endurance, etc.'
  },
  slug: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  // Training parameters (defaults for this phase)
  minSets: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  maxSets: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  minReps: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  maxReps: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  tempoPattern: {
    type: DataTypes.STRING(20),
    allowNull: false,
    comment: 'e.g. "4-2-1" (eccentric-pause-concentric)'
  },
  minRestSeconds: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  maxRestSeconds: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  intensity: {
    type: DataTypes.ENUM('low', 'moderate', 'high', 'very_high'),
    allowNull: false,
    defaultValue: 'low'
  },
  trainingFocus: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  adaptationType: {
    type: DataTypes.ENUM('stabilization', 'strength_endurance', 'hypertrophy',
                         'maximal_strength', 'power'),
    allowNull: false
  },
  progressionType: {
    type: DataTypes.ENUM('linear', 'undulating', 'block', 'conjugate'),
    defaultValue: 'linear'
  },
  assessmentRequired: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'phases',
  timestamps: true
});

module.exports = Phase;
