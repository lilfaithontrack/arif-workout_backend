require('dotenv').config();
const fs = require('fs').promises;
const path = require('path');
const Exercise = require('../models/exercise.model');
const NutritionItem = require('../models/nutritionitem.model');

/**
 * Create image folders for all exercises and nutrition items
 */
async function createImageFolders() {
  try {
    console.log('📁 Creating image folders for exercises and nutrition items...\n');

    const baseImagesPath = path.join(__dirname, '../../public/images');
    
    // Ensure base directories exist
    const exercisesBasePath = path.join(baseImagesPath, 'exercises');
    const nutritionBasePath = path.join(baseImagesPath, 'nutrition');
    
    await fs.mkdir(exercisesBasePath, { recursive: true });
    await fs.mkdir(nutritionBasePath, { recursive: true });

    // Subfolders for exercises
    const exerciseSubfolders = ['main', 'thumbnail', 'steps', 'variations'];
    
    // Subfolders for nutrition
    const nutritionSubfolders = ['main', 'thumbnail', 'prepared', 'ingredients'];

    // Get all exercises
    const exercises = await Exercise.findAll({
      where: { isActive: true },
      attributes: ['id', 'slug', 'name']
    });

    console.log(`📋 Found ${exercises.length} exercises`);
    let exerciseFoldersCreated = 0;

    // Create folders for each exercise
    for (const exercise of exercises) {
      const exercisePath = path.join(exercisesBasePath, exercise.slug);
      
      try {
        // Create base folder
        await fs.mkdir(exercisePath, { recursive: true });
        
        // Create subfolders
        for (const subfolder of exerciseSubfolders) {
          const subfolderPath = path.join(exercisePath, subfolder);
          await fs.mkdir(subfolderPath, { recursive: true });
        }
        
        exerciseFoldersCreated++;
        
        if (exerciseFoldersCreated % 50 === 0) {
          console.log(`  ✅ Created ${exerciseFoldersCreated} exercise folders...`);
        }
      } catch (error) {
        console.error(`  ❌ Error creating folder for ${exercise.slug}:`, error.message);
      }
    }

    console.log(`✅ Created ${exerciseFoldersCreated} exercise folders with subfolders\n`);

    // Get all nutrition items
    const nutritionItems = await NutritionItem.findAll({
      where: { isActive: true },
      attributes: ['id', 'name']
    });

    console.log(`📋 Found ${nutritionItems.length} nutrition items`);
    let nutritionFoldersCreated = 0;

    // Create folders for each nutrition item
    for (const item of nutritionItems) {
      // Create slug from name
      const slug = item.name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      
      const nutritionPath = path.join(nutritionBasePath, slug);
      
      try {
        // Create base folder
        await fs.mkdir(nutritionPath, { recursive: true });
        
        // Create subfolders
        for (const subfolder of nutritionSubfolders) {
          const subfolderPath = path.join(nutritionPath, subfolder);
          await fs.mkdir(subfolderPath, { recursive: true });
        }
        
        nutritionFoldersCreated++;
        
        if (nutritionFoldersCreated % 50 === 0) {
          console.log(`  ✅ Created ${nutritionFoldersCreated} nutrition folders...`);
        }
      } catch (error) {
        console.error(`  ❌ Error creating folder for ${slug}:`, error.message);
      }
    }

    console.log(`✅ Created ${nutritionFoldersCreated} nutrition folders with subfolders\n`);

    // Summary
    console.log('📊 Summary:');
    console.log(`  • Exercise folders: ${exerciseFoldersCreated}/${exercises.length}`);
    console.log(`  • Nutrition folders: ${nutritionFoldersCreated}/${nutritionItems.length}`);
    console.log(`  • Exercise subfolders: ${exerciseSubfolders.join(', ')}`);
    console.log(`  • Nutrition subfolders: ${nutritionSubfolders.join(', ')}`);
    console.log('\n🎉 Image folder structure created successfully!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  }
}

createImageFolders();
