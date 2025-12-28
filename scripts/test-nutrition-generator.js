/**
 * Test Script for Nutrition Generator
 * Tests the nutrition generator with various parameters
 */

require('dotenv').config();
const { sequelize } = require('../src/config/database');
const { NutritionItem, User } = require('../src/models');
const nutritionGeneratorController = require('../src/controllers/nutrition-generator.controller');

// Mock request and response objects
function createMockRequest(userId, queryParams = {}) {
  return {
    user: userId ? { id: userId } : null,
    query: queryParams
  };
}

function createMockResponse() {
  const res = {
    status: function(code) {
      this.statusCode = code;
      return this;
    },
    json: function(data) {
      this.data = data;
      return this;
    }
  };
  return res;
}

function createMockNext() {
  return function(error) {
    if (error) {
      console.error('❌ Error:', error.message);
      throw error;
    }
  };
}

async function testNutritionGenerator() {
  try {
    console.log('🧪 Testing Nutrition Generator...\n');
    
    // Test 1: Full plan with maintenance goal, 5000 calories, 5 meals (USER SCENARIO)
    console.log('📋 Test 1: Maintenance Goal, 5000 calories, 5 meals (USER SCENARIO)');
    console.log('─'.repeat(60));
    const req1 = createMockRequest(1, {
      goal: 'maintenance',
      dietaryPreference: 'balanced',
      calories: '5000',
      mealsPerDay: '5'
    });
    const res1 = createMockResponse();
    const next1 = createMockNext();
    
    await nutritionGeneratorController.generateNutritionPlan(req1, res1, next1);
    
    if (res1.data && res1.data.success) {
      const plan = res1.data.data || res1.data.nutritionPlan || res1.data;
      const totalCalories = plan.meals?.reduce((sum, m) => sum + (m.totalCalories || 0), 0) || 0;
      console.log('✅ Success!');
      console.log(`   Requested Calories: 5000`);
      console.log(`   Requested Meals: 5`);
      console.log(`   Daily Calories (Plan): ${plan.dailyCalories || 'N/A'}`);
      console.log(`   Meals Per Day (Plan): ${plan.mealsPerDay || 'N/A'}`);
      console.log(`   Number of Meals Generated: ${plan.meals?.length || 0}`);
      console.log(`   Total Calories in Plan: ${totalCalories}`);
      console.log(`   Calorie Match: ${Math.abs(totalCalories - 5000) <= 500 ? '✅' : '⚠️'} (Target: 5000, Got: ${totalCalories})`);
      console.log(`   Meal Count Match: ${plan.meals?.length === 5 ? '✅' : '⚠️'} (Target: 5, Got: ${plan.meals?.length || 0})`);
      console.log(`   Meals:`);
      plan.meals?.forEach((meal, idx) => {
        console.log(`     ${idx + 1}. ${meal.mealType}: ${meal.items?.length || 0} items, ${meal.totalCalories || 0} cal`);
        if (meal.items && meal.items.length > 0) {
          const foodNames = meal.items.map(i => i.name || i.foodId || 'Unknown').join(', ');
          console.log(`        Foods: ${foodNames.substring(0, 80)}${foodNames.length > 80 ? '...' : ''}`);
        }
      });
    } else {
      console.log('❌ Failed:', res1.data?.message || res1.data?.error || 'Unknown error');
      console.log('   Response:', JSON.stringify(res1.data, null, 2));
    }
    console.log('\n');

    // Test 2: Weight loss, 2000 calories, 3 meals
    console.log('📋 Test 2: Weight Loss Goal, 2000 calories, 3 meals');
    console.log('─'.repeat(60));
    const req2 = createMockRequest(1, {
      goal: 'weight_loss',
      dietaryPreference: 'balanced',
      calories: '2000',
      mealsPerDay: '3'
    });
    const res2 = createMockResponse();
    const next2 = createMockNext();
    
    await nutritionGeneratorController.generateNutritionPlan(req2, res2, next2);
    
    if (res2.data && res2.data.success) {
      const plan = res2.data.data || res2.data.nutritionPlan || res2.data;
      const totalCalories = plan.meals?.reduce((sum, m) => sum + (m.totalCalories || 0), 0) || 0;
      console.log('✅ Success!');
      console.log(`   Requested Calories: 2000`);
      console.log(`   Requested Meals: 3`);
      console.log(`   Daily Calories (Plan): ${plan.dailyCalories || 'N/A'}`);
      console.log(`   Meals Per Day (Plan): ${plan.mealsPerDay || 'N/A'}`);
      console.log(`   Number of Meals Generated: ${plan.meals?.length || 0}`);
      console.log(`   Total Calories in Plan: ${totalCalories}`);
      plan.meals?.forEach((meal, idx) => {
        console.log(`     ${idx + 1}. ${meal.mealType}: ${meal.items?.length || 0} items, ${meal.totalCalories || 0} cal`);
      });
    } else {
      console.log('❌ Failed:', res2.data?.message || res2.data?.error || 'Unknown error');
    }
    console.log('\n');

    // Test 3: Muscle gain, 3000 calories, 4 meals
    console.log('📋 Test 3: Muscle Gain Goal, 3000 calories, 4 meals');
    console.log('─'.repeat(60));
    const req3 = createMockRequest(1, {
      goal: 'muscle_gain',
      dietaryPreference: 'high_protein',
      calories: '3000',
      mealsPerDay: '4'
    });
    const res3 = createMockResponse();
    const next3 = createMockNext();
    
    await nutritionGeneratorController.generateNutritionPlan(req3, res3, next3);
    
    if (res3.data && res3.data.success) {
      const plan = res3.data.data || res3.data.nutritionPlan || res3.data;
      const totalCalories = plan.meals?.reduce((sum, m) => sum + (m.totalCalories || 0), 0) || 0;
      console.log('✅ Success!');
      console.log(`   Requested Calories: 3000`);
      console.log(`   Requested Meals: 4`);
      console.log(`   Daily Calories (Plan): ${plan.dailyCalories || 'N/A'}`);
      console.log(`   Meals Per Day (Plan): ${plan.mealsPerDay || 'N/A'}`);
      console.log(`   Number of Meals Generated: ${plan.meals?.length || 0}`);
      console.log(`   Total Calories in Plan: ${totalCalories}`);
      plan.meals?.forEach((meal, idx) => {
        console.log(`     ${idx + 1}. ${meal.mealType}: ${meal.items?.length || 0} items, ${meal.totalCalories || 0} cal`);
      });
    } else {
      console.log('❌ Failed:', res3.data?.message || res3.data?.error || 'Unknown error');
    }
    console.log('\n');

    // Test 4: Test variety - generate same plan 3 times
    console.log('📋 Test 4: Variety Test - Generate same plan 3 times');
    console.log('─'.repeat(60));
    const testParams = {
      goal: 'maintenance',
      dietaryPreference: 'balanced',
      calories: '2500',
      mealsPerDay: '3'
    };
    
    const results = [];
    for (let i = 0; i < 3; i++) {
      const req = createMockRequest(1, testParams);
      const res = createMockResponse();
      const next = createMockNext();
      
      await nutritionGeneratorController.generateNutritionPlan(req, res, next);
      
      if (res.data && res.data.success) {
        const plan = res.data.data || res.data.nutritionPlan || res.data;
        const mealNames = plan.meals?.map(m => 
          m.items?.map(i => i.name || i.foodId || 'Unknown').join(', ') || 'No items'
        ).join(' | ') || 'No meals';
        results.push({
          attempt: i + 1,
          meals: mealNames,
          totalCalories: plan.meals?.reduce((sum, m) => sum + (m.totalCalories || 0), 0) || 0,
          mealCount: plan.meals?.length || 0
        });
      }
    }
    
    console.log('Results:');
    results.forEach((r, idx) => {
      console.log(`   Attempt ${r.attempt}: ${r.totalCalories} cal, ${r.mealCount} meals`);
      console.log(`   Meals: ${r.meals.substring(0, 100)}${r.meals.length > 100 ? '...' : ''}`);
    });
    
    // Check if results are different
    const allSame = results.every(r => r.meals === results[0].meals);
    if (allSame) {
      console.log('⚠️  Warning: All 3 attempts returned the same meals!');
    } else {
      console.log('✅ Good: Different meals generated each time!');
    }
    
    // Check calorie consistency
    const calorieVariance = Math.max(...results.map(r => r.totalCalories)) - Math.min(...results.map(r => r.totalCalories));
    console.log(`   Calorie Variance: ${calorieVariance} cal (should be similar)`);
    console.log('\n');

    // Test 5: Daily meal plan
    console.log('📋 Test 5: Daily Meal Plan');
    console.log('─'.repeat(60));
    const req5 = createMockRequest(1, {
      calories: '2000',
      dietaryPreference: 'balanced'
    });
    const res5 = createMockResponse();
    const next5 = createMockNext();
    
    await nutritionGeneratorController.generateDailyMealPlan(req5, res5, next5);
    
    if (res5.data && res5.data.success) {
      const plan = res5.data.data || res5.data.nutritionPlan || res5.data;
      const totalCalories = plan.meals?.reduce((sum, m) => sum + (m.totalCalories || 0), 0) || 0;
      console.log('✅ Success!');
      console.log(`   Requested Calories: 2000`);
      console.log(`   Daily Calories (Plan): ${plan.dailyCalories || 'N/A'}`);
      console.log(`   Meals Per Day (Plan): ${plan.mealsPerDay || 'N/A'}`);
      console.log(`   Number of Meals: ${plan.meals?.length || 0}`);
      console.log(`   Total Calories in Plan: ${totalCalories}`);
    } else {
      console.log('❌ Failed:', res5.data?.message || res5.data?.error || 'Unknown error');
    }
    console.log('\n');

    console.log('✅ All tests completed!');
    
  } catch (error) {
    console.error('❌ Test failed with error:', error);
    throw error;
  }
}

// Run tests
async function main() {
  try {
    // Connect to database
    await sequelize.authenticate();
    console.log('✅ Database connection established\n');
    
    // Check if we have nutrition items
    const itemCount = await NutritionItem.count({ where: { isActive: true } });
    console.log(`📊 Found ${itemCount} active nutrition items in database\n`);
    
    if (itemCount === 0) {
      console.log('⚠️  Warning: No nutrition items found. Please seed the database first.');
      return;
    }
    
    // Run tests
    await testNutritionGenerator();
    
  } catch (error) {
    console.error('❌ Error running tests:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { testNutritionGenerator };

