const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const OTP = sequelize.define('OTP', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  phone: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  code: {
    type: DataTypes.STRING(10),
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('login', 'verify', 'reset'),
    allowNull: false
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false
  },
  attempts: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  consumed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'otps',
  timestamps: true,
  updatedAt: false,
  indexes: [
    { fields: ['expiresAt'] },
    { fields: ['phone', 'type', 'consumed'] },
    { fields: ['email', 'type', 'consumed'] },
    { fields: ['userId', 'type'] }
  ]
});

// Instance methods
OTP.prototype.isExpired = function() {
  return new Date() > this.expiresAt;
};

OTP.prototype.incrementAttempts = async function() {
  this.attempts += 1;
  return await this.save();
};

// Cleanup expired OTPs (call this periodically or via cron)
OTP.cleanupExpired = async function() {
  return await OTP.destroy({
    where: {
      expiresAt: {
        [require('sequelize').Op.lt]: new Date()
      }
    }
  });
};

module.exports = OTP;
