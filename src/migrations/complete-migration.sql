-- Complete Database Migration Script
-- Date: 2025-12-21
-- Description: Creates all missing tables for Arif Workout Backend
-- Usage: Import this file in phpMyAdmin or MySQL Workbench

-- ============================================
-- 1. NUTRITION IMAGES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS `nutrition_images` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nutritionSlug` VARCHAR(255) NOT NULL COMMENT 'Slug identifier for the nutrition item',
  `nutritionItemId` INT NULL COMMENT 'Foreign key to nutrition_items table',
  `subfolder` ENUM('main', 'portions', 'prepared', 'nutrition-label', 'meal-prep', 'recipes', 'alternatives') NOT NULL COMMENT 'Subfolder category for organization',
  `mediaType` ENUM('image', 'video') NOT NULL DEFAULT 'image' COMMENT 'Type of media file',
  `filename` VARCHAR(255) NOT NULL COMMENT 'Generated filename with timestamp',
  `originalName` VARCHAR(255) NULL COMMENT 'Original filename from upload',
  `path` VARCHAR(500) NOT NULL COMMENT 'Full file path on server',
  `url` VARCHAR(500) NOT NULL COMMENT 'Public URL to access the file',
  `size` INT NULL COMMENT 'File size in bytes',
  `mimeType` VARCHAR(100) NULL COMMENT 'MIME type of the file',
  `uploadedBy` INT NULL COMMENT 'User who uploaded the file',
  `isPrimary` BOOLEAN DEFAULT FALSE COMMENT 'Whether this is the primary/main image',
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  
  INDEX `idx_nutritionSlug` (`nutritionSlug`),
  INDEX `idx_nutritionItemId` (`nutritionItemId`),
  INDEX `idx_subfolder` (`subfolder`),
  INDEX `idx_mediaType` (`mediaType`),
  INDEX `idx_isPrimary` (`isPrimary`),
  INDEX `idx_uploadedBy` (`uploadedBy`),
  
  FOREIGN KEY (`uploadedBy`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY (`nutritionItemId`) REFERENCES `nutrition_items`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 2. ADVERTISEMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS `advertisements` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT NULL,
  `imageUrl` VARCHAR(500) NULL,
  `videoUrl` VARCHAR(500) NULL,
  `linkUrl` VARCHAR(500) NULL,
  `type` ENUM('banner', 'popup', 'sidebar', 'inline') NOT NULL DEFAULT 'banner',
  `placement` VARCHAR(100) NULL COMMENT 'Where to show the ad',
  `priority` INT DEFAULT 0 COMMENT 'Higher priority ads show first',
  `startDate` DATETIME NULL,
  `endDate` DATETIME NULL,
  `isActive` BOOLEAN DEFAULT TRUE,
  `impressions` INT DEFAULT 0 COMMENT 'Number of times shown',
  `clicks` INT DEFAULT 0 COMMENT 'Number of clicks',
  `createdBy` INT NULL,
  `approvedBy` INT NULL,
  `approvalDate` DATETIME NULL,
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  
  INDEX `idx_type` (`type`),
  INDEX `idx_placement` (`placement`),
  INDEX `idx_priority` (`priority`),
  INDEX `idx_isActive` (`isActive`),
  INDEX `idx_startDate` (`startDate`),
  INDEX `idx_endDate` (`endDate`),
  INDEX `idx_createdBy` (`createdBy`),
  INDEX `idx_approvedBy` (`approvedBy`),
  
  FOREIGN KEY (`createdBy`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY (`approvedBy`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================
-- Run these to verify tables were created successfully

-- Check nutrition_images table
SELECT COUNT(*) as nutrition_images_exists 
FROM information_schema.tables 
WHERE table_schema = DATABASE() 
AND table_name = 'nutrition_images';

-- Check advertisements table
SELECT COUNT(*) as advertisements_exists 
FROM information_schema.tables 
WHERE table_schema = DATABASE() 
AND table_name = 'advertisements';

-- List all tables
SHOW TABLES;

-- ============================================
-- SUCCESS MESSAGE
-- ============================================
SELECT 'Migration completed successfully! All tables created.' as status;
