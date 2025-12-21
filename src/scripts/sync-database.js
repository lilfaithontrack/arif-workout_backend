require('dotenv').config();
const { sequelize } = require('../config/database');
const models = require('../models');

async function syncDatabase() {
  try {
    console.log('🔄 Starting database synchronization...\n');

    // Test connection
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully\n');

    // Get all model names
    const modelNames = Object.keys(models).filter(key => key !== 'sequelize');
    console.log(`📋 Found ${modelNames.length} models to sync:\n`);
    modelNames.forEach((name, index) => {
      console.log(`   ${index + 1}. ${name}`);
    });
    console.log('\n');

    // Sync all models (creates tables if they don't exist)
    console.log('🔨 Creating/updating tables...\n');
    
    // Use alter: true to update existing tables without dropping them
    // Use force: true to drop and recreate all tables (WARNING: deletes all data)
    await sequelize.sync({ alter: true });
    
    console.log('✅ All tables synced successfully!\n');

    // List all tables
    const [tables] = await sequelize.query(`
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_SCHEMA = '${process.env.DB_NAME || 'arif_workout'}'
      ORDER BY TABLE_NAME
    `);

    console.log(`📊 Database Tables (${tables.length}):\n`);
    tables.forEach((table, index) => {
      console.log(`   ${index + 1}. ${table.TABLE_NAME}`);
    });
    console.log('\n');

    // Get table details
    console.log('📝 Table Details:\n');
    for (const table of tables) {
      const [columns] = await sequelize.query(`
        SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_KEY
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_SCHEMA = '${process.env.DB_NAME || 'arif_workout'}'
        AND TABLE_NAME = '${table.TABLE_NAME}'
        ORDER BY ORDINAL_POSITION
      `);
      console.log(`   ${table.TABLE_NAME} (${columns.length} columns)`);
    }
    console.log('\n');

    console.log('🎉 Database synchronization completed successfully!');
    console.log('\n📌 Next steps:');
    console.log('   1. Run: node src/scripts/create-admin.js (to create admin user)');
    console.log('   2. Run: node src/scripts/seed-exercises.js (to populate exercises)');
    console.log('   3. Run: npm run dev (to start the server)\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error syncing database:', error);
    console.error('\n💡 Troubleshooting:');
    console.error('   1. Check if MySQL is running');
    console.error('   2. Verify database credentials in .env file');
    console.error('   3. Ensure database exists: CREATE DATABASE arif_workout;');
    console.error('   4. Check MySQL user permissions\n');
    process.exit(1);
  }
}

syncDatabase();
