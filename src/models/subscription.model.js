const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Subscription = sequelize.define('Subscription', {
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
  packageId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'packages',
      key: 'id'
    }
  },
  paymentMethod: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'payments',
      key: 'id'
    }
  },
  status: {
    type: DataTypes.ENUM('active', 'paused', 'cancelled', 'past_due', 'expired'),
    defaultValue: 'active'
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  trialEndDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  nextBillingDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  billingCycle: {
    type: DataTypes.ENUM('monthly', 'quarterly', 'yearly'),
    allowNull: false
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
  cancellationRequestedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  cancelledAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  cancellationReason: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  pausedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  pauseReason: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  lastPaymentId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'payments',
      key: 'id'
    }
  },
  paymentHistory: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Array of {paymentId, date, amount, status}'
  }
}, {
  tableName: 'subscriptions',
  timestamps: true,
  indexes: [
    { fields: ['userId', 'status'] },
    { fields: ['packageId', 'status'] },
    { fields: ['nextBillingDate', 'status'] },
    { fields: ['status'] },
    { fields: ['userId', 'packageId', 'status'] }
  ]
});

module.exports = Subscription;
