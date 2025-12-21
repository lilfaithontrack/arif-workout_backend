require('dotenv').config();
const fs = require('fs');
const path = require('path');

// Load exercise data from JSON files
const exercisesDatabase = require('../../data/exercises_database.json');
const exercisesAdvanced = require('../../data/exercises_advanced.json');

// Combine exercises from both files
const allExercises = [...exercisesDatabase.exercises, ...exercisesAdvanced.exercises];

// Exercise folder mapping (slug to folder name)
const folderMapping = {
  'dumbbell-bench-press': 'dumbbell-bench-press',
  'deadlifts': 'deadlifts',
  'pull-ups': 'pull-ups',
  'bicycle-crunches': 'bicycle-crunches',
  'jumping-jacks': 'jumping-jacks',
  'dumbbell-rows': 'dumbbell-rows',
  'leg-raises': 'leg-raises',
  'shoulder-press': 'shoulder-press',
  'russian-twists': 'russian-twists',
  'high-knees': 'high-knees',
  'tricep-dips': 'tricep-dips',
  'glute-bridges': 'glute-bridges',
  'box-jumps': 'box-jumps',
  'superman-hold': 'superman-hold',
  'lunges': 'lunges',
  'burpees': 'burpees',
  'mountain-climbers': 'mountain-climbers',
  'plank': 'plank',
  'squats': 'squats'
};

function generateReadmeContent(exercise) {
  const muscleGroups = exercise.muscleGroups || {};
  const primaryMuscles = muscleGroups.primary ? muscleGroups.primary.join(', ') : 'N/A';
  const secondaryMuscles = muscleGroups.secondary ? muscleGroups.secondary.join(', ') : 'N/A';
  const equipment = exercise.equipment ? exercise.equipment.join(', ') : 'none';
  const instructions = exercise.instructions ? exercise.instructions : ['Instructions not available'];
  const tips = exercise.tips ? exercise.tips : ['Tips not available'];
  const variations = exercise.variations ? exercise.variations : [];
  
  return `# ${exercise.name} (${exercise.id})

## Exercise Details

**Category**: ${exercise.category || 'N/A'}  
**Subcategory**: ${exercise.subcategory || 'N/A'}  
**Difficulty**: ${exercise.difficulty || 'N/A'}  
**Equipment**: ${equipment}

### Target Muscles
- **Primary**: ${primaryMuscles}
- **Secondary**: ${secondaryMuscles}

### Exercise Metrics
- **Calories Burned Per Minute**: ${exercise.caloriesBurnedPerMinute || 'N/A'}
- **Default Duration**: ${exercise.duration || 'N/A'} seconds
- **Default Sets**: ${exercise.sets || 'N/A'}
- **Default Reps**: ${exercise.reps || 'N/A'}
- **Rest Time**: ${exercise.restTime || 'N/A'} seconds

### Instructions
${instructions.map((instruction, index) => `${index + 1}. ${instruction}`).join('\n')}

### Tips
${tips.map((tip, index) => `- ${tip}`).join('\n')}

### Variations
${variations.length > 0 ? variations.map(variation => `- **${variation.name}** (Difficulty: ${variation.difficulty || 'same'})`).join('\n') : '- No variations documented'}

## Image Organization

This folder contains all images for the **${exercise.name}** exercise.

### Folder Structure:

\`\`\`
${folderMapping[exercise.slug] || exercise.slug}/
├── main/                 # Main exercise demonstration images
│   ├── ${exercise.slug}-main.jpg
│   └── ${exercise.slug}-main-alt.jpg
├── variations/           # Exercise variations
${variations.map((variation, index) => `│   ├── ${exercise.slug}-${variation.name.toLowerCase().replace(/\s+/g, '-')}.jpg`).join('\n')}
├── form-guide/          # Proper form demonstrations
│   ├── starting-position.jpg
│   ├── mid-movement.jpg
│   └── end-position.jpg
├── muscles/             # Muscle activation diagrams
│   ├── primary-muscles.jpg
│   └── secondary-muscles.jpg
├── equipment/           # Equipment setup
│   └── setup.jpg
├── progression/         # Progression steps
│   ├── step-1.jpg
│   ├── step-2.jpg
│   └── step-3.jpg
└── common-mistakes/     # Common mistakes to avoid
    ├── mistake-1.jpg
    └── mistake-2.jpg
\`\`\`

### Image Specifications:

- **Format**: JPG or PNG
- **Main Images**: 1200x800px (landscape)
- **Form Guide**: 800x1200px (portrait) or 1200x800px (landscape)
- **Thumbnails**: 400x300px
- **Max File Size**: 500KB per image
- **Quality**: High resolution, well-lit, clear

### Naming Convention:

- Use lowercase with hyphens
- Be descriptive: \`${exercise.slug}-starting-position.jpg\`
- Include variation type: \`${exercise.slug}-beginner-variation.jpg\`

### Tips:

1. **Main Image**: Show the exercise at peak contraction
2. **Form Guide**: Show 3-4 key positions in sequence
3. **Variations**: Clearly show the difference from main exercise
4. **Mistakes**: Use red X or annotations to highlight errors
5. **Muscles**: Use anatomical diagrams with highlighted muscle groups

### Additional Resources:

- **Video URL**: ${exercise.videoUrl || 'Not specified'}
- **Image URL**: ${exercise.imageUrl || 'Not specified'}

---

**Exercise ID**: ${exercise.id}
**Slug**: ${exercise.slug}
**Last Updated**: ${new Date().toISOString().split('T')[0]}
**Data Source**: exercises_database.json / exercises_advanced.json
`;
}

async function generateReadmeFiles() {
  try {
    console.log('🔧 Generating README files for exercises...');
    
    const exercisesDir = path.join(__dirname, '../../public/images/exercises');
    let generatedCount = 0;
    
    for (const exercise of allExercises) {
      const folderName = folderMapping[exercise.slug];
      
      if (folderName && fs.existsSync(path.join(exercisesDir, folderName))) {
        const readmePath = path.join(exercisesDir, folderName, 'README.md');
        const content = generateReadmeContent(exercise);
        
        fs.writeFileSync(readmePath, content, 'utf8');
        console.log(`✅ Generated README for: ${exercise.name} (${folderName})`);
        generatedCount++;
      } else {
        console.log(`⚠️ Skipped: ${exercise.name} (folder not found: ${folderName || exercise.slug})`);
      }
    }
    
    console.log(`\n🎉 Successfully generated ${generatedCount} README files!`);
    
  } catch (error) {
    console.error('❌ Error generating README files:', error);
  }
}

// Run the generator
if (require.main === module) {
  generateReadmeFiles();
}

module.exports = { generateReadmeFiles };
