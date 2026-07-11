const { Program, ProgramWorkout, WorkoutExercise, Exercise, Category, UserProgram, User, WorkoutSection, Phase } = require('../models');
const { Op } = require('sequelize');

// Helper to generate slug
const generateSlug = (name) => {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
};

// ==========================================
// PROGRAMS
// ==========================================

// Get all programs with filtering
exports.getPrograms = async (req, res) => {
  try {
    const {
      category,
      level,
      goal,
      optPhase,
      isFeatured,
      search,
      page = 1,
      limit = 20
    } = req.query;

    const whereClause = { isActive: true };

    if (category) whereClause.categoryId = category;
    if (level) whereClause.level = level;
    if (goal) whereClause.goal = goal;
    if (optPhase) whereClause.optPhase = optPhase;
    if (isFeatured === 'true') whereClause.isFeatured = true;
    
    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }

    const offset = (page - 1) * limit;

    const { count, rows: programs } = await Program.findAndCountAll({
      where: whereClause,
      include: [
        { model: Category, as: 'category', attributes: ['id', 'name'] },
        { model: Phase, as: 'optPhaseInfo', attributes: ['id', 'phaseNumber', 'name', 'intensity'], required: false }
      ],
      order: [['orderIndex', 'ASC'], ['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: programs,
      pagination: {
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching programs:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single program with all workouts
exports.getProgramById = async (req, res) => {
  try {
    const { id } = req.params;
    const { includeWorkouts = true } = req.query;

    const includeOptions = [
      { model: Category, as: 'category', attributes: ['id', 'name'] }
    ];

    if (includeWorkouts === 'true') {
      includeOptions.push({
        model: ProgramWorkout,
        as: 'workouts',
        where: { isActive: true },
        required: false,
        order: [['orderIndex', 'ASC']]
      });
    }

    const program = await Program.findOne({
      where: { id, isActive: true },
      include: includeOptions
    });

    if (!program) {
      return res.status(404).json({ success: false, message: 'Program not found' });
    }

    // If user is authenticated, check enrollment status
    let enrollment = null;
    if (req.user) {
      enrollment = await UserProgram.findOne({
        where: { userId: req.user.id, programId: id }
      });
    }

    res.json({
      success: true,
      data: program,
      enrollment: enrollment
    });
  } catch (error) {
    console.error('Error fetching program:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get program by slug
exports.getProgramBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const program = await Program.findOne({
      where: { slug, isActive: true },
      include: [
        { model: Category, as: 'category', attributes: ['id', 'name'] },
        {
          model: ProgramWorkout,
          as: 'workouts',
          where: { isActive: true },
          required: false,
          order: [['orderIndex', 'ASC']]
        }
      ]
    });

    if (!program) {
      return res.status(404).json({ success: false, message: 'Program not found' });
    }

    res.json({
      success: true,
      data: program
    });
  } catch (error) {
    console.error('Error fetching program:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create new program (Admin/Instructor)
exports.createProgram = async (req, res) => {
  try {
    const {
      name,
      description,
      categoryId,
      categoryName,
      level,
      goal,
      durationWeeks,
      imageUrl,
      bannerImageUrl,
      tags,
      equipment,
      orderIndex
    } = req.body;

    const slug = generateSlug(name);

    // Check if slug exists
    const existing = await Program.findOne({ where: { slug } });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Program with similar name already exists' });
    }

    const program = await Program.create({
      name,
      slug,
      description,
      categoryId,
      categoryName,
      level,
      goal,
      durationWeeks,
      imageUrl,
      bannerImageUrl,
      tags,
      equipment,
      orderIndex,
      createdBy: req.user.id
    });

    res.status(201).json({
      success: true,
      data: program,
      message: 'Program created successfully'
    });
  } catch (error) {
    console.error('Error creating program:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update program
exports.updateProgram = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const program = await Program.findByPk(id);
    if (!program) {
      return res.status(404).json({ success: false, message: 'Program not found' });
    }

    // Generate new slug if name changed
    if (updateData.name && updateData.name !== program.name) {
      updateData.slug = generateSlug(updateData.name);
    }

    await program.update(updateData);

    res.json({
      success: true,
      data: program,
      message: 'Program updated successfully'
    });
  } catch (error) {
    console.error('Error updating program:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete program (soft delete)
exports.deleteProgram = async (req, res) => {
  try {
    const { id } = req.params;

    const program = await Program.findByPk(id);
    if (!program) {
      return res.status(404).json({ success: false, message: 'Program not found' });
    }

    await program.update({ isActive: false });

    res.json({
      success: true,
      message: 'Program deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting program:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// PROGRAM WORKOUTS
// ==========================================

// Get single workout with exercises
exports.getWorkoutById = async (req, res) => {
  try {
    const { workoutId } = req.params;

    const workout = await ProgramWorkout.findOne({
      where: { id: workoutId, isActive: true },
      include: [
        {
          model: WorkoutExercise,
          as: 'exercises',
          where: { isActive: true },
          required: false,
          include: [
            {
              model: Exercise,
              as: 'exercise',
              attributes: ['id', 'name', 'description', 'category', 'muscleGroups', 'videoUrl', 'imageUrl']
            }
          ],
          order: [['orderIndex', 'ASC']]
        },
        {
          model: Program,
          as: 'program',
          attributes: ['id', 'name', 'slug']
        }
      ],
      order: [['orderIndex', 'ASC']]
    });

    if (!workout) {
      return res.status(404).json({ success: false, message: 'Workout not found' });
    }

    // Group exercises by section
    const groupedExercises = workout.exercises.reduce((acc, we) => {
      const section = we.section || 'main';
      if (!acc[section]) acc[section] = [];
      acc[section].push(we);
      return acc;
    }, {});

    res.json({
      success: true,
      data: {
        ...workout.toJSON(),
        groupedExercises
      }
    });
  } catch (error) {
    console.error('Error fetching workout:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add workout to program
exports.addWorkoutToProgram = async (req, res) => {
  try {
    const { programId } = req.params;
    const {
      name,
      description,
      level,
      weekNumber,
      dayNumber,
      durationMinutes,
      focusArea,
      orderIndex,
      instructions,
      exercises
    } = req.body;

    const program = await Program.findByPk(programId);
    if (!program) {
      return res.status(404).json({ success: false, message: 'Program not found' });
    }

    const workout = await ProgramWorkout.create({
      programId,
      name,
      description,
      level,
      weekNumber,
      dayNumber,
      durationMinutes,
      focusArea,
      orderIndex,
      instructions,
      exercisesCount: exercises?.length || 0
    });

    // Add exercises if provided
    if (exercises && exercises.length > 0) {
      const workoutExercises = exercises.map((ex, index) => ({
        programWorkoutId: workout.id,
        exerciseId: ex.exerciseId,
        section: ex.section || 'main',
        sectionName: ex.sectionName,
        orderIndex: ex.orderIndex || index,
        sets: ex.sets,
        reps: ex.reps,
        repsDisplay: ex.repsDisplay,
        durationSeconds: ex.durationSeconds,
        restSeconds: ex.restSeconds,
        tempo: ex.tempo,
        weight: ex.weight,
        intensity: ex.intensity,
        instructions: ex.instructions
      }));

      await WorkoutExercise.bulkCreate(workoutExercises);
    }

    // Update program workout count
    await program.increment('workoutsCount');

    res.status(201).json({
      success: true,
      data: workout,
      message: 'Workout added to program'
    });
  } catch (error) {
    console.error('Error adding workout:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update workout
exports.updateWorkout = async (req, res) => {
  try {
    const { workoutId } = req.params;
    const updateData = req.body;

    const workout = await ProgramWorkout.findByPk(workoutId);
    if (!workout) {
      return res.status(404).json({ success: false, message: 'Workout not found' });
    }

    await workout.update(updateData);

    res.json({
      success: true,
      data: workout,
      message: 'Workout updated successfully'
    });
  } catch (error) {
    console.error('Error updating workout:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete workout
exports.deleteWorkout = async (req, res) => {
  try {
    const { workoutId } = req.params;

    const workout = await ProgramWorkout.findByPk(workoutId);
    if (!workout) {
      return res.status(404).json({ success: false, message: 'Workout not found' });
    }

    await workout.update({ isActive: false });

    // Update program workout count
    await Program.decrement('workoutsCount', { where: { id: workout.programId } });

    res.json({
      success: true,
      message: 'Workout deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting workout:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// WORKOUT EXERCISES
// ==========================================

// Add exercise to workout
exports.addExerciseToWorkout = async (req, res) => {
  try {
    const { workoutId } = req.params;
    const exerciseData = req.body;

    const workout = await ProgramWorkout.findByPk(workoutId);
    if (!workout) {
      return res.status(404).json({ success: false, message: 'Workout not found' });
    }

    const workoutExercise = await WorkoutExercise.create({
      programWorkoutId: workoutId,
      ...exerciseData
    });

    // Update exercise count
    await workout.increment('exercisesCount');

    res.status(201).json({
      success: true,
      data: workoutExercise,
      message: 'Exercise added to workout'
    });
  } catch (error) {
    console.error('Error adding exercise:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update workout exercise
exports.updateWorkoutExercise = async (req, res) => {
  try {
    const { exerciseId } = req.params;
    const updateData = req.body;

    const workoutExercise = await WorkoutExercise.findByPk(exerciseId);
    if (!workoutExercise) {
      return res.status(404).json({ success: false, message: 'Workout exercise not found' });
    }

    await workoutExercise.update(updateData);

    res.json({
      success: true,
      data: workoutExercise,
      message: 'Workout exercise updated'
    });
  } catch (error) {
    console.error('Error updating workout exercise:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Remove exercise from workout
exports.removeWorkoutExercise = async (req, res) => {
  try {
    const { exerciseId } = req.params;

    const workoutExercise = await WorkoutExercise.findByPk(exerciseId);
    if (!workoutExercise) {
      return res.status(404).json({ success: false, message: 'Workout exercise not found' });
    }

    await workoutExercise.update({ isActive: false });

    // Update exercise count
    await ProgramWorkout.decrement('exercisesCount', {
      where: { id: workoutExercise.programWorkoutId }
    });

    res.json({
      success: true,
      message: 'Exercise removed from workout'
    });
  } catch (error) {
    console.error('Error removing exercise:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Reorder exercises in workout
exports.reorderExercises = async (req, res) => {
  try {
    const { workoutId } = req.params;
    const { exerciseOrders } = req.body;

    // exerciseOrders: [{ id, orderIndex }]
    const updates = exerciseOrders.map(({ id, orderIndex }) =>
      WorkoutExercise.update({ orderIndex }, { where: { id, programWorkoutId: workoutId } })
    );

    await Promise.all(updates);

    res.json({
      success: true,
      message: 'Exercises reordered successfully'
    });
  } catch (error) {
    console.error('Error reordering exercises:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// USER PROGRAM ENROLLMENT
// ==========================================

// Enroll user in program
exports.enrollInProgram = async (req, res) => {
  try {
    const { programId } = req.params;
    const userId = req.user.id;

    const program = await Program.findByPk(programId);
    if (!program) {
      return res.status(404).json({ success: false, message: 'Program not found' });
    }

    // Check if already enrolled
    const existing = await UserProgram.findOne({
      where: { userId, programId }
    });

    if (existing) {
      return res.status(400).json({ success: false, message: 'Already enrolled in this program' });
    }

    // Get first workout
    const firstWorkout = await ProgramWorkout.findOne({
      where: { programId, isActive: true },
      order: [['orderIndex', 'ASC']]
    });

    const enrollment = await UserProgram.create({
      userId,
      programId,
      currentWorkoutId: firstWorkout?.id || null,
      totalWorkouts: program.workoutsCount,
      startDate: new Date(),
      status: 'in_progress'
    });

    res.status(201).json({
      success: true,
      data: enrollment,
      message: 'Enrolled in program successfully'
    });
  } catch (error) {
    console.error('Error enrolling in program:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get user's enrolled programs
exports.getMyPrograms = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status } = req.query;

    const whereClause = { userId };
    if (status) whereClause.status = status;

    const enrollments = await UserProgram.findAll({
      where: whereClause,
      include: [
        {
          model: Program,
          as: 'program',
          include: [{ model: Category, as: 'category', attributes: ['id', 'name'] }]
        },
        {
          model: ProgramWorkout,
          as: 'currentWorkout',
          attributes: ['id', 'name', 'weekNumber', 'dayNumber']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: enrollments
    });
  } catch (error) {
    console.error('Error fetching user programs:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update program progress
exports.updateProgress = async (req, res) => {
  try {
    const { enrollmentId } = req.params;
    const { currentWorkoutId, status, progressPercentage } = req.body;
    const userId = req.user.id;

    const enrollment = await UserProgram.findOne({
      where: { id: enrollmentId, userId }
    });

    if (!enrollment) {
      return res.status(404).json({ success: false, message: 'Enrollment not found' });
    }

    const updateData = {};
    if (currentWorkoutId) updateData.currentWorkoutId = currentWorkoutId;
    if (status) updateData.status = status;
    if (progressPercentage !== undefined) updateData.progressPercentage = progressPercentage;

    if (status === 'completed') {
      updateData.completedDate = new Date();
      updateData.progressPercentage = 100;
    }

    await enrollment.update(updateData);

    res.json({
      success: true,
      data: enrollment,
      message: 'Progress updated successfully'
    });
  } catch (error) {
    console.error('Error updating progress:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Complete workout and advance to next
exports.completeWorkout = async (req, res) => {
  try {
    const { enrollmentId } = req.params;
    const userId = req.user.id;

    const enrollment = await UserProgram.findOne({
      where: { id: enrollmentId, userId },
      include: [{ model: Program, as: 'program' }]
    });

    if (!enrollment) {
      return res.status(404).json({ success: false, message: 'Enrollment not found' });
    }

    // Increment completed workouts
    const completedWorkouts = enrollment.completedWorkouts + 1;
    const progressPercentage = (completedWorkouts / enrollment.totalWorkouts) * 100;

    // Find next workout
    const currentWorkout = await ProgramWorkout.findByPk(enrollment.currentWorkoutId);
    const nextWorkout = await ProgramWorkout.findOne({
      where: {
        programId: enrollment.programId,
        isActive: true,
        orderIndex: { [Op.gt]: currentWorkout?.orderIndex || 0 }
      },
      order: [['orderIndex', 'ASC']]
    });

    const updateData = {
      completedWorkouts,
      progressPercentage,
      currentWorkoutId: nextWorkout?.id || enrollment.currentWorkoutId
    };

    if (!nextWorkout || completedWorkouts >= enrollment.totalWorkouts) {
      updateData.status = 'completed';
      updateData.completedDate = new Date();
      updateData.progressPercentage = 100;
    }

    await enrollment.update(updateData);

    res.json({
      success: true,
      data: enrollment,
      message: nextWorkout ? 'Workout completed. Next workout unlocked!' : 'Program completed!'
    });
  } catch (error) {
    console.error('Error completing workout:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Unenroll from program
exports.unenrollFromProgram = async (req, res) => {
  try {
    const { enrollmentId } = req.params;
    const userId = req.user.id;

    const enrollment = await UserProgram.findOne({
      where: { id: enrollmentId, userId }
    });

    if (!enrollment) {
      return res.status(404).json({ success: false, message: 'Enrollment not found' });
    }

    await enrollment.destroy();

    res.json({
      success: true,
      message: 'Unenrolled from program successfully'
    });
  } catch (error) {
    console.error('Error unenrolling:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// NASM-SPECIFIC ENDPOINTS
// ==========================================

// Get workout sections (NASM style)
exports.getWorkoutSections = async (req, res) => {
  try {
    const sections = await WorkoutSection.findAll({
      where: { isActive: true },
      order: [['ordinal', 'ASC']]
    });

    res.json({
      success: true,
      data: sections
    });
  } catch (error) {
    console.error('Error fetching workout sections:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get programs by NASM OPT Phase
exports.getProgramsByPhase = async (req, res) => {
  try {
    const { phase } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const offset = (page - 1) * limit;

    const { count, rows: programs } = await Program.findAndCountAll({
      where: { optPhase: phase, isActive: true },
      include: [
        { model: Category, as: 'category', attributes: ['id', 'name'] }
      ],
      order: [['optPhaseNumber', 'ASC'], ['orderIndex', 'ASC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: programs,
      pagination: {
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching programs by phase:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get workout with exercises grouped by NASM sections
exports.getWorkoutWithSections = async (req, res) => {
  try {
    const { workoutId } = req.params;

    const workout = await ProgramWorkout.findOne({
      where: { id: workoutId, isActive: true },
      include: [
        {
          model: Program,
          as: 'program',
          attributes: ['id', 'name', 'level', 'optPhase']
        }
      ]
    });

    if (!workout) {
      return res.status(404).json({ success: false, message: 'Workout not found' });
    }

    // Get exercises grouped by section
    const exercises = await WorkoutExercise.findAll({
      where: { programWorkoutId: workoutId, isActive: true },
      include: [
        {
          model: Exercise,
          as: 'exercise',
          attributes: ['id', 'name', 'slug', 'description', 'videoUrl', 'imageUrl', 'difficulty']
        }
      ],
      order: [['section', 'ASC'], ['orderIndex', 'ASC']]
    });

    // Group exercises by section
    const groupedExercises = {};
    const sectionOrder = ['warm_up', 'core_balance_plyometric', 'speed_agility_quickness', 'resistance', 'cool_down', 'recovery'];
    
    sectionOrder.forEach(section => {
      groupedExercises[section] = {
        sectionName: section.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        exercises: []
      };
    });

    exercises.forEach(ex => {
      const sectionKey = ex.section || 'main';
      if (!groupedExercises[sectionKey]) {
        groupedExercises[sectionKey] = {
          sectionName: ex.sectionName || sectionKey,
          exercises: []
        };
      }
      groupedExercises[sectionKey].exercises.push(ex);
    });

    // Remove empty sections
    const resultSections = {};
    Object.keys(groupedExercises).forEach(key => {
      if (groupedExercises[key].exercises.length > 0) {
        resultSections[key] = groupedExercises[key];
      }
    });

    res.json({
      success: true,
      data: {
        workout,
        sections: resultSections,
        totalExercises: exercises.length
      }
    });
  } catch (error) {
    console.error('Error fetching workout with sections:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get full program detail with all workouts and exercises by section
exports.getFullProgramDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const program = await Program.findOne({
      where: { id, isActive: true },
      include: [
        { model: Category, as: 'category', attributes: ['id', 'name', 'slug'] },
        {
          model: ProgramWorkout,
          as: 'workouts',
          where: { isActive: true },
          required: false,
          include: [
            {
              model: WorkoutExercise,
              as: 'exercises',
              where: { isActive: true },
              required: false,
              include: [
                {
                  model: Exercise,
                  as: 'exercise',
                  attributes: ['id', 'name', 'slug', 'description', 'videoUrl', 'imageUrl']
                }
              ],
              order: [['section', 'ASC'], ['orderIndex', 'ASC']]
            }
          ],
          order: [['orderIndex', 'ASC']]
        }
      ]
    });

    if (!program) {
      return res.status(404).json({ success: false, message: 'Program not found' });
    }

    res.json({
      success: true,
      data: program
    });
  } catch (error) {
    console.error('Error fetching full program:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// ADMIN PANEL ENDPOINTS
// ==========================================

// Get all workouts for a specific program
exports.getWorkoutsForProgram = async (req, res) => {
  try {
    const { programId } = req.params;

    const workouts = await ProgramWorkout.findAll({
      where: { programId, isActive: true },
      include: [
        {
          model: Phase,
          as: 'phaseInfo',
          attributes: ['id', 'phaseNumber', 'name', 'intensity'],
          required: false
        }
      ],
      order: [['orderIndex', 'ASC'], ['createdAt', 'ASC']]
    });

    res.json({
      success: true,
      workouts: workouts
    });
  } catch (error) {
    console.error('Error fetching workouts for program:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all program workouts (admin listing - includes inactive)
exports.getAllProgramWorkouts = async (req, res) => {
  try {
    const { programId, phaseId, search, page = 1, limit = 50 } = req.query;

    const whereClause = {};
    if (programId) whereClause.programId = programId;
    if (phaseId) whereClause.phaseId = phaseId;
    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }

    const offset = (page - 1) * limit;

    const { count, rows: workouts } = await ProgramWorkout.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Program,
          as: 'program',
          attributes: ['id', 'name', 'slug'],
          required: false
        },
        {
          model: Phase,
          as: 'phaseInfo',
          attributes: ['id', 'phaseNumber', 'name', 'intensity'],
          required: false
        }
      ],
      order: [['orderIndex', 'ASC'], ['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      workouts: workouts,
      pagination: {
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching all program workouts:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all exercises for a specific workout
exports.getExercisesForWorkout = async (req, res) => {
  try {
    const { workoutId } = req.params;

    const workout = await ProgramWorkout.findByPk(workoutId);
    if (!workout) {
      return res.status(404).json({ success: false, message: 'Workout not found' });
    }

    const exercises = await WorkoutExercise.findAll({
      where: { programWorkoutId: workoutId, isActive: true },
      include: [
        {
          model: Exercise,
          as: 'exercise',
          attributes: ['id', 'name', 'slug', 'description', 'category', 'difficulty', 'videoUrl', 'imageUrl']
        }
      ],
      order: [['section', 'ASC'], ['orderIndex', 'ASC']]
    });

    res.json({
      success: true,
      exercises: exercises,
      workout: {
        id: workout.id,
        name: workout.name,
        description: workout.description
      }
    });
  } catch (error) {
    console.error('Error fetching exercises for workout:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all OPT phases
exports.getPhases = async (req, res) => {
  try {
    const phases = await Phase.findAll({
      order: [['phaseNumber', 'ASC']]
    });

    res.json({
      success: true,
      phases: phases
    });
  } catch (error) {
    console.error('Error fetching phases:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
