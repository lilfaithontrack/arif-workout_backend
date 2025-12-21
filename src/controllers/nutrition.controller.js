const { NutritionLog } = require('../models');
const { Op } = require('sequelize');
const { sequelize } = require('../config/database');
const fs = require('fs');
const path = require('path');

/**
 * Get nutrition logs with filters
 */
exports.getNutritionLogs = async (req, res, next) => {
  try {
    const { mealType, startDate, endDate, page = 1, limit = 50 } = req.query;
    const where = { userId: req.user.id };

    if (mealType) where.mealType = mealType;
    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date[Op.gte] = startDate;
      if (endDate) where.date[Op.lte] = endDate;
    }

    const offset = (page - 1) * limit;

    const { count, rows: logs } = await NutritionLog.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['date', 'DESC'], ['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      count,
      page: parseInt(page),
      totalPages: Math.ceil(count / limit),
      data: { logs }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single nutrition log
 */
exports.getNutritionLog = async (req, res, next) => {
  try {
    const log = await NutritionLog.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!log) {
      return res.status(404).json({
        success: false,
        message: 'Nutrition log not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { log }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Log a meal
 */
exports.logMeal = async (req, res, next) => {
  try {
    const {
      date,
      mealType,
      foodName,
      servingSize,
      calories,
      protein,
      carbs,
      fats,
      fiber,
      sugar,
      sodium,
      vitamins,
      minerals,
      waterIntake,
      imageUrl,
      notes
    } = req.body;

    const log = await NutritionLog.create({
      userId: req.user.id,
      date: date || new Date(),
      mealType,
      foodName,
      servingSize,
      calories,
      protein: protein || 0,
      carbs: carbs || 0,
      fats: fats || 0,
      fiber: fiber || 0,
      sugar: sugar || 0,
      sodium: sodium || 0,
      vitamins: vitamins || {},
      minerals: minerals || {},
      waterIntake: waterIntake || 0,
      imageUrl,
      notes
    });

    // Automatically create image folder for this food item
    try {
      // Create slug from food name
      const foodSlug = foodName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      const folderPath = path.join(__dirname, '../../public/images/nutrition', foodSlug);

      // Create folder if it doesn't exist
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
        console.log(`✅ Created nutrition folder: ${foodSlug}`);
      }
    } catch (folderError) {
      console.error('Error creating nutrition folder:', folderError);
      // Don't fail the nutrition log if folder creation fails
    }

    res.status(201).json({
      success: true,
      message: 'Meal logged successfully',
      data: { log }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update nutrition log
 */
exports.updateNutritionLog = async (req, res, next) => {
  try {
    const log = await NutritionLog.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!log) {
      return res.status(404).json({
        success: false,
        message: 'Nutrition log not found'
      });
    }

    const {
      date,
      mealType,
      foodName,
      servingSize,
      calories,
      protein,
      carbs,
      fats,
      fiber,
      sugar,
      sodium,
      vitamins,
      minerals,
      waterIntake,
      imageUrl,
      notes
    } = req.body;

    await log.update({
      date: date || log.date,
      mealType: mealType || log.mealType,
      foodName: foodName || log.foodName,
      servingSize: servingSize !== undefined ? servingSize : log.servingSize,
      calories: calories !== undefined ? calories : log.calories,
      protein: protein !== undefined ? protein : log.protein,
      carbs: carbs !== undefined ? carbs : log.carbs,
      fats: fats !== undefined ? fats : log.fats,
      fiber: fiber !== undefined ? fiber : log.fiber,
      sugar: sugar !== undefined ? sugar : log.sugar,
      sodium: sodium !== undefined ? sodium : log.sodium,
      vitamins: vitamins || log.vitamins,
      minerals: minerals || log.minerals,
      waterIntake: waterIntake !== undefined ? waterIntake : log.waterIntake,
      imageUrl: imageUrl !== undefined ? imageUrl : log.imageUrl,
      notes: notes !== undefined ? notes : log.notes
    });

    res.status(200).json({
      success: true,
      message: 'Nutrition log updated successfully',
      data: { log }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete nutrition log
 */
exports.deleteNutritionLog = async (req, res, next) => {
  try {
    const log = await NutritionLog.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!log) {
      return res.status(404).json({
        success: false,
        message: 'Nutrition log not found'
      });
    }

    await log.destroy();

    res.status(200).json({
      success: true,
      message: 'Nutrition log deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get daily nutrition summary
 */
exports.getDailySummary = async (req, res, next) => {
  try {
    const { date } = req.query;
    const targetDate = date ? new Date(date) : new Date();
    targetDate.setHours(0, 0, 0, 0);

    const logs = await NutritionLog.findAll({
      where: {
        userId: req.user.id,
        date: targetDate
      }
    });

    const summary = {
      date: targetDate,
      totalCalories: logs.reduce((sum, log) => sum + log.calories, 0),
      totalProtein: logs.reduce((sum, log) => sum + parseFloat(log.protein || 0), 0),
      totalCarbs: logs.reduce((sum, log) => sum + parseFloat(log.carbs || 0), 0),
      totalFats: logs.reduce((sum, log) => sum + parseFloat(log.fats || 0), 0),
      totalFiber: logs.reduce((sum, log) => sum + parseFloat(log.fiber || 0), 0),
      totalSugar: logs.reduce((sum, log) => sum + parseFloat(log.sugar || 0), 0),
      totalSodium: logs.reduce((sum, log) => sum + (log.sodium || 0), 0),
      totalWater: logs.reduce((sum, log) => sum + (log.waterIntake || 0), 0),
      mealCount: logs.length,
      mealsByType: {
        breakfast: logs.filter(l => l.mealType === 'breakfast').length,
        lunch: logs.filter(l => l.mealType === 'lunch').length,
        dinner: logs.filter(l => l.mealType === 'dinner').length,
        snack: logs.filter(l => l.mealType === 'snack').length,
        pre_workout: logs.filter(l => l.mealType === 'pre_workout').length,
        post_workout: logs.filter(l => l.mealType === 'post_workout').length
      }
    };

    res.status(200).json({
      success: true,
      data: { summary, logs }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get weekly nutrition summary
 */
exports.getWeeklySummary = async (req, res, next) => {
  try {
    const { startDate } = req.query;
    const start = startDate ? new Date(startDate) : new Date();
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() - start.getDay()); // Start of week

    const end = new Date(start);
    end.setDate(end.getDate() + 7);

    const logs = await NutritionLog.findAll({
      where: {
        userId: req.user.id,
        date: {
          [Op.between]: [start, end]
        }
      },
      order: [['date', 'ASC']]
    });

    const dailySummaries = {};
    for (let i = 0; i < 7; i++) {
      const date = new Date(start);
      date.setDate(date.getDate() + i);
      const dateKey = date.toISOString().split('T')[0];

      const dayLogs = logs.filter(log =>
        log.date.toISOString().split('T')[0] === dateKey
      );

      dailySummaries[dateKey] = {
        date: dateKey,
        totalCalories: dayLogs.reduce((sum, log) => sum + log.calories, 0),
        totalProtein: dayLogs.reduce((sum, log) => sum + parseFloat(log.protein || 0), 0),
        totalCarbs: dayLogs.reduce((sum, log) => sum + parseFloat(log.carbs || 0), 0),
        totalFats: dayLogs.reduce((sum, log) => sum + parseFloat(log.fats || 0), 0),
        mealCount: dayLogs.length
      };
    }

    const weeklyTotals = {
      totalCalories: logs.reduce((sum, log) => sum + log.calories, 0),
      totalProtein: logs.reduce((sum, log) => sum + parseFloat(log.protein || 0), 0),
      totalCarbs: logs.reduce((sum, log) => sum + parseFloat(log.carbs || 0), 0),
      totalFats: logs.reduce((sum, log) => sum + parseFloat(log.fats || 0), 0),
      averageCaloriesPerDay: logs.length > 0 ? logs.reduce((sum, log) => sum + log.calories, 0) / 7 : 0,
      totalMeals: logs.length
    };

    res.status(200).json({
      success: true,
      data: {
        weekStart: start,
        weekEnd: end,
        dailySummaries,
        weeklyTotals
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get nutrition statistics
 */
exports.getNutritionStats = async (req, res, next) => {
  try {
    const { period = '30' } = req.query; // days
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));

    const logs = await NutritionLog.findAll({
      where: {
        userId: req.user.id,
        date: {
          [Op.gte]: startDate
        }
      }
    });

    const stats = {
      totalMeals: logs.length,
      averageCaloriesPerDay: logs.length > 0 ? logs.reduce((sum, log) => sum + log.calories, 0) / parseInt(period) : 0,
      averageProteinPerDay: logs.length > 0 ? logs.reduce((sum, log) => sum + parseFloat(log.protein || 0), 0) / parseInt(period) : 0,
      averageCarbsPerDay: logs.length > 0 ? logs.reduce((sum, log) => sum + parseFloat(log.carbs || 0), 0) / parseInt(period) : 0,
      averageFatsPerDay: logs.length > 0 ? logs.reduce((sum, log) => sum + parseFloat(log.fats || 0), 0) / parseInt(period) : 0,
      totalWaterIntake: logs.reduce((sum, log) => sum + (log.waterIntake || 0), 0),
      mealTypeDistribution: {
        breakfast: logs.filter(l => l.mealType === 'breakfast').length,
        lunch: logs.filter(l => l.mealType === 'lunch').length,
        dinner: logs.filter(l => l.mealType === 'dinner').length,
        snack: logs.filter(l => l.mealType === 'snack').length,
        pre_workout: logs.filter(l => l.mealType === 'pre_workout').length,
        post_workout: logs.filter(l => l.mealType === 'post_workout').length
      }
    };

    res.status(200).json({
      success: true,
      period: parseInt(period),
      data: { stats }
    });
  } catch (error) {
    next(error);
  }
};
