#!/usr/bin/env node

/**
 * Local Database Sync Script
 * Run this to update your local database schema to match models
 * 
 * Usage: node sync-local-db.js
 */

require('dotenv').config();
const { sequelize } = require('../config/database');

async function syncLocalDatabase() {
    try {
        console.log('🔄 Starting local database sync...');
        console.log(`📊 Database: ${process.env.DB_NAME}`);
        console.log(`🖥️  Host: ${process.env.DB_HOST}`);

        // Test connection first
        await sequelize.authenticate();
        console.log('✅ Database connection successful!');

        // Import all models
        const models = require('../models');
        console.log(`📦 Loaded ${Object.keys(models).length} models`);

        // Sync all models with alter: true (updates existing tables)
        console.log('🔨 Updating tables to match models...');
        await sequelize.sync({ alter: true }); // alter: true updates columns without dropping data

        console.log('✅ All tables updated successfully!');

        // List all tables
        const [tables] = await sequelize.query(`
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_SCHEMA = '${process.env.DB_NAME}'
      ORDER BY TABLE_NAME
    `);

        console.log(`\n📋 Total tables: ${tables.length}`);
        console.log('\nTables:');
        tables.forEach((table, index) => {
            console.log(`  ${index + 1}. ${table.TABLE_NAME}`);
        });

        console.log('\n✨ Database sync completed successfully!');
        console.log('💡 You can now login with your credentials.');
        process.exit(0);

    } catch (error) {
        console.error('❌ Database sync failed:');
        console.error(error.message);
        console.error('\nFull error:', error);
        process.exit(1);
    }
}

// Run sync
syncLocalDatabase();
