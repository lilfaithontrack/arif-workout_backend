/**
 * Clear and Re-seed Nutrition Database
 */

const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function clearAndSeed() {
  let connection;
  
  try {
    console.log('🔧 Connecting to database...');
    
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'arif_workout',
      multipleStatements: true
    });

    console.log('✓ Connected\n');

    // Check current count
    const [beforeRows] = await connection.query('SELECT COUNT(*) as count FROM nutrition_items');
    console.log(`📊 Current items in database: ${beforeRows[0].count}\n`);

    // Ask for confirmation
    console.log('⚠️  This will DELETE all existing nutrition items and insert 100 new ones.');
    console.log('🗑️  Clearing nutrition_items table...');
    
    await connection.query('DELETE FROM nutrition_items');
    console.log('✓ Table cleared\n');

    // Read SQL file
    const sqlPath = path.join(__dirname, '../seeders/nutrition-seed-comprehensive.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');
    
    console.log('📄 Reading SQL file...');

    // Extract INSERT statements
    const insertRegex = /INSERT IGNORE INTO nutrition_items[\s\S]*?\);/g;
    const statements = sqlContent.match(insertRegex) || [];

    console.log(`🚀 Inserting ${statements.length} nutrition items...\n`);

    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < statements.length; i++) {
      try {
        await connection.execute(statements[i]);
        successCount++;
        process.stdout.write(`\r✓ Progress: ${successCount}/${statements.length}`);
      } catch (error) {
        errorCount++;
        if (errorCount <= 3) {
          console.log(`\n⚠️  Error on item ${i + 1}: ${error.message}`);
        }
      }
    }

    console.log('\n\n✅ Database seeding completed!');
    console.log(`\n📊 Summary:`);
    console.log(`   ✓ Successfully inserted: ${successCount}`);
    console.log(`   ✗ Errors: ${errorCount}`);

    // Verify count
    const [afterRows] = await connection.query('SELECT COUNT(*) as count FROM nutrition_items');
    console.log(`\n📈 Total items in database: ${afterRows[0].count}`);

    // Show breakdown by category
    const [categories] = await connection.query(`
      SELECT category, COUNT(*) as count 
      FROM nutrition_items 
      GROUP BY category 
      ORDER BY count DESC
    `);
    
    console.log(`\n📋 Breakdown by category:`);
    categories.forEach(cat => {
      console.log(`   - ${cat.category}: ${cat.count}`);
    });

    await connection.end();
    process.exit(0);

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (connection) await connection.end();
    process.exit(1);
  }
}

clearAndSeed();
