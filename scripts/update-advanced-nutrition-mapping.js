const fs = require('fs');
const path = require('path');

// Load nutrition data
const nutritionData = require('../data/nutrition_advanced.json');

// Create advanced nutrition image mapping structure
const advancedNutritionMapping = {
  version: "2.0.0",
  description: "Advanced nutrition image mapping with multiple images per food item",
  lastUpdated: new Date().toISOString(),
  
  foods: {}
};

// Generate mapping for each food item
nutritionData.foods.forEach(food => {
  const slug = food.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  
  advancedNutritionMapping.foods[food.id] = {
    name: food.name,
    slug: slug,
    basePath: `/images/nutrition/${slug}`,
    
    // Main images
    main: {
      primary: `/images/nutrition/${slug}/main/${slug}-main.jpg`,
      raw: `/images/nutrition/${slug}/main/${slug}-raw.jpg`,
      cooked: `/images/nutrition/${slug}/main/${slug}-cooked.jpg`,
      thumbnail: `/images/thumbnails/nutrition/${slug}/${slug}-thumb.jpg`
    },
    
    // Different preparation methods
    prepared: {
      grilled: `/images/nutrition/${slug}/prepared/grilled.jpg`,
      baked: `/images/nutrition/${slug}/prepared/baked.jpg`,
      steamed: `/images/nutrition/${slug}/prepared/steamed.jpg`,
      raw: `/images/nutrition/${slug}/prepared/raw.jpg`,
      boiled: `/images/nutrition/${slug}/prepared/boiled.jpg`,
      fried: `/images/nutrition/${slug}/prepared/fried.jpg`
    },
    
    // Portion size references
    portions: {
      serving100g: `/images/nutrition/${slug}/portions/100g-portion.jpg`,
      servingSize: `/images/nutrition/${slug}/portions/serving-size.jpg`,
      comparison: `/images/nutrition/${slug}/portions/comparison.jpg`,
      handPortion: `/images/nutrition/${slug}/portions/hand-portion.jpg`
    },
    
    // Nutrition facts
    nutritionLabel: {
      label: `/images/nutrition/${slug}/nutrition-label/label.jpg`,
      macrosBreakdown: `/images/nutrition/${slug}/nutrition-label/macros-breakdown.jpg`,
      microsChart: `/images/nutrition/${slug}/nutrition-label/micros-chart.jpg`,
      infographic: `/images/nutrition/${slug}/nutrition-label/infographic.jpg`
    },
    
    // Recipe ideas
    recipes: [
      {
        name: "Recipe 1",
        image: `/images/nutrition/${slug}/recipes/recipe-1.jpg`
      },
      {
        name: "Recipe 2",
        image: `/images/nutrition/${slug}/recipes/recipe-2.jpg`
      },
      {
        name: "Recipe 3",
        image: `/images/nutrition/${slug}/recipes/recipe-3.jpg`
      }
    ],
    
    // Meal prep examples
    mealPrep: {
      storage: `/images/nutrition/${slug}/meal-prep/storage.jpg`,
      containers: `/images/nutrition/${slug}/meal-prep/containers.jpg`,
      weeklyPrep: `/images/nutrition/${slug}/meal-prep/weekly-prep.jpg`,
      portioned: `/images/nutrition/${slug}/meal-prep/portioned.jpg`
    },
    
    // Alternative foods
    alternatives: [
      `/images/nutrition/${slug}/alternatives/alternative-1.jpg`,
      `/images/nutrition/${slug}/alternatives/alternative-2.jpg`,
      `/images/nutrition/${slug}/alternatives/alternative-3.jpg`
    ],
    
    // Additional resources
    extras: {
      selectionGuide: `/images/nutrition/${slug}/extras/selection-guide.jpg`,
      storageGuide: `/images/nutrition/${slug}/extras/storage-guide.jpg`,
      seasonalInfo: `/images/nutrition/${slug}/extras/seasonal-info.jpg`
    }
  };
});

// Save the advanced mapping
const outputPath = path.join(__dirname, '../data/nutrition-mapping-advanced.json');
fs.writeFileSync(outputPath, JSON.stringify(advancedNutritionMapping, null, 2));

console.log('✅ Advanced nutrition image mapping created!');
console.log(`📁 Saved to: ${outputPath}`);
console.log(`\n📊 Mapped ${Object.keys(advancedNutritionMapping.foods).length} food items`);
console.log('\n🎯 Each food item now has:');
console.log('   • Main images (primary, raw, cooked)');
console.log('   • Preparation methods (6 types)');
console.log('   • Portion references (4 types)');
console.log('   • Nutrition labels & infographics');
console.log('   • Recipe ideas (3+ examples)');
console.log('   • Meal prep examples');
console.log('   • Alternative foods');
console.log('   • Selection & storage guides');
