/**
 * Migration: Create advertisements table
 * 
 * This migration creates the advertisements table for managing
 * professional advertisements on the platform
 */

const { sequelize } = require('../config/database');

async function up() {
    const transaction = await sequelize.transaction();
    
    try {
        console.log('Starting migration: Create advertisements table');
        
        // Check if advertisements table exists
        const [table] = await sequelize.query(
            `SHOW TABLES LIKE 'advertisements'`,
            { transaction }
        );
        
        if (table.length === 0) {
            console.log('Creating advertisements table...');
            await sequelize.query(`
                CREATE TABLE advertisements (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    
                    -- Basic Information
                    title VARCHAR(255) NOT NULL COMMENT 'Advertisement title',
                    description TEXT NULL COMMENT 'Advertisement description/content',
                    type ENUM('banner', 'popup', 'sidebar', 'inline', 'video', 'native') NOT NULL DEFAULT 'banner' COMMENT 'Type of advertisement',
                    category ENUM('fitness', 'nutrition', 'equipment', 'supplements', 'apparel', 'general') NOT NULL DEFAULT 'general' COMMENT 'Advertisement category',
                    
                    -- Media
                    imageUrl VARCHAR(500) NULL COMMENT 'Main advertisement image URL',
                    thumbnailUrl VARCHAR(500) NULL COMMENT 'Thumbnail image URL',
                    videoUrl VARCHAR(500) NULL COMMENT 'Video advertisement URL',
                    
                    -- Link & CTA
                    targetUrl VARCHAR(1000) NOT NULL COMMENT 'URL where ad clicks should redirect',
                    ctaText VARCHAR(100) NULL DEFAULT 'Learn More' COMMENT 'Call-to-action button text',
                    
                    -- Placement & Display
                    placement JSON DEFAULT '[]' COMMENT 'Array of page placements',
                    position ENUM('top', 'bottom', 'left', 'right', 'center', 'floating') NULL DEFAULT 'top' COMMENT 'Position on the page',
                    dimensions JSON DEFAULT '{}' COMMENT 'Width and height dimensions',
                    
                    -- Scheduling
                    startDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'When ad should start showing',
                    endDate DATETIME NULL COMMENT 'When ad should stop showing',
                    
                    -- Targeting
                    targetAudience JSON DEFAULT '{}' COMMENT 'Targeting criteria',
                    targetDevices JSON DEFAULT '["desktop", "mobile", "tablet"]' COMMENT 'Device types to show ad on',
                    
                    -- Priority & Budget
                    priority INT NOT NULL DEFAULT 5 COMMENT 'Display priority (1-10)',
                    dailyBudget DECIMAL(10, 2) NULL COMMENT 'Daily budget in currency',
                    totalBudget DECIMAL(10, 2) NULL COMMENT 'Total campaign budget',
                    costPerClick DECIMAL(10, 2) NULL COMMENT 'Cost per click (CPC)',
                    costPerImpression DECIMAL(10, 4) NULL COMMENT 'Cost per 1000 impressions (CPM)',
                    
                    -- Analytics
                    impressions INT DEFAULT 0 COMMENT 'Total number of times ad was displayed',
                    clicks INT DEFAULT 0 COMMENT 'Total number of clicks',
                    conversions INT DEFAULT 0 COMMENT 'Total number of conversions/actions',
                    totalSpent DECIMAL(10, 2) DEFAULT 0 COMMENT 'Total amount spent on this ad',
                    
                    -- Advertiser Information
                    advertiserName VARCHAR(255) NOT NULL COMMENT 'Name of the advertiser/company',
                    advertiserEmail VARCHAR(255) NULL COMMENT 'Contact email for advertiser',
                    advertiserPhone VARCHAR(50) NULL COMMENT 'Contact phone for advertiser',
                    advertiserWebsite VARCHAR(500) NULL COMMENT 'Advertiser website',
                    
                    -- Status & Moderation
                    status ENUM('draft', 'pending', 'approved', 'active', 'paused', 'completed', 'rejected') NOT NULL DEFAULT 'draft' COMMENT 'Advertisement status',
                    isActive BOOLEAN DEFAULT FALSE COMMENT 'Whether ad is currently active',
                    moderationNotes TEXT NULL COMMENT 'Notes from moderation/review',
                    
                    -- Management
                    createdBy INT NULL COMMENT 'Admin user who created this ad',
                    approvedBy INT NULL COMMENT 'Admin user who approved this ad',
                    approvedAt DATETIME NULL COMMENT 'When ad was approved',
                    
                    -- Additional Settings
                    maxImpressions INT NULL COMMENT 'Maximum impressions allowed',
                    maxClicks INT NULL COMMENT 'Maximum clicks allowed',
                    frequency JSON DEFAULT '{}' COMMENT 'Frequency capping settings',
                    tags JSON DEFAULT '[]' COMMENT 'Tags for organizing ads',
                    notes TEXT NULL COMMENT 'Internal notes about this ad',
                    
                    -- Timestamps
                    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    
                    -- Foreign Keys
                    FOREIGN KEY (createdBy) REFERENCES users(id) ON DELETE SET NULL,
                    FOREIGN KEY (approvedBy) REFERENCES users(id) ON DELETE SET NULL,
                    
                    -- Indexes
                    INDEX idx_status (status),
                    INDEX idx_isActive (isActive),
                    INDEX idx_type (type),
                    INDEX idx_category (category),
                    INDEX idx_startDate (startDate),
                    INDEX idx_endDate (endDate),
                    INDEX idx_priority (priority),
                    INDEX idx_createdBy (createdBy),
                    INDEX idx_approvedBy (approvedBy),
                    INDEX idx_advertiserName (advertiserName),
                    INDEX idx_status_isActive (status, isActive),
                    INDEX idx_type_category (type, category)
                    
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
            `, { transaction });
            console.log('✓ Created advertisements table');
        } else {
            console.log('✓ advertisements table already exists');
        }

        await transaction.commit();
        console.log('✅ Migration completed successfully!');
        console.log('\n📌 Advertisements table is ready');
        console.log('   - Full CRUD operations available');
        console.log('   - Analytics tracking enabled');
        console.log('   - Budget management supported');
        console.log('   - Multi-placement support\n');
        
    } catch (error) {
        await transaction.rollback();
        console.error('❌ Migration failed:', error);
        throw error;
    }
}

async function down() {
    const transaction = await sequelize.transaction();
    
    try {
        console.log('Starting rollback: Remove advertisements table');
        console.log('⚠️  WARNING: This will delete all advertisement data!');
        
        await sequelize.query(`DROP TABLE IF EXISTS advertisements`, { transaction });
        console.log('✓ Dropped advertisements table');
        
        await transaction.commit();
        console.log('✅ Rollback completed successfully!');
    } catch (error) {
        await transaction.rollback();
        console.error('❌ Rollback failed:', error);
        throw error;
    }
}

// Run migration if called directly
if (require.main === module) {
    const command = process.argv[2];
    
    if (command === 'up') {
        up()
            .then(() => {
                console.log('\n✅ Advertisements system is ready!');
                console.log('\n📌 Next steps:');
                console.log('   1. Create advertisements via admin panel');
                console.log('   2. Use GET /api/advertisements/active to fetch ads');
                console.log('   3. Track impressions/clicks for analytics\n');
                process.exit(0);
            })
            .catch((error) => {
                console.error(error);
                process.exit(1);
            });
    } else if (command === 'down') {
        down()
            .then(() => process.exit(0))
            .catch((error) => {
                console.error(error);
                process.exit(1);
            });
    } else {
        console.log('Usage: node create-advertisements-table.js [up|down]');
        console.log('  up   - Apply migration (create table)');
        console.log('  down - Rollback migration (drop table)');
        process.exit(1);
    }
}

module.exports = { up, down };
