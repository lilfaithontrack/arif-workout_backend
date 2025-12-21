/**
 * Generate Comprehensive Nutrition Database Seed File
 * Creates SQL with 100+ food items
 */

const fs = require('fs');
const path = require('path');

const nutritionData = [
  // PROTEINS (30 items)
  { id: 1, name: 'Grilled Chicken Breast', category: 'protein', serving: '100g', cal: 165, pro: 31, carbs: 0, fats: 3.6, fiber: 0, sugar: 0, veg: false, vegan: false, gf: true, keto: true, tags: ['high_protein', 'lean'], pop: 95 },
  { id: 2, name: 'Turkey Breast', category: 'protein', serving: '100g', cal: 135, pro: 30, carbs: 0, fats: 1, fiber: 0, sugar: 0, veg: false, vegan: false, gf: true, keto: true, tags: ['high_protein', 'low_fat'], pop: 88 },
  { id: 3, name: 'Chicken Thigh', category: 'protein', serving: '100g', cal: 209, pro: 26, carbs: 0, fats: 11, fiber: 0, sugar: 0, veg: false, vegan: false, gf: true, keto: true, tags: ['protein'], pop: 85 },
  { id: 4, name: 'Salmon Fillet', category: 'protein', serving: '100g', cal: 206, pro: 22, carbs: 0, fats: 13, fiber: 0, sugar: 0, veg: false, vegan: false, gf: true, keto: true, tags: ['omega3', 'healthy_fats'], pop: 92 },
  { id: 5, name: 'Tuna (canned)', category: 'protein', serving: '100g', cal: 116, pro: 26, carbs: 0, fats: 1, fiber: 0, sugar: 0, veg: false, vegan: false, gf: true, keto: true, tags: ['high_protein', 'convenient'], pop: 90 },
  { id: 6, name: 'Cod', category: 'protein', serving: '100g', cal: 82, pro: 18, carbs: 0, fats: 0.7, fiber: 0, sugar: 0, veg: false, vegan: false, gf: true, keto: true, tags: ['lean', 'low_fat'], pop: 80 },
  { id: 7, name: 'Shrimp', category: 'protein', serving: '100g', cal: 99, pro: 24, carbs: 0.2, fats: 0.3, fiber: 0, sugar: 0, veg: false, vegan: false, gf: true, keto: true, tags: ['high_protein', 'low_calorie'], pop: 85 },
  { id: 8, name: 'Tilapia', category: 'protein', serving: '100g', cal: 128, pro: 26, carbs: 0, fats: 2.7, fiber: 0, sugar: 0, veg: false, vegan: false, gf: true, keto: true, tags: ['lean', 'affordable'], pop: 82 },
  { id: 9, name: 'Lean Beef (90/10)', category: 'protein', serving: '100g', cal: 176, pro: 26, carbs: 0, fats: 8, fiber: 0, sugar: 0, veg: false, vegan: false, gf: true, keto: true, tags: ['high_protein', 'iron_rich'], pop: 88 },
  { id: 10, name: 'Ground Turkey', category: 'protein', serving: '100g', cal: 150, pro: 28, carbs: 0, fats: 4, fiber: 0, sugar: 0, veg: false, vegan: false, gf: true, keto: true, tags: ['lean', 'versatile'], pop: 85 },
  { id: 11, name: 'Pork Tenderloin', category: 'protein', serving: '100g', cal: 143, pro: 26, carbs: 0, fats: 3.5, fiber: 0, sugar: 0, veg: false, vegan: false, gf: true, keto: true, tags: ['lean', 'tender'], pop: 80 },
  { id: 12, name: 'Whole Eggs', category: 'protein', serving: '2 large', cal: 143, pro: 13, carbs: 1, fats: 10, fiber: 0, sugar: 0.4, veg: true, vegan: false, gf: true, keto: true, tags: ['complete_protein', 'versatile'], pop: 95 },
  { id: 13, name: 'Egg Whites', category: 'protein', serving: '100g', cal: 52, pro: 11, carbs: 0.7, fats: 0.2, fiber: 0, sugar: 0.7, veg: true, vegan: false, gf: true, keto: true, tags: ['high_protein', 'low_fat'], pop: 88 },
  { id: 14, name: 'Greek Yogurt (non-fat)', category: 'protein', serving: '170g', cal: 100, pro: 17, carbs: 6, fats: 0.7, fiber: 0, sugar: 6, veg: true, vegan: false, gf: true, keto: false, tags: ['high_protein', 'probiotic'], pop: 92 },
  { id: 15, name: 'Cottage Cheese (low-fat)', category: 'protein', serving: '100g', cal: 72, pro: 12, carbs: 3.4, fats: 1, fiber: 0, sugar: 2.7, veg: true, vegan: false, gf: true, keto: false, tags: ['high_protein', 'low_fat'], pop: 85 },
  { id: 16, name: 'Tofu (firm)', category: 'protein', serving: '100g', cal: 144, pro: 17, carbs: 3, fats: 9, fiber: 2, sugar: 0.7, veg: true, vegan: true, gf: true, keto: true, tags: ['plant_protein', 'versatile'], pop: 82 },
  { id: 17, name: 'Tempeh', category: 'protein', serving: '100g', cal: 193, pro: 20, carbs: 9, fats: 11, fiber: 0, sugar: 0, veg: true, vegan: true, gf: true, keto: false, tags: ['plant_protein', 'fermented'], pop: 78 },
  { id: 18, name: 'Edamame', category: 'protein', serving: '100g', cal: 122, pro: 11, carbs: 10, fats: 5, fiber: 5, sugar: 2, veg: true, vegan: true, gf: true, keto: false, tags: ['plant_protein', 'fiber'], pop: 80 },
  { id: 19, name: 'Black Beans', category: 'protein', serving: '100g', cal: 132, pro: 9, carbs: 24, fats: 0.5, fiber: 9, sugar: 0.3, veg: true, vegan: true, gf: true, keto: false, tags: ['plant_protein', 'fiber'], pop: 85 },
  { id: 20, name: 'Chickpeas', category: 'protein', serving: '100g', cal: 164, pro: 9, carbs: 27, fats: 2.6, fiber: 7.6, sugar: 4.8, veg: true, vegan: true, gf: true, keto: false, tags: ['plant_protein', 'versatile'], pop: 88 },
  { id: 21, name: 'Lentils', category: 'protein', serving: '100g', cal: 116, pro: 9, carbs: 20, fats: 0.4, fiber: 8, sugar: 1.8, veg: true, vegan: true, gf: true, keto: false, tags: ['plant_protein', 'iron_rich'], pop: 85 },
  { id: 22, name: 'Almonds', category: 'protein', serving: '28g', cal: 164, pro: 6, carbs: 6, fats: 14, fiber: 3.5, sugar: 1, veg: true, vegan: true, gf: true, keto: true, tags: ['healthy_fats', 'portable'], pop: 90 },
  { id: 23, name: 'Peanut Butter', category: 'protein', serving: '2 tbsp', cal: 188, pro: 8, carbs: 7, fats: 16, fiber: 2, sugar: 3, veg: true, vegan: true, gf: true, keto: false, tags: ['protein', 'versatile'], pop: 92 },
  { id: 24, name: 'Whey Protein Isolate', category: 'protein', serving: '30g', cal: 110, pro: 25, carbs: 1, fats: 0.5, fiber: 0, sugar: 0, veg: true, vegan: false, gf: true, keto: true, tags: ['high_protein', 'convenient'], pop: 90 },
  { id: 25, name: 'Pea Protein', category: 'protein', serving: '30g', cal: 120, pro: 24, carbs: 2, fats: 2, fiber: 0, sugar: 0, veg: true, vegan: true, gf: true, keto: true, tags: ['plant_protein'], pop: 78 },
  
  // CARBS (30 items)
  { id: 26, name: 'Brown Rice', category: 'carbs', serving: '1 cup cooked', cal: 218, pro: 5, carbs: 45, fats: 1.6, fiber: 3.5, sugar: 0.7, veg: true, vegan: true, gf: true, keto: false, tags: ['whole_grain', 'complex_carbs'], pop: 90 },
  { id: 27, name: 'White Rice', category: 'carbs', serving: '1 cup cooked', cal: 205, pro: 4.2, carbs: 45, fats: 0.4, fiber: 0.6, sugar: 0.1, veg: true, vegan: true, gf: true, keto: false, tags: ['quick_energy'], pop: 88 },
  { id: 28, name: 'Quinoa', category: 'carbs', serving: '1 cup cooked', cal: 222, pro: 8, carbs: 39, fats: 3.6, fiber: 5, sugar: 1.6, veg: true, vegan: true, gf: true, keto: false, tags: ['complete_protein', 'fiber'], pop: 85 },
  { id: 29, name: 'Oatmeal', category: 'carbs', serving: '1 cup cooked', cal: 166, pro: 6, carbs: 28, fats: 3.6, fiber: 4, sugar: 0.6, veg: true, vegan: true, gf: false, keto: false, tags: ['whole_grain', 'fiber'], pop: 92 },
  { id: 30, name: 'Whole Wheat Pasta', category: 'carbs', serving: '1 cup cooked', cal: 174, pro: 7.5, carbs: 37, fats: 0.8, fiber: 6.3, sugar: 1, veg: true, vegan: true, gf: false, keto: false, tags: ['whole_grain'], pop: 85 },
  { id: 31, name: 'Whole Wheat Bread', category: 'carbs', serving: '1 slice', cal: 69, pro: 3.6, carbs: 12, fats: 0.9, fiber: 1.9, sugar: 1.4, veg: true, vegan: true, gf: false, keto: false, tags: ['whole_grain'], pop: 88 },
  { id: 32, name: 'Sweet Potato', category: 'carbs', serving: '1 medium', cal: 112, pro: 2, carbs: 26, fats: 0.1, fiber: 4, sugar: 5, veg: true, vegan: true, gf: true, keto: false, tags: ['complex_carbs', 'nutrient_dense'], pop: 90 },
  { id: 33, name: 'White Potato', category: 'carbs', serving: '1 medium', cal: 161, pro: 4.3, carbs: 37, fats: 0.2, fiber: 4, sugar: 1.9, veg: true, vegan: true, gf: true, keto: false, tags: ['versatile'], pop: 85 },
  { id: 34, name: 'Banana', category: 'fruits', serving: '1 medium', cal: 105, pro: 1.3, carbs: 27, fats: 0.4, fiber: 3.1, sugar: 14, veg: true, vegan: true, gf: true, keto: false, tags: ['quick_energy', 'potassium'], pop: 95 },
  { id: 35, name: 'Apple', category: 'fruits', serving: '1 medium', cal: 95, pro: 0.5, carbs: 25, fats: 0.3, fiber: 4.4, sugar: 19, veg: true, vegan: true, gf: true, keto: false, tags: ['fiber', 'portable'], pop: 92 },
  { id: 36, name: 'Orange', category: 'fruits', serving: '1 medium', cal: 62, pro: 1.2, carbs: 15, fats: 0.2, fiber: 3.1, sugar: 12, veg: true, vegan: true, gf: true, keto: false, tags: ['vitamin_c'], pop: 88 },
  { id: 37, name: 'Blueberries', category: 'fruits', serving: '1 cup', cal: 84, pro: 1.1, carbs: 21, fats: 0.5, fiber: 3.6, sugar: 15, veg: true, vegan: true, gf: true, keto: false, tags: ['antioxidants', 'superfood'], pop: 90 },
  { id: 38, name: 'Strawberries', category: 'fruits', serving: '1 cup', cal: 49, pro: 1, carbs: 12, fats: 0.5, fiber: 3, sugar: 7.4, veg: true, vegan: true, gf: true, keto: false, tags: ['vitamin_c', 'low_calorie'], pop: 92 },
  { id: 39, name: 'Mango', category: 'fruits', serving: '1 cup', cal: 99, pro: 1.4, carbs: 25, fats: 0.6, fiber: 2.6, sugar: 23, veg: true, vegan: true, gf: true, keto: false, tags: ['tropical', 'vitamin_rich'], pop: 85 },
  { id: 40, name: 'Grapes', category: 'fruits', serving: '1 cup', cal: 104, pro: 1.1, carbs: 27, fats: 0.2, fiber: 1.4, sugar: 23, veg: true, vegan: true, gf: true, keto: false, tags: ['portable', 'sweet'], pop: 85 },
  { id: 41, name: 'Watermelon', category: 'fruits', serving: '1 cup', cal: 46, pro: 0.9, carbs: 12, fats: 0.2, fiber: 0.6, sugar: 9.4, veg: true, vegan: true, gf: true, keto: false, tags: ['hydrating', 'low_calorie'], pop: 88 },
  { id: 42, name: 'Pineapple', category: 'fruits', serving: '1 cup', cal: 82, pro: 0.9, carbs: 22, fats: 0.2, fiber: 2.3, sugar: 16, veg: true, vegan: true, gf: true, keto: false, tags: ['tropical', 'enzyme_rich'], pop: 82 },
  { id: 43, name: 'Dates', category: 'fruits', serving: '2 dates', cal: 133, pro: 0.7, carbs: 36, fats: 0.1, fiber: 3.2, sugar: 32, veg: true, vegan: true, gf: true, keto: false, tags: ['natural_sugar', 'energy'], pop: 78 },
  
  // FATS (25 items)
  { id: 44, name: 'Avocado', category: 'fats', serving: '1/2 avocado', cal: 160, pro: 2, carbs: 9, fats: 15, fiber: 7, sugar: 0.7, veg: true, vegan: true, gf: true, keto: true, tags: ['healthy_fats', 'fiber'], pop: 95 },
  { id: 45, name: 'Olive Oil', category: 'fats', serving: '1 tbsp', cal: 119, pro: 0, carbs: 0, fats: 14, fiber: 0, sugar: 0, veg: true, vegan: true, gf: true, keto: true, tags: ['monounsaturated', 'cooking'], pop: 92 },
  { id: 46, name: 'Coconut Oil', category: 'fats', serving: '1 tbsp', cal: 121, pro: 0, carbs: 0, fats: 14, fiber: 0, sugar: 0, veg: true, vegan: true, gf: true, keto: true, tags: ['mct', 'cooking'], pop: 85 },
  { id: 47, name: 'Walnuts', category: 'fats', serving: '28g', cal: 185, pro: 4.3, carbs: 3.9, fats: 18.5, fiber: 1.9, sugar: 0.7, veg: true, vegan: true, gf: true, keto: true, tags: ['omega3', 'brain_health'], pop: 88 },
  { id: 48, name: 'Cashews', category: 'fats', serving: '28g', cal: 157, pro: 5.2, carbs: 8.6, fats: 12.4, fiber: 0.9, sugar: 1.7, veg: true, vegan: true, gf: true, keto: false, tags: ['creamy', 'versatile'], pop: 85 },
  { id: 49, name: 'Chia Seeds', category: 'fats', serving: '2 tbsp', cal: 138, pro: 4.7, carbs: 12, fats: 8.7, fiber: 9.8, sugar: 0, veg: true, vegan: true, gf: true, keto: true, tags: ['omega3', 'fiber'], pop: 88 },
  { id: 50, name: 'Flaxseeds', category: 'fats', serving: '1 tbsp', cal: 55, pro: 1.9, carbs: 3, fats: 4.3, fiber: 2.8, sugar: 0.2, veg: true, vegan: true, gf: true, keto: true, tags: ['omega3', 'fiber'], pop: 82 },
  { id: 51, name: 'Pumpkin Seeds', category: 'fats', serving: '28g', cal: 151, pro: 7, carbs: 5, fats: 13, fiber: 1.7, sugar: 0.4, veg: true, vegan: true, gf: true, keto: true, tags: ['zinc_rich', 'protein'], pop: 80 },
  { id: 52, name: 'Sunflower Seeds', category: 'fats', serving: '28g', cal: 165, pro: 5.8, carbs: 6.8, fats: 14, fiber: 2.4, sugar: 0.8, veg: true, vegan: true, gf: true, keto: true, tags: ['vitamin_e'], pop: 78 },
  { id: 53, name: 'Almond Butter', category: 'fats', serving: '2 tbsp', cal: 196, pro: 6.7, carbs: 6.1, fats: 18, fiber: 3.3, sugar: 1.9, veg: true, vegan: true, gf: true, keto: false, tags: ['healthy_fats'], pop: 85 },
  { id: 54, name: 'Dark Chocolate (70%)', category: 'fats', serving: '28g', cal: 170, pro: 2.2, carbs: 13, fats: 12, fiber: 3.1, sugar: 6.8, veg: true, vegan: true, gf: true, keto: false, tags: ['antioxidants'], pop: 88 },
  
  // VEGETABLES (25 items)
  { id: 55, name: 'Broccoli', category: 'vegetables', serving: '1 cup cooked', cal: 55, pro: 3.7, carbs: 11, fats: 0.6, fiber: 5.1, sugar: 2.2, veg: true, vegan: true, gf: true, keto: true, tags: ['low_calorie', 'fiber'], pop: 88 },
  { id: 56, name: 'Spinach', category: 'vegetables', serving: '1 cup raw', cal: 7, pro: 0.9, carbs: 1.1, fats: 0.1, fiber: 0.7, sugar: 0.1, veg: true, vegan: true, gf: true, keto: true, tags: ['low_calorie', 'iron'], pop: 90 },
  { id: 57, name: 'Kale', category: 'vegetables', serving: '1 cup raw', cal: 33, pro: 2.9, carbs: 6, fats: 0.6, fiber: 1.3, sugar: 0.8, veg: true, vegan: true, gf: true, keto: true, tags: ['superfood', 'nutrient_dense'], pop: 85 },
  { id: 58, name: 'Cauliflower', category: 'vegetables', serving: '1 cup cooked', cal: 29, pro: 2.3, carbs: 5.7, fats: 0.6, fiber: 2.9, sugar: 2.4, veg: true, vegan: true, gf: true, keto: true, tags: ['low_calorie', 'versatile'], pop: 82 },
  { id: 59, name: 'Bell Peppers', category: 'vegetables', serving: '1 cup raw', cal: 39, pro: 1.5, carbs: 9, fats: 0.5, fiber: 3.1, sugar: 6.3, veg: true, vegan: true, gf: true, keto: true, tags: ['vitamin_c', 'colorful'], pop: 85 },
  { id: 60, name: 'Carrots', category: 'vegetables', serving: '1 cup raw', cal: 52, pro: 1.2, carbs: 12, fats: 0.3, fiber: 3.6, sugar: 6, veg: true, vegan: true, gf: true, keto: false, tags: ['vitamin_a', 'crunchy'], pop: 88 },
  { id: 61, name: 'Tomatoes', category: 'vegetables', serving: '1 medium', cal: 22, pro: 1.1, carbs: 4.8, fats: 0.2, fiber: 1.5, sugar: 3.2, veg: true, vegan: true, gf: true, keto: true, tags: ['lycopene', 'versatile'], pop: 90 },
  { id: 62, name: 'Cucumber', category: 'vegetables', serving: '1 cup sliced', cal: 16, pro: 0.7, carbs: 3.6, fats: 0.1, fiber: 0.5, sugar: 1.7, veg: true, vegan: true, gf: true, keto: true, tags: ['hydrating', 'low_calorie'], pop: 85 },
  { id: 63, name: 'Zucchini', category: 'vegetables', serving: '1 cup cooked', cal: 27, pro: 2, carbs: 5, fats: 0.4, fiber: 2, sugar: 3.5, veg: true, vegan: true, gf: true, keto: true, tags: ['low_calorie', 'versatile'], pop: 80 },
  { id: 64, name: 'Asparagus', category: 'vegetables', serving: '1 cup cooked', cal: 40, pro: 4.3, carbs: 7.4, fats: 0.4, fiber: 3.6, sugar: 2.5, veg: true, vegan: true, gf: true, keto: true, tags: ['nutrient_dense'], pop: 78 },
  { id: 65, name: 'Green Beans', category: 'vegetables', serving: '1 cup cooked', cal: 44, pro: 2.4, carbs: 10, fats: 0.4, fiber: 4, sugar: 5.7, veg: true, vegan: true, gf: true, keto: true, tags: ['fiber'], pop: 82 },
  { id: 66, name: 'Brussels Sprouts', category: 'vegetables', serving: '1 cup cooked', cal: 56, pro: 4, carbs: 11, fats: 0.8, fiber: 4, sugar: 2.7, veg: true, vegan: true, gf: true, keto: true, tags: ['fiber', 'vitamin_k'], pop: 75 },
  { id: 67, name: 'Mushrooms', category: 'vegetables', serving: '1 cup raw', cal: 21, pro: 3, carbs: 3, fats: 0.3, fiber: 1, sugar: 1.9, veg: true, vegan: true, gf: true, keto: true, tags: ['low_calorie', 'umami'], pop: 85 },
  { id: 68, name: 'Onions', category: 'vegetables', serving: '1 cup raw', cal: 64, pro: 1.8, carbs: 15, fats: 0.2, fiber: 2.7, sugar: 6.8, veg: true, vegan: true, gf: true, keto: false, tags: ['flavor', 'versatile'], pop: 88 },
  { id: 69, name: 'Garlic', category: 'vegetables', serving: '3 cloves', cal: 13, pro: 0.6, carbs: 3, fats: 0, fiber: 0.2, sugar: 0.1, veg: true, vegan: true, gf: true, keto: true, tags: ['flavor', 'immune'], pop: 90 },
  { id: 70, name: 'Lettuce (Romaine)', category: 'vegetables', serving: '1 cup', cal: 8, pro: 0.6, carbs: 1.5, fats: 0.1, fiber: 1, sugar: 0.6, veg: true, vegan: true, gf: true, keto: true, tags: ['low_calorie', 'salad'], pop: 85 },
  { id: 71, name: 'Cabbage', category: 'vegetables', serving: '1 cup raw', cal: 22, pro: 1.1, carbs: 5.2, fats: 0.1, fiber: 2.2, sugar: 2.9, veg: true, vegan: true, gf: true, keto: true, tags: ['low_calorie', 'versatile'], pop: 78 },
  { id: 72, name: 'Celery', category: 'vegetables', serving: '1 cup', cal: 16, pro: 0.7, carbs: 3, fats: 0.2, fiber: 1.6, sugar: 1.3, veg: true, vegan: true, gf: true, keto: true, tags: ['low_calorie', 'crunchy'], pop: 75 },
  { id: 73, name: 'Eggplant', category: 'vegetables', serving: '1 cup cooked', cal: 35, pro: 0.8, carbs: 8.6, fats: 0.2, fiber: 2.5, sugar: 3.2, veg: true, vegan: true, gf: true, keto: true, tags: ['low_calorie'], pop: 72 },
  { id: 74, name: 'Beets', category: 'vegetables', serving: '1 cup cooked', cal: 75, pro: 2.9, carbs: 17, fats: 0.3, fiber: 3.8, sugar: 13, veg: true, vegan: true, gf: true, keto: false, tags: ['nitrates', 'colorful'], pop: 75 },
  { id: 75, name: 'Radishes', category: 'vegetables', serving: '1 cup sliced', cal: 19, pro: 0.8, carbs: 4, fats: 0.1, fiber: 1.9, sugar: 2.2, veg: true, vegan: true, gf: true, keto: true, tags: ['low_calorie', 'crunchy'], pop: 70 },
  
  // DAIRY & ALTERNATIVES (10 items)
  { id: 76, name: 'Milk (2%)', category: 'dairy', serving: '1 cup', cal: 122, pro: 8, carbs: 12, fats: 4.8, fiber: 0, sugar: 12, veg: true, vegan: false, gf: true, keto: false, tags: ['calcium', 'protein'], pop: 88 },
  { id: 77, name: 'Almond Milk (unsweetened)', category: 'dairy', serving: '1 cup', cal: 30, pro: 1, carbs: 1, fats: 2.5, fiber: 0, sugar: 0, veg: true, vegan: true, gf: true, keto: true, tags: ['low_calorie', 'dairy_free'], pop: 85 },
  { id: 78, name: 'Oat Milk', category: 'dairy', serving: '1 cup', cal: 120, pro: 3, carbs: 16, fats: 5, fiber: 2, sugar: 7, veg: true, vegan: true, gf: true, keto: false, tags: ['dairy_free', 'creamy'], pop: 82 },
  { id: 79, name: 'Cheddar Cheese', category: 'dairy', serving: '28g', cal: 114, pro: 7, carbs: 0.4, fats: 9, fiber: 0, sugar: 0.1, veg: true, vegan: false, gf: true, keto: true, tags: ['protein', 'calcium'], pop: 88 },
  { id: 80, name: 'Mozzarella', category: 'dairy', serving: '28g', cal: 72, pro: 7, carbs: 1, fats: 4.5, fiber: 0, sugar: 0.3, veg: true, vegan: false, gf: true, keto: false, tags: ['protein', 'calcium'], pop: 85 },
  { id: 81, name: 'Feta Cheese', category: 'dairy', serving: '28g', cal: 75, pro: 4, carbs: 1.2, fats: 6, fiber: 0, sugar: 1.2, veg: true, vegan: false, gf: true, keto: true, tags: ['tangy', 'mediterranean'], pop: 80 },
  { id: 82, name: 'Parmesan', category: 'dairy', serving: '28g', cal: 111, pro: 10, carbs: 0.9, fats: 7, fiber: 0, sugar: 0.2, veg: true, vegan: false, gf: true, keto: true, tags: ['high_protein', 'flavor'], pop: 85 },
  { id: 83, name: 'Cream Cheese', category: 'dairy', serving: '28g', cal: 99, pro: 1.8, carbs: 1.6, fats: 10, fiber: 0, sugar: 0.8, veg: true, vegan: false, gf: true, keto: true, tags: ['creamy'], pop: 82 },
  { id: 84, name: 'Sour Cream', category: 'dairy', serving: '2 tbsp', cal: 60, pro: 0.7, carbs: 1.2, fats: 6, fiber: 0, sugar: 0.6, veg: true, vegan: false, gf: true, keto: true, tags: ['creamy', 'topping'], pop: 78 },
  { id: 85, name: 'Butter', category: 'fats', serving: '1 tbsp', cal: 102, pro: 0.1, carbs: 0, fats: 12, fiber: 0, sugar: 0, veg: true, vegan: false, gf: true, keto: true, tags: ['cooking', 'flavor'], pop: 85 },
  
  // SNACKS & MISC (15 items)
  { id: 86, name: 'Hummus', category: 'snacks', serving: '2 tbsp', cal: 70, pro: 2, carbs: 6, fats: 4, fiber: 2, sugar: 0, veg: true, vegan: true, gf: true, keto: false, tags: ['dip', 'protein'], pop: 88 },
  { id: 87, name: 'Guacamole', category: 'snacks', serving: '2 tbsp', cal: 50, pro: 0.6, carbs: 3, fats: 4.5, fiber: 2, sugar: 0.3, veg: true, vegan: true, gf: true, keto: true, tags: ['healthy_fats', 'dip'], pop: 90 },
  { id: 88, name: 'Salsa', category: 'snacks', serving: '2 tbsp', cal: 10, pro: 0.3, carbs: 2, fats: 0, fiber: 0.5, sugar: 1.2, veg: true, vegan: true, gf: true, keto: true, tags: ['low_calorie', 'flavor'], pop: 85 },
  { id: 89, name: 'Rice Cakes', category: 'snacks', serving: '1 cake', cal: 35, pro: 0.7, carbs: 7, fats: 0.3, fiber: 0.4, sugar: 0, veg: true, vegan: true, gf: true, keto: false, tags: ['low_calorie', 'crunchy'], pop: 75 },
  { id: 90, name: 'Popcorn (air-popped)', category: 'snacks', serving: '3 cups', cal: 93, pro: 3, carbs: 18.6, fats: 1.1, fiber: 3.6, sugar: 0.2, veg: true, vegan: true, gf: true, keto: false, tags: ['whole_grain', 'fiber'], pop: 85 },
  { id: 91, name: 'Protein Bar', category: 'snacks', serving: '1 bar', cal: 200, pro: 20, carbs: 22, fats: 7, fiber: 3, sugar: 12, veg: true, vegan: false, gf: true, keto: false, tags: ['convenient', 'protein'], pop: 88 },
  { id: 92, name: 'Granola', category: 'snacks', serving: '1/4 cup', cal: 140, pro: 3, carbs: 18, fats: 7, fiber: 2, sugar: 6, veg: true, vegan: true, gf: false, keto: false, tags: ['crunchy', 'energy'], pop: 82 },
  { id: 93, name: 'Trail Mix', category: 'snacks', serving: '1/4 cup', cal: 173, pro: 5, carbs: 17, fats: 11, fiber: 2, sugar: 11, veg: true, vegan: true, gf: true, keto: false, tags: ['portable', 'energy'], pop: 85 },
  { id: 94, name: 'Beef Jerky', category: 'snacks', serving: '28g', cal: 116, pro: 9, carbs: 3, fats: 7, fiber: 0.5, sugar: 3, veg: false, vegan: false, gf: true, keto: true, tags: ['high_protein', 'portable'], pop: 80 },
  { id: 95, name: 'Seaweed Snacks', category: 'snacks', serving: '5g', cal: 25, pro: 1, carbs: 1, fats: 1.5, fiber: 1, sugar: 0, veg: true, vegan: true, gf: true, keto: true, tags: ['low_calorie', 'iodine'], pop: 72 },
  { id: 96, name: 'Edamame (frozen)', category: 'snacks', serving: '1/2 cup', cal: 95, pro: 8, carbs: 8, fats: 4, fiber: 4, sugar: 2, veg: true, vegan: true, gf: true, keto: false, tags: ['protein', 'fiber'], pop: 80 },
  { id: 97, name: 'String Cheese', category: 'snacks', serving: '1 stick', cal: 80, pro: 6, carbs: 1, fats: 6, fiber: 0, sugar: 0, veg: true, vegan: false, gf: true, keto: true, tags: ['portable', 'protein'], pop: 85 },
  { id: 98, name: 'Hard Boiled Egg', category: 'snacks', serving: '1 large', cal: 78, pro: 6, carbs: 0.6, fats: 5, fiber: 0, sugar: 0.6, veg: true, vegan: false, gf: true, keto: true, tags: ['portable', 'protein'], pop: 88 },
  { id: 99, name: 'Protein Shake', category: 'snacks', serving: '1 serving', cal: 160, pro: 30, carbs: 5, fats: 2, fiber: 1, sugar: 2, veg: true, vegan: false, gf: true, keto: true, tags: ['convenient', 'post_workout'], pop: 90 },
  { id: 100, name: 'Energy Balls', category: 'snacks', serving: '1 ball', cal: 100, pro: 3, carbs: 12, fats: 5, fiber: 2, sugar: 7, veg: true, vegan: true, gf: true, keto: false, tags: ['homemade', 'energy'], pop: 78 },
];

function generateSQL() {
  let sql = `-- ============================================
-- Comprehensive Nutrition Database - ${nutritionData.length} Food Items
-- Generated: ${new Date().toISOString()}
-- Run: mysql -u root -p arif_workout < nutrition-seed-comprehensive.sql
-- ============================================

`;

  nutritionData.forEach((food, index) => {
    const slug = food.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const foodId = `food_${String(food.id).padStart(3, '0')}`;
    const mealTypes = food.category === 'protein' ? ['lunch', 'dinner'] :
                     food.category === 'carbs' ? ['breakfast', 'lunch', 'dinner'] :
                     food.category === 'fruits' ? ['breakfast', 'snack'] :
                     food.category === 'vegetables' ? ['lunch', 'dinner'] :
                     food.category === 'fats' ? ['breakfast', 'lunch', 'dinner'] :
                     food.category === 'dairy' ? ['breakfast', 'snack'] :
                     ['snack'];
    
    const goals = food.pro >= 20 ? ['muscle_gain'] :
                 food.cal < 100 ? ['weight_loss'] :
                 ['maintenance'];

    sql += `INSERT IGNORE INTO nutrition_items (
  foodId, name, slug, category, servingSize,
  calories, protein, carbs, fats, fiber, sugar,
  vitamins, minerals,
  isVegetarian, isVegan, isGlutenFree, isDairyFree, isKeto,
  allergens, mealTypes, goals, tags,
  preparationTime, cost, popularityScore,
  imageUrl, thumbnailUrl, isActive, createdBy, createdAt, updatedAt
) VALUES (
  '${foodId}', '${food.name}', '${slug}', '${food.category}', '${food.serving}',
  ${food.cal}, ${food.pro}, ${food.carbs}, ${food.fats}, ${food.fiber}, ${food.sugar},
  JSON_OBJECT(), JSON_OBJECT(),
  ${food.veg ? 'TRUE' : 'FALSE'}, ${food.vegan ? 'TRUE' : 'FALSE'}, ${food.gf ? 'TRUE' : 'FALSE'}, TRUE, ${food.keto ? 'TRUE' : 'FALSE'},
  JSON_ARRAY(), JSON_ARRAY(${mealTypes.map(m => `'${m}'`).join(', ')}), JSON_ARRAY(${goals.map(g => `'${g}'`).join(', ')}), JSON_ARRAY(${food.tags.map(t => `'${t}'`).join(', ')}),
  0, 'low', ${food.pop},
  '/images/nutrition/${slug}/main.jpg', '/images/nutrition/${slug}/thumbnail.jpg',
  TRUE, 1, NOW(), NOW()
);\n\n`;
  });

  sql += `-- ============================================
-- Summary: ${nutritionData.length} nutrition items added
-- Categories:
--   - Protein: ${nutritionData.filter(f => f.category === 'protein').length}
--   - Carbs: ${nutritionData.filter(f => f.category === 'carbs').length}
--   - Fats: ${nutritionData.filter(f => f.category === 'fats').length}
--   - Fruits: ${nutritionData.filter(f => f.category === 'fruits').length}
--   - Vegetables: ${nutritionData.filter(f => f.category === 'vegetables').length}
--   - Dairy: ${nutritionData.filter(f => f.category === 'dairy').length}
--   - Snacks: ${nutritionData.filter(f => f.category === 'snacks').length}
-- ============================================
`;

  return sql;
}

// Write to file
const outputPath = path.join(__dirname, '../seeders/nutrition-seed-comprehensive.sql');
const sqlContent = generateSQL();
fs.writeFileSync(outputPath, sqlContent);

console.log(`✅ Generated comprehensive nutrition seed file with ${nutritionData.length} items!`);
console.log(`📁 Location: ${outputPath}`);
console.log(`\n📊 Breakdown:`);
console.log(`   - Protein: ${nutritionData.filter(f => f.category === 'protein').length}`);
console.log(`   - Carbs: ${nutritionData.filter(f => f.category === 'carbs').length}`);
console.log(`   - Fats: ${nutritionData.filter(f => f.category === 'fats').length}`);
console.log(`   - Fruits: ${nutritionData.filter(f => f.category === 'fruits').length}`);
console.log(`   - Vegetables: ${nutritionData.filter(f => f.category === 'vegetables').length}`);
console.log(`   - Dairy: ${nutritionData.filter(f => f.category === 'dairy').length}`);
console.log(`   - Snacks: ${nutritionData.filter(f => f.category === 'snacks').length}`);
console.log(`\n🚀 To seed the database, run:`);
console.log(`   cd backend/src/seeders`);
console.log(`   mysql -u root -p arif_workout < nutrition-seed-comprehensive.sql`);
