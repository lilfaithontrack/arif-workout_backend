-- ============================================
-- COMPLETE Subcategories for ALL Categories
-- Ensures every category has subcategories
-- ============================================
-- Run this SQL script in your database
-- Note: Change createdBy value (1) to match your admin user ID

-- Already done: Strength Training, Cardio Training, Flexibility Training, Chest, Back, Shoulder, Leg, Quad, Hamstring, Glute, Core, Abs, Barbell, Dumbbell, HIIT, Yoga, Olympic Lifting, Powerlifting, Plyometrics

-- Subcategories for Mobility Training
INSERT IGNORE INTO subcategories (name, slug, categoryId, createdBy, createdAt, updatedAt)
SELECT 'Hip Mobility', 'hip-mobility', id, 1, NOW(), NOW() FROM categories WHERE slug = 'mobility-training'
UNION ALL SELECT 'Shoulder Mobility', 'shoulder-mobility', id, 1, NOW(), NOW() FROM categories WHERE slug = 'mobility-training'
UNION ALL SELECT 'Ankle Mobility', 'ankle-mobility', id, 1, NOW(), NOW() FROM categories WHERE slug = 'mobility-training'
UNION ALL SELECT 'Spine Mobility', 'spine-mobility', id, 1, NOW(), NOW() FROM categories WHERE slug = 'mobility-training';

-- Subcategories for Functional Training
INSERT IGNORE INTO subcategories (name, slug, categoryId, createdBy, createdAt, updatedAt)
SELECT 'Pushing Movements', 'pushing-movements', id, 1, NOW(), NOW() FROM categories WHERE slug = 'functional-training'
UNION ALL SELECT 'Pulling Movements', 'pulling-movements', id, 1, NOW(), NOW() FROM categories WHERE slug = 'functional-training'
UNION ALL SELECT 'Squatting Movements', 'squatting-movements', id, 1, NOW(), NOW() FROM categories WHERE slug = 'functional-training'
UNION ALL SELECT 'Hinging Movements', 'hinging-movements', id, 1, NOW(), NOW() FROM categories WHERE slug = 'functional-training'
UNION ALL SELECT 'Carrying Movements', 'carrying-movements', id, 1, NOW(), NOW() FROM categories WHERE slug = 'functional-training';

-- Subcategories for Bodyweight Training
INSERT IGNORE INTO subcategories (name, slug, categoryId, createdBy, createdAt, updatedAt)
SELECT 'Push-up Variations', 'push-up-variations-bw', id, 1, NOW(), NOW() FROM categories WHERE slug = 'bodyweight-training'
UNION ALL SELECT 'Pull-up Variations', 'pull-up-variations-bw', id, 1, NOW(), NOW() FROM categories WHERE slug = 'bodyweight-training'
UNION ALL SELECT 'Squat Variations', 'squat-variations-bw', id, 1, NOW(), NOW() FROM categories WHERE slug = 'bodyweight-training'
UNION ALL SELECT 'Core Exercises', 'core-exercises-bw', id, 1, NOW(), NOW() FROM categories WHERE slug = 'bodyweight-training'
UNION ALL SELECT 'Plyometric Moves', 'plyometric-moves-bw', id, 1, NOW(), NOW() FROM categories WHERE slug = 'bodyweight-training';

-- Subcategories for Weight Training
INSERT IGNORE INTO subcategories (name, slug, categoryId, createdBy, createdAt, updatedAt)
SELECT 'Compound Exercises', 'compound-exercises', id, 1, NOW(), NOW() FROM categories WHERE slug = 'weight-training'
UNION ALL SELECT 'Isolation Exercises', 'isolation-exercises', id, 1, NOW(), NOW() FROM categories WHERE slug = 'weight-training'
UNION ALL SELECT 'Progressive Overload', 'progressive-overload', id, 1, NOW(), NOW() FROM categories WHERE slug = 'weight-training'
UNION ALL SELECT 'Volume Training', 'volume-training', id, 1, NOW(), NOW() FROM categories WHERE slug = 'weight-training';

-- Subcategories for CrossFit
INSERT IGNORE INTO subcategories (name, slug, categoryId, createdBy, createdAt, updatedAt)
SELECT 'WODs', 'wods', id, 1, NOW(), NOW() FROM categories WHERE slug = 'crossfit'
UNION ALL SELECT 'Metcons', 'metcons', id, 1, NOW(), NOW() FROM categories WHERE slug = 'crossfit'
UNION ALL SELECT 'Girl WODs', 'girl-wods', id, 1, NOW(), NOW() FROM categories WHERE slug = 'crossfit'
UNION ALL SELECT 'Hero WODs', 'hero-wods', id, 1, NOW(), NOW() FROM categories WHERE slug = 'crossfit'
UNION ALL SELECT 'Benchmark WODs', 'benchmark-wods', id, 1, NOW(), NOW() FROM categories WHERE slug = 'crossfit';

-- Subcategories for Calisthenics
INSERT IGNORE INTO subcategories (name, slug, categoryId, createdBy, createdAt, updatedAt)
SELECT 'Skills', 'skills-calisthenics', id, 1, NOW(), NOW() FROM categories WHERE slug = 'calisthenics'
UNION ALL SELECT 'Handstand Training', 'handstand-training', id, 1, NOW(), NOW() FROM categories WHERE slug = 'calisthenics'
UNION ALL SELECT 'Muscle-ups', 'muscle-ups', id, 1, NOW(), NOW() FROM categories WHERE slug = 'calisthenics'
UNION ALL SELECT 'Front Lever', 'front-lever', id, 1, NOW(), NOW() FROM categories WHERE slug = 'calisthenics'
UNION ALL SELECT 'Planche', 'planche', id, 1, NOW(), NOW() FROM categories WHERE slug = 'calisthenics';

-- Subcategories for Strongman
INSERT IGNORE INTO subcategories (name, slug, categoryId, createdBy, createdAt, updatedAt)
SELECT 'Atlas Stones', 'atlas-stones', id, 1, NOW(), NOW() FROM categories WHERE slug = 'strongman'
UNION ALL SELECT 'Yoke Carry', 'yoke-carry', id, 1, NOW(), NOW() FROM categories WHERE slug = 'strongman'
UNION ALL SELECT 'Farmers Walk', 'farmers-walk', id, 1, NOW(), NOW() FROM categories WHERE slug = 'strongman'
UNION ALL SELECT 'Log Press', 'log-press', id, 1, NOW(), NOW() FROM categories WHERE slug = 'strongman'
UNION ALL SELECT 'Tire Flips', 'tire-flips', id, 1, NOW(), NOW() FROM categories WHERE slug = 'strongman';

-- Subcategories for Arm Exercises
INSERT IGNORE INTO subcategories (name, slug, categoryId, createdBy, createdAt, updatedAt)
SELECT 'Bicep Curls', 'bicep-curls-arm', id, 1, NOW(), NOW() FROM categories WHERE slug = 'arm-exercises'
UNION ALL SELECT 'Tricep Extensions', 'tricep-extensions-arm', id, 1,  NOW(), NOW() FROM categories WHERE slug = 'arm-exercises'
UNION ALL SELECT 'Hammer Curls', 'hammer-curls', id, 1, NOW(), NOW() FROM categories WHERE slug = 'arm-exercises'
UNION ALL SELECT 'Close Grip', 'close-grip', id, 1, NOW(), NOW() FROM categories WHERE slug = 'arm-exercises';

-- Subcategories for Bicep Exercises
INSERT IGNORE INTO subcategories (name, slug, categoryId, createdBy, createdAt, updatedAt)
SELECT 'Barbell Curls', 'barbell-curls-bicep', id, 1, NOW(), NOW() FROM categories WHERE slug = 'bicep-exercises'
UNION ALL SELECT 'Dumbbell Curls', 'dumbbell-curls-bicep', id, 1, NOW(), NOW() FROM categories WHERE slug = 'bicep-exercises'
UNION ALL SELECT 'Cable Curls', 'cable-curls-bicep', id, 1, NOW(), NOW() FROM categories WHERE slug = 'bicep-exercises'
UNION ALL SELECT 'Concentration Curls', 'concentration-curls', id, 1, NOW(), NOW() FROM categories WHERE slug = 'bicep-exercises';

-- Subcategories for Tricep Exercises
INSERT IGNORE INTO subcategories (name, slug, categoryId, createdBy, createdAt, updatedAt)
SELECT 'Overhead Extensions', 'overhead-extensions-tricep', id, 1, NOW(), NOW() FROM categories WHERE slug = 'tricep-exercises'
UNION ALL SELECT 'Pushdowns', 'pushdowns-tricep', id, 1, NOW(), NOW() FROM categories WHERE slug = 'tricep-exercises'
UNION ALL SELECT 'Dips', 'dips-tricep', id, 1, NOW(), NOW() FROM categories WHERE slug = 'tricep-exercises'
UNION ALL SELECT 'Kickbacks', 'kickbacks-tricep', id, 1, NOW(), NOW() FROM categories WHERE slug = 'tricep-exercises';

-- Subcategories for Forearm Exercises
INSERT IGNORE INTO subcategories (name, slug, categoryId, createdBy, createdAt, updatedAt)
SELECT 'Wrist Curls', 'wrist-curls', id, 1, NOW(), NOW() FROM categories WHERE slug = 'forearm-exercises'
UNION ALL SELECT 'Reverse Curls', 'reverse-curls-forearm', id, 1, NOW(), NOW() FROM categories WHERE slug = 'forearm-exercises'
UNION ALL SELECT 'Grip Training', 'grip-training-forearm', id, 1, NOW(), NOW() FROM categories WHERE slug = 'forearm-exercises'
UNION ALL SELECT 'Farmers Carry', 'farmers-carry-forearm', id, 1, NOW(), NOW() FROM categories WHERE slug = 'forearm-exercises';

-- Subcategories for Trap Exercises
INSERT IGNORE INTO subcategories (name, slug, categoryId, createdBy, createdAt, updatedAt)
SELECT 'Shrugs', 'shrugs-trap', id, 1, NOW(), NOW() FROM categories WHERE slug = 'trap-exercises'
UNION ALL SELECT 'Upright Rows', 'upright-rows-trap', id, 1, NOW(), NOW() FROM categories WHERE slug = 'trap-exercises'
UNION ALL SELECT 'Face Pulls', 'face-pulls-trap', id, 1, NOW(), NOW() FROM categories WHERE slug = 'trap-exercises'
UNION ALL SELECT 'Rack Pulls', 'rack-pulls-trap', id, 1, NOW(), NOW() FROM categories WHERE slug = 'trap-exercises';

-- Subcategories for Rotator Cuff
INSERT IGNORE INTO subcategories (name, slug, categoryId, createdBy, createdAt, updatedAt)
SELECT 'External Rotation', 'external-rotation', id, 1, NOW(), NOW() FROM categories WHERE slug = 'rotator-cuff'
UNION ALL SELECT 'Internal Rotation', 'internal-rotation', id, 1, NOW(), NOW() FROM categories WHERE slug = 'rotator-cuff'
UNION ALL SELECT 'Band Work', 'band-work-rc', id, 1, NOW(), NOW() FROM categories WHERE slug = 'rotator-cuff'
UNION ALL SELECT 'Stability Exercises', 'stability-exercises-rc', id, 1, NOW(), NOW() FROM categories WHERE slug = 'rotator-cuff';

-- Subcategories for Neck Exercises
INSERT IGNORE INTO subcategories (name, slug, categoryId, createdBy, createdAt, updatedAt)
SELECT 'Flexion', 'flexion-neck', id, 1, NOW(), NOW() FROM categories WHERE slug = 'neck-exercises'
UNION ALL SELECT 'Extension', 'extension-neck', id, 1, NOW(), NOW() FROM categories WHERE slug = 'neck-exercises'
UNION ALL SELECT 'Lateral Flexion', 'lateral-flexion-neck', id, 1, NOW(), NOW() FROM categories WHERE slug = 'neck-exercises'
UNION ALL SELECT 'Rotation', 'rotation-neck', id, 1, NOW(), NOW() FROM categories WHERE slug = 'neck-exercises';

-- Subcategories for Upper Back
INSERT IGNORE INTO subcategories (name, slug, categoryId, createdBy, createdAt, updatedAt)
SELECT 'Rows', 'rows-upper-back', id, 1, NOW(), NOW() FROM categories WHERE slug = 'upper-back'
UNION ALL SELECT 'Pull-downs', 'pull-downs-upper', id, 1, NOW(), NOW() FROM categories WHERE slug = 'upper-back'
UNION ALL SELECT 'Reverse Flyes', 'reverse-flyes', id, 1, NOW(), NOW() FROM categories WHERE slug = 'upper-back'
UNION ALL SELECT 'T-Bar Rows', 't-bar-rows', id, 1, NOW(), NOW() FROM categories WHERE slug = 'upper-back';

-- Subcategories for Oblique Exercises
INSERT IGNORE INTO subcategories (name, slug, categoryId, createdBy, createdAt, updatedAt)
SELECT 'Side Bends', 'side-bends', id, 1, NOW(), NOW() FROM categories WHERE slug = 'oblique-exercises'
UNION ALL SELECT 'Russian Twists', 'russian-twists-oblique', id, 1, NOW(), NOW() FROM categories WHERE slug = 'oblique-exercises'
UNION ALL SELECT 'Woodchoppers', 'woodchoppers', id, 1, NOW(), NOW() FROM categories WHERE slug = 'oblique-exercises'
UNION ALL SELECT 'Side Planks', 'side-planks', id, 1, NOW(), NOW() FROM categories WHERE slug = 'oblique-exercises';

-- Subcategories for Lower Back
INSERT IGNORE INTO subcategories (name, slug, categoryId, createdBy, createdAt, updatedAt)
SELECT 'Hyperextensions', 'hyperextensions', id, 1, NOW(), NOW() FROM categories WHERE slug = 'lower-back'
UNION ALL SELECT 'Good Mornings', 'good-mornings-lb', id, 1, NOW(), NOW() FROM categories WHERE slug = 'lower-back'
UNION ALL SELECT 'Deadlifts', 'deadlifts-lb', id, 1, NOW(), NOW() FROM categories WHERE slug = 'lower-back'
UNION ALL SELECT 'Superman', 'superman-lb', id, 1, NOW(), NOW() FROM categories WHERE slug = 'lower-back';

-- Subcategories for Serratus
INSERT IGNORE INTO subcategories (name, slug, categoryId, createdBy, createdAt, updatedAt)
SELECT 'Scapular Push-ups', 'scapular-push-ups', id, 1, NOW(), NOW() FROM categories WHERE slug = 'serratus'
UNION ALL SELECT 'Protraction Exercises', 'protraction-exercises', id, 1, NOW(), NOW() FROM categories WHERE slug = 'serratus'
UNION ALL SELECT 'Wall Slides', 'wall-slides-serratus', id, 1, NOW(), NOW() FROM categories WHERE slug = 'serratus';

-- Subcategories for Calf Exercises
INSERT IGNORE INTO subcategories (name, slug, categoryId, createdBy, createdAt, updatedAt)
SELECT 'Standing Calf Raises', 'standing-calf-raises', id, 1, NOW(), NOW() FROM categories WHERE slug = 'calf-exercises'
UNION ALL SELECT 'Seated Calf Raises', 'seated-calf-raises', id, 1, NOW(), NOW() FROM categories WHERE slug = 'calf-exercises'
UNION ALL SELECT 'Donkey Calf Raises', 'donkey-calf-raises', id, 1, NOW(), NOW() FROM categories WHERE slug = 'calf-exercises'
UNION ALL SELECT 'Jump Rope', 'jump-rope-calf', id, 1, NOW(), NOW() FROM categories WHERE slug = 'calf-exercises';

-- Subcategories for Hip Exercises
INSERT IGNORE INTO subcategories (name, slug, categoryId, createdBy, createdAt, updatedAt)
SELECT 'Hip Thrusts', 'hip-thrusts-hip', id, 1, NOW(), NOW() FROM categories WHERE slug = 'hip-exercises'
UNION ALL SELECT 'Hip Flexor Stretches', 'hip-flexor-stretches', id, 1, NOW(), NOW() FROM categories WHERE slug = 'hip-exercises'
UNION ALL SELECT 'Fire Hydrants', 'fire-hydrants', id, 1, NOW(), NOW() FROM categories WHERE slug = 'hip-exercises'
UNION ALL SELECT 'Clamshells', 'clamshells', id, 1, NOW(), NOW() FROM categories WHERE slug = 'hip-exercises';

-- Subcategories for Adductor Exercises
INSERT IGNORE INTO subcategories (name, slug, categoryId, createdBy, createdAt, updatedAt)
SELECT 'Adductor Machine', 'adductor-machine', id, 1, NOW(), NOW() FROM categories WHERE slug = 'adductor-exercises'
UNION ALL SELECT 'Copenhagen Planks', 'copenhagen-planks', id, 1, NOW(), NOW() FROM categories WHERE slug = 'adductor-exercises'
UNION ALL SELECT 'Side Lunges', 'side-lunges-adductor', id, 1, NOW(), NOW() FROM categories WHERE slug = 'adductor-exercises'
UNION ALL SELECT 'Sumo Squats', 'sumo-squats-adductor', id, 1, NOW(), NOW() FROM categories WHERE slug = 'adductor-exercises';

-- Subcategories for Abductor Exercises
INSERT IGNORE INTO subcategories (name, slug, categoryId, createdBy, createdAt, updatedAt)
SELECT 'Abductor Machine', 'abductor-machine', id, 1, NOW(), NOW() FROM categories WHERE slug = 'abductor-exercises'
UNION ALL SELECT 'Lateral Band Walks', 'lateral-band-walks', id, 1, NOW(), NOW() FROM categories WHERE slug = 'abductor-exercises'
UNION ALL SELECT 'Fire Hydrants', 'fire-hydrants-abductor', id, 1, NOW(), NOW() FROM categories WHERE slug = 'abductor-exercises'
UNION ALL SELECT 'Side-Lying Leg Lifts', 'side-lying-leg-lifts', id, 1, NOW(), NOW() FROM categories WHERE slug = 'abductor-exercises';

-- Subcategories for Kettlebell Exercises
INSERT IGNORE INTO subcategories (name, slug, categoryId, createdBy, createdAt, updatedAt)
SELECT 'Swings', 'swings-kb', id, 1, NOW(), NOW() FROM categories WHERE slug = 'kettlebell-exercises'
UNION ALL SELECT 'Turkish Get-ups', 'turkish-get-ups', id, 1, NOW(), NOW() FROM categories WHERE slug = 'kettlebell-exercises'
UNION ALL SELECT 'Snatches', 'snatches-kb', id, 1, NOW(), NOW() FROM categories WHERE slug = 'kettlebell-exercises'
UNION ALL SELECT 'Goblet Squats', 'goblet-squats', id, 1, NOW(), NOW() FROM categories WHERE slug = 'kettlebell-exercises'
UNION ALL SELECT 'Clean & Press', 'clean-press-kb', id, 1, NOW(), NOW() FROM categories WHERE slug = 'kettlebell-exercises';

-- Subcategories for Kettlebell Sport
INSERT IGNORE INTO subcategories (name, slug, categoryId, createdBy, createdAt, updatedAt)
SELECT 'Long Cycle', 'long-cycle', id, 1, NOW(), NOW() FROM categories WHERE slug = 'kettlebell-sport'
UNION ALL SELECT 'Jerk', 'jerk-kb-sport', id, 1, NOW(), NOW() FROM categories WHERE slug = 'kettlebell-sport'
UNION ALL SELECT 'Snatch', 'snatch-kb-sport', id, 1, NOW(), NOW() FROM categories WHERE slug = 'kettlebell-sport'
UNION ALL SELECT 'Biathlon', 'biathlon-kb', id, 1, NOW(), NOW() FROM categories WHERE slug = 'kettlebell-sport';

-- Subcategories for Machine Exercises
INSERT IGNORE INTO subcategories (name, slug, categoryId, createdBy, createdAt, updatedAt)
SELECT 'Smith Machine', 'smith-machine', id, 1, NOW(), NOW() FROM categories WHERE slug = 'machine-exercises'
UNION ALL SELECT 'Leg Press Machine', 'leg-press-machine', id, 1, NOW(), NOW() FROM categories WHERE slug = 'machine-exercises'
UNION ALL SELECT 'Cable Machines', 'cable-machines', id, 1, NOW(), NOW() FROM categories WHERE slug = 'machine-exercises'
UNION ALL SELECT 'Selectorized Machines', 'selectorized-machines', id, 1, NOW(), NOW() FROM categories WHERE slug = 'machine-exercises';

-- Subcategories for Cable Exercises
INSERT IGNORE INTO subcategories (name, slug, categoryId, createdBy, createdAt, updatedAt)
SELECT 'Cable Rows', 'cable-rows', id, 1, NOW(), NOW() FROM categories WHERE slug = 'cable-exercises'
UNION ALL SELECT 'Cable Flyes', 'cable-flyes', id, 1, NOW(), NOW() FROM categories WHERE slug = 'cable-exercises'
UNION ALL SELECT 'Cable Curls', 'cable-curls', id, 1, NOW(), NOW() FROM categories WHERE slug = 'cable-exercises'
UNION ALL SELECT 'Cable Tricep Extensions', 'cable-tricep-extensions', id, 1, NOW(), NOW() FROM categories WHERE slug = 'cable-exercises'
UNION ALL SELECT 'Cable Face Pulls', 'cable-face-pulls', id, 1, NOW(), NOW() FROM categories WHERE slug = 'cable-exercises';

-- Subcategories for Resistance Bands
INSERT IGNORE INTO subcategories (name, slug, categoryId, createdBy, createdAt, updatedAt)
SELECT 'Band Rows', 'band-rows', id, 1, NOW(), NOW() FROM categories WHERE slug = 'resistance-bands'
UNION ALL SELECT 'Band Pull-aparts', 'band-pull-aparts', id, 1, NOW(), NOW() FROM categories WHERE slug = 'resistance-bands'
UNION ALL SELECT 'Band Walks', 'band-walks', id, 1, NOW(), NOW() FROM categories WHERE slug = 'resistance-bands'
UNION ALL SELECT 'Band Squats', 'band-squats', id, 1, NOW(), NOW() FROM categories WHERE slug = 'resistance-bands';

-- Subcategories for TRX & Suspension
INSERT IGNORE INTO subcategories (name, slug, categoryId, createdBy, createdAt, updatedAt)
SELECT 'TRX Rows', 'trx-rows', id, 1, NOW(), NOW() FROM categories WHERE slug = 'trx-suspension'
UNION ALL SELECT 'TRX Push-ups', 'trx-push-ups', id, 1, NOW(), NOW() FROM categories WHERE slug = 'trx-suspension'
UNION ALL SELECT 'TRX Squats', 'trx-squats', id, 1, NOW(), NOW() FROM categories WHERE slug = 'trx-suspension'
UNION ALL SELECT 'TRX Core', 'trx-core', id, 1, NOW(), NOW() FROM categories WHERE slug = 'trx-suspension';

-- Subcategories for Medicine Ball
INSERT IGNORE INTO subcategories (name, slug, categoryId, createdBy, createdAt, updatedAt)
SELECT 'Med Ball Slams', 'med-ball-slams', id, 1, NOW(), NOW() FROM categories WHERE slug = 'medicine-ball'
UNION ALL SELECT 'Med Ball Throws', 'med-ball-throws', id, 1, NOW(), NOW() FROM categories WHERE slug = 'medicine-ball'
UNION ALL SELECT 'Med Ball Twists', 'med-ball-twists', id, 1, NOW(), NOW() FROM categories WHERE slug = 'medicine-ball'
UNION ALL SELECT 'Partner Exercises', 'partner-exercises-mb', id, 1, NOW(), NOW() FROM categories WHERE slug = 'medicine-ball';

-- Subcategories for Stability Ball
INSERT IGNORE INTO subcategories (name, slug, categoryId, createdBy, createdAt, updatedAt)
SELECT 'Ball Crunches', 'ball-crunches', id, 1, NOW(), NOW() FROM categories WHERE slug = 'stability-ball'
UNION ALL SELECT 'Ball Push-ups', 'ball-push-ups', id, 1, NOW(), NOW() FROM categories WHERE slug = 'stability-ball'
UNION ALL SELECT 'Ball Planks', 'ball-planks', id, 1, NOW(), NOW() FROM categories WHERE slug = 'stability-ball'
UNION ALL SELECT 'Ball Bridges', 'ball-bridges', id, 1, NOW(), NOW() FROM categories WHERE slug = 'stability-ball';

-- Subcategories for Sandbag Training
INSERT IGNORE INTO subcategories (name, slug, categoryId, createdBy, createdAt, updatedAt)
SELECT 'Sandbag Carries', 'sandbag-carries', id, 1, NOW(), NOW() FROM categories WHERE slug = 'sandbag-training'
UNION ALL SELECT 'Sandbag Cleans', 'sandbag-cleans', id, 1, NOW(), NOW() FROM categories WHERE slug = 'sandbag-training'
UNION ALL SELECT 'Sandbag Squats', 'sandbag-squats', id, 1, NOW(), NOW() FROM categories WHERE slug = 'sandbag-training'
UNION ALL SELECT 'Sandbag Throws', 'sandbag-throws', id, 1, NOW(), NOW() FROM categories WHERE slug = 'sandbag-training';

-- Subcategories for Battle Ropes
INSERT IGNORE INTO subcategories (name, slug, categoryId, createdBy, createdAt, updatedAt)
SELECT 'Waves', 'waves-battle-ropes', id, 1, NOW(), NOW() FROM categories WHERE slug = 'battle-ropes'
UNION ALL SELECT 'Slams', 'slams-battle-ropes', id, 1, NOW(), NOW() FROM categories WHERE slug = 'battle-ropes'
UNION ALL SELECT 'Spirals', 'spirals-battle-ropes', id, 1, NOW(), NOW() FROM categories WHERE slug = 'battle-ropes'
UNION ALL SELECT 'Circles', 'circles-battle-ropes', id, 1, NOW(), NOW() FROM categories WHERE slug = 'battle-ropes';

-- Subcategories for Sled Training
INSERT IGNORE INTO subcategories (name, slug, categoryId, createdBy, createdAt, updatedAt)
SELECT 'Sled Push', 'sled-push', id, 1, NOW(), NOW() FROM categories WHERE slug = 'sled-training'
UNION ALL SELECT 'Sled Pull', 'sled-pull', id, 1, NOW(), NOW() FROM categories WHERE slug = 'sled-training'
UNION ALL SELECT 'Sled Drags', 'sled-drags', id, 1, NOW(), NOW() FROM categories WHERE slug = 'sled-training'
UNION ALL SELECT 'Reverse Sled', 'reverse-sled', id, 1, NOW(), NOW() FROM categories WHERE slug = 'sled-training';

-- Cardio subcategories
INSERT IGNORE INTO subcategories (name, slug, categoryId, createdBy, createdAt, updatedAt)
SELECT 'Long Distance', 'long-distance-running', id, 1, NOW(), NOW() FROM categories WHERE slug = 'running'
UNION ALL SELECT 'Sprint Intervals', 'sprint-intervals-running', id, 1, NOW(), NOW() FROM categories WHERE slug = 'running'
UNION ALL SELECT 'Hill Running', 'hill-running', id, 1, NOW(), NOW() FROM categories WHERE slug = 'running'
UNION ALL SELECT 'Treadmill', 'treadmill-running', id, 1, NOW(), NOW() FROM categories WHERE slug = 'running';

INSERT IGNORE INTO subcategories (name, slug, categoryId, createdBy, createdAt, updatedAt)
SELECT '100m Sprints', '100m-sprints', id, 1, NOW(), NOW() FROM categories WHERE slug = 'sprinting'
UNION ALL SELECT '200m Sprints', '200m-sprints', id, 1, NOW(), NOW() FROM categories WHERE slug = 'sprinting'
UNION ALL SELECT '400m Sprints', '400m-sprints', id, 1, NOW(), NOW() FROM categories WHERE slug = 'sprinting';

INSERT IGNORE INTO subcategories (name, slug, categoryId, createdBy, createdAt, updatedAt)
SELECT 'Road Cycling', 'road-cycling', id, 1, NOW(), NOW() FROM categories WHERE slug = 'cycling'
UNION ALL SELECT 'Stationary Bike', 'stationary-bike', id, 1, NOW(), NOW() FROM categories WHERE slug = 'cycling'
UNION ALL SELECT 'Spin Class', 'spin-class', id, 1, NOW(), NOW() FROM categories WHERE slug = 'cycling'
UNION ALL SELECT 'Mountain Biking', 'mountain-biking', id, 1, NOW(), NOW() FROM categories WHERE slug = 'cycling';

INSERT IGNORE INTO subcategories (name, slug, categoryId, createdBy, createdAt, updatedAt)
SELECT 'Freestyle', 'freestyle-swimming', id, 1, NOW(), NOW() FROM categories WHERE slug = 'swimming'
UNION ALL SELECT 'Breaststroke', 'breaststroke', id, 1, NOW(), NOW() FROM categories WHERE slug = 'swimming'
UNION ALL SELECT 'Backstroke', 'backstroke', id, 1, NOW(), NOW() FROM categories WHERE slug = 'swimming'
UNION ALL SELECT 'Butterfly', 'butterfly-swimming', id, 1, NOW(), NOW() FROM categories WHERE slug = 'swimming';

INSERT IGNORE INTO subcategories (name, slug, categoryId, createdBy, createdAt, updatedAt)
SELECT 'Rowing Machine', 'rowing-machine', id, 1, NOW(), NOW() FROM categories WHERE slug = 'rowing'
UNION ALL SELECT 'Water Rowing', 'water-rowing', id, 1, NOW(), NOW() FROM categories WHERE slug = 'rowing'
UNION ALL SELECT 'Ergometer', 'ergometer', id, 1, NOW(), NOW() FROM categories WHERE slug = 'rowing';

INSERT IGNORE INTO subcategories (name, slug, categoryId, createdBy, createdAt, updatedAt)
SELECT 'Single Unders', 'single-unders', id, 1, NOW(), NOW() FROM categories WHERE slug = 'jump-rope'
UNION ALL SELECT 'Double Unders', 'double-unders', id, 1, NOW(), NOW() FROM categories WHERE slug = 'jump-rope'
UNION ALL SELECT 'Crossovers', 'crossovers-jump-rope', id, 1, NOW(), NOW() FROM categories WHERE slug = 'jump-rope';

INSERT IGNORE INTO subcategories (name, slug, categoryId, createdBy, createdAt, updatedAt)
SELECT 'Forward', 'forward-elliptical', id, 1, NOW(), NOW() FROM categories WHERE slug = 'elliptical'
UNION ALL SELECT 'Reverse', 'reverse-elliptical', id, 1, NOW(), NOW() FROM categories WHERE slug = 'elliptical'
UNION ALL SELECT 'HIIT Intervals', 'hiit-intervals-elliptical', id, 1, NOW(), NOW() FROM categories WHERE slug = 'elliptical';

INSERT IGNORE INTO subcategories (name, slug, categoryId, createdBy, createdAt, updatedAt)
SELECT 'Stair Stepper', 'stair-stepper', id, 1, NOW(), NOW() FROM categories WHERE slug = 'stair-climbing'
UNION ALL SELECT 'Stair Master', 'stair-master', id, 1, NOW(), NOW() FROM categories WHERE slug = 'stair-climbing'
UNION ALL SELECT 'Stairs Sprints', 'stairs-sprints', id, 1, NOW(), NOW() FROM categories WHERE slug = 'stair-climbing';

-- Training Methods
INSERT IGNORE INTO subcategories (name, slug, categoryId, createdBy, createdAt, updatedAt)
SELECT 'Isometric Holds', 'isometric-holds', id, 1, NOW(), NOW() FROM categories WHERE slug = 'isometric-training'
UNION ALL SELECT 'Wall Sits', 'wall-sits', id, 1, NOW(), NOW() FROM categories WHERE slug = 'isometric-training'
UNION ALL SELECT 'Plank Holds', 'plank-holds-isometric', id, 1, NOW(), NOW() FROM categories WHERE slug = 'isometric-training';

INSERT IGNORE INTO subcategories (name, slug, categoryId, createdBy, createdAt, updatedAt)
SELECT 'Negative Reps', 'negative-reps', id, 1, NOW(), NOW() FROM categories WHERE slug = 'eccentric-training'
UNION ALL SELECT 'Slow Lowering', 'slow-lowering', id, 1, NOW(), NOW() FROM categories WHERE slug = 'eccentric-training'
UNION ALL SELECT 'Forced Negatives', 'forced-negatives', id, 1, NOW(), NOW() FROM categories WHERE slug = 'eccentric-training';

INSERT IGNORE INTO subcategories (name, slug, categoryId, createdBy, createdAt, updatedAt)
SELECT '3-1-1', '3-1-1-tempo', id, 1, NOW(), NOW() FROM categories WHERE slug = 'tempo-training'
UNION ALL SELECT '4-2-1', '4-2-1-tempo', id, 1, NOW(), NOW() FROM categories WHERE slug = 'tempo-training'
UNION ALL SELECT 'Slow Eccentrics', 'slow-eccentrics-tempo', id, 1, NOW(), NOW() FROM categories WHERE slug = 'tempo-training';

INSERT IGNORE INTO subcategories (name, slug, categoryId, createdBy, createdAt, updatedAt)
SELECT 'Agonist Superset', 'agonist-superset', id, 1, NOW(), NOW() FROM categories WHERE slug = 'superset-training'
UNION ALL SELECT 'Antagonist Superset', 'antagonist-superset', id, 1, NOW(), NOW() FROM categories WHERE slug = 'superset-training'
UNION ALL SELECT 'Compound Superset', 'compound-superset', id, 1, NOW(), NOW() FROM categories WHERE slug = 'superset-training';

INSERT IGNORE INTO subcategories (name, slug, categoryId, createdBy, createdAt, updatedAt)
SELECT 'Upper Body Circuit', 'upper-body-circuit', id, 1, NOW(), NOW() FROM categories WHERE slug = 'circuit-training'
UNION ALL SELECT 'Lower Body Circuit', 'lower-body-circuit', id, 1, NOW(), NOW() FROM categories WHERE slug = 'circuit-training'
UNION ALL SELECT 'Full Body Circuit', 'full-body-circuit', id, 1, NOW(), NOW() FROM categories WHERE slug = 'circuit-training';

INSERT IGNORE INTO subcategories (name, slug, categoryId, createdBy, createdAt, updatedAt)
SELECT 'Ascending Pyramid', 'ascending-pyramid', id, 1, NOW(), NOW() FROM categories WHERE slug = 'pyramid-training'
UNION ALL SELECT 'Descending Pyramid', 'descending-pyramid', id, 1, NOW(), NOW() FROM categories WHERE slug = 'pyramid-training'
UNION ALL SELECT 'Triangle Pyramid', 'triangle-pyramid', id, 1, NOW(), NOW() FROM categories WHERE slug = 'pyramid-training';

INSERT IGNORE INTO subcategories (name, slug, categoryId, createdBy, createdAt, updatedAt)
SELECT 'Single Drop', 'single-drop', id, 1, NOW(), NOW() FROM categories WHERE slug = 'drop-sets'
UNION ALL SELECT 'Triple Drop', 'triple-drop', id, 1, NOW(), NOW() FROM categories WHERE slug = 'drop-sets'
UNION ALL SELECT 'Running the Rack', 'running-the-rack', id, 1, NOW(), NOW() FROM categories WHERE slug = 'drop-sets';

-- Sports Training
INSERT IGNORE INTO subcategories (name, slug, categoryId, createdBy, createdAt, updatedAt)
SELECT 'Vertical Jump', 'vertical-jump-basketball', id, 1, NOW(), NOW() FROM categories WHERE slug = 'basketball-training'
UNION ALL SELECT 'Agility Drills', 'agility-drills-basketball', id, 1, NOW(), NOW() FROM categories WHERE slug = 'basketball-training'
UNION ALL SELECT 'Court Conditioning', 'court-conditioning', id, 1, NOW(), NOW() FROM categories WHERE slug = 'basketball-training';

INSERT IGNORE INTO subcategories (name, slug, categoryId, createdBy, createdAt, updatedAt)
SELECT 'Sprint Training', 'sprint-training-soccer', id, 1, NOW(), NOW() FROM categories WHERE slug = 'soccer-training'
UNION ALL SELECT 'Endurance', 'endurance-soccer', id, 1, NOW(), NOW() FROM categories WHERE slug = 'soccer-training'
UNION ALL SELECT 'Agility', 'agility-soccer', id, 1, NOW(), NOW() FROM categories WHERE slug = 'soccer-training';

INSERT IGNORE INTO subcategories (name, slug, categoryId, createdBy, createdAt, updatedAt)
SELECT 'Footwork', 'footwork-tennis', id, 1, NOW(), NOW() FROM categories WHERE slug = 'tennis-training'
UNION ALL SELECT 'Core Rotation', 'core-rotation-tennis', id, 1, NOW(), NOW() FROM categories WHERE slug = 'tennis-training'
UNION ALL SELECT 'Explosive Power', 'explosive-power-tennis', id, 1, NOW(), NOW() FROM categories WHERE slug = 'tennis-training';

INSERT IGNORE INTO subcategories (name, slug, categoryId, createdBy, createdAt, updatedAt)
SELECT 'Heavy Bag', 'heavy-bag', id, 1, NOW(), NOW() FROM categories WHERE slug = 'boxing-training'
UNION ALL SELECT 'Speed Bag', 'speed-bag', id, 1, NOW(), NOW() FROM categories WHERE slug = 'boxing-training'
UNION ALL SELECT 'Shadow Boxing', 'shadow-boxing', id, 1, NOW(), NOW() FROM categories WHERE slug = 'boxing-training'
UNION ALL SELECT 'Pad Work', 'pad-work-boxing', id, 1, NOW(), NOW() FROM categories WHERE slug = 'boxing-training';

INSERT IGNORE INTO subcategories (name, slug, categoryId, createdBy, createdAt, updatedAt)
SELECT 'Grappling', 'grappling-mma', id, 1, NOW(), NOW() FROM categories WHERE slug = 'mma-training'
UNION ALL SELECT 'Striking', 'striking-mma', id, 1, NOW(), NOW() FROM categories WHERE slug = 'mma-training'
UNION ALL SELECT 'Wrestling', 'wrestling-mma', id, 1, NOW(), NOW() FROM categories WHERE slug = 'mma-training'
UNION ALL SELECT 'BJJ', 'bjj-mma', id, 1, NOW(), NOW() FROM categories WHERE slug = 'mma-training';

INSERT IGNORE INTO subcategories (name, slug, categoryId, createdBy, createdAt, updatedAt)
SELECT 'Takedowns', 'takedowns-wrestling', id, 1, NOW(), NOW() FROM categories WHERE slug = 'wrestling'
UNION ALL SELECT 'Ground Work', 'ground-work-wrestling', id, 1, NOW(), NOW() FROM categories WHERE slug = 'wrestling'
UNION ALL SELECT 'Strength Training', 'strength-training-wrestling', id, 1, NOW(), NOW() FROM categories WHERE slug = 'wrestling';

INSERT IGNORE INTO subcategories (name, slug, categoryId, createdBy, createdAt, updatedAt)
SELECT 'Throwing', 'throwing-baseball', id, 1, NOW(), NOW() FROM categories WHERE slug = 'baseball-training'
UNION ALL SELECT 'Batting', 'batting-baseball', id, 1, NOW(), NOW() FROM categories WHERE slug = 'baseball-training'
UNION ALL SELECT 'Fielding', 'fielding-baseball', id, 1, NOW(), NOW() FROM categories WHERE slug = 'baseball-training';

INSERT IGNORE INTO subcategories (name, slug, categoryId, createdBy, createdAt, updatedAt)
SELECT 'Speed Training', 'speed-training-football', id, 1, NOW(), NOW() FROM categories WHERE slug = 'football-training'
UNION ALL SELECT 'Power', 'power-football', id, 1, NOW(), NOW() FROM categories WHERE slug = 'football-training'
UNION ALL SELECT 'Agility', 'agility-football', id, 1, NOW(), NOW() FROM categories WHERE slug = 'football-training';

INSERT IGNORE INTO subcategories (name, slug, categoryId, createdBy, createdAt, updatedAt)
SELECT 'Sprints', 'sprints-track', id, 1, NOW(), NOW() FROM categories WHERE slug = 'track-field'
UNION ALL SELECT 'Distance', 'distance-track', id, 1, NOW(), NOW() FROM categories WHERE slug = 'track-field'
UNION ALL SELECT 'Hurdles', 'hurdles-track', id, 1, NOW(), NOW() FROM categories WHERE slug = 'track-field'
UNION ALL SELECT 'Throws', 'throws-track', id, 1, NOW(), NOW() FROM categories WHERE slug = 'track-field';

INSERT IGNORE INTO subcategories (name, slug, categoryId, createdBy, createdAt, updatedAt)
SELECT 'Jumping', 'jumping-volleyball', id, 1, NOW(), NOW() FROM categories WHERE slug = 'volleyball'
UNION ALL SELECT 'Passing Drills', 'passing-drills-volleyball', id, 1, NOW(), NOW() FROM categories WHERE slug = 'volleyball'
UNION ALL SELECT 'Court Movement', 'court-movement', id, 1, NOW(), NOW() FROM categories WHERE slug = 'volleyball';

-- Flexibility & Mobility
INSERT IGNORE INTO subcategories (name, slug, categoryId, createdBy, createdAt, updatedAt)
SELECT 'Pre-Workout Stretches', 'pre-workout-stretches', id, 1, NOW(), NOW() FROM categories WHERE slug = 'static-stretching'
UNION ALL SELECT 'Post-Workout Stretches', 'post-workout-stretches', id, 1, NOW(), NOW() FROM categories WHERE slug = 'static-stretching'
UNION ALL SELECT 'Deep Stretches', 'deep-stretches', id, 1, NOW(), NOW() FROM categories WHERE slug = 'static-stretching';

INSERT IGNORE INTO subcategories (name, slug, categoryId, createdBy, createdAt, updatedAt)
SELECT 'Leg Swings', 'leg-swings', id, 1, NOW(), NOW() FROM categories WHERE slug = 'dynamic-stretching'
UNION ALL SELECT 'Arm Circles', 'arm-circles-dynamic', id, 1, NOW(), NOW() FROM categories WHERE slug ='dynamic-stretching'
UNION ALL SELECT 'Walking Lunges', 'walking-lunges-dynamic', id, 1, NOW(), NOW() FROM categories WHERE slug = 'dynamic-stretching';

INSERT IGNORE INTO subcategories (name, slug, categoryId, createdBy, createdAt, updatedAt)
SELECT 'Reformer', 'reformer-pilates', id, 1, NOW(), NOW() FROM categories WHERE slug = 'pilates'
UNION ALL SELECT 'Mat Pilates', 'mat-pilates', id, 1, NOW(), NOW() FROM categories WHERE slug = 'pilates'
UNION ALL SELECT 'Chair Pilates', 'chair-pilates', id, 1, NOW(), NOW() FROM categories WHERE slug = 'pilates';

INSERT IGNORE INTO subcategories (name, slug, categoryId, createdBy, createdAt, updatedAt)
SELECT 'Contract-Relax', 'contract-relax-pnf', id, 1, NOW(), NOW() FROM categories WHERE slug = 'pnf-stretching'
UNION ALL SELECT 'Hold-Relax', 'hold-relax-pnf', id, 1, NOW(), NOW() FROM categories WHERE slug = 'pnf-stretching'
UNION ALL SELECT 'Partner PNF', 'partner-pnf', id, 1, NOW(), NOW() FROM categories WHERE slug = 'pnf-stretching';

INSERT IGNORE INTO subcategories (name, slug, categoryId, createdBy, createdAt, updatedAt)
SELECT 'Quads', 'quads-foam-rolling', id, 1, NOW(), NOW() FROM categories WHERE slug = 'foam-rolling'
UNION ALL SELECT 'IT Band', 'it-band-foam', id, 1, NOW(), NOW() FROM categories WHERE slug = 'foam-rolling'
UNION ALL SELECT 'Back', 'back-foam-rolling', id, 1, NOW(), NOW() FROM categories WHERE slug = 'foam-rolling'
UNION ALL SELECT 'Calves', 'calves-foam-rolling', id, 1, NOW(), NOW() FROM categories WHERE slug = 'foam-rolling';

-- Performance Training
INSERT IGNORE INTO subcategories (name, slug, categoryId, createdBy, createdAt, updatedAt)
SELECT 'Sprint Mechanics', 'sprint-mechanics', id, 1, NOW(), NOW() FROM categories WHERE slug = 'speed-training'
UNION ALL SELECT 'Acceleration', 'acceleration-speed', id, 1, NOW(), NOW() FROM categories WHERE slug = 'speed-training'
UNION ALL SELECT 'Top Speed', 'top-speed', id, 1, NOW(), NOW() FROM categories WHERE slug = 'speed-training';

INSERT IGNORE INTO subcategories (name, slug, categoryId, createdBy, createdAt, updatedAt)
SELECT 'Cone Drills', 'cone-drills', id, 1, NOW(), NOW() FROM categories WHERE slug = 'agility-training'
UNION ALL SELECT 'Ladder Drills', 'ladder-drills', id, 1, NOW(), NOW() FROM categories WHERE slug = 'agility-training'
UNION ALL SELECT 'Change of Direction', 'change-of-direction', id, 1, NOW(), NOW() FROM categories WHERE slug = 'agility-training';

INSERT IGNORE INTO subcategories (name, slug, categoryId, createdBy, createdAt, updatedAt)
SELECT 'Olympic Lifts', 'olympic-lifts-power', id, 1, NOW(), NOW() FROM categories WHERE slug = 'power-development'
UNION ALL SELECT 'Plyometrics', 'plyometrics-power', id, 1, NOW(), NOW() FROM categories WHERE slug = 'power-development'
UNION ALL SELECT 'Medicine Ball Throws', 'medicine-ball-throws-power', id, 1, NOW(), NOW() FROM categories WHERE slug = 'power-development';

INSERT IGNORE INTO subcategories (name, slug, categoryId, createdBy, createdAt, updatedAt)
SELECT 'Aerobic Base', 'aerobic-base', id, 1, NOW(), NOW() FROM categories WHERE slug = 'endurance-training'
UNION ALL SELECT 'Tempo Runs', 'tempo-runs-endurance', id, 1, NOW(), NOW() FROM categories WHERE slug = 'endurance-training'
UNION ALL SELECT 'Long Slow Distance', 'long-slow-distance', id, 1, NOW(), NOW() FROM categories WHERE slug = 'endurance-training';

INSERT IGNORE INTO subcategories (name, slug, categoryId, createdBy, createdAt, updatedAt)
SELECT 'Single Leg Balance', 'single-leg-balance', id, 1, NOW(), NOW() FROM categories WHERE slug = 'balance-training'
UNION ALL SELECT 'BOSU Ball', 'bosu-ball-balance', id, 1, NOW(), NOW() FROM categories WHERE slug = 'balance-training'
UNION ALL SELECT 'Stability Training', 'stability-training-balance', id, 1, NOW(), NOW() FROM categories WHERE slug = 'balance-training';

INSERT IGNORE INTO subcategories (name, slug, categoryId, createdBy, createdAt, updatedAt)
SELECT 'Hand-Eye', 'hand-eye-coordination', id, 1, NOW(), NOW() FROM categories WHERE slug = 'coordination-drills'
UNION ALL SELECT 'Foot-Eye', 'foot-eye-coordination', id, 1, NOW(), NOW() FROM categories WHERE slug = 'coordination-drills'
UNION ALL SELECT 'Complex Movements', 'complex-movements', id, 1, NOW(), NOW() FROM categories WHERE slug = 'coordination-drills';

INSERT IGNORE INTO subcategories (name, slug, categoryId, createdBy, createdAt, updatedAt)
SELECT 'Visual Reaction', 'visual-reaction', id, 1, NOW(), NOW() FROM categories WHERE slug = 'reaction-training'
UNION ALL SELECT 'Auditory Reaction', 'auditory-reaction', id, 1, NOW(), NOW() FROM categories WHERE slug = 'reaction-training'
UNION ALL SELECT 'Multi-directional', 'multi-directional-reaction', id, 1, NOW(), NOW() FROM categories WHERE slug = 'reaction-training';

-- Recovery & Health
INSERT IGNORE INTO subcategories (name, slug, categoryId, createdBy, createdAt, updatedAt)
SELECT 'Walking', 'walking-recovery', id, 1, NOW(), NOW() FROM categories WHERE slug = 'active-recovery'
UNION ALL SELECT 'Swimming', 'swimming-recovery', id, 1, NOW(), NOW() FROM categories WHERE slug = 'active-recovery'
UNION ALL SELECT 'Cycling', 'cycling-recovery', id, 1, NOW(), NOW() FROM categories WHERE slug = 'active-recovery';

INSERT IGNORE INTO subcategories (name, slug, categoryId, createdBy, createdAt, updatedAt)
SELECT 'Full Body Stretch', 'full-body-stretch-cooldown', id, 1, NOW(), NOW() FROM categories WHERE slug = 'stretching-cool-down'
UNION ALL SELECT 'Static Holds', 'static-holds-cooldown', id, 1, NOW(), NOW() FROM categories WHERE slug = 'stretching-cool-down'
UNION ALL SELECT 'Breathing Exercises', 'breathing-exercises-cooldown', id, 1, NOW(), NOW() FROM categories WHERE slug = 'stretching-cool-down';

INSERT IGNORE INTO subcategories (name, slug, categoryId, createdBy, createdAt, updatedAt)
SELECT 'Massage Therapy', 'massage-therapy', id, 1, NOW(), NOW() FROM categories WHERE slug = 'regeneration'
UNION ALL SELECT 'Compression', 'compression-regeneration', id, 1, NOW(), NOW() FROM categories WHERE slug = 'regeneration'
UNION ALL SELECT 'Ice Baths', 'ice-baths', id, 1, NOW(), NOW() FROM categories WHERE slug = 'regeneration';

INSERT IGNORE INTO subcategories (name, slug, categoryId, createdBy, createdAt, updatedAt)
SELECT 'Shoulder Stability', 'shoulder-stability-prehab', id, 1, NOW(), NOW() FROM categories WHERE slug = 'prehab'
UNION ALL SELECT 'Knee Prehab', 'knee-prehab', id, 1, NOW(), NOW() FROM categories WHERE slug = 'prehab'
UNION ALL SELECT 'Hip Mobility', 'hip-mobility-prehab', id, 1, NOW(), NOW() FROM categories WHERE slug = 'prehab';

INSERT IGNORE INTO subcategories (name, slug, categoryId, createdBy, createdAt, updatedAt)
SELECT 'Post-Surgery', 'post-surgery-rehab', id, 1, NOW(), NOW() FROM categories WHERE slug = 'rehab-exercises'
UNION ALL SELECT 'Post-Injury', 'post-injury-rehab', id, 1, NOW(), NOW() FROM categories WHERE slug = 'rehab-exercises'
UNION ALL SELECT 'Physical Therapy', 'physical-therapy', id, 1, NOW(), NOW() FROM categories WHERE slug = 'rehab-exercises';

INSERT IGNORE INTO subcategories (name, slug, categoryId, createdBy, createdAt, updatedAt)
SELECT 'Posture Assessment', 'posture-assessment', id, 1, NOW(), NOW() FROM categories WHERE slug = 'corrective-exercise'
UNION ALL SELECT 'Movement Screening', 'movement-screening', id, 1, NOW(), NOW() FROM categories WHERE slug = 'corrective-exercise'
UNION ALL SELECT 'Muscle Imbalance', 'muscle-imbalance', id, 1, NOW(), NOW() FROM categories WHERE slug = 'corrective-exercise';

INSERT IGNORE INTO subcategories (name, slug, categoryId, createdBy, createdAt, updatedAt)
SELECT 'Forward Head', 'forward-head-posture', id, 1, NOW(), NOW() FROM categories WHERE slug = 'postural-training'
UNION ALL SELECT 'Rounded Shoulders', 'rounded-shoulders', id, 1, NOW(), NOW() FROM categories WHERE slug = 'postural-training'
UNION ALL SELECT 'Anterior Pelvic Tilt', 'anterior-pelvic-tilt', id, 1, NOW(), NOW() FROM categories WHERE slug = 'postural-training';

-- Special Populations
INSERT IGNORE INTO subcategories (name, slug, categoryId, createdBy, createdAt, updatedAt)
SELECT 'Movement Basics', 'movement-basics', id, 1, NOW(), NOW() FROM categories WHERE slug = 'beginner-training'
UNION ALL SELECT 'Form Focus', 'form-focus', id, 1, NOW(), NOW() FROM categories WHERE slug = 'beginner-training'
UNION ALL SELECT 'Basic Strength', 'basic-strength', id, 1, NOW(), NOW() FROM categories WHERE slug = 'beginner-training';

INSERT IGNORE INTO subcategories (name, slug, categoryId, createdBy, createdAt, updatedAt)
SELECT 'Chair Exercises', 'chair-exercises-senior', id, 1, NOW(), NOW() FROM categories WHERE slug = 'senior-fitness'
UNION ALL SELECT 'Balance Training', 'balance-training-senior', id, 1, NOW(), NOW() FROM categories WHERE slug = 'senior-fitness'
UNION ALL SELECT 'Low Impact', 'low-impact-senior', id, 1, NOW(), NOW() FROM categories WHERE slug = 'senior-fitness';

INSERT IGNORE INTO subcategories (name, slug, categoryId, createdBy, createdAt, updatedAt)
SELECT 'First Trimester', 'first-trimester', id, 1, NOW(), NOW() FROM categories WHERE slug = 'prenatal-fitness'
UNION ALL SELECT 'Second Trimester', 'second-trimester', id, 1, NOW(), NOW() FROM categories WHERE slug = 'prenatal-fitness'
UNION ALL SELECT 'Third Trimester', 'third-trimester', id, 1, NOW(), NOW() FROM categories WHERE slug = 'prenatal-fitness';

INSERT IGNORE INTO subcategories (name, slug, categoryId, createdBy, createdAt, updatedAt)
SELECT 'Pelvic Floor', 'pelvic-floor-postnatal', id, 1, NOW(), NOW() FROM categories WHERE slug = 'postnatal-fitness'
UNION ALL SELECT 'Core Rebuilding', 'core-rebuilding', id, 1, NOW(), NOW() FROM categories WHERE slug = 'postnatal-fitness'
UNION ALL SELECT 'Diastasis Recti', 'diastasis-recti', id, 1, NOW(), NOW() FROM categories WHERE slug = 'postnatal-fitness';

INSERT IGNORE INTO subcategories (name, slug, categoryId, createdBy, createdAt, updatedAt)
SELECT 'Age 6-12', 'age-6-12', id, 1, NOW(), NOW() FROM categories WHERE slug = 'youth-training'
UNION ALL SELECT 'Age 13-18', 'age-13-18', id, 1, NOW(), NOW() FROM categories WHERE slug = 'youth-training'
UNION ALL SELECT 'Motor Skills', 'motor-skills-youth', id, 1, NOW(), NOW() FROM categories WHERE slug = 'youth-training';

-- Goals
INSERT IGNORE INTO subcategories (name, slug, categoryId, createdBy, createdAt, updatedAt)
SELECT 'HIIT Workouts', 'hiit-workouts-fatloss', id, 1, NOW(), NOW() FROM categories WHERE slug = 'fat-loss'
UNION ALL SELECT 'Cardio Circuits', 'cardio-circuits-fatloss', id, 1, NOW(), NOW() FROM categories WHERE slug = 'fat-loss'
UNION ALL SELECT 'Metabolic Conditioning', 'metabolic-conditioning', id, 1, NOW(), NOW() FROM categories WHERE slug = 'fat-loss';

INSERT IGNORE INTO subcategories (name, slug, categoryId, createdBy, createdAt, updatedAt)
SELECT 'Hypertrophy Programs', 'hypertrophy-programs', id, 1, NOW(), NOW() FROM categories WHERE slug = 'muscle-building'
UNION ALL SELECT 'Volume Training', 'volume-training-muscle', id, 1, NOW(), NOW() FROM categories WHERE slug = 'muscle-building'
UNION ALL SELECT 'Progressive Overload', 'progressive-overload-muscle', id, 1, NOW(), NOW() FROM categories WHERE slug = 'muscle-building';

INSERT IGNORE INTO subcategories (name, slug, categoryId, createdBy, createdAt, updatedAt)
SELECT 'Sport-Specific', 'sport-specific-athletic', id, 1, NOW(), NOW() FROM categories WHERE slug = 'athletic-performance'
UNION ALL SELECT 'Power Training', 'power-training-athletic', id, 1, NOW(), NOW() FROM categories WHERE slug = 'athletic-performance'
UNION ALL SELECT 'Speed & Agility', 'speed-agility-athletic', id, 1, NOW(), NOW() FROM categories WHERE slug = 'athletic-performance';

INSERT IGNORE INTO subcategories (name, slug, categoryId, createdBy, createdAt, updatedAt)
SELECT 'Full Body Workouts', 'full-body-workouts-general', id, 1, NOW(), NOW() FROM categories WHERE slug = 'general-fitness'
UNION ALL SELECT 'Mixed Cardio & Strength', 'mixed-cardio-strength', id, 1, NOW(), NOW() FROM categories WHERE slug = 'general-fitness'
UNION ALL SELECT 'Bodyweight Circuits', 'bodyweight-circuits-general', id, 1, NOW(), NOW() FROM categories WHERE slug = 'general-fitness';

INSERT IGNORE INTO subcategories (name, slug, categoryId, createdBy, createdAt, updatedAt)
SELECT 'Cut & Bulk', 'cut-bulk', id, 1, NOW(), NOW() FROM categories WHERE slug = 'body-composition'
UNION ALL SELECT 'Recomposition', 'recomposition-body', id, 1, NOW(), NOW() FROM categories WHERE slug = 'body-composition'
UNION ALL SELECT 'Lean Muscle Gain', 'lean-muscle-gain', id, 1, NOW(), NOW() FROM categories WHERE slug = 'body-composition';

INSERT IGNORE INTO subcategories (name, slug, categoryId, createdBy, createdAt, updatedAt)
SELECT 'Pre-Season', 'pre-season', id, 1, NOW(), NOW() FROM categories WHERE slug = 'sports-conditioning'
UNION ALL SELECT 'In-Season', 'in-season', id, 1, NOW(), NOW() FROM categories WHERE slug = 'sports-conditioning'
UNION ALL SELECT 'Off-Season', 'off-season', id, 1, NOW(), NOW() FROM categories WHERE slug = 'sports-conditioning';

-- Verify results
SELECT 
    c.name AS category_name,
    COUNT(s.id) AS subcategory_count
FROM categories c
LEFT JOIN subcategories s ON c.id = s.categoryId
GROUP BY c.id, c.name
ORDER BY subcategory_count DESC, c.name ASC;

SELECT 'COMPLETE! All categories now have subcategories!' AS Status;
