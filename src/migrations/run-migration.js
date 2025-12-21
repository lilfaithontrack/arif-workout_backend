#!/usr/bin/env node

/**
 * Database Migration Script
 * Creates missing tables: nutrition_images, advertisements
 * 
 * Usage: node src/migrations/run-migration.js
 */

require('dotenv').config();
const { sequelize } = require('../config/database');

async function runMigration() {
    try {
        console.log('🔄 Starting database migration...');
        console.log(`📊 Database: ${process.env.DB_NAME}`);
        console.log(`🖥️  Host: ${process.env.DB_HOST}`);

        // Test connection
        await sequelize.authenticate();
        console.log('✅ Database connection successful!\n');

        // ============================================
        // 1. CREATE NUTRITION_IMAGES TABLE
        // ============================================
        console.log('📋 Creating nutrition_images table...');

        await sequelize.query(`
      CREATE TABLE IF NOT EXISTS \`nutrition_images\` (
        \`id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`nutritionSlug\` VARCHAR(255) NOT NULL COMMENT 'Slug identifier for the nutrition item',
        \`nutritionItemId\` INT NULL COMMENT 'Foreign key to nutrition_items table',
        \`subfolder\` ENUM('main', 'portions', 'prepared', 'nutrition-label', 'meal-prep', 'recipes', 'alternatives') NOT NULL COMMENT 'Subfolder category',
        \`mediaType\` ENUM('image', 'video') NOT NULL DEFAULT 'image' COMMENT 'Type of media file',
        \`filename\` VARCHAR(255) NOT NULL COMMENT 'Generated filename',
        \`originalName\` VARCHAR(255) NULL COMMENT 'Original filename from upload',
        \`path\` VARCHAR(500) NOT NULL COMMENT 'Full file path on server',
        \`url\` VARCHAR(500) NOT NULL COMMENT 'Public URL to access the file',
        \`size\` INT NULL COMMENT 'File size in bytes',
        \`mimeType\` VARCHAR(100) NULL COMMENT 'MIME type of the file',
        \`uploadedBy\` INT NULL COMMENT 'User who uploaded the file',
        \`isPrimary\` BOOLEAN DEFAULT FALSE COMMENT 'Primary/main image flag',
        \`createdAt\` DATETIME NOT NULL,
        \`updatedAt\` DATETIME NOT NULL,
        
        INDEX \`idx_nutritionSlug\` (\`nutritionSlug\`),
        INDEX \`idx_nutritionItemId\` (\`nutritionItemId\`),
        INDEX \`idx_subfolder\` (\`subfolder\`),
        INDEX \`idx_mediaType\` (\`mediaType\`),
        INDEX \`idx_isPrimary\` (\`isPrimary\`),
        INDEX \`idx_uploadedBy\` (\`uploadedBy\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

        console.log('✅ nutrition_images table created');

        // Add foreign keys separately to avoid issues
        try {
            await sequelize.query(`
        ALTER TABLE \`nutrition_images\`
        ADD CONSTRAINT \`fk_nutrition_images_user\`
        FOREIGN KEY (\`uploadedBy\`) REFERENCES \`users\`(\`id\`)
        ON DELETE SET NULL ON UPDATE CASCADE
      `);
            console.log('✅ Added foreign key: nutrition_images -> users');
        } catch (err) {
            if (err.message.includes('Duplicate')) {
                console.log('⚠️  Foreign key already exists: nutrition_images -> users');
            } else {
                console.log('⚠️  Could not add foreign key to users:', err.message);
            }
        }

        try {
            await sequelize.query(`
        ALTER TABLE \`nutrition_images\`
        ADD CONSTRAINT \`fk_nutrition_images_item\`
        FOREIGN KEY (\`nutritionItemId\`) REFERENCES \`nutrition_items\`(\`id\`)
        ON DELETE CASCADE ON UPDATE CASCADE
      `);
            console.log('✅ Added foreign key: nutrition_images -> nutrition_items');
        } catch (err) {
            if (err.message.includes('Duplicate')) {
                console.log('⚠️  Foreign key already exists: nutrition_images -> nutrition_items');
            } else {
                console.log('⚠️  Could not add foreign key to nutrition_items:', err.message);
            }
        }

        // ============================================
        // 2. CREATE ADVERTISEMENTS TABLE
        // ============================================
        console.log('\n📋 Creating advertisements table...');

        await sequelize.query(`
      CREATE TABLE IF NOT EXISTS \`advertisements\` (
        \`id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`title\` VARCHAR(255) NOT NULL,
        \`description\` TEXT NULL,
        \`imageUrl\` VARCHAR(500) NULL,
        \`videoUrl\` VARCHAR(500) NULL,
        \`linkUrl\` VARCHAR(500) NULL,
        \`type\` ENUM('banner', 'popup', 'sidebar', 'inline') NOT NULL DEFAULT 'banner',
        \`placement\` VARCHAR(100) NULL COMMENT 'Where to show the ad',
        \`priority\` INT DEFAULT 0 COMMENT 'Higher priority shows first',
        \`startDate\` DATETIME NULL,
        \`endDate\` DATETIME NULL,
        \`isActive\` BOOLEAN DEFAULT TRUE,
        \`impressions\` INT DEFAULT 0 COMMENT 'Number of times shown',
        \`clicks\` INT DEFAULT 0 COMMENT 'Number of clicks',
        \`createdBy\` INT NULL,
        \`approvedBy\` INT NULL,
        \`approvalDate\` DATETIME NULL,
        \`createdAt\` DATETIME NOT NULL,
        \`updatedAt\` DATETIME NOT NULL,
        
        INDEX \`idx_type\` (\`type\`),
        INDEX \`idx_placement\` (\`placement\`),
        INDEX \`idx_priority\` (\`priority\`),
        INDEX \`idx_isActive\` (\`isActive\`),
        INDEX \`idx_startDate\` (\`startDate\`),
        INDEX \`idx_endDate\` (\`endDate\`),
        INDEX \`idx_createdBy\` (\`createdBy\`),
        INDEX \`idx_approvedBy\` (\`approvedBy\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

        console.log('✅ advertisements table created');

        // Add foreign keys
        try {
            await sequelize.query(`
        ALTER TABLE \`advertisements\`
        ADD CONSTRAINT \`fk_advertisements_creator\`
        FOREIGN KEY (\`createdBy\`) REFERENCES \`users\`(\`id\`)
        ON DELETE SET NULL ON UPDATE CASCADE
      `);
            console.log('✅ Added foreign key: advertisements -> users (creator)');
        } catch (err) {
            if (err.message.includes('Duplicate')) {
                console.log('⚠️  Foreign key already exists: advertisements -> users (creator)');
            } else {
                console.log('⚠️  Could not add foreign key:', err.message);
            }
        }

        try {
            await sequelize.query(`
        ALTER TABLE \`advertisements\`
        ADD CONSTRAINT \`fk_advertisements_approver\`
        FOREIGN KEY (\`approvedBy\`) REFERENCES \`users\`(\`id\`)
        ON DELETE SET NULL ON UPDATE CASCADE
      `);
            console.log('✅ Added foreign key: advertisements -> users (approver)');
        } catch (err) {
            if (err.message.includes('Duplicate')) {
                console.log('⚠️  Foreign key already exists: advertisements -> users (approver)');
            } else {
                console.log('⚠️  Could not add foreign key:', err.message);
            }
        }

        // ============================================
        // VERIFICATION
        // ============================================
        console.log('\n🔍 Verifying tables...');

        const [tables] = await sequelize.query(`
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_SCHEMA = '${process.env.DB_NAME}'
      AND TABLE_NAME IN ('nutrition_images', 'advertisements')
      ORDER BY TABLE_NAME
    `);

        console.log('\n📊 Tables created:');
        tables.forEach((table, index) => {
            console.log(`  ${index + 1}. ${table.TABLE_NAME}`);
        });

        // List all tables
        const [allTables] = await sequelize.query(`
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_SCHEMA = '${process.env.DB_NAME}'
      ORDER BY TABLE_NAME
    `);

        console.log(`\n✨ Migration completed successfully!`);
        console.log(`📋 Total tables in database: ${allTables.length}`);
        console.log('\n💡 You can now use the nutrition upload and advertisements features!');

        process.exit(0);

    } catch (error) {
        console.error('\n❌ Migration failed:');
        console.error(error.message);
        console.error('\nFull error:', error);
        process.exit(1);
    }
}

// Run migration
runMigration();
