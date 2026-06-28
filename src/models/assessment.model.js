const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Assessment = sequelize.define('Assessment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  slug: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true
  },
  category: {
    type: DataTypes.ENUM('postural', 'movement', 'performance', 'flexibility'),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  instructions: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'How to perform the assessment'
  },
  durationMinutes: {
    type: DataTypes.INTEGER,
    defaultValue: 10
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'assessments',
  timestamps: true
});

module.exports = Assessment;
