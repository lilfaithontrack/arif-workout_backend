require('dotenv').config();
const { sequelize } = require('../config/database');
const { UserSurvey, Exercise, NutritionItem } = require('../models');

/**
 * Sync generator-related models with MySQL database
 * This script ensures all tables for workout and nutrition generators are created/updated
 */
async function syncGeneratorModels() {
  try {
    console.log('🔄 Starting generator models synchronization...\n');

    // Test connection
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully\n');

    // Models to sync
    const modelsToSync = [
      { name: 'UserSurvey', model: UserSurvey },
      { name: 'Exercise', model: Exercise },
      { name: 'NutritionItem', model: NutritionItem }
    ];

    console.log('📋 Generator models to sync:\n');
    modelsToSync.forEach((item, index) => {
      console.log(`   ${index + 1}. ${item.name}`);
    });
    console.log('\n');

    // Sync each model individually with alter: true
    console.log('🔨 Creating/updating tables...\n');
    
    for (const { name, model } of modelsToSync) {
      try {
        await model.sync({ alter: true });
        console.log(`   ✓ ${name} table synced`);
      } catch (error) {
        console.error(`   ✗ Error syncing ${name}:`, error.message);
      }
    }
    
    console.log('\n✅ Generator models synced successfully!\n');

    // Verify tables exist
    const [tables] = await sequelize.query(`
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_SCHEMA = '${process.env.DB_NAME || 'arif_workout'}'
      AND TABLE_NAME IN ('user_surveys', 'exercises', 'nutrition_items')
      ORDER BY TABLE_NAME
    `);

    console.log(`📊 Verified Generator Tables (${tables.length}/3):\n`);
    tables.forEach((table, index) => {
      console.log(`   ${index + 1}. ${table.TABLE_NAME}`);
    });
    console.log('\n');

    // Get column counts for each table
    for (const table of tables) {
      const [columns] = await sequelize.query(`
        SELECT COUNT(*) as count
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_SCHEMA = '${process.env.DB_NAME || 'arif_workout'}'
        AND TABLE_NAME = '${table.TABLE_NAME}'
      `);
      console.log(`   ${table.TABLE_NAME}: ${columns[0].count} columns`);
    }
    console.log('\n');

    console.log('🎉 Generator models synchronization completed successfully!');
    console.log('\n📌 Next steps:');
    console.log('   1. Test the generator APIs:');
    console.log('      - POST /api/auth/register (create a user)');
    console.log('      - POST /api/auth/login (login)');
    console.log('      - Create a survey via your app');
    console.log('      - GET /api/workout-generator/plan');
    console.log('      - GET /api/nutrition-generator/plan');
    console.log('   2. Optionally seed exercises: node src/scripts/seed-exercises.js');
    console.log('   3. Optionally seed nutrition items: node src/scripts/seed-nutrition.js\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error syncing generator models:', error);
    console.error('\n💡 Troubleshooting:');
    console.error('   1. Check if MySQL is running');
    console.error('   2. Verify database credentials in .env file');
    console.error('   3. Ensure database exists: CREATE DATABASE arif_workout;');
    console.error('   4. Check MySQL user permissions');
    console.error('   5. Try running: node src/migrations/create-generator-tables.js up\n');
    process.exit(1);
  }
}

syncGeneratorModels();
