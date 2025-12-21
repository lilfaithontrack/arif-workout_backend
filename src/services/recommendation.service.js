const { Op } = require('sequelize');
const User = require('../models/user.model');
const Exercise = require('../models/exercise.model');
const NutritionLog = require('../models/nutrition.model');
const WorkoutProgress = require('../models/workoutprogress.model');
const path = require('path');
const fs = require('fs');

/**
 * AI-Powered Recommendation Engine
 * Uses content-based filtering to generate personalized workout and nutrition plans
 */
class RecommendationService {
  constructor() {
    this.exerciseDBPath = path.join(__dirname, '../../data/exercises_database.json');
    this.nutritionDBPath = path.join(__dirname, '../../data/nutrition_database.json');
    this.exerciseDB = null;
    this.nutritionDB = null;
    this.loadDatabases();
  }

  /**
   * Load JSON databases into memory
   */
  loadDatabases() {
    try {
      if (fs.existsSync(this.exerciseDBPath)) {
        this.exerciseDB = JSON.parse(fs.readFileSync(this.exerciseDBPath, 'utf8'));
      }
      if (fs.existsSync(this.nutritionDBPath)) {
        this.nutritionDB = JSON.parse(fs.readFileSync(this.nutritionDBPath, 'utf8'));
      }
    } catch (error) {
      console.error('Error loading databases:', error);
    }
  }

  /**
   * Reload databases (call after admin updates)
   */
  reloadDatabases() {
    this.loadDatabases();
  }

  /**
   * Generate personalized workout plan
   * @param {number} userId - User ID
   * @param {object} preferences - Optional preferences override
   * @returns {object} Workout plan
   */
  async generateWorkoutPlan(userId, preferences = {}) {
    try {
      // 1. Get user profile
      const user = await User.findByPk(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const profile = user.fitness_profile || this.getDefaultProfile();
      const mergedProfile = { ...profile, ...preferences };

      // 2. Get exercises from database or JSON
      let exercises;
      if (this.exerciseDB && this.exerciseDB.exercises) {
        exercises = this.exerciseDB.exercises;
      } else {
        // Fallback to MySQL database
        const dbExercises = await Exercise.findAll({
          where: { isActive: true }
        });
        exercises = dbExercises.map(ex => this.convertExerciseToMLFormat(ex));
      }

      // 3. Filter exercises by constraints
      let candidates = exercises.filter(ex => {
        return this.matchesDifficulty(ex, mergedProfile.fitnessLevel) &&
               this.hasEquipment(ex, mergedProfile.availableEquipment) &&
               !this.hasContraindication(ex, mergedProfile.healthConditions) &&
               this.alignsWithGoals(ex, mergedProfile.goals);
      });

      if (candidates.length === 0) {
        // Relax constraints if no matches
        candidates = exercises.filter(ex => 
          this.matchesDifficulty(ex, mergedProfile.fitnessLevel)
        );
      }

      // 4. Score each exercise
      candidates = candidates.map(ex => ({
        ...ex,
        score: this.calculateExerciseScore(ex, mergedProfile)
      }));

      // 5. Sort by score
      candidates.sort((a, b) => b.score - a.score);

      // 6. Create weekly plan
      const weeklyPlan = this.createWeeklySchedule(candidates, mergedProfile);

      // 7. Get user's workout history for context
      const history = await this.getUserWorkoutHistory(userId);

      return {
        planId: `wp_${Date.now()}`,
        userId: userId,
        duration: preferences.duration || '4_weeks',
        goal: mergedProfile.goals[0] || 'general_fitness',
        schedule: weeklyPlan,
        reasoning: this.generateWorkoutReasoning(mergedProfile, weeklyPlan),
        progressTracking: {
          checkInFrequency: 'weekly',
          adjustmentTriggers: ['plateau', 'injury', 'goal_change']
        },
        history: history
      };
    } catch (error) {
      console.error('Error generating workout plan:', error);
      throw error;
    }
  }

  /**
   * Generate personalized nutrition plan
   * @param {number} userId - User ID
   * @param {object} preferences - Optional preferences override
   * @returns {object} Nutrition plan
   */
  async generateNutritionPlan(userId, preferences = {}) {
    try {
      const user = await User.findByPk(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const profile = user.fitness_profile || this.getDefaultProfile();
      const mergedProfile = { ...profile, ...preferences };

      // 1. Calculate daily calorie needs
      const tdee = this.calculateTDEE(mergedProfile);
      const targetCalories = this.adjustForGoal(tdee, mergedProfile.goals);

      // 2. Calculate macro targets
      const macros = this.calculateMacros(targetCalories, mergedProfile.goals);

      // 3. Get foods from database
      let foods = [];
      if (this.nutritionDB && this.nutritionDB.foods) {
        foods = this.nutritionDB.foods.filter(food => {
          return this.matchesDiet(food, mergedProfile.dietaryPreferences) &&
                 !this.hasAllergen(food, mergedProfile.allergens);
        });
      }

      // 4. Create meal plan
      const mealPlan = this.createDailyMealPlan(foods, macros, mergedProfile);

      return {
        planId: `np_${Date.now()}`,
        userId: userId,
        dailyCalories: targetCalories,
        tdee: tdee,
        macros: macros,
        meals: mealPlan,
        hydration: {
          dailyWaterGoal: this.calculateWaterIntake(mergedProfile),
          unit: 'ml'
        },
        reasoning: this.generateNutritionReasoning(mergedProfile, targetCalories, macros)
      };
    } catch (error) {
      console.error('Error generating nutrition plan:', error);
      throw error;
    }
  }

  /**
   * Get recommended exercises for user
   * @param {number} userId - User ID
   * @param {object} filters - Optional filters
   * @returns {array} Recommended exercises
   */
  async getRecommendedExercises(userId, filters = {}) {
    const user = await User.findByPk(userId);
    const profile = user?.fitness_profile || this.getDefaultProfile();

    let exercises;
    if (this.exerciseDB && this.exerciseDB.exercises) {
      exercises = this.exerciseDB.exercises;
    } else {
      const dbExercises = await Exercise.findAll({ where: { isActive: true } });
      exercises = dbExercises.map(ex => this.convertExerciseToMLFormat(ex));
    }

    // Apply filters
    if (filters.category) {
      exercises = exercises.filter(ex => ex.category === filters.category);
    }
    if (filters.muscleGroup) {
      exercises = exercises.filter(ex => 
        ex.muscleGroups?.primary?.includes(filters.muscleGroup) ||
        ex.muscleGroups?.secondary?.includes(filters.muscleGroup)
      );
    }

    // Score and sort
    exercises = exercises.map(ex => ({
      ...ex,
      score: this.calculateExerciseScore(ex, profile)
    }));

    exercises.sort((a, b) => b.score - a.score);

    return exercises.slice(0, filters.limit || 20);
  }

  // ============ SCORING ALGORITHMS ============

  /**
   * Calculate exercise score based on user profile
   */
  calculateExerciseScore(exercise, profile) {
    let score = 0;

    // Goal alignment (40% weight)
    if (exercise.goals && profile.goals) {
      const goalMatch = exercise.goals.filter(g => 
        profile.goals.includes(g)
      ).length;
      score += (goalMatch / Math.max(profile.goals.length, 1)) * 40;
    }

    // Difficulty match (20% weight)
    const difficultyMatch = this.getDifficultyMatch(
      exercise.difficulty, 
      profile.fitnessLevel
    );
    score += difficultyMatch * 20;

    // Muscle group diversity (20% weight)
    score += this.getMuscleGroupDiversity(exercise) * 20;

    // Popularity & effectiveness (20% weight)
    const popularity = exercise.popularityScore || 50;
    const effectiveness = exercise.effectivenessScore || 50;
    score += (popularity * 0.5 + effectiveness * 0.5) * 0.2;

    return Math.round(score * 100) / 100;
  }

  /**
   * Get difficulty match score
   */
  getDifficultyMatch(exerciseDifficulty, userLevel) {
    const levels = { beginner: 1, intermediate: 2, advanced: 3 };
    const exLevel = levels[exerciseDifficulty] || 1;
    const userLevelNum = levels[userLevel] || 1;
    
    const diff = Math.abs(exLevel - userLevelNum);
    if (diff === 0) return 1.0;
    if (diff === 1) return 0.7;
    return 0.3;
  }

  /**
   * Get muscle group diversity score
   */
  getMuscleGroupDiversity(exercise) {
    if (!exercise.muscleGroups) return 0.5;
    const primary = exercise.muscleGroups.primary?.length || 0;
    const secondary = exercise.muscleGroups.secondary?.length || 0;
    return Math.min((primary + secondary * 0.5) / 4, 1);
  }

  // ============ FILTERING FUNCTIONS ============

  matchesDifficulty(exercise, userLevel) {
    if (!exercise.difficulty) return true;
    const levels = { beginner: 1, intermediate: 2, advanced: 3 };
    const exLevel = levels[exercise.difficulty] || 1;
    const userLevelNum = levels[userLevel] || 1;
    return Math.abs(exLevel - userLevelNum) <= 1;
  }

  hasEquipment(exercise, availableEquipment) {
    if (!exercise.equipment || exercise.equipment.length === 0) return true;
    if (!availableEquipment || availableEquipment.length === 0) {
      return exercise.equipment.includes('none') || exercise.equipment.includes('bodyweight');
    }
    return exercise.equipment.some(eq => 
      availableEquipment.includes(eq) || eq === 'none' || eq === 'bodyweight'
    );
  }

  hasContraindication(exercise, healthConditions) {
    if (!exercise.contraindications || !healthConditions) return false;
    return exercise.contraindications.some(c => healthConditions.includes(c));
  }

  alignsWithGoals(exercise, goals) {
    if (!exercise.goals || !goals || goals.length === 0) return true;
    return exercise.goals.some(g => goals.includes(g));
  }

  matchesDiet(food, dietaryPreferences) {
    if (!dietaryPreferences || dietaryPreferences.length === 0) return true;
    if (!food.dietaryInfo) return true;
    
    for (const pref of dietaryPreferences) {
      if (pref === 'vegetarian' && !food.dietaryInfo.isVegetarian) return false;
      if (pref === 'vegan' && !food.dietaryInfo.isVegan) return false;
      if (pref === 'gluten_free' && !food.dietaryInfo.isGlutenFree) return false;
      if (pref === 'keto' && !food.dietaryInfo.isKeto) return false;
    }
    return true;
  }

  hasAllergen(food, allergens) {
    if (!allergens || allergens.length === 0) return false;
    if (!food.dietaryInfo || !food.dietaryInfo.allergens) return false;
    return food.dietaryInfo.allergens.some(a => allergens.includes(a));
  }

  // ============ PLAN GENERATION ============

  /**
   * Create 7-day workout schedule
   */
  createWeeklySchedule(exercises, profile) {
    const schedule = [];
    const daysPerWeek = profile.workoutFrequency || 4;
    const restDays = profile.preferences?.restDays || ['sunday'];
    const workoutDuration = profile.preferences?.workoutDuration || 45;

    // Muscle group rotation for balanced training
    const muscleGroupRotation = [
      { focus: ['chest', 'triceps'], name: 'Upper Body Push' },
      { focus: ['back', 'biceps'], name: 'Upper Body Pull' },
      { focus: ['legs', 'glutes'], name: 'Lower Body' },
      { focus: ['shoulders', 'core'], name: 'Shoulders & Core' },
      { focus: ['full_body'], name: 'Full Body' }
    ];

    const dayNames = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    let workoutCount = 0;

    for (let day = 0; day < 7; day++) {
      const dayName = dayNames[day];
      
      if (restDays.includes(dayName) || workoutCount >= daysPerWeek) {
        schedule.push({ 
          day: dayName, 
          type: 'rest',
          activities: ['Recovery', 'Light stretching', 'Walking']
        });
        continue;
      }

      // Select exercises for this day
      const rotation = muscleGroupRotation[workoutCount % muscleGroupRotation.length];
      const dayExercises = this.selectExercisesForDay(
        exercises, 
        rotation.focus, 
        workoutDuration
      );

      schedule.push({
        day: dayName,
        type: 'workout',
        name: rotation.name,
        focus: rotation.focus,
        exercises: dayExercises,
        estimatedDuration: this.calculateTotalDuration(dayExercises),
        estimatedCalories: this.calculateTotalCalories(dayExercises, profile)
      });

      workoutCount++;
    }

    return schedule;
  }

  /**
   * Select exercises for a specific day
   */
  selectExercisesForDay(exercises, targetMuscles, duration) {
    const selected = [];
    let totalDuration = 0;
    const maxDuration = duration * 60; // Convert to seconds

    // Filter exercises that target the specified muscles
    let candidates = exercises.filter(ex => {
      if (!ex.muscleGroups) return false;
      const primary = ex.muscleGroups.primary || [];
      const secondary = ex.muscleGroups.secondary || [];
      return targetMuscles.some(muscle => 
        primary.includes(muscle) || secondary.includes(muscle) || muscle === 'full_body'
      );
    });

    // If not enough candidates, use all exercises
    if (candidates.length < 5) {
      candidates = exercises;
    }

    // Select 5-8 exercises
    const targetCount = Math.min(Math.floor(duration / 6), 8);
    
    for (let i = 0; i < Math.min(candidates.length, targetCount); i++) {
      const exercise = candidates[i];
      const exerciseDuration = this.getExerciseDuration(exercise);
      
      if (totalDuration + exerciseDuration <= maxDuration) {
        selected.push({
          id: exercise.id,
          name: exercise.name,
          category: exercise.category,
          sets: exercise.sets || 3,
          reps: exercise.reps || 10,
          duration: exercise.duration,
          restTime: exercise.restTime || 60,
          videoUrl: exercise.videoUrl,
          imageUrl: exercise.imageUrl,
          instructions: exercise.instructions,
          tips: exercise.tips
        });
        totalDuration += exerciseDuration;
      }
    }

    return selected;
  }

  /**
   * Create daily meal plan
   */
  createDailyMealPlan(foods, macros, profile) {
    if (!foods || foods.length === 0) {
      return this.getDefaultMealPlan(macros);
    }

    const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];
    const calorieDistribution = {
      breakfast: 0.25,
      lunch: 0.35,
      dinner: 0.30,
      snack: 0.10
    };

    const meals = mealTypes.map(type => {
      const targetCalories = macros.protein * 4 + macros.carbs * 4 + macros.fats * 9;
      const mealCalories = Math.round(targetCalories * calorieDistribution[type]);

      // Filter foods suitable for this meal type
      const suitableFoods = foods.filter(f => 
        f.mealTypes?.includes(type) || !f.mealTypes
      );

      // Select 2-3 foods for variety
      const selectedFoods = suitableFoods.slice(0, 3);

      return {
        type: type,
        time: this.getMealTime(type),
        foods: selectedFoods.map(f => ({
          id: f.id,
          name: f.name,
          servingSize: f.servingSize,
          calories: f.macros.calories,
          protein: f.macros.protein,
          carbs: f.macros.carbs,
          fats: f.macros.fats
        })),
        targetCalories: mealCalories
      };
    });

    return meals;
  }

  // ============ CALCULATIONS ============

  /**
   * Calculate TDEE (Total Daily Energy Expenditure)
   */
  calculateTDEE(profile) {
    // Mifflin-St Jeor Equation
    const weight = profile.weight || 70;
    const height = profile.height || 170;
    const age = profile.age || 30;
    const gender = profile.gender || 'male';

    let bmr;
    if (gender === 'male') {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }

    // Activity multiplier
    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9
    };

    const activityLevel = profile.activityLevel || 'moderate';
    return Math.round(bmr * (activityMultipliers[activityLevel] || 1.55));
  }

  /**
   * Adjust calories based on goal
   */
  adjustForGoal(tdee, goals) {
    if (!goals || goals.length === 0) return tdee;
    
    if (goals.includes('weight_loss')) {
      return tdee - 500; // 500 calorie deficit
    } else if (goals.includes('muscle_gain')) {
      return tdee + 300; // 300 calorie surplus
    }
    return tdee; // maintenance
  }

  /**
   * Calculate macro distribution
   */
  calculateMacros(calories, goals) {
    let proteinPercent, carbsPercent, fatsPercent;

    if (goals?.includes('muscle_gain')) {
      proteinPercent = 30;
      carbsPercent = 45;
      fatsPercent = 25;
    } else if (goals?.includes('weight_loss')) {
      proteinPercent = 40;
      carbsPercent = 30;
      fatsPercent = 30;
    } else {
      proteinPercent = 25;
      carbsPercent = 50;
      fatsPercent = 25;
    }

    return {
      protein: Math.round((calories * proteinPercent / 100) / 4),
      carbs: Math.round((calories * carbsPercent / 100) / 4),
      fats: Math.round((calories * fatsPercent / 100) / 9)
    };
  }

  /**
   * Calculate water intake recommendation
   */
  calculateWaterIntake(profile) {
    const weight = profile.weight || 70;
    const activityLevel = profile.activityLevel || 'moderate';
    
    let baseWater = weight * 30; // 30ml per kg
    
    if (activityLevel === 'active' || activityLevel === 'very_active') {
      baseWater += 500; // Add 500ml for active people
    }
    
    return Math.round(baseWater);
  }

  /**
   * Calculate total workout duration
   */
  calculateTotalDuration(exercises) {
    return exercises.reduce((total, ex) => {
      const exerciseTime = this.getExerciseDuration(ex);
      return total + exerciseTime;
    }, 0);
  }

  /**
   * Get single exercise duration
   */
  getExerciseDuration(exercise) {
    if (exercise.duration) {
      return exercise.duration + (exercise.restTime || 60) * (exercise.sets || 3);
    }
    // Estimate: 3 seconds per rep * reps * sets + rest time
    const reps = exercise.reps || 10;
    const sets = exercise.sets || 3;
    const restTime = exercise.restTime || 60;
    return (3 * reps * sets) + (restTime * sets);
  }

  /**
   * Calculate total calories burned
   */
  calculateTotalCalories(exercises, profile) {
    return exercises.reduce((total, ex) => {
      const rate = ex.caloriesBurnedPerMinute || 5;
      const duration = this.getExerciseDuration(ex) / 60;
      return total + (rate * duration);
    }, 0);
  }

  // ============ HELPER FUNCTIONS ============

  /**
   * Get user workout history
   */
  async getUserWorkoutHistory(userId) {
    try {
      const history = await WorkoutProgress.findAll({
        where: { userId },
        order: [['createdAt', 'DESC']],
        limit: 10
      });
      return history;
    } catch (error) {
      return [];
    }
  }

  /**
   * Convert database exercise to ML format
   */
  convertExerciseToMLFormat(dbExercise) {
    return {
      id: dbExercise.id,
      name: dbExercise.name,
      slug: dbExercise.slug,
      category: dbExercise.category,
      muscleGroups: dbExercise.muscleGroups,
      equipment: dbExercise.equipment,
      difficulty: dbExercise.difficulty,
      instructions: dbExercise.instructions,
      videoUrl: dbExercise.videoUrl,
      imageUrl: dbExercise.imageUrl,
      caloriesBurnedPerMinute: dbExercise.caloriesBurnedPerMinute,
      duration: dbExercise.duration,
      sets: dbExercise.sets,
      reps: dbExercise.reps,
      restTime: dbExercise.restTime,
      tips: dbExercise.tips,
      goals: this.inferGoalsFromCategory(dbExercise.category),
      popularityScore: 70,
      effectivenessScore: 75
    };
  }

  /**
   * Infer goals from exercise category
   */
  inferGoalsFromCategory(category) {
    const goalMap = {
      strength: ['muscle_gain', 'strength'],
      cardio: ['weight_loss', 'endurance', 'heart_health'],
      flexibility: ['flexibility', 'injury_prevention'],
      balance: ['balance', 'injury_prevention'],
      yoga: ['flexibility', 'stress_relief'],
      hiit: ['weight_loss', 'endurance']
    };
    return goalMap[category] || ['general_fitness'];
  }

  /**
   * Get default user profile
   */
  getDefaultProfile() {
    return {
      goals: ['general_fitness'],
      fitnessLevel: 'beginner',
      age: 30,
      gender: 'male',
      height: 170,
      weight: 70,
      activityLevel: 'moderate',
      workoutFrequency: 3,
      availableEquipment: ['none'],
      healthConditions: [],
      dietaryPreferences: [],
      allergens: [],
      preferences: {
        workoutDuration: 45,
        workoutTime: 'morning',
        restDays: ['sunday']
      }
    };
  }

  /**
   * Get meal time
   */
  getMealTime(mealType) {
    const times = {
      breakfast: '08:00',
      lunch: '12:30',
      dinner: '18:30',
      snack: '15:00',
      pre_workout: '16:00',
      post_workout: '19:00'
    };
    return times[mealType] || '12:00';
  }

  /**
   * Get default meal plan
   */
  getDefaultMealPlan(macros) {
    return [
      {
        type: 'breakfast',
        time: '08:00',
        foods: [],
        targetCalories: Math.round((macros.protein * 4 + macros.carbs * 4 + macros.fats * 9) * 0.25),
        note: 'Add foods from nutrition database'
      },
      {
        type: 'lunch',
        time: '12:30',
        foods: [],
        targetCalories: Math.round((macros.protein * 4 + macros.carbs * 4 + macros.fats * 9) * 0.35),
        note: 'Add foods from nutrition database'
      },
      {
        type: 'dinner',
        time: '18:30',
        foods: [],
        targetCalories: Math.round((macros.protein * 4 + macros.carbs * 4 + macros.fats * 9) * 0.30),
        note: 'Add foods from nutrition database'
      }
    ];
  }

  /**
   * Generate workout reasoning
   */
  generateWorkoutReasoning(profile, plan) {
    const goal = profile.goals[0] || 'general_fitness';
    const level = profile.fitnessLevel || 'beginner';
    const frequency = profile.workoutFrequency || 3;

    return `Based on your ${level} fitness level and ${goal.replace('_', ' ')} goal, we've created a balanced ${frequency}-day per week program. The plan includes progressive overload and adequate rest days for recovery. Each workout is designed to target different muscle groups for optimal results.`;
  }

  /**
   * Generate nutrition reasoning
   */
  generateNutritionReasoning(profile, calories, macros) {
    const goal = profile.goals[0] || 'general_fitness';
    const deficit = profile.goals?.includes('weight_loss') ? 500 : 0;
    const surplus = profile.goals?.includes('muscle_gain') ? 300 : 0;

    let reasoning = `Your daily calorie target of ${calories} kcal `;
    
    if (deficit > 0) {
      reasoning += `creates a ${deficit}-calorie deficit for healthy weight loss of approximately 0.5kg per week. `;
    } else if (surplus > 0) {
      reasoning += `provides a ${surplus}-calorie surplus to support muscle growth. `;
    } else {
      reasoning += `maintains your current weight while supporting your fitness activities. `;
    }

    reasoning += `The macro distribution (${macros.protein}g protein, ${macros.carbs}g carbs, ${macros.fats}g fats) is optimized for ${goal.replace('_', ' ')}.`;

    return reasoning;
  }
}

module.exports = new RecommendationService();
