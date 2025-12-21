const FoodLog = require('../models/foodlog.model');
const ActivityLog = require('../models/activitylog.model');
const WorkoutProgress = require('../models/workoutprogress.model');

// Food Log
exports.createFoodLog = async (req, res, next) => {
  try {
    const foodLog = new FoodLog({
      ...req.body,
      userId: req.userId
    });

    await foodLog.save();
    res.status(201).json({ success: true, message: 'Food log created', foodLog });
  } catch (error) {
    next(error);
  }
};

exports.getFoodLogs = async (req, res, next) => {
  try {
    const { startDate, endDate, mealType, page = 1, limit = 50 } = req.query;
    const query = { userId: req.userId };

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }
    if (mealType) query.mealType = mealType;

    const skip = (page - 1) * limit;
    const [logs, total] = await Promise.all([
      FoodLog.find(query).sort({ date: -1, createdAt: -1 }).limit(parseInt(limit)).skip(skip),
      FoodLog.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      logs,
      pagination: { total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    next(error);
  }
};

exports.updateFoodLog = async (req, res, next) => {
  try {
    const { id } = req.params;
    const foodLog = await FoodLog.findOneAndUpdate(
      { _id: id, userId: req.userId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!foodLog) {
      return res.status(404).json({ success: false, message: 'Food log not found' });
    }

    res.status(200).json({ success: true, message: 'Food log updated', foodLog });
  } catch (error) {
    next(error);
  }
};

exports.deleteFoodLog = async (req, res, next) => {
  try {
    const { id } = req.params;
    const foodLog = await FoodLog.findOneAndDelete({ _id: id, userId: req.userId });

    if (!foodLog) {
      return res.status(404).json({ success: false, message: 'Food log not found' });
    }

    res.status(200).json({ success: true, message: 'Food log deleted' });
  } catch (error) {
    next(error);
  }
};

// Activity Log
exports.createActivityLog = async (req, res, next) => {
  try {
    const activityLog = new ActivityLog({
      ...req.body,
      userId: req.userId
    });

    await activityLog.save();
    res.status(201).json({ success: true, message: 'Activity log created', activityLog });
  } catch (error) {
    next(error);
  }
};

exports.getActivityLogs = async (req, res, next) => {
  try {
    const { startDate, endDate, type, page = 1, limit = 50 } = req.query;
    const query = { userId: req.userId };

    if (startDate || endDate) {
      query.startTime = {};
      if (startDate) query.startTime.$gte = new Date(startDate);
      if (endDate) query.startTime.$lte = new Date(endDate);
    }
    if (type) query.type = type;

    const skip = (page - 1) * limit;
    const [logs, total] = await Promise.all([
      ActivityLog.find(query).sort({ startTime: -1 }).limit(parseInt(limit)).skip(skip),
      ActivityLog.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      logs,
      pagination: { total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    next(error);
  }
};

exports.updateActivityLog = async (req, res, next) => {
  try {
    const { id } = req.params;
    const activityLog = await ActivityLog.findOneAndUpdate(
      { _id: id, userId: req.userId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!activityLog) {
      return res.status(404).json({ success: false, message: 'Activity log not found' });
    }

    res.status(200).json({ success: true, message: 'Activity log updated', activityLog });
  } catch (error) {
    next(error);
  }
};

exports.deleteActivityLog = async (req, res, next) => {
  try {
    const { id } = req.params;
    const activityLog = await ActivityLog.findOneAndDelete({ _id: id, userId: req.userId });

    if (!activityLog) {
      return res.status(404).json({ success: false, message: 'Activity log not found' });
    }

    res.status(200).json({ success: true, message: 'Activity log deleted' });
  } catch (error) {
    next(error);
  }
};

// Workout Progress
exports.createWorkoutProgress = async (req, res, next) => {
  try {
    const progress = new WorkoutProgress({
      ...req.body,
      userId: req.userId
    });

    await progress.save();
    res.status(201).json({ success: true, message: 'Workout progress recorded', progress });
  } catch (error) {
    next(error);
  }
};

exports.getWorkoutProgress = async (req, res, next) => {
  try {
    const { workoutId, courseId, completed, page = 1, limit = 50 } = req.query;
    const query = { userId: req.userId };

    if (workoutId) query.workoutId = workoutId;
    if (courseId) query.courseId = courseId;
    if (completed !== undefined) query.completed = completed === 'true';

    const skip = (page - 1) * limit;
    const [progress, total] = await Promise.all([
      WorkoutProgress.find(query)
        .populate('workoutId', 'name durationMinutes level')
        .populate('courseId', 'title')
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))
        .skip(skip),
      WorkoutProgress.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      progress,
      pagination: { total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    next(error);
  }
};

exports.updateWorkoutProgress = async (req, res, next) => {
  try {
    const { id } = req.params;
    const progress = await WorkoutProgress.findOneAndUpdate(
      { _id: id, userId: req.userId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!progress) {
      return res.status(404).json({ success: false, message: 'Workout progress not found' });
    }

    res.status(200).json({ success: true, message: 'Workout progress updated', progress });
  } catch (error) {
    next(error);
  }
};

// Analytics
exports.getAnalytics = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const dateQuery = {};
    
    if (startDate) dateQuery.$gte = new Date(startDate);
    if (endDate) dateQuery.$lte = new Date(endDate);

    const [foodStats, activityStats, workoutStats] = await Promise.all([
      FoodLog.aggregate([
        { $match: { userId: req.userId, ...(Object.keys(dateQuery).length && { date: dateQuery }) } },
        {
          $group: {
            _id: null,
            totalCalories: { $sum: '$totalCalories' },
            totalProtein: { $sum: '$totalProtein' },
            totalCarbs: { $sum: '$totalCarbs' },
            totalFat: { $sum: '$totalFat' },
            count: { $sum: 1 }
          }
        }
      ]),
      ActivityLog.aggregate([
        { $match: { userId: req.userId, ...(Object.keys(dateQuery).length && { startTime: dateQuery }) } },
        {
          $group: {
            _id: '$type',
            totalDistance: { $sum: '$distanceMeters' },
            totalDuration: { $sum: '$durationSeconds' },
            totalCalories: { $sum: '$caloriesBurned' },
            count: { $sum: 1 }
          }
        }
      ]),
      WorkoutProgress.aggregate([
        { $match: { userId: req.userId, ...(Object.keys(dateQuery).length && { createdAt: dateQuery }) } },
        {
          $group: {
            _id: '$completed',
            count: { $sum: 1 },
            avgPerformance: { $avg: '$performanceScore' }
          }
        }
      ])
    ]);

    res.status(200).json({
      success: true,
      analytics: {
        food: foodStats[0] || {},
        activity: activityStats,
        workouts: workoutStats
      }
    });
  } catch (error) {
    next(error);
  }
};
