require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize } = require('../src/config/database');
const User = require('../src/models/user.model');
const UserSurvey = require('../src/models/usersurvey.model');

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

// Predefined survey profiles
const surveyProfiles = [
  {
    name: "Weight Loss Journey",
    age: 35,
    gender: 'female',
    height: 165,
    weight: 75,
    targetWeight: 65,
    primaryGoal: 'weight_loss',
    activityLevel: 'lightly_active',
    workoutFrequency: 4,
    workoutDuration: 45,
    dietaryPreference: 'omnivore',
    mealsPerDay: 4,
    averageSleepHours: 7,
    stressLevel: 'moderate'
  },
  {
    name: "Muscle Building Plan",
    age: 28,
    gender: 'male',
    height: 180,
    weight: 75,
    targetWeight: 85,
    primaryGoal: 'muscle_gain',
    activityLevel: 'very_active',
    workoutFrequency: 5,
    workoutDuration: 90,
    dietaryPreference: 'omnivore',
    mealsPerDay: 5,
    averageSleepHours: 8,
    stressLevel: 'low'
  },
  {
    name: "Vegan Athlete",
    age: 30,
    gender: 'female',
    height: 170,
    weight: 62,
    targetWeight: 62,
    primaryGoal: 'endurance',
    activityLevel: 'very_active',
    workoutFrequency: 6,
    workoutDuration: 60,
    dietaryPreference: 'vegan',
    mealsPerDay: 5,
    averageSleepHours: 7.5,
    stressLevel: 'moderate'
  },
  {
    name: "Keto Strength Training",
    age: 40,
    gender: 'male',
    height: 175,
    weight: 85,
    targetWeight: 80,
    primaryGoal: 'strength',
    activityLevel: 'moderately_active',
    workoutFrequency: 4,
    workoutDuration: 75,
    dietaryPreference: 'keto',
    mealsPerDay: 3,
    averageSleepHours: 7,
    stressLevel: 'high'
  },
  {
    name: "Beginner Fitness",
    age: 25,
    gender: 'male',
    height: 172,
    weight: 68,
    targetWeight: 72,
    primaryGoal: 'general_fitness',
    activityLevel: 'lightly_active',
    workoutFrequency: 3,
    workoutDuration: 45,
    dietaryPreference: 'vegetarian',
    mealsPerDay: 4,
    averageSleepHours: 6.5,
    stressLevel: 'moderate'
  }
];

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
    default:
      tips.push('Maintain a balanced diet with variety');
      tips.push('Focus on whole, unprocessed foods');
      tips.push('Stay consistent with your eating patterns');
      tips.push('Listen to your body\'s hunger cues');
  }

  if (dietaryPreference === 'vegan' || dietaryPreference === 'vegetarian') {
    tips.push('Ensure adequate B12, iron, and omega-3 intake');
    tips.push('Combine plant proteins for complete amino acid profile');
  }

  tips.push('Meal prep to stay consistent with your nutrition plan');
  tips.push('Track your progress and adjust as needed');

  return tips;
}

async function processSurveyProfile(user, profile) {
  log.header();
  log.title(`🥗 PROFILE: ${profile.name.toUpperCase()}`);
  log.header();
  
  log.section('📋 Survey Responses');
  console.log(`Age: ${profile.age}`);
  console.log(`Gender: ${profile.gender}`);
  console.log(`Height: ${profile.height} cm`);
  console.log(`Weight: ${profile.weight} kg`);
  console.log(`Target Weight: ${profile.targetWeight} kg`);
  console.log(`Primary Goal: ${profile.primaryGoal}`);
  console.log(`Activity Level: ${profile.activityLevel}`);
  console.log(`Workout Frequency: ${profile.workoutFrequency} days/week`);
  console.log(`Workout Duration: ${profile.workoutDuration} minutes`);
  console.log(`Dietary Preference: ${profile.dietaryPreference}`);
  console.log(`Meals Per Day: ${profile.mealsPerDay}`);
  console.log(`Sleep: ${profile.averageSleepHours} hours`);
  console.log(`Stress Level: ${profile.stressLevel}`);

  const bmi = calculateBMI(profile.weight, profile.height);
  log.info(`BMI: ${bmi}`);

  const bmr = calculateBMR(profile.weight, profile.height, profile.age, profile.gender);
  const tdee = calculateTDEE(bmr, profile.activityLevel);
  
  let dailyCalorieTarget = tdee;
  if (profile.primaryGoal === 'weight_loss') {
    dailyCalorieTarget = Math.round(tdee - 500);
  } else if (profile.primaryGoal === 'muscle_gain') {
    dailyCalorieTarget = Math.round(tdee + 300);
  }

  const surveyData = {
    userId: user.id,
    age: profile.age,
    gender: profile.gender,
    height: profile.height,
    weight: profile.weight,
    targetWeight: profile.targetWeight,
    primaryGoal: profile.primaryGoal,
    secondaryGoals: [],
    fitnessLevel: 'intermediate',
    activityLevel: profile.activityLevel,
    workoutFrequency: profile.workoutFrequency,
    workoutDuration: profile.workoutDuration,
    workoutLocation: 'gym',
    availableEquipment: ['dumbbells', 'barbell', 'machines'],
    injuries: [],
    medicalConditions: [],
    preferredExerciseTypes: ['strength', 'cardio'],
    dislikedExercises: [],
    dietaryPreference: profile.dietaryPreference,
    dailyCalorieTarget,
    mealsPerDay: profile.mealsPerDay,
    averageSleepHours: profile.averageSleepHours,
    stressLevel: profile.stressLevel,
    isActive: true,
    completedAt: new Date()
  };

  const survey = await UserSurvey.create(surveyData);
  log.success(`Survey saved with ID: ${survey.id}`);

  displayNutritionPlan(profile, bmr, tdee, dailyCalorieTarget);

  return survey;
}

function displayNutritionPlan(profile, bmr, tdee, dailyCalorieTarget) {
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
  } else {
    console.log(`${colors.info}Maintenance calories - weight should remain stable${colors.reset}`);
  }

  const macros = calculateMacros(dailyCalorieTarget, profile.primaryGoal, profile.dietaryPreference);
  
  log.section('🥩 Macronutrient Targets');
  console.log(`${colors.bright}Protein:${colors.reset} ${macros.protein}g/day (${macros.proteinPercent}% of calories)`);
  console.log(`${colors.bright}Carbohydrates:${colors.reset} ${macros.carbs}g/day (${macros.carbPercent}% of calories)`);
  console.log(`${colors.bright}Fats:${colors.reset} ${macros.fats}g/day (${macros.fatPercent}% of calories)`);

  const mealPlan = generateMealPlan(dailyCalorieTarget, macros, profile.mealsPerDay, profile.dietaryPreference);
  
  log.section('🍽️ Sample Daily Meal Plan');
  mealPlan.forEach(meal => {
    console.log(`\n${colors.bright}${colors.cyan}Meal ${meal.mealNumber} (${meal.mealType.toUpperCase()}):${colors.reset}`);
    console.log(`  ${meal.suggestion}`);
    console.log(`  ${colors.yellow}Calories: ${meal.calories} | Protein: ${meal.protein}g | Carbs: ${meal.carbs}g | Fats: ${meal.fats}g${colors.reset}`);
  });

  const tips = generateNutritionTips(profile.primaryGoal, profile.dietaryPreference);
  
  log.section('💡 Nutrition Tips & Recommendations');
  tips.forEach((tip, index) => {
    console.log(`${colors.green}${index + 1}.${colors.reset} ${tip}`);
  });

  log.section('💧 Hydration');
  const waterIntake = Math.round(profile.weight * 35);
  console.log(`${colors.bright}Recommended daily water intake:${colors.reset} ${waterIntake}ml (${(waterIntake / 1000).toFixed(1)} liters)`);

  log.section('📅 Meal Timing Suggestions');
  if (profile.primaryGoal === 'muscle_gain' || profile.primaryGoal === 'strength') {
    console.log('• Pre-workout: Consume carbs + protein 1-2 hours before training');
    console.log('• Post-workout: Consume protein + carbs within 30-60 minutes after training');
    console.log('• Before bed: Consider casein protein or cottage cheese');
  } else if (profile.primaryGoal === 'weight_loss') {
    console.log('• Consider intermittent fasting (16:8 or 14:10) if it suits your lifestyle');
    console.log('• Eat larger meals earlier in the day');
    console.log('• Avoid late-night snacking');
  } else if (profile.primaryGoal === 'endurance') {
    console.log('• Carb-load before long training sessions');
    console.log('• Consume quick carbs during extended workouts (>90 min)');
    console.log('• Refuel with carbs + protein within 30 minutes post-workout');
  }

  log.header();
  log.success('✅ Nutrition plan generated successfully!');
  log.header();
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

    log.header();
    log.title(`📊 GENERATING ${surveyProfiles.length} NUTRITION PLANS`);
    log.header();

    for (let i = 0; i < surveyProfiles.length; i++) {
      const profile = surveyProfiles[i];
      log.info(`\n\nProcessing profile ${i + 1}/${surveyProfiles.length}...`);
      
      await processSurveyProfile(user, profile);
      
      if (i < surveyProfiles.length - 1) {
        console.log('\n' + '─'.repeat(60));
      }
    }

    log.header();
    log.title('✅ ALL NUTRITION PLANS GENERATED SUCCESSFULLY');
    log.header();
    log.success(`Total profiles processed: ${surveyProfiles.length}`);
    log.info('All survey data has been saved to the database');

  } catch (error) {
    log.error(`Error: ${error.message}`);
    console.error(error);
  } finally {
    await sequelize.close();
    log.info('Database connection closed');
  }
}

main();
