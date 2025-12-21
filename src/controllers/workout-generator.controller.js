const { Exercise, UserSurvey, User } = require('../models');
const { Op } = require('sequelize');

/**
 * Generate personalized workout plan based on user survey
 */
exports.generateWorkoutPlan = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    const survey = await UserSurvey.findOne({
      where: { userId, isActive: true },
      order: [['createdAt', 'DESC']]
    });

    if (!survey) {
      return res.status(404).json({
        success: false,
        message: 'Please complete the fitness survey first'
      });
    }

    const { workoutFrequency, workoutDuration, primaryGoal, fitnessLevel } = survey;
    
    const workoutPlan = await buildWorkoutPlan(survey);

    await UserSurvey.update(
      { lastPlanGenerated: new Date() },
      { where: { id: survey.id } }
    );

    res.status(200).json({
      success: true,
      message: 'Workout plan generated successfully',
      data: {
        plan: workoutPlan,
        surveyData: {
          primaryGoal,
          fitnessLevel,
          workoutFrequency,
          workoutDuration
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Generate workout by body part/muscle group
 */
exports.generateByBodyPart = async (req, res, next) => {
  try {
    const { bodyPart, difficulty, duration, equipment } = req.query;
    
    if (!bodyPart) {
      return res.status(400).json({
        success: false,
        message: 'Body part is required'
      });
    }

    const where = { isActive: true };
    
    where.muscleGroups = {
      [Op.contains]: [bodyPart]
    };

    if (difficulty) {
      where.difficulty = difficulty;
    }

    if (equipment) {
      where.equipment = {
        [Op.contains]: [equipment]
      };
    }

    const exercises = await Exercise.findAll({
      where,
      limit: 10,
      order: [['name', 'ASC']]
    });

    if (exercises.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No exercises found for ${bodyPart}`
      });
    }

    const workout = buildBodyPartWorkout(exercises, bodyPart, duration || 45);

    res.status(200).json({
      success: true,
      data: {
        bodyPart,
        difficulty: difficulty || 'all levels',
        totalExercises: workout.exercises.length,
        estimatedDuration: workout.estimatedDuration,
        exercises: workout.exercises
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Generate workout by category
 */
exports.generateByCategory = async (req, res, next) => {
  try {
    const { category, difficulty, duration } = req.query;
    
    if (!category) {
      return res.status(400).json({
        success: false,
        message: 'Category is required'
      });
    }

    const where = { 
      isActive: true,
      category 
    };

    if (difficulty) {
      where.difficulty = difficulty;
    }

    const exercises = await Exercise.findAll({
      where,
      limit: 12,
      order: [['name', 'ASC']]
    });

    if (exercises.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No exercises found for category: ${category}`
      });
    }

    const workout = buildCategoryWorkout(exercises, category, duration || 45);

    res.status(200).json({
      success: true,
      data: {
        category,
        difficulty: difficulty || 'all levels',
        totalExercises: workout.exercises.length,
        estimatedDuration: workout.estimatedDuration,
        exercises: workout.exercises
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Generate full week workout split
 */
exports.generateWeeklySplit = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    const survey = await UserSurvey.findOne({
      where: { userId, isActive: true },
      order: [['createdAt', 'DESC']]
    });

    if (!survey) {
      return res.status(404).json({
        success: false,
        message: 'Please complete the fitness survey first'
      });
    }

    const weeklySplit = await buildWeeklySplit(survey);

    res.status(200).json({
      success: true,
      message: 'Weekly workout split generated successfully',
      data: {
        split: weeklySplit,
        totalWorkouts: survey.workoutFrequency,
        workoutDuration: survey.workoutDuration
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Helper: Build complete workout plan based on survey
 */
async function buildWorkoutPlan(survey) {
  const {
    primaryGoal,
    fitnessLevel,
    workoutFrequency,
    workoutDuration,
    availableEquipment,
    preferredExerciseTypes,
    dislikedExercises,
    injuries
  } = survey;

  const where = {
    isActive: true,
    difficulty: getDifficultyForLevel(fitnessLevel)
  };

  if (availableEquipment && availableEquipment.length > 0) {
    where[Op.or] = [
      { equipment: { [Op.overlap]: availableEquipment } },
      { equipment: { [Op.eq]: [] } }
    ];
  }

  const categoryMapping = getGoalCategoryMapping(primaryGoal);
  
  const exercises = await Exercise.findAll({
    where: {
      ...where,
      category: { [Op.in]: categoryMapping }
    },
    limit: 50
  });

  const filteredExercises = filterExercisesByPreferences(
    exercises,
    preferredExerciseTypes,
    dislikedExercises,
    injuries
  );

  const dailyWorkouts = [];
  const exercisesPerDay = Math.ceil(filteredExercises.length / workoutFrequency);

  for (let day = 1; day <= workoutFrequency; day++) {
    const startIdx = (day - 1) * exercisesPerDay;
    const dayExercises = filteredExercises.slice(startIdx, startIdx + exercisesPerDay);
    
    dailyWorkouts.push({
      day,
      focus: getDayFocus(day, primaryGoal),
      exercises: dayExercises.map(ex => ({
        id: ex.id,
        name: ex.name,
        category: ex.category,
        muscleGroups: ex.muscleGroups,
        sets: adjustSetsForGoal(ex.sets, primaryGoal),
        reps: adjustRepsForGoal(ex.reps, primaryGoal),
        restTime: ex.restTime,
        duration: ex.duration,
        instructions: ex.instructions,
        tips: ex.tips
      })),
      totalDuration: calculateWorkoutDuration(dayExercises, workoutDuration)
    });
  }

  return {
    goal: primaryGoal,
    level: fitnessLevel,
    frequency: workoutFrequency,
    dailyWorkouts,
    totalExercises: filteredExercises.length,
    recommendations: generateRecommendations(survey)
  };
}

/**
 * Helper: Build body part specific workout
 */
function buildBodyPartWorkout(exercises, bodyPart, duration) {
  const targetExerciseCount = Math.floor(duration / 10);
  const selectedExercises = exercises.slice(0, Math.min(targetExerciseCount, exercises.length));

  return {
    bodyPart,
    exercises: selectedExercises.map(ex => ({
      id: ex.id,
      name: ex.name,
      category: ex.category,
      muscleGroups: ex.muscleGroups,
      primaryMuscles: ex.primaryMuscles,
      sets: ex.sets || 3,
      reps: ex.reps || 12,
      restTime: ex.restTime || 60,
      instructions: ex.instructions,
      tips: ex.tips,
      equipment: ex.equipment
    })),
    estimatedDuration: selectedExercises.length * 8,
    warmup: getWarmupForBodyPart(bodyPart),
    cooldown: getCooldownForBodyPart(bodyPart)
  };
}

/**
 * Helper: Build category specific workout
 */
function buildCategoryWorkout(exercises, category, duration) {
  const targetExerciseCount = category === 'cardio' ? 5 : Math.floor(duration / 8);
  const selectedExercises = exercises.slice(0, Math.min(targetExerciseCount, exercises.length));

  return {
    category,
    exercises: selectedExercises.map(ex => ({
      id: ex.id,
      name: ex.name,
      muscleGroups: ex.muscleGroups,
      sets: ex.sets || (category === 'cardio' ? 1 : 3),
      reps: ex.reps || (category === 'cardio' ? null : 12),
      duration: ex.duration || (category === 'cardio' ? 300 : null),
      restTime: ex.restTime || 60,
      instructions: ex.instructions,
      caloriesBurnedPerMinute: ex.caloriesBurnedPerMinute
    })),
    estimatedDuration: calculateCategoryDuration(selectedExercises, category),
    tips: getCategoryTips(category)
  };
}

/**
 * Helper: Build weekly split
 */
async function buildWeeklySplit(survey) {
  const { workoutFrequency, primaryGoal, fitnessLevel, availableEquipment } = survey;
  
  const splitTemplate = getWeeklySplitTemplate(workoutFrequency, primaryGoal);
  const weeklySplit = [];

  for (const dayTemplate of splitTemplate) {
    const where = {
      isActive: true,
      difficulty: getDifficultyForLevel(fitnessLevel)
    };

    if (dayTemplate.muscleGroups) {
      where.muscleGroups = {
        [Op.overlap]: dayTemplate.muscleGroups
      };
    }

    if (dayTemplate.category) {
      where.category = dayTemplate.category;
    }

    if (availableEquipment && availableEquipment.length > 0) {
      where[Op.or] = [
        { equipment: { [Op.overlap]: availableEquipment } },
        { equipment: { [Op.eq]: [] } }
      ];
    }

    const exercises = await Exercise.findAll({
      where,
      limit: 8
    });

    weeklySplit.push({
      day: dayTemplate.day,
      name: dayTemplate.name,
      focus: dayTemplate.focus,
      exercises: exercises.map(ex => ({
        id: ex.id,
        name: ex.name,
        category: ex.category,
        muscleGroups: ex.muscleGroups,
        sets: ex.sets || 3,
        reps: ex.reps || 12,
        restTime: ex.restTime || 60
      }))
    });
  }

  return weeklySplit;
}

/**
 * Utility functions
 */
function getDifficultyForLevel(fitnessLevel) {
  const mapping = {
    beginner: 'beginner',
    intermediate: 'intermediate',
    advanced: 'advanced',
    expert: 'advanced'
  };
  return mapping[fitnessLevel] || 'beginner';
}

function getGoalCategoryMapping(goal) {
  const mapping = {
    weight_loss: ['cardio', 'hiit', 'strength'],
    muscle_gain: ['strength'],
    strength: ['strength'],
    endurance: ['cardio', 'hiit'],
    flexibility: ['flexibility', 'yoga'],
    athletic_performance: ['strength', 'hiit', 'cardio'],
    general_fitness: ['cardio', 'strength', 'flexibility'],
    body_recomposition: ['strength', 'hiit'],
    rehabilitation: ['flexibility', 'balance']
  };
  return mapping[goal] || ['strength', 'cardio'];
}

function filterExercisesByPreferences(exercises, preferred, disliked, injuries) {
  let filtered = exercises;

  if (disliked && disliked.length > 0) {
    filtered = filtered.filter(ex => 
      !disliked.some(d => ex.name.toLowerCase().includes(d.toLowerCase()))
    );
  }

  if (injuries && injuries.length > 0) {
    const injuredMuscles = injuries.map(i => i.toLowerCase());
    filtered = filtered.filter(ex => 
      !ex.muscleGroups.some(mg => 
        injuredMuscles.some(im => mg.toLowerCase().includes(im))
      )
    );
  }

  return filtered;
}

function getDayFocus(day, goal) {
  const focuses = {
    weight_loss: ['Full Body HIIT', 'Upper Body', 'Lower Body', 'Cardio', 'Core & Abs', 'Active Recovery'],
    muscle_gain: ['Push', 'Pull', 'Legs', 'Upper Body', 'Lower Body', 'Full Body'],
    strength: ['Heavy Upper', 'Heavy Lower', 'Power', 'Hypertrophy', 'Strength', 'Conditioning'],
    endurance: ['Long Cardio', 'Intervals', 'Tempo Run', 'Recovery', 'Mixed', 'Endurance'],
    general_fitness: ['Full Body', 'Upper Body', 'Lower Body', 'Cardio', 'Flexibility', 'Active Recovery']
  };
  
  const focusList = focuses[goal] || focuses.general_fitness;
  return focusList[(day - 1) % focusList.length];
}

function adjustSetsForGoal(baseSets, goal) {
  const adjustments = {
    muscle_gain: 4,
    strength: 5,
    weight_loss: 3,
    endurance: 3
  };
  return adjustments[goal] || baseSets || 3;
}

function adjustRepsForGoal(baseReps, goal) {
  const adjustments = {
    muscle_gain: 10,
    strength: 5,
    weight_loss: 15,
    endurance: 20
  };
  return adjustments[goal] || baseReps || 12;
}

function calculateWorkoutDuration(exercises, targetDuration) {
  const totalTime = exercises.reduce((sum, ex) => {
    const exerciseTime = (ex.sets || 3) * ((ex.duration || 60) + (ex.restTime || 60));
    return sum + exerciseTime;
  }, 0);
  
  return Math.min(Math.round(totalTime / 60), targetDuration);
}

function calculateCategoryDuration(exercises, category) {
  if (category === 'cardio') {
    return exercises.reduce((sum, ex) => sum + (ex.duration || 300), 0) / 60;
  }
  return exercises.length * 8;
}

function generateRecommendations(survey) {
  const recommendations = [];
  
  if (survey.averageSleepHours < 7) {
    recommendations.push('Aim for 7-9 hours of sleep for optimal recovery');
  }
  
  if (survey.stressLevel === 'high' || survey.stressLevel === 'very_high') {
    recommendations.push('Consider adding yoga or meditation for stress management');
  }
  
  if (survey.primaryGoal === 'weight_loss' && !survey.dailyCalorieTarget) {
    recommendations.push('Set a daily calorie target for better weight loss results');
  }
  
  return recommendations;
}

function getWarmupForBodyPart(bodyPart) {
  const warmups = {
    chest: ['Arm circles', 'Light push-ups', 'Band pull-aparts'],
    back: ['Cat-cow stretch', 'Band rows', 'Scapular retractions'],
    legs: ['Leg swings', 'Bodyweight squats', 'Hip circles'],
    shoulders: ['Arm circles', 'Band pull-aparts', 'Shoulder dislocations'],
    arms: ['Wrist circles', 'Light curls', 'Tricep stretches'],
    core: ['Dead bugs', 'Bird dogs', 'Plank holds']
  };
  return warmups[bodyPart] || ['Light cardio', 'Dynamic stretching'];
}

function getCooldownForBodyPart(bodyPart) {
  return ['Static stretching', 'Foam rolling', 'Deep breathing'];
}

function getCategoryTips(category) {
  const tips = {
    cardio: ['Maintain steady breathing', 'Stay hydrated', 'Monitor heart rate'],
    strength: ['Focus on form', 'Progressive overload', 'Full range of motion'],
    hiit: ['Push hard during work intervals', 'Full recovery during rest', 'Proper warm-up essential'],
    yoga: ['Focus on breathing', 'Listen to your body', 'Consistency over intensity'],
    flexibility: ['Hold stretches 20-30 seconds', 'Never bounce', 'Breathe deeply']
  };
  return tips[category] || ['Stay consistent', 'Focus on form', 'Listen to your body'];
}

function getWeeklySplitTemplate(frequency, goal) {
  const templates = {
    3: {
      muscle_gain: [
        { day: 1, name: 'Push Day', focus: 'Chest, Shoulders, Triceps', muscleGroups: ['chest', 'shoulders', 'triceps'] },
        { day: 2, name: 'Pull Day', focus: 'Back, Biceps', muscleGroups: ['back', 'biceps'] },
        { day: 3, name: 'Leg Day', focus: 'Legs, Core', muscleGroups: ['quadriceps', 'hamstrings', 'glutes', 'core'] }
      ],
      weight_loss: [
        { day: 1, name: 'Full Body HIIT', focus: 'Total body conditioning', category: 'hiit' },
        { day: 2, name: 'Upper Body', focus: 'Arms, chest, back', muscleGroups: ['chest', 'back', 'shoulders', 'arms'] },
        { day: 3, name: 'Lower Body + Cardio', focus: 'Legs and cardio', muscleGroups: ['quadriceps', 'hamstrings', 'glutes'] }
      ]
    },
    4: {
      muscle_gain: [
        { day: 1, name: 'Upper Power', focus: 'Heavy upper body', muscleGroups: ['chest', 'back', 'shoulders'] },
        { day: 2, name: 'Lower Power', focus: 'Heavy lower body', muscleGroups: ['quadriceps', 'hamstrings', 'glutes'] },
        { day: 3, name: 'Upper Hypertrophy', focus: 'Volume upper body', muscleGroups: ['chest', 'back', 'arms'] },
        { day: 4, name: 'Lower Hypertrophy', focus: 'Volume lower body', muscleGroups: ['quadriceps', 'hamstrings', 'calves'] }
      ]
    },
    5: {
      muscle_gain: [
        { day: 1, name: 'Chest & Triceps', focus: 'Push muscles', muscleGroups: ['chest', 'triceps'] },
        { day: 2, name: 'Back & Biceps', focus: 'Pull muscles', muscleGroups: ['back', 'biceps'] },
        { day: 3, name: 'Legs', focus: 'Lower body', muscleGroups: ['quadriceps', 'hamstrings', 'glutes'] },
        { day: 4, name: 'Shoulders & Abs', focus: 'Delts and core', muscleGroups: ['shoulders', 'core'] },
        { day: 5, name: 'Full Body', focus: 'Total body', muscleGroups: ['chest', 'back', 'legs'] }
      ]
    }
  };

  const template = templates[frequency]?.[goal] || templates[3].weight_loss;
  return template;
}

module.exports = exports;
