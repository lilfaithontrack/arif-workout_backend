/**
 * Debug script to check nutrition items and their mealTypes
 */

require('dotenv').config();
const { sequelize } = require('../src/config/database');
const { NutritionItem } = require('../src/models');

async function debugNutritionItems() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected\n');

    // Get a few sample items
    const items = await NutritionItem.findAll({
      where: { isActive: true },
      limit: 10
    });

    console.log(`📊 Found ${items.length} items\n`);
    
    items.forEach((item, idx) => {
      console.log(`\n${idx + 1}. ${item.name}`);
      console.log(`   Category: ${item.category}`);
      console.log(`   Calories: ${item.calories}`);
      console.log(`   mealTypes type: ${typeof item.mealTypes}`);
      console.log(`   mealTypes value:`, item.mealTypes);
      console.log(`   mealTypes is array: ${Array.isArray(item.mealTypes)}`);
      if (Array.isArray(item.mealTypes)) {
        console.log(`   mealTypes length: ${item.mealTypes.length}`);
        console.log(`   mealTypes includes breakfast: ${item.mealTypes.includes('breakfast')}`);
        console.log(`   mealTypes includes lunch: ${item.mealTypes.includes('lunch')}`);
        console.log(`   mealTypes includes dinner: ${item.mealTypes.includes('dinner')}`);
        console.log(`   mealTypes includes snack: ${item.mealTypes.includes('snack')}`);
      }
    });

    // Check how many items have mealTypes
    const itemsWithMealTypes = items.filter(item => 
      item.mealTypes && 
      (Array.isArray(item.mealTypes) ? item.mealTypes.length > 0 : true)
    );
    console.log(`\n📈 Items with mealTypes: ${itemsWithMealTypes.length}/${items.length}`);

    // Test filtering
    console.log('\n🧪 Testing filterItemsByMealType:');
    const filterItemsByMealType = (items, mealType) => {
      return items.filter(item => {
        // Handle JSON string or array
        let mealTypes = item.mealTypes;
        
        // If it's a string, try to parse it
        if (typeof mealTypes === 'string') {
          try {
            mealTypes = JSON.parse(mealTypes);
          } catch (e) {
            // If parsing fails, treat as empty
            mealTypes = [];
          }
        }
        
        // If no mealTypes or empty array, include the item (fallback)
        if (!mealTypes || (Array.isArray(mealTypes) && mealTypes.length === 0)) {
          return true;
        }
        
        // Check if mealType is in the array
        if (Array.isArray(mealTypes)) {
          return mealTypes.includes(mealType);
        }
        
        // Fallback: include item if we can't determine
        return true;
      });
    };

    const breakfastItems = filterItemsByMealType(items, 'breakfast');
    const lunchItems = filterItemsByMealType(items, 'lunch');
    const dinnerItems = filterItemsByMealType(items, 'dinner');
    const snackItems = filterItemsByMealType(items, 'snack');

    console.log(`   Breakfast items: ${breakfastItems.length}`);
    console.log(`   Lunch items: ${lunchItems.length}`);
    console.log(`   Dinner items: ${dinnerItems.length}`);
    console.log(`   Snack items: ${snackItems.length}`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await sequelize.close();
  }
}

debugNutritionItems();

