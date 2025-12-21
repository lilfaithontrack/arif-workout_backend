-- ============================================
-- Nutrition Items Database Seed - 15 Foods
-- Based on nutrition_database.json
-- ============================================

-- 1. Grilled Chicken Breast
INSERT IGNORE INTO nutrition_items (
  foodId, name, slug, category, servingSize,
  calories, protein, carbs, fats, fiber, sugar,
  vitamins, minerals,
  isVegetarian, isVegan, isGlutenFree, isDairyFree, isKeto,
  allergens, mealTypes, goals,
  preparationTime, cost, tags, popularityScore,
  imageUrl, thumbnailUrl, isActive, createdBy, createdAt, updatedAt
) VALUES (
  'food_001', 'Grilled Chicken Breast', 'grilled-chicken-breast', 'protein', '100g',
  165, 31, 0, 3.6, 0, 0,
  JSON_OBJECT('B6', 0.5, 'B12', 0.3, 'niacin', 14),
  JSON_OBJECT('iron', 1, 'zinc', 1.5, 'selenium', 27),
  FALSE, FALSE, TRUE, TRUE, TRUE,
  JSON_ARRAY(),
  JSON_ARRAY('lunch', 'dinner', 'post_workout'),
  JSON_ARRAY('muscle_gain', 'weight_loss', 'maintenance'),
  15, 'medium', JSON_ARRAY('high_protein', 'low_carb', 'lean'), 92,
  '/images/nutrition/grilled-chicken-breast/main.jpg',
  '/images/nutrition/grilled-chicken-breast/thumbnail.jpg',
  TRUE, 1, NOW(), NOW()
);

-- 2. Brown Rice
INSERT IGNORE INTO nutrition_items (
  foodId, name, slug, category, servingSize,
  calories, protein, carbs, fats, fiber, sugar,
  vitamins, minerals,
  isVegetarian, isVegan, isGlutenFree, isDairyFree, isKeto,
  allergens, mealTypes, goals,
  preparationTime, cost, tags, popularityScore,
  imageUrl, thumbnailUrl, isActive, createdBy, createdAt, updatedAt
) VALUES (
  'food_002', 'Brown Rice', 'brown-rice', 'carbs', '1 cup cooked (195g)',
  218, 5, 45, 1.6, 3.5, 0.7,
  JSON_OBJECT('B1', 0.2, 'B3', 2.6, 'B6', 0.3),
  JSON_OBJECT('magnesium', 86, 'phosphorus', 150, 'manganese', 1.8),
  TRUE, TRUE, TRUE, TRUE, FALSE,
  JSON_ARRAY(),
  JSON_ARRAY('lunch', 'dinner'),
  JSON_ARRAY('muscle_gain', 'endurance', 'maintenance'),
  45, 'low', JSON_ARRAY('whole_grain', 'complex_carbs', 'fiber'), 88,
  '/images/nutrition/brown-rice/main.jpg',
  '/images/nutrition/brown-rice/thumbnail.jpg',
  TRUE, 1, NOW(), NOW()
);

-- 3. Salmon Fillet
INSERT IGNORE INTO nutrition_items (
  foodId, name, slug, category, servingSize,
  calories, protein, carbs, fats, fiber, sugar,
  vitamins, minerals,
  isVegetarian, isVegan, isGlutenFree, isDairyFree, isKeto,
  allergens, mealTypes, goals,
  preparationTime, cost, tags, popularityScore,
  imageUrl, thumbnailUrl, isActive, createdBy, createdAt, updatedAt
) VALUES (
  'food_003', 'Salmon Fillet', 'salmon-fillet', 'protein', '100g',
  206, 22, 0, 13, 0, 0,
  JSON_OBJECT('D', 11, 'B12', 3.2, 'B6', 0.6),
  JSON_OBJECT('selenium', 41, 'potassium', 363, 'phosphorus', 200),
  FALSE, FALSE, TRUE, TRUE, TRUE,
  JSON_ARRAY('fish'),
  JSON_ARRAY('lunch', 'dinner'),
  JSON_ARRAY('muscle_gain', 'heart_health', 'brain_health'),
  20, 'high', JSON_ARRAY('omega3', 'high_protein', 'healthy_fats'), 90,
  '/images/nutrition/salmon-fillet/main.jpg',
  '/images/nutrition/salmon-fillet/thumbnail.jpg',
  TRUE, 1, NOW(), NOW()
);

-- 4. Greek Yogurt
INSERT IGNORE INTO nutrition_items (
  foodId, name, slug, category, servingSize,
  calories, protein, carbs, fats, fiber, sugar,
  vitamins, minerals,
  isVegetarian, isVegan, isGlutenFree, isDairyFree, isKeto,
  allergens, mealTypes, goals,
  preparationTime, cost, tags, popularityScore,
  imageUrl, thumbnailUrl, isActive, createdBy, createdAt, updatedAt
) VALUES (
  'food_004', 'Greek Yogurt', 'greek-yogurt', 'protein', '170g',
  100, 17, 6, 0.7, 0, 6,
  JSON_OBJECT('B12', 1.3, 'riboflavin', 0.3),
  JSON_OBJECT('calcium', 187, 'phosphorus', 173, 'potassium', 220),
  TRUE, FALSE, TRUE, FALSE, FALSE,
  JSON_ARRAY('dairy'),
  JSON_ARRAY('breakfast', 'snack', 'post_workout'),
  JSON_ARRAY('muscle_gain', 'weight_loss', 'gut_health'),
  0, 'medium', JSON_ARRAY('high_protein', 'probiotic', 'low_fat'), 87,
  '/images/nutrition/greek-yogurt/main.jpg',
  '/images/nutrition/greek-yogurt/thumbnail.jpg',
  TRUE, 1, NOW(), NOW()
);

-- 5. Oatmeal
INSERT IGNORE INTO nutrition_items (
  foodId, name, slug, category, servingSize,
  calories, protein, carbs, fats, fiber, sugar,
  vitamins, minerals,
  isVegetarian, isVegan, isGlutenFree, isDairyFree, isKeto,
  allergens, mealTypes, goals,
  preparationTime, cost, tags, popularityScore,
  imageUrl, thumbnailUrl, isActive, createdBy, createdAt, updatedAt
) VALUES (
  'food_005', 'Oatmeal', 'oatmeal', 'carbs', '1 cup cooked (234g)',
  166, 6, 28, 3.6, 4, 0.6,
  JSON_OBJECT('B1', 0.2, 'folate', 14),
  JSON_OBJECT('iron', 2.1, 'magnesium', 61, 'zinc', 1.4),
  TRUE, TRUE, FALSE, TRUE, FALSE,
  JSON_ARRAY('gluten'),
  JSON_ARRAY('breakfast', 'pre_workout'),
  JSON_ARRAY('endurance', 'heart_health', 'weight_loss'),
  5, 'low', JSON_ARRAY('whole_grain', 'fiber', 'slow_release'), 85,
  '/images/nutrition/oatmeal/main.jpg',
  '/images/nutrition/oatmeal/thumbnail.jpg',
  TRUE, 1, NOW(), NOW()
);

-- 6. Avocado
INSERT IGNORE INTO nutrition_items (
  foodId, name, slug, category, servingSize,
  calories, protein, carbs, fats, fiber, sugar,
  vitamins, minerals,
  isVegetarian, isVegan, isGlutenFree, isDairyFree, isKeto,
  allergens, mealTypes, goals,
  preparationTime, cost, tags, popularityScore,
  imageUrl, thumbnailUrl, isActive, createdBy, createdAt, updatedAt
) VALUES (
  'food_006', 'Avocado', 'avocado', 'fats', '1/2 avocado (100g)',
  160, 2, 9, 15, 7, 0.7,
  JSON_OBJECT('K', 21, 'folate', 81, 'C', 10),
  JSON_OBJECT('potassium', 485, 'magnesium', 29),
  TRUE, TRUE, TRUE, TRUE, TRUE,
  JSON_ARRAY(),
  JSON_ARRAY('breakfast', 'lunch', 'snack'),
  JSON_ARRAY('heart_health', 'brain_health', 'maintenance'),
  2, 'medium', JSON_ARRAY('healthy_fats', 'fiber', 'nutrient_dense'), 91,
  '/images/nutrition/avocado/main.jpg',
  '/images/nutrition/avocado/thumbnail.jpg',
  TRUE, 1, NOW(), NOW()
);

-- 7. Eggs
INSERT IGNORE INTO nutrition_items (
  foodId, name, slug, category, servingSize,
  calories, protein, carbs, fats, fiber, sugar,
  vitamins, minerals,
  isVegetarian, isVegan, isGlutenFree, isDairyFree, isKeto,
  allergens, mealTypes, goals,
  preparationTime, cost, tags, popularityScore,
  imageUrl, thumbnailUrl, isActive, createdBy, createdAt, updatedAt
) VALUES (
  'food_007', 'Eggs', 'eggs', 'protein', '2 large eggs (100g)',
  143, 13, 1, 10, 0, 0.4,
  JSON_OBJECT('A', 540, 'D', 82, 'B12', 1.1),
  JSON_OBJECT('selenium', 30, 'phosphorus', 198, 'iron', 1.8),
  TRUE, FALSE, TRUE, TRUE, TRUE,
  JSON_ARRAY('eggs'),
  JSON_ARRAY('breakfast', 'lunch'),
  JSON_ARRAY('muscle_gain', 'weight_loss', 'brain_health'),
  10, 'low', JSON_ARRAY('high_protein', 'complete_protein', 'versatile'), 94,
  '/images/nutrition/eggs/main.jpg',
  '/images/nutrition/eggs/thumbnail.jpg',
  TRUE, 1, NOW(), NOW()
);

-- 8. Sweet Potato
INSERT IGNORE INTO nutrition_items (
  foodId, name, slug, category, servingSize,
  calories, protein, carbs, fats, fiber, sugar,
  vitamins, minerals,
  isVegetarian, isVegan, isGlutenFree, isDairyFree, isKeto,
  allergens, mealTypes, goals,
  preparationTime, cost, tags, popularityScore,
  imageUrl, thumbnailUrl, isActive, createdBy, createdAt, updatedAt
) VALUES (
  'food_008', 'Sweet Potato', 'sweet-potato', 'carbs', '1 medium (130g)',
  112, 2, 26, 0.1, 4, 5,
  JSON_OBJECT('A', 1836, 'C', 22, 'B6', 0.3),
  JSON_OBJECT('potassium', 542, 'manganese', 0.5),
  TRUE, TRUE, TRUE, TRUE, FALSE,
  JSON_ARRAY(),
  JSON_ARRAY('lunch', 'dinner', 'pre_workout'),
  JSON_ARRAY('endurance', 'muscle_gain', 'immune_health'),
  45, 'low', JSON_ARRAY('complex_carbs', 'fiber', 'nutrient_dense'), 86,
  '/images/nutrition/sweet-potato/main.jpg',
  '/images/nutrition/sweet-potato/thumbnail.jpg',
  TRUE, 1, NOW(), NOW()
);

-- 9. Almonds
INSERT IGNORE INTO nutrition_items (
  foodId, name, slug, category, servingSize,
  calories, protein, carbs, fats, fiber, sugar,
  vitamins, minerals,
  isVegetarian, isVegan, isGlutenFree, isDairyFree, isKeto,
  allergens, mealTypes, goals,
  preparationTime, cost, tags, popularityScore,
  imageUrl, thumbnailUrl, isActive, createdBy, createdAt, updatedAt
) VALUES (
  'food_009', 'Almonds', 'almonds', 'fats', '28g (about 23 almonds)',
  164, 6, 6, 14, 3.5, 1,
  JSON_OBJECT('E', 7.3, 'riboflavin', 0.3),
  JSON_OBJECT('magnesium', 76, 'calcium', 76, 'iron', 1),
  TRUE, TRUE, TRUE, TRUE, TRUE,
  JSON_ARRAY('nuts'),
  JSON_ARRAY('snack', 'breakfast'),
  JSON_ARRAY('heart_health', 'brain_health', 'weight_loss'),
  0, 'medium', JSON_ARRAY('healthy_fats', 'protein', 'portable'), 89,
  '/images/nutrition/almonds/main.jpg',
  '/images/nutrition/almonds/thumbnail.jpg',
  TRUE, 1, NOW(), NOW()
);

-- 10. Broccoli
INSERT IGNORE INTO nutrition_items (
  foodId, name, slug, category, servingSize,
  calories, protein, carbs, fats, fiber, sugar,
  vitamins, minerals,
  isVegetarian, isVegan, isGlutenFree, isDairyFree, isKeto,
  allergens, mealTypes, goals,
  preparationTime, cost, tags, popularityScore,
  imageUrl, thumbnailUrl, isActive, createdBy, createdAt, updatedAt
) VALUES (
  'food_010', 'Broccoli', 'broccoli', 'vegetables', '1 cup chopped (91g)',
  31, 2.6, 6, 0.3, 2.4, 1.5,
  JSON_OBJECT('C', 81, 'K', 92, 'folate', 57),
  JSON_OBJECT('potassium', 288, 'calcium', 43),
  TRUE, TRUE, TRUE, TRUE, TRUE,
  JSON_ARRAY(),
  JSON_ARRAY('lunch', 'dinner'),
  JSON_ARRAY('weight_loss', 'health', 'immune_support'),
  10, 'low', JSON_ARRAY('low_calorie', 'fiber', 'nutrient_dense'), 82,
  '/images/nutrition/broccoli/main.jpg',
  '/images/nutrition/broccoli/thumbnail.jpg',
  TRUE, 1, NOW(), NOW()
);

-- 11. Banana
INSERT IGNORE INTO nutrition_items (
  foodId, name, slug, category, servingSize,
  calories, protein, carbs, fats, fiber, sugar,
  vitamins, minerals,
  isVegetarian, isVegan, isGlutenFree, isDairyFree, isKeto,
  allergens, mealTypes, goals,
  preparationTime, cost, tags, popularityScore,
  imageUrl, thumbnailUrl, isActive, createdBy, createdAt, updatedAt
) VALUES (
  'food_011', 'Banana', 'banana', 'fruits', '1 medium (118g)',
  105, 1.3, 27, 0.4, 3.1, 14,
  JSON_OBJECT('B6', 0.4, 'C', 10),
  JSON_OBJECT('potassium', 422, 'magnesium', 32),
  TRUE, TRUE, TRUE, TRUE, FALSE,
  JSON_ARRAY(),
  JSON_ARRAY('breakfast', 'snack', 'pre_workout', 'post_workout'),
  JSON_ARRAY('endurance', 'energy', 'recovery'),
  0, 'low', JSON_ARRAY('quick_energy', 'potassium', 'portable'), 93,
  '/images/nutrition/banana/main.jpg',
  '/images/nutrition/banana/thumbnail.jpg',
  TRUE, 1, NOW(), NOW()
);

-- 12. Quinoa
INSERT IGNORE INTO nutrition_items (
  foodId, name, slug, category, servingSize,
  calories, protein, carbs, fats, fiber, sugar,
  vitamins, minerals,
  isVegetarian, isVegan, isGlutenFree, isDairyFree, isKeto,
  allergens, mealTypes, goals,
  preparationTime, cost, tags, popularityScore,
  imageUrl, thumbnailUrl, isActive, createdBy, createdAt, updatedAt
) VALUES (
  'food_012', 'Quinoa', 'quinoa', 'carbs', '1 cup cooked (185g)',
  222, 8, 39, 3.6, 5, 1.6,
  JSON_OBJECT('folate', 78, 'B6', 0.2),
  JSON_OBJECT('magnesium', 118, 'iron', 2.8, 'zinc', 2),
  TRUE, TRUE, TRUE, TRUE, FALSE,
  JSON_ARRAY(),
  JSON_ARRAY('lunch', 'dinner'),
  JSON_ARRAY('muscle_gain', 'endurance', 'vegetarian_protein'),
  20, 'medium', JSON_ARRAY('complete_protein', 'fiber', 'gluten_free'), 84,
  '/images/nutrition/quinoa/main.jpg',
  '/images/nutrition/quinoa/thumbnail.jpg',
  TRUE, 1, NOW(), NOW()
);

-- 13. Spinach
INSERT IGNORE INTO nutrition_items (
  foodId, name, slug, category, servingSize,
  calories, protein, carbs, fats, fiber, sugar,
  vitamins, minerals,
  isVegetarian, isVegan, isGlutenFree, isDairyFree, isKeto,
  allergens, mealTypes, goals,
  preparationTime, cost, tags, popularityScore,
  imageUrl, thumbnailUrl, isActive, createdBy, createdAt, updatedAt
) VALUES (
  'food_013', 'Spinach', 'spinach', 'vegetables', '1 cup raw (30g)',
  7, 0.9, 1.1, 0.1, 0.7, 0.1,
  JSON_OBJECT('K', 145, 'A', 141, 'folate', 58),
  JSON_OBJECT('iron', 0.8, 'calcium', 30, 'magnesium', 24),
  TRUE, TRUE, TRUE, TRUE, TRUE,
  JSON_ARRAY(),
  JSON_ARRAY('breakfast', 'lunch', 'dinner'),
  JSON_ARRAY('weight_loss', 'health', 'nutrient_density'),
  2, 'low', JSON_ARRAY('low_calorie', 'iron', 'versatile'), 80,
  '/images/nutrition/spinach/main.jpg',
  '/images/nutrition/spinach/thumbnail.jpg',
  TRUE, 1, NOW(), NOW()
);

-- 14. Whey Protein Shake
INSERT IGNORE INTO nutrition_items (
  foodId, name, slug, category, servingSize,
  calories, protein, carbs, fats, fiber, sugar,
  vitamins, minerals,
  isVegetarian, isVegan, isGlutenFree, isDairyFree, isKeto,
  allergens, mealTypes, goals,
  preparationTime, cost, tags, popularityScore,
  imageUrl, thumbnailUrl, isActive, createdBy, createdAt, updatedAt
) VALUES (
  'food_014', 'Whey Protein Shake', 'whey-protein-shake', 'protein', '1 scoop (30g)',
  120, 24, 3, 1.5, 0, 2,
  JSON_OBJECT('B12', 0.6, 'D', 2),
  JSON_OBJECT('calcium', 150, 'sodium', 50),
  TRUE, FALSE, TRUE, FALSE, TRUE,
  JSON_ARRAY('dairy'),
  JSON_ARRAY('post_workout', 'snack', 'breakfast'),
  JSON_ARRAY('muscle_gain', 'recovery', 'convenience'),
  2, 'medium', JSON_ARRAY('high_protein', 'fast_absorbing', 'convenient'), 88,
  '/images/nutrition/whey-protein-shake/main.jpg',
  '/images/nutrition/whey-protein-shake/thumbnail.jpg',
  TRUE, 1, NOW(), NOW()
);

-- 15. Peanut Butter
INSERT IGNORE INTO nutrition_items (
  foodId, name, slug, category, servingSize,
  calories, protein, carbs, fats, fiber, sugar,
  vitamins, minerals,
  isVegetarian, isVegan, isGlutenFree, isDairyFree, isKeto,
  allergens, mealTypes, goals,
  preparationTime, cost, tags, popularityScore,
  imageUrl, thumbnailUrl, isActive, createdBy, createdAt, updatedAt
) VALUES (
  'food_015', 'Peanut Butter', 'peanut-butter', 'fats', '2 tablespoons (32g)',
  188, 8, 7, 16, 2, 3,
  JSON_OBJECT('E', 2.9, 'B3', 4.3),
  JSON_OBJECT('magnesium', 49, 'phosphorus', 107, 'potassium', 189),
  TRUE, TRUE, TRUE, TRUE, FALSE,
  JSON_ARRAY('peanuts'),
  JSON_ARRAY('breakfast', 'snack', 'pre_workout'),
  JSON_ARRAY('muscle_gain', 'energy', 'convenience'),
  0, 'low', JSON_ARRAY('protein', 'healthy_fats', 'versatile'), 90,
  '/images/nutrition/peanut-butter/main.jpg',
  '/images/nutrition/peanut-butter/thumbnail.jpg',
  TRUE, 1, NOW(), NOW()
);

-- ============================================
-- Verification Query
-- ============================================
SELECT 
  COUNT(*) as total_foods,
  SUM(CASE WHEN isVegetarian = TRUE THEN 1 ELSE 0 END) as vegetarian_count,
  SUM(CASE WHEN isVegan = TRUE THEN 1 ELSE 0 END) as vegan_count,
  SUM(CASE WHEN isKeto = TRUE THEN 1 ELSE 0 END) as keto_count,
  SUM(CASE WHEN isGlutenFree = TRUE THEN 1 ELSE 0 END) as gluten_free_count
FROM nutrition_items;
