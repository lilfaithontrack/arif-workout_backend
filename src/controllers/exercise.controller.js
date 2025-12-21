const { Exercise, User } = require('../models');
const { Op } = require('sequelize');
const fs = require('fs');
const path = require('path');

/**
 * Get all exercises with filters
 */
exports.getExercises = async (req, res, next) => {
  try {
    const { category, difficulty, muscleGroup, equipment, search, page = 1, limit = 1000 } = req.query;
    const where = { isActive: true };

    if (category) where.category = category;
    if (difficulty) where.difficulty = difficulty;
    if (equipment) {
      where.equipment = {
        [Op.contains]: [equipment]
      };
    }
    if (muscleGroup) {
      where.muscleGroups = {
        [Op.contains]: [muscleGroup]
      };
    }
    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const offset = (page - 1) * limit;

    const { count, rows: exercises } = await Exercise.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'name']
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['name', 'ASC']]
    });

    res.status(200).json({
      success: true,
      count,
      page: parseInt(page),
      totalPages: Math.ceil(count / limit),
      data: { exercises }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single exercise by ID or slug
 */
exports.getExercise = async (req, res, next) => {
  try {
    const { id } = req.params;
    const where = isNaN(id) ? { slug: id } : { id };

    const exercise = await Exercise.findOne({
      where,
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'name']
        }
      ]
    });

    if (!exercise) {
      return res.status(404).json({
        success: false,
        message: 'Exercise not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { exercise }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create exercise (Admin/Instructor only)
 */
exports.createExercise = async (req, res, next) => {
  try {
    const {
      name,
      slug,
      description,
      category,
      muscleGroups,
      equipment,
      difficulty,
      instructions,
      videoUrl,
      imageUrl,
      caloriesBurnedPerMinute,
      duration,
      sets,
      reps,
      restTime,
      tips,
      variations
    } = req.body;

    // Check if slug already exists
    const existingExercise = await Exercise.findOne({ where: { slug } });
    if (existingExercise) {
      return res.status(409).json({
        success: false,
        message: 'Exercise with this slug already exists'
      });
    }

    const exercise = await Exercise.create({
      name,
      slug,
      description,
      category,
      muscleGroups: muscleGroups || [],
      equipment: equipment || [],
      difficulty,
      instructions: instructions || [],
      videoUrl,
      imageUrl,
      caloriesBurnedPerMinute,
      duration,
      sets,
      reps,
      restTime,
      tips: tips || [],
      variations: variations || [],
      createdBy: req.user.id,
      isActive: true
    });

    // Automatically create image folder for this exercise
    try {
      const folderPath = path.join(__dirname, '../../public/images/exercises', slug);

      // Create folder if it doesn't exist
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
        console.log(`✅ Created exercise folder: ${slug}`);
      }
    } catch (folderError) {
      console.error('Error creating exercise folder:', folderError);
      // Don't fail the exercise creation if folder creation fails
    }

    res.status(201).json({
      success: true,
      message: 'Exercise created successfully',
      data: { exercise }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update exercise (Admin/Instructor only)
 */
exports.updateExercise = async (req, res, next) => {
  try {
    const exercise = await Exercise.findByPk(req.params.id);

    if (!exercise) {
      return res.status(404).json({
        success: false,
        message: 'Exercise not found'
      });
    }

    // Only creator or admin can update
    if (exercise.createdBy !== req.user.id && !req.user.isAdmin()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this exercise'
      });
    }

    const {
      name,
      description,
      category,
      muscleGroups,
      equipment,
      difficulty,
      instructions,
      videoUrl,
      imageUrl,
      caloriesBurnedPerMinute,
      duration,
      sets,
      reps,
      restTime,
      tips,
      variations,
      isActive
    } = req.body;

    await exercise.update({
      name: name || exercise.name,
      description: description || exercise.description,
      category: category || exercise.category,
      muscleGroups: muscleGroups || exercise.muscleGroups,
      equipment: equipment || exercise.equipment,
      difficulty: difficulty || exercise.difficulty,
      instructions: instructions || exercise.instructions,
      videoUrl: videoUrl !== undefined ? videoUrl : exercise.videoUrl,
      imageUrl: imageUrl !== undefined ? imageUrl : exercise.imageUrl,
      caloriesBurnedPerMinute: caloriesBurnedPerMinute !== undefined ? caloriesBurnedPerMinute : exercise.caloriesBurnedPerMinute,
      duration: duration !== undefined ? duration : exercise.duration,
      sets: sets !== undefined ? sets : exercise.sets,
      reps: reps !== undefined ? reps : exercise.reps,
      restTime: restTime !== undefined ? restTime : exercise.restTime,
      tips: tips || exercise.tips,
      variations: variations || exercise.variations,
      isActive: isActive !== undefined ? isActive : exercise.isActive
    });

    res.status(200).json({
      success: true,
      message: 'Exercise updated successfully',
      data: { exercise }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete exercise (Admin only)
 */
exports.deleteExercise = async (req, res, next) => {
  try {
    const exercise = await Exercise.findByPk(req.params.id);

    if (!exercise) {
      return res.status(404).json({
        success: false,
        message: 'Exercise not found'
      });
    }

    await exercise.destroy();

    res.status(200).json({
      success: true,
      message: 'Exercise deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get exercise categories
 */
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Exercise.findAll({
      attributes: ['category'],
      group: ['category'],
      raw: true
    });

    const categoryList = categories.map(c => c.category);

    res.status(200).json({
      success: true,
      data: { categories: categoryList }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get muscle groups
 */
exports.getMuscleGroups = async (req, res, next) => {
  try {
    const exercises = await Exercise.findAll({
      attributes: ['muscleGroups'],
      raw: true
    });

    const muscleGroupsSet = new Set();
    exercises.forEach(ex => {
      if (ex.muscleGroups) {
        ex.muscleGroups.forEach(mg => muscleGroupsSet.add(mg));
      }
    });

    res.status(200).json({
      success: true,
      data: { muscleGroups: Array.from(muscleGroupsSet) }
    });
  } catch (error) {
    next(error);
  }
};
