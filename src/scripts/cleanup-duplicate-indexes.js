require('dotenv').config();
const { sequelize } = require('../config/database');

async function cleanupDuplicateIndexes() {
  try {
    console.log('🔧 Starting database index cleanup...');
    
    // Get all tables in the database
    const [tables] = await sequelize.query(`
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_SCHEMA = '${process.env.DB_NAME || 'arif_workout'}'
      ORDER BY TABLE_NAME
    `);
    
    console.log(`📊 Found ${tables.length} tables to check`);
    
    for (const table of tables) {
      const tableName = table.TABLE_NAME;
      console.log(`\n🔍 Checking table: ${tableName}`);
      
      // Get all indexes for this table
      const [indexes] = await sequelize.query(`
        SELECT INDEX_NAME, COLUMN_NAME, NON_UNIQUE
        FROM INFORMATION_SCHEMA.STATISTICS 
        WHERE TABLE_SCHEMA = '${process.env.DB_NAME || 'arif_workout'}'
        AND TABLE_NAME = '${tableName}'
        AND INDEX_NAME != 'PRIMARY'
        ORDER BY INDEX_NAME, SEQ_IN_INDEX
      `);
      
      // Group indexes by name to see multi-column indexes
      const indexGroups = {};
      indexes.forEach(index => {
        if (!indexGroups[index.INDEX_NAME]) {
          indexGroups[index.INDEX_NAME] = [];
        }
        indexGroups[index.INDEX_NAME].push(index.COLUMN_NAME);
      });
      
      console.log(`   Found ${Object.keys(indexGroups).length} indexes`);
      
      // Drop duplicate indexes (same columns, different names)
      const columnSignatures = {};
      const indexesToDrop = [];
      
      Object.entries(indexGroups).forEach(([indexName, columns]) => {
        const signature = columns.join(',');
        
        if (columnSignatures[signature]) {
          console.log(`   🗑️  Duplicate index found: ${indexName} (${columns.join(',')})`);
          indexesToDrop.push(indexName);
        } else {
          columnSignatures[signature] = indexName;
        }
      });
      
      // Drop the duplicate indexes
      for (const indexName of indexesToDrop) {
        try {
          await sequelize.query(`DROP INDEX \`${indexName}\` ON \`${tableName}\``);
          console.log(`   ✅ Dropped duplicate index: ${indexName}`);
        } catch (error) {
          console.log(`   ❌ Failed to drop index ${indexName}: ${error.message}`);
        }
      }
    }
    
    console.log('\n✅ Database index cleanup completed!');
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
  } finally {
    await sequelize.close();
  }
}

// Run the cleanup
if (require.main === module) {
  cleanupDuplicateIndexes();
}

module.exports = { cleanupDuplicateIndexes };
