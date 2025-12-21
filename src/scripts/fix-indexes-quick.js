/**
 * Quick Fix: Drop all non-essential indexes from users table
 * This will allow the server to start
 */

const mysql = require('mysql2/promise');
require('dotenv').config();

async function quickFix() {
  let connection;
  
  try {
    console.log('🔧 Connecting to database...');
    
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'arif_workout'
    });

    console.log('✓ Connected\n');

    // Get all indexes from users table
    const [indexes] = await connection.query(`
      SELECT DISTINCT INDEX_NAME 
      FROM INFORMATION_SCHEMA.STATISTICS 
      WHERE TABLE_SCHEMA = DATABASE() 
        AND TABLE_NAME = 'users' 
        AND INDEX_NAME != 'PRIMARY'
        AND INDEX_NAME NOT IN ('email', 'phone', 'users_email_unique', 'users_phone_unique')
    `);

    console.log(`Found ${indexes.length} non-essential indexes on users table\n`);

    if (indexes.length === 0) {
      console.log('✓ No indexes to drop. The issue might be with another table.');
      console.log('Run: node src/scripts/cleanup-all-indexes.js\n');
      await connection.end();
      process.exit(0);
    }

    // Drop each index
    for (const row of indexes) {
      const indexName = row.INDEX_NAME;
      try {
        await connection.query(`ALTER TABLE users DROP INDEX \`${indexName}\``);
        console.log(`✓ Dropped index: ${indexName}`);
      } catch (error) {
        if (error.code === 'ER_CANT_DROP_FIELD_OR_KEY') {
          console.log(`⚠️  Index ${indexName} doesn't exist, skipping...`);
        } else {
          console.log(`✗ Failed to drop ${indexName}: ${error.message}`);
        }
      }
    }

    console.log('\n✅ Quick fix completed! Try starting the server now.\n');
    
    await connection.end();
    process.exit(0);

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (connection) await connection.end();
    process.exit(1);
  }
}

quickFix();
