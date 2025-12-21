-- ============================================
-- Comprehensive Nutrition Database - 100 Food Items
-- Generated: 2025-12-11T05:06:35.396Z
-- Run: mysql -u root -p arif_workout < nutrition-seed-comprehensive.sql
-- ============================================

INSERT IGNORE INTO nutrition_items (
  foodId, name, slug, category, servingSize,
  calories, protein, carbs, fats, fiber, sugar,
  vitamins, minerals,
  isVegetarian, isVegan, isGlutenFree, isDairyFree, isKeto,
  allergens, mealTypes, goals, tags,
  preparationTime, cost, popularityScore,
  imageUrl, thumbnailUrl, isActive, createdBy, createdAt, updatedAt
) VALUES (
  'food_001', 'Grilled Chicken Breast', 'grilled-chicken-breast', 'protein', '100g',
  165, 31, 0, 3.6, 0, 0,
  JSON_OBJECT(), JSON_OBJECT(),
  FALSE, FALSE, TRUE, TRUE, TRUE,
  JSON_ARRAY(), JSON_ARRAY('lunch', 'dinner'), JSON_ARRAY('muscle_gain'), JSON_ARRAY('high_protein', 'lean'),
  0, 'low', 95,
  '/images/nutrition/grilled-chicken-breast/main.jpg', '/images/nutrition/grilled-chicken-breast/thumbnail.jpg',
  TRUE, 1, NOW(), NOW()
);

INSERT IGNORE INTO nutrition_items (
  foodId, name, slug, category, servingSize,
  calories, protein, carbs, fats, fiber, sugar,
  vitamins, minerals,
  isVegetarian, isVegan, isGlutenFree, isDairyFree, isKeto,
  allergens, mealTypes, goals, tags,
  preparationTime, cost, popularityScore,
  imageUrl, thumbnailUrl, isActive, createdBy, createdAt, updatedAt
) VALUES (
  'food_002', 'Turkey Breast', 'turkey-breast', 'protein', '100g',
  135, 30, 0, 1, 0, 0,
  JSON_OBJECT(), JSON_OBJECT(),
  FALSE, FALSE, TRUE, TRUE, TRUE,
  JSON_ARRAY(), JSON_ARRAY('lunch', 'dinner'), JSON_ARRAY('muscle_gain'), JSON_ARRAY('high_protein', 'low_fat'),
  0, 'low', 88,
  '/images/nutrition/turkey-breast/main.jpg', '/images/nutrition/turkey-breast/thumbnail.jpg',
  TRUE, 1, NOW(), NOW()
);

INSERT IGNORE INTO nutrition_items (
  foodId, name, slug, category, servingSize,
  calories, protein, carbs, fats, fiber, sugar,
  vitamins, minerals,
  isVegetarian, isVegan, isGlutenFree, isDairyFree, isKeto,
  allergens, mealTypes, goals, tags,
  preparationTime, cost, popularityScore,
  imageUrl, thumbnailUrl, isActive, createdBy, createdAt, updatedAt
) VALUES (
  'food_003', 'Chicken Thigh', 'chicken-thigh', 'protein', '100g',
  209, 26, 0, 11, 0, 0,
  JSON_OBJECT(), JSON_OBJECT(),
  FALSE, FALSE, TRUE, TRUE, TRUE,
  JSON_ARRAY(), JSON_ARRAY('lunch', 'dinner'), JSON_ARRAY('muscle_gain'), JSON_ARRAY('protein'),
  0, 'low', 85,
  '/images/nutrition/chicken-thigh/main.jpg', '/images/nutrition/chicken-thigh/thumbnail.jpg',
  TRUE, 1, NOW(), NOW()
);

INSERT IGNORE INTO nutrition_items (
  foodId, name, slug, category, servingSize,
  calories, protein, carbs, fats, fiber, sugar,
  vitamins, minerals,
  isVegetarian, isVegan, isGlutenFree, isDairyFree, isKeto,
  allergens, mealTypes, goals, tags,
  preparationTime, cost, popularityScore,
  imageUrl, thumbnailUrl, isActive, createdBy, createdAt, updatedAt
) VALUES (
  'food_004', 'Salmon Fillet', 'salmon-fillet', 'protein', '100g',
  206, 22, 0, 13, 0, 0,
  JSON_OBJECT(), JSON_OBJECT(),
  FALSE, FALSE, TRUE, TRUE, TRUE,
  JSON_ARRAY(), JSON_ARRAY('lunch', 'dinner'), JSON_ARRAY('muscle_gain'), JSON_ARRAY('omega3', 'healthy_fats'),
  0, 'low', 92,
  '/images/nutrition/salmon-fillet/main.jpg', '/images/nutrition/salmon-fillet/thumbnail.jpg',
  TRUE, 1, NOW(), NOW()
);

INSERT IGNORE INTO nutrition_items (
  foodId, name, slug, category, servingSize,
  calories, protein, carbs, fats, fiber, sugar,
  vitamins, minerals,
  isVegetarian, isVegan, isGlutenFree, isDairyFree, isKeto,
  allergens, mealTypes, goals, tags,
  preparationTime, cost, popularityScore,
  imageUrl, thumbnailUrl, isActive, createdBy, createdAt, updatedAt
) VALUES (
  'food_005', 'Tuna (canned)', 'tuna-canned-', 'protein', '100g',
  116, 26, 0, 1, 0, 0,
  JSON_OBJECT(), JSON_OBJECT(),
  FALSE, FALSE, TRUE, TRUE, TRUE,
  JSON_ARRAY(), JSON_ARRAY('lunch', 'dinner'), JSON_ARRAY('muscle_gain'), JSON_ARRAY('high_protein', 'convenient'),
  0, 'low', 90,
  '/images/nutrition/tuna-canned-/main.jpg', '/images/nutrition/tuna-canned-/thumbnail.jpg',
  TRUE, 1, NOW(), NOW()
);

INSERT IGNORE INTO nutrition_items (
  foodId, name, slug, category, servingSize,
  calories, protein, carbs, fats, fiber, sugar,
  vitamins, minerals,
  isVegetarian, isVegan, isGlutenFree, isDairyFree, isKeto,
  allergens, mealTypes, goals, tags,
  preparationTime, cost, popularityScore,
  imageUrl, thumbnailUrl, isActive, createdBy, createdAt, updatedAt
) VALUES (
  'food_006', 'Cod', 'cod', 'protein', '100g',
  82, 18, 0, 0.7, 0, 0,
  JSON_OBJECT(), JSON_OBJECT(),
  FALSE, FALSE, TRUE, TRUE, TRUE,
  JSON_ARRAY(), JSON_ARRAY('lunch', 'dinner'), JSON_ARRAY('weight_loss'), JSON_ARRAY('lean', 'low_fat'),
  0, 'low', 80,
  '/images/nutrition/cod/main.jpg', '/images/nutrition/cod/thumbnail.jpg',
  TRUE, 1, NOW(), NOW()
);

INSERT IGNORE INTO nutrition_items (
  foodId, name, slug, category, servingSize,
  calories, protein, carbs, fats, fiber, sugar,
  vitamins, minerals,
  isVegetarian, isVegan, isGlutenFree, isDairyFree, isKeto,
  allergens, mealTypes, goals, tags,
  preparationTime, cost, popularityScore,
  imageUrl, thumbnailUrl, isActive, createdBy, createdAt, updatedAt
) VALUES (
  'food_007', 'Shrimp', 'shrimp', 'protein', '100g',
  99, 24, 0.2, 0.3, 0, 0,
  JSON_OBJECT(), JSON_OBJECT(),
  FALSE, FALSE, TRUE, TRUE, TRUE,
  JSON_ARRAY(), JSON_ARRAY('lunch', 'dinner'), JSON_ARRAY('muscle_gain'), JSON_ARRAY('high_protein', 'low_calorie'),
  0, 'low', 85,
  '/images/nutrition/shrimp/main.jpg', '/images/nutrition/shrimp/thumbnail.jpg',
  TRUE, 1, NOW(), NOW()
);

INSERT IGNORE INTO nutrition_items (
  foodId, name, slug, category, servingSize,
  calories, protein, carbs, fats, fiber, sugar,
  vitamins, minerals,
  isVegetarian, isVegan, isGlutenFree, isDairyFree, isKeto,
  allergens, mealTypes, goals, tags,
  preparationTime, cost, popularityScore,
  imageUrl, thumbnailUrl, isActive, createdBy, createdAt, updatedAt
) VALUES (
  'food_008', 'Tilapia', 'tilapia', 'protein', '100g',
  128, 26, 0, 2.7, 0, 0,
  JSON_OBJECT(), JSON_OBJECT(),
  FALSE, FALSE, TRUE, TRUE, TRUE,
  JSON_ARRAY(), JSON_ARRAY('lunch', 'dinner'), JSON_ARRAY('muscle_gain'), JSON_ARRAY('lean', 'affordable'),
  0, 'low', 82,
  '/images/nutrition/tilapia/main.jpg', '/images/nutrition/tilapia/thumbnail.jpg',
  TRUE, 1, NOW(), NOW()
);

INSERT IGNORE INTO nutrition_items (
  foodId, name, slug, category, servingSize,
  calories, protein, carbs, fats, fiber, sugar,
  vitamins, minerals,
  isVegetarian, isVegan, isGlutenFree, isDairyFree, isKeto,
  allergens, mealTypes, goals, tags,
  preparationTime, cost, popularityScore,
  imageUrl, thumbnailUrl, isActive, createdBy, createdAt, updatedAt
) VALUES (
  'food_009', 'Lean Beef (90/10)', 'lean-beef-90-10-', 'protein', '100g',
  176, 26, 0, 8, 0, 0,
  JSON_OBJECT(), JSON_OBJECT(),
  FALSE, FALSE, TRUE, TRUE, TRUE,
  JSON_ARRAY(), JSON_ARRAY('lunch', 'dinner'), JSON_ARRAY('muscle_gain'), JSON_ARRAY('high_protein', 'iron_rich'),
  0, 'low', 88,
  '/images/nutrition/lean-beef-90-10-/main.jpg', '/images/nutrition/lean-beef-90-10-/thumbnail.jpg',
  TRUE, 1, NOW(), NOW()
);

INSERT IGNORE INTO nutrition_items (
  foodId, name, slug, category, servingSize,
  calories, protein, carbs, fats, fiber, sugar,
  vitamins, minerals,
  isVegetarian, isVegan, isGlutenFree, isDairyFree, isKeto,
  allergens, mealTypes, goals, tags,
  preparationTime, cost, popularityScore,
  imageUrl, thumbnailUrl, isActive, createdBy, createdAt, updatedAt
) VALUES (
  'food_010', 'Ground Turkey', 'ground-turkey', 'protein', '100g',
  150, 28, 0, 4, 0, 0,
  JSON_OBJECT(), JSON_OBJECT(),
  FALSE, FALSE, TRUE, TRUE, TRUE,
  JSON_ARRAY(), JSON_ARRAY('lunch', 'dinner'), JSON_ARRAY('muscle_gain'), JSON_ARRAY('lean', 'versatile'),
  0, 'low', 85,
  '/images/nutrition/ground-turkey/main.jpg', '/images/nutrition/ground-turkey/thumbnail.jpg',
  TRUE, 1, NOW(), NOW()
);

INSERT IGNORE INTO nutrition_items (
  foodId, name, slug, category, servingSize,
  calories, protein, carbs, fats, fiber, sugar,
  vitamins, minerals,
  isVegetarian, isVegan, isGlutenFree, isDairyFree, isKeto,
  allergens, mealTypes, goals, tags,
  preparationTime, cost, popularityScore,
  imageUrl, thumbnailUrl, isActive, createdBy, createdAt, updatedAt
) VALUES (
  'food_011', 'Pork Tenderloin', 'pork-tenderloin', 'protein', '100g',
  143, 26, 0, 3.5, 0, 0,
  JSON_OBJECT(), JSON_OBJECT(),
  FALSE, FALSE, TRUE, TRUE, TRUE,
  JSON_ARRAY(), JSON_ARRAY('lunch', 'dinner'), JSON_ARRAY('muscle_gain'), JSON_ARRAY('lean', 'tender'),
  0, 'low', 80,
  '/images/nutrition/pork-tenderloin/main.jpg', '/images/nutrition/pork-tenderloin/thumbnail.jpg',
  TRUE, 1, NOW(), NOW()
);

INSERT IGNORE INTO nutrition_items (
  foodId, name, slug, category, servingSize,
  calories, protein, carbs, fats, fiber, sugar,
  vitamins, minerals,
  isVegetarian, isVegan, isGlutenFree, isDairyFree, isKeto,
  allergens, mealTypes, goals, tags,
  preparationTime, cost, popularityScore,
  imageUrl, thumbnailUrl, isActive, createdBy, createdAt, updatedAt
) VALUES (
  'food_012', 'Whole Eggs', 'whole-eggs', 'protein', '2 large',
  143, 13, 1, 10, 0, 0.4,
  JSON_OBJECT(), JSON_OBJECT(),
  TRUE, FALSE, TRUE, TRUE, TRUE,
  JSON_ARRAY(), JSON_ARRAY('lunch', 'dinner'), JSON_ARRAY('maintenance'), JSON_ARRAY('complete_protein', 'versatile'),
  0, 'low', 95,
  '/images/nutrition/whole-eggs/main.jpg', '/images/nutrition/whole-eggs/thumbnail.jpg',
  TRUE, 1, NOW(), NOW()
);

INSERT IGNORE INTO nutrition_items (
  foodId, name, slug, category, servingSize,
  calories, protein, carbs, fats, fiber, sugar,
  vitamins, minerals,
  isVegetarian, isVegan, isGlutenFree, isDairyFree, isKeto,
  allergens, mealTypes, goals, tags,
  preparationTime, cost, popularityScore,
  imageUrl, thumbnailUrl, isActive, createdBy, createdAt, updatedAt
) VALUES (
  'food_013', 'Egg Whites', 'egg-whites', 'protein', '100g',
  52, 11, 0.7, 0.2, 0, 0.7,
  JSON_OBJECT(), JSON_OBJECT(),
  TRUE, FALSE, TRUE, TRUE, TRUE,
  JSON_ARRAY(), JSON_ARRAY('lunch', 'dinner'), JSON_ARRAY('weight_loss'), JSON_ARRAY('high_protein', 'low_fat'),
  0, 'low', 88,
  '/images/nutrition/egg-whites/main.jpg', '/images/nutrition/egg-whites/thumbnail.jpg',
  TRUE, 1, NOW(), NOW()
);

INSERT IGNORE INTO nutrition_items (
  foodId, name, slug, category, servingSize,
  calories, protein, carbs, fats, fiber, sugar,
  vitamins, minerals,
  isVegetarian, isVegan, isGlutenFree, isDairyFree, isKeto,
  allergens, mealTypes, goals, tags,
  preparationTime, cost, popularityScore,
  imageUrl, thumbnailUrl, isActive, createdBy, createdAt, updatedAt
) VALUES (
  'food_014', 'Greek Yogurt (non-fat)', 'greek-yogurt-non-fat-', 'protein', '170g',
  100, 17, 6, 0.7, 0, 6,
  JSON_OBJECT(), JSON_OBJECT(),
  TRUE, FALSE, TRUE, TRUE, FALSE,
  JSON_ARRAY(), JSON_ARRAY('lunch', 'dinner'), JSON_ARRAY('maintenance'), JSON_ARRAY('high_protein', 'probiotic'),
  0, 'low', 92,
  '/images/nutrition/greek-yogurt-non-fat-/main.jpg', '/images/nutrition/greek-yogurt-non-fat-/thumbnail.jpg',
  TRUE, 1, NOW(), NOW()
);

INSERT IGNORE INTO nutrition_items (
  foodId, name, slug, category, servingSize,
  calories, protein, carbs, fats, fiber, sugar,
  vitamins, minerals,
  isVegetarian, isVegan, isGlutenFree, isDairyFree, isKeto,
  allergens, mealTypes, goals, tags,
  preparationTime, cost, popularityScore,
  imageUrl, thumbnailUrl, isActive, createdBy, createdAt, updatedAt
) VALUES (
  'food_015', 'Cottage Cheese (low-fat)', 'cottage-cheese-low-fat-', 'protein', '100g',
  72, 12, 3.4, 1, 0, 2.7,
  JSON_OBJECT(), JSON_OBJECT(),
  TRUE, FALSE, TRUE, TRUE, FALSE,
  JSON_ARRAY(), JSON_ARRAY('lunch', 'dinner'), JSON_ARRAY('weight_loss'), JSON_ARRAY('high_protein', 'low_fat'),
  0, 'low', 85,
  '/images/nutrition/cottage-cheese-low-fat-/main.jpg', '/images/nutrition/cottage-cheese-low-fat-/thumbnail.jpg',
  TRUE, 1, NOW(), NOW()
);

INSERT IGNORE INTO nutrition_items (
  foodId, name, slug, category, servingSize,
  calories, protein, carbs, fats, fiber, sugar,
  vitamins, minerals,
  isVegetarian, isVegan, isGlutenFree, isDairyFree, isKeto,
  allergens, mealTypes, goals, tags,
  preparationTime, cost, popularityScore,
  imageUrl, thumbnailUrl, isActive, createdBy, createdAt, updatedAt
) VALUES (
  'food_016', 'Tofu (firm)', 'tofu-firm-', 'protein', '100g',
  144, 17, 3, 9, 2, 0.7,
  JSON_OBJECT(), JSON_OBJECT(),
  TRUE, TRUE, TRUE, TRUE, TRUE,
  JSON_ARRAY(), JSON_ARRAY('lunch', 'dinner'), JSON_ARRAY('maintenance'), JSON_ARRAY('plant_protein', 'versatile'),
  0, 'low', 82,
  '/images/nutrition/tofu-firm-/main.jpg', '/images/nutrition/tofu-firm-/thumbnail.jpg',
  TRUE, 1, NOW(), NOW()
);

INSERT IGNORE INTO nutrition_items (
  foodId, name, slug, category, servingSize,
  calories, protein, carbs, fats, fiber, sugar,
  vitamins, minerals,
  isVegetarian, isVegan, isGlutenFree, isDairyFree, isKeto,
  allergens, mealTypes, goals, tags,
  preparationTime, cost, popularityScore,
  imageUrl, thumbnailUrl, isActive, createdBy, createdAt, updatedAt
) VALUES (
  'food_017', 'Tempeh', 'tempeh', 'protein', '100g',
  193, 20, 9, 11, 0, 0,
  JSON_OBJECT(), JSON_OBJECT(),
  TRUE, TRUE, TRUE, TRUE, FALSE,
  JSON_ARRAY(), JSON_ARRAY('lunch', 'dinner'), JSON_ARRAY('muscle_gain'), JSON_ARRAY('plant_protein', 'fermented'),
  0, 'low', 78,
  '/images/nutrition/tempeh/main.jpg', '/images/nutrition/tempeh/thumbnail.jpg',
  TRUE, 1, NOW(), NOW()
);

INSERT IGNORE INTO nutrition_items (
  foodId, name, slug, category, servingSize,
  calories, protein, carbs, fats, fiber, sugar,
  vitamins, minerals,
  isVegetarian, isVegan, isGlutenFree, isDairyFree, isKeto,
  allergens, mealTypes, goals, tags,
  preparationTime, cost, popularityScore,
  imageUrl, thumbnailUrl, isActive, createdBy, createdAt, updatedAt
) VALUES (
  'food_018', 'Edamame', 'edamame', 'protein', '100g',
  122, 11, 10, 5, 5, 2,
  JSON_OBJECT(), JSON_OBJECT(),
  TRUE, TRUE, TRUE, TRUE, FALSE,
  JSON_ARRAY(), JSON_ARRAY('lunch', 'dinner'), JSON_ARRAY('maintenance'), JSON_ARRAY('plant_protein', 'fiber'),
  0, 'low', 80,
  '/images/nutrition/edamame/main.jpg', '/images/nutrition/edamame/thumbnail.jpg',
  TRUE, 1, NOW(), NOW()
);

INSERT IGNORE INTO nutrition_items (
  foodId, name, slug, category, servingSize,
  calories, protein, carbs, fats, fiber, sugar,
  vitamins, minerals,
  isVegetarian, isVegan, isGlutenFree, isDairyFree, isKeto,
  allergens, mealTypes, goals, tags,
  preparationTime, cost, popularityScore,
  imageUrl, thumbnailUrl, isActive, createdBy, createdAt, updatedAt
) VALUES (
  'food_019', 'Black Beans', 'black-beans', 'protein', '100g',
  132, 9, 24, 0.5, 9, 0.3,
  JSON_OBJECT(), JSON_OBJECT(),
  TRUE, TRUE, TRUE, TRUE, FALSE,
  JSON_ARRAY(), JSON_ARRAY('lunch', 'dinner'), JSON_ARRAY('maintenance'), JSON_ARRAY('plant_protein', 'fiber'),
  0, 'low', 85,
  '/images/nutrition/black-beans/main.jpg', '/images/nutrition/black-beans/thumbnail.jpg',
  TRUE, 1, NOW(), NOW()
);

INSERT IGNORE INTO nutrition_items (
  foodId, name, slug, category, servingSize,
  calories, protein, carbs, fats, fiber, sugar,
  vitamins, minerals,
  isVegetarian, isVegan, isGlutenFree, isDairyFree, isKeto,
  allergens, mealTypes, goals, tags,
  preparationTime, cost, popularityScore,
  imageUrl, thumbnailUrl, isActive, createdBy, createdAt, updatedAt
) VALUES (
  'food_020', 'Chickpeas', 'chickpeas', 'protein', '100g',
  164, 9, 27, 2.6, 7.6, 4.8,
  JSON_OBJECT(), JSON_OBJECT(),
  TRUE, TRUE, TRUE, TRUE, FALSE,
  JSON_ARRAY(), JSON_ARRAY('lunch', 'dinner'), JSON_ARRAY('maintenance'), JSON_ARRAY('plant_protein', 'versatile'),
  0, 'low', 88,
  '/images/nutrition/chickpeas/main.jpg', '/images/nutrition/chickpeas/thumbnail.jpg',
  TRUE, 1, NOW(), NOW()
);

INSERT IGNORE INTO nutrition_items (
  foodId, name, slug, category, servingSize,
  calories, protein, carbs, fats, fiber, sugar,
  vitamins, minerals,
  isVegetarian, isVegan, isGlutenFree, isDairyFree, isKeto,
  allergens, mealTypes, goals, tags,
  preparationTime, cost, popularityScore,
  imageUrl, thumbnailUrl, isActive, createdBy, createdAt, updatedAt
) VALUES (
  'food_021', 'Lentils', 'lentils', 'protein', '100g',
  116, 9, 20, 0.4, 8, 1.8,
  JSON_OBJECT(), JSON_OBJECT(),
  TRUE, TRUE, TRUE, TRUE, FALSE,
  JSON_ARRAY(), JSON_ARRAY('lunch', 'dinner'), JSON_ARRAY('maintenance'), JSON_ARRAY('plant_protein', 'iron_rich'),
  0, 'low', 85,
  '/images/nutrition/lentils/main.jpg', '/images/nutrition/lentils/thumbnail.jpg',
  TRUE, 1, NOW(), NOW()
);

INSERT IGNORE INTO nutrition_items (
  foodId, name, slug, category, servingSize,
  calories, protein, carbs, fats, fiber, sugar,
  vitamins, minerals,
  isVegetarian, isVegan, isGlutenFree, isDairyFree, isKeto,
  allergens, mealTypes, goals, tags,
  preparationTime, cost, popularityScore,
  imageUrl, thumbnailUrl, isActive, createdBy, createdAt, updatedAt
) VALUES (
  'food_022', 'Almonds', 'almonds', 'protein', '28g',
  164, 6, 6, 14, 3.5, 1,
  JSON_OBJECT(), JSON_OBJECT(),
  TRUE, TRUE, TRUE, TRUE, TRUE,
  JSON_ARRAY(), JSON_ARRAY('lunch', 'dinner'), JSON_ARRAY('maintenance'), JSON_ARRAY('healthy_fats', 'portable'),
  0, 'low', 90,
  '/images/nutrition/almonds/main.jpg', '/images/nutrition/almonds/thumbnail.jpg',
  TRUE, 1, NOW(), NOW()
);

INSERT IGNORE INTO nutrition_items (
  foodId, name, slug, category, servingSize,
  calories, protein, carbs, fats, fiber, sugar,
  vitamins, minerals,
  isVegetarian, isVegan, isGlutenFree, isDairyFree, isKeto,
  allergens, mealTypes, goals, tags,
  preparationTime, cost, popularityScore,
  imageUrl, thumbnailUrl, isActive, createdBy, createdAt, updatedAt
) VALUES (
  'food_023', 'Peanut Butter', 'peanut-butter', 'protein', '2 tbsp',
  188, 8, 7, 16, 2, 3,
  JSON_OBJECT(), JSON_OBJECT(),
  TRUE, TRUE, TRUE, TRUE, FALSE,
  JSON_ARRAY(), JSON_ARRAY('lunch', 'dinner'), JSON_ARRAY('maintenance'), JSON_ARRAY('protein', 'versatile'),
  0, 'low', 92,
  '/images/nutrition/peanut-butter/main.jpg', '/images/nutrition/peanut-butter/thumbnail.jpg',
  TRUE, 1, NOW(), NOW()
);

INSERT IGNORE INTO nutrition_items (
  foodId, name, slug, category, servingSize,
  calories, protein, carbs, fats, fiber, sugar,
  vitamins, minerals,
  isVegetarian, isVegan, isGlutenFree, isDairyFree, isKeto,
  allergens, mealTypes, goals, tags,
  preparationTime, cost, popularityScore,
  imageUrl, thumbnailUrl, isActive, createdBy, createdAt, updatedAt
) VALUES (
  'food_024', 'Whey Protein Isolate', 'whey-protein-isolate', 'protein', '30g',
  110, 25, 1, 0.5, 0, 0,
  JSON_OBJECT(), JSON_OBJECT(),
  TRUE, FALSE, TRUE, TRUE, TRUE,
  JSON_ARRAY(), JSON_ARRAY('lunch', 'dinner'), JSON_ARRAY('muscle_gain'), JSON_ARRAY('high_protein', 'convenient'),
  0, 'low', 90,
  '/images/nutrition/whey-protein-isolate/main.jpg', '/images/nutrition/whey-protein-isolate/thumbnail.jpg',
  TRUE, 1, NOW(), NOW()
);

INSERT IGNORE INTO nutrition_items (
  foodId, name, slug, category, servingSize,
  calories, protein, carbs, fats, fiber, sugar,
  vitamins, minerals,
  isVegetarian, isVegan, isGlutenFree, isDairyFree, isKeto,
  allergens, mealTypes, goals, tags,
  preparationTime, cost, popularityScore,
  imageUrl, thumbnailUrl, isActive, createdBy, createdAt, updatedAt
) VALUES (
  'food_025', 'Pea Protein', 'pea-protein', 'protein', '30g',
  120, 24, 2, 2, 0, 0,
  JSON_OBJECT(), JSON_OBJECT(),
  TRUE, TRUE, TRUE, TRUE, TRUE,
  JSON_ARRAY(), JSON_ARRAY('lunch', 'dinner'), JSON_ARRAY('muscle_gain'), JSON_ARRAY('plant_protein'),
  0, 'low', 78,
  '/images/nutrition/pea-protein/main.jpg', '/images/nutrition/pea-protein/thumbnail.jpg',
  TRUE, 1, NOW(), NOW()
);

INSERT IGNORE INTO nutrition_items (
  foodId, name, slug, category, servingSize,
  calories, protein, carbs, fats, fiber, sugar,
  vitamins, minerals,
  isVegetarian, isVegan, isGlutenFree, isDairyFree, isKeto,
  allergens, mealTypes, goals, tags,
  preparationTime, cost, popularityScore,
  imageUrl, thumbnailUrl, isActive, createdBy, createdAt, updatedAt
) VALUES (
  'food_026', 'Brown Rice', 'brown-rice', 'carbs', '1 cup cooked',
  218, 5, 45, 1.6, 3.5, 0.7,
  JSON_OBJECT(), JSON_OBJECT(),
  TRUE, TRUE, TRUE, TRUE, FALSE,
  JSON_ARRAY(), JSON_ARRAY('breakfast', 'lunch', 'dinner'), JSON_ARRAY('maintenance'), JSON_ARRAY('whole_grain', 'complex_carbs'),
  0, 'low', 90,
  '/images/nutrition/brown-rice/main.jpg', '/images/nutrition/brown-rice/thumbnail.jpg',
  TRUE, 1, NOW(), NOW()
);

INSERT IGNORE INTO nutrition_items (
  foodId, name, slug, category, servingSize,
  calories, protein, carbs, fats, fiber, sugar,
  vitamins, minerals,
  isVegetarian, isVegan, isGlutenFree, isDairyFree, isKeto,
  allergens, mealTypes, goals, tags,
  preparationTime, cost, popularityScore,
  imageUrl, thumbnailUrl, isActive, createdBy, createdAt, updatedAt
) VALUES (
  'food_027', 'White Rice', 'white-rice', 'carbs', '1 cup cooked',
  205, 4.2, 45, 0.4, 0.6, 0.1,
  JSON_OBJECT(), JSON_OBJECT(),
  TRUE, TRUE, TRUE, TRUE, FALSE,
  JSON_ARRAY(), JSON_ARRAY('breakfast', 'lunch', 'dinner'), JSON_ARRAY('maintenance'), JSON_ARRAY('quick_energy'),
  0, 'low', 88,
  '/images/nutrition/white-rice/main.jpg', '/images/nutrition/white-rice/thumbnail.jpg',
  TRUE, 1, NOW(), NOW()
);

INSERT IGNORE INTO nutrition_items (
  foodId, name, slug, category, servingSize,
  calories, protein, carbs, fats, fiber, sugar,
  vitamins, minerals,
  isVegetarian, isVegan, isGlutenFree, isDairyFree, isKeto,
  allergens, mealTypes, goals, tags,
  preparationTime, cost, popularityScore,
  imageUrl, thumbnailUrl, isActive, createdBy, createdAt, updatedAt
) VALUES (
  'food_028', 'Quinoa', 'quinoa', 'carbs', '1 cup cooked',
  222, 8, 39, 3.6, 5, 1.6,
  JSON_OBJECT(), JSON_OBJECT(),
  TRUE, TRUE, TRUE, TRUE, FALSE,
  JSON_ARRAY(), JSON_ARRAY('breakfast', 'lunch', 'dinner'), JSON_ARRAY('maintenance'), JSON_ARRAY('complete_protein', 'fiber'),
  0, 'low', 85,
  '/images/nutrition/quinoa/main.jpg', '/images/nutrition/quinoa/thumbnail.jpg',
  TRUE, 1, NOW(), NOW()
);

INSERT IGNORE INTO nutrition_items (
  foodId, name, slug, category, servingSize,
  calories, protein, carbs, fats, fiber, sugar,
  vitamins, minerals,
  isVegetarian, isVegan, isGlutenFree, isDairyFree, isKeto,
  allergens, mealTypes, goals, tags,
  preparationTime, cost, popularityScore,
  imageUrl, thumbnailUrl, isActive, createdBy, createdAt, updatedAt
) VALUES (
  'food_029', 'Oatmeal', 'oatmeal', 'carbs', '1 cup cooked',
  166, 6, 28, 3.6, 4, 0.6,
  JSON_OBJECT(), JSON_OBJECT(),
  TRUE, TRUE, FALSE, TRUE, FALSE,
  JSON_ARRAY(), JSON_ARRAY('breakfast', 'lunch', 'dinner'), JSON_ARRAY('maintenance'), JSON_ARRAY('whole_grain', 'fiber'),
  0, 'low', 92,
  '/images/nutrition/oatmeal/main.jpg', '/images/nutrition/oatmeal/thumbnail.jpg',
  TRUE, 1, NOW(), NOW()
);

INSERT IGNORE INTO nutrition_items (
  foodId, name, slug, category, servingSize,
  calories, protein, carbs, fats, fiber, sugar,
  vitamins, minerals,
  isVegetarian, isVegan, isGlutenFree, isDairyFree, isKeto,
  allergens, mealTypes, goals, tags,
  preparationTime, cost, popularityScore,
  imageUrl, thumbnailUrl, isActive, createdBy, createdAt, updatedAt
) VALUES (
  'food_030', 'Whole Wheat Pasta', 'whole-wheat-pasta', 'carbs', '1 cup cooked',
  174, 7.5, 37, 0.8, 6.3, 1,
  JSON_OBJECT(), JSON_OBJECT(),
  TRUE, TRUE, FALSE, TRUE, FALSE,
  JSON_ARRAY(), JSON_ARRAY('breakfast', 'lunch', 'dinner'), JSON_ARRAY('maintenance'), JSON_ARRAY('whole_grain'),
  0, 'low', 85,
  '/images/nutrition/whole-wheat-pasta/main.jpg', '/images/nutrition/whole-wheat-pasta/thumbnail.jpg',
  TRUE, 1, NOW(), NOW()
);

INSERT IGNORE INTO nutrition_items (
  foodId, name, slug, category, servingSize,
  calories, protein, carbs, fats, fiber, sugar,
  vitamins, minerals,
  isVegetarian, isVegan, isGlutenFree, isDairyFree, isKeto,
  allergens, mealTypes, goals, tags,
  preparationTime, cost, popularityScore,
  imageUrl, thumbnailUrl, isActive, createdBy, createdAt, updatedAt
) VALUES (
  'food_031', 'Whole Wheat Bread', 'whole-wheat-bread', 'carbs', '1 slice',
  69, 3.6, 12, 0.9, 1.9, 1.4,
  JSON_OBJECT(), JSON_OBJECT(),
  TRUE, TRUE, FALSE, TRUE, FALSE,
  JSON_ARRAY(), JSON_ARRAY('breakfast', 'lunch', 'dinner'), JSON_ARRAY('weight_loss'), JSON_ARRAY('whole_grain'),
  0, 'low', 88,
  '/images/nutrition/whole-wheat-bread/main.jpg', '/images/nutrition/whole-wheat-bread/thumbnail.jpg',
  TRUE, 1, NOW(), NOW()
);

INSERT IGNORE INTO nutrition_items (
  foodId, name, slug, category, servingSize,
  calories, protein, carbs, fats, fiber, sugar,
  vitamins, minerals,
  isVegetarian, isVegan, isGlutenFree, isDairyFree, isKeto,
  allergens, mealTypes, goals, tags,
  preparationTime, cost, popularityScore,
  imageUrl, thumbnailUrl, isActive, createdBy, createdAt, updatedAt
) VALUES (
  'food_032', 'Sweet Potato', 'sweet-potato', 'carbs', '1 medium',
  112, 2, 26, 0.1, 4, 5,
  JSON_OBJECT(), JSON_OBJECT(),
  TRUE, TRUE, TRUE, TRUE, FALSE,
  JSON_ARRAY(), JSON_ARRAY('breakfast', 'lunch', 'dinner'), JSON_ARRAY('maintenance'), JSON_ARRAY('complex_carbs', 'nutrient_dense'),
  0, 'low', 90,
  '/images/nutrition/sweet-potato/main.jpg', '/images/nutrition/sweet-potato/thumbnail.jpg',
  TRUE, 1, NOW(), NOW()
);

INSERT IGNORE INTO nutrition_items (
  foodId, name, slug, category, servingSize,
  calories, protein, carbs, fats, fiber, sugar,
  vitamins, minerals,
  isVegetarian, isVegan, isGlutenFree, isDairyFree, isKeto,
  allergens, mealTypes, goals, tags,
  preparationTime, cost, popularityScore,
  imageUrl, thumbnailUrl, isActive, createdBy, createdAt, updatedAt
) VALUES (
  'food_033', 'White Potato', 'white-potato', 'carbs', '1 medium',
  161, 4.3, 37, 0.2, 4, 1.9,
  JSON_OBJECT(), JSON_OBJECT(),
  TRUE, TRUE, TRUE, TRUE, FALSE,
  JSON_ARRAY(), JSON_ARRAY('breakfast', 'lunch', 'dinner'), JSON_ARRAY('maintenance'), JSON_ARRAY('versatile'),
  0, 'low', 85,
  '/images/nutrition/white-potato/main.jpg', '/images/nutrition/white-potato/thumbnail.jpg',
  TRUE, 1, NOW(), NOW()
);

INSERT IGNORE INTO nutrition_items (
  foodId, name, slug, category, servingSize,
  calories, protein, carbs, fats, fiber, sugar,
  vitamins, minerals,
  isVegetarian, isVegan, isGlutenFree, isDairyFree, isKeto,
  allergens, mealTypes, goals, tags,
  preparationTime, cost, popularityScore,
  imageUrl, thumbnailUrl, isActive, createdBy, createdAt, updatedAt
) VALUES (
  'food_034', 'Banana', 'banana', 'fruits', '1 medium',
  105, 1.3, 27, 0.4, 3.1, 14,
  JSON_OBJECT(), JSON_OBJECT(),
  TRUE, TRUE, TRUE, TRUE, FALSE,
  JSON_ARRAY(), JSON_ARRAY('breakfast', 'snack'), JSON_ARRAY('maintenance'), JSON_ARRAY('quick_energy', 'potassium'),
  0, 'low', 95,
  '/images/nutrition/banana/main.jpg', '/images/nutrition/banana/thumbnail.jpg',
  TRUE, 1, NOW(), NOW()
);

INSERT IGNORE INTO nutrition_items (
  foodId, name, slug, category, servingSize,
  calories, protein, carbs, fats, fiber, sugar,
  vitamins, minerals,
  isVegetarian, isVegan, isGlutenFree, isDairyFree, isKeto,
  allergens, mealTypes, goals, tags,
  preparationTime, cost, popularityScore,
  imageUrl, thumbnailUrl, isActive, createdBy, createdAt, updatedAt
) VALUES (
  'food_035', 'Apple', 'apple', 'fruits', '1 medium',
  95, 0.5, 25, 0.3, 4.4, 19,
  JSON_OBJECT(), JSON_OBJECT(),
  TRUE, TRUE, TRUE, TRUE, FALSE,
  JSON_ARRAY(), JSON_ARRAY('breakfast', 'snack'), JSON_ARRAY('weight_loss'), JSON_ARRAY('fiber', 'portable'),
  0, 'low', 92,
  '/images/nutrition/apple/main.jpg', '/images/nutrition/apple/thumbnail.jpg',
  TRUE, 1, NOW(), NOW()
);

INSERT IGNORE INTO nutrition_items (
  foodId, name, slug, category, servingSize,
  calories, protein, carbs, fats, fiber, sugar,
  vitamins, minerals,
  isVegetarian, isVegan, isGlutenFree, isDairyFree, isKeto,
  allergens, mealTypes, goals, tags,
  preparationTime, cost, popularityScore,
  imageUrl, thumbnailUrl, isActive, createdBy, createdAt, updatedAt
) VALUES (
  'food_036', 'Orange', 'orange', 'fruits', '1 medium',
  62, 1.2, 15, 0.2, 3.1, 12,
  JSON_OBJECT(), JSON_OBJECT(),
  TRUE, TRUE, TRUE, TRUE, FALSE,
  JSON_ARRAY(), JSON_ARRAY('breakfast', 'snack'), JSON_ARRAY('weight_loss'), JSON_ARRAY('vitamin_c'),
  0, 'low', 88,
  '/images/nutrition/orange/main.jpg', '/images/nutrition/orange/thumbnail.jpg',
  TRUE, 1, NOW(), NOW()
);

INSERT IGNORE INTO nutrition_items (
  foodId, name, slug, category, servingSize,
  calories, protein, carbs, fats, fiber, sugar,
  vitamins, minerals,
  isVegetarian, isVegan, isGlutenFree, isDairyFree, isKeto,
  allergens, mealTypes, goals, tags,
  preparationTime, cost, popularityScore,
  imageUrl, thumbnailUrl, isActive, createdBy, createdAt, updatedAt
) VALUES (
  'food_037', 'Blueberries', 'blueberries', 'fruits', '1 cup',
  84, 1.1, 21, 0.5, 3.6, 15,
  JSON_OBJECT(), JSON_OBJECT(),
  TRUE, TRUE, TRUE, TRUE, FALSE,
  JSON_ARRAY(), JSON_ARRAY('breakfast', 'snack'), JSON_ARRAY('weight_loss'), JSON_ARRAY('antioxidants', 'superfood'),
  0, 'low', 90,
  '/images/nutrition/blueberries/main.jpg', '/images/nutrition/blueberries/thumbnail.jpg',
  TRUE, 1, NOW(), NOW()
);

INSERT IGNORE INTO nutrition_items (
  foodId, name, slug, category, servingSize,
  calories, protein, carbs, fats, fiber, sugar,
  vitamins, minerals,
  isVegetarian, isVegan, isGlutenFree, isDairyFree, isKeto,
  allergens, mealTypes, goals, tags,
  preparationTime, cost, popularityScore,
  imageUrl, thumbnailUrl, isActive, createdBy, createdAt, updatedAt
) VALUES (
  'food_038', 'Strawberries', 'strawberries', 'fruits', '1 cup',
  49, 1, 12, 0.5, 3, 7.4,
  JSON_OBJECT(), JSON_OBJECT(),
  TRUE, TRUE, TRUE, TRUE, FALSE,
  JSON_ARRAY(), JSON_ARRAY('breakfast', 'snack'), JSON_ARRAY('weight_loss'), JSON_ARRAY('vitamin_c', 'low_calorie'),
  0, 'low', 92,
  '/images/nutrition/strawberries/main.jpg', '/images/nutrition/strawberries/thumbnail.jpg',
  TRUE, 1, NOW(), NOW()
);

INSERT IGNORE INTO nutrition_items (
  foodId, name, slug, category, servingSize,
  calories, protein, carbs, fats, fiber, sugar,
  vitamins, minerals,
  isVegetarian, isVegan, isGlutenFree, isDairyFree, isKeto,
  allergens, mealTypes, goals, tags,
  preparationTime, cost, popularityScore,
  imageUrl, thumbnailUrl, isActive, createdBy, createdAt, updatedAt
) VALUES (
  'food_039', 'Mango', 'mango', 'fruits', '1 cup',
  99, 1.4, 25, 0.6, 2.6, 23,
  JSON_OBJECT(), JSON_OBJECT(),
  TRUE, TRUE, TRUE, TRUE, FALSE,
  JSON_ARRAY(), JSON_ARRAY('breakfast', 'snack'), JSON_ARRAY('weight_loss'), JSON_ARRAY('tropical', 'vitamin_rich'),
  0, 'low', 85,
  '/images/nutrition/mango/main.jpg', '/images/nutrition/mango/thumbnail.jpg',
  TRUE, 1, NOW(), NOW()
);

INSERT IGNORE INTO nutrition_items (
  foodId, name, slug, category, servingSize,
  calories, protein, carbs, fats, fiber, sugar,
  vitamins, minerals,
  isVegetarian, isVegan, isGlutenFree, isDairyFree, isKeto,
  allergens, mealTypes, goals, tags,
  preparationTime, cost, popularityScore,
  imageUrl, thumbnailUrl, isActive, createdBy, createdAt, updatedAt
) VALUES (
  'food_040', 'Grapes', 'grapes', 'fruits', '1 cup',
  104, 1.1, 27, 0.2, 1.4, 23,
  JSON_OBJECT(), JSON_OBJECT(),
  TRUE, TRUE, TRUE, TRUE, FALSE,
  JSON_ARRAY(), JSON_ARRAY('breakfast', 'snack'), JSON_ARRAY('maintenance'), JSON_ARRAY('portable', 'sweet'),
  0, 'low', 85,
  '/images/nutrition/grapes/main.jpg', '/images/nutrition/grapes/thumbnail.jpg',
  TRUE, 1, NOW(), NOW()
);

INSERT IGNORE INTO nutrition_items (
  foodId, name, slug, category, servingSize,
  calories, protein, carbs, fats, fiber, sugar,
  vitamins, minerals,
  isVegetarian, isVegan, isGlutenFree, isDairyFree, isKeto,
  allergens, mealTypes, goals, tags,
  preparationTime, cost, popularityScore,
  imageUrl, thumbnailUrl, isActive, createdBy, createdAt, updatedAt
) VALUES (
  'food_041', 'Watermelon', 'watermelon', 'fruits', '1 cup',
  46, 0.9, 12, 0.2, 0.6, 9.4,
  JSON_OBJECT(), JSON_OBJECT(),
  TRUE, TRUE, TRUE, TRUE, FALSE,
  JSON_ARRAY(), JSON_ARRAY('breakfast', 'snack'), JSON_ARRAY('weight_loss'), JSON_ARRAY('hydrating', 'low_calorie'),
  0, 'low', 88,
  '/images/nutrition/watermelon/main.jpg', '/images/nutrition/watermelon/thumbnail.jpg',
  TRUE, 1, NOW(), NOW()
);

INSERT IGNORE INTO nutrition_items (
  foodId, name, slug, category, servingSize,
  calories, protein, carbs, fats, fiber, sugar,
  vitamins, minerals,
  isVegetarian, isVegan, isGlutenFree, isDairyFree, isKeto,
  allergens, mealTypes, goals, tags,
  preparationTime, cost, popularityScore,
  imageUrl, thumbnailUrl, isActive, createdBy, createdAt, updatedAt
) VALUES (
  'food_042', 'Pineapple', 'pineapple', 'fruits', '1 cup',
  82, 0.9, 22, 0.2, 2.3, 16,
  JSON_OBJECT(), JSON_OBJECT(),
  TRUE, TRUE, TRUE, TRUE, FALSE,
  JSON_ARRAY(), JSON_ARRAY('breakfast', 'snack'), JSON_ARRAY('weight_loss'), JSON_ARRAY('tropical', 'enzyme_rich'),
  0, 'low', 82,
  '/images/nutrition/pineapple/main.jpg', '/images/nutrition/pineapple/thumbnail.jpg',
  TRUE, 1, NOW(), NOW()
);

INSERT IGNORE INTO nutrition_items (
  foodId, name, slug, category, servingSize,
  calories, protein, carbs, fats, fiber, sugar,
  vitamins, minerals,
  isVegetarian, isVegan, isGlutenFree, isDairyFree, isKeto,
  allergens, mealTypes, goals, tags,
  preparationTime, cost, popularityScore,
  imageUrl, thumbnailUrl, isActive, createdBy, createdAt, updatedAt
) VALUES (
  'food_043', 'Dates', 'dates', 'fruits', '2 dates',
  133, 0.7, 36, 0.1, 3.2, 32,
  JSON_OBJECT(), JSON_OBJECT(),
  TRUE, TRUE, TRUE, TRUE, FALSE,
  JSON_ARRAY(), JSON_ARRAY('breakfast', 'snack'), JSON_ARRAY('maintenance'), JSON_ARRAY('natural_sugar', 'energy'),
  0, 'low', 78,
  '/images/nutrition/dates/main.jpg', '/images/nutrition/dates/thumbnail.jpg',
  TRUE, 1, NOW(), NOW()
);

INSERT IGNORE INTO nutrition_items (
  foodId, name, slug, category, servingSize,
  calories, protein, carbs, fats, fiber, sugar,
  vitamins, minerals,
  isVegetarian, isVegan, isGlutenFree, isDairyFree, isKeto,
  allergens, mealTypes, goals, tags,
  preparationTime, cost, popularityScore,
  imageUrl, thumbnailUrl, isActive, createdBy, createdAt, updatedAt
) VALUES (
  'food_044', 'Avocado', 'avocado', 'fats', '1/2 avocado',
  160, 2, 9, 15, 7, 0.7,
  JSON_OBJECT(), JSON_OBJECT(),
  TRUE, TRUE, TRUE, TRUE, TRUE,
  JSON_ARRAY(), JSON_ARRAY('breakfast', 'lunch', 'dinner'), JSON_ARRAY('maintenance'), JSON_ARRAY('healthy_fats', 'fiber'),
  0, 'low', 95,
  '/images/nutrition/avocado/main.jpg', '/images/nutrition/avocado/thumbnail.jpg',
  TRUE, 1, NOW(), NOW()
);

INSERT IGNORE INTO nutrition_items (
  foodId, name, slug, category, servingSize,
  calories, protein, carbs, fats, fiber, sugar,
  vitamins, minerals,
  isVegetarian, isVegan, isGlutenFree, isDairyFree, isKeto,
  allergens, mealTypes, goals, tags,
  preparationTime, cost, popularityScore,
  imageUrl, thumbnailUrl, isActive, createdBy, createdAt, updatedAt
) VALUES (
  'food_045', 'Olive Oil', 'olive-oil', 'fats', '1 tbsp',
  119, 0, 0, 14, 0, 0,
  JSON_OBJECT(), JSON_OBJECT(),
  TRUE, TRUE, TRUE, TRUE, TRUE,
  JSON_ARRAY(), JSON_ARRAY('breakfast', 'lunch', 'dinner'), JSON_ARRAY('maintenance'), JSON_ARRAY('monounsaturated', 'cooking'),
  0, 'low', 92,
  '/images/nutrition/olive-oil/main.jpg', '/images/nutrition/olive-oil/thumbnail.jpg',
  TRUE, 1, NOW(), NOW()
);

INSERT IGNORE INTO nutrition_items (
  foodId, name, slug, category, servingSize,
  calories, protein, carbs, fats, fiber, sugar,
  vitamins, minerals,
  isVegetarian, isVegan, isGlutenFree, isDairyFree, isKeto,
  allergens, mealTypes, goals, tags,
  preparationTime, cost, popularityScore,
  imageUrl, thumbnailUrl, isActive, createdBy, createdAt, updatedAt
) VALUES (
  'food_046', 'Coconut Oil', 'coconut-oil', 'fats', '1 tbsp',
  121, 0, 0, 14, 0, 0,
  JSON_OBJECT(), JSON_OBJECT(),
  TRUE, TRUE, TRUE, TRUE, TRUE,
  JSON_ARRAY(), JSON_ARRAY('breakfast', 'lunch', 'dinner'), JSON_ARRAY('maintenance'), JSON_ARRAY('mct', 'cooking'),
  0, 'low', 85,
  '/images/nutrition/coconut-oil/main.jpg', '/images/nutrition/coconut-oil/thumbnail.jpg',
  TRUE, 1, NOW(), NOW()
);

INSERT IGNORE INTO nutrition_items (
  foodId, name, slug, category, servingSize,
  calories, protein, carbs, fats, fiber, sugar,
  vitamins, minerals,
  isVegetarian, isVegan, isGlutenFree, isDairyFree, isKeto,
  allergens, mealTypes, goals, tags,
  preparationTime, cost, popularityScore,
  imageUrl, thumbnailUrl, isActive, createdBy, createdAt, updatedAt
) VALUES (
  'food_047', 'Walnuts', 'walnuts', 'fats', '28g',
  185, 4.3, 3.9, 18.5, 1.9, 0.7,
  JSON_OBJECT(), JSON_OBJECT(),
  TRUE, TRUE, TRUE, TRUE, TRUE,
  JSON_ARRAY(), JSON_ARRAY('breakfast', 'lunch', 'dinner'), JSON_ARRAY('maintenance'), JSON_ARRAY('omega3', 'brain_health'),
  0, 'low', 88,
  '/images/nutrition/walnuts/main.jpg', '/images/nutrition/walnuts/thumbnail.jpg',
  TRUE, 1, NOW(), NOW()
);

INSERT IGNORE INTO nutrition_items (
  foodId, name, slug, category, servingSize,
  calories, protein, carbs, fats, fiber, sugar,
  vitamins, minerals,
  isVegetarian, isVegan, isGlutenFree, isDairyFree, isKeto,
  allergens, mealTypes, goals, tags,
  preparationTime, cost, popularityScore,
  imageUrl, thumbnailUrl, isActive, createdBy, createdAt, updatedAt
) VALUES (
  'food_048', 'Cashews', 'cashews', 'fats', '28g',
  157, 5.2, 8.6, 12.4, 0.9, 1.7,
  JSON_OBJECT(), JSON_OBJECT(),
  TRUE, TRUE, TRUE, TRUE, FALSE,
  JSON_ARRAY(), JSON_ARRAY('breakfast', 'lunch', 'dinner'), JSON_ARRAY('maintenance'), JSON_ARRAY('creamy', 'versatile'),
  0, 'low', 85,
  '/images/nutrition/cashews/main.jpg', '/images/nutrition/cashews/thumbnail.jpg',
  TRUE, 1, NOW(), NOW()
);

INSERT IGNORE INTO nutrition_items (
  foodId, name, slug, category, servingSize,
  calories, protein, carbs, fats, fiber, sugar,
  vitamins, minerals,
  isVegetarian, isVegan, isGlutenFree, isDairyFree, isKeto,
  allergens, mealTypes, goals, tags,
  preparationTime, cost, popularityScore,
  imageUrl, thumbnailUrl, isActive, createdBy, createdAt, updatedAt
) VALUES (
  'food_049', 'Chia Seeds', 'chia-seeds', 'fats', '2 tbsp',
  138, 4.7, 12, 8.7, 9.8, 0,
  JSON_OBJECT(), JSON_OBJECT(),
  TRUE, TRUE, TRUE, TRUE, TRUE,
  JSON_ARRAY(), JSON_ARRAY('breakfast', 'lunch', 'dinner'), JSON_ARRAY('maintenance'), JSON_ARRAY('omega3', 'fiber'),
  0, 'low', 88,
  '/images/nutrition/chia-seeds/main.jpg', '/images/nutrition/chia-seeds/thumbnail.jpg',
  TRUE, 1, NOW(), NOW()
);

INSERT IGNORE INTO nutrition_items (
  foodId, name, slug, category, servingSize,
  calories, protein, carbs, fats, fiber, sugar,
  vitamins, minerals,
  isVegetarian, isVegan, isGlutenFree, isDairyFree, isKeto,
  allergens, mealTypes, goals, tags,
  preparationTime, cost, popularityScore,
  imageUrl, thumbnailUrl, isActive, createdBy, createdAt, updatedAt
) VALUES (
  'food_050', 'Flaxseeds', 'flaxseeds', 'fats', '1 tbsp',
  55, 1.9, 3, 4.3, 2.8, 0.2,
  JSON_OBJECT(), JSON_OBJECT(),
  TRUE, TRUE, TRUE, TRUE, TRUE,
  JSON_ARRAY(), JSON_ARRAY('breakfast', 'lunch', 'dinner'), JSON_ARRAY('weight_loss'), JSON_ARRAY('omega3', 'fiber'),
  0, 'low', 82,
  '/images/nutrition/flaxseeds/main.jpg', '/images/nutrition/flaxseeds/thumbnail.jpg',
  TRUE, 1, NOW(), NOW()
);

INSERT IGNORE INTO nutrition_items (
  foodId, name, slug, category, servingSize,
  calories, protein, carbs, fats, fiber, sugar,
  vitamins, minerals,
  isVegetarian, isVegan, isGlutenFree, isDairyFree, isKeto,
  allergens, mealTypes, goals, tags,
  preparationTime, cost, popularityScore,
  imageUrl, thumbnailUrl, isActive, createdBy, createdAt, updatedAt
) VALUES (
  'food_051', 'Pumpkin Seeds', 'pumpkin-seeds', 'fats', '28g',
  151, 7, 5, 13, 1.7, 0.4,
  JSON_OBJECT(), JSON_OBJECT(),
  TRUE, TRUE, TRUE, TRUE, TRUE,
  JSON_ARRAY(), JSON_ARRAY('breakfast', 'lunch', 'dinner'), JSON_ARRAY('maintenance'), JSON_ARRAY('zinc_rich', 'protein'),
  0, 'low', 80,
  '/images/nutrition/pumpkin-seeds/main.jpg', '/images/nutrition/pumpkin-seeds/thumbnail.jpg',
  TRUE, 1, NOW(), NOW()
);

INSERT IGNORE INTO nutrition_items (
  foodId, name, slug, category, servingSize,
  calories, protein, carbs, fats, fiber, sugar,
  vitamins, minerals,
  isVegetarian, isVegan, isGlutenFree, isDairyFree, isKeto,
  allergens, mealTypes, goals, tags,
  preparationTime, cost, popularityScore,
  imageUrl, thumbnailUrl, isActive, createdBy, createdAt, updatedAt
) VALUES (
  'food_052', 'Sunflower Seeds', 'sunflower-seeds', 'fats', '28g',
  165, 5.8, 6.8, 14, 2.4, 0.8,
  JSON_OBJECT(), JSON_OBJECT(),
  TRUE, TRUE, TRUE, TRUE, TRUE,
  JSON_ARRAY(), JSON_ARRAY('breakfast', 'lunch', 'dinner'), JSON_ARRAY('maintenance'), JSON_ARRAY('vitamin_e'),
  0, 'low', 78,
  '/images/nutrition/sunflower-seeds/main.jpg', '/images/nutrition/sunflower-seeds/thumbnail.jpg',
  TRUE, 1, NOW(), NOW()
);

INSERT IGNORE INTO nutrition_items (
  foodId, name, slug, category, servingSize,
  calories, protein, carbs, fats, fiber, sugar,
  vitamins, minerals,
  isVegetarian, isVegan, isGlutenFree, isDairyFree, isKeto,
  allergens, mealTypes, goals, tags,
  preparationTime, cost, popularityScore,
  imageUrl, thumbnailUrl, isActive, createdBy, createdAt, updatedAt
) VALUES (
  'food_053', 'Almond Butter', 'almond-butter', 'fats', '2 tbsp',
  196, 6.7, 6.1, 18, 3.3, 1.9,
  JSON_OBJECT(), JSON_OBJECT(),
  TRUE, TRUE, TRUE, TRUE, FALSE,
  JSON_ARRAY(), JSON_ARRAY('breakfast', 'lunch', 'dinner'), JSON_ARRAY('maintenance'), JSON_ARRAY('healthy_fats'),
  0, 'low', 85,
  '/images/nutrition/almond-butter/main.jpg', '/images/nutrition/almond-butter/thumbnail.jpg',
  TRUE, 1, NOW(), NOW()
);

INSERT IGNORE INTO nutrition_items (
  foodId, name, slug, category, servingSize,
  calories, protein, carbs, fats, fiber, sugar,
  vitamins, minerals,
  isVegetarian, isVegan, isGlutenFree, isDairyFree, isKeto,
  allergens, mealTypes, goals, tags,
  preparationTime, cost, popularityScore,
  imageUrl, thumbnailUrl, isActive, createdBy, createdAt, updatedAt
) VALUES (
  'food_054', 'Dark Chocolate (70%)', 'dark-chocolate-70-', 'fats', '28g',
  170, 2.2, 13, 12, 3.1, 6.8,
  JSON_OBJECT(), JSON_OBJECT(),
  TRUE, TRUE, TRUE, TRUE, FALSE,
  JSON_ARRAY(), JSON_ARRAY('breakfast', 'lunch', 'dinner'), JSON_ARRAY('maintenance'), JSON_ARRAY('antioxidants'),
  0, 'low', 88,
  '/images/nutrition/dark-chocolate-70-/main.jpg', '/images/nutrition/dark-chocolate-70-/thumbnail.jpg',
  TRUE, 1, NOW(), NOW()
);

INSERT IGNORE INTO nutrition_items (
  foodId, name, slug, category, servingSize,
  calories, protein, carbs, fats, fiber, sugar,
  vitamins, minerals,
  isVegetarian, isVegan, isGlutenFree, isDairyFree, isKeto,
  allergens, mealTypes, goals, tags,
  preparationTime, cost, popularityScore,
  imageUrl, thumbnailUrl, isActive, createdBy, createdAt, updatedAt
) VALUES (
  'food_055', 'Broccoli', 'broccoli', 'vegetables', '1 cup cooked',
  55, 3.7, 11, 0.6, 5.1, 2.2,
  JSON_OBJECT(), JSON_OBJECT(),
  TRUE, TRUE, TRUE, TRUE, TRUE,
  JSON_ARRAY(), JSON_ARRAY('lunch', 'dinner'), JSON_ARRAY('weight_loss'), JSON_ARRAY('low_calorie', 'fiber'),
  0, 'low', 88,
  '/images/nutrition/broccoli/main.jpg', '/images/nutrition/broccoli/thumbnail.jpg',
  TRUE, 1, NOW(), NOW()
);

INSERT IGNORE INTO nutrition_items (
  foodId, name, slug, category, servingSize,
  calories, protein, carbs, fats, fiber, sugar,
  vitamins, minerals,
  isVegetarian, isVegan, isGlutenFree, isDairyFree, isKeto,
  allergens, mealTypes, goals, tags,
  preparationTime, cost, popularityScore,
  imageUrl, thumbnailUrl, isActive, createdBy, createdAt, updatedAt
) VALUES (
  'food_056', 'Spinach', 'spinach', 'vegetables', '1 cup raw',
  7, 0.9, 1.1, 0.1, 0.7, 0.1,
  JSON_OBJECT(), JSON_OBJECT(),
  TRUE, TRUE, TRUE, TRUE, TRUE,
  JSON_ARRAY(), JSON_ARRAY('lunch', 'dinner'), JSON_ARRAY('weight_loss'), JSON_ARRAY('low_calorie', 'iron'),
  0, 'low', 90,
  '/images/nutrition/spinach/main.jpg', '/images/nutrition/spinach/thumbnail.jpg',
  TRUE, 1, NOW(), NOW()
);

INSERT IGNORE INTO nutrition_items (
  foodId, name, slug, category, servingSize,
  calories, protein, carbs, fats, fiber, sugar,
  vitamins, minerals,
  isVegetarian, isVegan, isGlutenFree, isDairyFree, isKeto,
  allergens, mealTypes, goals, tags,
  preparationTime, cost, popularityScore,
  imageUrl, thumbnailUrl, isActive, createdBy, createdAt, updatedAt
) VALUES (
  'food_057', 'Kale', 'kale', 'vegetables', '1 cup raw',
  33, 2.9, 6, 0.6, 1.3, 0.8,
  JSON_OBJECT(), JSON_OBJECT(),
  TRUE, TRUE, TRUE, TRUE, TRUE,
  JSON_ARRAY(), JSON_ARRAY('lunch', 'dinner'), JSON_ARRAY('weight_loss'), JSON_ARRAY('superfood', 'nutrient_dense'),
  0, 'low', 85,
  '/images/nutrition/kale/main.jpg', '/images/nutrition/kale/thumbnail.jpg',
  TRUE, 1, NOW(), NOW()
);

INSERT IGNORE INTO nutrition_items (
  foodId, name, slug, category, servingSize,
  calories, protein, carbs, fats, fiber, sugar,
  vitamins, minerals,
  isVegetarian, isVegan, isGlutenFree, isDairyFree, isKeto,
  allergens, mealTypes, goals, tags,
  preparationTime, cost, popularityScore,
  imageUrl, thumbnailUrl, isActive, createdBy, createdAt, updatedAt
) VALUES (
  'food_058', 'Cauliflower', 'cauliflower', 'vegetables', '1 cup cooked',
  29, 2.3, 5.7, 0.6, 2.9, 2.4,
  JSON_OBJECT(), JSON_OBJECT(),
  TRUE, TRUE, TRUE, TRUE, TRUE,
  JSON_ARRAY(), JSON_ARRAY('lunch', 'dinner'), JSON_ARRAY('weight_loss'), JSON_ARRAY('low_calorie', 'versatile'),
  0, 'low', 82,
  '/images/nutrition/cauliflower/main.jpg', '/images/nutrition/cauliflower/thumbnail.jpg',
  TRUE, 1, NOW(), NOW()
);

INSERT IGNORE INTO nutrition_items (
  foodId, name, slug, category, servingSize,
  calories, protein, carbs, fats, fiber, sugar,
  vitamins, minerals,
  isVegetarian, isVegan, isGlutenFree, isDairyFree, isKeto,
  allergens, mealTypes, goals, tags,
  preparationTime, cost, popularityScore,
  imageUrl, thumbnailUrl, isActive, createdBy, createdAt, updatedAt
) VALUES (
  'food_059', 'Bell Peppers', 'bell-peppers', 'vegetables', '1 cup raw',
  39, 1.5, 9, 0.5, 3.1, 6.3,
  JSON_OBJECT(), JSON_OBJECT(),
  TRUE, TRUE, TRUE, TRUE, TRUE,
  JSON_ARRAY(), JSON_ARRAY('lunch', 'dinner'), JSON_ARRAY('weight_loss'), JSON_ARRAY('vitamin_c', 'colorful'),
  0, 'low', 85,
  '/images/nutrition/bell-peppers/main.jpg', '/images/nutrition/bell-peppers/thumbnail.jpg',
  TRUE, 1, NOW(), NOW()
);

INSERT IGNORE INTO nutrition_items (
  foodId, name, slug, category, servingSize,
  calories, protein, carbs, fats, fiber, sugar,
  vitamins, minerals,
  isVegetarian, isVegan, isGlutenFree, isDairyFree, isKeto,
  allergens, mealTypes, goals, tags,
  preparationTime, cost, popularityScore,
  imageUrl, thumbnailUrl, isActive, createdBy, createdAt, updatedAt
) VALUES (
  'food_060', 'Carrots', 'carrots', 'vegetables', '1 cup raw',
  52, 1.2, 12, 0.3, 3.6, 6,
  JSON_OBJECT(), JSON_OBJECT(),
  TRUE, TRUE, TRUE, TRUE, FALSE,
  JSON_ARRAY(), JSON_ARRAY('lunch', 'dinner'), JSON_ARRAY('weight_loss'), JSON_ARRAY('vitamin_a', 'crunchy'),
  0, 'low', 88,
  '/images/nutrition/carrots/main.jpg', '/images/nutrition/carrots/thumbnail.jpg',
  TRUE, 1, NOW(), NOW()
);

INSERT IGNORE INTO nutrition_items (
  foodId, name, slug, category, servingSize,
  calories, protein, carbs, fats, fiber, sugar,
  vitamins, minerals,
  isVegetarian, isVegan, isGlutenFree, isDairyFree, isKeto,
  allergens, mealTypes, goals, tags,
  preparationTime, cost, popularityScore,
  imageUrl, thumbnailUrl, isActive, createdBy, createdAt, updatedAt
) VALUES (
  'food_061', 'Tomatoes', 'tomatoes', 'vegetables', '1 medium',
  22, 1.1, 4.8, 0.2, 1.5, 3.2,
  JSON_OBJECT(), JSON_OBJECT(),
  TRUE, TRUE, TRUE, TRUE, TRUE,
  JSON_ARRAY(), JSON_ARRAY('lunch', 'dinner'), JSON_ARRAY('weight_loss'), JSON_ARRAY('lycopene', 'versatile'),
  0, 'low', 90,
  '/images/nutrition/tomatoes/main.jpg', '/images/nutrition/tomatoes/thumbnail.jpg',
  TRUE, 1, NOW(), NOW()
);

INSERT IGNORE INTO nutrition_items (
  foodId, name, slug, category, servingSize,
  calories, protein, carbs, fats, fiber, sugar,
  vitamins, minerals,
  isVegetarian, isVegan, isGlutenFree, isDairyFree, isKeto,
  allergens, mealTypes, goals, tags,
  preparationTime, cost, popularityScore,
  imageUrl, thumbnailUrl, isActive, createdBy, createdAt, updatedAt
) VALUES (
  'food_062', 'Cucumber', 'cucumber', 'vegetables', '1 cup sliced',
  16, 0.7, 3.6, 0.1, 0.5, 1.7,
  JSON_OBJECT(), JSON_OBJECT(),
  TRUE, TRUE, TRUE, TRUE, TRUE,
  JSON_ARRAY(), JSON_ARRAY('lunch', 'dinner'), JSON_ARRAY('weight_loss'), JSON_ARRAY('hydrating', 'low_calorie'),
  0, 'low', 85,
  '/images/nutrition/cucumber/main.jpg', '/images/nutrition/cucumber/thumbnail.jpg',
  TRUE, 1, NOW(), NOW()
);

INSERT IGNORE INTO nutrition_items (
  foodId, name, slug, category, servingSize,
  calories, protein, carbs, fats, fiber, sugar,
  vitamins, minerals,
  isVegetarian, isVegan, isGlutenFree, isDairyFree, isKeto,
  allergens, mealTypes, goals, tags,
  preparationTime, cost, popularityScore,
  imageUrl, thumbnailUrl, isActive, createdBy, createdAt, updatedAt
) VALUES (
  'food_063', 'Zucchini', 'zucchini', 'vegetables', '1 cup cooked',
  27, 2, 5, 0.4, 2, 3.5,
  JSON_OBJECT(), JSON_OBJECT(),
  TRUE, TRUE, TRUE, TRUE, TRUE,
  JSON_ARRAY(), JSON_ARRAY('lunch', 'dinner'), JSON_ARRAY('weight_loss'), JSON_ARRAY('low_calorie', 'versatile'),
  0, 'low', 80,
  '/images/nutrition/zucchini/main.jpg', '/images/nutrition/zucchini/thumbnail.jpg',
  TRUE, 1, NOW(), NOW()
);

INSERT IGNORE INTO nutrition_items (
  foodId, name, slug, category, servingSize,
  calories, protein, carbs, fats, fiber, sugar,
  vitamins, minerals,
  isVegetarian, isVegan, isGlutenFree, isDairyFree, isKeto,
  allergens, mealTypes, goals, tags,
  preparationTime, cost, popularityScore,
  imageUrl, thumbnailUrl, isActive, createdBy, createdAt, updatedAt
) VALUES (
  'food_064', 'Asparagus', 'asparagus', 'vegetables', '1 cup cooked',
  40, 4.3, 7.4, 0.4, 3.6, 2.5,
  JSON_OBJECT(), JSON_OBJECT(),
  TRUE, TRUE, TRUE, TRUE, TRUE,
  JSON_ARRAY(), JSON_ARRAY('lunch', 'dinner'), JSON_ARRAY('weight_loss'), JSON_ARRAY('nutrient_dense'),
  0, 'low', 78,
  '/images/nutrition/asparagus/main.jpg', '/images/nutrition/asparagus/thumbnail.jpg',
  TRUE, 1, NOW(), NOW()
);

INSERT IGNORE INTO nutrition_items (
  foodId, name, slug, category, servingSize,
  calories, protein, carbs, fats, fiber, sugar,
  vitamins, minerals,
  isVegetarian, isVegan, isGlutenFree, isDairyFree, isKeto,
  allergens, mealTypes, goals, tags,
  preparationTime, cost, popularityScore,
  imageUrl, thumbnailUrl, isActive, createdBy, createdAt, updatedAt
) VALUES (
  'food_065', 'Green Beans', 'green-beans', 'vegetables', '1 cup cooked',
  44, 2.4, 10, 0.4, 4, 5.7,
  JSON_OBJECT(), JSON_OBJECT(),
  TRUE, TRUE, TRUE, TRUE, TRUE,
  JSON_ARRAY(), JSON_ARRAY('lunch', 'dinner'), JSON_ARRAY('weight_loss'), JSON_ARRAY('fiber'),
  0, 'low', 82,
  '/images/nutrition/green-beans/main.jpg', '/images/nutrition/green-beans/thumbnail.jpg',
  TRUE, 1, NOW(), NOW()
);

INSERT IGNORE INTO nutrition_items (
  foodId, name, slug, category, servingSize,
  calories, protein, carbs, fats, fiber, sugar,
  vitamins, minerals,
  isVegetarian, isVegan, isGlutenFree, isDairyFree, isKeto,
  allergens, mealTypes, goals, tags,
  preparationTime, cost, popularityScore,
  imageUrl, thumbnailUrl, isActive, createdBy, createdAt, updatedAt
) VALUES (
  'food_066', 'Brussels Sprouts', 'brussels-sprouts', 'vegetables', '1 cup cooked',
  56, 4, 11, 0.8, 4, 2.7,
  JSON_OBJECT(), JSON_OBJECT(),
  TRUE, TRUE, TRUE, TRUE, TRUE,
  JSON_ARRAY(), JSON_ARRAY('lunch', 'dinner'), JSON_ARRAY('weight_loss'), JSON_ARRAY('fiber', 'vitamin_k'),
  0, 'low', 75,
  '/images/nutrition/brussels-sprouts/main.jpg', '/images/nutrition/brussels-sprouts/thumbnail.jpg',
  TRUE, 1, NOW(), NOW()
);

INSERT IGNORE INTO nutrition_items (
  foodId, name, slug, category, servingSize,
  calories, protein, carbs, fats, fiber, sugar,
  vitamins, minerals,
  isVegetarian, isVegan, isGlutenFree, isDairyFree, isKeto,
  allergens, mealTypes, goals, tags,
  preparationTime, cost, popularityScore,
  imageUrl, thumbnailUrl, isActive, createdBy, createdAt, updatedAt
) VALUES (
  'food_067', 'Mushrooms', 'mushrooms', 'vegetables', '1 cup raw',
  21, 3, 3, 0.3, 1, 1.9,
  JSON_OBJECT(), JSON_OBJECT(),
  TRUE, TRUE, TRUE, TRUE, TRUE,
  JSON_ARRAY(), JSON_ARRAY('lunch', 'dinner'), JSON_ARRAY('weight_loss'), JSON_ARRAY('low_calorie', 'umami'),
  0, 'low', 85,
  '/images/nutrition/mushrooms/main.jpg', '/images/nutrition/mushrooms/thumbnail.jpg',
  TRUE, 1, NOW(), NOW()
);

INSERT IGNORE INTO nutrition_items (
  foodId, name, slug, category, servingSize,
  calories, protein, carbs, fats, fiber, sugar,
  vitamins, minerals,
  isVegetarian, isVegan, isGlutenFree, isDairyFree, isKeto,
  allergens, mealTypes, goals, tags,
  preparationTime, cost, popularityScore,
  imageUrl, thumbnailUrl, isActive, createdBy, createdAt, updatedAt
) VALUES (
  'food_068', 'Onions', 'onions', 'vegetables', '1 cup raw',
  64, 1.8, 15, 0.2, 2.7, 6.8,
  JSON_OBJECT(), JSON_OBJECT(),
  TRUE, TRUE, TRUE, TRUE, FALSE,
  JSON_ARRAY(), JSON_ARRAY('lunch', 'dinner'), JSON_ARRAY('weight_loss'), JSON_ARRAY('flavor', 'versatile'),
  0, 'low', 88,
  '/images/nutrition/onions/main.jpg', '/images/nutrition/onions/thumbnail.jpg',
  TRUE, 1, NOW(), NOW()
);

INSERT IGNORE INTO nutrition_items (
  foodId, name, slug, category, servingSize,
  calories, protein, carbs, fats, fiber, sugar,
  vitamins, minerals,
  isVegetarian, isVegan, isGlutenFree, isDairyFree, isKeto,
  allergens, mealTypes, goals, tags,
  preparationTime, cost, popularityScore,
  imageUrl, thumbnailUrl, isActive, createdBy, createdAt, updatedAt
) VALUES (
  'food_069', 'Garlic', 'garlic', 'vegetables', '3 cloves',
  13, 0.6, 3, 0, 0.2, 0.1,
  JSON_OBJECT(), JSON_OBJECT(),
  TRUE, TRUE, TRUE, TRUE, TRUE,
  JSON_ARRAY(), JSON_ARRAY('lunch', 'dinner'), JSON_ARRAY('weight_loss'), JSON_ARRAY('flavor', 'immune'),
  0, 'low', 90,
  '/images/nutrition/garlic/main.jpg', '/images/nutrition/garlic/thumbnail.jpg',
  TRUE, 1, NOW(), NOW()
);

INSERT IGNORE INTO nutrition_items (
  foodId, name, slug, category, servingSize,
  calories, protein, carbs, fats, fiber, sugar,
  vitamins, minerals,
  isVegetarian, isVegan, isGlutenFree, isDairyFree, isKeto,
  allergens, mealTypes, goals, tags,
  preparationTime, cost, popularityScore,
  imageUrl, thumbnailUrl, isActive, createdBy, createdAt, updatedAt
) VALUES (
  'food_070', 'Lettuce (Romaine)', 'lettuce-romaine-', 'vegetables', '1 cup',
  8, 0.6, 1.5, 0.1, 1, 0.6,
  JSON_OBJECT(), JSON_OBJECT(),
  TRUE, TRUE, TRUE, TRUE, TRUE,
  JSON_ARRAY(), JSON_ARRAY('lunch', 'dinner'), JSON_ARRAY('weight_loss'), JSON_ARRAY('low_calorie', 'salad'),
  0, 'low', 85,
  '/images/nutrition/lettuce-romaine-/main.jpg', '/images/nutrition/lettuce-romaine-/thumbnail.jpg',
  TRUE, 1, NOW(), NOW()
);

INSERT IGNORE INTO nutrition_items (
  foodId, name, slug, category, servingSize,
  calories, protein, carbs, fats, fiber, sugar,
  vitamins, minerals,
  isVegetarian, isVegan, isGlutenFree, isDairyFree, isKeto,
  allergens, mealTypes, goals, tags,
  preparationTime, cost, popularityScore,
  imageUrl, thumbnailUrl, isActive, createdBy, createdAt, updatedAt
) VALUES (
  'food_071', 'Cabbage', 'cabbage', 'vegetables', '1 cup raw',
  22, 1.1, 5.2, 0.1, 2.2, 2.9,
  JSON_OBJECT(), JSON_OBJECT(),
  TRUE, TRUE, TRUE, TRUE, TRUE,
  JSON_ARRAY(), JSON_ARRAY('lunch', 'dinner'), JSON_ARRAY('weight_loss'), JSON_ARRAY('low_calorie', 'versatile'),
  0, 'low', 78,
  '/images/nutrition/cabbage/main.jpg', '/images/nutrition/cabbage/thumbnail.jpg',
  TRUE, 1, NOW(), NOW()
);

INSERT IGNORE INTO nutrition_items (
  foodId, name, slug, category, servingSize,
  calories, protein, carbs, fats, fiber, sugar,
  vitamins, minerals,
  isVegetarian, isVegan, isGlutenFree, isDairyFree, isKeto,
  allergens, mealTypes, goals, tags,
  preparationTime, cost, popularityScore,
  imageUrl, thumbnailUrl, isActive, createdBy, createdAt, updatedAt
) VALUES (
  'food_072', 'Celery', 'celery', 'vegetables', '1 cup',
  16, 0.7, 3, 0.2, 1.6, 1.3,
  JSON_OBJECT(), JSON_OBJECT(),
  TRUE, TRUE, TRUE, TRUE, TRUE,
  JSON_ARRAY(), JSON_ARRAY('lunch', 'dinner'), JSON_ARRAY('weight_loss'), JSON_ARRAY('low_calorie', 'crunchy'),
  0, 'low', 75,
  '/images/nutrition/celery/main.jpg', '/images/nutrition/celery/thumbnail.jpg',
  TRUE, 1, NOW(), NOW()
);

INSERT IGNORE INTO nutrition_items (
  foodId, name, slug, category, servingSize,
  calories, protein, carbs, fats, fiber, sugar,
  vitamins, minerals,
  isVegetarian, isVegan, isGlutenFree, isDairyFree, isKeto,
  allergens, mealTypes, goals, tags,
  preparationTime, cost, popularityScore,
  imageUrl, thumbnailUrl, isActive, createdBy, createdAt, updatedAt
) VALUES (
  'food_073', 'Eggplant', 'eggplant', 'vegetables', '1 cup cooked',
  35, 0.8, 8.6, 0.2, 2.5, 3.2,
  JSON_OBJECT(), JSON_OBJECT(),
  TRUE, TRUE, TRUE, TRUE, TRUE,
  JSON_ARRAY(), JSON_ARRAY('lunch', 'dinner'), JSON_ARRAY('weight_loss'), JSON_ARRAY('low_calorie'),
  0, 'low', 72,
  '/images/nutrition/eggplant/main.jpg', '/images/nutrition/eggplant/thumbnail.jpg',
  TRUE, 1, NOW(), NOW()
);

INSERT IGNORE INTO nutrition_items (
  foodId, name, slug, category, servingSize,
  calories, protein, carbs, fats, fiber, sugar,
  vitamins, minerals,
  isVegetarian, isVegan, isGlutenFree, isDairyFree, isKeto,
  allergens, mealTypes, goals, tags,
  preparationTime, cost, popularityScore,
  imageUrl, thumbnailUrl, isActive, createdBy, createdAt, updatedAt
) VALUES (
  'food_074', 'Beets', 'beets', 'vegetables', '1 cup cooked',
  75, 2.9, 17, 0.3, 3.8, 13,
  JSON_OBJECT(), JSON_OBJECT(),
  TRUE, TRUE, TRUE, TRUE, FALSE,
  JSON_ARRAY(), JSON_ARRAY('lunch', 'dinner'), JSON_ARRAY('weight_loss'), JSON_ARRAY('nitrates', 'colorful'),
  0, 'low', 75,
  '/images/nutrition/beets/main.jpg', '/images/nutrition/beets/thumbnail.jpg',
  TRUE, 1, NOW(), NOW()
);

INSERT IGNORE INTO nutrition_items (
  foodId, name, slug, category, servingSize,
  calories, protein, carbs, fats, fiber, sugar,
  vitamins, minerals,
  isVegetarian, isVegan, isGlutenFree, isDairyFree, isKeto,
  allergens, mealTypes, goals, tags,
  preparationTime, cost, popularityScore,
  imageUrl, thumbnailUrl, isActive, createdBy, createdAt, updatedAt
) VALUES (
  'food_075', 'Radishes', 'radishes', 'vegetables', '1 cup sliced',
  19, 0.8, 4, 0.1, 1.9, 2.2,
  JSON_OBJECT(), JSON_OBJECT(),
  TRUE, TRUE, TRUE, TRUE, TRUE,
  JSON_ARRAY(), JSON_ARRAY('lunch', 'dinner'), JSON_ARRAY('weight_loss'), JSON_ARRAY('low_calorie', 'crunchy'),
  0, 'low', 70,
  '/images/nutrition/radishes/main.jpg', '/images/nutrition/radishes/thumbnail.jpg',
  TRUE, 1, NOW(), NOW()
);

INSERT IGNORE INTO nutrition_items (
  foodId, name, slug, category, servingSize,
  calories, protein, carbs, fats, fiber, sugar,
  vitamins, minerals,
  isVegetarian, isVegan, isGlutenFree, isDairyFree, isKeto,
  allergens, mealTypes, goals, tags,
  preparationTime, cost, popularityScore,
  imageUrl, thumbnailUrl, isActive, createdBy, createdAt, updatedAt
) VALUES (
  'food_076', 'Milk (2%)', 'milk-2-', 'dairy', '1 cup',
  122, 8, 12, 4.8, 0, 12,
  JSON_OBJECT(), JSON_OBJECT(),
  TRUE, FALSE, TRUE, TRUE, FALSE,
  JSON_ARRAY(), JSON_ARRAY('breakfast', 'snack'), JSON_ARRAY('maintenance'), JSON_ARRAY('calcium', 'protein'),
  0, 'low', 88,
  '/images/nutrition/milk-2-/main.jpg', '/images/nutrition/milk-2-/thumbnail.jpg',
  TRUE, 1, NOW(), NOW()
);

INSERT IGNORE INTO nutrition_items (
  foodId, name, slug, category, servingSize,
  calories, protein, carbs, fats, fiber, sugar,
  vitamins, minerals,
  isVegetarian, isVegan, isGlutenFree, isDairyFree, isKeto,
  allergens, mealTypes, goals, tags,
  preparationTime, cost, popularityScore,
  imageUrl, thumbnailUrl, isActive, createdBy, createdAt, updatedAt
) VALUES (
  'food_077', 'Almond Milk (unsweetened)', 'almond-milk-unsweetened-', 'dairy', '1 cup',
  30, 1, 1, 2.5, 0, 0,
  JSON_OBJECT(), JSON_OBJECT(),
  TRUE, TRUE, TRUE, TRUE, TRUE,
  JSON_ARRAY(), JSON_ARRAY('breakfast', 'snack'), JSON_ARRAY('weight_loss'), JSON_ARRAY('low_calorie', 'dairy_free'),
  0, 'low', 85,
  '/images/nutrition/almond-milk-unsweetened-/main.jpg', '/images/nutrition/almond-milk-unsweetened-/thumbnail.jpg',
  TRUE, 1, NOW(), NOW()
);

INSERT IGNORE INTO nutrition_items (
  foodId, name, slug, category, servingSize,
  calories, protein, carbs, fats, fiber, sugar,
  vitamins, minerals,
  isVegetarian, isVegan, isGlutenFree, isDairyFree, isKeto,
  allergens, mealTypes, goals, tags,
  preparationTime, cost, popularityScore,
  imageUrl, thumbnailUrl, isActive, createdBy, createdAt, updatedAt
) VALUES (
  'food_078', 'Oat Milk', 'oat-milk', 'dairy', '1 cup',
  120, 3, 16, 5, 2, 7,
  JSON_OBJECT(), JSON_OBJECT(),
  TRUE, TRUE, TRUE, TRUE, FALSE,
  JSON_ARRAY(), JSON_ARRAY('breakfast', 'snack'), JSON_ARRAY('maintenance'), JSON_ARRAY('dairy_free', 'creamy'),
  0, 'low', 82,
  '/images/nutrition/oat-milk/main.jpg', '/images/nutrition/oat-milk/thumbnail.jpg',
  TRUE, 1, NOW(), NOW()
);

INSERT IGNORE INTO nutrition_items (
  foodId, name, slug, category, servingSize,
  calories, protein, carbs, fats, fiber, sugar,
  vitamins, minerals,
  isVegetarian, isVegan, isGlutenFree, isDairyFree, isKeto,
  allergens, mealTypes, goals, tags,
  preparationTime, cost, popularityScore,
  imageUrl, thumbnailUrl, isActive, createdBy, createdAt, updatedAt
) VALUES (
  'food_079', 'Cheddar Cheese', 'cheddar-cheese', 'dairy', '28g',
  114, 7, 0.4, 9, 0, 0.1,
  JSON_OBJECT(), JSON_OBJECT(),
  TRUE, FALSE, TRUE, TRUE, TRUE,
  JSON_ARRAY(), JSON_ARRAY('breakfast', 'snack'), JSON_ARRAY('maintenance'), JSON_ARRAY('protein', 'calcium'),
  0, 'low', 88,
  '/images/nutrition/cheddar-cheese/main.jpg', '/images/nutrition/cheddar-cheese/thumbnail.jpg',
  TRUE, 1, NOW(), NOW()
);

INSERT IGNORE INTO nutrition_items (
  foodId, name, slug, category, servingSize,
  calories, protein, carbs, fats, fiber, sugar,
  vitamins, minerals,
  isVegetarian, isVegan, isGlutenFree, isDairyFree, isKeto,
  allergens, mealTypes, goals, tags,
  preparationTime, cost, popularityScore,
  imageUrl, thumbnailUrl, isActive, createdBy, createdAt, updatedAt
) VALUES (
  'food_080', 'Mozzarella', 'mozzarella', 'dairy', '28g',
  72, 7, 1, 4.5, 0, 0.3,
  JSON_OBJECT(), JSON_OBJECT(),
  TRUE, FALSE, TRUE, TRUE, FALSE,
  JSON_ARRAY(), JSON_ARRAY('breakfast', 'snack'), JSON_ARRAY('weight_loss'), JSON_ARRAY('protein', 'calcium'),
  0, 'low', 85,
  '/images/nutrition/mozzarella/main.jpg', '/images/nutrition/mozzarella/thumbnail.jpg',
  TRUE, 1, NOW(), NOW()
);

INSERT IGNORE INTO nutrition_items (
  foodId, name, slug, category, servingSize,
  calories, protein, carbs, fats, fiber, sugar,
  vitamins, minerals,
  isVegetarian, isVegan, isGlutenFree, isDairyFree, isKeto,
  allergens, mealTypes, goals, tags,
  preparationTime, cost, popularityScore,
  imageUrl, thumbnailUrl, isActive, createdBy, createdAt, updatedAt
) VALUES (
  'food_081', 'Feta Cheese', 'feta-cheese', 'dairy', '28g',
  75, 4, 1.2, 6, 0, 1.2,
  JSON_OBJECT(), JSON_OBJECT(),
  TRUE, FALSE, TRUE, TRUE, TRUE,
  JSON_ARRAY(), JSON_ARRAY('breakfast', 'snack'), JSON_ARRAY('weight_loss'), JSON_ARRAY('tangy', 'mediterranean'),
  0, 'low', 80,
  '/images/nutrition/feta-cheese/main.jpg', '/images/nutrition/feta-cheese/thumbnail.jpg',
  TRUE, 1, NOW(), NOW()
);

INSERT IGNORE INTO nutrition_items (
  foodId, name, slug, category, servingSize,
  calories, protein, carbs, fats, fiber, sugar,
  vitamins, minerals,
  isVegetarian, isVegan, isGlutenFree, isDairyFree, isKeto,
  allergens, mealTypes, goals, tags,
  preparationTime, cost, popularityScore,
  imageUrl, thumbnailUrl, isActive, createdBy, createdAt, updatedAt
) VALUES (
  'food_082', 'Parmesan', 'parmesan', 'dairy', '28g',
  111, 10, 0.9, 7, 0, 0.2,
  JSON_OBJECT(), JSON_OBJECT(),
  TRUE, FALSE, TRUE, TRUE, TRUE,
  JSON_ARRAY(), JSON_ARRAY('breakfast', 'snack'), JSON_ARRAY('maintenance'), JSON_ARRAY('high_protein', 'flavor'),
  0, 'low', 85,
  '/images/nutrition/parmesan/main.jpg', '/images/nutrition/parmesan/thumbnail.jpg',
  TRUE, 1, NOW(), NOW()
);

INSERT IGNORE INTO nutrition_items (
  foodId, name, slug, category, servingSize,
  calories, protein, carbs, fats, fiber, sugar,
  vitamins, minerals,
  isVegetarian, isVegan, isGlutenFree, isDairyFree, isKeto,
  allergens, mealTypes, goals, tags,
  preparationTime, cost, popularityScore,
  imageUrl, thumbnailUrl, isActive, createdBy, createdAt, updatedAt
) VALUES (
  'food_083', 'Cream Cheese', 'cream-cheese', 'dairy', '28g',
  99, 1.8, 1.6, 10, 0, 0.8,
  JSON_OBJECT(), JSON_OBJECT(),
  TRUE, FALSE, TRUE, TRUE, TRUE,
  JSON_ARRAY(), JSON_ARRAY('breakfast', 'snack'), JSON_ARRAY('weight_loss'), JSON_ARRAY('creamy'),
  0, 'low', 82,
  '/images/nutrition/cream-cheese/main.jpg', '/images/nutrition/cream-cheese/thumbnail.jpg',
  TRUE, 1, NOW(), NOW()
);

INSERT IGNORE INTO nutrition_items (
  foodId, name, slug, category, servingSize,
  calories, protein, carbs, fats, fiber, sugar,
  vitamins, minerals,
  isVegetarian, isVegan, isGlutenFree, isDairyFree, isKeto,
  allergens, mealTypes, goals, tags,
  preparationTime, cost, popularityScore,
  imageUrl, thumbnailUrl, isActive, createdBy, createdAt, updatedAt
) VALUES (
  'food_084', 'Sour Cream', 'sour-cream', 'dairy', '2 tbsp',
  60, 0.7, 1.2, 6, 0, 0.6,
  JSON_OBJECT(), JSON_OBJECT(),
  TRUE, FALSE, TRUE, TRUE, TRUE,
  JSON_ARRAY(), JSON_ARRAY('breakfast', 'snack'), JSON_ARRAY('weight_loss'), JSON_ARRAY('creamy', 'topping'),
  0, 'low', 78,
  '/images/nutrition/sour-cream/main.jpg', '/images/nutrition/sour-cream/thumbnail.jpg',
  TRUE, 1, NOW(), NOW()
);

INSERT IGNORE INTO nutrition_items (
  foodId, name, slug, category, servingSize,
  calories, protein, carbs, fats, fiber, sugar,
  vitamins, minerals,
  isVegetarian, isVegan, isGlutenFree, isDairyFree, isKeto,
  allergens, mealTypes, goals, tags,
  preparationTime, cost, popularityScore,
  imageUrl, thumbnailUrl, isActive, createdBy, createdAt, updatedAt
) VALUES (
  'food_085', 'Butter', 'butter', 'fats', '1 tbsp',
  102, 0.1, 0, 12, 0, 0,
  JSON_OBJECT(), JSON_OBJECT(),
  TRUE, FALSE, TRUE, TRUE, TRUE,
  JSON_ARRAY(), JSON_ARRAY('breakfast', 'lunch', 'dinner'), JSON_ARRAY('maintenance'), JSON_ARRAY('cooking', 'flavor'),
  0, 'low', 85,
  '/images/nutrition/butter/main.jpg', '/images/nutrition/butter/thumbnail.jpg',
  TRUE, 1, NOW(), NOW()
);

INSERT IGNORE INTO nutrition_items (
  foodId, name, slug, category, servingSize,
  calories, protein, carbs, fats, fiber, sugar,
  vitamins, minerals,
  isVegetarian, isVegan, isGlutenFree, isDairyFree, isKeto,
  allergens, mealTypes, goals, tags,
  preparationTime, cost, popularityScore,
  imageUrl, thumbnailUrl, isActive, createdBy, createdAt, updatedAt
) VALUES (
  'food_086', 'Hummus', 'hummus', 'snacks', '2 tbsp',
  70, 2, 6, 4, 2, 0,
  JSON_OBJECT(), JSON_OBJECT(),
  TRUE, TRUE, TRUE, TRUE, FALSE,
  JSON_ARRAY(), JSON_ARRAY('snack'), JSON_ARRAY('weight_loss'), JSON_ARRAY('dip', 'protein'),
  0, 'low', 88,
  '/images/nutrition/hummus/main.jpg', '/images/nutrition/hummus/thumbnail.jpg',
  TRUE, 1, NOW(), NOW()
);

INSERT IGNORE INTO nutrition_items (
  foodId, name, slug, category, servingSize,
  calories, protein, carbs, fats, fiber, sugar,
  vitamins, minerals,
  isVegetarian, isVegan, isGlutenFree, isDairyFree, isKeto,
  allergens, mealTypes, goals, tags,
  preparationTime, cost, popularityScore,
  imageUrl, thumbnailUrl, isActive, createdBy, createdAt, updatedAt
) VALUES (
  'food_087', 'Guacamole', 'guacamole', 'snacks', '2 tbsp',
  50, 0.6, 3, 4.5, 2, 0.3,
  JSON_OBJECT(), JSON_OBJECT(),
  TRUE, TRUE, TRUE, TRUE, TRUE,
  JSON_ARRAY(), JSON_ARRAY('snack'), JSON_ARRAY('weight_loss'), JSON_ARRAY('healthy_fats', 'dip'),
  0, 'low', 90,
  '/images/nutrition/guacamole/main.jpg', '/images/nutrition/guacamole/thumbnail.jpg',
  TRUE, 1, NOW(), NOW()
);

INSERT IGNORE INTO nutrition_items (
  foodId, name, slug, category, servingSize,
  calories, protein, carbs, fats, fiber, sugar,
  vitamins, minerals,
  isVegetarian, isVegan, isGlutenFree, isDairyFree, isKeto,
  allergens, mealTypes, goals, tags,
  preparationTime, cost, popularityScore,
  imageUrl, thumbnailUrl, isActive, createdBy, createdAt, updatedAt
) VALUES (
  'food_088', 'Salsa', 'salsa', 'snacks', '2 tbsp',
  10, 0.3, 2, 0, 0.5, 1.2,
  JSON_OBJECT(), JSON_OBJECT(),
  TRUE, TRUE, TRUE, TRUE, TRUE,
  JSON_ARRAY(), JSON_ARRAY('snack'), JSON_ARRAY('weight_loss'), JSON_ARRAY('low_calorie', 'flavor'),
  0, 'low', 85,
  '/images/nutrition/salsa/main.jpg', '/images/nutrition/salsa/thumbnail.jpg',
  TRUE, 1, NOW(), NOW()
);

INSERT IGNORE INTO nutrition_items (
  foodId, name, slug, category, servingSize,
  calories, protein, carbs, fats, fiber, sugar,
  vitamins, minerals,
  isVegetarian, isVegan, isGlutenFree, isDairyFree, isKeto,
  allergens, mealTypes, goals, tags,
  preparationTime, cost, popularityScore,
  imageUrl, thumbnailUrl, isActive, createdBy, createdAt, updatedAt
) VALUES (
  'food_089', 'Rice Cakes', 'rice-cakes', 'snacks', '1 cake',
  35, 0.7, 7, 0.3, 0.4, 0,
  JSON_OBJECT(), JSON_OBJECT(),
  TRUE, TRUE, TRUE, TRUE, FALSE,
  JSON_ARRAY(), JSON_ARRAY('snack'), JSON_ARRAY('weight_loss'), JSON_ARRAY('low_calorie', 'crunchy'),
  0, 'low', 75,
  '/images/nutrition/rice-cakes/main.jpg', '/images/nutrition/rice-cakes/thumbnail.jpg',
  TRUE, 1, NOW(), NOW()
);

INSERT IGNORE INTO nutrition_items (
  foodId, name, slug, category, servingSize,
  calories, protein, carbs, fats, fiber, sugar,
  vitamins, minerals,
  isVegetarian, isVegan, isGlutenFree, isDairyFree, isKeto,
  allergens, mealTypes, goals, tags,
  preparationTime, cost, popularityScore,
  imageUrl, thumbnailUrl, isActive, createdBy, createdAt, updatedAt
) VALUES (
  'food_090', 'Popcorn (air-popped)', 'popcorn-air-popped-', 'snacks', '3 cups',
  93, 3, 18.6, 1.1, 3.6, 0.2,
  JSON_OBJECT(), JSON_OBJECT(),
  TRUE, TRUE, TRUE, TRUE, FALSE,
  JSON_ARRAY(), JSON_ARRAY('snack'), JSON_ARRAY('weight_loss'), JSON_ARRAY('whole_grain', 'fiber'),
  0, 'low', 85,
  '/images/nutrition/popcorn-air-popped-/main.jpg', '/images/nutrition/popcorn-air-popped-/thumbnail.jpg',
  TRUE, 1, NOW(), NOW()
);

INSERT IGNORE INTO nutrition_items (
  foodId, name, slug, category, servingSize,
  calories, protein, carbs, fats, fiber, sugar,
  vitamins, minerals,
  isVegetarian, isVegan, isGlutenFree, isDairyFree, isKeto,
  allergens, mealTypes, goals, tags,
  preparationTime, cost, popularityScore,
  imageUrl, thumbnailUrl, isActive, createdBy, createdAt, updatedAt
) VALUES (
  'food_091', 'Protein Bar', 'protein-bar', 'snacks', '1 bar',
  200, 20, 22, 7, 3, 12,
  JSON_OBJECT(), JSON_OBJECT(),
  TRUE, FALSE, TRUE, TRUE, FALSE,
  JSON_ARRAY(), JSON_ARRAY('snack'), JSON_ARRAY('muscle_gain'), JSON_ARRAY('convenient', 'protein'),
  0, 'low', 88,
  '/images/nutrition/protein-bar/main.jpg', '/images/nutrition/protein-bar/thumbnail.jpg',
  TRUE, 1, NOW(), NOW()
);

INSERT IGNORE INTO nutrition_items (
  foodId, name, slug, category, servingSize,
  calories, protein, carbs, fats, fiber, sugar,
  vitamins, minerals,
  isVegetarian, isVegan, isGlutenFree, isDairyFree, isKeto,
  allergens, mealTypes, goals, tags,
  preparationTime, cost, popularityScore,
  imageUrl, thumbnailUrl, isActive, createdBy, createdAt, updatedAt
) VALUES (
  'food_092', 'Granola', 'granola', 'snacks', '1/4 cup',
  140, 3, 18, 7, 2, 6,
  JSON_OBJECT(), JSON_OBJECT(),
  TRUE, TRUE, FALSE, TRUE, FALSE,
  JSON_ARRAY(), JSON_ARRAY('snack'), JSON_ARRAY('maintenance'), JSON_ARRAY('crunchy', 'energy'),
  0, 'low', 82,
  '/images/nutrition/granola/main.jpg', '/images/nutrition/granola/thumbnail.jpg',
  TRUE, 1, NOW(), NOW()
);

INSERT IGNORE INTO nutrition_items (
  foodId, name, slug, category, servingSize,
  calories, protein, carbs, fats, fiber, sugar,
  vitamins, minerals,
  isVegetarian, isVegan, isGlutenFree, isDairyFree, isKeto,
  allergens, mealTypes, goals, tags,
  preparationTime, cost, popularityScore,
  imageUrl, thumbnailUrl, isActive, createdBy, createdAt, updatedAt
) VALUES (
  'food_093', 'Trail Mix', 'trail-mix', 'snacks', '1/4 cup',
  173, 5, 17, 11, 2, 11,
  JSON_OBJECT(), JSON_OBJECT(),
  TRUE, TRUE, TRUE, TRUE, FALSE,
  JSON_ARRAY(), JSON_ARRAY('snack'), JSON_ARRAY('maintenance'), JSON_ARRAY('portable', 'energy'),
  0, 'low', 85,
  '/images/nutrition/trail-mix/main.jpg', '/images/nutrition/trail-mix/thumbnail.jpg',
  TRUE, 1, NOW(), NOW()
);

INSERT IGNORE INTO nutrition_items (
  foodId, name, slug, category, servingSize,
  calories, protein, carbs, fats, fiber, sugar,
  vitamins, minerals,
  isVegetarian, isVegan, isGlutenFree, isDairyFree, isKeto,
  allergens, mealTypes, goals, tags,
  preparationTime, cost, popularityScore,
  imageUrl, thumbnailUrl, isActive, createdBy, createdAt, updatedAt
) VALUES (
  'food_094', 'Beef Jerky', 'beef-jerky', 'snacks', '28g',
  116, 9, 3, 7, 0.5, 3,
  JSON_OBJECT(), JSON_OBJECT(),
  FALSE, FALSE, TRUE, TRUE, TRUE,
  JSON_ARRAY(), JSON_ARRAY('snack'), JSON_ARRAY('maintenance'), JSON_ARRAY('high_protein', 'portable'),
  0, 'low', 80,
  '/images/nutrition/beef-jerky/main.jpg', '/images/nutrition/beef-jerky/thumbnail.jpg',
  TRUE, 1, NOW(), NOW()
);

INSERT IGNORE INTO nutrition_items (
  foodId, name, slug, category, servingSize,
  calories, protein, carbs, fats, fiber, sugar,
  vitamins, minerals,
  isVegetarian, isVegan, isGlutenFree, isDairyFree, isKeto,
  allergens, mealTypes, goals, tags,
  preparationTime, cost, popularityScore,
  imageUrl, thumbnailUrl, isActive, createdBy, createdAt, updatedAt
) VALUES (
  'food_095', 'Seaweed Snacks', 'seaweed-snacks', 'snacks', '5g',
  25, 1, 1, 1.5, 1, 0,
  JSON_OBJECT(), JSON_OBJECT(),
  TRUE, TRUE, TRUE, TRUE, TRUE,
  JSON_ARRAY(), JSON_ARRAY('snack'), JSON_ARRAY('weight_loss'), JSON_ARRAY('low_calorie', 'iodine'),
  0, 'low', 72,
  '/images/nutrition/seaweed-snacks/main.jpg', '/images/nutrition/seaweed-snacks/thumbnail.jpg',
  TRUE, 1, NOW(), NOW()
);

INSERT IGNORE INTO nutrition_items (
  foodId, name, slug, category, servingSize,
  calories, protein, carbs, fats, fiber, sugar,
  vitamins, minerals,
  isVegetarian, isVegan, isGlutenFree, isDairyFree, isKeto,
  allergens, mealTypes, goals, tags,
  preparationTime, cost, popularityScore,
  imageUrl, thumbnailUrl, isActive, createdBy, createdAt, updatedAt
) VALUES (
  'food_096', 'Edamame (frozen)', 'edamame-frozen-', 'snacks', '1/2 cup',
  95, 8, 8, 4, 4, 2,
  JSON_OBJECT(), JSON_OBJECT(),
  TRUE, TRUE, TRUE, TRUE, FALSE,
  JSON_ARRAY(), JSON_ARRAY('snack'), JSON_ARRAY('weight_loss'), JSON_ARRAY('protein', 'fiber'),
  0, 'low', 80,
  '/images/nutrition/edamame-frozen-/main.jpg', '/images/nutrition/edamame-frozen-/thumbnail.jpg',
  TRUE, 1, NOW(), NOW()
);

INSERT IGNORE INTO nutrition_items (
  foodId, name, slug, category, servingSize,
  calories, protein, carbs, fats, fiber, sugar,
  vitamins, minerals,
  isVegetarian, isVegan, isGlutenFree, isDairyFree, isKeto,
  allergens, mealTypes, goals, tags,
  preparationTime, cost, popularityScore,
  imageUrl, thumbnailUrl, isActive, createdBy, createdAt, updatedAt
) VALUES (
  'food_097', 'String Cheese', 'string-cheese', 'snacks', '1 stick',
  80, 6, 1, 6, 0, 0,
  JSON_OBJECT(), JSON_OBJECT(),
  TRUE, FALSE, TRUE, TRUE, TRUE,
  JSON_ARRAY(), JSON_ARRAY('snack'), JSON_ARRAY('weight_loss'), JSON_ARRAY('portable', 'protein'),
  0, 'low', 85,
  '/images/nutrition/string-cheese/main.jpg', '/images/nutrition/string-cheese/thumbnail.jpg',
  TRUE, 1, NOW(), NOW()
);

INSERT IGNORE INTO nutrition_items (
  foodId, name, slug, category, servingSize,
  calories, protein, carbs, fats, fiber, sugar,
  vitamins, minerals,
  isVegetarian, isVegan, isGlutenFree, isDairyFree, isKeto,
  allergens, mealTypes, goals, tags,
  preparationTime, cost, popularityScore,
  imageUrl, thumbnailUrl, isActive, createdBy, createdAt, updatedAt
) VALUES (
  'food_098', 'Hard Boiled Egg', 'hard-boiled-egg', 'snacks', '1 large',
  78, 6, 0.6, 5, 0, 0.6,
  JSON_OBJECT(), JSON_OBJECT(),
  TRUE, FALSE, TRUE, TRUE, TRUE,
  JSON_ARRAY(), JSON_ARRAY('snack'), JSON_ARRAY('weight_loss'), JSON_ARRAY('portable', 'protein'),
  0, 'low', 88,
  '/images/nutrition/hard-boiled-egg/main.jpg', '/images/nutrition/hard-boiled-egg/thumbnail.jpg',
  TRUE, 1, NOW(), NOW()
);

INSERT IGNORE INTO nutrition_items (
  foodId, name, slug, category, servingSize,
  calories, protein, carbs, fats, fiber, sugar,
  vitamins, minerals,
  isVegetarian, isVegan, isGlutenFree, isDairyFree, isKeto,
  allergens, mealTypes, goals, tags,
  preparationTime, cost, popularityScore,
  imageUrl, thumbnailUrl, isActive, createdBy, createdAt, updatedAt
) VALUES (
  'food_099', 'Protein Shake', 'protein-shake', 'snacks', '1 serving',
  160, 30, 5, 2, 1, 2,
  JSON_OBJECT(), JSON_OBJECT(),
  TRUE, FALSE, TRUE, TRUE, TRUE,
  JSON_ARRAY(), JSON_ARRAY('snack'), JSON_ARRAY('muscle_gain'), JSON_ARRAY('convenient', 'post_workout'),
  0, 'low', 90,
  '/images/nutrition/protein-shake/main.jpg', '/images/nutrition/protein-shake/thumbnail.jpg',
  TRUE, 1, NOW(), NOW()
);

INSERT IGNORE INTO nutrition_items (
  foodId, name, slug, category, servingSize,
  calories, protein, carbs, fats, fiber, sugar,
  vitamins, minerals,
  isVegetarian, isVegan, isGlutenFree, isDairyFree, isKeto,
  allergens, mealTypes, goals, tags,
  preparationTime, cost, popularityScore,
  imageUrl, thumbnailUrl, isActive, createdBy, createdAt, updatedAt
) VALUES (
  'food_100', 'Energy Balls', 'energy-balls', 'snacks', '1 ball',
  100, 3, 12, 5, 2, 7,
  JSON_OBJECT(), JSON_OBJECT(),
  TRUE, TRUE, TRUE, TRUE, FALSE,
  JSON_ARRAY(), JSON_ARRAY('snack'), JSON_ARRAY('maintenance'), JSON_ARRAY('homemade', 'energy'),
  0, 'low', 78,
  '/images/nutrition/energy-balls/main.jpg', '/images/nutrition/energy-balls/thumbnail.jpg',
  TRUE, 1, NOW(), NOW()
);

-- ============================================
-- Summary: 100 nutrition items added
-- Categories:
--   - Protein: 25
--   - Carbs: 8
--   - Fats: 12
--   - Fruits: 10
--   - Vegetables: 21
--   - Dairy: 9
--   - Snacks: 15
-- ============================================
