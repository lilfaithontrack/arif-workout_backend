-- ============================================================================
-- ARIF WORKOUT — Database Schema (designed around seed.json structure)
-- ============================================================================
-- Hierarchy derived from seed.json:
--
--   Category (lookup)            e.g. "General Fitness", "Stabilization Endurance"
--     └── Program                e.g. "Bodyweight Strength Training"
--           └── ProgramWorkout   e.g. "Bodyweight Strength Level 1"
--                 └── WorkoutExercise (junction)
--                       ├── Exercise (master)    e.g. "SMR Calves"
--                       └── WorkoutSection (lookup)  e.g. "Warm-Up"
--
-- Every field in seed.json maps to a column below. Fields not in seed.json
-- (imageUrl, tags, equipment, NASM phase, etc.) are included for app use but
-- are nullable so seeding never requires them.
-- ============================================================================

SET FOREIGN_KEY_CHECKS = 0;
SET NAMES utf8mb4;

-- ============================================================================
-- 1. CATEGORIES  (from seed.json: program.category)
-- ============================================================================
CREATE TABLE IF NOT EXISTS categories (
    id          INT PRIMARY KEY AUTO_INCREMENT,
    name        VARCHAR(255) NOT NULL,                         -- "General Fitness"
    slug        VARCHAR(255) NOT NULL UNIQUE,                  -- "general_fitness"
    description TEXT,
    image       VARCHAR(500),                                  -- optional category icon
    createdBy   INT NOT NULL,
    createdAt   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (createdBy) REFERENCES users(id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_categories_createdBy ON categories(createdBy);

-- ============================================================================
-- 2. PROGRAMS  (from seed.json: programName + category)
-- ============================================================================
CREATE TABLE IF NOT EXISTS programs (
    id              INT PRIMARY KEY AUTO_INCREMENT,
    name            VARCHAR(255) NOT NULL,                     -- "Bodyweight Strength Training"
    slug            VARCHAR(255) NOT NULL UNIQUE,
    description     TEXT,
    categoryId      INT,                                       -- FK → categories
    categoryName    VARCHAR(100),                              -- denormalized for quick display
    level           ENUM('beginner','intermediate','advanced','all_levels')
                        NOT NULL DEFAULT 'all_levels',
    goal            ENUM('weight_loss','muscle_gain','endurance',
                        'flexibility','general_fitness','strength','stabilization'),
    durationWeeks   INT,
    workoutsCount   INT DEFAULT 0,                             -- from seed: workouts.length
    imageUrl        VARCHAR(500),
    bannerImageUrl  VARCHAR(500),
    isActive        BOOLEAN DEFAULT TRUE,
    isFeatured      BOOLEAN DEFAULT FALSE,
    tags            JSON DEFAULT '[]',
    equipment       JSON DEFAULT '[]',
    createdBy       INT,
    orderIndex      INT DEFAULT 0,                             -- display order
    -- NASM OPT Model (optional, not in seed.json)
    optPhase        ENUM('stabilization_endurance','strength_endurance',
                        'muscular_development','maximal_strength','power'),
    optPhaseNumber  INT,
    assessmentRequired BOOLEAN DEFAULT FALSE,
    hasAssessments  BOOLEAN DEFAULT FALSE,
    progressionType ENUM('linear','undulating','block','conjugate') DEFAULT 'linear',
    createdAt       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (categoryId) REFERENCES categories(id) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (createdBy)  REFERENCES users(id)      ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_programs_category    ON programs(categoryId);
CREATE INDEX idx_programs_level       ON programs(level);
CREATE INDEX idx_programs_goal        ON programs(goal);
CREATE INDEX idx_programs_isActive    ON programs(isActive);
CREATE INDEX idx_programs_isFeatured  ON programs(isFeatured);
CREATE INDEX idx_programs_createdBy   ON programs(createdBy);
CREATE INDEX idx_programs_order       ON programs(orderIndex);

-- ============================================================================
-- 3. PROGRAM_WORKOUTS  (from seed.json: program.workouts[])
--    Each "workout" inside a program (e.g. "Bodyweight Strength Level 1")
-- ============================================================================
CREATE TABLE IF NOT EXISTS program_workouts (
    id                  INT PRIMARY KEY AUTO_INCREMENT,
    programId           INT NOT NULL,                          -- FK → programs
    name                VARCHAR(255) NOT NULL,                 -- "Bodyweight Strength Level 1"
    description         TEXT,
    level               ENUM('beginner','intermediate','advanced'),
    weekNumber          INT,                                   -- which week (optional)
    dayNumber           INT,                                   -- day within week 1-7 (optional)
    durationMinutes     INT,                                   -- from seed: durationMinutes (25)
    exercisesCount      INT DEFAULT 0,                         -- from seed: exerciseCount (18)
    caloriesBurnEstimate INT,
    focusArea           VARCHAR(100),                          -- "Full Body", "Upper Body", etc.
    orderIndex          INT DEFAULT 0,                         -- order within program
    isActive            BOOLEAN DEFAULT TRUE,
    instructions        TEXT,                                  -- pre-workout instructions
    -- NASM OPT fields (optional)
    phase               ENUM('stabilization_endurance','strength_endurance',
                            'muscular_development','maximal_strength','power'),
    phaseNumber         INT,
    isAssessment        BOOLEAN DEFAULT FALSE,
    assessmentType      VARCHAR(100),
    createdAt           DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt           DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (programId) REFERENCES programs(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_pw_program_order   ON program_workouts(programId, orderIndex);
CREATE INDEX idx_pw_program_week_day ON program_workouts(programId, weekNumber, dayNumber);
CREATE INDEX idx_pw_level           ON program_workouts(level);
CREATE INDEX idx_pw_isActive        ON program_workouts(isActive);

-- ============================================================================
-- 4. WORKOUT_SECTIONS  (from seed.json: sections[].sectionName)
--    Lookup table: "Warm-Up", "Core / Balance / Plyometric", etc.
-- ============================================================================
CREATE TABLE IF NOT EXISTS workout_sections (
    id          CHAR(36) PRIMARY KEY,                          -- UUID
    name        VARCHAR(100) NOT NULL,                         -- "Warm-Up"
    slug        VARCHAR(100) NOT NULL UNIQUE,                  -- "warm_up"
    description TEXT,
    ordinal     INT DEFAULT 0,                                 -- display order
    color       VARCHAR(20),                                   -- UI color
    isActive    BOOLEAN DEFAULT TRUE,
    isHidden    BOOLEAN DEFAULT FALSE,
    createdAt   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_ws_ordinal  ON workout_sections(ordinal);
CREATE INDEX idx_ws_isActive ON workout_sections(isActive);

-- ============================================================================
-- 5. EXERCISES  (from seed.json: sections[].exercises[].name — deduplicated)
--    Master list of all unique exercise names across every workout
-- ============================================================================
CREATE TABLE IF NOT EXISTS exercises (
    id                      INT PRIMARY KEY AUTO_INCREMENT,
    name                    VARCHAR(255) NOT NULL,             -- "SMR Calves"
    slug                    VARCHAR(255) NOT NULL UNIQUE,
    description             TEXT,
    category                ENUM('cardio','strength','flexibility','balance',
                                'sports','yoga','pilates','hiit') NOT NULL,
    muscleGroups            JSON DEFAULT '[]',                 -- ["chest","back","legs",...]
    primaryMuscles          JSON DEFAULT '[]',
    secondaryMuscles        JSON DEFAULT '[]',
    equipment               JSON DEFAULT '[]',                 -- ["dumbbells","barbell",...]
    difficulty              ENUM('beginner','intermediate','advanced')
                                NOT NULL DEFAULT 'beginner',
    instructions            JSON DEFAULT '[]',                 -- step-by-step
    videoUrl                VARCHAR(500),
    imageUrl                VARCHAR(500),
    caloriesBurnedPerMinute DECIMAL(5,2),
    duration                INT,                               -- default duration (seconds)
    sets                    INT DEFAULT 3,
    reps                    INT DEFAULT 10,
    restTime                INT DEFAULT 60,                    -- seconds
    tips                    JSON DEFAULT '[]',
    variations              JSON DEFAULT '[]',
    isActive                BOOLEAN DEFAULT TRUE,
    createdBy               INT,
    createdAt               DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt               DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (createdBy) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_exercises_category   ON exercises(category);
CREATE INDEX idx_exercises_difficulty ON exercises(difficulty);
CREATE INDEX idx_exercises_isActive   ON exercises(isActive);
CREATE INDEX idx_exercises_createdBy  ON exercises(createdBy);

-- ============================================================================
-- 6. WORKOUT_EXERCISES  (junction: program_workout × exercise × section)
--    from seed.json: sections[].exercises[] with sets/reps/tempo/rest
-- ============================================================================
CREATE TABLE IF NOT EXISTS workout_exercises (
    id                  INT PRIMARY KEY AUTO_INCREMENT,
    programWorkoutId    INT NOT NULL,                          -- FK → program_workouts
    exerciseId          INT NOT NULL,                          -- FK → exercises
    section             ENUM('warm_up','core_balance_plyometric',
                            'speed_agility_quickness','resistance',
                            'cool_down','recovery','main')
                            NOT NULL DEFAULT 'main',           -- from seed: sectionName → slug
    sectionName         VARCHAR(100),                          -- "Warm-Up" (display)
    orderIndex          INT DEFAULT 0,                         -- order within the workout
    sets                INT DEFAULT 3,                         -- from seed: sets (1)
    reps                INT,                                   -- from seed: reps parsed ("12" → 12)
    repsDisplay         VARCHAR(50),                           -- from seed: reps raw ("N/A", "8-12")
    durationSeconds     INT,                                   -- for time-based exercises
    restSeconds         INT DEFAULT 60,                        -- from seed: rest parsed ("30s" → 30)
    tempo               VARCHAR(20),                           -- from seed: tempo ("Slow","Medium")
    weight              DECIMAL(6,2),                          -- suggested weight (kg)
    intensity           ENUM('low','moderate','high'),
    instructions        TEXT,                                  -- per-workout instructions
    videoUrl            VARCHAR(500),                          -- override exercise video
    isActive            BOOLEAN DEFAULT TRUE,
    createdAt           DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt           DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (programWorkoutId) REFERENCES program_workouts(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (exerciseId)       REFERENCES exercises(id)       ON DELETE CASCADE ON UPDATE CASCADE
    -- NOTE: No FK on `section` → workout_sections.slug because ENUM ≠ VARCHAR
    --       The relationship is enforced at the application layer instead.
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_we_workout_order   ON workout_exercises(programWorkoutId, orderIndex);
CREATE INDEX idx_we_workout_section ON workout_exercises(programWorkoutId, section);
CREATE INDEX idx_we_exercise        ON workout_exercises(exerciseId);
CREATE INDEX idx_we_isActive        ON workout_exercises(isActive);

-- ============================================================================
-- 7. USER_PROGRAMS  (enrollments — not in seed.json, for app runtime)
--    Tracks which user is doing which program and their progress
-- ============================================================================
CREATE TABLE IF NOT EXISTS user_programs (
    id                  INT PRIMARY KEY AUTO_INCREMENT,
    userId              INT NOT NULL,                          -- FK → users
    programId           INT NOT NULL,                          -- FK → programs
    currentWorkoutId    INT,                                   -- FK → program_workouts
    currentWeek         INT DEFAULT 1,
    currentDay          INT DEFAULT 1,
    status              ENUM('not_started','in_progress','completed','paused')
                            DEFAULT 'not_started',
    progressPercentage  DECIMAL(5,2) DEFAULT 0,
    completedWorkouts   INT DEFAULT 0,
    totalWorkouts       INT DEFAULT 0,
    startDate           DATETIME,
    endDate             DATETIME,
    completedDate       DATETIME,
    rating              INT,
    feedback            TEXT,
    isFavorite          BOOLEAN DEFAULT FALSE,
    createdAt           DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt           DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (userId)           REFERENCES users(id)            ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (programId)        REFERENCES programs(id)         ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (currentWorkoutId) REFERENCES program_workouts(id) ON DELETE SET NULL ON UPDATE CASCADE,
    UNIQUE KEY unique_user_program (userId, programId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_up_user_status ON user_programs(userId, status);
CREATE INDEX idx_up_program     ON user_programs(programId);
CREATE INDEX idx_up_status      ON user_programs(status);

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================================
-- SUMMARY: seed.json → table mapping
-- ============================================================================
-- seed.json field              →  table.column
-- ─────────────────────────────   ──────────────────────────────
-- program.category             →  categories.name
-- program.programName          →  programs.name
-- program.workouts             →  program_workouts (1 row each)
-- workout.workoutName          →  program_workouts.name
-- workout.exerciseCount        →  program_workouts.exercisesCount
-- workout.durationMinutes      →  program_workouts.durationMinutes
-- workout.sections             →  (drives workout_exercises rows)
-- section.sectionName          →  workout_sections.name + workout_exercises.sectionName
-- section.duration             →  (informational — not stored, derivable)
-- section.exercises            →  workout_exercises (1 row each)
-- exercise.name                →  exercises.name (deduplicated master)
-- exercise.reps                →  workout_exercises.reps / repsDisplay
-- exercise.sets                →  workout_exercises.sets
-- exercise.tempo               →  workout_exercises.tempo
-- exercise.rest                →  workout_exercises.restSeconds
-- ============================================================================
