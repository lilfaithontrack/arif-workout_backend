/**
 * Migration: Create tables for workout and nutrition generators
 * 
 * This migration ensures all required tables exist for:
 * - UserSurvey (already exists but verified)
 * - Exercise (already exists but verified)
 * - NutritionItem (already exists but verified)
 * 
 * Run this migration to ensure database is ready for generators
 */

const { sequelize } = require('../config/database');

async function up() {
    const transaction = await sequelize.transaction();
    
    try {
        console.log('Starting migration: Create/verify generator tables');
        
        // Check if user_surveys table exists
        const [surveyTable] = await sequelize.query(
            `SHOW TABLES LIKE 'user_surveys'`,
            { transaction }
        );
        
        if (surveyTable.length === 0) {
            console.log('Creating user_surveys table...');
            await sequelize.query(`
                CREATE TABLE user_surveys (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    userId INT NOT NULL,
                    age INT NOT NULL,
                    gender ENUM('male', 'female', 'other') NOT NULL,
                    height FLOAT NOT NULL COMMENT 'Height in cm',
                    weight FLOAT NOT NULL COMMENT 'Current weight in kg',
                    targetWeight FLOAT NULL COMMENT 'Target weight in kg',
                    primaryGoal ENUM('weight_loss', 'muscle_gain', 'strength', 'endurance', 'flexibility', 'athletic_performance', 'general_fitness', 'body_recomposition', 'rehabilitation') NOT NULL,
                    secondaryGoals JSON DEFAULT '[]' COMMENT 'Array of secondary fitness goals',
                    fitnessLevel ENUM('beginner', 'intermediate', 'advanced', 'expert') NOT NULL DEFAULT 'beginner',
                    yearsOfExperience FLOAT NULL COMMENT 'Years of workout experience',
                    activityLevel ENUM('sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extremely_active') NOT NULL,
                    workoutFrequency INT NOT NULL COMMENT 'Desired workouts per week',
                    workoutDuration INT NOT NULL COMMENT 'Available time per workout in minutes',
                    workoutLocation ENUM('gym', 'home', 'outdoor', 'hybrid') NOT NULL DEFAULT 'gym',
                    availableEquipment JSON DEFAULT '[]' COMMENT 'Array of available equipment',
                    injuries JSON DEFAULT '[]' COMMENT 'Array of current or past injuries',
                    medicalConditions JSON DEFAULT '[]' COMMENT 'Array of medical conditions',
                    limitations TEXT NULL COMMENT 'Any physical limitations or restrictions',
                    preferredExerciseTypes JSON DEFAULT '[]' COMMENT 'Cardio, strength, HIIT, yoga, etc.',
                    dislikedExercises JSON DEFAULT '[]' COMMENT 'Exercises to avoid',
                    dietaryPreference ENUM('omnivore', 'vegetarian', 'vegan', 'pescatarian', 'keto', 'paleo', 'mediterranean', 'flexible') NULL,
                    dailyCalorieTarget INT NULL COMMENT 'Target daily calories',
                    mealsPerDay INT NULL,
                    averageSleepHours FLOAT NULL,
                    stressLevel ENUM('low', 'moderate', 'high', 'very_high') NULL,
                    bodyFatPercentage FLOAT NULL,
                    muscleMass FLOAT NULL COMMENT 'Muscle mass in kg',
                    benchPressMax FLOAT NULL COMMENT '1RM in kg',
                    squatMax FLOAT NULL COMMENT '1RM in kg',
                    deadliftMax FLOAT NULL COMMENT '1RM in kg',
                    runningPace FLOAT NULL COMMENT 'Average pace in min/km',
                    aiScore FLOAT NULL COMMENT 'AI confidence score for plan generation (0-100)',
                    lastPlanGenerated DATETIME NULL COMMENT 'When the last AI plan was generated',
                    isActive BOOLEAN DEFAULT TRUE COMMENT 'Whether this survey is the active one',
                    completedAt DATETIME NULL,
                    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
                    INDEX idx_userId (userId),
                    INDEX idx_isActive (isActive),
                    INDEX idx_primaryGoal (primaryGoal),
                    INDEX idx_fitnessLevel (fitnessLevel)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
            `, { transaction });
            console.log('✓ Created user_surveys table');
        } else {
            console.log('✓ user_surveys table already exists');
        }

        // Check if exercises table exists
        const [exerciseTable] = await sequelize.query(
            `SHOW TABLES LIKE 'exercises'`,
            { transaction }
        );
        
        if (exerciseTable.length === 0) {
            console.log('Creating exercises table...');
            await sequelize.query(`
                CREATE TABLE exercises (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    slug VARCHAR(255) NOT NULL UNIQUE,
                    description TEXT NULL,
                    category ENUM('cardio', 'strength', 'flexibility', 'balance', 'sports', 'yoga', 'pilates', 'hiit') NOT NULL,
                    muscleGroups JSON DEFAULT '[]' COMMENT 'Array of muscle groups',
                    primaryMuscles JSON DEFAULT '[]' COMMENT 'Primary muscles targeted',
                    secondaryMuscles JSON DEFAULT '[]' COMMENT 'Secondary muscles engaged',
                    equipment JSON DEFAULT '[]' COMMENT 'Array of equipment needed',
                    difficulty ENUM('beginner', 'intermediate', 'advanced') NOT NULL DEFAULT 'beginner',
                    instructions JSON DEFAULT '[]' COMMENT 'Step-by-step instructions',
                    videoUrl VARCHAR(500) NULL,
                    imageUrl VARCHAR(500) NULL,
                    caloriesBurnedPerMinute DECIMAL(5, 2) NULL COMMENT 'Estimated calories burned per minute',
                    duration INT NULL COMMENT 'Default duration in seconds',
                    sets INT NULL DEFAULT 3,
                    reps INT NULL DEFAULT 10,
                    restTime INT NULL DEFAULT 60 COMMENT 'Rest time in seconds between sets',
                    tips JSON DEFAULT '[]' COMMENT 'Array of tips and safety notes',
                    variations JSON DEFAULT '[]' COMMENT 'Array of exercise variations',
                    isActive BOOLEAN DEFAULT TRUE,
                    createdBy INT NULL,
                    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    FOREIGN KEY (createdBy) REFERENCES users(id) ON DELETE SET NULL,
                    INDEX idx_category (category),
                    INDEX idx_difficulty (difficulty),
                    INDEX idx_isActive (isActive),
                    INDEX idx_createdBy (createdBy)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
            `, { transaction });
            console.log('✓ Created exercises table');
        } else {
            console.log('✓ exercises table already exists');
        }

        // Check if nutrition_items table exists
        const [nutritionTable] = await sequelize.query(
            `SHOW TABLES LIKE 'nutrition_items'`,
            { transaction }
        );
        
        if (nutritionTable.length === 0) {
            console.log('Creating nutrition_items table...');
            await sequelize.query(`
                CREATE TABLE nutrition_items (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    foodId VARCHAR(50) NOT NULL UNIQUE COMMENT 'Unique identifier',
                    name VARCHAR(255) NOT NULL COMMENT 'Food name',
                    slug VARCHAR(255) NOT NULL UNIQUE COMMENT 'URL-friendly slug',
                    category ENUM('protein', 'carbs', 'fats', 'vegetables', 'fruits', 'dairy', 'grains', 'snacks', 'beverages') NOT NULL,
                    servingSize VARCHAR(100) NULL COMMENT 'Standard serving size',
                    calories INT NOT NULL DEFAULT 0,
                    protein DECIMAL(6, 2) NULL DEFAULT 0 COMMENT 'Protein in grams',
                    carbs DECIMAL(6, 2) NULL DEFAULT 0 COMMENT 'Carbohydrates in grams',
                    fats DECIMAL(6, 2) NULL DEFAULT 0 COMMENT 'Fats in grams',
                    fiber DECIMAL(6, 2) NULL DEFAULT 0 COMMENT 'Fiber in grams',
                    sugar DECIMAL(6, 2) NULL DEFAULT 0 COMMENT 'Sugar in grams',
                    vitamins JSON DEFAULT '{}' COMMENT 'Vitamin content',
                    minerals JSON DEFAULT '{}' COMMENT 'Mineral content',
                    isVegetarian BOOLEAN DEFAULT FALSE,
                    isVegan BOOLEAN DEFAULT FALSE,
                    isGlutenFree BOOLEAN DEFAULT FALSE,
                    isDairyFree BOOLEAN DEFAULT FALSE,
                    isKeto BOOLEAN DEFAULT FALSE,
                    allergens JSON DEFAULT '[]' COMMENT 'List of allergens',
                    mealTypes JSON DEFAULT '[]' COMMENT 'Suitable meal types',
                    goals JSON DEFAULT '[]' COMMENT 'Fitness goals',
                    preparationTime INT NULL COMMENT 'Preparation time in minutes',
                    cost ENUM('low', 'medium', 'high') NULL COMMENT 'Relative cost',
                    tags JSON DEFAULT '[]' COMMENT 'Tags for filtering',
                    popularityScore INT DEFAULT 50 COMMENT 'Popularity score (0-100)',
                    imageUrl VARCHAR(500) NULL COMMENT 'Main image URL',
                    thumbnailUrl VARCHAR(500) NULL COMMENT 'Thumbnail image URL',
                    videoUrl VARCHAR(500) NULL COMMENT 'Preparation/demo video URL',
                    isActive BOOLEAN DEFAULT TRUE,
                    createdBy INT NULL,
                    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    FOREIGN KEY (createdBy) REFERENCES users(id) ON DELETE SET NULL,
                    INDEX idx_foodId (foodId),
                    INDEX idx_slug (slug),
                    INDEX idx_category (category),
                    INDEX idx_isActive (isActive),
                    INDEX idx_popularityScore (popularityScore)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
            `, { transaction });
            console.log('✓ Created nutrition_items table');
        } else {
            console.log('✓ nutrition_items table already exists');
        }

        await transaction.commit();
        console.log('✅ Migration completed successfully!');
        console.log('\n📌 All generator tables are ready');
        console.log('   - user_surveys');
        console.log('   - exercises');
        console.log('   - nutrition_items\n');
        
    } catch (error) {
        await transaction.rollback();
        console.error('❌ Migration failed:', error);
        throw error;
    }
}

async function down() {
    const transaction = await sequelize.transaction();
    
    try {
        console.log('Starting rollback: Remove generator tables');
        console.log('⚠️  WARNING: This will delete all data in these tables!');
        
        // Drop tables in reverse order (respecting foreign keys)
        await sequelize.query(`DROP TABLE IF EXISTS nutrition_items`, { transaction });
        console.log('✓ Dropped nutrition_items table');
        
        await sequelize.query(`DROP TABLE IF EXISTS exercises`, { transaction });
        console.log('✓ Dropped exercises table');
        
        await sequelize.query(`DROP TABLE IF EXISTS user_surveys`, { transaction });
        console.log('✓ Dropped user_surveys table');
        
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
                console.log('\n✅ Database is ready for workout and nutrition generators!');
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
        console.log('Usage: node create-generator-tables.js [up|down]');
        console.log('  up   - Apply migration (create tables)');
        console.log('  down - Rollback migration (drop tables)');
        process.exit(1);
    }
}

module.exports = { up, down };
