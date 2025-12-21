const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const BodyMeasurement = sequelize.define('BodyMeasurement', {
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
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  weight: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
    comment: 'Weight in kg'
  },
  height: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
    comment: 'Height in cm'
  },
  bmi: {
    type: DataTypes.DECIMAL(4, 2),
    allowNull: true,
    comment: 'Body Mass Index'
  },
  bodyFatPercentage: {
    type: DataTypes.DECIMAL(4, 2),
    allowNull: true,
    validate: {
      min: 0,
      max: 100
    }
  },
  muscleMassPercentage: {
    type: DataTypes.DECIMAL(4, 2),
    allowNull: true,
    validate: {
      min: 0,
      max: 100
    }
  },
  visceralFat: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Visceral fat level (1-59)'
  },
  boneMass: {
    type: DataTypes.DECIMAL(4, 2),
    allowNull: true,
    comment: 'Bone mass in kg'
  },
  waterPercentage: {
    type: DataTypes.DECIMAL(4, 2),
    allowNull: true,
    validate: {
      min: 0,
      max: 100
    }
  },
  metabolicAge: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Metabolic age in years'
  },
  basalMetabolicRate: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'BMR in calories per day'
  },
  // Body measurements in cm
  chest: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
    comment: 'Chest circumference in cm'
  },
  waist: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
    comment: 'Waist circumference in cm'
  },
  hips: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
    comment: 'Hip circumference in cm'
  },
  thighLeft: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true
  },
  thighRight: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true
  },
  calfLeft: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true
  },
  calfRight: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true
  },
  bicepLeft: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true
  },
  bicepRight: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true
  },
  forearmLeft: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true
  },
  forearmRight: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true
  },
  neck: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true
  },
  shoulders: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true
  },
  imageUrl: {
    type: DataTypes.STRING(500),
    allowNull: true,
    comment: 'Progress photo'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'body_measurements',
  timestamps: true,
  indexes: [
    { fields: ['userId', 'date'] },
    { fields: ['date'] }
  ]
});

module.exports = BodyMeasurement;
