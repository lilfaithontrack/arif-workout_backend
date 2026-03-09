#!/usr/bin/env node

/**
 * Database Migration Script
 * Adds image column to categories and subcategories tables
 * 
 * Usage: node src/migrations/add-category-images.js
 */

require('dotenv').config();
const { sequelize } = require('../config/database');

async function runMigration() {
    try {
        console.log('🔄 Starting category images migration...');
        console.log(`📊 Database: ${process.env.DB_NAME}`);
        console.log(`🖥️  Host: ${process.env.DB_HOST}`);

        // Test connection
        await sequelize.authenticate();
        console.log('✅ Database connection successful!\n');

        // ============================================
        // 1. ADD IMAGE COLUMN TO CATEGORIES TABLE
        // ============================================
        console.log('📋 Adding image column to categories table...');

        try {
            await sequelize.query(`
                ALTER TABLE \`categories\`
                ADD COLUMN \`image\` VARCHAR(500) NULL 
                COMMENT 'Path to category image file'
                AFTER \`description\`
            `);
            console.log('✅ Added image column to categories table');
        } catch (err) {
            if (err.message.includes('Duplicate column')) {
                console.log('⚠️  Column already exists: categories.image');
            } else {
                throw err;
            }
        }

        // ============================================
        // 2. ADD IMAGE COLUMN TO SUBCATEGORIES TABLE
        // ============================================
        console.log('\n📋 Adding image column to subcategories table...');

        try {
            await sequelize.query(`
                ALTER TABLE \`subcategories\`
                ADD COLUMN \`image\` VARCHAR(500) NULL 
                COMMENT 'Path to subcategory image file'
                AFTER \`description\`
            `);
            console.log('✅ Added image column to subcategories table');
        } catch (err) {
            if (err.message.includes('Duplicate column')) {
                console.log('⚠️  Column already exists: subcategories.image');
            } else {
                throw err;
            }
        }

        // ============================================
        // VERIFICATION
        // ============================================
        console.log('\n🔍 Verifying columns...');

        const [categoryColumns] = await sequelize.query(`
            SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_COMMENT
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = '${process.env.DB_NAME}'
            AND TABLE_NAME = 'categories'
            AND COLUMN_NAME = 'image'
        `);

        const [subcategoryColumns] = await sequelize.query(`
            SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_COMMENT
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = '${process.env.DB_NAME}'
            AND TABLE_NAME = 'subcategories'
            AND COLUMN_NAME = 'image'
        `);

        console.log('\n📊 Verification results:');
        if (categoryColumns.length > 0) {
            console.log('  ✅ categories.image column exists');
        } else {
            console.log('  ❌ categories.image column NOT found');
        }

        if (subcategoryColumns.length > 0) {
            console.log('  ✅ subcategories.image column exists');
        } else {
            console.log('  ❌ subcategories.image column NOT found');
        }

        console.log(`\n✨ Migration completed successfully!`);
        console.log('\n💡 Category and subcategory image upload is now ready!');

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
