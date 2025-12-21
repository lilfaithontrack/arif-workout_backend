const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Payment = sequelize.define('Payment', {
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
  provider: {
    type: DataTypes.ENUM('stripe', 'apple_pay', 'telebirr', 'other'),
    allowNull: false
  },
  providerPaymentId: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true
  },
  method: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  currency: {
    type: DataTypes.STRING(3),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('initiated', 'succeeded', 'failed', 'refunded', 'cancelled'),
    defaultValue: 'initiated'
  },
  metadata: {
    type: DataTypes.JSON,
    defaultValue: {}
  },
  refundAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    validate: {
      min: 0
    }
  },
  refundReason: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  refundedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  failureReason: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'payments',
  timestamps: true,
  indexes: [
    { fields: ['userId', 'status'] },
    { fields: ['provider', 'status'] },
    { fields: ['createdAt'] }
  ]
});

module.exports = Payment;
