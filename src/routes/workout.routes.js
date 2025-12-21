const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const Workout = require('../models/workout.model');
const { authenticate } = require('../middleware/auth');
const { requireInstructor, requireAdmin } = require('../middleware/roles');
const validate = require('../middleware/validate');

// Get all workouts
router.get('/', async (req, res, next) => {
  try {
    const { level, search, page = 1, limit = 20 } = req.query;
    const query = {};

    if (level) query.level = level;
    if (search) {
      query.$text = { $search: search };
    }

    const skip = (page - 1) * limit;
    const [workouts, total] = await Promise.all([
      Workout.find(query)
        .populate('media')
        .populate('createdBy', 'name')
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))
        .skip(skip),
      Workout.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      workouts,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get single workout
router.get('/:id', async (req, res, next) => {
  try {
    const workout = await Workout.findById(req.params.id)
      .populate('media')
      .populate('createdBy', 'name');

    if (!workout) {
      return res.status(404).json({
        success: false,
        message: 'Workout not found'
      });
    }

    res.status(200).json({
      success: true,
      workout
    });
  } catch (error) {
    next(error);
  }
});

// Create workout (Instructor)
router.post('/',
  authenticate,
  requireInstructor,
  [
    body('name').trim().notEmpty(),
    body('durationMinutes').isInt({ min: 1 }),
    body('level').isIn(['beginner', 'intermediate', 'advanced'])
  ],
  validate,
  async (req, res, next) => {
    try {
      const workout = new Workout({
        ...req.body,
        createdBy: req.userId
      });

      await workout.save();

      res.status(201).json({
        success: true,
        message: 'Workout created',
        workout
      });
    } catch (error) {
      next(error);
    }
  }
);

// Update workout (Instructor/Admin)
router.put('/:id',
  authenticate,
  async (req, res, next) => {
    try {
      const workout = await Workout.findById(req.params.id);

      if (!workout) {
        return res.status(404).json({
          success: false,
          message: 'Workout not found'
        });
      }

      // Check ownership or admin
      if (workout.createdBy.toString() !== req.userId.toString() && !req.user.isAdmin()) {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }

      const updated = await Workout.findByIdAndUpdate(
        req.params.id,
        { ...req.body, updatedAt: new Date() },
        { new: true, runValidators: true }
      );

      res.status(200).json({
        success: true,
        message: 'Workout updated',
        workout: updated
      });
    } catch (error) {
      next(error);
    }
  }
);

// Delete workout (Instructor/Admin)
router.delete('/:id',
  authenticate,
  async (req, res, next) => {
    try {
      const workout = await Workout.findById(req.params.id);

      if (!workout) {
        return res.status(404).json({
          success: false,
          message: 'Workout not found'
        });
      }

      // Check ownership or admin
      if (workout.createdBy.toString() !== req.userId.toString() && !req.user.isAdmin()) {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }

      await Workout.findByIdAndDelete(req.params.id);

      res.status(200).json({
        success: true,
        message: 'Workout deleted'
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
