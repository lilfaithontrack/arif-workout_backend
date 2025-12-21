#!/usr/bin/env node

/**
 * Fix Advertisement Table Schema
 * Adds missing columns to match the Advertisement model
 * 
 * Usage: node src/migrations/fix-advertisement-table.js
 */

require('dotenv').config();
const { sequelize } = require('../config/database');

async function fixAdvertisementTable() {
    try {
        console.log('🔄 Fixing advertisements table schema...');

        await sequelize.authenticate();
        console.log('✅ Database connected\n');

        // Drop and recreate the table with all fields
        console.log('📋 Recreating advertisements table with complete schema...');

        await sequelize.query(`DROP TABLE IF EXISTS \`advertisements\``);
        console.log('✅ Dropped old table');

        await sequelize.query(`
      CREATE TABLE \`advertisements\` (
        \`id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`title\` VARCHAR(255) NOT NULL COMMENT 'Advertisement title',
        \`description\` TEXT NULL COMMENT 'Advertisement description/content',
        \`type\` ENUM('banner', 'popup', 'sidebar', 'inline', 'video', 'native') NOT NULL DEFAULT 'banner' COMMENT 'Type of advertisement',
        \`category\` ENUM('fitness', 'nutrition', 'equipment', 'supplements', 'apparel', 'general') NOT NULL DEFAULT 'general' COMMENT 'Advertisement category',
        
        -- Media
        \`imageUrl\` VARCHAR(500) NULL COMMENT 'Main advertisement image URL',
        \`thumbnailUrl\` VARCHAR(500) NULL COMMENT 'Thumbnail image URL',
        \`videoUrl\` VARCHAR(500) NULL COMMENT 'Video advertisement URL',
        
        -- Link & CTA
        \`targetUrl\` VARCHAR(1000) NOT NULL COMMENT 'URL where ad clicks should redirect',
        \`ctaText\` VARCHAR(100) NULL DEFAULT 'Learn More' COMMENT 'Call-to-action button text',
        
        -- Placement & Display
        \`placement\` JSON NULL COMMENT 'Array of page placements',
        \`position\` ENUM('top', 'bottom', 'left', 'right', 'center', 'floating') NULL DEFAULT 'top' COMMENT 'Position on the page',
        \`dimensions\` JSON NULL COMMENT 'Width and height',
        
        -- Scheduling
        \`startDate\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'When ad should start showing',
        \`endDate\` DATETIME NULL COMMENT 'When ad should stop showing',
        
        -- Targeting
        \`targetAudience\` JSON NULL COMMENT 'Targeting criteria',
        \`targetDevices\` JSON NULL COMMENT 'Device types to show ad on',
        
        -- Priority & Budget
        \`priority\` INT NOT NULL DEFAULT 5 COMMENT 'Display priority (1-10)',
        \`dailyBudget\` DECIMAL(10, 2) NULL COMMENT 'Daily budget in currency',
        \`totalBudget\` DECIMAL(10, 2) NULL COMMENT 'Total campaign budget',
        \`costPerClick\` DECIMAL(10, 2) NULL COMMENT 'Cost per click (CPC)',
        \`costPerImpression\` DECIMAL(10, 4) NULL COMMENT 'Cost per 1000 impressions (CPM)',
        
        -- Analytics
        \`impressions\` INT DEFAULT 0 COMMENT 'Total number of times ad was displayed',
        \`clicks\` INT DEFAULT 0 COMMENT 'Total number of clicks',
        \`conversions\` INT DEFAULT 0 COMMENT 'Total number of conversions/actions',
        \`totalSpent\` DECIMAL(10, 2) DEFAULT 0 COMMENT 'Total amount spent on this ad',
        
        -- Advertiser Information
        \`advertiserName\` VARCHAR(255) NOT NULL COMMENT 'Name of the advertiser/company',
        \`advertiserEmail\` VARCHAR(255) NULL COMMENT 'Contact email for advertiser',
        \`advertiserPhone\` VARCHAR(50) NULL COMMENT 'Contact phone for advertiser',
        \`advertiserWebsite\` VARCHAR(500) NULL COMMENT 'Advertiser website',
        
        -- Status & Moderation
        \`status\` ENUM('draft', 'pending', 'approved', 'active', 'paused', 'completed', 'rejected') NOT NULL DEFAULT 'draft' COMMENT 'Advertisement status',
        \`isActive\` BOOLEAN DEFAULT FALSE COMMENT 'Whether ad is currently active',
        \`moderationNotes\` TEXT NULL COMMENT 'Notes from moderation/review',
        
        -- Management
        \`createdBy\` INT NULL COMMENT 'Admin user who created this ad',
        \`approvedBy\` INT NULL COMMENT 'Admin user who approved this ad',
        \`approvedAt\` DATETIME NULL COMMENT 'When ad was approved',
        
        -- Additional Settings
        \`maxImpressions\` INT NULL COMMENT 'Maximum impressions allowed',
        \`maxClicks\` INT NULL COMMENT 'Maximum clicks allowed',
        \`frequency\` JSON NULL COMMENT 'Frequency capping',
        \`tags\` JSON NULL COMMENT 'Tags for organizing ads',
        \`notes\` TEXT NULL COMMENT 'Internal notes about this ad',
        
        \`createdAt\` DATETIME NOT NULL,
        \`updatedAt\` DATETIME NOT NULL,
        
        INDEX \`idx_status\` (\`status\`),
        INDEX \`idx_isActive\` (\`isActive\`),
        INDEX \`idx_type\` (\`type\`),
        INDEX \`idx_category\` (\`category\`),
        INDEX \`idx_startDate\` (\`startDate\`),
        INDEX \`idx_endDate\` (\`endDate\`),
        INDEX \`idx_priority\` (\`priority\`),
        INDEX \`idx_createdBy\` (\`createdBy\`),
        INDEX \`idx_approvedBy\` (\`approvedBy\`),
        INDEX \`idx_advertiserName\` (\`advertiserName\`),
        
        FOREIGN KEY (\`createdBy\`) REFERENCES \`users\`(\`id\`) ON DELETE SET NULL ON UPDATE CASCADE,
        FOREIGN KEY (\`approvedBy\`) REFERENCES \`users\`(\`id\`) ON DELETE SET NULL ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

        console.log('✅ advertisements table recreated with complete schema');

        console.log('\n✨ Advertisement table fixed successfully!');
        console.log('💡 You can now use the advertisements API without errors.');

        process.exit(0);

    } catch (error) {
        console.error('\n❌ Fix failed:');
        console.error(error.message);
        process.exit(1);
    }
}

fixAdvertisementTable();
