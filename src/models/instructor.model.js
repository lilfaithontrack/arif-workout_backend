const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const InstructorProfile = sequelize.define('InstructorProfile', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  bio: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  experienceYears: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  specialties: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Array of specialty strings'
  },
  languages: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Array of language strings'
  },
  approved: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  approvalBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  approvalDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  approvalNotes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'instructor_profiles',
  timestamps: true,
  indexes: [
    { fields: ['approved'] }
  ]
});

module.exports = InstructorProfile;
