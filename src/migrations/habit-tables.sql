-- ============================================
-- Habit Tracker Tables - SQL Migration
-- For cPanel MySQL Database
-- ============================================

-- Drop tables if they exist (use with caution in production)
-- DROP TABLE IF EXISTS `habit_completions`;
-- DROP TABLE IF EXISTS `habits`;

-- ============================================
-- Table: habits
-- ============================================
CREATE TABLE IF NOT EXISTS `habits` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `userId` INT NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `category` ENUM('fitness', 'nutrition', 'sleep', 'hydration', 'mindfulness', 'productivity', 'health', 'custom') NOT NULL DEFAULT 'custom' COMMENT 'Category of the habit',
  `frequency` ENUM('daily', 'weekly', 'monthly') NOT NULL DEFAULT 'daily' COMMENT 'How often the habit should be completed',
  `targetCount` INT NOT NULL DEFAULT 1 COMMENT 'Number of times to complete per frequency period',
  `icon` VARCHAR(50) DEFAULT NULL COMMENT 'Icon name for the habit',
  `color` VARCHAR(20) DEFAULT NULL COMMENT 'Color code for the habit',
  `reminderEnabled` TINYINT(1) DEFAULT 0 COMMENT 'Whether reminders are enabled',
  `reminderTime` TIME DEFAULT NULL COMMENT 'Time for daily reminder',
  `currentStreak` INT DEFAULT 0 COMMENT 'Current consecutive completion streak',
  `longestStreak` INT DEFAULT 0 COMMENT 'Longest streak ever achieved',
  `totalCompletions` INT DEFAULT 0 COMMENT 'Total number of completions',
  `lastCompletedAt` DATETIME DEFAULT NULL COMMENT 'Last time the habit was completed',
  `startDate` DATE NOT NULL COMMENT 'Date when habit tracking started',
  `isActive` TINYINT(1) DEFAULT 1 COMMENT 'Whether the habit is currently active',
  `isArchived` TINYINT(1) DEFAULT 0 COMMENT 'Whether the habit is archived',
  `notes` TEXT DEFAULT NULL COMMENT 'Additional notes about the habit',
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_habits_userId` (`userId`),
  KEY `idx_habits_category` (`category`),
  KEY `idx_habits_isActive` (`isActive`),
  KEY `idx_habits_startDate` (`startDate`),
  CONSTRAINT `fk_habits_userId` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='User habits for tracking';

-- ============================================
-- Table: habit_completions
-- ============================================
CREATE TABLE IF NOT EXISTS `habit_completions` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `habitId` INT NOT NULL,
  `userId` INT NOT NULL,
  `completedAt` DATETIME NOT NULL COMMENT 'When the habit was completed',
  `completionDate` DATE NOT NULL COMMENT 'Date of completion (for tracking daily completions)',
  `notes` TEXT DEFAULT NULL COMMENT 'Optional notes about this completion',
  `mood` ENUM('great', 'good', 'okay', 'bad', 'terrible') DEFAULT NULL COMMENT 'User mood during completion',
  `difficulty` ENUM('very_easy', 'easy', 'moderate', 'hard', 'very_hard') DEFAULT NULL COMMENT 'How difficult it was to complete',
  `value` INT DEFAULT NULL COMMENT 'Numeric value for quantifiable habits (e.g., glasses of water, minutes exercised)',
  `metadata` JSON DEFAULT NULL COMMENT 'Additional metadata about the completion',
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_habit_completions_habitId` (`habitId`),
  KEY `idx_habit_completions_userId` (`userId`),
  KEY `idx_habit_completions_completionDate` (`completionDate`),
  KEY `idx_habit_completions_completedAt` (`completedAt`),
  CONSTRAINT `fk_habit_completions_habitId` FOREIGN KEY (`habitId`) REFERENCES `habits` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_habit_completions_userId` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Habit completion records';

-- ============================================
-- Verify Tables Created
-- ============================================
-- Run these queries to verify:
-- SHOW TABLES LIKE 'habit%';
-- DESCRIBE habits;
-- DESCRIBE habit_completions;

-- ============================================
-- Sample Data (Optional - for testing)
-- ============================================
/*
-- Insert a sample habit
INSERT INTO `habits` 
  (`userId`, `name`, `description`, `category`, `frequency`, `targetCount`, `icon`, `color`, `startDate`, `isActive`) 
VALUES 
  (1, 'Morning Workout', 'Complete a 30-minute workout session', 'fitness', 'daily', 1, 'fitness', '#FF6B6B', CURDATE(), 1);

-- Insert a sample completion
INSERT INTO `habit_completions` 
  (`habitId`, `userId`, `completedAt`, `completionDate`, `mood`, `difficulty`, `value`) 
VALUES 
  (1, 1, NOW(), CURDATE(), 'great', 'moderate', 1);
*/

-- ============================================
-- Notes:
-- ============================================
-- 1. Make sure the 'users' table exists before running this script
-- 2. The foreign key constraints require the users table to have an 'id' column
-- 3. TINYINT(1) is used for boolean values (0 = false, 1 = true)
-- 4. JSON type is supported in MySQL 5.7.8+
-- 5. All timestamps use DATETIME type
-- 6. Character set is utf8mb4 for full Unicode support including emojis
-- 7. ON DELETE CASCADE means if a user is deleted, their habits are also deleted
-- 8. ON UPDATE CASCADE means if a user's id changes, it updates in habits table
