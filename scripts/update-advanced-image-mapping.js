const fs = require('fs');
const path = require('path');

// Load exercises data
const exercisesData = require('../data/exercises_advanced.json');

// Create advanced image mapping structure
const advancedImageMapping = {
  version: "2.0.0",
  description: "Advanced image mapping with multiple images per exercise",
  lastUpdated: new Date().toISOString(),
  
  exercises: {}
};

// Generate mapping for each exercise
exercisesData.exercises.forEach(exercise => {
  advancedImageMapping.exercises[exercise.id] = {
    name: exercise.name,
    slug: exercise.slug,
    basePath: `/images/exercises/${exercise.slug}`,
    
    // Main images
    main: {
      primary: `/images/exercises/${exercise.slug}/main/${exercise.slug}-main.jpg`,
      alternate: `/images/exercises/${exercise.slug}/main/${exercise.slug}-main-alt.jpg`,
      thumbnail: `/images/thumbnails/exercises/${exercise.slug}/${exercise.slug}-thumb.jpg`
    },
    
    // Variations by difficulty
    variations: {
      beginner: `/images/exercises/${exercise.slug}/variations/beginner.jpg`,
      intermediate: `/images/exercises/${exercise.slug}/variations/intermediate.jpg`,
      advanced: `/images/exercises/${exercise.slug}/variations/advanced.jpg`
    },
    
    // Form guide sequence
    formGuide: {
      startingPosition: `/images/exercises/${exercise.slug}/form-guide/starting-position.jpg`,
      midMovement: `/images/exercises/${exercise.slug}/form-guide/mid-movement.jpg`,
      endPosition: `/images/exercises/${exercise.slug}/form-guide/end-position.jpg`,
      fullSequence: `/images/exercises/${exercise.slug}/form-guide/full-sequence.gif`
    },
    
    // Muscle activation diagrams
    muscles: {
      primaryMuscles: `/images/exercises/${exercise.slug}/muscles/primary-muscles.jpg`,
      secondaryMuscles: `/images/exercises/${exercise.slug}/muscles/secondary-muscles.jpg`,
      fullDiagram: `/images/exercises/${exercise.slug}/muscles/full-diagram.jpg`
    },
    
    // Equipment setup
    equipment: {
      setup: `/images/exercises/${exercise.slug}/equipment/setup.jpg`,
      adjustments: `/images/exercises/${exercise.slug}/equipment/adjustments.jpg`
    },
    
    // Progression steps
    progression: [
      `/images/exercises/${exercise.slug}/progression/step-1.jpg`,
      `/images/exercises/${exercise.slug}/progression/step-2.jpg`,
      `/images/exercises/${exercise.slug}/progression/step-3.jpg`,
      `/images/exercises/${exercise.slug}/progression/step-4.jpg`
    ],
    
    // Common mistakes
    commonMistakes: [
      {
        description: "Mistake 1",
        image: `/images/exercises/${exercise.slug}/common-mistakes/mistake-1.jpg`
      },
      {
        description: "Mistake 2",
        image: `/images/exercises/${exercise.slug}/common-mistakes/mistake-2.jpg`
      },
      {
        description: "Mistake 3",
        image: `/images/exercises/${exercise.slug}/common-mistakes/mistake-3.jpg`
      }
    ],
    
    // Video resources
    videos: {
      demonstration: `/videos/exercises/${exercise.slug}/demonstration.mp4`,
      formTips: `/videos/exercises/${exercise.slug}/form-tips.mp4`,
      commonMistakes: `/videos/exercises/${exercise.slug}/common-mistakes.mp4`
    }
  };
});

// Save the advanced mapping
const outputPath = path.join(__dirname, '../data/image-mapping-advanced.json');
fs.writeFileSync(outputPath, JSON.stringify(advancedImageMapping, null, 2));

console.log('✅ Advanced image mapping created!');
console.log(`📁 Saved to: ${outputPath}`);
console.log(`\n📊 Mapped ${Object.keys(advancedImageMapping.exercises).length} exercises`);
console.log('\n🎯 Each exercise now has:');
console.log('   • Main images (primary + alternate)');
console.log('   • Variations (beginner, intermediate, advanced)');
console.log('   • Form guide (3+ positions + GIF)');
console.log('   • Muscle diagrams (primary, secondary, full)');
console.log('   • Equipment setup images');
console.log('   • Progression steps (4 steps)');
console.log('   • Common mistakes (3+ examples)');
console.log('   • Video demonstrations');
