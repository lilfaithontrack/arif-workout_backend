const fs = require('fs');
const path = require('path');

/**
 * Update JSON databases with correct image paths
 */

function updateImagePaths() {
  console.log('🔄 Updating image paths in JSON databases...\n');

  // Load image mapping
  const mappingPath = path.join(__dirname, '../data/image-mapping.json');
  const mapping = JSON.parse(fs.readFileSync(mappingPath, 'utf8'));

  // Load exercises database
  const exercisesPath = path.join(__dirname, '../data/exercises_database.json');
  const exercisesDB = JSON.parse(fs.readFileSync(exercisesPath, 'utf8'));

  // Load nutrition database
  const nutritionPath = path.join(__dirname, '../data/nutrition_database.json');
  const nutritionDB = JSON.parse(fs.readFileSync(nutritionPath, 'utf8'));

  // Update exercise images
  console.log('📸 Updating exercise images...');
  exercisesDB.exercises.forEach(exercise => {
    const imageInfo = mapping.exercises[exercise.id];
    if (imageInfo) {
      exercise.imageUrl = imageInfo.path;
      exercise.thumbnailUrl = imageInfo.thumbnail;
      exercise.videoUrl = `/videos/exercises/${imageInfo.filename}.mp4`; // Placeholder
      console.log(`  ✓ ${exercise.name}: ${imageInfo.path}`);
    }
  });

  // Update nutrition images
  console.log('\n🍎 Updating nutrition images...');
  nutritionDB.foods.forEach(food => {
    const imageInfo = mapping.nutrition[food.id];
    if (imageInfo) {
      food.imageUrl = imageInfo.path;
      food.thumbnailUrl = imageInfo.thumbnail;
      console.log(`  ✓ ${food.name}: ${imageInfo.path}`);
    }
  });

  // Save updated databases
  fs.writeFileSync(exercisesPath, JSON.stringify(exercisesDB, null, 2));
  fs.writeFileSync(nutritionPath, JSON.stringify(nutritionDB, null, 2));

  console.log('\n✅ Image paths updated successfully!');
  console.log(`\nUpdated files:`);
  console.log(`  - ${exercisesPath}`);
  console.log(`  - ${nutritionPath}`);
}

// Run update
if (require.main === module) {
  updateImagePaths();
}

module.exports = { updateImagePaths };
