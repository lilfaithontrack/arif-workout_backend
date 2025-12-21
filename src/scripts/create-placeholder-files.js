require('dotenv').config();
const fs = require('fs');
const path = require('path');

// List of exercise folders that need placeholder files
const exercises = [
  'dumbbell-bench-press',
  'deadlifts',
  'pull-ups',
  'bicycle-crunches',
  'jumping-jacks',
  'dumbbell-rows',
  'leg-raises',
  'shoulder-press',
  'russian-twists',
  'high-knees',
  'tricep-dips',
  'glute-bridges',
  'box-jumps',
  'superman-hold',
  'lunges',
  'burpees',
  'mountain-climbers',
  'plank',
  'squats'
];

function createPlaceholderFile(exerciseName) {
  const content = `PLACEHOLDER: ${exerciseName}

This is a placeholder for the exercise image: ${exerciseName}

To add the actual image:
1. Download/create the image for "${exerciseName}"
2. Save it as: ${exerciseName}.jpg or ${exerciseName}.png
3. Replace this placeholder file

Recommended image specifications:
- Format: JPG or PNG
- Size: 800x600px (landscape) or 600x800px (portrait)
- Max file size: 500KB
- Quality: High resolution, clear, well-lit

Free image sources:
- Unsplash: https://unsplash.com/s/photos/${exerciseName.replace('-', ' ')}
- Pexels: https://www.pexels.com/search/${exerciseName.replace('-', ' ')}
- Pixabay: https://pixabay.com/images/search/${exerciseName.replace('-', ' ')}

For exercise:
- Show proper form and technique
- Clear view of the movement
- Professional quality
`;

  return content;
}

async function createAllPlaceholderFiles() {
  try {
    console.log('🔧 Creating placeholder files for exercises...');
    
    const exercisesDir = path.join(__dirname, '../../public/images/exercises');
    let createdCount = 0;
    
    for (const exercise of exercises) {
      const placeholderPath = path.join(exercisesDir, exercise, `${exercise}.txt`);
      
      if (fs.existsSync(path.join(exercisesDir, exercise))) {
        const content = createPlaceholderFile(exercise);
        fs.writeFileSync(placeholderPath, content, 'utf8');
        console.log(`✅ Created placeholder for: ${exercise}`);
        createdCount++;
      } else {
        console.log(`⚠️ Skipped: ${exercise} (folder not found)`);
      }
    }
    
    console.log(`\n🎉 Successfully created ${createdCount} placeholder files!`);
    
  } catch (error) {
    console.error('❌ Error creating placeholder files:', error);
  }
}

// Run the generator
if (require.main === module) {
  createAllPlaceholderFiles();
}

module.exports = { createAllPlaceholderFiles };
