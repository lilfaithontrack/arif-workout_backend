#!/usr/bin/env node

/**
 * Production Database Sync Script
 * Run this on your cPanel server to create all database tables
 * 
 * Usage: node sync-production-db.js
 */

require('dotenv').config();
const { sequelize } = require('../config/database');

async function syncProductionDatabase() {
    try {
        console.log('🔄 Starting production database sync...');
        console.log(`📊 Database: ${process.env.DB_NAME}`);
        console.log(`🖥️  Host: ${process.env.DB_HOST}`);

        // Test connection first
        await sequelize.authenticate();
        console.log('✅ Database connection successful!');

        // Import all models
        const models = require('../models');
        console.log(`📦 Loaded ${Object.keys(models).length} models`);

        // Sync all models (creates tables if they don't exist)
        console.log('🔨 Creating/updating tables...');
        await sequelize.sync({ alter: false }); // Use alter: false for production safety

        console.log('✅ All tables created successfully!');

        // List all tables
        const [tables] = await sequelize.query(`
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_SCHEMA = '${process.env.DB_NAME}'
      ORDER BY TABLE_NAME
    `);

        console.log(`\n📋 Total tables created: ${tables.length}`);
        console.log('\nTables:');
        tables.forEach((table, index) => {
            console.log(`  ${index + 1}. ${table.TABLE_NAME}`);
        });

        console.log('\n✨ Database sync completed successfully!');
        process.exit(0);

    } catch (error) {
        console.error('❌ Database sync failed:');
        console.error(error.message);
        console.error('\nFull error:', error);
        process.exit(1);
    }
}

// Run sync
syncProductionDatabase();
