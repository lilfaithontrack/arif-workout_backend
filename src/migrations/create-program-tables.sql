-- Migration: Create Program Hierarchy Tables
-- This SQL creates the tables needed for the Program -> Workout -> Exercise structure

-- ==========================================
-- PROGRAMS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS programs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    categoryId INT,
    categoryName VARCHAR(100),
    level ENUM('beginner', 'intermediate', 'advanced', 'all_levels') NOT NULL DEFAULT 'beginner',
    goal ENUM('weight_loss', 'muscle_gain', 'endurance', 'flexibility', 'general_fitness', 'strength', 'stabilization'),
    durationWeeks INT,
    workoutsCount INT DEFAULT 0,
    imageUrl VARCHAR(500),
    bannerImageUrl VARCHAR(500),
    isActive BOOLEAN DEFAULT TRUE,
    isFeatured BOOLEAN DEFAULT FALSE,
    tags JSON DEFAULT '[]',
    equipment JSON DEFAULT '[]',
    createdBy INT,
    orderIndex INT DEFAULT 0,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (categoryId) REFERENCES categories(id) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (createdBy) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_programs_category ON programs(categoryId);
CREATE INDEX idx_programs_level ON programs(level);
CREATE INDEX idx_programs_goal ON programs(goal);
CREATE INDEX idx_programs_isActive ON programs(isActive);
CREATE INDEX idx_programs_isFeatured ON programs(isFeatured);
CREATE INDEX idx_programs_createdBy ON programs(createdBy);
CREATE INDEX idx_programs_order ON programs(orderIndex);

-- ==========================================
-- PROGRAM WORKOUTS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS program_workouts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    programId INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    level ENUM('beginner', 'intermediate', 'advanced'),
    weekNumber INT,
    dayNumber INT,
    durationMinutes INT,
    exercisesCount INT DEFAULT 0,
    caloriesBurnEstimate INT,
    focusArea VARCHAR(100),
    orderIndex INT DEFAULT 0,
    isActive BOOLEAN DEFAULT TRUE,
    instructions TEXT,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (programId) REFERENCES programs(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_progworkouts_program_order ON program_workouts(programId, orderIndex);
CREATE INDEX idx_progworkouts_program_week_day ON program_workouts(programId, weekNumber, dayNumber);
CREATE INDEX idx_progworkouts_level ON program_workouts(level);
CREATE INDEX idx_progworkouts_isActive ON program_workouts(isActive);

-- ==========================================
-- WORKOUT EXERCISES TABLE (Junction)
-- ==========================================
CREATE TABLE IF NOT EXISTS workout_exercises (
    id INT PRIMARY KEY AUTO_INCREMENT,
    programWorkoutId INT NOT NULL,
    exerciseId INT NOT NULL,
    section ENUM('warm_up', 'main', 'cool_down', 'superset') NOT NULL DEFAULT 'main',
    sectionName VARCHAR(100),
    orderIndex INT DEFAULT 0,
    sets INT DEFAULT 3,
    reps INT,
    repsDisplay VARCHAR(50),
    durationSeconds INT,
    restSeconds INT DEFAULT 60,
    tempo VARCHAR(20),
    weight DECIMAL(6,2),
    intensity ENUM('low', 'moderate', 'high'),
    instructions TEXT,
    videoUrl VARCHAR(500),
    isActive BOOLEAN DEFAULT TRUE,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (programWorkoutId) REFERENCES program_workouts(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (exerciseId) REFERENCES exercises(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_workoutex_workout_order ON workout_exercises(programWorkoutId, orderIndex);
CREATE INDEX idx_workoutex_workout_section ON workout_exercises(programWorkoutId, section);
CREATE INDEX idx_workoutex_exercise ON workout_exercises(exerciseId);
CREATE INDEX idx_workoutex_isActive ON workout_exercises(isActive);

-- ==========================================
-- USER PROGRAMS TABLE (Enrollments)
-- ==========================================
CREATE TABLE IF NOT EXISTS user_programs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    userId INT NOT NULL,
    programId INT NOT NULL,
    currentWorkoutId INT,
    currentWeek INT DEFAULT 1,
    currentDay INT DEFAULT 1,
    status ENUM('not_started', 'in_progress', 'completed', 'paused') DEFAULT 'not_started',
    progressPercentage DECIMAL(5,2) DEFAULT 0,
    completedWorkouts INT DEFAULT 0,
    totalWorkouts INT DEFAULT 0,
    startDate DATETIME,
    endDate DATETIME,
    completedDate DATETIME,
    rating INT,
    feedback TEXT,
    isFavorite BOOLEAN DEFAULT FALSE,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (programId) REFERENCES programs(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (currentWorkoutId) REFERENCES program_workouts(id) ON DELETE SET NULL ON UPDATE CASCADE,
    UNIQUE KEY unique_user_program (userId, programId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_userprog_user_status ON user_programs(userId, status);
CREATE INDEX idx_userprog_program ON user_programs(programId);
CREATE INDEX idx_userprog_status ON user_programs(status);

-- ==========================================
-- SEED DATA (Sample Programs)
-- ==========================================

-- Example: Insert sample program data (uncomment to use)

-- INSERT INTO programs (name, slug, description, categoryName, level, goal, durationWeeks, workoutsCount, isActive, orderIndex)
-- VALUES 
-- ('Bodyweight Stabilization Training', 'bodyweight-stabilization-training', 'Build core stability and endurance', 'Stabilization Endurance', 'beginner', 'stabilization', 4, 3, TRUE, 1),
-- ('Bodyweight Strength Training', 'bodyweight-strength-training', 'Develop overall strength', 'General Fitness', 'intermediate', 'strength', 6, 3, TRUE, 2);

-- Note: Run this SQL in your MySQL client or use the JS migration: 
-- node src/migrations/create-program-tables.js up
