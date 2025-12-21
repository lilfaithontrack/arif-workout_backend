const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const NutritionItem = sequelize.define('NutritionItem', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  foodId: {
    type: DataTypes.STRING(50),
    unique: true,
    allowNull: false,
    comment: 'Unique identifier (e.g., food_001)'
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: 'Food name'
  },
  slug: {
    type: DataTypes.STRING(255),
    unique: true,
    allowNull: false,
    comment: 'URL-friendly slug'
  },
  category: {
    type: DataTypes.ENUM('protein', 'carbs', 'fats', 'vegetables', 'fruits', 'dairy', 'grains', 'snacks', 'beverages'),
    allowNull: false,
    comment: 'Food category'
  },
  servingSize: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: 'Standard serving size (e.g., 100g, 1 cup)'
  },
  // Macronutrients
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
  // Micronutrients (stored as JSON)
  vitamins: {
    type: DataTypes.JSON,
    defaultValue: {},
    comment: 'Vitamin content {A, B6, B12, C, D, E, K, etc.}'
  },
  minerals: {
    type: DataTypes.JSON,
    defaultValue: {},
    comment: 'Mineral content {calcium, iron, magnesium, etc.}'
  },
  // Dietary Information
  isVegetarian: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  isVegan: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  isGlutenFree: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  isDairyFree: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  isKeto: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  allergens: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'List of allergens (e.g., ["nuts", "dairy", "eggs"])'
  },
  // Meal Types
  mealTypes: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Suitable meal types (e.g., ["breakfast", "lunch", "snack"])'
  },
  // Goals
  goals: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Fitness goals (e.g., ["muscle_gain", "weight_loss"])'
  },
  // Additional Info
  preparationTime: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Preparation time in minutes'
  },
  cost: {
    type: DataTypes.ENUM('low', 'medium', 'high'),
    allowNull: true,
    comment: 'Relative cost'
  },
  tags: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Tags for filtering (e.g., ["high_protein", "low_carb"])'
  },
  popularityScore: {
    type: DataTypes.INTEGER,
    defaultValue: 50,
    comment: 'Popularity score (0-100)'
  },
  // Media
  imageUrl: {
    type: DataTypes.STRING(500),
    allowNull: true,
    comment: 'Main image URL'
  },
  thumbnailUrl: {
    type: DataTypes.STRING(500),
    allowNull: true,
    comment: 'Thumbnail image URL'
  },
  videoUrl: {
    type: DataTypes.STRING(500),
    allowNull: true,
    comment: 'Preparation/demo video URL'
  },
  // Status
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    comment: 'Whether this food item is active'
  },
  createdBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    },
    comment: 'User who created this entry'
  }
}, {
  tableName: 'nutrition_items',
  timestamps: true,
  indexes: [
    { fields: ['foodId'], unique: true },
    { fields: ['slug'], unique: true },
    { fields: ['category'] },
    { fields: ['isActive'] },
    { fields: ['popularityScore'] }
  ]
});

module.exports = NutritionItem;
