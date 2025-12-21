const { BodyMeasurement } = require('../models');
const { Op } = require('sequelize');

/**
 * Get all body measurements
 */
exports.getBodyMeasurements = async (req, res, next) => {
  try {
    const { startDate, endDate, limit = 50 } = req.query;
    const where = { userId: req.user.id };

    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date[Op.gte] = startDate;
      if (endDate) where.date[Op.lte] = endDate;
    }

    const measurements = await BodyMeasurement.findAll({
      where,
      limit: parseInt(limit),
      order: [['date', 'DESC']]
    });

    res.status(200).json({
      success: true,
      count: measurements.length,
      data: { measurements }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single measurement
 */
exports.getBodyMeasurement = async (req, res, next) => {
  try {
    const measurement = await BodyMeasurement.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!measurement) {
      return res.status(404).json({
        success: false,
        message: 'Body measurement not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { measurement }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Log body measurement
 */
exports.logBodyMeasurement = async (req, res, next) => {
  try {
    const {
      date,
      weight,
      height,
      bodyFatPercentage,
      muscleMassPercentage,
      visceralFat,
      boneMass,
      waterPercentage,
      metabolicAge,
      basalMetabolicRate,
      chest,
      waist,
      hips,
      thighLeft,
      thighRight,
      calfLeft,
      calfRight,
      bicepLeft,
      bicepRight,
      forearmLeft,
      forearmRight,
      neck,
      shoulders,
      imageUrl,
      notes
    } = req.body;

    // Calculate BMI if weight and height provided
    let bmi = null;
    if (weight && height) {
      bmi = (weight / Math.pow(height / 100, 2)).toFixed(2);
    }

    const measurement = await BodyMeasurement.create({
      userId: req.user.id,
      date: date || new Date(),
      weight,
      height,
      bmi,
      bodyFatPercentage,
      muscleMassPercentage,
      visceralFat,
      boneMass,
      waterPercentage,
      metabolicAge,
      basalMetabolicRate,
      chest,
      waist,
      hips,
      thighLeft,
      thighRight,
      calfLeft,
      calfRight,
      bicepLeft,
      bicepRight,
      forearmLeft,
      forearmRight,
      neck,
      shoulders,
      imageUrl,
      notes
    });

    res.status(201).json({
      success: true,
      message: 'Body measurement logged successfully',
      data: { measurement }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update body measurement
 */
exports.updateBodyMeasurement = async (req, res, next) => {
  try {
    const measurement = await BodyMeasurement.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!measurement) {
      return res.status(404).json({
        success: false,
        message: 'Body measurement not found'
      });
    }

    const updates = req.body;
    
    // Recalculate BMI if weight or height changed
    if (updates.weight || updates.height) {
      const weight = updates.weight || measurement.weight;
      const height = updates.height || measurement.height;
      if (weight && height) {
        updates.bmi = (weight / Math.pow(height / 100, 2)).toFixed(2);
      }
    }

    await measurement.update(updates);

    res.status(200).json({
      success: true,
      message: 'Body measurement updated successfully',
      data: { measurement }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete body measurement
 */
exports.deleteBodyMeasurement = async (req, res, next) => {
  try {
    const measurement = await BodyMeasurement.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!measurement) {
      return res.status(404).json({
        success: false,
        message: 'Body measurement not found'
      });
    }

    await measurement.destroy();

    res.status(200).json({
      success: true,
      message: 'Body measurement deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get measurement trends
 */
exports.getMeasurementTrends = async (req, res, next) => {
  try {
    const { period = '90', metric = 'weight' } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));

    const measurements = await BodyMeasurement.findAll({
      where: {
        userId: req.user.id,
        date: {
          [Op.gte]: startDate
        }
      },
      order: [['date', 'ASC']]
    });

    const trends = measurements.map(m => ({
      date: m.date,
      value: m[metric]
    })).filter(t => t.value !== null);

    const stats = {
      current: trends.length > 0 ? trends[trends.length - 1].value : null,
      start: trends.length > 0 ? trends[0].value : null,
      change: trends.length > 1 ? (trends[trends.length - 1].value - trends[0].value) : 0,
      percentageChange: trends.length > 1 && trends[0].value !== 0 
        ? ((trends[trends.length - 1].value - trends[0].value) / trends[0].value * 100).toFixed(2)
        : 0,
      average: trends.length > 0 
        ? (trends.reduce((sum, t) => sum + parseFloat(t.value), 0) / trends.length).toFixed(2)
        : 0,
      min: trends.length > 0 ? Math.min(...trends.map(t => parseFloat(t.value))) : null,
      max: trends.length > 0 ? Math.max(...trends.map(t => parseFloat(t.value))) : null
    };

    res.status(200).json({
      success: true,
      metric,
      period: parseInt(period),
      data: { trends, stats }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get latest measurement
 */
exports.getLatestMeasurement = async (req, res, next) => {
  try {
    const measurement = await BodyMeasurement.findOne({
      where: { userId: req.user.id },
      order: [['date', 'DESC']]
    });

    if (!measurement) {
      return res.status(404).json({
        success: false,
        message: 'No measurements found'
      });
    }

    res.status(200).json({
      success: true,
      data: { measurement }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Compare measurements
 */
exports.compareMeasurements = async (req, res, next) => {
  try {
    const { id1, id2 } = req.query;

    if (!id1 || !id2) {
      return res.status(400).json({
        success: false,
        message: 'Please provide two measurement IDs to compare'
      });
    }

    const [measurement1, measurement2] = await Promise.all([
      BodyMeasurement.findOne({
        where: { id: id1, userId: req.user.id }
      }),
      BodyMeasurement.findOne({
        where: { id: id2, userId: req.user.id }
      })
    ]);

    if (!measurement1 || !measurement2) {
      return res.status(404).json({
        success: false,
        message: 'One or both measurements not found'
      });
    }

    const comparison = {
      measurement1,
      measurement2,
      differences: {
        weight: measurement2.weight - measurement1.weight,
        bodyFatPercentage: measurement2.bodyFatPercentage - measurement1.bodyFatPercentage,
        muscleMassPercentage: measurement2.muscleMassPercentage - measurement1.muscleMassPercentage,
        chest: measurement2.chest - measurement1.chest,
        waist: measurement2.waist - measurement1.waist,
        hips: measurement2.hips - measurement1.hips
      }
    };

    res.status(200).json({
      success: true,
      data: { comparison }
    });
  } catch (error) {
    next(error);
  }
};
