const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

/**
 * Image Download Script
 * Downloads exercise and nutrition images from free sources
 */

// Free image sources (Unsplash, Pexels offer free APIs)
const EXERCISE_IMAGES = [
  // Push-ups
  { url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800', filename: 'pushups.jpg' },
  // Squats
  { url: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800', filename: 'squats.jpg' },
  // Plank
  { url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800', filename: 'plank.jpg' },
  // Lunges
  { url: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800', filename: 'lunges.jpg' },
  // Burpees
  { url: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800', filename: 'burpees.jpg' },
  // Mountain Climbers
  { url: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800', filename: 'mountain-climbers.jpg' },
  // Dumbbell Bench Press
  { url: 'https://images.unsplash.com/photo-1532029837206-abbe2b7620e3?w=800', filename: 'dumbbell-bench-press.jpg' },
  // Deadlifts
  { url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800', filename: 'deadlifts.jpg' },
  // Pull-ups
  { url: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=800', filename: 'pullups.jpg' },
  // Bicycle Crunches
  { url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800', filename: 'bicycle-crunches.jpg' },
  // Jumping Jacks
  { url: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800', filename: 'jumping-jacks.jpg' },
  // Dumbbell Rows
  { url: 'https://images.unsplash.com/photo-1532029837206-abbe2b7620e3?w=800', filename: 'dumbbell-rows.jpg' },
  // Leg Raises
  { url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800', filename: 'leg-raises.jpg' },
  // Shoulder Press
  { url: 'https://images.unsplash.com/photo-1532029837206-abbe2b7620e3?w=800', filename: 'shoulder-press.jpg' },
  // Russian Twists
  { url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800', filename: 'russian-twists.jpg' },
  // High Knees
  { url: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800', filename: 'high-knees.jpg' },
  // Tricep Dips
  { url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800', filename: 'tricep-dips.jpg' },
  // Glute Bridges
  { url: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800', filename: 'glute-bridges.jpg' },
  // Box Jumps
  { url: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800', filename: 'box-jumps.jpg' },
  // Superman Hold
  { url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800', filename: 'superman-hold.jpg' }
];

const NUTRITION_IMAGES = [
  // Grilled Chicken Breast
  { url: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=800', filename: 'grilled-chicken-breast.jpg' },
  // Brown Rice
  { url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800', filename: 'brown-rice.jpg' },
  // Salmon Fillet
  { url: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800', filename: 'salmon-fillet.jpg' },
  // Greek Yogurt
  { url: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800', filename: 'greek-yogurt.jpg' },
  // Oatmeal
  { url: 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=800', filename: 'oatmeal.jpg' },
  // Avocado
  { url: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=800', filename: 'avocado.jpg' },
  // Eggs
  { url: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=800', filename: 'eggs.jpg' },
  // Sweet Potato
  { url: 'https://images.unsplash.com/photo-1589927986089-35812388d1f4?w=800', filename: 'sweet-potato.jpg' },
  // Almonds
  { url: 'https://images.unsplash.com/photo-1508747703725-719777637510?w=800', filename: 'almonds.jpg' },
  // Broccoli
  { url: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=800', filename: 'broccoli.jpg' },
  // Banana
  { url: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=800', filename: 'banana.jpg' },
  // Quinoa
  { url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800', filename: 'quinoa.jpg' },
  // Spinach
  { url: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=800', filename: 'spinach.jpg' },
  // Whey Protein Shake
  { url: 'https://images.unsplash.com/photo-1622484211850-cc1f5b2e7b88?w=800', filename: 'whey-protein-shake.jpg' },
  // Peanut Butter
  { url: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=800', filename: 'peanut-butter.jpg' }
];

/**
 * Download a single image
 */
function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    
    const file = fs.createWriteStream(filepath);
    
    protocol.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`✓ Downloaded: ${path.basename(filepath)}`);
          resolve();
        });
      } else if (response.statusCode === 301 || response.statusCode === 302) {
        // Handle redirect
        downloadImage(response.headers.location, filepath).then(resolve).catch(reject);
      } else {
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
      }
    }).on('error', (err) => {
      fs.unlink(filepath, () => {}); // Delete the file on error
      reject(err);
    });
  });
}

/**
 * Download all images
 */
async function downloadAllImages() {
  console.log('🚀 Starting image download...\n');

  // Create directories if they don't exist
  const exerciseDir = path.join(__dirname, '../public/images/exercises');
  const nutritionDir = path.join(__dirname, '../public/images/nutrition');

  if (!fs.existsSync(exerciseDir)) {
    fs.mkdirSync(exerciseDir, { recursive: true });
  }
  if (!fs.existsSync(nutritionDir)) {
    fs.mkdirSync(nutritionDir, { recursive: true });
  }

  // Download exercise images
  console.log('📸 Downloading exercise images...');
  for (const image of EXERCISE_IMAGES) {
    const filepath = path.join(exerciseDir, image.filename);
    try {
      await downloadImage(image.url, filepath);
      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error(`✗ Failed to download ${image.filename}:`, error.message);
    }
  }

  // Download nutrition images
  console.log('\n🍎 Downloading nutrition images...');
  for (const image of NUTRITION_IMAGES) {
    const filepath = path.join(nutritionDir, image.filename);
    try {
      await downloadImage(image.url, filepath);
      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error(`✗ Failed to download ${image.filename}:`, error.message);
    }
  }

  console.log('\n✅ Image download complete!');
  console.log(`\nExercise images: ${exerciseDir}`);
  console.log(`Nutrition images: ${nutritionDir}`);
}

// Run the download
if (require.main === module) {
  downloadAllImages().catch(console.error);
}

module.exports = { downloadImage, downloadAllImages };
