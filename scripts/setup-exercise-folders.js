const fs = require('fs');
const path = require('path');

// Load exercises data
const exercisesData = require('../data/exercises_advanced.json');

// Base paths
const imagesBasePath = path.join(__dirname, '../public/images/exercises');
const thumbnailsBasePath = path.join(__dirname, '../public/images/thumbnails/exercises');

// Exercise list with their slugs
const exercises = exercisesData.exercises.map(ex => ({
  id: ex.id,
  name: ex.name,
  slug: ex.slug
}));

console.log('🏋️  Creating Advanced Exercise Folder Structure...\n');

// Create folder structure for each exercise
exercises.forEach(exercise => {
  const exerciseFolder = path.join(imagesBasePath, exercise.slug);
  const thumbnailFolder = path.join(thumbnailsBasePath, exercise.slug);
  
  // Create main exercise folder
  if (!fs.existsSync(exerciseFolder)) {
    fs.mkdirSync(exerciseFolder, { recursive: true });
    console.log(`✅ Created: ${exerciseFolder}`);
  }
  
  // Create thumbnail folder
  if (!fs.existsSync(thumbnailFolder)) {
    fs.mkdirSync(thumbnailFolder, { recursive: true });
    console.log(`✅ Created: ${thumbnailFolder}`);
  }
  
  // Create subfolders for different image types
  const subfolders = [
    'main',           // Main exercise image
    'variations',     // Different variations
    'form-guide',     // Form correction images
    'muscles',        // Muscle activation diagrams
    'equipment',      // Equipment setup
    'progression',    // Progression steps
    'common-mistakes' // Common mistakes illustrations
  ];
  
  subfolders.forEach(subfolder => {
    const subfolderPath = path.join(exerciseFolder, subfolder);
    if (!fs.existsSync(subfolderPath)) {
      fs.mkdirSync(subfolderPath, { recursive: true });
    }
  });
  
  // Create README.md for each exercise folder
  const readmePath = path.join(exerciseFolder, 'README.md');
  if (!fs.existsSync(readmePath)) {
    const readmeContent = `# ${exercise.name} (${exercise.id})

## Image Organization

This folder contains all images for the **${exercise.name}** exercise.

### Folder Structure:

\`\`\`
${exercise.slug}/
├── main/                 # Main exercise demonstration images
│   ├── ${exercise.slug}-main.jpg
│   └── ${exercise.slug}-main-alt.jpg
├── variations/           # Exercise variations
│   ├── beginner.jpg
│   ├── intermediate.jpg
│   └── advanced.jpg
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

---

**Exercise ID**: ${exercise.id}
**Slug**: ${exercise.slug}
**Last Updated**: ${new Date().toISOString().split('T')[0]}
`;
    
    fs.writeFileSync(readmePath, readmeContent);
  }
  
  // Create placeholder files in each subfolder
  subfolders.forEach(subfolder => {
    const placeholderPath = path.join(exerciseFolder, subfolder, '.gitkeep');
    if (!fs.existsSync(placeholderPath)) {
      fs.writeFileSync(placeholderPath, `# Placeholder for ${exercise.name} - ${subfolder}\n`);
    }
  });
});

console.log(`\n✅ Successfully created folders for ${exercises.length} exercises!`);
console.log('\n📁 Folder Structure:');
console.log('   /public/images/exercises/[exercise-slug]/');
console.log('      ├── main/');
console.log('      ├── variations/');
console.log('      ├── form-guide/');
console.log('      ├── muscles/');
console.log('      ├── equipment/');
console.log('      ├── progression/');
console.log('      └── common-mistakes/');
console.log('\n📝 Each exercise folder includes a README.md with guidelines');
console.log('\n🎯 Next Steps:');
console.log('   1. Add images to the appropriate subfolders');
console.log('   2. Follow the naming conventions in each README.md');
console.log('   3. Update image-mapping.json with new paths');
console.log('   4. Run update-image-paths.js to sync with databases\n');
