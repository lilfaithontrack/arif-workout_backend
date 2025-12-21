-- ============================================
-- Badge System Seed Data
-- Initial achievement badges
-- ============================================

-- Workout Milestones
INSERT IGNORE INTO badges (name, slug, description, icon, category, requirement, points, displayOrder, isActive, createdBy, createdAt, updatedAt)
VALUES 
('First Workout', 'first-workout', 'Complete your first workout', '🎯', 'milestone', JSON_OBJECT('type', 'workout_count', 'value', 1), 10, 1, TRUE, 1, NOW(), NOW()),
('10 Workouts', '10-workouts', 'Complete 10 total workouts', '💪', 'workout', JSON_OBJECT('type', 'workout_count', 'value', 10), 25, 2, TRUE, 1, NOW(), NOW()),
('30 Workouts', '30-workouts', 'Complete 30 total workouts', '🏆', 'workout', JSON_OBJECT('type', 'workout_count', 'value', 30), 50, 3, TRUE, 1, NOW(), NOW()),
('50 Workouts', '50-workouts', 'Complete 50 total workouts', '⭐', 'milestone', JSON_OBJECT('type', 'workout_count', 'value', 50), 100, 4, TRUE, 1, NOW(), NOW()),
('100 Workouts', '100-workouts', 'Complete 100 total workouts', '👑', 'milestone', JSON_OBJECT('type', 'workout_count', 'value', 100), 200, 5, TRUE, 1, NOW(), NOW()),

-- Streak Badges
('3 Day Streak', '3-day-streak', 'Workout for 3 consecutive days', '🔥', 'streak', JSON_OBJECT('type', 'streak_days', 'value', 3), 15, 10, TRUE, 1, NOW(), NOW()),
('7 Day Streak', '7-day-streak', 'Workout for 7 consecutive days', '🔥🔥', 'streak', JSON_OBJECT('type', 'streak_days', 'value', 7), 35, 11, TRUE, 1, NOW(), NOW()),
('14 Day Streak', '14-day-streak', 'Workout for 14 consecutive days', '🔥🔥🔥', 'streak', JSON_OBJECT('type', 'streak_days', 'value', 14), 75, 12, TRUE, 1, NOW(), NOW()),
('30 Day Streak', '30-day-streak', 'Workout for 30 consecutive days', '🌟', 'streak', JSON_OBJECT('type', 'streak_days', 'value', 30), 150, 13, TRUE, 1, NOW(), NOW()),

-- Category Specific
('Strength Master', 'strength-master', 'Complete 50 strength workouts', '🏋️', 'strength', JSON_OBJECT('type', 'category_count', 'value', 50, 'category', 'strength'), 100, 20, TRUE, 1, NOW(), NOW()),
('Cardio King', 'cardio-king', 'Complete 50 cardio workouts', '🏃', 'cardio', JSON_OBJECT('type', 'category_count', 'value', 50, 'category', 'cardio'), 100, 21, TRUE, 1, NOW(), NOW()),
('Cardio Champion', 'cardio-champion', 'Complete 100 cardio workouts', '🏃‍♂️💨', 'cardio', JSON_OBJECT('type', 'category_count', 'value', 100, 'category', 'cardio'), 200, 22, TRUE, 1, NOW(), NOW()),
('Endurance Expert', 'endurance-expert', 'Complete 30 endurance workouts', '⚡', 'endurance', JSON_OBJECT('type', 'category_count', 'value', 30, 'category', 'endurance'), 75, 23, TRUE, 1, NOW(), NOW()),

-- Time-Based
('Early Bird', 'early-bird', 'Complete 10 morning workouts', '🌅', 'special', JSON_OBJECT('type', 'time_based', 'value', 10, 'time', 'morning'), 50, 30, TRUE, 1, NOW(), NOW()),
('Night Owl', 'night-owl', 'Complete 10 evening workouts', '🌙', 'special', JSON_OBJECT('type', 'time_based', 'value', 10, 'time', 'evening'), 50, 31, TRUE, 1, NOW(), NOW()),

-- Special Achievements
('Consistency King', 'consistency-king', 'Workout 5 days in a week', '🌈', 'special', JSON_OBJECT('type', 'weekly_consistency', 'value', 5), 100, 40, TRUE, 1, NOW(), NOW()),
('Weekend Warrior', 'weekend-warrior', 'Complete 10 weekend workouts', '⚔️', 'special', JSON_OBJECT('type', 'weekend_count', 'value', 10), 50, 41, TRUE, 1, NOW(), NOW()),
('Perfect Week', 'perfect-week', 'Workout every day for a week', '✨', 'special', JSON_OBJECT('type', 'perfect_week', 'value', 7), 200, 42, TRUE, 1, NOW(), NOW());

-- Verify insertion
SELECT category, COUNT(*) as badge_count 
FROM badges 
GROUP BY category
ORDER BY category;

SELECT 'Successfully seeded 18 achievement badges!' AS Status;
