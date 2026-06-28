const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const WorkoutSection = sequelize.define('WorkoutSection', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: 'e.g., Warm-Up, Core / Balance / Plyometric, Resistance, Cool-Down'
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
  ordinal: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: 'Display order: 0=Warm-Up, 1=Core/Balance/Plyometric, etc.'
  },
  color: {
    type: DataTypes.STRING(20),
    allowNull: true,
    comment: 'UI color for the section'
  },
  // Section metadata
  purpose: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'e.g. "SMR + Static Stretching" for Warm-Up'
  },
  typicalDuration: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Typical duration in minutes'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  isHidden: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: 'Whether this section is hidden in UI'
  }
}, {
  tableName: 'workout_sections',
  timestamps: true,
  indexes: [
    { fields: ['ordinal'] },
    { fields: ['isActive'] }
  ]
});

module.exports = WorkoutSection;
