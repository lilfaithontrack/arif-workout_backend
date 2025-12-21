/**
 * Migration: Add video support to exercise_images table
 * 
 * This migration adds the following columns:
 * - mediaType: ENUM('image', 'video') with default 'image'
 * - duration: INTEGER for video duration in seconds
 * - thumbnailUrl: VARCHAR(1000) for video thumbnails
 * 
 * Run this migration to enable video upload support
 */

const { sequelize } = require('../config/database');
const { QueryTypes } = require('sequelize');

async function up() {
    const transaction = await sequelize.transaction();

    try {
        console.log('Starting migration: Add video support to exercise_images table');

        // Check if columns already exist
        const [columns] = await sequelize.query(
            `SHOW COLUMNS FROM exercise_images LIKE 'mediaType'`,
            { transaction }
        );

        if (columns.length === 0) {
            // Add mediaType column
            await sequelize.query(
                `ALTER TABLE exercise_images 
                 ADD COLUMN mediaType ENUM('image', 'video') NOT NULL DEFAULT 'image' 
                 COMMENT 'Type of media file (image or video)' 
                 AFTER subfolder`,
                { transaction }
            );
            console.log('✓ Added mediaType column');

            // Add duration column
            await sequelize.query(
                `ALTER TABLE exercise_images 
                 ADD COLUMN duration INT NULL 
                 COMMENT 'Duration in seconds (for videos only)' 
                 AFTER mimeType`,
                { transaction }
            );
            console.log('✓ Added duration column');

            // Add thumbnailUrl column
            await sequelize.query(
                `ALTER TABLE exercise_images 
                 ADD COLUMN thumbnailUrl VARCHAR(1000) NULL 
                 COMMENT 'Thumbnail URL for video files' 
                 AFTER duration`,
                { transaction }
            );
            console.log('✓ Added thumbnailUrl column');

            // Add indexes
            await sequelize.query(
                `ALTER TABLE exercise_images 
                 ADD INDEX idx_mediaType (mediaType)`,
                { transaction }
            );
            console.log('✓ Added index on mediaType');

            await sequelize.query(
                `ALTER TABLE exercise_images 
                 ADD INDEX idx_exerciseSlug_mediaType (exerciseSlug, mediaType)`,
                { transaction }
            );
            console.log('✓ Added composite index on exerciseSlug and mediaType');

            await transaction.commit();
            console.log('✅ Migration completed successfully!');
        } else {
            await transaction.rollback();
            console.log('⚠️  Migration already applied - columns already exist');
        }
    } catch (error) {
        await transaction.rollback();
        console.error('❌ Migration failed:', error);
        throw error;
    }
}

async function down() {
    const transaction = await sequelize.transaction();

    try {
        console.log('Starting rollback: Remove video support from exercise_images table');

        // Remove indexes
        await sequelize.query(
            `ALTER TABLE exercise_images DROP INDEX IF EXISTS idx_mediaType`,
            { transaction }
        );
        console.log('✓ Removed index on mediaType');

        await sequelize.query(
            `ALTER TABLE exercise_images DROP INDEX IF EXISTS idx_exerciseSlug_mediaType`,
            { transaction }
        );
        console.log('✓ Removed composite index');

        // Remove columns
        await sequelize.query(
            `ALTER TABLE exercise_images DROP COLUMN IF EXISTS thumbnailUrl`,
            { transaction }
        );
        console.log('✓ Removed thumbnailUrl column');

        await sequelize.query(
            `ALTER TABLE exercise_images DROP COLUMN IF EXISTS duration`,
            { transaction }
        );
        console.log('✓ Removed duration column');

        await sequelize.query(
            `ALTER TABLE exercise_images DROP COLUMN IF EXISTS mediaType`,
            { transaction }
        );
        console.log('✓ Removed mediaType column');

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
            .then(() => process.exit(0))
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
        console.log('Usage: node add-video-support.js [up|down]');
        console.log('  up   - Apply migration');
        console.log('  down - Rollback migration');
        process.exit(1);
    }
}

module.exports = { up, down };
