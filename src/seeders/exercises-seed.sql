-- ============================================
-- Complete Exercise Database Seed - 29 Exercises
-- Based on images in public/images/exercises
-- ============================================

-- 1. Push-ups
INSERT IGNORE INTO exercises (name, slug, description, category, difficulty, muscleGroups, primaryMuscles, secondaryMuscles, equipment, instructions, videoUrl, imageUrl, sets, reps, duration, restTime, caloriesBurnedPerMinute, tips, isActive, createdBy, createdAt, updatedAt)
VALUES ('Push-ups', 'pushups', 'Classic bodyweight chest exercise', 'strength', 'beginner',
JSON_ARRAY('chest', 'triceps', 'shoulders'), JSON_ARRAY('chest', 'triceps'), JSON_ARRAY('shoulders', 'core'),
JSON_ARRAY('none'),
JSON_ARRAY('Start in plank position', 'Lower chest to floor', 'Push back up'),
'/videos/exercises/pushups.mp4', '/images/exercises/pushups/main.jpg',
3, 12, 300, 60, 7.5,
JSON_ARRAY('Keep core tight', 'Don''t let hips sag'), TRUE, 1, NOW(), NOW());

-- 2. Squats
INSERT IGNORE INTO exercises (name, slug, description, category, difficulty, muscleGroups, primaryMuscles, secondaryMuscles, equipment, instructions, videoUrl, imageUrl, sets, reps, duration, restTime, caloriesBurnedPerMinute, tips, isActive, createdBy, createdAt, updatedAt)
VALUES ('Squats', 'squats', 'Fundamental lower body exercise', 'strength', 'beginner',
JSON_ARRAY('legs', 'glutes'), JSON_ARRAY('quadriceps', 'glutes'), JSON_ARRAY('hamstrings', 'core'),
JSON_ARRAY('none'),
JSON_ARRAY('Feet shoulder-width apart', 'Lower hips back and down', 'Push through heels to stand'),
'/videos/exercises/squats.mp4', '/images/exercises/squats/main.jpg',
3, 15, 300, 60, 8.0,
JSON_ARRAY('Keep chest up', 'Knees track over toes'), TRUE, 1, NOW(), NOW());

-- 3. Plank
INSERT IGNORE INTO exercises (name, slug, description, category, difficulty, muscleGroups, primaryMuscles, secondaryMuscles, equipment, instructions, videoUrl, imageUrl, sets, reps, duration, restTime, caloriesBurnedPerMinute, tips, isActive, createdBy, createdAt, updatedAt)
VALUES ('Plank', 'plank', 'Core stability and strength builder', 'strength', 'beginner',
JSON_ARRAY('core'), JSON_ARRAY('abs', 'core'), JSON_ARRAY('shoulders', 'back'),
JSON_ARRAY('none'),
JSON_ARRAY('Forearms on ground', 'Body in straight line', 'Hold position'),
'/videos/exercises/plank.mp4', '/images/exercises/plank/main.jpg',
3, 1, 60, 45, 5.0,
JSON_ARRAY('Keep hips level', 'Breathe normally'), TRUE, 1, NOW(), NOW());

-- 4. Lunges
INSERT IGNORE INTO exercises (name, slug, description, category, difficulty, muscleGroups, primaryMuscles, secondaryMuscles, equipment, instructions, videoUrl, imageUrl, sets, reps, duration, restTime, caloriesBurnedPerMinute, tips, isActive, createdBy, createdAt, updatedAt)
VALUES ('Lunges', 'lunges', 'Single-leg strength and balance', 'strength', 'beginner',
JSON_ARRAY('legs', 'glutes'), JSON_ARRAY('quadriceps', 'glutes'), JSON_ARRAY('hamstrings'),
JSON_ARRAY('none'),
JSON_ARRAY('Step forward', 'Lower hips until both knees at 90 degrees', 'Push back to start'),
'/videos/exercises/lunges.mp4', '/images/exercises/lunges/main.jpg',
3, 10, 300, 60, 7.0,
JSON_ARRAY('Keep front knee over ankle', 'Stay upright'), TRUE, 1, NOW(), NOW());

-- 5. Burpees
INSERT IGNORE INTO exercises (name, slug, description, category, difficulty, muscleGroups, primaryMuscles, secondaryMuscles, equipment, instructions, videoUrl, imageUrl, sets, reps, duration, restTime, caloriesBurnedPerMinute, tips, isActive, createdBy, createdAt, updatedAt)
VALUES ('Burpees', 'burpees', 'Full body explosive cardio', 'hiit', 'intermediate',
JSON_ARRAY('full_body'), JSON_ARRAY('legs', 'chest'), JSON_ARRAY('core', 'arms'),
JSON_ARRAY('none'),
JSON_ARRAY('Drop to squat', 'Jump feet back', 'Do push-up', 'Jump feet forward', 'Jump up'),
'/videos/exercises/burpees.mp4', '/images/exercises/burpees/main.jpg',
3, 10, 300, 90, 12.0,
JSON_ARRAY('Maintain form', 'Breathe consistently'), TRUE, 1, NOW(), NOW());

-- 6. Mountain Climbers
INSERT IGNORE INTO exercises (name, slug, description, category, difficulty, muscleGroups, primaryMuscles, secondaryMuscles, equipment, instructions, videoUrl, imageUrl, sets, reps, duration, restTime, caloriesBurnedPerMinute, tips, isActive, createdBy, createdAt, updatedAt)
VALUES ('Mountain Climbers', 'mountain-climbers', 'Dynamic cardio core exercise', 'cardio', 'intermediate',
JSON_ARRAY('core', 'legs'), JSON_ARRAY('abs', 'hip_flexors'), JSON_ARRAY('shoulders'),
JSON_ARRAY('none'),
JSON_ARRAY('Start in plank', 'Drive knee to chest', 'Quickly switch legs'),
'/videos/exercises/mountain-climbers.mp4', '/images/exercises/mountain-climbers/main.jpg',
3, 20, 180, 60, 10.0,
JSON_ARRAY('Keep hips level', 'Start slow'), TRUE, 1, NOW(), NOW());

-- 7. Dumbbell Bench Press
INSERT IGNORE INTO exercises (name, slug, description, category, difficulty, muscleGroups, primaryMuscles, secondaryMuscles, equipment, instructions, videoUrl, imageUrl, sets, reps, duration, restTime, caloriesBurnedPerMinute, tips, isActive, createdBy, createdAt, updatedAt)
VALUES ('Dumbbell Bench Press', 'dumbbell-bench-press', 'Chest builder with dumbbells', 'strength', 'intermediate',
JSON_ARRAY('chest', 'triceps'), JSON_ARRAY('pectorals'), JSON_ARRAY('triceps', 'shoulders'),
JSON_ARRAY('dumbbells', 'bench'),
JSON_ARRAY('Lie on bench', 'Press dumbbells up', 'Lower with control'),
'/videos/exercises/dumbbell-bench-press.mp4', '/images/exercises/dumbbell-bench-press/main.jpg',
4, 10, 300, 90, 6.0,
JSON_ARRAY('Feet flat on floor', 'Control the weight'), TRUE, 1, NOW(), NOW());

-- 8. Deadlifts
INSERT IGNORE INTO exercises (name, slug, description, category, difficulty, muscleGroups, primaryMuscles, secondaryMuscles, equipment, instructions, videoUrl, imageUrl, sets, reps, duration, restTime, caloriesBurnedPerMinute, tips, isActive, createdBy, createdAt, updatedAt)
VALUES ('Deadlifts', 'deadlifts', 'King of compound exercises', 'strength', 'advanced',
JSON_ARRAY('back', 'legs', 'glutes'), JSON_ARRAY('erector_spinae', 'glutes', 'hamstrings'), JSON_ARRAY('core', 'forearms'),
JSON_ARRAY('barbell'),
JSON_ARRAY('Bar over mid-foot', 'Bend and grip bar', 'Keep back straight', 'Lift by extending hips'),
'/videos/exercises/deadlifts.mp4', '/images/exercises/deadlifts/main.jpg',
4, 8, 300, 120, 8.5,
JSON_ARRAY('Keep bar close', 'Don''t round back'), TRUE, 1, NOW(), NOW());

-- 9. Pull-ups
INSERT IGNORE INTO exercises (name, slug, description, category, difficulty, muscleGroups, primaryMuscles, secondaryMuscles, equipment, instructions, videoUrl, imageUrl, sets, reps, duration, restTime, caloriesBurnedPerMinute, tips, isActive, createdBy, createdAt, updatedAt)
VALUES ('Pull-ups', 'pull-ups', 'Back and bicep bodyweight exercise', 'strength', 'intermediate',
JSON_ARRAY('back', 'biceps'), JSON_ARRAY('lats', 'upper_back'), JSON_ARRAY('biceps', 'forearms'),
JSON_ARRAY('pull_up_bar'),
JSON_ARRAY('Hang from bar', 'Pull up until chin over bar', 'Lower with control'),
'/videos/exercises/pull-ups.mp4', '/images/exercises/pull-ups/main.jpg',
3, 8, 240, 90, 7.0,
JSON_ARRAY('Engage lats', 'Avoid swinging'), TRUE, 1, NOW(), NOW());

-- 10. Bicycle Crunches
INSERT IGNORE INTO exercises (name, slug, description, category, difficulty, muscleGroups, primaryMuscles, secondaryMuscles, equipment, instructions, videoUrl, imageUrl, sets, reps, duration, restTime, caloriesBurnedPerMinute, tips, isActive, createdBy, createdAt, updatedAt)  
VALUES ('Bicycle Crunches', 'bicycle-crunches', 'Rotational abs exercise', 'strength', 'beginner',
JSON_ARRAY('core', 'abs'), JSON_ARRAY('abs', 'obliques'), JSON_ARRAY(),
JSON_ARRAY('none'),
JSON_ARRAY('Lie on back', 'Rotate elbow to opposite knee', 'Alternate sides'),
'/videos/exercises/bicycle-crunches.mp4', '/images/exercises/bicycle-crunches/main.jpg',
3, 20, 180, 45, 6.0,
JSON_ARRAY('Don''t pull neck', 'Focus on rotation'), TRUE, 1, NOW(), NOW());

-- 11. Jumping Jacks
INSERT IGNORE INTO exercises (name, slug, description, category, difficulty, muscleGroups, primaryMuscles, secondaryMuscles, equipment, instructions, videoUrl, imageUrl, sets, reps, duration, restTime, caloriesBurnedPerMinute, tips, isActive, createdBy, createdAt, updatedAt)
VALUES ('Jumping Jacks', 'jumping-jacks', 'Classic cardio warmup', 'cardio', 'beginner',
JSON_ARRAY('full_body'), JSON_ARRAY('legs'), JSON_ARRAY('shoulders', 'core'),
JSON_ARRAY('none'),
JSON_ARRAY('Start feet together', 'Jump feet apart, raise arms', 'Return to start'),
'/videos/exercises/jumping-jacks.mp4', '/images/exercises/jumping-jacks/main.jpg',
3, 30, 180, 30, 8.0,
JSON_ARRAY('Land softly', 'Steady rhythm'), TRUE, 1, NOW(), NOW());

-- 12. Dumbbell Rows
INSERT IGNORE INTO exercises (name, slug, description, category, difficulty, muscleGroups, primaryMuscles, secondaryMuscles, equipment, instructions, videoUrl, imageUrl, sets, reps, duration, restTime, caloriesBurnedPerMinute, tips, isActive, createdBy, createdAt, updatedAt)
VALUES ('Dumbbell Rows', 'dumbbell-rows', 'Unilateral back exercise', 'strength', 'intermediate',
JSON_ARRAY('back'), JSON_ARRAY('lats', 'rhomboids'), JSON_ARRAY('biceps', 'rear_delts'),
JSON_ARRAY('dumbbells', 'bench'),
JSON_ARRAY('Knee and hand on bench', 'Pull dumbbell to hip', 'Lower with control'),
'/videos/exercises/dumbbell-rows.mp4', '/images/exercises/dumbbell-rows/main.jpg',
4, 12, 300, 75, 6.5,
JSON_ARRAY('Keep back flat', 'Pull with back not arm'), TRUE, 1, NOW(), NOW());

-- 13. Barbell Back Squat
INSERT IGNORE INTO exercises (name, slug, description, category, difficulty, muscleGroups, primaryMuscles, secondaryMuscles, equipment, instructions, videoUrl, imageUrl, sets, reps, duration, restTime, caloriesBurnedPerMinute, tips, isActive, createdBy, createdAt, updatedAt)
VALUES ('Barbell Back Squat', 'barbell-back-squat', 'King of leg exercises', 'strength', 'intermediate',
JSON_ARRAY('legs', 'glutes'), JSON_ARRAY('quadriceps', 'glutes'), JSON_ARRAY('hamstrings', 'core'),
JSON_ARRAY('barbell', 'squat_rack'),
JSON_ARRAY('Bar on upper back', 'Feet shoulder-width', 'Descend keeping chest up', 'Drive through heels'),
'/videos/exercises/barbell-back-squat.mp4', '/images/exercises/barbell-back-squat/main.jpg',
4, 10, 360, 120, 9.5,
JSON_ARRAY('Push knees out', 'Keep weight on heels'), TRUE, 1, NOW(), NOW());

-- 14. Brisk Walking
INSERT IGNORE INTO exercises (name, slug, description, category, difficulty, muscleGroups, primaryMuscles, secondaryMuscles, equipment, instructions, videoUrl, imageUrl, sets, reps, duration, restTime, caloriesBurnedPerMinute, tips, isActive, createdBy, createdAt, updatedAt)
VALUES ('Brisk Walking', 'brisk-walking', 'Low-impact cardio for all levels', 'cardio', 'beginner',
JSON_ARRAY('legs'), JSON_ARRAY('legs', 'glutes'), JSON_ARRAY('core'),
JSON_ARRAY('none'),
JSON_ARRAY('Stand tall', 'Swing arms naturally', 'Maintain steady pace'),
'/videos/exercises/brisk-walking.mp4', '/images/exercises/brisk-walking/main.jpg',
1, 0, 1800, 0, 4.5,
JSON_ARRAY('Use comfortable shoes', 'Gradually increase duration'), TRUE, 1, NOW(), NOW());

-- 15. Dumbbell Bicep Curls
INSERT IGNORE INTO exercises (name, slug, description, category, difficulty, muscleGroups, primaryMuscles, secondaryMuscles, equipment, instructions, videoUrl, imageUrl, sets, reps, duration, restTime, caloriesBurnedPerMinute, tips, isActive, createdBy, createdAt, updatedAt)
VALUES ('Dumbbell Bicep Curls', 'dumbbell-bicep-curls', 'Isolation bicep builder', 'strength', 'beginner',
JSON_ARRAY('arms', 'biceps'), JSON_ARRAY('biceps'), JSON_ARRAY('forearms'),
JSON_ARRAY('dumbbells'),
JSON_ARRAY('Stand with dumbbells at sides', 'Curl to shoulders', 'Lower with control'),
'/videos/exercises/dumbbell-bicep-curls.mp4', '/images/exercises/dumbbell-bicep-curls/main.jpg',
3, 12, 240, 60, 4.0,
JSON_ARRAY('Keep elbows stationary', 'Don''t swing'), TRUE, 1, NOW(), NOW());

-- 16. Lat Pulldown
INSERT IGNORE INTO exercises (name, slug, description, category, difficulty, muscleGroups, primaryMuscles, secondaryMuscles, equipment, instructions, videoUrl, imageUrl, sets, reps, duration, restTime, caloriesBurnedPerMinute, tips, isActive, createdBy, createdAt, updatedAt)
VALUES ('Lat Pulldown', 'lat-pulldown', 'Machine lat developer', 'strength', 'beginner',
JSON_ARRAY('back'), JSON_ARRAY('lats', 'upper_back'), JSON_ARRAY('biceps', 'rear_delts'),
JSON_ARRAY('lat_pulldown_machine'),
JSON_ARRAY('Sit at machine', 'Grip bar wide', 'Pull to upper chest', 'Return with control'),
'/videos/exercises/lat-pulldown.mp4', '/images/exercises/lat-pulldown/main.jpg',
4, 12, 300, 60, 5.5,
JSON_ARRAY('Pull elbows down', 'Engage lats'), TRUE, 1, NOW(), NOW());

-- 17. Leg Press
INSERT IGNORE INTO exercises (name, slug, description, category, difficulty, muscleGroups, primaryMuscles, secondaryMuscles, equipment, instructions, videoUrl, imageUrl, sets, reps, duration, restTime, caloriesBurnedPerMinute, tips, isActive, createdBy, createdAt, updatedAt)
VALUES ('Leg Press', 'leg-press', 'Machine leg builder', 'strength', 'beginner',
JSON_ARRAY('legs'), JSON_ARRAY('quadriceps', 'glutes'), JSON_ARRAY('hamstrings'),
JSON_ARRAY('leg_press_machine'),
JSON_ARRAY('Sit in machine', 'Feet shoulder-width on platform', 'Lower to 90 degrees', 'Push through heels'),
'/videos/exercises/leg-press.mp4', '/images/exercises/leg-press/main.jpg',
4, 12, 300, 90, 6.5,
JSON_ARRAY('Keep back pressed to pad', 'Don''t lock knees'), TRUE, 1, NOW(), NOW());

-- 18. Bench Dips
INSERT IGNORE INTO exercises (name, slug, description, category, difficulty, muscleGroups, primaryMuscles, secondaryMuscles, equipment, instructions, videoUrl, imageUrl, sets, reps, duration, restTime, caloriesBurnedPerMinute, tips, isActive, createdBy, createdAt, updatedAt)
VALUES ('Bench Dips', 'bench-dips', 'Bodyweight tricep exercise', 'strength', 'beginner',
JSON_ARRAY('arms', 'triceps'), JSON_ARRAY('triceps'), JSON_ARRAY('chest', 'shoulders'),
JSON_ARRAY('bench'),
JSON_ARRAY('Hands on bench behind you', 'Lower body by bending elbows', 'Push back up'),
'/videos/exercises/bench-dips.mp4', '/images/exercises/bench-dips/main.jpg',
3, 12, 180, 60, 5.0,
JSON_ARRAY('Keep elbows close', 'Don''t go too deep'), TRUE, 1, NOW(), NOW());

-- 19. Rowing Machine
INSERT IGNORE INTO exercises (name, slug, description, category, difficulty, muscleGroups, primaryMuscles, secondaryMuscles, equipment, instructions, videoUrl, imageUrl, sets, reps, duration, restTime, caloriesBurnedPerMinute, tips, isActive, createdBy, createdAt, updatedAt)
VALUES ('Rowing Machine', 'rowing-machine', 'Full body cardio', 'cardio', 'intermediate',
JSON_ARRAY('back', 'legs'), JSON_ARRAY('back', 'legs'), JSON_ARRAY('arms', 'core'),
JSON_ARRAY('rowing_machine'),
JSON_ARRAY('Secure feet', 'Push with legs first', 'Pull handle to chest', 'Reverse with control'),
'/videos/exercises/rowing-machine.mp4', '/images/exercises/rowing-machine/main.jpg',
1, 0, 1200, 0, 10.0,
JSON_ARRAY('Legs core then arms', 'Smooth strokes'), TRUE, 1, NOW(), NOW());

-- 20. Chair Sit-to-Stand
INSERT IGNORE INTO exercises (name, slug, description, category, difficulty, muscleGroups, primaryMuscles, secondaryMuscles, equipment, instructions, videoUrl, imageUrl, sets, reps, duration, restTime, caloriesBurnedPerMinute, tips, isActive, createdBy, createdAt, updatedAt)
VALUES ('Chair Sit-to-Stand', 'chair-sit-to-stand', 'Functional exercise for seniors', 'balance', 'beginner',
JSON_ARRAY('legs'), JSON_ARRAY('quadriceps', 'glutes'), JSON_ARRAY('core'),
JSON_ARRAY('chair'),
JSON_ARRAY('Sit on chair edge', 'Lean forward from hips', 'Push through heels to stand', 'Lower with control'),
'/videos/exercises/chair-sit-to-stand.mp4', '/images/exercises/chair-sit-to-stand/main.jpg',
3, 10, 180, 60, 3.5,
JSON_ARRAY('Use arms if needed', 'Controlled movement'), TRUE, 1, NOW(), NOW());

-- 21. Russian Twists
INSERT IGNORE INTO exercises (name, slug, description, category, difficulty, muscleGroups, primaryMuscles, secondaryMuscles, equipment, instructions, videoUrl, imageUrl, sets, reps, duration, restTime, caloriesBurnedPerMinute, tips, isActive, createdBy, createdAt, updatedAt)
VALUES ('Russian Twists', 'russian-twists', 'Rotational core strengthener', 'strength', 'intermediate',
JSON_ARRAY('core', 'obliques'), JSON_ARRAY('obliques', 'abs'), JSON_ARRAY(),
JSON_ARRAY('none'),
JSON_ARRAY('Sit with knees bent', 'Lean back slightly', 'Rotate torso side to side', 'Touch floor beside hip'),
'/videos/exercises/russian-twists.mp4', '/images/exercises/russian-twists/main.jpg',
3, 20, 180, 45, 5.5,
JSON_ARRAY('Keep core engaged', 'Control rotation'), TRUE, 1, NOW(), NOW());

-- 22. Conventional Deadlift
INSERT IGNORE INTO exercises (name, slug, description, category, difficulty, muscleGroups, primaryMuscles, secondaryMuscles, equipment, instructions, videoUrl, imageUrl, sets, reps, duration, restTime, caloriesBurnedPerMinute, tips, isActive, createdBy, createdAt, updatedAt)
VALUES ('Conventional Deadlift', 'conventional-deadlift', 'Classic powerlifting deadlift', 'strength', 'advanced',
JSON_ARRAY('back', 'legs'), JSON_ARRAY('erector_spinae', 'glutes', 'hamstrings'), JSON_ARRAY('traps', 'forearms'),
JSON_ARRAY('barbell'),
JSON_ARRAY('Feet hip-width', 'Grip bar outside legs', 'Keep back flat', 'Drive through heels'),
'/videos/exercises/conventional-deadlift.mp4', '/images/exercises/conventional-deadlift/main.jpg',
5, 5, 300, 180, 8.5,
JSON_ARRAY('Bar stays close to legs', 'Engage lats'), TRUE, 1, NOW(), NOW());

-- 23. Glute Bridges
INSERT IGNORE INTO exercises (name, slug, description, category, difficulty, muscleGroups, primaryMuscles, secondaryMuscles, equipment, instructions, videoUrl, imageUrl, sets, reps, duration, restTime, caloriesBurnedPerMinute, tips, isActive, createdBy, createdAt, updatedAt)
VALUES ('Glute Bridges', 'glute-bridges', 'Glute activation and strengthening', 'strength', 'beginner',
JSON_ARRAY('glutes'), JSON_ARRAY('glutes'), JSON_ARRAY('hamstrings', 'core'),
JSON_ARRAY('none'),
JSON_ARRAY('Lie on back, knees bent', 'Lift hips toward ceiling', 'Squeeze glutes at top', 'Lower with control'),
'/videos/exercises/glute-bridges.mp4', '/images/exercises/glute-bridges/main.jpg',
3, 15, 240, 60, 5.0,
JSON_ARRAY('Squeeze glutes at top', 'Don''t arch lower back'), TRUE, 1, NOW(), NOW());

-- 24. High Knees
INSERT IGNORE INTO exercises (name, slug, description, category, difficulty, muscleGroups, primaryMuscles, secondaryMuscles, equipment, instructions, videoUrl, imageUrl, sets, reps, duration, restTime, caloriesBurnedPerMinute, tips, isActive, createdBy, createdAt, updatedAt)
VALUES ('High Knees', 'high-knees', 'Cardio leg driver', 'cardio', 'intermediate',
JSON_ARRAY('legs'), JSON_ARRAY('hip_flexors', 'legs'), JSON_ARRAY('core'),
JSON_ARRAY('none'),
JSON_ARRAY('Stand tall', 'Drive knees up to chest height', 'Pump arms', 'Quick pace'),
'/videos/exercises/high-knees.mp4', '/images/exercises/high-knees/main.jpg',
3, 30, 180, 45, 9.0,
JSON_ARRAY('Stay on balls of feet', 'Drive knees high'), TRUE, 1, NOW(), NOW());

-- 25. Leg Raises
INSERT IGNORE INTO exercises (name, slug, description, category, difficulty, muscleGroups, primaryMuscles, secondaryMuscles, equipment, instructions, videoUrl, imageUrl, sets, reps, duration, restTime, caloriesBurnedPerMinute, tips, isActive, createdBy, createdAt, updatedAt)
VALUES ('Leg Raises', 'leg-raises', 'Lower ab targeter', 'strength', 'intermediate',
JSON_ARRAY('core', 'abs'), JSON_ARRAY('lower_abs'), JSON_ARRAY('hip_flexors'),
JSON_ARRAY('none'),
JSON_ARRAY('Lie on back', 'Legs straight', 'Raise legs to 90 degrees', 'Lower with control'),
'/videos/exercises/leg-raises.mp4', '/images/exercises/leg-raises/main.jpg',
3, 12, 180, 60, 4.5,
JSON_ARRAY('Keep lower back pressed down', 'Control the movement'), TRUE, 1, NOW(), NOW());

-- 26. Shoulder Press
INSERT IGNORE INTO exercises (name, slug, description, category, difficulty, muscleGroups, primaryMuscles, secondaryMuscles, equipment, instructions, videoUrl, imageUrl, sets, reps, duration, restTime, caloriesBurnedPerMinute, tips, isActive, createdBy, createdAt, updatedAt)
VALUES ('Shoulder Press', 'shoulder-press', 'Overhead pressing for deltoids', 'strength', 'intermediate',
JSON_ARRAY('shoulders'), JSON_ARRAY('deltoids'), JSON_ARRAY('triceps', 'upper_chest'),
JSON_ARRAY('dumbbells'),
JSON_ARRAY('Dumbbells at shoulder height', 'Press overhead', 'Lower with control'),
'/videos/exercises/shoulder-press.mp4', '/images/exercises/shoulder-press/main.jpg',
4, 10, 300, 75, 5.5,
JSON_ARRAY('Keep core tight', 'Don''t arch back excessively'), TRUE, 1, NOW(), NOW());

-- 27. Superman Hold
INSERT IGNORE INTO exercises (name, slug, description, category, difficulty, muscleGroups, primaryMuscles, secondaryMuscles, equipment, instructions, videoUrl, imageUrl, sets, reps, duration, restTime, caloriesBurnedPerMinute, tips, isActive, createdBy, createdAt, updatedAt)
VALUES ('Superman Hold', 'superman-hold', 'Lower back strengthener', 'strength', 'beginner',
JSON_ARRAY('back', 'core'), JSON_ARRAY('erector_spinae', 'lower_back'), JSON_ARRAY('glutes'),
JSON_ARRAY('none'),
JSON_ARRAY('Lie face down', 'Lift arms and legs off ground', 'Hold position', 'Lower with control'),
'/videos/exercises/superman-hold.mp4', '/images/exercises/superman-hold/main.jpg',
3, 1, 30, 45, 3.5,
JSON_ARRAY('Keep neck neutral', 'Hold steady'), TRUE, 1, NOW(), NOW());

-- 28. Tricep Dips
INSERT IGNORE INTO exercises (name, slug, description, category, difficulty, muscleGroups, primaryMuscles, secondaryMuscles, equipment, instructions, videoUrl, imageUrl, sets, reps, duration, restTime, caloriesBurnedPerMinute, tips, isActive, createdBy, createdAt, updatedAt)
VALUES ('Tricep Dips', 'tricep-dips', 'Advanced tricep builder', 'strength', 'intermediate',
JSON_ARRAY('triceps'), JSON_ARRAY('triceps'), JSON_ARRAY('chest', 'shoulders'),
JSON_ARRAY('parallel_bars'),
JSON_ARRAY('Hands on parallel bars', 'Lower body by bending elbows', 'Push back up'),
'/videos/exercises/tricep-dips.mp4', '/images/exercises/tricep-dips/main.jpg',
3, 10, 240, 75, 6.0,
JSON_ARRAY('Keep elbows close', 'Lean forward slightly'), TRUE, 1, NOW(), NOW());

-- 29. Box Jumps
INSERT IGNORE INTO exercises (name, slug, description, category, difficulty, muscleGroups, primaryMuscles, secondaryMuscles, equipment, instructions, videoUrl, imageUrl, sets, reps, duration, restTime, caloriesBurnedPerMinute, tips, isActive, createdBy, createdAt, updatedAt)
VALUES ('Box Jumps', 'box-jumps', 'Explosive plyometric exercise', 'plyometric', 'intermediate',
JSON_ARRAY('legs'), JSON_ARRAY('quadriceps', 'glutes'), JSON_ARRAY('calves'),
JSON_ARRAY('plyo_box'),
JSON_ARRAY('Stand facing box', 'Swing arms and explode up', 'Land softly on box', 'Step down'),
'/videos/exercises/box-jumps.mp4', '/images/exercises/box-jumps/main.jpg',
3, 8, 240, 90, 11.0,
JSON_ARRAY('Land softly', 'Full hip extension at top'), TRUE, 1, NOW(), NOW());

-- Verify insertion
SELECT COUNT(*) as total_exercises, COUNT(DISTINCT category) as categories 
FROM exercises WHERE createdBy = 1;

SELECT 'Successfully seeded 29 exercises!' AS Status;
