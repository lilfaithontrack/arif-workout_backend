#!/usr/bin/env node

/**
 * Add missing User table columns
 * Quick fix for otpCode and otpExpiry columns
 */

require('dotenv').config();
const { sequelize } = require('../config/database');

async function addMissingUserColumns() {
    try {
        console.log('🔄 Adding missing columns to users table...');

        await sequelize.authenticate();
        console.log('✅ Database connected');

        // Check if columns exist
        const [columns] = await sequelize.query(`
      SHOW COLUMNS FROM users LIKE 'otpCode'
    `);

        if (columns.length === 0) {
            console.log('➕ Adding otpCode column...');
            await sequelize.query(`
        ALTER TABLE users 
        ADD COLUMN otpCode VARCHAR(6) NULL AFTER isActive
      `);
            console.log('✅ otpCode column added');
        } else {
            console.log('✓ otpCode column already exists');
        }

        const [expiryColumns] = await sequelize.query(`
      SHOW COLUMNS FROM users LIKE 'otpExpiry'
    `);

        if (expiryColumns.length === 0) {
            console.log('➕ Adding otpExpiry column...');
            await sequelize.query(`
        ALTER TABLE users 
        ADD COLUMN otpExpiry DATETIME NULL AFTER otpCode
      `);
            console.log('✅ otpExpiry column added');
        } else {
            console.log('✓ otpExpiry column already exists');
        }

        console.log('\n✨ User table updated successfully!');
        console.log('💡 You can now login without errors.');
        process.exit(0);

    } catch (error) {
        console.error('❌ Migration failed:');
        console.error(error.message);
        process.exit(1);
    }
}

addMissingUserColumns();
