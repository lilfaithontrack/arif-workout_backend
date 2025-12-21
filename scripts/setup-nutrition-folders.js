const fs = require('fs');
const path = require('path');

// Load nutrition data
const nutritionData = require('../data/nutrition_advanced.json');

// Base paths
const imagesBasePath = path.join(__dirname, '../public/images/nutrition');
const thumbnailsBasePath = path.join(__dirname, '../public/images/thumbnails/nutrition');

// Nutrition list with their slugs
const foods = nutritionData.foods.map(food => ({
  id: food.id,
  name: food.name,
  slug: food.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}));

console.log('🥗 Creating Advanced Nutrition Folder Structure...\n');

// Create folder structure for each food item
foods.forEach(food => {
  const foodFolder = path.join(imagesBasePath, food.slug);
  const thumbnailFolder = path.join(thumbnailsBasePath, food.slug);
  
  // Create main food folder
  if (!fs.existsSync(foodFolder)) {
    fs.mkdirSync(foodFolder, { recursive: true });
    console.log(`✅ Created: ${foodFolder}`);
  }
  
  // Create thumbnail folder
  if (!fs.existsSync(thumbnailFolder)) {
    fs.mkdirSync(thumbnailFolder, { recursive: true });
    console.log(`✅ Created: ${thumbnailFolder}`);
  }
  
  // Create subfolders for different image types
  const subfolders = [
    'main',              // Main food image
    'prepared',          // Different preparation methods
    'portions',          // Portion size references
    'nutrition-label',   // Nutrition facts label
    'recipes',           // Recipe ideas
    'meal-prep',         // Meal prep examples
    'alternatives'       // Similar/alternative foods
  ];
  
  subfolders.forEach(subfolder => {
    const subfolderPath = path.join(foodFolder, subfolder);
    if (!fs.existsSync(subfolderPath)) {
      fs.mkdirSync(subfolderPath, { recursive: true });
    }
  });
  
  // Create README.md for each food folder
  const readmePath = path.join(foodFolder, 'README.md');
  if (!fs.existsSync(readmePath)) {
    const readmeContent = `# ${food.name} (${food.id})

## Image Organization

This folder contains all images for **${food.name}**.

### Folder Structure:

\`\`\`
${food.slug}/
├── main/                    # Main food images
│   ├── ${food.slug}-main.jpg
│   ├── ${food.slug}-raw.jpg
│   └── ${food.slug}-cooked.jpg
├── prepared/                # Different preparation methods
│   ├── grilled.jpg
│   ├── baked.jpg
│   ├── steamed.jpg
│   └── raw.jpg
├── portions/                # Portion size references
│   ├── 100g-portion.jpg
│   ├── serving-size.jpg
│   └── comparison.jpg
├── nutrition-label/         # Nutrition facts
│   ├── label.jpg
│   └── macros-breakdown.jpg
├── recipes/                 # Recipe ideas
│   ├── recipe-1.jpg
│   ├── recipe-2.jpg
│   └── recipe-3.jpg
├── meal-prep/              # Meal prep examples
│   ├── storage.jpg
│   ├── containers.jpg
│   └── weekly-prep.jpg
└── alternatives/           # Similar foods
    ├── alternative-1.jpg
    └── alternative-2.jpg
\`\`\`

### Image Specifications:

- **Format**: JPG or PNG
- **Main Images**: 1200x800px (landscape) or 800x800px (square)
- **Portions**: 800x800px (square) - clear portion reference
- **Recipes**: 1200x800px (landscape)
- **Thumbnails**: 400x400px (square)
- **Max File Size**: 500KB per image
- **Quality**: High resolution, well-lit, appetizing

### Naming Convention:

- Use lowercase with hyphens
- Be descriptive: \`${food.slug}-grilled.jpg\`
- Include portion info: \`${food.slug}-100g-portion.jpg\`

### Photography Tips:

1. **Main Image**: 
   - Natural lighting
   - Clean background (white or wood)
   - Show texture and freshness
   - 45-degree angle works best

2. **Portions**: 
   - Include measuring tools (scale, cup, spoon)
   - Show actual serving size
   - Use standard plate for reference

3. **Prepared**: 
   - Show different cooking methods
   - Highlight color changes
   - Make it look appetizing

4. **Recipes**: 
   - Final plated dish
   - Garnished and styled
   - Include ingredients in background

5. **Meal Prep**: 
   - Show storage containers
   - Label with dates/portions
   - Demonstrate organization

### Content Ideas:

- **Before/After cooking**: Show transformation
- **Portion comparisons**: 100g vs 200g vs serving
- **Macro breakdown**: Visual pie chart or infographic
- **Pairing suggestions**: Foods that go well together
- **Storage tips**: How to keep fresh
- **Selection guide**: How to pick quality items

---

**Food ID**: ${food.id}
**Slug**: ${food.slug}
**Last Updated**: ${new Date().toISOString().split('T')[0]}
`;
    
    fs.writeFileSync(readmePath, readmeContent);
  }
  
  // Create placeholder files in each subfolder
  subfolders.forEach(subfolder => {
    const placeholderPath = path.join(foodFolder, subfolder, '.gitkeep');
    if (!fs.existsSync(placeholderPath)) {
      fs.writeFileSync(placeholderPath, `# Placeholder for ${food.name} - ${subfolder}\n`);
    }
  });
});

console.log(`\n✅ Successfully created folders for ${foods.length} food items!`);
console.log('\n📁 Folder Structure:');
console.log('   /public/images/nutrition/[food-slug]/');
console.log('      ├── main/');
console.log('      ├── prepared/');
console.log('      ├── portions/');
console.log('      ├── nutrition-label/');
console.log('      ├── recipes/');
console.log('      ├── meal-prep/');
console.log('      └── alternatives/');
console.log('\n📝 Each food folder includes a README.md with guidelines');
console.log('\n🎯 Next Steps:');
console.log('   1. Add food images to the appropriate subfolders');
console.log('   2. Follow photography tips in each README.md');
console.log('   3. Update image-mapping.json with new paths');
console.log('   4. Consider using food photography stock sites\n');
