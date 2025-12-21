const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const NutritionLog = sequelize.define('NutritionLog', {
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
  mealType: {
    type: DataTypes.ENUM('breakfast', 'lunch', 'dinner', 'snack', 'pre_workout', 'post_workout'),
    allowNull: false
  },
  foodName: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  servingSize: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: 'e.g., 1 cup, 100g, 1 piece'
  },
  calories: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  protein: {
    type: DataTypes.DECIMAL(6, 2),
    allowNull: true,
    defaultValue: 0,
    comment: 'Protein in grams'
  },
  carbs: {
    type: DataTypes.DECIMAL(6, 2),
    allowNull: true,
    defaultValue: 0,
    comment: 'Carbohydrates in grams'
  },
  fats: {
    type: DataTypes.DECIMAL(6, 2),
    allowNull: true,
    defaultValue: 0,
    comment: 'Fats in grams'
  },
  fiber: {
    type: DataTypes.DECIMAL(6, 2),
    allowNull: true,
    defaultValue: 0,
    comment: 'Fiber in grams'
  },
  sugar: {
    type: DataTypes.DECIMAL(6, 2),
    allowNull: true,
    defaultValue: 0,
    comment: 'Sugar in grams'
  },
  sodium: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
    comment: 'Sodium in mg'
  },
  vitamins: {
    type: DataTypes.JSON,
    defaultValue: {},
    comment: 'Vitamin content {vitaminA, vitaminC, etc.}'
  },
  minerals: {
    type: DataTypes.JSON,
    defaultValue: {},
    comment: 'Mineral content {calcium, iron, etc.}'
  },
  waterIntake: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
    comment: 'Water intake in ml'
  },
  imageUrl: {
    type: DataTypes.STRING(500),
    allowNull: true,
    comment: 'Photo of the meal'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'nutrition_logs',
  timestamps: true,
  indexes: [
    { fields: ['userId', 'date'] },
    { fields: ['mealType'] },
    { fields: ['date'] }
  ]
});

module.exports = NutritionLog;
