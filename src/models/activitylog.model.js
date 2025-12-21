const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: ['running', 'walking', 'cycling', 'swimming', 'other'],
    required: true,
    index: true
  },
  distanceMeters: {
    type: Number,
    min: 0
  },
  durationSeconds: {
    type: Number,
    required: true,
    min: 0
  },
  steps: {
    type: Number,
    min: 0
  },
  startTime: {
    type: Date,
    required: true,
    index: true
  },
  endTime: {
    type: Date,
    required: true
  },
  pathGeoJSON: {
    type: mongoose.Schema.Types.Mixed
  },
  caloriesBurned: {
    type: Number,
    min: 0
  },
  averageHeartRate: {
    type: Number,
    min: 0
  },
  maxHeartRate: {
    type: Number,
    min: 0
  },
  averagePace: {
    type: Number,
    min: 0
  },
  elevation: {
    gain: { type: Number, default: 0 },
    loss: { type: Number, default: 0 }
  },
  notes: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes
activityLogSchema.index({ userId: 1, startTime: -1 });
activityLogSchema.index({ userId: 1, type: 1 });
activityLogSchema.index({ startTime: -1 });

module.exports = mongoose.model('ActivityLog', activityLogSchema);
