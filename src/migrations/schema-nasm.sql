-- ============================================================================
-- ARIF WORKOUT — Database Schema with OPT Model
-- ============================================================================
-- Based on seed.json structure + OPT (Optimum Performance Training) Model.
--
-- HIERARCHY:
--
--   phases (LOOKUP)               5 OPT phases with training parameters
--     │
--   categories (LOOKUP)           "General Fitness", "Stabilization Endurance"
--     └── programs                "Bodyweight Strength Training"
--           ├── optPhaseId ───────→ phases (FK)
--           └── program_workouts  "Bodyweight Strength Level 1"
--                 ├── phaseId ────→ phases (FK)
--                 └── workout_exercises (JUNCTION)
--                       ├── exercises (MASTER)     "SMR Calves"
--                       └── workout_sections (LOOKUP)  "Warm-Up"
--
--   assessments                   Postural, movement, performance assessments
--   assessment_results            User assessment scores over time
--   user_programs                 User enrollment + progress
-- ============================================================================

SET FOREIGN_KEY_CHECKS = 0;
SET NAMES utf8mb4;

-- ============================================================================
-- 1. PHASES  (LOOKUP — the 5 OPT Model phases with training parameters)
-- ============================================================================
-- Each phase defines default training parameters: sets, reps, tempo, rest.
-- Programs and workouts reference a phase to inherit these defaults.
CREATE TABLE IF NOT EXISTS phases (
    id                  INT PRIMARY KEY AUTO_INCREMENT,
    phaseNumber         INT NOT NULL UNIQUE,                   -- 1-5
    name                VARCHAR(100) NOT NULL,                 -- "Stabilization Endurance"
    slug                VARCHAR(100) NOT NULL UNIQUE,          -- "stabilization_endurance"
    description         TEXT,

    -- Training parameters (defaults for this phase)
    minSets             INT NOT NULL,                          -- e.g. 1
    maxSets             INT NOT NULL,                          -- e.g. 3
    minReps             INT NOT NULL,                          -- e.g. 12
    maxReps             INT NOT NULL,                          -- e.g. 25
    tempoPattern        VARCHAR(20) NOT NULL,                  -- "4-2-1" (eccentric-pause-concentric)
    minRestSeconds      INT NOT NULL,                          -- 0
    maxRestSeconds      INT NOT NULL,                          -- 90
    intensity           ENUM('low','moderate','high','very_high') NOT NULL DEFAULT 'low',

    -- Phase characteristics
    trainingFocus       VARCHAR(255),                          -- "Muscular endurance, stability, neuromuscular efficiency"
    adaptationType      ENUM('stabilization','strength_endurance','hypertrophy',
                            'maximal_strength','power') NOT NULL,
    progressionType     ENUM('linear','undulating','block','conjugate') DEFAULT 'linear',

    -- Assessment requirement
    assessmentRequired  BOOLEAN DEFAULT FALSE,

    isActive            BOOLEAN DEFAULT TRUE,
    createdAt           DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt           DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed the 5 OPT phases
INSERT INTO phases
  (phaseNumber, name, slug, description,
   minSets, maxSets, minReps, maxReps, tempoPattern, minRestSeconds, maxRestSeconds, intensity,
   trainingFocus, adaptationType, progressionType, assessmentRequired) VALUES
  (1, 'Stabilization Endurance', 'stabilization_endurance',
   'Phase 1: Improve muscular endurance, stability, and neuromuscular efficiency. Foundation for all movement.',
   1, 3, 12, 25, '4-2-1', 0, 90, 'low',
   'Muscular endurance, stability, neuromuscular efficiency', 'stabilization', 'linear', TRUE),
  (2, 'Strength Endurance', 'strength_endurance',
   'Phase 2: Enhance muscular endurance and stability while increasing strength. Superset stabilization with strength.',
   2, 4, 8, 12, '2-0-2', 0, 60, 'moderate',
   'Muscular endurance + strength, superset training', 'strength_endurance', 'linear', TRUE),
  (3, 'Muscular Development', 'muscular_development',
   'Phase 3: Hypertrophy training for maximal muscle growth. Moderate to high volume with moderate loads.',
   3, 5, 6, 12, '2-0-2', 0, 60, 'moderate',
   'Hypertrophy, muscle growth, volume training', 'hypertrophy', 'undulating', FALSE),
  (4, 'Maximal Strength', 'maximal_strength',
   'Phase 4: Develop maximal strength with high intensity, low volume, and long rest periods.',
   4, 6, 1, 5, '4-0-1', 180, 300, 'high',
   'Maximal strength, motor unit recruitment, heavy loads', 'maximal_strength', 'block', FALSE),
  (5, 'Power', 'power',
   'Phase 5: Enhance power production and athletic performance. Explosive movements with light to moderate loads.',
   3, 5, 1, 5, '1-0-1', 180, 300, 'very_high',
   'Power, rate of force production, athletic performance', 'power', 'conjugate', FALSE)
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- ============================================================================
-- 2. WORKOUT_SECTIONS  (LOOKUP — 6 standard workout sections)
-- ============================================================================
CREATE TABLE IF NOT EXISTS workout_sections (
    id              CHAR(36) PRIMARY KEY,                      -- UUID
    name            VARCHAR(100) NOT NULL,                     -- "Warm-Up"
    slug            VARCHAR(100) NOT NULL UNIQUE,              -- "warm_up"
    description     TEXT,
    ordinal         INT DEFAULT 0,                             -- display order
    color           VARCHAR(20),                               -- UI color
    -- Section metadata
    purpose         VARCHAR(255),                              -- "SMR + Static Stretching"
    typicalDuration INT,                                       -- typical minutes (e.g. 5)
    isHidden        BOOLEAN DEFAULT FALSE,
    isActive        BOOLEAN DEFAULT TRUE,
    createdAt       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_ws_ordinal  ON workout_sections(ordinal);
CREATE INDEX idx_ws_isActive ON workout_sections(isActive);

-- Seed the 6 sections
INSERT INTO workout_sections
  (id, name, slug, description, ordinal, color, purpose, typicalDuration, isActive, isHidden) VALUES
  (UUID(), 'Warm-Up', 'warm_up',
   'Self-myofascial release (SMR) and static stretching to prepare the body',
   0, '#FF6B6B', 'SMR + Static Stretching', 5, TRUE, FALSE),
  (UUID(), 'Core / Balance / Plyometric', 'core_balance_plyometric',
   'Core stabilization, balance training, and plyometric exercises',
   1, '#4ECDC4', 'Core + Balance + Plyometric', 5, TRUE, FALSE),
  (UUID(), 'Speed / Agility / Quickness', 'speed_agility_quickness',
   'SAQ training for athletic performance and neuromuscular efficiency',
   2, '#45B7D1', 'Speed, Agility, Quickness drills', 5, TRUE, TRUE),
  (UUID(), 'Resistance', 'resistance',
   'Strength training with resistance exercises — the main work set',
   3, '#96CEB4', 'Resistance training (main)', 25, TRUE, FALSE),
  (UUID(), 'Cool-Down', 'cool_down',
   'Static stretching and SMR to recover and restore length-tension relationships',
   4, '#FFEAA7', 'SMR + Static Stretching', 5, TRUE, FALSE),
  (UUID(), 'Recovery', 'recovery',
   'Active recovery and regeneration techniques',
   5, '#DDA0DD', 'Active recovery, regeneration', 10, TRUE, TRUE)
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- ============================================================================
-- 3. CATEGORIES  (from seed.json: program.category)
-- ============================================================================
CREATE TABLE IF NOT EXISTS categories (
    id          INT PRIMARY KEY AUTO_INCREMENT,
    name        VARCHAR(255) NOT NULL,
    slug        VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    image       VARCHAR(500),
    createdBy   INT NOT NULL,
    createdAt   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (createdBy) REFERENCES users(id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_categories_createdBy ON categories(createdBy);

-- ============================================================================
-- 4. PROGRAMS  (from seed.json: programName + category)
--    With FK to phases
-- ============================================================================
CREATE TABLE IF NOT EXISTS programs (
    id              INT PRIMARY KEY AUTO_INCREMENT,
    name            VARCHAR(255) NOT NULL,
    slug            VARCHAR(255) NOT NULL UNIQUE,
    description     TEXT,
    categoryId      INT,
    categoryName    VARCHAR(100),
    level           ENUM('beginner','intermediate','advanced','all_levels')
                        NOT NULL DEFAULT 'all_levels',
    goal            ENUM('weight_loss','muscle_gain','endurance',
                        'flexibility','general_fitness','strength','stabilization'),
    durationWeeks   INT,
    workoutsCount   INT DEFAULT 0,
    imageUrl        VARCHAR(500),
    bannerImageUrl  VARCHAR(500),
    isActive        BOOLEAN DEFAULT TRUE,
    isFeatured      BOOLEAN DEFAULT FALSE,
    tags            JSON DEFAULT '[]',
    equipment       JSON DEFAULT '[]',
    createdBy       INT,
    orderIndex      INT DEFAULT 0,
    -- OPT Model fields
    optPhaseId      INT,                                       -- FK → phases
    optPhaseNumber  INT,                                       -- denormalized (1-5)
    assessmentRequired BOOLEAN DEFAULT FALSE,
    hasAssessments  BOOLEAN DEFAULT FALSE,
    progressionType ENUM('linear','undulating','block','conjugate') DEFAULT 'linear',
    createdAt       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (categoryId)  REFERENCES categories(id)  ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (createdBy)   REFERENCES users(id)       ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (optPhaseId)  REFERENCES phases(id)      ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_programs_category    ON programs(categoryId);
CREATE INDEX idx_programs_level       ON programs(level);
CREATE INDEX idx_programs_goal        ON programs(goal);
CREATE INDEX idx_programs_isActive    ON programs(isActive);
CREATE INDEX idx_programs_isFeatured  ON programs(isFeatured);
CREATE INDEX idx_programs_createdBy   ON programs(createdBy);
CREATE INDEX idx_programs_order       ON programs(orderIndex);
CREATE INDEX idx_programs_optPhase    ON programs(optPhaseId);

-- ============================================================================
-- 5. PROGRAM_WORKOUTS  (from seed.json: program.workouts[])
--    With FK to phases + week/day scheduling
-- ============================================================================
CREATE TABLE IF NOT EXISTS program_workouts (
    id                  INT PRIMARY KEY AUTO_INCREMENT,
    programId           INT NOT NULL,
    name                VARCHAR(255) NOT NULL,
    description         TEXT,
    level               ENUM('beginner','intermediate','advanced'),
    weekNumber          INT,                                   -- which week (1, 2, 3...)
    dayNumber           INT,                                   -- day within week (1-7)
    durationMinutes     INT,
    exercisesCount      INT DEFAULT 0,
    caloriesBurnEstimate INT,
    focusArea           VARCHAR(100),
    orderIndex          INT DEFAULT 0,
    isActive            BOOLEAN DEFAULT TRUE,
    instructions        TEXT,
    -- OPT Model fields
    phaseId             INT,                                   -- FK → phases
    phaseNumber         INT,                                   -- denormalized
    isAssessment        BOOLEAN DEFAULT FALSE,
    assessmentType      VARCHAR(100),                          -- "Postural", "Movement", "Performance"
    createdAt           DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt           DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (programId) REFERENCES programs(id)  ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (phaseId)  REFERENCES phases(id)     ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_pw_program_order    ON program_workouts(programId, orderIndex);
CREATE INDEX idx_pw_program_week_day ON program_workouts(programId, weekNumber, dayNumber);
CREATE INDEX idx_pw_level            ON program_workouts(level);
CREATE INDEX idx_pw_isActive         ON program_workouts(isActive);
CREATE INDEX idx_pw_phase            ON program_workouts(phaseId);

-- ============================================================================
-- 6. EXERCISES  (from seed.json: exercise.name — deduplicated master)
--    With OPT-specific fields: muscle groups, equipment, movement type
-- ============================================================================
CREATE TABLE IF NOT EXISTS exercises (
    id                      INT PRIMARY KEY AUTO_INCREMENT,
    name                    VARCHAR(255) NOT NULL,
    slug                    VARCHAR(255) NOT NULL UNIQUE,
    description             TEXT,
    category                ENUM('cardio','strength','flexibility','balance',
                                'sports','yoga','pilates','hiit') NOT NULL,
    muscleGroups            JSON DEFAULT '[]',
    primaryMuscles          JSON DEFAULT '[]',
    secondaryMuscles        JSON DEFAULT '[]',
    equipment               JSON DEFAULT '[]',
    difficulty              ENUM('beginner','intermediate','advanced')
                                NOT NULL DEFAULT 'beginner',
    instructions            JSON DEFAULT '[]',
    videoUrl                VARCHAR(500),
    imageUrl                VARCHAR(500),
    caloriesBurnedPerMinute DECIMAL(5,2),
    duration                INT,
    sets                    INT DEFAULT 3,
    reps                    INT DEFAULT 10,
    restTime                INT DEFAULT 60,
    tips                    JSON DEFAULT '[]',
    variations              JSON DEFAULT '[]',
    -- Exercise classification
    movementType            ENUM('stable','stabilization','functional','power') DEFAULT 'stable',
    planeOfMotion           ENUM('sagittal','frontal','transverse','multiplanar') DEFAULT 'sagittal',
    isActive                BOOLEAN DEFAULT TRUE,
    createdBy               INT,
    createdAt               DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt               DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (createdBy) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_exercises_category    ON exercises(category);
CREATE INDEX idx_exercises_difficulty  ON exercises(difficulty);
CREATE INDEX idx_exercises_isActive    ON exercises(isActive);
CREATE INDEX idx_exercises_createdBy   ON exercises(createdBy);
CREATE INDEX idx_exercises_movement    ON exercises(movementType);

-- ============================================================================
-- 7. WORKOUT_EXERCISES  (JUNCTION: program_workout × exercise × section)
--    With tempo breakdown (4-digit notation: eccentric-pause-concentric-pause)
-- ============================================================================
CREATE TABLE IF NOT EXISTS workout_exercises (
    id                  INT PRIMARY KEY AUTO_INCREMENT,
    programWorkoutId    INT NOT NULL,
    exerciseId          INT NOT NULL,
    section             ENUM('warm_up','core_balance_plyometric',
                            'speed_agility_quickness','resistance',
                            'cool_down','recovery','main')
                            NOT NULL DEFAULT 'main',
    sectionName         VARCHAR(100),
    orderIndex          INT DEFAULT 0,
    sets                INT DEFAULT 3,
    reps                INT,
    repsDisplay         VARCHAR(50),
    durationSeconds     INT,
    restSeconds         INT DEFAULT 60,
    -- Tempo: "3-1-2-0" = 3s eccentric, 1s pause, 2s concentric, 0s rest
    tempo               VARCHAR(20),                           -- full tempo string "3-1-2-0"
    tempoEccentric      INT,                                   -- first number (e.g. 3)
    tempoIsometric      INT,                                   -- second number (e.g. 1)
    tempoConcentric     INT,                                   -- third number (e.g. 2)
    tempoRestPause      INT DEFAULT 0,                         -- fourth number (e.g. 0)
    weight              DECIMAL(6,2),
    intensity           ENUM('low','moderate','high','very_high'),
    instructions        TEXT,
    videoUrl            VARCHAR(500),
    isActive            BOOLEAN DEFAULT TRUE,
    createdAt           DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt           DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (programWorkoutId) REFERENCES program_workouts(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (exerciseId)       REFERENCES exercises(id)       ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_we_workout_order   ON workout_exercises(programWorkoutId, orderIndex);
CREATE INDEX idx_we_workout_section ON workout_exercises(programWorkoutId, section);
CREATE INDEX idx_we_exercise        ON workout_exercises(exerciseId);
CREATE INDEX idx_we_isActive        ON workout_exercises(isActive);

-- ============================================================================
-- 8. ASSESSMENTS  (LOOKUP — standard assessment types)
-- ============================================================================
CREATE TABLE IF NOT EXISTS assessments (
    id              INT PRIMARY KEY AUTO_INCREMENT,
    name            VARCHAR(255) NOT NULL,                     -- "Overhead Squat Assessment"
    slug            VARCHAR(255) NOT NULL UNIQUE,
    category        ENUM('postural','movement','performance','flexibility') NOT NULL,
    description     TEXT,
    instructions    TEXT,                                      -- how to perform the assessment
    durationMinutes INT DEFAULT 10,
    isActive        BOOLEAN DEFAULT TRUE,
    createdAt       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed standard assessments
INSERT INTO assessments (name, slug, category, description, instructions, durationMinutes) VALUES
  ('Postural Assessment', 'postural-assessment', 'postural',
   'Static postural assessment to identify muscle imbalances and alignment issues.',
   'Observe client from anterior, posterior, and lateral views. Check for: head tilt, shoulder elevation, rounded shoulders, anterior pelvic tilt, knee position, foot position.',
   10),
  ('Overhead Squat Assessment', 'overhead-squat-assessment', 'movement',
   'Dynamic movement assessment to identify movement compensations and muscle imbalances.',
   'Client squats with arms overhead, feet shoulder-width apart. Observe from anterior and lateral views. Check for: feet turning out, knees caving in, low back arching, arms falling forward.',
   5),
  ('Single-Leg Squat Assessment', 'single-leg-squat-assessment', 'movement',
   'Assess dynamic balance and lower extremity alignment.',
   'Client performs single-leg squat to 60 degrees knee flexion. Observe for knee valgus, hip drop, trunk rotation.',
   5),
  ('Pushing Assessment', 'pushing-assessment', 'movement',
   'Observe pushing movement patterns for upper body compensation.',
   'Client performs push-up or standing cable press. Observe for: low back arching, head protruding, shoulders elevating.',
   5),
  ('Pulling Assessment', 'pulling-assessment', 'movement',
   'Observe pulling movement patterns for upper body compensation.',
   'Client performs pull-up or seated row. Observe for: low back arching, head protracting, shoulders elevating.',
   5),
  ('Thoracic Spine Mobility', 'thoracic-spine-mobility', 'flexibility',
   'Assess thoracic spine extension and rotation mobility.',
   'Client performs seated rotation and extension tests. Measure degrees of rotation.',
   5),
  ('1RM Bench Press', '1rm-bench-press', 'performance',
   'One-rep max bench press for upper body strength baseline.',
   'Standard 1RM protocol with warm-up sets and progressive loading.',
   20),
  ('1RM Squat', '1rm-squat', 'performance',
   'One-rep max squat for lower body strength baseline.',
   'Standard 1RM protocol with warm-up sets and progressive loading.',
   20),
  ('Vertical Jump', 'vertical-jump', 'performance',
   'Power assessment using vertical jump height.',
   'Client performs maximum vertical jump. Measure height in inches/cm.',
   5)
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- ============================================================================
-- 9. ASSESSMENT_RESULTS  (user assessment scores over time)
-- ============================================================================
CREATE TABLE IF NOT EXISTS assessment_results (
    id              INT PRIMARY KEY AUTO_INCREMENT,
    userId          INT NOT NULL,
    assessmentId    INT NOT NULL,                              -- FK → assessments
    programId       INT,                                       -- optional: which program triggered it
    -- Results
    score           DECIMAL(5,2),                              -- numeric score if applicable
    notes           TEXT,                                      -- practitioner notes
    compensations   JSON DEFAULT '[]',                         -- observed compensations
    recommendations TEXT,                                      -- recommended corrections
    -- Metadata
    assessedBy      INT,                                       -- FK → users (practitioner)
    assessedAt      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    createdAt       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (userId)       REFERENCES users(id)        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (assessmentId) REFERENCES assessments(id)  ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (programId)    REFERENCES programs(id)     ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (assessedBy)   REFERENCES users(id)        ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_ar_user       ON assessment_results(userId);
CREATE INDEX idx_ar_assessment ON assessment_results(assessmentId);
CREATE INDEX idx_ar_program    ON assessment_results(programId);
CREATE INDEX idx_ar_assessedAt ON assessment_results(assessedAt);

-- ============================================================================
-- 10. USER_PROGRAMS  (enrollments + progress tracking)
-- ============================================================================
CREATE TABLE IF NOT EXISTS user_programs (
    id                  INT PRIMARY KEY AUTO_INCREMENT,
    userId              INT NOT NULL,
    programId           INT NOT NULL,
    currentWorkoutId    INT,
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
-- SUMMARY: Complete table list
-- ============================================================================
-- LOOKUP TABLES:
--   phases                  5 OPT phases (Stabilization → Power)
--   workout_sections        6 workout sections (Warm-Up → Recovery)
--   assessments             9 standard assessment types
--   categories              program categories (General Fitness, etc.)
--
-- MAIN ENTITIES:
--   programs                workout programs (FK → categories, phases)
--   program_workouts        individual workouts (FK → programs, phases)
--   exercises               master exercise library (deduplicated)
--
-- JUNCTION:
--   workout_exercises       links exercises to workouts with tempo breakdown
--
-- RUNTIME:
--   user_programs           user enrollment + progress
--   assessment_results      user assessment scores over time
--
-- seed.json → table mapping:
--   program.category         → categories.name
--   program.programName      → programs.name
--   program.workouts[]       → program_workouts
--   workout.workoutName      → program_workouts.name
--   workout.exerciseCount    → program_workouts.exercisesCount
--   workout.durationMinutes  → program_workouts.durationMinutes
--   section.sectionName      → workout_sections.name + workout_exercises.sectionName
--   exercise.name            → exercises.name (deduplicated)
--   exercise.sets            → workout_exercises.sets
--   exercise.reps            → workout_exercises.reps + repsDisplay
--   exercise.tempo           → workout_exercises.tempo (+ tempoEccentric/Isometric/Concentric/RestPause)
--   exercise.rest            → workout_exercises.restSeconds
-- ============================================================================
