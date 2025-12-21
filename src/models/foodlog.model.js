const mongoose = require('mongoose');

const foodItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  servingSize: {
    type: String,
    trim: true
  },
  calories: {
    type: Number,
    min: 0
  },
  proteinGrams: {
    type: Number,
    min: 0
  },
  carbsGrams: {
    type: Number,
    min: 0
  },
  fatGrams: {
    type: Number,
    min: 0
  },
  fiberGrams: {
    type: Number,
    min: 0
  }
}, { _id: false });

const foodLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  date: {
    type: Date,
    required: true,
    index: true
  },
  mealType: {
    type: String,
    enum: ['breakfast', 'lunch', 'dinner', 'snack', 'pre-workout', 'post-workout'],
    required: true
  },
  items: [foodItemSchema],
  notes: {
    type: String,
    trim: true
  },
  totalCalories: {
    type: Number,
    default: 0
  },
  totalProtein: {
    type: Number,
    default: 0
  },
  totalCarbs: {
    type: Number,
    default: 0
  },
  totalFat: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes
foodLogSchema.index({ userId: 1, date: -1 });
foodLogSchema.index({ userId: 1, mealType: 1 });

// Pre-save hook to calculate totals
foodLogSchema.pre('save', function(next) {
  if (this.items && this.items.length > 0) {
    this.totalCalories = this.items.reduce((sum, item) => sum + (item.calories || 0), 0);
    this.totalProtein = this.items.reduce((sum, item) => sum + (item.proteinGrams || 0), 0);
    this.totalCarbs = this.items.reduce((sum, item) => sum + (item.carbsGrams || 0), 0);
    this.totalFat = this.items.reduce((sum, item) => sum + (item.fatGrams || 0), 0);
  }
  next();
});

module.exports = mongoose.model('FoodLog', foodLogSchema);
