-- ============================================
-- Comprehensive Fitness Categories Seed
-- 107 Categories Total
-- ============================================
-- Run this entire script in your MySQL database
-- Note: Change createdBy value (1) to match your admin user ID

-- Insert all 107 categories (IGNORE duplicates)
INSERT IGNORE INTO categories (name, slug, description, createdBy, createdAt, updatedAt) VALUES
-- Training Types (7)
('Strength Training', 'strength-training', 'Build muscle and increase strength', 1, NOW(), NOW()),
('Cardio Training', 'cardio-training', 'Improve cardiovascular endurance', 1, NOW(), NOW()),
('Flexibility Training', 'flexibility-training', 'Improve flexibility and range of motion', 1, NOW(), NOW()),
('Mobility Training', 'mobility-training', 'Joint mobility and movement quality', 1, NOW(), NOW()),
('Functional Training', 'functional-training', 'Train movements for daily life', 1, NOW(), NOW()),
('Bodyweight Training', 'bodyweight-training', 'No equipment needed exercises', 1, NOW(), NOW()),
('Weight Training', 'weight-training', 'Training with external weights', 1, NOW(), NOW()),

-- Specific Lifting Styles (6)
('Olympic Lifting', 'olympic-lifting', 'Olympic weightlifting movements', 1, NOW(), NOW()),
('Powerlifting', 'powerlifting', 'Focus on squat, bench, deadlift', 1, NOW(), NOW()),
('Strongman', 'strongman', 'Strongman training and events', 1, NOW(), NOW()),
('CrossFit', 'crossfit', 'High-intensity functional fitness', 1, NOW(), NOW()),
('Calisthenics', 'calisthenics', 'Advanced bodyweight movements', 1, NOW(), NOW()),
('Kettlebell Sport', 'kettlebell-sport', 'Competitive kettlebell lifting', 1, NOW(), NOW()),

-- Upper Body Parts (11)
('Chest Exercises', 'chest-exercises', 'Pectoral muscle development', 1, NOW(), NOW()),
('Back Exercises', 'back-exercises', 'Lat, rhomboid, and back development', 1, NOW(), NOW()),
('Shoulder Exercises', 'shoulder-exercises', 'Deltoid muscle development', 1, NOW(), NOW()),
('Arm Exercises', 'arm-exercises', 'Biceps and triceps training', 1, NOW(), NOW()),
('Bicep Exercises', 'bicep-exercises', 'Bicep muscle isolation', 1, NOW(), NOW()),
('Tricep Exercises', 'tricep-exercises', 'Tricep muscle isolation', 1, NOW(), NOW()),
('Forearm Exercises', 'forearm-exercises', 'Forearm and grip strength', 1, NOW(), NOW()),
('Trap Exercises', 'trap-exercises', 'Trapezius muscle development', 1, NOW(), NOW()),
('Rotator Cuff', 'rotator-cuff', 'Shoulder health and stability', 1, NOW(), NOW()),
('Neck Exercises', 'neck-exercises', 'Neck strengthening', 1, NOW(), NOW()),
('Upper Back', 'upper-back', 'Upper back muscle development', 1, NOW(), NOW()),

-- Core & Abs (5)
('Core Training', 'core-training', 'Core strength and stability', 1, NOW(), NOW()),
('Abs Exercises', 'abs-exercises', 'Abdominal muscle development', 1, NOW(), NOW()),
('Oblique Exercises', 'oblique-exercises', 'Side ab training', 1, NOW(), NOW()),
('Lower Back', 'lower-back', 'Lower back strengthening', 1, NOW(), NOW()),
('Serratus', 'serratus', 'Serratus anterior exercises', 1, NOW(), NOW()),

-- Lower Body Parts (8)
('Leg Exercises', 'leg-exercises', 'Complete leg development', 1, NOW(), NOW()),
('Quad Exercises', 'quad-exercises', 'Quadriceps muscle development', 1, NOW(), NOW()),
('Hamstring Exercises', 'hamstring-exercises', 'Hamstring muscle development', 1, NOW(), NOW()),
('Glute Exercises', 'glute-exercises', 'Glute muscle development', 1, NOW(), NOW()),
('Calf Exercises', 'calf-exercises', 'Calf muscle development', 1, NOW(), NOW()),
('Hip Exercises', 'hip-exercises', 'Hip strength and mobility', 1, NOW(), NOW()),
('Adductor Exercises', 'adductor-exercises', 'Inner thigh training', 1, NOW(), NOW()),
('Abductor Exercises', 'abductor-exercises', 'Outer hip training', 1, NOW(), NOW()),

-- Equipment-Based (12)
('Barbell Exercises', 'barbell-exercises', 'Barbell training', 1, NOW(), NOW()),
('Dumbbell Exercises', 'dumbbell-exercises', 'Dumbbell training', 1, NOW(), NOW()),
('Kettlebell Exercises', 'kettlebell-exercises', 'Kettlebell training', 1, NOW(), NOW()),
('Machine Exercises', 'machine-exercises', 'Weight machine exercises', 1, NOW(), NOW()),
('Cable Exercises', 'cable-exercises', 'Cable machine training', 1, NOW(), NOW()),
('Resistance Bands', 'resistance-bands', 'Band resistance training', 1, NOW(), NOW()),
('TRX & Suspension', 'trx-suspension', 'Suspension training', 1, NOW(), NOW()),
('Medicine Ball', 'medicine-ball', 'Medicine ball exercises', 1, NOW(), NOW()),
('Stability Ball', 'stability-ball', 'Stability ball training', 1, NOW(), NOW()),
('Sandbag Training', 'sandbag-training', 'Sandbag exercises', 1, NOW(), NOW()),
('Battle Ropes', 'battle-ropes', 'Battle rope conditioning', 1, NOW(), NOW()),
('Sled Training', 'sled-training', 'Sled push and pull', 1, NOW(), NOW()),

-- Cardio Types (9)
('Running', 'running', 'Running and jogging', 1, NOW(), NOW()),
('Sprinting', 'sprinting', 'Sprint training and speed work', 1, NOW(), NOW()),
('Cycling', 'cycling', 'Bike training', 1, NOW(), NOW()),
('Swimming', 'swimming', 'Swimming exercises', 1, NOW(), NOW()),
('Rowing', 'rowing', 'Rowing machine and water rowing', 1, NOW(), NOW()),
('Jump Rope', 'jump-rope', 'Rope skipping', 1, NOW(), NOW()),
('Elliptical', 'elliptical', 'Elliptical machine training', 1, NOW(), NOW()),
('Stair Climbing', 'stair-climbing', 'Stair stepper and climbing', 1, NOW(), NOW()),
('HIIT', 'hiit', 'High intensity interval training', 1, NOW(), NOW()),

-- Training Methods (8)
('Plyometrics', 'plyometrics', 'Jump and explosive training', 1, NOW(), NOW()),
('Isometric Training', 'isometric-training', 'Static holds and tension', 1, NOW(), NOW()),
('Eccentric Training', 'eccentric-training', 'Negative rep training', 1, NOW(), NOW()),
('Tempo Training', 'tempo-training', 'Controlled tempo lifts', 1, NOW(), NOW()),
('Superset Training', 'superset-training', 'Back-to-back exercises', 1, NOW(), NOW()),
('Circuit Training', 'circuit-training', 'Multi-exercise circuits', 1, NOW(), NOW()),
('Pyramid Training', 'pyramid-training', 'Progressive set schemes', 1, NOW(), NOW()),
('Drop Sets', 'drop-sets', 'Descending weight sets', 1, NOW(), NOW()),

-- Sports-Specific (10)
('Basketball Training', 'basketball-training', 'Basketball conditioning', 1, NOW(), NOW()),
('Soccer Training', 'soccer-training', 'Soccer fitness', 1, NOW(), NOW()),
('Tennis Training', 'tennis-training', 'Tennis conditioning', 1, NOW(), NOW()),
('Boxing Training', 'boxing-training', 'Boxing and striking', 1, NOW(), NOW()),
('MMA Training', 'mma-training', 'Mixed martial arts', 1, NOW(), NOW()),
('Wrestling', 'wrestling', 'Wrestling conditioning', 1, NOW(), NOW()),
('Baseball Training', 'baseball-training', 'Baseball conditioning', 1, NOW(), NOW()),
('Football Training', 'football-training', 'Football conditioning', 1, NOW(), NOW()),
('Track & Field', 'track-field', 'Track and field training', 1, NOW(), NOW()),
('Volleyball', 'volleyball', 'Volleyball training', 1, NOW(), NOW()),

-- Flexibility & Mobility (6)
('Yoga', 'yoga', 'Yoga practice', 1, NOW(), NOW()),
('Pilates', 'pilates', 'Pilates training', 1, NOW(), NOW()),
('Static Stretching', 'static-stretching', 'Hold stretches', 1, NOW(), NOW()),
('Dynamic Stretching', 'dynamic-stretching', 'Active stretches', 1, NOW(), NOW()),
('PNF Stretching', 'pnf-stretching', 'Proprioceptive neuromuscular facilitation', 1, NOW(), NOW()),
('Foam Rolling', 'foam-rolling', 'Self-myofascial release', 1, NOW(), NOW()),

-- Performance Training (7)
('Speed Training', 'speed-training', 'Improve speed and quickness', 1, NOW(), NOW()),
('Agility Training', 'agility-training', 'Agility and coordination', 1, NOW(), NOW()),
('Power Development', 'power-development', 'Explosive power', 1, NOW(), NOW()),
('Endurance Training', 'endurance-training', 'Build stamina', 1, NOW(), NOW()),
('Balance Training', 'balance-training', 'Balance and stability', 1, NOW(), NOW()),
('Coordination Drills', 'coordination-drills', 'Movement coordination', 1, NOW(), NOW()),
('Reaction Training', 'reaction-training', 'Reaction time improvement', 1, NOW(), NOW()),

-- Recovery & Health (7)
('Active Recovery', 'active-recovery', 'Light movement recovery', 1, NOW(), NOW()),
('Stretching & Cool Down', 'stretching-cool-down', 'Post-workout recovery', 1, NOW(), NOW()),
('Regeneration', 'regeneration', 'Tissue recovery', 1, NOW(), NOW()),
('Prehab', 'prehab', 'Injury prevention', 1, NOW(), NOW()),
('Rehab Exercises', 'rehab-exercises', 'Injury rehabilitation', 1, NOW(), NOW()),
('Corrective Exercise', 'corrective-exercise', 'Movement correction', 1, NOW(), NOW()),
('Postural Training', 'postural-training', 'Posture improvement', 1, NOW(), NOW()),

-- Special Populations (5)
('Beginner Training', 'beginner-training', 'Exercises for beginners', 1, NOW(), NOW()),
('Senior Fitness', 'senior-fitness', 'Senior-friendly exercises', 1, NOW(), NOW()),
('Prenatal Fitness', 'prenatal-fitness', 'Pregnancy-safe exercises', 1, NOW(), NOW()),
('Postnatal Fitness', 'postnatal-fitness', 'Post-pregnancy recovery', 1, NOW(), NOW()),
('Youth Training', 'youth-training', 'Exercises for youth', 1, NOW(), NOW()),

-- Specific Goals (6)
('Fat Loss', 'fat-loss', 'Fat burning exercises', 1, NOW(), NOW()),
('Muscle Building', 'muscle-building', 'Hypertrophy training', 1, NOW(), NOW()),
('Athletic Performance', 'athletic-performance', 'Sport performance enhancement', 1, NOW(), NOW()),
('General Fitness', 'general-fitness', 'Overall fitness improvement', 1, NOW(), NOW()),
('Body Composition', 'body-composition', 'Body recomposition', 1, NOW(), NOW()),
('Sports Conditioning', 'sports-conditioning', 'Sport-specific conditioning', 1, NOW(), NOW());

-- Verify the insert (shows newly created only if you have the count before)
SELECT COUNT(*) as 'Total Categories in Database' FROM categories;

-- Show all categories ordered by name
SELECT id, name, slug, createdAt 
FROM categories 
ORDER BY name ASC;
