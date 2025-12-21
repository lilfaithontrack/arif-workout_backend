/**
 * Seed Nutrition Database
 * Reads the SQL file and executes it
 */

const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function seedDatabase() {
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

    // Read SQL file
    const sqlPath = path.join(__dirname, '../seeders/nutrition-seed-comprehensive.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');
    
    console.log('📄 Reading SQL file...');
    console.log(`   File: ${sqlPath}\n`);

    // Split by INSERT statements and execute one by one
    const statements = sqlContent
      .split('\n')
      .filter(line => line.trim().startsWith('INSERT IGNORE'))
      .map(line => {
        // Find the complete INSERT statement
        const start = sqlContent.indexOf(line);
        const end = sqlContent.indexOf(';', start) + 1;
        return sqlContent.substring(start, end);
      });

    console.log(`🚀 Executing ${statements.length} INSERT statements...\n`);

    let successCount = 0;
    let skipCount = 0;
    let errorCount = 0;

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i].trim();
      if (!statement) continue;

      try {
        const [result] = await connection.execute(statement);
        if (result.affectedRows > 0) {
          successCount++;
          process.stdout.write(`\r✓ Inserted: ${successCount} | Skipped: ${skipCount} | Errors: ${errorCount}`);
        } else {
          skipCount++;
          process.stdout.write(`\r✓ Inserted: ${successCount} | Skipped: ${skipCount} | Errors: ${errorCount}`);
        }
      } catch (error) {
        errorCount++;
        process.stdout.write(`\r✓ Inserted: ${successCount} | Skipped: ${skipCount} | Errors: ${errorCount}`);
        if (errorCount <= 3) {
          console.log(`\n⚠️  Error on statement ${i + 1}: ${error.message}`);
        }
      }
    }

    console.log('\n\n✅ Database seeding completed!');
    console.log(`\n📊 Summary:`);
    console.log(`   ✓ Successfully inserted: ${successCount}`);
    console.log(`   ⊘ Skipped (duplicates): ${skipCount}`);
    console.log(`   ✗ Errors: ${errorCount}`);

    // Verify count
    const [rows] = await connection.query('SELECT COUNT(*) as count FROM nutrition_items');
    console.log(`\n📈 Total items in database: ${rows[0].count}`);

    await connection.end();
    process.exit(0);

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (connection) await connection.end();
    process.exit(1);
  }
}

seedDatabase();
