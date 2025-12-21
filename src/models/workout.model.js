const mongoose = require('mongoose');

const foodRecommendationSchema = new mongoose.Schema({
  mealTime: {
    type: String,
    enum: ['pre-workout', 'post-workout', 'breakfast', 'lunch', 'dinner', 'snack'],
    required: true
  },
  foods: [{
    type: String,
    trim: true
  }]
}, { _id: false });

const workoutSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  durationMinutes: {
    type: Number,
    required: true,
    min: 1
  },
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    required: true
  },
  media: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Media'
  }],
  foodRecommendations: [foodRecommendationSchema],
  exercises: [{
    name: String,
    sets: Number,
    reps: Number,
    durationSeconds: Number,
    restSeconds: Number,
    instructions: String
  }],
  caloriesBurnEstimate: {
    type: Number,
    min: 0
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Indexes
workoutSchema.index({ createdBy: 1 });
workoutSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Workout', workoutSchema);
