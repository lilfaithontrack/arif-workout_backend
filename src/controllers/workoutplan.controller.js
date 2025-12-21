const { WorkoutPlan, Exercise, User } = require('../models');
const { Op } = require('sequelize');

/**
 * Get all workout plans for authenticated user
 */
exports.getUserWorkoutPlans = async (req, res, next) => {
  try {
    const { status, goal, level } = req.query;
    const where = { userId: req.user.id };

    if (status) where.status = status;
    if (goal) where.goal = goal;
    if (level) where.level = level;

    const plans = await WorkoutPlan.findAll({
      where,
      include: [
        {
          model: User,
          as: 'instructor',
          attributes: ['id', 'name', 'email']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      count: plans.length,
      data: { plans }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single workout plan by ID
 */
exports.getWorkoutPlan = async (req, res, next) => {
  try {
    const plan = await WorkoutPlan.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      },
      include: [
        {
          model: User,
          as: 'instructor',
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Workout plan not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { plan }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create workout plan
 */
exports.createWorkoutPlan = async (req, res, next) => {
  try {
    const {
      userId,
      name,
      description,
      goal,
      level,
      durationWeeks,
      daysPerWeek,
      workoutSchedule,
      notes
    } = req.body;

    // If instructor is creating for client
    const targetUserId = req.user.isInstructor() && userId ? userId : req.user.id;

    const plan = await WorkoutPlan.create({
      userId: targetUserId,
      instructorId: req.user.isInstructor() ? req.user.id : null,
      name,
      description,
      goal,
      level,
      durationWeeks,
      daysPerWeek,
      workoutSchedule: workoutSchedule || [],
      totalWorkouts: (workoutSchedule?.length || 0),
      notes,
      status: 'draft'
    });

    res.status(201).json({
      success: true,
      message: 'Workout plan created successfully',
      data: { plan }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update workout plan
 */
exports.updateWorkoutPlan = async (req, res, next) => {
  try {
    const plan = await WorkoutPlan.findOne({
      where: {
        id: req.params.id,
        [Op.or]: [
          { userId: req.user.id },
          { instructorId: req.user.id }
        ]
      }
    });

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Workout plan not found'
      });
    }

    const {
      name,
      description,
      goal,
      level,
      durationWeeks,
      daysPerWeek,
      workoutSchedule,
      status,
      notes
    } = req.body;

    await plan.update({
      name: name || plan.name,
      description: description || plan.description,
      goal: goal || plan.goal,
      level: level || plan.level,
      durationWeeks: durationWeeks || plan.durationWeeks,
      daysPerWeek: daysPerWeek || plan.daysPerWeek,
      workoutSchedule: workoutSchedule || plan.workoutSchedule,
      totalWorkouts: workoutSchedule ? workoutSchedule.length : plan.totalWorkouts,
      status: status || plan.status,
      notes: notes !== undefined ? notes : plan.notes
    });

    res.status(200).json({
      success: true,
      message: 'Workout plan updated successfully',
      data: { plan }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Start workout plan
 */
exports.startWorkoutPlan = async (req, res, next) => {
  try {
    const plan = await WorkoutPlan.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Workout plan not found'
      });
    }

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + (plan.durationWeeks * 7));

    await plan.update({
      status: 'active',
      startDate,
      endDate
    });

    res.status(200).json({
      success: true,
      message: 'Workout plan started successfully',
      data: { plan }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Complete workout plan
 */
exports.completeWorkoutPlan = async (req, res, next) => {
  try {
    const plan = await WorkoutPlan.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Workout plan not found'
      });
    }

    await plan.update({
      status: 'completed',
      progressPercentage: 100
    });

    res.status(200).json({
      success: true,
      message: 'Workout plan completed! Congratulations!',
      data: { plan }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete workout plan
 */
exports.deleteWorkoutPlan = async (req, res, next) => {
  try {
    const plan = await WorkoutPlan.findOne({
      where: {
        id: req.params.id,
        [Op.or]: [
          { userId: req.user.id },
          { instructorId: req.user.id }
        ]
      }
    });

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Workout plan not found'
      });
    }

    await plan.destroy();

    res.status(200).json({
      success: true,
      message: 'Workout plan deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get workout plan statistics
 */
exports.getWorkoutPlanStats = async (req, res, next) => {
  try {
    const plans = await WorkoutPlan.findAll({
      where: { userId: req.user.id }
    });

    const stats = {
      total: plans.length,
      active: plans.filter(p => p.status === 'active').length,
      completed: plans.filter(p => p.status === 'completed').length,
      draft: plans.filter(p => p.status === 'draft').length,
      paused: plans.filter(p => p.status === 'paused').length,
      totalWorkoutsCompleted: plans.reduce((sum, p) => sum + p.completedWorkouts, 0),
      averageProgress: plans.length > 0 
        ? plans.reduce((sum, p) => sum + parseFloat(p.progressPercentage), 0) / plans.length 
        : 0
    };

    res.status(200).json({
      success: true,
      data: { stats }
    });
  } catch (error) {
    next(error);
  }
};
