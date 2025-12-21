/**
 * Cleanup Script: Remove excessive indexes from all tables
 * 
 * This script removes duplicate and unnecessary indexes to stay within MySQL's 64 key limit
 */

const { sequelize } = require('../config/database');

async function cleanupIndexes() {
  const transaction = await sequelize.transaction();
  
  try {
    console.log('🔧 Starting index cleanup...\n');

    // Get all tables
    const [tables] = await sequelize.query(
      `SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES 
       WHERE TABLE_SCHEMA = DATABASE() AND TABLE_TYPE = 'BASE TABLE'`,
      { transaction }
    );

    for (const table of tables) {
      const tableName = table.TABLE_NAME;
      console.log(`\n📊 Checking table: ${tableName}`);

      // Get all indexes for this table
      const [indexes] = await sequelize.query(
        `SHOW INDEX FROM \`${tableName}\``,
        { transaction }
      );

      // Group indexes by name
      const indexGroups = {};
      indexes.forEach(idx => {
        if (!indexGroups[idx.Key_name]) {
          indexGroups[idx.Key_name] = [];
        }
        indexGroups[idx.Key_name].push(idx);
      });

      const indexNames = Object.keys(indexGroups);
      console.log(`   Total indexes: ${indexNames.length}`);

      // Skip PRIMARY key
      const nonPrimaryIndexes = indexNames.filter(name => name !== 'PRIMARY');
      
      if (nonPrimaryIndexes.length > 60) {
        console.log(`   ⚠️  WARNING: ${nonPrimaryIndexes.length} indexes (exceeds safe limit)`);
        
        // Keep only essential indexes
        const essentialPatterns = [
          'email', 'phone', 'slug', 'userId', 'exerciseId', 
          'foodId', 'unique', 'foreign', 'createdAt'
        ];

        const indexesToDrop = nonPrimaryIndexes.filter(indexName => {
          // Don't drop if it matches essential patterns
          const isEssential = essentialPatterns.some(pattern => 
            indexName.toLowerCase().includes(pattern.toLowerCase())
          );
          return !isEssential;
        });

        console.log(`   🗑️  Dropping ${indexesToDrop.length} non-essential indexes...`);

        for (const indexName of indexesToDrop) {
          try {
            await sequelize.query(
              `ALTER TABLE \`${tableName}\` DROP INDEX \`${indexName}\``,
              { transaction }
            );
            console.log(`      ✓ Dropped: ${indexName}`);
          } catch (error) {
            console.log(`      ✗ Failed to drop ${indexName}: ${error.message}`);
          }
        }
      } else {
        console.log(`   ✓ Index count is acceptable`);
      }
    }

    await transaction.commit();
    console.log('\n✅ Index cleanup completed successfully!\n');
    process.exit(0);

  } catch (error) {
    await transaction.rollback();
    console.error('\n❌ Index cleanup failed:', error);
    process.exit(1);
  }
}

// Run cleanup
cleanupIndexes();
