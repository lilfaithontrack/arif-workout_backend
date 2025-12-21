const fs = require('fs');
const path = require('path');

/**
 * Setup Image Placeholders
 * Creates placeholder images and proper naming structure
 */

const EXERCISE_NAMES = [
  'pushups',
  'squats',
  'plank',
  'lunges',
  'burpees',
  'mountain-climbers',
  'dumbbell-bench-press',
  'deadlifts',
  'pullups',
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
  'superman-hold'
];

const NUTRITION_NAMES = [
  'grilled-chicken-breast',
  'brown-rice',
  'salmon-fillet',
  'greek-yogurt',
  'oatmeal',
  'avocado',
  'eggs',
  'sweet-potato',
  'almonds',
  'broccoli',
  'banana',
  'quinoa',
  'spinach',
  'whey-protein-shake',
  'peanut-butter'
];

const WORKOUT_PLAN_NAMES = [
  'beginner-full-body',
  'intermediate-strength',
  'advanced-hiit',
  'weight-loss-cardio',
  'muscle-gain-split',
  'home-workout-no-equipment',
  'gym-based-program',
  'flexibility-yoga'
];

/**
 * Create placeholder text file
 */
function createPlaceholder(directory, filename, type) {
  const filepath = path.join(directory, `${filename}.txt`);
  const content = `PLACEHOLDER: ${filename}

This is a placeholder for the ${type} image: ${filename}

To add the actual image:
1. Download/create the image for "${filename}"
2. Save it as: ${filename}.jpg or ${filename}.png
3. Replace this placeholder file

Recommended image specifications:
- Format: JPG or PNG
- Size: 800x600px (landscape) or 600x800px (portrait)
- Max file size: 500KB
- Quality: High resolution, clear, well-lit

Free image sources:
- Unsplash: https://unsplash.com/s/photos/${filename.replace(/-/g, '-')}
- Pexels: https://www.pexels.com/search/${filename.replace(/-/g, '%20')}
- Pixabay: https://pixabay.com/images/search/${filename.replace(/-/g, '%20')}

For ${type}:
${type === 'exercise' ? '- Show proper form and technique\n- Clear view of the movement\n- Professional quality' : ''}
${type === 'nutrition' ? '- High-quality food photography\n- Well-plated and appealing\n- Natural lighting' : ''}
${type === 'workout-plan' ? '- Motivational fitness imagery\n- Action shots or equipment\n- Professional quality' : ''}
`;

  fs.writeFileSync(filepath, content);
  return filepath;
}

/**
 * Create image mapping file
 */
function createImageMapping() {
  const mapping = {
    exercises: {},
    nutrition: {},
    workoutPlans: {}
  };

  EXERCISE_NAMES.forEach((name, index) => {
    mapping.exercises[`ex_${String(index + 1).padStart(3, '0')}`] = {
      filename: name,
      path: `/images/exercises/${name}.jpg`,
      thumbnail: `/images/thumbnails/exercises/${name}_thumb.jpg`,
      alt: name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    };
  });

  NUTRITION_NAMES.forEach((name, index) => {
    mapping.nutrition[`food_${String(index + 1).padStart(3, '0')}`] = {
      filename: name,
      path: `/images/nutrition/${name}.jpg`,
      thumbnail: `/images/thumbnails/nutrition/${name}_thumb.jpg`,
      alt: name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    };
  });

  WORKOUT_PLAN_NAMES.forEach((name, index) => {
    mapping.workoutPlans[`plan_${String(index + 1).padStart(3, '0')}`] = {
      filename: name,
      path: `/images/workout-plans/${name}.jpg`,
      thumbnail: `/images/thumbnails/workout-plans/${name}_thumb.jpg`,
      alt: name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    };
  });

  return mapping;
}

/**
 * Main setup function
 */
function setupImages() {
  console.log('🎨 Setting up image structure...\n');

  const baseDir = path.join(__dirname, '../public/images');
  const exerciseDir = path.join(baseDir, 'exercises');
  const nutritionDir = path.join(baseDir, 'nutrition');
  const workoutPlansDir = path.join(baseDir, 'workout-plans');
  const thumbnailsDir = path.join(baseDir, 'thumbnails');

  // Create subdirectories for thumbnails
  const thumbExerciseDir = path.join(thumbnailsDir, 'exercises');
  const thumbNutritionDir = path.join(thumbnailsDir, 'nutrition');
  const thumbWorkoutPlansDir = path.join(thumbnailsDir, 'workout-plans');

  // Ensure all directories exist
  [exerciseDir, nutritionDir, workoutPlansDir, 
   thumbExerciseDir, thumbNutritionDir, thumbWorkoutPlansDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  // Create exercise placeholders
  console.log('📸 Creating exercise image placeholders...');
  EXERCISE_NAMES.forEach(name => {
    createPlaceholder(exerciseDir, name, 'exercise');
  });
  console.log(`✓ Created ${EXERCISE_NAMES.length} exercise placeholders`);

  // Create nutrition placeholders
  console.log('\n🍎 Creating nutrition image placeholders...');
  NUTRITION_NAMES.forEach(name => {
    createPlaceholder(nutritionDir, name, 'nutrition');
  });
  console.log(`✓ Created ${NUTRITION_NAMES.length} nutrition placeholders`);

  // Create workout plan placeholders
  console.log('\n💪 Creating workout plan image placeholders...');
  WORKOUT_PLAN_NAMES.forEach(name => {
    createPlaceholder(workoutPlansDir, name, 'workout-plan');
  });
  console.log(`✓ Created ${WORKOUT_PLAN_NAMES.length} workout plan placeholders`);

  // Create image mapping file
  const mapping = createImageMapping();
  const mappingPath = path.join(__dirname, '../data/image-mapping.json');
  fs.writeFileSync(mappingPath, JSON.stringify(mapping, null, 2));
  console.log(`\n✓ Created image mapping file: ${mappingPath}`);

  // Create README
  const readmePath = path.join(baseDir, 'README.md');
  const readme = `# Image Assets

## Directory Structure

\`\`\`
public/images/
├── exercises/          # Exercise demonstration images
├── nutrition/          # Food and meal images
├── workout-plans/      # Workout plan cover images
├── users/              # User profile pictures
└── thumbnails/         # Thumbnail versions
    ├── exercises/
    ├── nutrition/
    └── workout-plans/
\`\`\`

## Image Specifications

### Exercise Images
- **Format:** JPG or PNG
- **Dimensions:** 800x600px (landscape)
- **Max Size:** 500KB
- **Content:** Clear demonstration of proper form

### Nutrition Images
- **Format:** JPG or PNG
- **Dimensions:** 600x600px (square)
- **Max Size:** 300KB
- **Content:** High-quality food photography

### Workout Plan Images
- **Format:** JPG or PNG
- **Dimensions:** 1200x800px (landscape)
- **Max Size:** 800KB
- **Content:** Motivational fitness imagery

### Thumbnails
- **Dimensions:** 200x200px (square)
- **Max Size:** 50KB
- **Format:** JPG (optimized)

## Adding Images

1. Download or create your image
2. Optimize for web (compress, resize)
3. Name according to the placeholder files
4. Replace the .txt placeholder with your .jpg/.png file
5. Create a thumbnail version in the thumbnails folder

## Free Image Sources

- **Unsplash:** https://unsplash.com (Free high-quality images)
- **Pexels:** https://www.pexels.com (Free stock photos)
- **Pixabay:** https://pixabay.com (Free images and videos)
- **Freepik:** https://www.freepik.com (Free vectors and photos)

## Image Optimization Tools

- **TinyPNG:** https://tinypng.com (Compress PNG/JPG)
- **Squoosh:** https://squoosh.app (Google's image optimizer)
- **ImageOptim:** https://imageoptim.com (Mac app)
- **GIMP:** https://www.gimp.org (Free image editor)

## Current Status

- Exercise placeholders: ${EXERCISE_NAMES.length}
- Nutrition placeholders: ${NUTRITION_NAMES.length}
- Workout plan placeholders: ${WORKOUT_PLAN_NAMES.length}

Replace placeholder .txt files with actual images (.jpg or .png) with the same filename.
`;

  fs.writeFileSync(readmePath, readme);
  console.log(`✓ Created README: ${readmePath}`);

  console.log('\n✅ Image structure setup complete!\n');
  console.log('Next steps:');
  console.log('1. Download images from free sources (Unsplash, Pexels, Pixabay)');
  console.log('2. Replace .txt placeholders with actual .jpg/.png files');
  console.log('3. Create thumbnail versions (200x200px)');
  console.log('4. Update JSON databases with correct image paths');
  console.log('\nSee public/images/README.md for detailed instructions.');
}

// Run setup
if (require.main === module) {
  setupImages();
}

module.exports = { setupImages, createImageMapping };
