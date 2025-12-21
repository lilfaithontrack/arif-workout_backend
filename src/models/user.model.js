const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(255),
    unique: true,
    allowNull: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'Hashed password for admin/manager/instructor only'
  },
  phone: {
    type: DataTypes.STRING(50),
    unique: true,
    allowNull: true
  },
  gender: {
    type: DataTypes.ENUM('male', 'female', 'other'),
    allowNull: true
  },
  dob: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  roles: {
    type: DataTypes.JSON,
    defaultValue: ['student'],
    get() {
      const rawValue = this.getDataValue('roles');
      // Parse if string, return if array, default to ['student']
      if (typeof rawValue === 'string') {
        try {
          const parsed = JSON.parse(rawValue);
          return Array.isArray(parsed) ? parsed : ['student'];
        } catch (e) {
          return ['student'];
        }
      }
      return Array.isArray(rawValue) ? rawValue : ['student'];
    }
  },
  authProviders: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Array of {provider, providerId, lastUsed}'
  },
  personalInfo: {
    type: DataTypes.JSON,
    defaultValue: {},
    comment: 'Object with bio, heightCm, weightKg, fitnessGoals, etc.'
  },
  consents: {
    type: DataTypes.JSON,
    defaultValue: {
      termsAccepted: false,
      privacyAccepted: false,
      marketingOptIn: false,
      dataProcessingConsent: false
    }
  },
  lastLogin: {
    type: DataTypes.DATE,
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  // OTP Verification Fields
  otpCode: {
    type: DataTypes.STRING(6),
    allowNull: true,
    comment: 'Current OTP code for email/phone verification'
  },
  otpExpiry: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'OTP expiration timestamp'
  },
  isEmailVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: 'Email verification status'
  },
  isPhoneVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: 'Phone verification status'
  }
}, {
  tableName: 'users',
  timestamps: true,
  indexes: [
    { fields: ['createdAt'] }
  ]
});

// Instance methods
User.prototype.hasRole = function (role) {
  const roles = this.roles || [];
  return roles.includes(role);
};

User.prototype.isAdmin = function () {
  return this.hasRole('admin');
};

User.prototype.isInstructor = function () {
  return this.hasRole('instructor');
};

User.prototype.isManager = function () {
  return this.hasRole('manager');
};

module.exports = User;
