-- Fitness Categories Seed Data
-- Run this in your MySQL database or use the npm script

-- Note: Update the createdBy value (1) to match an actual admin user ID in your database

-- Categories
INSERT INTO categories (name, slug, description, createdBy, createdAt, updatedAt) VALUES
('Strength Training', 'strength-training', 'Build muscle and increase strength', 1, NOW(), NOW()),
('Cardio', 'cardio', 'Improve cardiovascular endurance', 1, NOW(), NOW()),
('Flexibility & Mobility', 'flexibility-mobility', 'Improve flexibility and range of motion', 1, NOW(), NOW()),
('Functional Training', 'functional-training', 'Train movements for daily life', 1, NOW(), NOW()),
('Bodyweight Training', 'bodyweight-training', 'No equipment needed exercises', 1, NOW(), NOW()),
('Weight Training', 'weight-training', 'Training with external weights', 1, NOW(), NOW()),
('Olympic Lifting', 'olympic-lifting', 'Olympic weightlifting movements', 1, NOW(), NOW()),
('Powerlifting', 'powerlifting', 'Focus on the big three lifts', 1, NOW(), NOW()),
('Sports Specific', 'sports-specific', 'Sport-specific training', 1, NOW(), NOW()),
('Recovery & Regeneration', 'recovery-regeneration', 'Active recovery and regeneration', 1, NOW(), NOW()),
('Core Training', 'core-training', 'Dedicated core and abs work', 1, NOW(), NOW()),
('Endurance Training', 'endurance-training', 'Build stamina and endurance', 1, NOW(), NOW()),
('Rehab & Prehab', 'rehab-prehab', 'Injury prevention and rehabilitation', 1, NOW(), NOW());

-- Subcategories for Strength Training (categoryId will be auto-generated, adjust as needed)
INSERT INTO subcategories (name, slug, categoryId, createdBy, createdAt, updatedAt)
SELECT 'Upper Body', 'upper-body', id, 1, NOW(), NOW() FROM categories WHERE slug = 'strength-training'
UNION ALL SELECT 'Lower Body', 'lower-body', id, 1, NOW(), NOW() FROM categories WHERE slug = 'strength-training'
UNION ALL SELECT 'Core', 'core', id, 1, NOW(), NOW() FROM categories WHERE slug = 'strength-training'
UNION ALL SELECT 'Full Body', 'full-body', id, 1, NOW(), NOW() FROM categories WHERE slug = 'strength-training'
UNION ALL SELECT 'Push', 'push', id, 1, NOW(), NOW() FROM categories WHERE slug = 'strength-training'
UNION ALL SELECT 'Pull', 'pull', id, 1, NOW(), NOW() FROM categories WHERE slug = 'strength-training'
UNION ALL SELECT 'Legs', 'legs', id, 1, NOW(), NOW() FROM categories WHERE slug = 'strength-training';

-- Subcategories for Cardio
INSERT INTO subcategories (name, slug, categoryId, createdBy, createdAt, updatedAt)
SELECT 'Running', 'running', id, 1, NOW(), NOW() FROM categories WHERE slug = 'cardio'
UNION ALL SELECT 'Cycling', 'cycling', id, 1, NOW(), NOW() FROM categories WHERE slug = 'cardio'
UNION ALL SELECT 'HIIT', 'hiit', id, 1, NOW(), NOW() FROM categories WHERE slug = 'cardio'
UNION ALL SELECT 'Jump Rope', 'jump-rope', id, 1, NOW(), NOW() FROM categories WHERE slug = 'cardio'
UNION ALL SELECT 'Rowing', 'rowing', id, 1, NOW(), NOW() FROM categories WHERE slug = 'cardio'
UNION ALL SELECT 'Swimming', 'swimming', id, 1, NOW(), NOW() FROM categories WHERE slug = 'cardio'
UNION ALL SELECT 'Elliptical', 'elliptical', id, 1, NOW(), NOW() FROM categories WHERE slug = 'cardio';

-- Subcategories for Flexibility & Mobility
INSERT INTO subcategories (name, slug, categoryId, createdBy, createdAt, updatedAt)
SELECT 'Static Stretching', 'static-stretching', id, 1, NOW(), NOW() FROM categories WHERE slug = 'flexibility-mobility'
UNION ALL SELECT 'Dynamic Stretching', 'dynamic-stretching', id, 1, NOW(), NOW() FROM categories WHERE slug = 'flexibility-mobility'
UNION ALL SELECT 'Yoga', 'yoga', id, 1, NOW(), NOW() FROM categories WHERE slug = 'flexibility-mobility'
UNION ALL SELECT 'Pilates', 'pilates', id, 1, NOW(), NOW() FROM categories WHERE slug = 'flexibility-mobility'
UNION ALL SELECT 'Mobility Drills', 'mobility-drills', id, 1, NOW(), NOW() FROM categories WHERE slug = 'flexibility-mobility'
UNION ALL SELECT 'Foam Rolling', 'foam-rolling', id, 1, NOW(), NOW() FROM categories WHERE slug = 'flexibility-mobility';

-- Continue for all other categories...
-- (Total: 70+ subcategories across 13 categories)

SELECT 'Categories seeded successfully!' AS Status;
