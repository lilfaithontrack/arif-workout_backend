const { NutritionItem, UserSurvey, User } = require('../models');
const { Op } = require('sequelize');

/**
 * Generate personalized nutrition plan based on user survey
 */
exports.generateNutritionPlan = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { goal, dietaryPreference, calories, mealsPerDay } = req.query;
    
    // Try to get survey, but don't require it
    let survey = null;
    if (userId) {
      survey = await UserSurvey.findOne({
        where: { userId, isActive: true },
        order: [['createdAt', 'DESC']]
      });
    }

    // Use query params first, then survey, then defaults
    // Map frontend goals to backend goals
    const goalMapping = {
      'maintenance': 'general_fitness',
      'performance': 'endurance',
    };
    const mappedGoal = goalMapping[goal] || goal;
    
    const customizedSurvey = {
      primaryGoal: mappedGoal || survey?.primaryGoal || 'general_fitness',
      dietaryPreference: dietaryPreference || survey?.dietaryPreference || 'balanced',
      dailyCalorieTarget: calories ? parseInt(calories) : (survey?.dailyCalorieTarget || 2000),
      mealsPerDay: mealsPerDay ? parseInt(mealsPerDay) : (survey?.mealsPerDay || 3),
      weight: survey?.weight || 70,
      height: survey?.height || 170,
      age: survey?.age || 30,
      gender: survey?.gender || 'male',
      activityLevel: survey?.activityLevel || 'moderately_active'
    };
    
    console.log('Backend received params:', {
      goal: goal,
      mappedGoal: mappedGoal,
      calories: calories,
      mealsPerDay: mealsPerDay,
      dietaryPreference: dietaryPreference,
      customizedSurvey: customizedSurvey
    });

    const nutritionPlan = await buildNutritionPlan(customizedSurvey);

    res.status(200).json({
      success: true,
      message: 'Nutrition plan generated successfully',
      data: nutritionPlan  // Return plan directly, not nested
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Generate meal plan for specific meal type
 */
exports.generateMealByType = async (req, res, next) => {
  try {
    const { mealType, calories, dietaryPreference } = req.query;
    
    if (!mealType) {
      return res.status(400).json({
        success: false,
        message: 'Meal type is required (breakfast, lunch, dinner, snack, pre_workout, post_workout)'
      });
    }

    const targetCalories = parseInt(calories) || 500;
    
    const where = { isActive: true };
    
    if (dietaryPreference) {
      applyDietaryPreference(where, dietaryPreference);
    }

    const mealTypeMapping = getMealTypeMapping(mealType);
    if (mealTypeMapping.mealTypes) {
      where.mealTypes = {
        [Op.contains]: [mealType]
      };
    }

    const nutritionItems = await NutritionItem.findAll({
      where,
      limit: 50
    });

    if (nutritionItems.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No nutrition items found for the specified criteria'
      });
    }

    const meal = buildMealPlan(nutritionItems, mealType, targetCalories);

    res.status(200).json({
      success: true,
      data: {
        mealType,
        targetCalories,
        actualCalories: meal.totalCalories,
        items: meal.items,
        macros: meal.macros,
        tips: meal.tips
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Generate daily meal plan
 */
exports.generateDailyMealPlan = async (req, res, next) => {
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

    const dailyCalories = survey.dailyCalorieTarget || calculateDailyCalories(survey);
    const mealsPerDay = survey.mealsPerDay || 3;
    const dietaryPreference = survey.dietaryPreference;

    const where = { isActive: true };
    
    if (dietaryPreference && dietaryPreference !== 'flexible' && dietaryPreference !== 'omnivore') {
      applyDietaryPreference(where, dietaryPreference);
    }

    const nutritionItems = await NutritionItem.findAll({
      where,
      limit: 100
    });

    if (nutritionItems.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No nutrition items found'
      });
    }

    const dailyPlan = buildDailyMealPlan(
      nutritionItems,
      dailyCalories,
      mealsPerDay,
      survey.primaryGoal
    );

    res.status(200).json({
      success: true,
      message: 'Daily meal plan generated successfully',
      data: {
        dailyCalories,
        mealsPerDay,
        meals: dailyPlan.meals,
        dailyTotals: dailyPlan.totals,
        recommendations: dailyPlan.recommendations
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Generate meal suggestions based on macros
 */
exports.generateByMacros = async (req, res, next) => {
  try {
    const { protein, carbs, fats, calories } = req.query;
    
    if (!calories && !protein && !carbs && !fats) {
      return res.status(400).json({
        success: false,
        message: 'At least one macro parameter (protein, carbs, fats) or calories is required'
      });
    }

    const nutritionItems = await NutritionItem.findAll({
      where: { isActive: true },
      limit: 100
    });

    const targetMacros = {
      protein: parseFloat(protein) || null,
      carbs: parseFloat(carbs) || null,
      fats: parseFloat(fats) || null,
      calories: parseInt(calories) || null
    };

    const suggestions = findMacroMatches(nutritionItems, targetMacros);

    res.status(200).json({
      success: true,
      data: {
        targetMacros,
        suggestions: suggestions.slice(0, 10),
        totalFound: suggestions.length
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Generate weekly meal prep plan
 */
exports.generateWeeklyMealPrep = async (req, res, next) => {
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

    const dailyCalories = survey.dailyCalorieTarget || calculateDailyCalories(survey);
    const dietaryPreference = survey.dietaryPreference;

    const where = { isActive: true };
    
    if (dietaryPreference && dietaryPreference !== 'flexible' && dietaryPreference !== 'omnivore') {
      applyDietaryPreference(where, dietaryPreference);
    }

    const nutritionItems = await NutritionItem.findAll({
      where,
      limit: 150
    });

    const weeklyPlan = buildWeeklyMealPrep(
      nutritionItems,
      dailyCalories,
      survey.primaryGoal,
      7
    );

    res.status(200).json({
      success: true,
      message: 'Weekly meal prep plan generated successfully',
      data: {
        weeklyPlan,
        shoppingList: generateShoppingList(weeklyPlan),
        prepTips: getMealPrepTips()
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Helper: Build complete nutrition plan based on survey
 */
async function buildNutritionPlan(survey) {
  const {
    primaryGoal,
    weight,
    height,
    age,
    gender,
    activityLevel,
    dietaryPreference,
    dailyCalorieTarget,
    mealsPerDay
  } = survey;

  const calculatedCalories = dailyCalorieTarget || calculateDailyCalories(survey);
  const macros = calculateMacros(calculatedCalories, primaryGoal);
  
  const where = { isActive: true };
  
  if (dietaryPreference && dietaryPreference !== 'flexible' && dietaryPreference !== 'omnivore' && dietaryPreference !== 'balanced') {
    applyDietaryPreference(where, dietaryPreference);
  }

  // Add goal-based filtering to get more relevant items
  if (primaryGoal) {
    const goalFilters = getGoalBasedFilters(primaryGoal);
    if (goalFilters && Object.keys(goalFilters).length > 0) {
      Object.assign(where, goalFilters);
    }
  }

  const nutritionItems = await NutritionItem.findAll({
    where,
    limit: 200, // Increased limit for more variety
    order: [
      // Add random ordering to get different items each time
      [NutritionItem.sequelize.fn('RAND')]
    ]
  });

  const meals = mealsPerDay || 3;
  const caloriesPerMeal = Math.floor(calculatedCalories / meals);

  console.log('Building nutrition plan:', {
    mealsPerDay: meals,
    calculatedCalories: calculatedCalories,
    caloriesPerMeal: caloriesPerMeal,
    primaryGoal: primaryGoal
  });

  const mealPlan = [];
  const mealTypes = getMealTypesForDay(meals);

  // Shuffle items before building each meal for more variety
  // IMPORTANT: Create a fresh shuffle for each meal to ensure variety
  for (const mealType of mealTypes) {
    // Create a fresh shuffle for each meal to ensure different items
    const shuffledItems = shuffleArray([...nutritionItems]);
    // Use enhanced meal building with goal consideration
    const meal = buildMealPlanWithGoal(shuffledItems, mealType, caloriesPerMeal, primaryGoal);
    mealPlan.push({
      mealType,
      targetCalories: caloriesPerMeal,
      ...meal
    });
  }

  const totalCalories = mealPlan.reduce((sum, meal) => sum + meal.totalCalories, 0);

  console.log('Generated plan summary:', {
    mealsCount: mealPlan.length,
    totalCalories: totalCalories,
    targetCalories: calculatedCalories
  });

  return {
    dailyCalories: calculatedCalories,
    totalCalories: totalCalories, // Add actual total for verification
    macros,
    mealsPerDay: meals,
    meals: mealPlan,
    hydration: calculateHydration(weight),
    supplements: getSupplementRecommendations(primaryGoal),
    tips: getNutritionTips(primaryGoal, dietaryPreference)
  };
}

/**
 * Helper: Shuffle array for randomization
 */
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Helper: Build single meal plan with randomization
 */
function buildMealPlan(nutritionItems, mealType, targetCalories) {
  const suitableItems = filterItemsByMealType(nutritionItems, mealType);
  
  // Shuffle items to add randomization
  const shuffledItems = shuffleArray(suitableItems);
  
  const selectedItems = [];
  let currentCalories = 0;
  const tolerance = targetCalories * 0.15;

  // Sort by how close they are to remaining calories needed
  const sortedItems = shuffledItems.sort((a, b) => {
    const aDiff = Math.abs(a.calories - (targetCalories - currentCalories));
    const bDiff = Math.abs(b.calories - (targetCalories - currentCalories));
    return aDiff - bDiff;
  });

  // Take a random subset to increase variety
  const startIndex = Math.floor(Math.random() * Math.max(1, sortedItems.length / 4));
  const itemsToConsider = sortedItems.slice(startIndex);

  for (const item of itemsToConsider) {
    if (currentCalories >= targetCalories - tolerance) break;
    if (currentCalories + item.calories <= targetCalories + tolerance) {
      selectedItems.push({
        id: item.id,
        name: item.name,
        servingSize: item.servingSize,
        calories: item.calories,
        protein: item.protein,
        carbs: item.carbs,
        fats: item.fats,
        fiber: item.fiber,
        category: item.category,
        preparationTime: item.preparationTime
      });
      currentCalories += item.calories;
    }
  }

  const macros = calculateMealMacros(selectedItems);

  return {
    items: selectedItems,
    totalCalories: currentCalories,
    macros,
    tips: getMealTypeTips(mealType)
  };
}

/**
 * Helper: Build daily meal plan with randomization
 */
function buildDailyMealPlan(nutritionItems, dailyCalories, mealsPerDay, goal) {
  const mealTypes = getMealTypesForDay(mealsPerDay);
  const mealCalories = distributeDailyCalories(dailyCalories, mealsPerDay, goal);
  
  // Shuffle nutrition items for each day to add variety
  const shuffledItems = shuffleArray(nutritionItems);
  
  const meals = [];
  
  for (let i = 0; i < mealTypes.length; i++) {
    // Use enhanced meal building with goal consideration
    const meal = buildMealPlanWithGoal(shuffledItems, mealTypes[i], mealCalories[i], goal);
    meals.push({
      mealType: mealTypes[i],
      targetCalories: mealCalories[i],
      ...meal
    });
  }

  const totals = {
    calories: meals.reduce((sum, m) => sum + m.totalCalories, 0),
    protein: meals.reduce((sum, m) => sum + m.macros.protein, 0),
    carbs: meals.reduce((sum, m) => sum + m.macros.carbs, 0),
    fats: meals.reduce((sum, m) => sum + m.macros.fats, 0),
    fiber: meals.reduce((sum, m) => sum + m.macros.fiber, 0)
  };

  return {
    meals,
    totals,
    recommendations: getDailyRecommendations(totals, dailyCalories, goal)
  };
}

/**
 * Helper: Build weekly meal prep plan
 */
function buildWeeklyMealPrep(nutritionItems, dailyCalories, goal, days) {
  const weeklyPlan = [];
  
  for (let day = 1; day <= days; day++) {
    const dailyPlan = buildDailyMealPlan(nutritionItems, dailyCalories, 3, goal);
    weeklyPlan.push({
      day,
      dayName: getDayName(day),
      ...dailyPlan
    });
  }

  return weeklyPlan;
}

/**
 * Utility functions
 */
function calculateDailyCalories(survey) {
  const { weight, height, age, gender, activityLevel, primaryGoal } = survey;
  
  let bmr;
  if (gender === 'male') {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }

  const activityMultipliers = {
    sedentary: 1.2,
    lightly_active: 1.375,
    moderately_active: 1.55,
    very_active: 1.725,
    extremely_active: 1.9
  };

  const tdee = bmr * (activityMultipliers[activityLevel] || 1.2);

  const goalAdjustments = {
    weight_loss: -500,
    muscle_gain: 300,
    strength: 200,
    body_recomposition: -200,
    general_fitness: 0
  };

  const adjustment = goalAdjustments[primaryGoal] || 0;
  return Math.round(tdee + adjustment);
}

function calculateMacros(calories, goal) {
  const macroRatios = {
    weight_loss: { protein: 0.35, carbs: 0.35, fats: 0.30 },
    muscle_gain: { protein: 0.30, carbs: 0.45, fats: 0.25 },
    strength: { protein: 0.30, carbs: 0.40, fats: 0.30 },
    endurance: { protein: 0.20, carbs: 0.55, fats: 0.25 },
    body_recomposition: { protein: 0.35, carbs: 0.35, fats: 0.30 },
    general_fitness: { protein: 0.30, carbs: 0.40, fats: 0.30 }
  };

  const ratios = macroRatios[goal] || macroRatios.general_fitness;

  return {
    protein: Math.round((calories * ratios.protein) / 4),
    carbs: Math.round((calories * ratios.carbs) / 4),
    fats: Math.round((calories * ratios.fats) / 9)
  };
}

function calculateMealMacros(items) {
  return {
    protein: items.reduce((sum, item) => sum + (parseFloat(item.protein) || 0), 0),
    carbs: items.reduce((sum, item) => sum + (parseFloat(item.carbs) || 0), 0),
    fats: items.reduce((sum, item) => sum + (parseFloat(item.fats) || 0), 0),
    fiber: items.reduce((sum, item) => sum + (parseFloat(item.fiber) || 0), 0)
  };
}

function calculateHydration(weight) {
  const baseWater = weight * 0.033;
  return {
    minimum: Math.round(baseWater * 1000),
    recommended: Math.round(baseWater * 1.2 * 1000),
    unit: 'ml'
  };
}

function getMealTypeMapping(mealType) {
  const mapping = {
    breakfast: { mealTypes: true, time: 'morning' },
    lunch: { mealTypes: true, time: 'midday' },
    dinner: { mealTypes: true, time: 'evening' },
    snack: { mealTypes: true, time: 'anytime' },
    pre_workout: { mealTypes: true, time: 'before_exercise' },
    post_workout: { mealTypes: true, time: 'after_exercise' }
  };
  return mapping[mealType] || { mealTypes: false, time: 'anytime' };
}

function applyDietaryPreference(where, preference) {
  switch (preference) {
    case 'vegetarian':
      where.isVegetarian = true;
      break;
    case 'vegan':
      where.isVegan = true;
      break;
    case 'keto':
      where.isKeto = true;
      break;
    case 'paleo':
      where.tags = { [Op.contains]: ['paleo'] };
      break;
    case 'pescatarian':
      where[Op.or] = [
        { isVegetarian: true },
        { tags: { [Op.contains]: ['fish', 'seafood'] } }
      ];
      break;
    case 'mediterranean':
      where.tags = { [Op.contains]: ['mediterranean'] };
      break;
  }
}

function getMealTypesForDay(mealsPerDay) {
  const mealSequences = {
    1: ['lunch'],
    2: ['breakfast', 'dinner'],
    3: ['breakfast', 'lunch', 'dinner'],
    4: ['breakfast', 'snack', 'lunch', 'dinner'],
    5: ['breakfast', 'snack', 'lunch', 'snack', 'dinner'],
    6: ['breakfast', 'snack', 'lunch', 'snack', 'dinner', 'snack']
  };
  return mealSequences[mealsPerDay] || mealSequences[3];
}

function distributeDailyCalories(dailyCalories, mealsPerDay, goal) {
  const distributions = {
    3: [0.30, 0.35, 0.35],
    4: [0.25, 0.15, 0.35, 0.25],
    5: [0.25, 0.10, 0.30, 0.10, 0.25],
    6: [0.20, 0.10, 0.25, 0.10, 0.25, 0.10]
  };

  const distribution = distributions[mealsPerDay] || distributions[3];
  return distribution.map(ratio => Math.round(dailyCalories * ratio));
}

function filterItemsByMealType(items, mealType) {
  return items.filter(item => {
    if (!item.mealTypes || item.mealTypes.length === 0) {
      return true;
    }
    return item.mealTypes.includes(mealType);
  });
}

function findMacroMatches(items, targetMacros) {
  return items.map(item => {
    let score = 0;
    
    if (targetMacros.calories) {
      const calorieDiff = Math.abs(item.calories - targetMacros.calories);
      score += Math.max(0, 100 - calorieDiff);
    }
    
    if (targetMacros.protein) {
      const proteinDiff = Math.abs(parseFloat(item.protein || 0) - targetMacros.protein);
      score += Math.max(0, 50 - proteinDiff);
    }
    
    if (targetMacros.carbs) {
      const carbsDiff = Math.abs(parseFloat(item.carbs || 0) - targetMacros.carbs);
      score += Math.max(0, 50 - carbsDiff);
    }
    
    if (targetMacros.fats) {
      const fatsDiff = Math.abs(parseFloat(item.fats || 0) - targetMacros.fats);
      score += Math.max(0, 30 - fatsDiff);
    }

    return { ...item.toJSON(), matchScore: score };
  }).sort((a, b) => b.matchScore - a.matchScore);
}

function getSupplementRecommendations(goal) {
  const supplements = {
    muscle_gain: ['Whey Protein', 'Creatine', 'BCAAs', 'Multivitamin'],
    weight_loss: ['Multivitamin', 'Omega-3', 'Green Tea Extract', 'Fiber'],
    strength: ['Creatine', 'Whey Protein', 'Beta-Alanine', 'Caffeine'],
    endurance: ['Electrolytes', 'BCAAs', 'Beta-Alanine', 'Carb Supplements'],
    general_fitness: ['Multivitamin', 'Omega-3', 'Vitamin D', 'Protein Powder']
  };
  return supplements[goal] || supplements.general_fitness;
}

function getNutritionTips(goal, dietaryPreference) {
  const tips = [];
  
  tips.push('Eat whole, minimally processed foods');
  tips.push('Stay hydrated throughout the day');
  
  if (goal === 'weight_loss') {
    tips.push('Focus on high-volume, low-calorie foods');
    tips.push('Eat protein with every meal to stay full');
  } else if (goal === 'muscle_gain') {
    tips.push('Eat in a slight calorie surplus');
    tips.push('Consume 1.6-2.2g protein per kg bodyweight');
  }
  
  if (dietaryPreference === 'vegan' || dietaryPreference === 'vegetarian') {
    tips.push('Combine different plant proteins for complete amino acids');
    tips.push('Consider B12 supplementation');
  }
  
  return tips;
}

function getMealTypeTips(mealType) {
  const tips = {
    breakfast: ['Start your day with protein', 'Include complex carbs for energy'],
    lunch: ['Balance protein, carbs, and fats', 'Include vegetables'],
    dinner: ['Lighter carbs in the evening', 'Focus on protein and vegetables'],
    pre_workout: ['Easy to digest carbs', 'Moderate protein', 'Low fat'],
    post_workout: ['Quick-digesting protein', 'Fast-acting carbs', 'Replenish glycogen'],
    snack: ['Keep it light', 'Protein-rich options', 'Avoid empty calories']
  };
  return tips[mealType] || ['Eat mindfully', 'Choose nutrient-dense foods'];
}

function getDailyRecommendations(totals, targetCalories, goal) {
  const recommendations = [];
  
  const calorieVariance = ((totals.calories - targetCalories) / targetCalories) * 100;
  
  if (Math.abs(calorieVariance) > 10) {
    recommendations.push(`Adjust portions to get closer to ${targetCalories} calories`);
  }
  
  if (totals.protein < targetCalories * 0.25 / 4) {
    recommendations.push('Consider adding more protein sources');
  }
  
  if (totals.fiber < 25) {
    recommendations.push('Increase fiber intake with vegetables and whole grains');
  }
  
  return recommendations;
}

function generateShoppingList(weeklyPlan) {
  const items = {};
  
  weeklyPlan.forEach(day => {
    day.meals.forEach(meal => {
      meal.items.forEach(item => {
        if (items[item.name]) {
          items[item.name].quantity += 1;
        } else {
          items[item.name] = {
            name: item.name,
            quantity: 1,
            category: item.category
          };
        }
      });
    });
  });

  return Object.values(items);
}

function getMealPrepTips() {
  return [
    'Prepare proteins in bulk at the start of the week',
    'Pre-cut vegetables for quick assembly',
    'Use proper storage containers to maintain freshness',
    'Label meals with dates and contents',
    'Cook grains and starches in batches',
    'Freeze portions for later in the week'
  ];
}

function getDayName(day) {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  return days[(day - 1) % 7];
}

/**
 * Get goal-based filters for nutrition items
 */
function getGoalBasedFilters(goal) {
  const filters = {};
  
  switch (goal) {
    case 'weight_loss':
      // Prefer lower calorie, higher protein items
      // This will be handled in the selection algorithm
      break;
    case 'muscle_gain':
      // Prefer higher protein items
      // This will be handled in the selection algorithm
      break;
    case 'high_protein':
      // Prefer high protein items
      // This will be handled in the selection algorithm
      break;
    case 'low_carb':
      // Prefer low carb items
      // This will be handled in the selection algorithm
      break;
  }
  
  return filters;
}

/**
 * Enhanced meal building with goal-based prioritization
 */
function buildMealPlanWithGoal(nutritionItems, mealType, targetCalories, goal) {
  const suitableItems = filterItemsByMealType(nutritionItems, mealType);
  
  // Shuffle items to add randomization
  const shuffledItems = shuffleArray(suitableItems);
  
  // Score items based on goal
  const scoredItems = shuffledItems.map(item => {
    let score = Math.random() * 100; // Base randomization
    
    // Goal-based scoring
    if (goal === 'weight_loss') {
      // Prefer lower calorie density, higher protein
      const calorieDensity = item.calories / (parseFloat(item.protein || 1) + 1);
      score += (100 - calorieDensity) * 0.3;
      score += parseFloat(item.protein || 0) * 2;
    } else if (goal === 'muscle_gain' || goal === 'high_protein') {
      // Prefer higher protein
      score += parseFloat(item.protein || 0) * 5;
    } else if (goal === 'low_carb') {
      // Prefer lower carbs
      score += (100 - parseFloat(item.carbs || 0)) * 0.5;
    }
    
    return { ...item, score };
  });
  
  // Sort by score (highest first)
  scoredItems.sort((a, b) => b.score - a.score);
  
  const selectedItems = [];
  let currentCalories = 0;
  const tolerance = targetCalories * 0.20; // Increased tolerance for more variety

  // Take a random subset from top 50% to increase variety
  const topItems = scoredItems.slice(0, Math.floor(scoredItems.length * 0.5));
  const startIndex = Math.floor(Math.random() * Math.max(1, topItems.length / 3));
  const itemsToConsider = topItems.slice(startIndex);

  for (const item of itemsToConsider) {
    if (currentCalories >= targetCalories - tolerance) break;
    if (currentCalories + item.calories <= targetCalories + tolerance) {
      selectedItems.push({
        id: item.id,
        name: item.name,
        servingSize: item.servingSize,
        calories: item.calories,
        protein: item.protein,
        carbs: item.carbs,
        fats: item.fats,
        fiber: item.fiber,
        category: item.category,
        preparationTime: item.preparationTime
      });
      currentCalories += item.calories;
    }
  }

  // If we don't have enough items, add more from the pool
  if (selectedItems.length === 0 || currentCalories < targetCalories - tolerance) {
    const remainingItems = itemsToConsider.filter(item => 
      !selectedItems.some(selected => selected.id === item.id)
    );
    
    for (const item of remainingItems) {
      if (currentCalories >= targetCalories + tolerance) break;
      if (currentCalories + item.calories <= targetCalories + tolerance) {
        selectedItems.push({
          id: item.id,
          name: item.name,
          servingSize: item.servingSize,
          calories: item.calories,
          protein: item.protein,
          carbs: item.carbs,
          fats: item.fats,
          fiber: item.fiber,
          category: item.category,
          preparationTime: item.preparationTime
        });
        currentCalories += item.calories;
      }
    }
  }

  const macros = calculateMealMacros(selectedItems);

  return {
    items: selectedItems,
    totalCalories: currentCalories,
    macros,
    tips: getMealTypeTips(mealType)
  };
}

module.exports = exports;
