const Habit = require('../models/habit.model');
const HabitCompletion = require('../models/habitcompletion.model');
const { Op } = require('sequelize');
const { sequelize } = require('../config/database');

exports.createHabit = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const {
      name,
      description,
      category,
      frequency,
      targetCount,
      icon,
      color,
      reminderEnabled,
      reminderTime,
      startDate,
      notes
    } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Habit name is required'
      });
    }

    const habit = await Habit.create({
      userId,
      name,
      description,
      category: category || 'custom',
      frequency: frequency || 'daily',
      targetCount: targetCount || 1,
      icon,
      color,
      reminderEnabled: reminderEnabled || false,
      reminderTime,
      startDate: startDate || new Date(),
      notes,
      isActive: true
    });

    res.status(201).json({
      success: true,
      message: 'Habit created successfully',
      data: { habit }
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllHabits = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { category, isActive, isArchived } = req.query;

    const where = { userId };
    
    if (category) where.category = category;
    if (isActive !== undefined) where.isActive = isActive === 'true';
    if (isArchived !== undefined) where.isArchived = isArchived === 'true';

    const habits = await Habit.findAll({
      where,
      order: [['createdAt', 'DESC']]
    });

    const habitsWithToday = await Promise.all(habits.map(async (habit) => {
      const today = new Date().toISOString().split('T')[0];
      const completedToday = await HabitCompletion.findOne({
        where: {
          habitId: habit.id,
          completionDate: today
        }
      });

      return {
        ...habit.toJSON(),
        completedToday: !!completedToday
      };
    }));

    res.status(200).json({
      success: true,
      data: {
        habits: habitsWithToday,
        total: habits.length
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getHabitById = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { habitId } = req.params;

    const habit = await Habit.findOne({
      where: { id: habitId, userId }
    });

    if (!habit) {
      return res.status(404).json({
        success: false,
        message: 'Habit not found'
      });
    }

    const completions = await HabitCompletion.findAll({
      where: { habitId: habit.id },
      order: [['completionDate', 'DESC']],
      limit: 30
    });

    res.status(200).json({
      success: true,
      data: {
        habit,
        recentCompletions: completions
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.updateHabit = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { habitId } = req.params;
    const updates = req.body;

    const habit = await Habit.findOne({
      where: { id: habitId, userId }
    });

    if (!habit) {
      return res.status(404).json({
        success: false,
        message: 'Habit not found'
      });
    }

    delete updates.userId;
    delete updates.currentStreak;
    delete updates.longestStreak;
    delete updates.totalCompletions;

    await habit.update(updates);

    res.status(200).json({
      success: true,
      message: 'Habit updated successfully',
      data: { habit }
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteHabit = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { habitId } = req.params;

    const habit = await Habit.findOne({
      where: { id: habitId, userId }
    });

    if (!habit) {
      return res.status(404).json({
        success: false,
        message: 'Habit not found'
      });
    }

    await HabitCompletion.destroy({
      where: { habitId: habit.id }
    });

    await habit.destroy();

    res.status(200).json({
      success: true,
      message: 'Habit deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

exports.archiveHabit = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { habitId } = req.params;

    const habit = await Habit.findOne({
      where: { id: habitId, userId }
    });

    if (!habit) {
      return res.status(404).json({
        success: false,
        message: 'Habit not found'
      });
    }

    await habit.update({ isArchived: true, isActive: false });

    res.status(200).json({
      success: true,
      message: 'Habit archived successfully',
      data: { habit }
    });
  } catch (error) {
    next(error);
  }
};

exports.completeHabit = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { habitId } = req.params;
    const { notes, mood, difficulty, value, completionDate } = req.body;

    const habit = await Habit.findOne({
      where: { id: habitId, userId }
    });

    if (!habit) {
      return res.status(404).json({
        success: false,
        message: 'Habit not found'
      });
    }

    const today = completionDate || new Date().toISOString().split('T')[0];

    const existingCompletion = await HabitCompletion.findOne({
      where: {
        habitId: habit.id,
        completionDate: today
      }
    });

    if (existingCompletion) {
      return res.status(400).json({
        success: false,
        message: 'Habit already completed for this date'
      });
    }

    const completion = await HabitCompletion.create({
      habitId: habit.id,
      userId,
      completionDate: today,
      completedAt: new Date(),
      notes,
      mood,
      difficulty,
      value
    });

    const updatedStreak = await calculateStreak(habit.id);
    
    await habit.update({
      currentStreak: updatedStreak.currentStreak,
      longestStreak: Math.max(habit.longestStreak, updatedStreak.currentStreak),
      totalCompletions: habit.totalCompletions + 1,
      lastCompletedAt: new Date()
    });

    const updatedHabit = await Habit.findByPk(habit.id);

    res.status(201).json({
      success: true,
      message: 'Habit completed successfully',
      data: {
        completion,
        habit: updatedHabit,
        streak: updatedStreak
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.uncompleteHabit = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { habitId } = req.params;
    const { completionDate } = req.body;

    const habit = await Habit.findOne({
      where: { id: habitId, userId }
    });

    if (!habit) {
      return res.status(404).json({
        success: false,
        message: 'Habit not found'
      });
    }

    const today = completionDate || new Date().toISOString().split('T')[0];

    const completion = await HabitCompletion.findOne({
      where: {
        habitId: habit.id,
        completionDate: today
      }
    });

    if (!completion) {
      return res.status(404).json({
        success: false,
        message: 'No completion found for this date'
      });
    }

    await completion.destroy();

    const updatedStreak = await calculateStreak(habit.id);
    
    await habit.update({
      currentStreak: updatedStreak.currentStreak,
      longestStreak: habit.longestStreak,
      totalCompletions: Math.max(0, habit.totalCompletions - 1)
    });

    const updatedHabit = await Habit.findByPk(habit.id);

    res.status(200).json({
      success: true,
      message: 'Habit completion removed',
      data: {
        habit: updatedHabit,
        streak: updatedStreak
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getHabitStatistics = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { habitId } = req.params;
    const { period } = req.query;

    const habit = await Habit.findOne({
      where: { id: habitId, userId }
    });

    if (!habit) {
      return res.status(404).json({
        success: false,
        message: 'Habit not found'
      });
    }

    const days = period === 'week' ? 7 : period === 'month' ? 30 : period === 'year' ? 365 : 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const completions = await HabitCompletion.findAll({
      where: {
        habitId: habit.id,
        completionDate: {
          [Op.gte]: startDate.toISOString().split('T')[0]
        }
      },
      order: [['completionDate', 'ASC']]
    });

    const completionRate = (completions.length / days) * 100;
    
    const moodDistribution = completions.reduce((acc, c) => {
      if (c.mood) {
        acc[c.mood] = (acc[c.mood] || 0) + 1;
      }
      return acc;
    }, {});

    const difficultyDistribution = completions.reduce((acc, c) => {
      if (c.difficulty) {
        acc[c.difficulty] = (acc[c.difficulty] || 0) + 1;
      }
      return acc;
    }, {});

    const streak = await calculateStreak(habit.id);

    const stats = {
      habit: {
        id: habit.id,
        name: habit.name,
        category: habit.category,
        frequency: habit.frequency
      },
      period: {
        days,
        startDate: startDate.toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0]
      },
      completions: {
        total: completions.length,
        rate: completionRate.toFixed(2),
        byDate: completions.map(c => ({
          date: c.completionDate,
          mood: c.mood,
          difficulty: c.difficulty,
          value: c.value,
          notes: c.notes
        }))
      },
      streak: {
        current: streak.currentStreak,
        longest: habit.longestStreak,
        lastCompleted: habit.lastCompletedAt
      },
      insights: {
        moodDistribution,
        difficultyDistribution,
        averageValue: completions.filter(c => c.value).length > 0
          ? (completions.reduce((sum, c) => sum + (c.value || 0), 0) / completions.filter(c => c.value).length).toFixed(2)
          : null
      }
    };

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};

exports.getDashboard = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const habits = await Habit.findAll({
      where: { userId, isActive: true, isArchived: false }
    });

    const today = new Date().toISOString().split('T')[0];

    const todayCompletions = await HabitCompletion.findAll({
      where: {
        userId,
        completionDate: today
      }
    });

    const completedHabitIds = new Set(todayCompletions.map(c => c.habitId));

    const habitsWithStatus = habits.map(habit => ({
      ...habit.toJSON(),
      completedToday: completedHabitIds.has(habit.id)
    }));

    const totalHabits = habits.length;
    const completedToday = todayCompletions.length;
    const completionRate = totalHabits > 0 ? ((completedToday / totalHabits) * 100).toFixed(2) : 0;

    const totalStreak = habits.reduce((sum, h) => sum + h.currentStreak, 0);
    const totalCompletions = habits.reduce((sum, h) => sum + h.totalCompletions, 0);

    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayCompletions = await HabitCompletion.count({
        where: {
          userId,
          completionDate: dateStr
        }
      });

      last7Days.push({
        date: dateStr,
        completions: dayCompletions,
        rate: totalHabits > 0 ? ((dayCompletions / totalHabits) * 100).toFixed(2) : 0
      });
    }

    const categoryBreakdown = habits.reduce((acc, habit) => {
      acc[habit.category] = (acc[habit.category] || 0) + 1;
      return acc;
    }, {});

    res.status(200).json({
      success: true,
      data: {
        summary: {
          totalHabits,
          activeHabits: habits.filter(h => h.isActive).length,
          completedToday,
          completionRate,
          totalStreak,
          totalCompletions
        },
        habits: habitsWithStatus,
        weeklyProgress: last7Days,
        categoryBreakdown
      }
    });
  } catch (error) {
    next(error);
  }
};

async function calculateStreak(habitId) {
  const completions = await HabitCompletion.findAll({
    where: { habitId },
    order: [['completionDate', 'DESC']],
    attributes: ['completionDate']
  });

  if (completions.length === 0) {
    return { currentStreak: 0, lastCompletedDate: null };
  }

  let currentStreak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let checkDate = new Date(today);
  
  const completionDates = new Set(
    completions.map(c => new Date(c.completionDate).toISOString().split('T')[0])
  );

  while (true) {
    const dateStr = checkDate.toISOString().split('T')[0];
    
    if (completionDates.has(dateStr)) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      if (currentStreak === 0 && dateStr === today.toISOString().split('T')[0]) {
        checkDate.setDate(checkDate.getDate() - 1);
        continue;
      }
      break;
    }
  }

  return {
    currentStreak,
    lastCompletedDate: completions[0].completionDate
  };
}

module.exports = exports;
