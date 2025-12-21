-- ============================================
-- Comprehensive Subcategories Seed
-- Adds relevant subcategories to all main categories
-- ============================================
-- Run this after categories are created
-- Note: Change createdBy value (1) to match your admin user ID

-- Subcategories for Strength Training
INSERT IGNORE INTO subcategories (name, slug, categoryId, createdBy, createdAt, updatedAt)
SELECT 'Upper Body', 'upper-body', id, 1, NOW(), NOW() FROM categories WHERE slug = 'strength-training'
UNION ALL SELECT 'Lower Body', 'lower-body', id, 1, NOW(), NOW() FROM categories WHERE slug = 'strength-training'
UNION ALL SELECT 'Core', 'core', id, 1, NOW(), NOW() FROM categories WHERE slug = 'strength-training'
UNION ALL SELECT 'Full Body', 'full-body', id, 1, NOW(), NOW() FROM categories WHERE slug = 'strength-training'
UNION ALL SELECT 'Push Exercises', 'push-exercises', id, 1, NOW(), NOW() FROM categories WHERE slug = 'strength-training'
UNION ALL SELECT 'Pull Exercises', 'pull-exercises', id, 1, NOW(), NOW() FROM categories WHERE slug = 'strength-training';

-- Subcategories for Cardio Training
INSERT IGNORE INTO subcategories (name, slug, categoryId, createdBy, createdAt, updatedAt)
SELECT 'Low Intensity', 'low-intensity', id, 1, NOW(), NOW() FROM categories WHERE slug = 'cardio-training'
UNION ALL SELECT 'Moderate Intensity', 'moderate-intensity', id, 1, NOW(), NOW() FROM categories WHERE slug = 'cardio-training'
UNION ALL SELECT 'High Intensity', 'high-intensity', id, 1, NOW(), NOW() FROM categories WHERE slug = 'cardio-training'
UNION ALL SELECT 'Intervals', 'intervals', id, 1, NOW(), NOW() FROM categories WHERE slug = 'cardio-training'
UNION ALL SELECT 'Steady State', 'steady-state', id, 1, NOW(), NOW() FROM categories WHERE slug = 'cardio-training';

-- Subcategories for Flexibility Training
INSERT IGNORE INTO subcategories (name, slug, categoryId, createdBy, createdAt, updatedAt)
SELECT 'Upper Body Stretches', 'upper-body-stretches', id, 1, NOW(), NOW() FROM categories WHERE slug = 'flexibility-training'
UNION ALL SELECT 'Lower Body Stretches', 'lower-body-stretches', id, 1, NOW(), NOW() FROM categories WHERE slug = 'flexibility-training'
UNION ALL SELECT 'Full Body Stretches', 'full-body-stretches', id, 1, NOW(), NOW() FROM categories WHERE slug = 'flexibility-training'
UNION ALL SELECT 'Dynamic Stretches', 'dynamic-stretches', id, 1, NOW(), NOW() FROM categories WHERE slug = 'flexibility-training'
UNION ALL SELECT 'Static Stretches', 'static-stretches', id, 1, NOW(), NOW() FROM categories WHERE slug = 'flexibility-training';

-- Subcategories for Chest Exercises
INSERT IGNORE INTO subcategories (name, slug, categoryId, createdBy, createdAt, updatedAt)
SELECT 'Flat Press', 'flat-press', id, 1, NOW(), NOW() FROM categories WHERE slug = 'chest-exercises'
UNION ALL SELECT 'Incline Press', 'incline-press', id, 1, NOW(), NOW() FROM categories WHERE slug = 'chest-exercises'
UNION ALL SELECT 'Decline Press', 'decline-press', id, 1, NOW(), NOW() FROM categories WHERE slug = 'chest-exercises'
UNION ALL SELECT 'Fly Movements', 'fly-movements', id, 1, NOW(), NOW() FROM categories WHERE slug = 'chest-exercises'
UNION ALL SELECT 'Push-ups', 'push-ups', id, 1, NOW(), NOW() FROM categories WHERE slug = 'chest-exercises'
UNION ALL SELECT 'Dips', 'dips', id, 1, NOW(), NOW() FROM categories WHERE slug = 'chest-exercises';

-- Subcategories for Back Exercises
INSERT IGNORE INTO subcategories (name, slug, categoryId, createdBy, createdAt, updatedAt)
SELECT 'Lat Exercises', 'lat-exercises', id, 1, NOW(), NOW() FROM categories WHERE slug = 'back-exercises'
UNION ALL SELECT 'Rows', 'rows', id, 1, NOW(), NOW() FROM categories WHERE slug = 'back-exercises'
UNION ALL SELECT 'Pull-ups/Chin-ups', 'pull-ups-chin-ups', id, 1, NOW(), NOW() FROM categories WHERE slug = 'back-exercises'
UNION ALL SELECT 'Deadlift Variations', 'deadlift-variations', id, 1, NOW(), NOW() FROM categories WHERE slug = 'back-exercises'
UNION ALL SELECT 'Rear Delt', 'rear-delt', id, 1, NOW(), NOW() FROM categories WHERE slug = 'back-exercises';

-- Subcategories for Shoulder Exercises
INSERT IGNORE INTO subcategories (name, slug, categoryId, createdBy, createdAt, updatedAt)
SELECT 'Overhead Press', 'overhead-press', id, 1, NOW(), NOW() FROM categories WHERE slug = 'shoulder-exercises'
UNION ALL SELECT 'Front Delt', 'front-delt', id, 1, NOW(), NOW() FROM categories WHERE slug = 'shoulder-exercises'
UNION ALL SELECT 'Side Delt', 'side-delt', id, 1, NOW(), NOW() FROM categories WHERE slug = 'shoulder-exercises'
UNION ALL SELECT 'Rear Delt', 'rear-delt-shoulder', id, 1, NOW(), NOW() FROM categories WHERE slug = 'shoulder-exercises'
UNION ALL SELECT 'Upright Rows', 'upright-rows', id, 1, NOW(), NOW() FROM categories WHERE slug = 'shoulder-exercises';

-- Subcategories for Leg Exercises
INSERT IGNORE INTO subcategories (name, slug, categoryId, createdBy, createdAt, updatedAt)
SELECT 'Squat Variations', 'squat-variations', id, 1, NOW(), NOW() FROM categories WHERE slug = 'leg-exercises'
UNION ALL SELECT 'Lunge Variations', 'lunge-variations', id, 1, NOW(), NOW() FROM categories WHERE slug = 'leg-exercises'
UNION ALL SELECT 'Leg Press', 'leg-press', id, 1, NOW(), NOW() FROM categories WHERE slug = 'leg-exercises'
UNION ALL SELECT 'Step-ups', 'step-ups', id, 1, NOW(), NOW() FROM categories WHERE slug = 'leg-exercises'
UNION ALL SELECT 'Single Leg', 'single-leg', id, 1, NOW(), NOW() FROM categories WHERE slug = 'leg-exercises';

-- Subcategories for Quad Exercises
INSERT IGNORE INTO subcategories (name, slug, categoryId, createdBy, createdAt, updatedAt)
SELECT 'Squats', 'squats-quad', id, 1, NOW(), NOW() FROM categories WHERE slug = 'quad-exercises'
UNION ALL SELECT 'Leg Extensions', 'leg-extensions', id, 1, NOW(), NOW() FROM categories WHERE slug = 'quad-exercises'
UNION ALL SELECT 'Front Squats', 'front-squats', id, 1, NOW(), NOW() FROM categories WHERE slug = 'quad-exercises'
UNION ALL SELECT 'Lunges', 'lunges-quad', id, 1, NOW(), NOW() FROM categories WHERE slug = 'quad-exercises';

-- Subcategories for Hamstring Exercises
INSERT IGNORE INTO subcategories (name, slug, categoryId, createdBy, createdAt, updatedAt)
SELECT 'Leg Curls', 'leg-curls', id, 1, NOW(), NOW() FROM categories WHERE slug = 'hamstring-exercises'
UNION ALL SELECT 'Romanian Deadlifts', 'romanian-deadlifts', id, 1, NOW(), NOW() FROM categories WHERE slug = 'hamstring-exercises'
UNION ALL SELECT 'Good Mornings', 'good-mornings', id, 1, NOW(), NOW() FROM categories WHERE slug = 'hamstring-exercises'
UNION ALL SELECT 'Nordic Curls', 'nordic-curls', id, 1, NOW(), NOW() FROM categories WHERE slug = 'hamstring-exercises';

-- Subcategories for Glute Exercises
INSERT IGNORE INTO subcategories (name, slug, categoryId, createdBy, createdAt, updatedAt)
SELECT 'Hip Thrusts', 'hip-thrusts', id, 1, NOW(), NOW() FROM categories WHERE slug = 'glute-exercises'
UNION ALL SELECT 'Glute Bridges', 'glute-bridges', id, 1, NOW(), NOW() FROM categories WHERE slug = 'glute-exercises'
UNION ALL SELECT 'Kickbacks', 'kickbacks', id, 1, NOW(), NOW() FROM categories WHERE slug = 'glute-exercises'
UNION ALL SELECT 'Bulgarian Split Squats', 'bulgarian-split-squats', id, 1, NOW(), NOW() FROM categories WHERE slug = 'glute-exercises';

-- Subcategories for Core Training
INSERT IGNORE INTO subcategories (name, slug, categoryId, createdBy, createdAt, updatedAt)
SELECT 'Planks', 'planks', id, 1, NOW(), NOW() FROM categories WHERE slug = 'core-training'
UNION ALL SELECT 'Crunches', 'crunches', id, 1, NOW(), NOW() FROM categories WHERE slug = 'core-training'
UNION ALL SELECT 'Leg Raises', 'leg-raises', id, 1, NOW(), NOW() FROM categories WHERE slug = 'core-training'
UNION ALL SELECT 'Russian Twists', 'russian-twists', id, 1, NOW(), NOW() FROM categories WHERE slug = 'core-training'
UNION ALL SELECT 'Ab Wheel', 'ab-wheel', id, 1, NOW(), NOW() FROM categories WHERE slug = 'core-training';

-- Subcategories for Abs Exercises
INSERT IGNORE INTO subcategories (name, slug, categoryId, createdBy, createdAt, updatedAt)
SELECT 'Upper Abs', 'upper-abs', id, 1, NOW(), NOW() FROM categories WHERE slug = 'abs-exercises'
UNION ALL SELECT 'Lower Abs', 'lower-abs', id, 1, NOW(), NOW() FROM categories WHERE slug = 'abs-exercises'
UNION ALL SELECT 'Full Abs', 'full-abs', id, 1, NOW(), NOW() FROM categories WHERE slug = 'abs-exercises'
UNION ALL SELECT 'Six Pack', 'six-pack', id, 1, NOW(), NOW() FROM categories WHERE slug = 'abs-exercises';

-- Subcategories for Barbell Exercises
INSERT IGNORE INTO subcategories (name, slug, categoryId, createdBy, createdAt, updatedAt)
SELECT 'Bench Press', 'bench-press-barbell', id, 1, NOW(), NOW() FROM categories WHERE slug = 'barbell-exercises'
UNION ALL SELECT 'Squats', 'squats-barbell', id, 1, NOW(), NOW() FROM categories WHERE slug = 'barbell-exercises'
UNION ALL SELECT 'Deadlifts', 'deadlifts-barbell', id, 1, NOW(), NOW() FROM categories WHERE slug = 'barbell-exercises'
UNION ALL SELECT 'Rows', 'rows-barbell', id, 1, NOW(), NOW() FROM categories WHERE slug = 'barbell-exercises'
UNION ALL SELECT 'Overhead Press', 'overhead-press-barbell', id, 1, NOW(), NOW() FROM categories WHERE slug = 'barbell-exercises'
UNION ALL SELECT 'Curls', 'curls-barbell', id, 1, NOW(), NOW() FROM categories WHERE slug = 'barbell-exercises';

-- Subcategories for Dumbbell Exercises
INSERT IGNORE INTO subcategories (name, slug, categoryId, createdBy, createdAt, updatedAt)
SELECT 'Press Movements', 'press-movements-db', id, 1, NOW(), NOW() FROM categories WHERE slug = 'dumbbell-exercises'
UNION ALL SELECT 'Fly Movements', 'fly-movements-db', id, 1, NOW(), NOW() FROM categories WHERE slug = 'dumbbell-exercises'
UNION ALL SELECT 'Row Movements', 'row-movements-db', id, 1, NOW(), NOW() FROM categories WHERE slug = 'dumbbell-exercises'
UNION ALL SELECT 'Curl Variations', 'curl-variations-db', id, 1, NOW(), NOW() FROM categories WHERE slug = 'dumbbell-exercises'
UNION ALL SELECT 'Tricep Extensions', 'tricep-extensions-db', id, 1, NOW(), NOW() FROM categories WHERE slug = 'dumbbell-exercises';

-- Subcategories for HIIT
INSERT IGNORE INTO subcategories (name, slug, categoryId, createdBy, createdAt, updatedAt)
SELECT 'Tabata', 'tabata', id, 1, NOW(), NOW() FROM categories WHERE slug = 'hiit'
UNION ALL SELECT 'EMOM', 'emom', id, 1, NOW(), NOW() FROM categories WHERE slug = 'hiit'
UNION ALL SELECT 'AMRAP', 'amrap', id, 1, NOW(), NOW() FROM categories WHERE slug = 'hiit'
UNION ALL SELECT '30-20-10', '30-20-10', id, 1, NOW(), NOW() FROM categories WHERE slug = 'hiit';

-- Subcategories for Yoga
INSERT IGNORE INTO subcategories (name, slug, categoryId, createdBy, createdAt, updatedAt)
SELECT 'Hatha Yoga', 'hatha-yoga', id, 1, NOW(), NOW() FROM categories WHERE slug = 'yoga'
UNION ALL SELECT 'Vinyasa Yoga', 'vinyasa-yoga', id, 1, NOW(), NOW() FROM categories WHERE slug = 'yoga'
UNION ALL SELECT 'Power Yoga', 'power-yoga', id, 1, NOW(), NOW() FROM categories WHERE slug = 'yoga'
UNION ALL SELECT 'Yin Yoga', 'yin-yoga', id, 1, NOW(), NOW() FROM categories WHERE slug = 'yoga'
UNION ALL SELECT 'Restorative Yoga', 'restorative-yoga', id, 1, NOW(), NOW() FROM categories WHERE slug = 'yoga';

-- Subcategories for Olympic Lifting
INSERT IGNORE INTO subcategories (name, slug, categoryId, createdBy, createdAt, updatedAt)
SELECT 'Snatch', 'snatch', id, 1, NOW(), NOW() FROM categories WHERE slug = 'olympic-lifting'
UNION ALL SELECT 'Clean', 'clean', id, 1, NOW(), NOW() FROM categories WHERE slug = 'olympic-lifting'
UNION ALL SELECT 'Jerk', 'jerk', id, 1, NOW(), NOW() FROM categories WHERE slug = 'olympic-lifting'
UNION ALL SELECT 'Clean & Jerk', 'clean-jerk', id, 1, NOW(), NOW() FROM categories WHERE slug = 'olympic-lifting';

-- Subcategories for Powerlifting
INSERT IGNORE INTO subcategories (name, slug, categoryId, createdBy, createdAt, updatedAt)
SELECT 'Squat', 'squat-powerlifting', id, 1, NOW(), NOW() FROM categories WHERE slug = 'powerlifting'
UNION ALL SELECT 'Bench Press', 'bench-press-powerlifting', id, 1, NOW(), NOW() FROM categories WHERE slug = 'powerlifting'
UNION ALL SELECT 'Deadlift', 'deadlift-powerlifting', id, 1, NOW(), NOW() FROM categories WHERE slug = 'powerlifting'
UNION ALL SELECT 'Accessory Work', 'accessory-work', id, 1, NOW(), NOW() FROM categories WHERE slug = 'powerlifting';

-- Subcategories for Plyometrics
INSERT IGNORE INTO subcategories (name, slug, categoryId, createdBy, createdAt, updatedAt)
SELECT 'Box Jumps', 'box-jumps', id, 1, NOW(), NOW() FROM categories WHERE slug = 'plyometrics'
UNION ALL SELECT 'Depth Jumps', 'depth-jumps', id, 1, NOW(), NOW() FROM categories WHERE slug = 'plyometrics'
UNION ALL SELECT 'Broad Jumps', 'broad-jumps', id, 1, NOW(), NOW() FROM categories WHERE slug = 'plyometrics'
UNION ALL SELECT 'Lateral Jumps', 'lateral-jumps', id, 1, NOW(), NOW() FROM categories WHERE slug = 'plyometrics'
UNION ALL SELECT 'Burpees', 'burpees', id, 1, NOW(), NOW() FROM categories WHERE slug = 'plyometrics';

-- Verify subcategories were created
SELECT 
    c.name AS category_name,
    COUNT(s.id) AS subcategory_count
FROM categories c
LEFT JOIN subcategories s ON c.id = s.categoryId
GROUP BY c.id, c.name
HAVING subcategory_count > 0
ORDER BY c.name;

SELECT 'Subcategories seeded successfully!' AS Status;
