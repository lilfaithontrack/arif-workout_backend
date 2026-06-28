const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const AssessmentResult = sequelize.define('AssessmentResult', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' }
  },
  assessmentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'assessments', key: 'id' }
  },
  programId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'programs', key: 'id' },
    comment: 'Which program triggered this assessment (optional)'
  },
  score: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
    comment: 'Numeric score if applicable'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Practitioner notes'
  },
  compensations: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Observed compensations (e.g. ["knee valgus", "low back arch"])'
  },
  recommendations: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Recommended correctional exercises'
  },
  assessedBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'users', key: 'id' },
    comment: 'Practitioner who conducted the assessment'
  },
  assessedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'assessment_results',
  timestamps: true,
  indexes: [
    { fields: ['userId'] },
    { fields: ['assessmentId'] },
    { fields: ['programId'] },
    { fields: ['assessedAt'] }
  ]
});

module.exports = AssessmentResult;
