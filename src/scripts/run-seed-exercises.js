require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { sequelize } = require('../config/database');

/**
 * Run the SQL seed file to populate 500 exercises
 */
async function seedExercises() {
  try {
    console.log('🏋️ Starting exercise seeding...');
    
    // Read the SQL file
    const sqlFilePath = path.join(__dirname, 'seed-exercises-fixed.sql');
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
    
    // Remove comments and get the INSERT statement
    const lines = sqlContent.split('\n');
    const sqlLines = lines.filter(line => {
      const trimmed = line.trim();
      return trimmed.length > 0 && !trimmed.startsWith('--');
    });
    
    const fullSQL = sqlLines.join('\n');
    
    console.log(`📝 Executing SQL insert for exercises...`);
    
    // Execute the SQL statement
    try {
      await sequelize.query(fullSQL);
      console.log('✅ Successfully inserted exercises!');
    } catch (error) {
      console.error('❌ Error inserting exercises:', error.message);
      throw error;
    }
    
    console.log('\n🎉 Exercise seeding completed!');
    
    // Verify the count
    const [results] = await sequelize.query('SELECT COUNT(*) as count FROM exercises WHERE isActive = true');
    console.log(`\n📊 Total active exercises in database: ${results[0].count}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Fatal error during seeding:', error);
    process.exit(1);
  }
}

// Run the seeder
seedExercises();
