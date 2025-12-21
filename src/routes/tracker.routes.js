const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const trackerController = require('../controllers/tracker.controller');
const { authenticate } = require('../middleware/auth');
const validate = require('../middleware/validate');

// All routes require authentication
router.use(authenticate);

// Food logs
router.post('/food-logs',
  [
    body('date').isISO8601(),
    body('mealType').isIn(['breakfast', 'lunch', 'dinner', 'snack', 'pre-workout', 'post-workout']),
    body('items').isArray()
  ],
  validate,
  trackerController.createFoodLog
);
router.get('/food-logs', trackerController.getFoodLogs);
router.put('/food-logs/:id', trackerController.updateFoodLog);
router.delete('/food-logs/:id', trackerController.deleteFoodLog);

// Activity logs
router.post('/activity-logs',
  [
    body('type').isIn(['running', 'walking', 'cycling', 'swimming', 'other']),
    body('durationSeconds').isInt({ min: 0 }),
    body('startTime').isISO8601(),
    body('endTime').isISO8601()
  ],
  validate,
  trackerController.createActivityLog
);
router.get('/activity-logs', trackerController.getActivityLogs);
router.put('/activity-logs/:id', trackerController.updateActivityLog);
router.delete('/activity-logs/:id', trackerController.deleteActivityLog);

// Workout progress
router.post('/workout-progress',
  [
    body('workoutId').isMongoId(),
    body('courseId').optional().isMongoId()
  ],
  validate,
  trackerController.createWorkoutProgress
);
router.get('/workout-progress', trackerController.getWorkoutProgress);
router.put('/workout-progress/:id', trackerController.updateWorkoutProgress);

// Analytics
router.get('/analytics', trackerController.getAnalytics);

module.exports = router;
