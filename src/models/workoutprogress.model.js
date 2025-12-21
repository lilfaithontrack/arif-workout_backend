const mongoose = require('mongoose');

const workoutProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  workoutId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workout',
    required: true,
    index: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    index: true
  },
  completed: {
    type: Boolean,
    default: false,
    index: true
  },
  reps: {
    type: Number,
    min: 0
  },
  weightKg: {
    type: Number,
    min: 0
  },
  durationSeconds: {
    type: Number,
    min: 0
  },
  performanceScore: {
    type: Number,
    min: 0,
    max: 100
  },
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced']
  },
  notes: {
    type: String,
    trim: true
  },
  caloriesBurned: {
    type: Number,
    min: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes
workoutProgressSchema.index({ userId: 1, workoutId: 1, createdAt: -1 });
workoutProgressSchema.index({ userId: 1, courseId: 1 });
workoutProgressSchema.index({ userId: 1, completed: 1 });

module.exports = mongoose.model('WorkoutProgress', workoutProgressSchema);
