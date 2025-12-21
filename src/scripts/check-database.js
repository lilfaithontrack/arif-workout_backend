require('dotenv').config();
const { sequelize } = require('../config/database');

async function checkDatabase() {
  try {
    console.log('🔍 Checking database status...\n');

    // Test connection
    await sequelize.authenticate();
    console.log('✅ Database connection: OK\n');

    // Get database info
    const [dbInfo] = await sequelize.query(`
      SELECT 
        DATABASE() as current_db,
        VERSION() as mysql_version,
        @@character_set_database as charset,
        @@collation_database as collation
    `);
    
    console.log('📊 Database Information:');
    console.log(`   Database: ${dbInfo[0].current_db}`);
    console.log(`   MySQL Version: ${dbInfo[0].mysql_version}`);
    console.log(`   Character Set: ${dbInfo[0].charset}`);
    console.log(`   Collation: ${dbInfo[0].collation}\n`);

    // List all tables
    const [tables] = await sequelize.query(`
      SELECT 
        TABLE_NAME,
        TABLE_ROWS,
        ROUND((DATA_LENGTH + INDEX_LENGTH) / 1024, 2) as size_kb,
        CREATE_TIME
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_SCHEMA = '${process.env.DB_NAME || 'arif_workout'}'
      ORDER BY TABLE_NAME
    `);

    if (tables.length === 0) {
      console.log('⚠️  No tables found in database!');
      console.log('\n💡 Run this command to create tables:');
      console.log('   node src/scripts/sync-database.js\n');
      process.exit(0);
    }

    console.log(`📋 Tables Found (${tables.length}):\n`);
    
    const expectedTables = [
      'achievements',
      'body_measurements',
      'categories',
      'exercises',
      'fitness_assessments',
      'fitness_goals',
      'instructor_profiles',
      'nutrition_logs',
      'otps',
      'packages',
      'payments',
      'subscriptions',
      'subcategories',
      'user_workouts',
      'users',
      'workout_plans'
    ];

    let allTablesExist = true;
    
    expectedTables.forEach((expectedTable, index) => {
      const table = tables.find(t => t.TABLE_NAME === expectedTable);
      if (table) {
        const rows = table.TABLE_ROWS || 0;
        const size = table.size_kb || 0;
        console.log(`   ✅ ${index + 1}. ${table.TABLE_NAME.padEnd(25)} (${rows} rows, ${size} KB)`);
      } else {
        console.log(`   ❌ ${index + 1}. ${expectedTable.padEnd(25)} (MISSING)`);
        allTablesExist = false;
      }
    });

    console.log('\n');

    // Check for extra tables
    const extraTables = tables.filter(t => !expectedTables.includes(t.TABLE_NAME));
    if (extraTables.length > 0) {
      console.log('📌 Additional tables found:');
      extraTables.forEach(t => {
        console.log(`   • ${t.TABLE_NAME}`);
      });
      console.log('\n');
    }

    // Check foreign keys
    const [foreignKeys] = await sequelize.query(`
      SELECT 
        COUNT(*) as fk_count
      FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
      WHERE TABLE_SCHEMA = '${process.env.DB_NAME || 'arif_workout'}'
        AND REFERENCED_TABLE_NAME IS NOT NULL
    `);

    console.log(`🔗 Foreign Keys: ${foreignKeys[0].fk_count}`);

    // Check indexes
    const [indexes] = await sequelize.query(`
      SELECT 
        COUNT(DISTINCT INDEX_NAME) as index_count
      FROM INFORMATION_SCHEMA.STATISTICS
      WHERE TABLE_SCHEMA = '${process.env.DB_NAME || 'arif_workout'}'
        AND INDEX_NAME != 'PRIMARY'
    `);

    console.log(`📑 Indexes: ${indexes[0].index_count}`);

    // Check data
    const [userCount] = await sequelize.query(`SELECT COUNT(*) as count FROM users`);
    const [exerciseCount] = await sequelize.query(`SELECT COUNT(*) as count FROM exercises`);
    const [workoutCount] = await sequelize.query(`SELECT COUNT(*) as count FROM user_workouts`);

    console.log('\n📈 Data Summary:');
    console.log(`   Users: ${userCount[0].count}`);
    console.log(`   Exercises: ${exerciseCount[0].count}`);
    console.log(`   Workouts Logged: ${workoutCount[0].count}`);

    console.log('\n');

    if (allTablesExist) {
      console.log('✅ Database is properly configured!\n');
      
      if (userCount[0].count === 0) {
        console.log('💡 Next steps:');
        console.log('   1. Create admin: node src/scripts/create-admin.js');
        console.log('   2. Seed exercises: node src/scripts/seed-exercises.js');
        console.log('   3. Start server: npm run dev\n');
      } else {
        console.log('🚀 Database is ready! Start the server with: npm run dev\n');
      }
    } else {
      console.log('⚠️  Some tables are missing!');
      console.log('\n💡 Run this command to create missing tables:');
      console.log('   node src/scripts/sync-database.js\n');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error checking database:', error.message);
    console.error('\n💡 Troubleshooting:');
    console.error('   1. Check if MySQL is running');
    console.error('   2. Verify .env configuration');
    console.error('   3. Ensure database exists: CREATE DATABASE arif_workout;\n');
    process.exit(1);
  }
}

checkDatabase();
