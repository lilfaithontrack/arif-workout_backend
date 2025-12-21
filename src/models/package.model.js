const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Package = sequelize.define('Package', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  slug: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true
  },
  createdByAdmin: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  includedCourses: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Array of course IDs'
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  currency: {
    type: DataTypes.STRING(3),
    defaultValue: 'USD'
  },
  billingCycle: {
    type: DataTypes.ENUM('monthly', 'quarterly', 'yearly'),
    allowNull: false
  },
  trialDays: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  genderRestriction: {
    type: DataTypes.ENUM('any', 'male', 'female', 'other'),
    defaultValue: 'any'
  },
  ageRange: {
    type: DataTypes.JSON,
    defaultValue: { min: 0, max: 100 },
    comment: 'Object with min and max age'
  },
  levelRestriction: {
    type: DataTypes.ENUM('any', 'beginner', 'intermediate', 'advanced'),
    defaultValue: 'any'
  },
  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'categories',
      key: 'id'
    }
  },
  status: {
    type: DataTypes.ENUM('draft', 'active', 'inactive'),
    defaultValue: 'draft'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  features: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Array of feature strings'
  },
  subscriberCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'packages',
  timestamps: true,
  indexes: [
    { fields: ['status', 'genderRestriction', 'levelRestriction'] },
    { fields: ['billingCycle', 'status'] },
    { fields: ['price'] },
    { fields: ['title'] },
    { fields: ['categoryId'] }
  ]
});

module.exports = Package;
