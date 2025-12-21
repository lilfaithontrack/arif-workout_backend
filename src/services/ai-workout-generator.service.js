/**
 * AI Workout Plan Generator Service
 * Advanced algorithm for creating personalized workout plans
 * Based on user survey, nutrition data, and exercise database
 */

const { Exercise } = require('../models');
const { NutritionItem } = require('../models');
const { Op } = require('sequelize');

class AIWorkoutGenerator {
  constructor() {
    this.version = '1.0.0';
  }

  /**
   * Main method to generate a complete workout plan
   */
  async generatePlan(survey, userId) {
    try {
      console.log(`🤖 AI: Generating workout plan for user ${userId}`);

      // Step 1: Calculate user metrics
      const metrics = this.calculateUserMetrics(survey);

      // Step 2: Determine training split
      const trainingSplit = this.determineTrainingSplit(survey, metrics);

      // Step 3: Select exercises
      const exercises = await this.selectExercises(survey, trainingSplit);

      // Step 4: Create workout structure
      const planStructure = this.createPlanStructure(survey, trainingSplit, exercises);

      // Step 5: Generate nutrition plan
      const nutritionPlan = await this.generateNutritionPlan(survey, metrics);

      // Step 6: Create progression schedule
      const progressionSchedule = this.createProgressionSchedule(survey, metrics);

      // Step 7: Calculate confidence score
      const confidenceScore = this.calculateConfidenceScore(survey, exercises);

      // Step 8: Generate expected outcomes
      const expectedOutcomes = this.predictOutcomes(survey, metrics);

      return {
        planName: this.generatePlanName(survey),
        planDescription: this.generatePlanDescription(survey, metrics),
        durationWeeks: this.calculatePlanDuration(survey),
        workoutsPerWeek: survey.workoutFrequency,
        planStructure,
        exerciseDistribution: this.calculateExerciseDistribution(exercises),
        nutritionPlan,
        mealPlan: nutritionPlan.mealPlan,
        progressionStrategy: this.selectProgressionStrategy(survey),
        progressionSchedule,
        aiVersion: this.version,
        confidenceScore,
        generationMethod: 'rule_based',
        personalizationFactors: this.getPersonalizationFactors(survey),
        expectedOutcomes,
        status: 'draft'
      };
    } catch (error) {
      console.error('AI Generation Error:', error);
      throw new Error(`Failed to generate workout plan: ${error.message}`);
    }
  }

  /**
   * Calculate user metrics (BMI, TDEE, etc.)
   */
  calculateUserMetrics(survey) {
    const heightM = survey.height / 100;
    const bmi = survey.weight / (heightM * heightM);

    // Calculate BMR (Basal Metabolic Rate) using Mifflin-St Jeor
    let bmr;
    if (survey.gender === 'male') {
      bmr = (10 * survey.weight) + (6.25 * survey.height) - (5 * survey.age) + 5;
    } else {
      bmr = (10 * survey.weight) + (6.25 * survey.height) - (5 * survey.age) - 161;
    }

    // Activity multipliers
    const activityMultipliers = {
      sedentary: 1.2,
      lightly_active: 1.375,
      moderately_active: 1.55,
      very_active: 1.725,
      extremely_active: 1.9
    };

    const tdee = bmr * activityMultipliers[survey.activityLevel];

    // Adjust for goals
    let targetCalories = tdee;
    if (survey.primaryGoal === 'weight_loss') {
      targetCalories = tdee - 500; // 500 cal deficit
    } else if (survey.primaryGoal === 'muscle_gain') {
      targetCalories = tdee + 300; // 300 cal surplus
    }

    // Macro split based on goal
    const macros = this.calculateMacros(survey, targetCalories);

    return {
      bmi,
      bmr,
      tdee,
      targetCalories,
      macros,
      weightToLose: survey.targetWeight ? survey.weight - survey.targetWeight : 0,
      weeklyWeightChange: this.calculateWeeklyWeightChange(survey)
    };
  }

  /**
   * Calculate macronutrient distribution
   */
  calculateMacros(survey, calories) {
    let proteinRatio, carbRatio, fatRatio;

    switch (survey.primaryGoal) {
      case 'muscle_gain':
        proteinRatio = 0.30; // 30% protein
        carbRatio = 0.45;    // 45% carbs
        fatRatio = 0.25;     // 25% fat
        break;
      case 'weight_loss':
        proteinRatio = 0.35; // 35% protein
        carbRatio = 0.30;    // 30% carbs
        fatRatio = 0.35;     // 35% fat
        break;
      case 'strength':
        proteinRatio = 0.30;
        carbRatio = 0.40;
        fatRatio = 0.30;
        break;
      case 'endurance':
        proteinRatio = 0.20;
        carbRatio = 0.55;
        fatRatio = 0.25;
        break;
      default:
        proteinRatio = 0.30;
        carbRatio = 0.40;
        fatRatio = 0.30;
    }

    return {
      protein: Math.round((calories * proteinRatio) / 4), // 4 cal/g
      carbs: Math.round((calories * carbRatio) / 4),      // 4 cal/g
      fats: Math.round((calories * fatRatio) / 9)         // 9 cal/g
    };
  }

  /**
   * Determine optimal training split
   */
  determineTrainingSplit(survey, metrics) {
    const frequency = survey.workoutFrequency;
    const level = survey.fitnessLevel;
    const goal = survey.primaryGoal;

    let split;

    if (frequency <= 2) {
      split = 'full_body';
    } else if (frequency === 3) {
      split = level === 'beginner' ? 'full_body' : 'push_pull_legs';
    } else if (frequency === 4) {
      split = 'upper_lower';
    } else if (frequency >= 5) {
      split = goal === 'muscle_gain' ? 'body_part_split' : 'push_pull_legs';
    }

    return {
      type: split,
      frequency,
      restDays: 7 - frequency,
      workoutDuration: survey.workoutDuration
    };
  }

  /**
   * Select appropriate exercises based on survey
   */
  async selectExercises(survey, trainingSplit) {
    // Ensure arrays are properly parsed
    let equipment = survey.availableEquipment || [];
    if (typeof equipment === 'string') {
      try {
        equipment = JSON.parse(equipment);
      } catch (e) {
        equipment = [];
      }
    }
    if (!Array.isArray(equipment)) {
      equipment = [];
    }

    let disliked = survey.dislikedExercises || [];
    if (typeof disliked === 'string') {
      try {
        disliked = JSON.parse(disliked);
      } catch (e) {
        disliked = [];
      }
    }
    if (!Array.isArray(disliked)) {
      disliked = [];
    }

    const level = survey.fitnessLevel;
    const goal = survey.primaryGoal;

    // Build query conditions
    const whereClause = {
      isActive: true,
      difficulty: this.getDifficultyLevels(level)
    };

    if (equipment.length > 0) {
      whereClause.equipment = {
        [Op.or]: equipment.map(eq => ({ [Op.like]: `%${eq}%` }))
      };
    }

    // Fetch exercises
    const exercises = await Exercise.findAll({
      where: whereClause,
      limit: 100
    });

    // Filter out disliked exercises
    const filtered = exercises.filter(ex =>
      !disliked.some(dislike => ex.name.toLowerCase().includes(dislike.toLowerCase()))
    );

    // Helper function to check if exercise targets a muscle group
    const targetsMuscle = (exercise, ...muscles) => {
      const primary = exercise.primaryMuscles || [];
      const groups = exercise.muscleGroups || [];
      return muscles.some(muscle =>
        primary.includes(muscle) || groups.includes(muscle)
      );
    };

    // Helper function to determine if exercise is compound or isolation
    const isCompoundExercise = (exercise) => {
      const muscleCount = new Set([
        ...(exercise.primaryMuscles || []),
        ...(exercise.muscleGroups || [])
      ]).size;

      // Compound exercises typically:
      // 1. Target multiple muscle groups (2+)
      // 2. Are in strength category with multiple muscles
      // 3. Have names containing compound indicators
      const compoundKeywords = ['squat', 'deadlift', 'press', 'row', 'pull-up', 'chin-up', 'lunge', 'clean', 'snatch'];
      const hasCompoundName = compoundKeywords.some(keyword =>
        exercise.name?.toLowerCase().includes(keyword)
      );

      return muscleCount >= 2 || (exercise.category === 'strength' && hasCompoundName);
    };

    // Categorize by muscle group and type
    const categorized = {
      chest: filtered.filter(ex => targetsMuscle(ex, 'chest', 'pectorals')),
      back: filtered.filter(ex => targetsMuscle(ex, 'back', 'lats', 'latissimus', 'traps', 'trapezius')),
      shoulders: filtered.filter(ex => targetsMuscle(ex, 'shoulders', 'deltoids', 'delts')),
      legs: filtered.filter(ex => targetsMuscle(ex, 'legs', 'quadriceps', 'hamstrings', 'quads', 'glutes', 'calves')),
      arms: filtered.filter(ex => targetsMuscle(ex, 'biceps', 'triceps', 'forearms', 'arms')),
      core: filtered.filter(ex => targetsMuscle(ex, 'abs', 'core', 'abdominals', 'obliques')),
      cardio: filtered.filter(ex => ex.category === 'cardio' || ex.category === 'hiit'),
      compound: filtered.filter(ex => isCompoundExercise(ex)),
      isolation: filtered.filter(ex => !isCompoundExercise(ex) && ex.category !== 'cardio')
    };

    return categorized;
  }

  /**
   * Create detailed plan structure
   */
  createPlanStructure(survey, trainingSplit, exercises) {
    const weeks = this.calculatePlanDuration(survey);
    const structure = {};

    for (let week = 1; week <= weeks; week++) {
      structure[`week${week}`] = this.createWeeklyPlan(
        week,
        survey,
        trainingSplit,
        exercises
      );
    }

    return structure;
  }

  /**
   * Create weekly workout plan
   */
  createWeeklyPlan(weekNumber, survey, trainingSplit, exercises) {
    const weekPlan = {};
    const frequency = survey.workoutFrequency;

    for (let day = 1; day <= frequency; day++) {
      weekPlan[`day${day}`] = this.createDailyWorkout(
        day,
        weekNumber,
        survey,
        trainingSplit,
        exercises
      );
    }

    return weekPlan;
  }

  /**
   * Create daily workout
   */
  createDailyWorkout(day, week, survey, trainingSplit, exercises) {
    const split = trainingSplit.type;
    const level = survey.fitnessLevel;
    const goal = survey.primaryGoal;

    let focus, selectedExercises;

    // Determine focus based on split
    switch (split) {
      case 'full_body':
        focus = 'Full Body';
        selectedExercises = this.selectFullBodyExercises(exercises, level);
        break;
      case 'upper_lower':
        focus = day % 2 === 1 ? 'Upper Body' : 'Lower Body';
        selectedExercises = day % 2 === 1
          ? this.selectUpperBodyExercises(exercises, level)
          : this.selectLowerBodyExercises(exercises, level);
        break;
      case 'push_pull_legs':
        const pplDay = (day - 1) % 3;
        focus = ['Push', 'Pull', 'Legs'][pplDay];
        selectedExercises = this.selectPPLExercises(exercises, pplDay, level);
        break;
      case 'body_part_split':
        const bodyParts = ['Chest', 'Back', 'Shoulders', 'Legs', 'Arms'];
        focus = bodyParts[(day - 1) % bodyParts.length];
        selectedExercises = this.selectBodyPartExercises(exercises, focus.toLowerCase(), level);
        break;
      default:
        focus = 'Full Body';
        selectedExercises = this.selectFullBodyExercises(exercises, level);
    }

    // Add warm-up and cool-down
    const workout = {
      dayNumber: day,
      weekNumber: week,
      focus,
      warmUp: this.getWarmUp(focus),
      exercises: selectedExercises.map(ex => this.formatExercise(ex, week, level, goal)),
      coolDown: this.getCoolDown(),
      estimatedDuration: survey.workoutDuration,
      notes: this.generateWorkoutNotes(focus, week, level)
    };

    return workout;
  }

  /**
   * Format exercise with sets, reps, rest
   */
  formatExercise(exercise, week, level, goal) {
    const { sets, reps, rest } = this.calculateVolume(exercise, week, level, goal);

    return {
      exerciseId: exercise.id,
      name: exercise.name,
      sets,
      reps,
      rest,
      tempo: this.getTempo(exercise, goal),
      notes: exercise.instructions || '',
      progressionNotes: this.getProgressionNotes(week)
    };
  }

  /**
   * Calculate sets, reps, rest based on goals
   */
  calculateVolume(exercise, week, level, goal) {
    let sets, reps, rest;

    // Base values by goal
    switch (goal) {
      case 'strength':
        sets = level === 'beginner' ? 3 : level === 'intermediate' ? 4 : 5;
        reps = '3-5';
        rest = 180; // 3 minutes
        break;
      case 'muscle_gain':
        sets = level === 'beginner' ? 3 : 4;
        reps = '8-12';
        rest = 90;
        break;
      case 'endurance':
        sets = 3;
        reps = '15-20';
        rest = 45;
        break;
      case 'weight_loss':
        sets = 3;
        reps = '12-15';
        rest = 60;
        break;
      default:
        sets = 3;
        reps = '10-12';
        rest = 60;
    }

    // Progressive overload: increase volume slightly each week
    if (week > 4) {
      sets = Math.min(sets + 1, 6);
    }

    return { sets, reps, rest };
  }

  /**
   * Generate nutrition plan
   */
  async generateNutritionPlan(survey, metrics) {
    const { targetCalories, macros } = metrics;
    const mealsPerDay = survey.mealsPerDay || 3;
    const dietaryPref = survey.dietaryPreference || 'flexible';

    // Fetch nutrition items based on dietary preference
    const whereClause = { isActive: true };

    if (dietaryPref === 'vegetarian') {
      whereClause.isVegetarian = true;
    } else if (dietaryPref === 'vegan') {
      whereClause.isVegan = true;
    } else if (dietaryPref === 'keto') {
      whereClause.isKeto = true;
    }

    const nutritionItems = await NutritionItem.findAll({
      where: whereClause,
      limit: 100
    });

    // Create meal plan
    const mealPlan = this.createMealPlan(
      nutritionItems,
      targetCalories,
      macros,
      mealsPerDay,
      survey
    );

    return {
      dailyCalories: targetCalories,
      macros,
      mealsPerDay,
      mealPlan,
      hydration: this.calculateHydration(survey),
      supplements: this.recommendSupplements(survey),
      mealTiming: this.getMealTiming(mealsPerDay, survey),
      nutritionNotes: this.generateNutritionNotes(survey, metrics)
    };
  }

  /**
   * Create weekly meal plan
   */
  createMealPlan(items, calories, macros, mealsPerDay, survey) {
    const caloriesPerMeal = Math.round(calories / mealsPerDay);
    const weekPlan = {};

    for (let day = 1; day <= 7; day++) {
      const dayMeals = [];

      for (let meal = 1; meal <= mealsPerDay; meal++) {
        dayMeals.push(this.selectMealItems(items, caloriesPerMeal, macros, meal, mealsPerDay));
      }

      weekPlan[`day${day}`] = dayMeals;
    }

    return weekPlan;
  }

  /**
   * Select items for a single meal
   */
  selectMealItems(items, targetCalories, macros, mealNumber, totalMeals) {
    const proteinItems = items.filter(i => i.category === 'protein');
    const carbItems = items.filter(i => i.category === 'carbs' || i.category === 'fruits');
    const fatItems = items.filter(i => i.category === 'fats');
    const veggieItems = items.filter(i => i.category === 'vegetables');

    // Select one from each category
    const protein = proteinItems[Math.floor(Math.random() * proteinItems.length)];
    const carb = carbItems[Math.floor(Math.random() * carbItems.length)];
    const fat = fatItems[Math.floor(Math.random() * fatItems.length)];
    const veggie = veggieItems[Math.floor(Math.random() * veggieItems.length)];

    return {
      mealNumber,
      mealType: this.getMealType(mealNumber, totalMeals),
      items: [protein, carb, veggie, fat].filter(Boolean).map(item => ({
        foodId: item.foodId,
        name: item.name,
        serving: item.servingSize,
        calories: item.calories,
        protein: item.protein,
        carbs: item.carbs,
        fats: item.fats
      })),
      totalCalories: targetCalories,
      notes: this.getMealNotes(mealNumber, totalMeals)
    };
  }

  // Helper methods
  getDifficultyLevels(level) {
    const levels = {
      beginner: ['beginner', 'intermediate'],
      intermediate: ['beginner', 'intermediate', 'advanced'],
      advanced: ['intermediate', 'advanced', 'expert'],
      expert: ['advanced', 'expert']
    };
    return { [Op.in]: levels[level] || levels.beginner };
  }

  selectFullBodyExercises(exercises, level) {
    const count = level === 'beginner' ? 6 : level === 'intermediate' ? 8 : 10;
    return [
      ...this.pickRandom(exercises.compound, 3),
      ...this.pickRandom(exercises.legs, 2),
      ...this.pickRandom(exercises.core, 1),
      ...this.pickRandom(exercises.cardio, level === 'beginner' ? 0 : 1)
    ].slice(0, count);
  }

  selectUpperBodyExercises(exercises, level) {
    return [
      ...this.pickRandom(exercises.chest, 2),
      ...this.pickRandom(exercises.back, 2),
      ...this.pickRandom(exercises.shoulders, 1),
      ...this.pickRandom(exercises.arms, 2),
      ...this.pickRandom(exercises.core, 1)
    ];
  }

  selectLowerBodyExercises(exercises, level) {
    return [
      ...this.pickRandom(exercises.legs, 4),
      ...this.pickRandom(exercises.core, 2),
      ...this.pickRandom(exercises.cardio, 1)
    ];
  }

  selectPPLExercises(exercises, day, level) {
    if (day === 0) { // Push
      return [
        ...this.pickRandom(exercises.chest, 3),
        ...this.pickRandom(exercises.shoulders, 2),
        ...this.pickRandom(exercises.arms.filter(e => e.primaryMuscles?.includes('triceps')), 2)
      ];
    } else if (day === 1) { // Pull
      return [
        ...this.pickRandom(exercises.back, 3),
        ...this.pickRandom(exercises.arms.filter(e => e.primaryMuscles?.includes('biceps')), 2),
        ...this.pickRandom(exercises.core, 2)
      ];
    } else { // Legs
      return this.selectLowerBodyExercises(exercises, level);
    }
  }

  selectBodyPartExercises(exercises, bodyPart, level) {
    const group = exercises[bodyPart] || [];
    return this.pickRandom(group, level === 'beginner' ? 4 : level === 'intermediate' ? 5 : 6);
  }

  pickRandom(array, count) {
    if (!array || array.length === 0) return [];
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, array.length));
  }

  getWarmUp(focus) {
    return {
      duration: 10,
      activities: [
        '5 minutes light cardio',
        'Dynamic stretching',
        `${focus}-specific mobility work`
      ]
    };
  }

  getCoolDown() {
    return {
      duration: 10,
      activities: [
        '5 minutes light cardio',
        'Static stretching',
        'Foam rolling (optional)'
      ]
    };
  }

  getTempo(exercise, goal) {
    if (goal === 'strength') return '2-1-1-0'; // Fast concentric
    if (goal === 'muscle_gain') return '2-0-2-1'; // Controlled
    return '2-0-1-0'; // Standard
  }

  getProgressionNotes(week) {
    if (week <= 2) return 'Focus on form and technique';
    if (week <= 4) return 'Gradually increase weight';
    if (week <= 8) return 'Push intensity, maintain form';
    return 'Peak performance, consider deload next week';
  }

  getMealType(mealNumber, totalMeals) {
    if (mealNumber === 1) return 'breakfast';
    if (mealNumber === totalMeals) return 'dinner';
    if (totalMeals >= 4 && mealNumber === totalMeals - 1) return 'snack';
    return 'lunch';
  }

  getMealNotes(mealNumber, totalMeals) {
    if (mealNumber === 1) return 'Start your day with balanced nutrition';
    if (mealNumber === totalMeals) return 'Light dinner for better sleep';
    return 'Maintain energy throughout the day';
  }

  calculateHydration(survey) {
    const baseWater = survey.weight * 0.033; // 33ml per kg
    const activityBonus = survey.activityLevel === 'very_active' ? 1 : 0.5;
    return Math.round(baseWater + activityBonus);
  }

  recommendSupplements(survey) {
    const supplements = ['Multivitamin'];

    if (survey.primaryGoal === 'muscle_gain') {
      supplements.push('Whey Protein', 'Creatine');
    }
    if (survey.primaryGoal === 'endurance') {
      supplements.push('Electrolytes', 'BCAAs');
    }
    if (survey.dietaryPreference === 'vegan') {
      supplements.push('B12', 'Vitamin D', 'Omega-3');
    }

    return supplements;
  }

  getMealTiming(mealsPerDay, survey) {
    const timings = [];
    const workoutTime = 'morning'; // Could be from survey

    if (mealsPerDay === 3) {
      timings.push('7:00 AM', '12:00 PM', '7:00 PM');
    } else if (mealsPerDay === 4) {
      timings.push('7:00 AM', '11:00 AM', '3:00 PM', '7:00 PM');
    } else if (mealsPerDay === 5) {
      timings.push('7:00 AM', '10:00 AM', '1:00 PM', '4:00 PM', '7:00 PM');
    }

    return timings;
  }

  generateNutritionNotes(survey, metrics) {
    return `Based on your ${survey.primaryGoal} goal and ${survey.activityLevel} activity level, ` +
      `aim for ${Math.round(metrics.targetCalories)} calories daily with ` +
      `${metrics.macros.protein}g protein, ${metrics.macros.carbs}g carbs, and ${metrics.macros.fats}g fats.`;
  }

  createProgressionSchedule(survey, metrics) {
    const weeks = this.calculatePlanDuration(survey);
    const schedule = {};

    for (let week = 1; week <= weeks; week++) {
      schedule[`week${week}`] = {
        intensity: this.calculateIntensity(week, weeks, survey),
        volume: this.calculateVolume(week, weeks, survey),
        focus: this.getWeeklyFocus(week, weeks, survey)
      };
    }

    return schedule;
  }

  calculateIntensity(week, totalWeeks, survey) {
    const phase = Math.floor((week - 1) / 4);
    const intensities = ['moderate', 'moderate-high', 'high', 'deload'];
    return intensities[phase % 4];
  }

  calculateWeeklyVolume(week, totalWeeks, survey) {
    if (week <= 2) return 'low';
    if (week <= 6) return 'moderate';
    if (week <= 10) return 'high';
    return 'deload';
  }

  getWeeklyFocus(week, totalWeeks, survey) {
    if (week % 4 === 0) return 'Recovery & Assessment';
    if (survey.primaryGoal === 'strength') return 'Strength Building';
    if (survey.primaryGoal === 'muscle_gain') return 'Hypertrophy';
    return 'Progressive Overload';
  }

  selectProgressionStrategy(survey) {
    if (survey.fitnessLevel === 'beginner') return 'linear';
    if (survey.fitnessLevel === 'intermediate') return 'undulating';
    return 'block_periodization';
  }

  calculateConfidenceScore(survey, exercises) {
    let score = 70; // Base score

    // Adjust based on data completeness
    if (survey.yearsOfExperience) score += 5;
    if (survey.bodyFatPercentage) score += 5;
    if (survey.benchPressMax) score += 5;
    if (exercises.compound.length >= 10) score += 5;
    if (survey.availableEquipment?.length >= 5) score += 5;
    if (survey.medicalConditions?.length === 0) score += 5;

    return Math.min(score, 100);
  }

  predictOutcomes(survey, metrics) {
    const weeks = this.calculatePlanDuration(survey);
    const weeklyChange = metrics.weeklyWeightChange;

    return {
      weightChange: weeklyChange * weeks,
      estimatedBodyFatChange: survey.primaryGoal === 'weight_loss' ? -5 : -2,
      estimatedStrengthGain: survey.primaryGoal === 'strength' ? 25 : 15,
      estimatedMuscleGain: survey.primaryGoal === 'muscle_gain' ? 3 : 1,
      timeframe: `${weeks} weeks`
    };
  }

  calculateWeeklyWeightChange(survey) {
    if (survey.primaryGoal === 'weight_loss') return -0.5;
    if (survey.primaryGoal === 'muscle_gain') return 0.25;
    return 0;
  }

  calculatePlanDuration(survey) {
    if (survey.primaryGoal === 'weight_loss' && survey.targetWeight) {
      const weeksNeeded = Math.abs(survey.weight - survey.targetWeight) / 0.5;
      return Math.min(Math.ceil(weeksNeeded), 24);
    }
    return 12; // Default 12 weeks
  }

  generatePlanName(survey) {
    const goal = survey.primaryGoal.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    const level = survey.fitnessLevel.charAt(0).toUpperCase() + survey.fitnessLevel.slice(1);
    return `${level} ${goal} Program`;
  }

  generatePlanDescription(survey, metrics) {
    return `A personalized ${survey.workoutFrequency}-day per week program designed for ${survey.primaryGoal.replace('_', ' ')}. ` +
      `This ${survey.fitnessLevel} level plan includes ${survey.workoutDuration}-minute workouts ` +
      `with a target of ${Math.round(metrics.targetCalories)} calories per day.`;
  }

  generateWorkoutNotes(focus, week, level) {
    return `Week ${week} - ${focus} focus. Maintain proper form and gradually increase intensity.`;
  }

  calculateExerciseDistribution(exercises) {
    const total = Object.values(exercises).reduce((sum, arr) => sum + arr.length, 0);
    return {
      strength: Math.round((exercises.compound.length / total) * 100),
      isolation: Math.round((exercises.isolation.length / total) * 100),
      cardio: Math.round((exercises.cardio.length / total) * 100),
      core: Math.round((exercises.core.length / total) * 100)
    };
  }

  getPersonalizationFactors(survey) {
    return {
      goal: 0.30,
      fitness_level: 0.25,
      available_time: 0.15,
      equipment: 0.10,
      experience: 0.10,
      limitations: 0.10
    };
  }
}

module.exports = new AIWorkoutGenerator();
