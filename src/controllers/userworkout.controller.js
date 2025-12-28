const { UserWorkout, Exercise, WorkoutPlan, User } = require('../models');
const { Op } = require('sequelize');
const { sequelize } = require('../config/database');

/**
 * Get user's workouts with filters
 */
exports.getUserWorkouts = async (req, res, next) => {
  try {
    const { status, startDate, endDate, exerciseId, page = 1, limit = 20 } = req.query;
    const where = { userId: req.user.id };

    if (status) where.status = status;
    if (exerciseId) where.exerciseId = exerciseId;
    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date[Op.gte] = startDate;
      if (endDate) where.date[Op.lte] = endDate;
    }

    const offset = (page - 1) * limit;

    const { count, rows: workouts } = await UserWorkout.findAndCountAll({
      where,
      include: [
        {
          model: Exercise,
          as: 'exercise',
          attributes: ['id', 'name', 'category', 'muscleGroups']
        },
        {
          model: WorkoutPlan,
          as: 'plan',
          attributes: ['id', 'name']
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['date', 'DESC'], ['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      count,
      page: parseInt(page),
      totalPages: Math.ceil(count / limit),
      data: { workouts }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single workout
 */
exports.getWorkout = async (req, res, next) => {
  try {
    const workout = await UserWorkout.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      },
      include: [
        {
          model: Exercise,
          as: 'exercise'
        },
        {
          model: WorkoutPlan,
          as: 'plan'
        }
      ]
    });

    if (!workout) {
      return res.status(404).json({
        success: false,
        message: 'Workout not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { workout }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Log a workout
 */
exports.logWorkout = async (req, res, next) => {
  try {
    const {
      workoutPlanId,
      exerciseId,
      date,
      startTime,
      endTime,
      duration,
      sets,
      reps,
      weight,
      distance,
      caloriesBurned,
      heartRateAvg,
      heartRateMax,
      intensity,
      rating,
      notes,
      mood
    } = req.body;

    // Allow status to be passed, default to 'completed' for backward compatibility
    const workoutStatus = req.body.status || 'completed';
    
    const workout = await UserWorkout.create({
      userId: req.user.id,
      workoutPlanId,
      exerciseId,
      date: date || new Date(),
      startTime,
      endTime,
      duration,
      sets,
      reps,
      weight,
      distance,
      caloriesBurned,
      heartRateAvg,
      heartRateMax,
      intensity,
      status: workoutStatus, // Use provided status or default to 'completed'
      rating,
      notes,
      mood
    });

    // Update workout plan progress if applicable
    if (workoutPlanId) {
      const plan = await WorkoutPlan.findByPk(workoutPlanId);
      if (plan) {
        const completedWorkouts = plan.completedWorkouts + 1;
        const progressPercentage = (completedWorkouts / plan.totalWorkouts) * 100;
        await plan.update({
          completedWorkouts,
          progressPercentage: Math.min(progressPercentage, 100)
        });
      }
    }

    const workoutWithDetails = await UserWorkout.findByPk(workout.id, {
      include: [
        {
          model: Exercise,
          as: 'exercise'
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Workout logged successfully',
      data: { workout: workoutWithDetails }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update workout
 */
exports.updateWorkout = async (req, res, next) => {
  try {
    const workout = await UserWorkout.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!workout) {
      return res.status(404).json({
        success: false,
        message: 'Workout not found'
      });
    }

    const {
      date,
      startTime,
      endTime,
      duration,
      sets,
      reps,
      weight,
      distance,
      caloriesBurned,
      heartRateAvg,
      heartRateMax,
      intensity,
      status,
      rating,
      notes,
      mood
    } = req.body;

    await workout.update({
      date: date || workout.date,
      startTime: startTime !== undefined ? startTime : workout.startTime,
      endTime: endTime !== undefined ? endTime : workout.endTime,
      duration: duration !== undefined ? duration : workout.duration,
      sets: sets !== undefined ? sets : workout.sets,
      reps: reps !== undefined ? reps : workout.reps,
      weight: weight !== undefined ? weight : workout.weight,
      distance: distance !== undefined ? distance : workout.distance,
      caloriesBurned: caloriesBurned !== undefined ? caloriesBurned : workout.caloriesBurned,
      heartRateAvg: heartRateAvg !== undefined ? heartRateAvg : workout.heartRateAvg,
      heartRateMax: heartRateMax !== undefined ? heartRateMax : workout.heartRateMax,
      intensity: intensity || workout.intensity,
      status: status || workout.status,
      rating: rating !== undefined ? rating : workout.rating,
      notes: notes !== undefined ? notes : workout.notes,
      mood: mood || workout.mood
    });

    res.status(200).json({
      success: true,
      message: 'Workout updated successfully',
      data: { workout }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete workout
 */
exports.deleteWorkout = async (req, res, next) => {
  try {
    const workout = await UserWorkout.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!workout) {
      return res.status(404).json({
        success: false,
        message: 'Workout not found'
      });
    }

    await workout.destroy();

    res.status(200).json({
      success: true,
      message: 'Workout deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get workout statistics
 */
exports.getWorkoutStats = async (req, res, next) => {
  try {
    const { period = '30' } = req.query; // days
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));

    const workouts = await UserWorkout.findAll({
      where: {
        userId: req.user.id,
        date: {
          [Op.gte]: startDate
        },
        status: 'completed'
      }
    });

    const stats = {
      totalWorkouts: workouts.length,
      totalDuration: workouts.reduce((sum, w) => sum + (w.duration || 0), 0),
      totalCalories: workouts.reduce((sum, w) => sum + (w.caloriesBurned || 0), 0),
      totalDistance: workouts.reduce((sum, w) => sum + (parseFloat(w.distance) || 0), 0),
      averageRating: workouts.length > 0 
        ? workouts.filter(w => w.rating).reduce((sum, w) => sum + w.rating, 0) / workouts.filter(w => w.rating).length 
        : 0,
      workoutsByCategory: {},
      workoutStreak: 0
    };

    // Calculate workout streak
    const sortedDates = [...new Set(workouts.map(w => w.date.toISOString().split('T')[0]))].sort().reverse();
    let streak = 0;
    let currentDate = new Date();
    
    for (const date of sortedDates) {
      const workoutDate = new Date(date);
      const diffDays = Math.floor((currentDate - workoutDate) / (1000 * 60 * 60 * 24));
      
      if (diffDays === streak) {
        streak++;
        currentDate = workoutDate;
      } else {
        break;
      }
    }
    stats.workoutStreak = streak;

    res.status(200).json({
      success: true,
      period: parseInt(period),
      data: { stats }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get workout calendar (workouts by date)
 */
exports.getWorkoutCalendar = async (req, res, next) => {
  try {
    const { month, year } = req.query;
    const currentDate = new Date();
    const targetMonth = month ? parseInt(month) - 1 : currentDate.getMonth();
    const targetYear = year ? parseInt(year) : currentDate.getFullYear();

    const startDate = new Date(targetYear, targetMonth, 1);
    const endDate = new Date(targetYear, targetMonth + 1, 0);

    const workouts = await UserWorkout.findAll({
      where: {
        userId: req.user.id,
        date: {
          [Op.between]: [startDate, endDate]
        }
      },
      include: [
        {
          model: Exercise,
          as: 'exercise',
          attributes: ['id', 'name', 'category']
        }
      ],
      order: [['date', 'ASC']]
    });

    // Group by date
    const calendar = {};
    workouts.forEach(workout => {
      const dateKey = workout.date.toISOString().split('T')[0];
      if (!calendar[dateKey]) {
        calendar[dateKey] = [];
      }
      calendar[dateKey].push(workout);
    });

    res.status(200).json({
      success: true,
      month: targetMonth + 1,
      year: targetYear,
      data: { calendar }
    });
  } catch (error) {
    next(error);
  }
};
