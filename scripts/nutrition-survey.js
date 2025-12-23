require('dotenv').config();
const readline = require('readline');
const bcrypt = require('bcryptjs');
const { sequelize } = require('../src/config/database');
const User = require('../src/models/user.model');
const UserSurvey = require('../src/models/usersurvey.model');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  red: '\x1b[31m',
  magenta: '\x1b[35m'
};

const log = {
  success: (msg) => console.log(`${colors.green}✓ ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}✗ ${msg}${colors.reset}`),
  header: (msg) => console.log(`\n${colors.bright}${colors.cyan}${'='.repeat(60)}${colors.reset}`),
  title: (msg) => console.log(`${colors.bright}${colors.magenta}${msg}${colors.reset}`),
  section: (msg) => console.log(`\n${colors.bright}${colors.blue}${msg}${colors.reset}`)
};

async function loginUser(email, password) {
  try {
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      log.error('User not found');
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      log.error('Invalid password');
      return null;
    }

    log.success(`Logged in as: ${user.name} (${user.email})`);
    log.info(`Roles: ${user.roles.join(', ')}`);
    
    return user;
  } catch (error) {
    log.error(`Login failed: ${error.message}`);
    return null;
  }
}

function calculateBMI(weight, height) {
  const heightInMeters = height / 100;
  return (weight / (heightInMeters * heightInMeters)).toFixed(2);
}

function calculateBMR(weight, height, age, gender) {
  if (gender === 'male') {
    return Math.round(88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age));
  } else {
    return Math.round(447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age));
  }
}

function calculateTDEE(bmr, activityLevel) {
  const multipliers = {
    sedentary: 1.2,
    lightly_active: 1.375,
    moderately_active: 1.55,
    very_active: 1.725,
    extremely_active: 1.9
  };
  return Math.round(bmr * (multipliers[activityLevel] || 1.2));
}

function calculateMacros(calories, goal, dietaryPreference) {
  let proteinPercent, carbPercent, fatPercent;

  switch (goal) {
    case 'weight_loss':
      proteinPercent = 0.35;
      carbPercent = 0.30;
      fatPercent = 0.35;
      break;
    case 'muscle_gain':
      proteinPercent = 0.30;
      carbPercent = 0.45;
      fatPercent = 0.25;
      break;
    case 'strength':
      proteinPercent = 0.30;
      carbPercent = 0.40;
      fatPercent = 0.30;
      break;
    case 'endurance':
      proteinPercent = 0.20;
      carbPercent = 0.55;
      fatPercent = 0.25;
      break;
    default:
      proteinPercent = 0.30;
      carbPercent = 0.40;
      fatPercent = 0.30;
  }

  if (dietaryPreference === 'keto') {
    proteinPercent = 0.25;
    carbPercent = 0.05;
    fatPercent = 0.70;
  } else if (dietaryPreference === 'vegan' || dietaryPreference === 'vegetarian') {
    carbPercent += 0.05;
    fatPercent -= 0.05;
  }

  return {
    protein: Math.round((calories * proteinPercent) / 4),
    carbs: Math.round((calories * carbPercent) / 4),
    fats: Math.round((calories * fatPercent) / 9),
    proteinPercent: Math.round(proteinPercent * 100),
    carbPercent: Math.round(carbPercent * 100),
    fatPercent: Math.round(fatPercent * 100)
  };
}

function generateMealPlan(calories, macros, mealsPerDay, dietaryPreference) {
  const caloriesPerMeal = Math.round(calories / mealsPerDay);
  const proteinPerMeal = Math.round(macros.protein / mealsPerDay);
  const carbsPerMeal = Math.round(macros.carbs / mealsPerDay);
  const fatsPerMeal = Math.round(macros.fats / mealsPerDay);

  const mealTemplates = {
    omnivore: {
      breakfast: ['Eggs with whole grain toast', 'Greek yogurt with berries and granola', 'Oatmeal with protein powder'],
      lunch: ['Grilled chicken with quinoa and vegetables', 'Salmon with sweet potato and broccoli', 'Turkey wrap with avocado'],
      dinner: ['Lean beef with rice and mixed vegetables', 'Baked fish with roasted vegetables', 'Chicken stir-fry with brown rice'],
      snack: ['Protein shake', 'Mixed nuts and fruit', 'Cottage cheese with berries']
    },
    vegetarian: {
      breakfast: ['Scrambled eggs with spinach and toast', 'Greek yogurt parfait', 'Protein pancakes with fruit'],
      lunch: ['Lentil curry with rice', 'Quinoa salad with chickpeas', 'Vegetable stir-fry with tofu'],
      dinner: ['Black bean burrito bowl', 'Eggplant parmesan with pasta', 'Stuffed bell peppers with quinoa'],
      snack: ['Hummus with vegetables', 'Protein smoothie', 'Greek yogurt with nuts']
    },
    vegan: {
      breakfast: ['Tofu scramble with vegetables', 'Smoothie bowl with plant protein', 'Oatmeal with almond butter'],
      lunch: ['Buddha bowl with tempeh', 'Lentil soup with whole grain bread', 'Chickpea curry with rice'],
      dinner: ['Vegan chili with beans', 'Stir-fried tofu with vegetables', 'Quinoa stuffed peppers'],
      snack: ['Trail mix', 'Plant-based protein shake', 'Hummus with crackers']
    },
    keto: {
      breakfast: ['Eggs with bacon and avocado', 'Keto smoothie with MCT oil', 'Cheese omelet with spinach'],
      lunch: ['Grilled salmon with cauliflower rice', 'Chicken Caesar salad (no croutons)', 'Bunless burger with cheese'],
      dinner: ['Ribeye steak with asparagus', 'Baked chicken thighs with broccoli', 'Pork chops with green beans'],
      snack: ['Cheese and nuts', 'Celery with almond butter', 'Hard-boiled eggs']
    }
  };

  const templates = mealTemplates[dietaryPreference] || mealTemplates.omnivore;
  const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];
  const meals = [];

  for (let i = 0; i < mealsPerDay; i++) {
    const mealType = mealTypes[Math.min(i, mealTypes.length - 1)];
    const options = templates[mealType] || templates.snack;
    
    meals.push({
      mealNumber: i + 1,
      mealType: mealType,
      suggestion: options[i % options.length],
      calories: caloriesPerMeal,
      protein: proteinPerMeal,
      carbs: carbsPerMeal,
      fats: fatsPerMeal
    });
  }

  return meals;
}

function generateNutritionTips(goal, dietaryPreference) {
  const tips = [];

  switch (goal) {
    case 'weight_loss':
      tips.push('Create a moderate calorie deficit (300-500 calories below TDEE)');
      tips.push('Prioritize protein to preserve muscle mass');
      tips.push('Stay hydrated - drink at least 2-3 liters of water daily');
      tips.push('Eat plenty of fiber-rich vegetables to stay full');
      break;
    case 'muscle_gain':
      tips.push('Maintain a calorie surplus (300-500 calories above TDEE)');
      tips.push('Consume 1.6-2.2g protein per kg of body weight');
      tips.push('Time protein intake around workouts');
      tips.push('Don\'t neglect carbs - they fuel muscle growth');
      break;
    case 'strength':
      tips.push('Eat adequate protein for muscle recovery');
      tips.push('Consume complex carbs for sustained energy');
      tips.push('Include healthy fats for hormone production');
      tips.push('Consider creatine supplementation');
      break;
    case 'endurance':
      tips.push('Prioritize carbohydrates for energy');
      tips.push('Stay well-hydrated before, during, and after exercise');
      tips.push('Include electrolytes in longer workouts');
      tips.push('Time meals to fuel your training sessions');
      break;
  }

  if (dietaryPreference === 'vegan' || dietaryPreference === 'vegetarian') {
    tips.push('Ensure adequate B12, iron, and omega-3 intake');
    tips.push('Combine plant proteins for complete amino acid profile');
  }

  tips.push('Meal prep to stay consistent with your nutrition plan');
  tips.push('Track your progress and adjust as needed');

  return tips;
}

async function conductNutritionSurvey(user) {
  log.header();
  log.title('🥗 NUTRITION SURVEY & PLAN GENERATOR');
  log.header();
  
  log.section('📋 Personal Information');
  
  const age = parseInt(await question('Enter your age: '));
  const gender = (await question('Enter your gender (male/female/other): ')).toLowerCase();
  const height = parseFloat(await question('Enter your height in cm: '));
  const weight = parseFloat(await question('Enter your current weight in kg: '));
  const targetWeight = parseFloat(await question('Enter your target weight in kg (or same as current): '));

  const bmi = calculateBMI(weight, height);
  log.info(`Your BMI: ${bmi}`);

  log.section('🎯 Fitness Goals');
  console.log('Available goals:');
  console.log('1. weight_loss');
  console.log('2. muscle_gain');
  console.log('3. strength');
  console.log('4. endurance');
  console.log('5. general_fitness');
  console.log('6. body_recomposition');
  
  const goalNum = await question('Select your primary goal (1-6): ');
  const goals = ['weight_loss', 'muscle_gain', 'strength', 'endurance', 'general_fitness', 'body_recomposition'];
  const primaryGoal = goals[parseInt(goalNum) - 1] || 'general_fitness';

  log.section('💪 Activity Level');
  console.log('1. sedentary (little to no exercise)');
  console.log('2. lightly_active (1-3 days/week)');
  console.log('3. moderately_active (3-5 days/week)');
  console.log('4. very_active (6-7 days/week)');
  console.log('5. extremely_active (physical job + training)');
  
  const activityNum = await question('Select your activity level (1-5): ');
  const activities = ['sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extremely_active'];
  const activityLevel = activities[parseInt(activityNum) - 1] || 'moderately_active';

  const workoutFrequency = parseInt(await question('How many days per week do you want to workout? (1-7): '));
  const workoutDuration = parseInt(await question('How many minutes per workout session? (15-180): '));

  log.section('🍽️ Nutrition Preferences');
  console.log('Dietary preferences:');
  console.log('1. omnivore');
  console.log('2. vegetarian');
  console.log('3. vegan');
  console.log('4. pescatarian');
  console.log('5. keto');
  console.log('6. paleo');
  console.log('7. mediterranean');
  
  const dietNum = await question('Select your dietary preference (1-7): ');
  const diets = ['omnivore', 'vegetarian', 'vegan', 'pescatarian', 'keto', 'paleo', 'mediterranean'];
  const dietaryPreference = diets[parseInt(dietNum) - 1] || 'omnivore';

  const mealsPerDay = parseInt(await question('How many meals per day do you prefer? (3-6): '));

  log.section('😴 Lifestyle Factors');
  const averageSleepHours = parseFloat(await question('Average hours of sleep per night: '));
  
  console.log('Stress level:');
  console.log('1. low');
  console.log('2. moderate');
  console.log('3. high');
  console.log('4. very_high');
  
  const stressNum = await question('Select your stress level (1-4): ');
  const stressLevels = ['low', 'moderate', 'high', 'very_high'];
  const stressLevel = stressLevels[parseInt(stressNum) - 1] || 'moderate';

  const bmr = calculateBMR(weight, height, age, gender);
  const tdee = calculateTDEE(bmr, activityLevel);
  
  let dailyCalorieTarget = tdee;
  if (primaryGoal === 'weight_loss') {
    dailyCalorieTarget = Math.round(tdee - 500);
  } else if (primaryGoal === 'muscle_gain') {
    dailyCalorieTarget = Math.round(tdee + 300);
  }

  const surveyData = {
    userId: user.id,
    age,
    gender,
    height,
    weight,
    targetWeight,
    primaryGoal,
    secondaryGoals: [],
    fitnessLevel: 'intermediate',
    activityLevel,
    workoutFrequency,
    workoutDuration,
    workoutLocation: 'gym',
    availableEquipment: ['dumbbells', 'barbell', 'machines'],
    injuries: [],
    medicalConditions: [],
    preferredExerciseTypes: ['strength', 'cardio'],
    dislikedExercises: [],
    dietaryPreference,
    dailyCalorieTarget,
    mealsPerDay,
    averageSleepHours,
    stressLevel,
    isActive: true,
    completedAt: new Date()
  };

  const survey = await UserSurvey.create(surveyData);
  log.success(`Survey saved with ID: ${survey.id}`);

  return { survey, bmr, tdee, dailyCalorieTarget };
}

function displayNutritionPlan(surveyData, bmr, tdee, dailyCalorieTarget) {
  log.header();
  log.title('📊 YOUR PERSONALIZED NUTRITION PLAN');
  log.header();

  log.section('🔢 Caloric Breakdown');
  console.log(`${colors.bright}Basal Metabolic Rate (BMR):${colors.reset} ${bmr} calories/day`);
  console.log(`${colors.bright}Total Daily Energy Expenditure (TDEE):${colors.reset} ${tdee} calories/day`);
  console.log(`${colors.bright}Target Daily Calories:${colors.reset} ${dailyCalorieTarget} calories/day`);
  
  const deficit = tdee - dailyCalorieTarget;
  if (deficit > 0) {
    console.log(`${colors.green}Calorie Deficit:${colors.reset} -${deficit} calories/day`);
    console.log(`${colors.info}Expected weight loss:${colors.reset} ~${(deficit * 7 / 7700).toFixed(2)} kg/week`);
  } else if (deficit < 0) {
    console.log(`${colors.green}Calorie Surplus:${colors.reset} +${Math.abs(deficit)} calories/day`);
    console.log(`${colors.info}Expected weight gain:${colors.reset} ~${(Math.abs(deficit) * 7 / 7700).toFixed(2)} kg/week`);
  }

  const macros = calculateMacros(dailyCalorieTarget, surveyData.primaryGoal, surveyData.dietaryPreference);
  
  log.section('🥩 Macronutrient Targets');
  console.log(`${colors.bright}Protein:${colors.reset} ${macros.protein}g/day (${macros.proteinPercent}% of calories)`);
  console.log(`${colors.bright}Carbohydrates:${colors.reset} ${macros.carbs}g/day (${macros.carbPercent}% of calories)`);
  console.log(`${colors.bright}Fats:${colors.reset} ${macros.fats}g/day (${macros.fatPercent}% of calories)`);

  const mealPlan = generateMealPlan(dailyCalorieTarget, macros, surveyData.mealsPerDay, surveyData.dietaryPreference);
  
  log.section('🍽️ Sample Daily Meal Plan');
  mealPlan.forEach(meal => {
    console.log(`\n${colors.bright}${colors.cyan}Meal ${meal.mealNumber} (${meal.mealType.toUpperCase()}):${colors.reset}`);
    console.log(`  ${meal.suggestion}`);
    console.log(`  ${colors.yellow}Calories: ${meal.calories} | Protein: ${meal.protein}g | Carbs: ${meal.carbs}g | Fats: ${meal.fats}g${colors.reset}`);
  });

  const tips = generateNutritionTips(surveyData.primaryGoal, surveyData.dietaryPreference);
  
  log.section('💡 Nutrition Tips & Recommendations');
  tips.forEach((tip, index) => {
    console.log(`${colors.green}${index + 1}.${colors.reset} ${tip}`);
  });

  log.section('💧 Hydration');
  const waterIntake = Math.round(surveyData.weight * 35);
  console.log(`${colors.bright}Recommended daily water intake:${colors.reset} ${waterIntake}ml (${(waterIntake / 1000).toFixed(1)} liters)`);

  log.section('📅 Meal Timing Suggestions');
  if (surveyData.primaryGoal === 'muscle_gain' || surveyData.primaryGoal === 'strength') {
    console.log('• Pre-workout: Consume carbs + protein 1-2 hours before training');
    console.log('• Post-workout: Consume protein + carbs within 30-60 minutes after training');
    console.log('• Before bed: Consider casein protein or cottage cheese');
  } else if (surveyData.primaryGoal === 'weight_loss') {
    console.log('• Consider intermittent fasting (16:8 or 14:10) if it suits your lifestyle');
    console.log('• Eat larger meals earlier in the day');
    console.log('• Avoid late-night snacking');
  }

  log.header();
  log.success('✅ Nutrition plan generated successfully!');
  log.info('Remember: Consistency is key. Adjust based on your progress.');
  log.header();

  return {
    bmr,
    tdee,
    dailyCalorieTarget,
    macros,
    mealPlan,
    tips,
    waterIntake
  };
}

async function main() {
  try {
    await sequelize.authenticate();
    log.success('Database connected');

    log.header();
    log.title('🔐 LOGIN');
    log.header();

    const email = 'admin@arifworkout.com';
    const password = 'admin123';
    
    log.info(`Attempting login with: ${email}`);
    
    const user = await loginUser(email, password);
    
    if (!user) {
      log.error('Login failed. Please check credentials.');
      process.exit(1);
    }

    const { survey, bmr, tdee, dailyCalorieTarget } = await conductNutritionSurvey(user);
    
    const nutritionPlan = displayNutritionPlan(survey, bmr, tdee, dailyCalorieTarget);

    log.section('📝 Summary');
    console.log(`Survey ID: ${survey.id}`);
    console.log(`User: ${user.name} (${user.email})`);
    console.log(`Goal: ${survey.primaryGoal}`);
    console.log(`Dietary Preference: ${survey.dietaryPreference}`);
    console.log(`Daily Calories: ${dailyCalorieTarget}`);
    console.log(`Meals per Day: ${survey.mealsPerDay}`);

  } catch (error) {
    log.error(`Error: ${error.message}`);
    console.error(error);
  } finally {
    rl.close();
    await sequelize.close();
    log.info('Database connection closed');
  }
}

main();
