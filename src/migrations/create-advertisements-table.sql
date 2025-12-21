-- Migration: Create advertisements table
-- Date: 2025-12-21
-- Description: Table for managing advertisements

CREATE TABLE IF NOT EXISTS `advertisements` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT NULL,
  `imageUrl` VARCHAR(500) NULL,
  `videoUrl` VARCHAR(500) NULL,
  `linkUrl` VARCHAR(500) NULL,
  `type` ENUM('banner', 'popup', 'sidebar', 'inline') NOT NULL DEFAULT 'banner',
  `placement` VARCHAR(100) NULL COMMENT 'Where to show the ad (home, workout, nutrition, etc.)',
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
