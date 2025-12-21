-- Migration: Create nutrition_images table
-- Date: 2025-12-21
-- Description: Table for storing nutrition item images and videos

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
