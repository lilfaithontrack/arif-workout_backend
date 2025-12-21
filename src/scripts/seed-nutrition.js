require('dotenv').config();
const NutritionItem = require('../models/nutritionitem.model');

async function seedNutrition() {
  try {
    console.log('🍎 Starting nutrition items seeding...');
    
    const nutritionItems = [
      // Proteins (50 items)
      { name: 'Grilled Chicken Breast', category: 'protein', servingSize: '100g', calories: 165, protein: 31, carbs: 0, fats: 3.6, fiber: 0, sugar: 0, isActive: true },
      { name: 'Turkey Breast', category: 'protein', servingSize: '100g', calories: 135, protein: 30, carbs: 0, fats: 1, fiber: 0, sugar: 0, isActive: true },
      { name: 'Lean Beef', category: 'protein', servingSize: '100g', calories: 176, protein: 26, carbs: 0, fats: 8, fiber: 0, sugar: 0, isActive: true },
      { name: 'Pork Tenderloin', category: 'protein', servingSize: '100g', calories: 143, protein: 26, carbs: 0, fats: 3.5, fiber: 0, sugar: 0, isActive: true },
      { name: 'Salmon Fillet', category: 'protein', servingSize: '100g', calories: 206, protein: 22, carbs: 0, fats: 13, fiber: 0, sugar: 0, isActive: true },
      { name: 'Tuna', category: 'protein', servingSize: '100g', calories: 116, protein: 26, carbs: 0, fats: 1, fiber: 0, sugar: 0, isActive: true },
      { name: 'Cod', category: 'protein', servingSize: '100g', calories: 82, protein: 18, carbs: 0, fats: 0.7, fiber: 0, sugar: 0, isActive: true },
      { name: 'Shrimp', category: 'protein', servingSize: '100g', calories: 99, protein: 24, carbs: 0.2, fats: 0.3, fiber: 0, sugar: 0, isActive: true },
      { name: 'Tilapia', category: 'protein', servingSize: '100g', calories: 128, protein: 26, carbs: 0, fats: 2.7, fiber: 0, sugar: 0, isActive: true },
      { name: 'Eggs', category: 'protein', servingSize: '2 large', calories: 143, protein: 13, carbs: 1, fats: 10, fiber: 0, sugar: 1, isActive: true },
      { name: 'Egg Whites', category: 'protein', servingSize: '100g', calories: 52, protein: 11, carbs: 0.7, fats: 0.2, fiber: 0, sugar: 0.7, isActive: true },
      { name: 'Greek Yogurt', category: 'protein', servingSize: '170g', calories: 100, protein: 17, carbs: 6, fats: 0.7, fiber: 0, sugar: 4, isActive: true },
      { name: 'Cottage Cheese', category: 'protein', servingSize: '100g', calories: 72, protein: 12, carbs: 3.4, fats: 1, fiber: 0, sugar: 2.7, isActive: true },
      { name: 'Tofu', category: 'protein', servingSize: '100g', calories: 144, protein: 17, carbs: 3, fats: 9, fiber: 2, sugar: 1, isActive: true },
      { name: 'Tempeh', category: 'protein', servingSize: '100g', calories: 193, protein: 20, carbs: 9, fats: 11, fiber: 0, sugar: 0, isActive: true },
      { name: 'Seitan', category: 'protein', servingSize: '100g', calories: 370, protein: 75, carbs: 14, fats: 1.9, fiber: 0.6, sugar: 0, isActive: true },
      { name: 'Black Beans', category: 'protein', servingSize: '100g', calories: 132, protein: 9, carbs: 24, fats: 0.5, fiber: 9, sugar: 0.3, isActive: true },
      { name: 'Chickpeas', category: 'protein', servingSize: '100g', calories: 164, protein: 9, carbs: 27, fats: 2.6, fiber: 7.6, sugar: 4.8, isActive: true },
      { name: 'Lentils', category: 'protein', servingSize: '100g', calories: 116, protein: 9, carbs: 20, fats: 0.4, fiber: 8, sugar: 1.8, isActive: true },
      { name: 'Almonds', category: 'protein', servingSize: '28g', calories: 164, protein: 6, carbs: 6, fats: 14, fiber: 3.5, sugar: 1.2, isActive: true },
      { name: 'Peanut Butter', category: 'protein', servingSize: '2 tbsp', calories: 188, protein: 8, carbs: 7, fats: 16, fiber: 2, sugar: 3, isActive: true },
      { name: 'Whey Protein', category: 'protein', servingSize: '30g', calories: 110, protein: 25, carbs: 1, fats: 0.5, fiber: 0, sugar: 1, isActive: true },
      { name: 'Pea Protein', category: 'protein', servingSize: '30g', calories: 120, protein: 24, carbs: 2, fats: 2, fiber: 0, sugar: 0, isActive: true },
      
      // Carbs (50 items)
      { name: 'Brown Rice', category: 'carbs', servingSize: '1 cup cooked', calories: 218, protein: 5, carbs: 45, fats: 1.6, fiber: 3.5, sugar: 0.7, isActive: true },
      { name: 'White Rice', category: 'carbs', servingSize: '1 cup cooked', calories: 205, protein: 4.2, carbs: 45, fats: 0.4, fiber: 0.6, sugar: 0.1, isActive: true },
      { name: 'Quinoa', category: 'carbs', servingSize: '1 cup cooked', calories: 222, protein: 8, carbs: 39, fats: 3.6, fiber: 5, sugar: 1.6, isActive: true },
      { name: 'Oatmeal', category: 'carbs', servingSize: '1 cup cooked', calories: 166, protein: 6, carbs: 28, fats: 3.6, fiber: 4, sugar: 0.6, isActive: true },
      { name: 'Whole Wheat Pasta', category: 'carbs', servingSize: '1 cup cooked', calories: 174, protein: 7.5, carbs: 37, fats: 0.8, fiber: 6, sugar: 1, isActive: true },
      { name: 'Whole Wheat Bread', category: 'carbs', servingSize: '1 slice', calories: 69, protein: 3.6, carbs: 12, fats: 0.9, fiber: 2, sugar: 1.4, isActive: true },
      { name: 'Sweet Potato', category: 'carbs', servingSize: '1 medium', calories: 112, protein: 2, carbs: 26, fats: 0.1, fiber: 4, sugar: 5.4, isActive: true },
      { name: 'White Potato', category: 'carbs', servingSize: '1 medium', calories: 161, protein: 4.3, carbs: 37, fats: 0.2, fiber: 2.5, sugar: 1.7, isActive: true },
      { name: 'Banana', category: 'carbs', servingSize: '1 medium', calories: 105, protein: 1.3, carbs: 27, fats: 0.4, fiber: 3.1, sugar: 14, isActive: true },
      { name: 'Apple', category: 'carbs', servingSize: '1 medium', calories: 95, protein: 0.5, carbs: 25, fats: 0.3, fiber: 4.4, sugar: 19, isActive: true },
      { name: 'Orange', category: 'carbs', servingSize: '1 medium', calories: 62, protein: 1.2, carbs: 15, fats: 0.2, fiber: 3.1, sugar: 12, isActive: true },
      { name: 'Blueberries', category: 'carbs', servingSize: '1 cup', calories: 84, protein: 1.1, carbs: 21, fats: 0.5, fiber: 3.6, sugar: 15, isActive: true },
      { name: 'Strawberries', category: 'carbs', servingSize: '1 cup', calories: 49, protein: 1, carbs: 12, fats: 0.5, fiber: 3, sugar: 7.4, isActive: true },
      { name: 'Grapes', category: 'carbs', servingSize: '1 cup', calories: 104, protein: 1.1, carbs: 27, fats: 0.2, fiber: 1.4, sugar: 23, isActive: true },
      { name: 'Watermelon', category: 'carbs', servingSize: '1 cup', calories: 46, protein: 0.9, carbs: 12, fats: 0.2, fiber: 0.6, sugar: 9.4, isActive: true },
      { name: 'Pineapple', category: 'carbs', servingSize: '1 cup', calories: 82, protein: 0.9, carbs: 22, fats: 0.2, fiber: 2.3, sugar: 16, isActive: true },
      
      // Vegetables (50 items)
      { name: 'Broccoli', category: 'vegetables', servingSize: '1 cup cooked', calories: 55, protein: 3.7, carbs: 11, fats: 0.6, fiber: 5.1, sugar: 2.2, isActive: true },
      { name: 'Spinach', category: 'vegetables', servingSize: '1 cup raw', calories: 7, protein: 0.9, carbs: 1.1, fats: 0.1, fiber: 0.7, sugar: 0.1, isActive: true },
      { name: 'Kale', category: 'vegetables', servingSize: '1 cup raw', calories: 33, protein: 2.9, carbs: 6, fats: 0.6, fiber: 2.6, sugar: 1.6, isActive: true },
      { name: 'Cauliflower', category: 'vegetables', servingSize: '1 cup cooked', calories: 29, protein: 2.3, carbs: 5.7, fats: 0.6, fiber: 2.9, sugar: 2.4, isActive: true },
      { name: 'Bell Peppers', category: 'vegetables', servingSize: '1 cup raw', calories: 39, protein: 1.5, carbs: 9, fats: 0.5, fiber: 3.1, sugar: 6.3, isActive: true },
      { name: 'Carrots', category: 'vegetables', servingSize: '1 cup raw', calories: 52, protein: 1.2, carbs: 12, fats: 0.3, fiber: 3.6, sugar: 6.1, isActive: true },
      { name: 'Tomatoes', category: 'vegetables', servingSize: '1 medium', calories: 22, protein: 1.1, carbs: 4.8, fats: 0.2, fiber: 1.5, sugar: 3.2, isActive: true },
      { name: 'Cucumber', category: 'vegetables', servingSize: '1 cup sliced', calories: 16, protein: 0.7, carbs: 3.6, fats: 0.1, fiber: 0.5, sugar: 1.8, isActive: true },
      { name: 'Zucchini', category: 'vegetables', servingSize: '1 cup cooked', calories: 27, protein: 2, carbs: 5, fats: 0.4, fiber: 2.5, sugar: 3.1, isActive: true },
      { name: 'Asparagus', category: 'vegetables', servingSize: '1 cup cooked', calories: 40, protein: 4.3, carbs: 7.4, fats: 0.4, fiber: 3.6, sugar: 2.9, isActive: true },
      { name: 'Green Beans', category: 'vegetables', servingSize: '1 cup cooked', calories: 44, protein: 2.4, carbs: 10, fats: 0.4, fiber: 4, sugar: 4.5, isActive: true },
      { name: 'Brussels Sprouts', category: 'vegetables', servingSize: '1 cup cooked', calories: 56, protein: 4, carbs: 11, fats: 0.8, fiber: 4.1, sugar: 2.7, isActive: true },
      { name: 'Mushrooms', category: 'vegetables', servingSize: '1 cup raw', calories: 21, protein: 3, carbs: 3, fats: 0.3, fiber: 1, sugar: 1.9, isActive: true },
      { name: 'Onions', category: 'vegetables', servingSize: '1 cup raw', calories: 64, protein: 1.8, carbs: 15, fats: 0.2, fiber: 2.7, sugar: 6.8, isActive: true },
      { name: 'Garlic', category: 'vegetables', servingSize: '3 cloves', calories: 13, protein: 0.6, carbs: 3, fats: 0, fiber: 0.2, sugar: 0.1, isActive: true },
      { name: 'Lettuce', category: 'vegetables', servingSize: '1 cup', calories: 8, protein: 0.6, carbs: 1.5, fats: 0.1, fiber: 0.6, sugar: 0.8, isActive: true },
      { name: 'Cabbage', category: 'vegetables', servingSize: '1 cup raw', calories: 22, protein: 1.1, carbs: 5.2, fats: 0.1, fiber: 2.2, sugar: 2.9, isActive: true },
      { name: 'Celery', category: 'vegetables', servingSize: '1 cup', calories: 16, protein: 0.7, carbs: 3, fats: 0.2, fiber: 1.6, sugar: 1.4, isActive: true },
      { name: 'Eggplant', category: 'vegetables', servingSize: '1 cup cooked', calories: 35, protein: 0.8, carbs: 8.6, fats: 0.2, fiber: 2.5, sugar: 3.2, isActive: true },
      { name: 'Beets', category: 'vegetables', servingSize: '1 cup cooked', calories: 75, protein: 2.9, carbs: 17, fats: 0.3, fiber: 3.4, sugar: 14, isActive: true },
      { name: 'Radishes', category: 'vegetables', servingSize: '1 cup sliced', calories: 19, protein: 0.8, carbs: 4, fats: 0.1, fiber: 1.9, sugar: 2.2, isActive: true },
      
      // Healthy Fats (50 items)
      { name: 'Avocado', category: 'fats', servingSize: '1/2 avocado', calories: 160, protein: 2, carbs: 9, fats: 15, fiber: 7, sugar: 0.7, isActive: true },
      { name: 'Olive Oil', category: 'fats', servingSize: '1 tbsp', calories: 119, protein: 0, carbs: 0, fats: 14, fiber: 0, sugar: 0, isActive: true },
      { name: 'Coconut Oil', category: 'fats', servingSize: '1 tbsp', calories: 121, protein: 0, carbs: 0, fats: 14, fiber: 0, sugar: 0, isActive: true },
      { name: 'Walnuts', category: 'fats', servingSize: '28g', calories: 185, protein: 4.3, carbs: 3.9, fats: 18.5, fiber: 1.9, sugar: 0.7, isActive: true },
      { name: 'Cashews', category: 'fats', servingSize: '28g', calories: 157, protein: 5.2, carbs: 8.6, fats: 12.4, fiber: 0.9, sugar: 1.7, isActive: true },
      { name: 'Chia Seeds', category: 'fats', servingSize: '2 tbsp', calories: 138, protein: 4.7, carbs: 12, fats: 8.7, fiber: 10, sugar: 0, isActive: true },
      { name: 'Flaxseeds', category: 'fats', servingSize: '1 tbsp', calories: 55, protein: 1.9, carbs: 3, fats: 4.3, fiber: 2.8, sugar: 0.2, isActive: true },
      { name: 'Pumpkin Seeds', category: 'fats', servingSize: '28g', calories: 151, protein: 7, carbs: 5, fats: 13, fiber: 1.7, sugar: 0.4, isActive: true },
      { name: 'Sunflower Seeds', category: 'fats', servingSize: '28g', calories: 165, protein: 5.8, carbs: 6.8, fats: 14, fiber: 2.4, sugar: 0.8, isActive: true },
      { name: 'Almond Butter', category: 'fats', servingSize: '2 tbsp', calories: 196, protein: 6.7, carbs: 6.1, fats: 18, fiber: 3.3, sugar: 1.9, isActive: true },
      { name: 'Dark Chocolate', category: 'fats', servingSize: '28g', calories: 170, protein: 2.2, carbs: 13, fats: 12, fiber: 3.1, sugar: 6.8, isActive: true }
    ];

    console.log(`📝 Preparing to insert ${nutritionItems.length} nutrition items...`);
    
    await NutritionItem.bulkCreate(nutritionItems, {
      ignoreDuplicates: true
    });
    
    console.log('✅ Successfully inserted nutrition items!');
    console.log('\n🎉 Nutrition seeding completed!');
    
    const count = await NutritionItem.count({ where: { isActive: true } });
    console.log(`\n📊 Total active nutrition items: ${count}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  }
}

seedNutrition();
