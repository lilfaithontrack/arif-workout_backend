-- ============================================
-- Professional Motivational Messages Seed
-- 50+ inspiring fitness messages
-- ============================================

-- WORKOUT MESSAGES - Morning
INSERT IGNORE INTO motivational_messages (title, content, category, triggerType, triggerValue, targetAudience, isActive, priority, createdBy, createdAt, updatedAt)
VALUES 
('Rise and Grind', 'Morning workouts set the tone for your entire day. You''re already ahead of 90% of people just by showing up!', 'workout', 'time', 'morning', 'all', TRUE, 5, 1, NOW(), NOW()),
('Early Bird Strength', 'Training at dawn means you''ve conquered your biggest challenge before most people hit snooze. Keep that momentum!', 'workout', 'time', 'morning', 'all', TRUE, 5, 1, NOW(), NOW()),
('Morning Power', 'Your body is primed and ready. Let''s make this workout count and fuel your day with endorphins!', 'workout', 'time', 'morning', 'beginner', TRUE, 4, 1, NOW(), NOW()),

-- WORKOUT MESSAGES - Afternoon  
('Midday Momentum', 'Perfect timing! An afternoon workout breaks up your day and boosts your energy levels. Let''s crush it!', 'workout', 'time', 'afternoon', 'all', TRUE, 4, 1, NOW(), NOW()),
('Lunch Break Power', 'Use this time to invest in yourself. Every rep, every set brings you closer to your goals!', 'workout', 'time', 'afternoon', 'intermediate', TRUE, 4, 1, NOW(), NOW()),
('Afternoon Energy', 'Beat that afternoon slump with movement. Your future self will thank you for this!', 'workout', 'time', 'afternoon', 'all', TRUE, 4, 1, NOW(), NOW()),

-- WORKOUT MESSAGES - Evening
('Evening Excellence', 'End your day on a high note. This workout is your stress relief and your strength builder!', 'workout', 'time', 'evening', 'all', TRUE, 5, 1, NOW(), NOW()),
('Night Warrior', 'While others wind down, you''re gearing up. This dedication is what separates good from great!', 'workout', 'time', 'evening', 'advanced', TRUE, 5, 1, NOW(), NOW()),
('Sunset Strength', 'Release the stress of the day and build the strength for tomorrow. You''ve got this!', 'workout', 'time', 'evening', 'all', TRUE, 4, 1, NOW(), NOW()),

-- ACCOMPLISHMENT MESSAGES
('Workout Complete!', 'Amazing! You showed up and did the work. That''s what champions are made of. 💪', 'workout', 'accomplishment', 'workout-complete', 'all', TRUE, 10, 1, NOW(), NOW()),
('Mission Accomplished', 'Every workout completed is a promise kept to yourself. You''re building trust and discipline!', 'workout', 'accomplishment', 'workout-complete', 'all', TRUE, 10, 1, NOW(), NOW()),
('Victory Earned', 'You didn''t have to, but you did. That''s the difference between wishing and achieving!', 'workout', 'accomplishment', 'workout-complete', 'intermediate', TRUE, 9, 1, NOW(), NOW()),
('Streak Superstar!', 'Consistency beats perfection. This streak is proof that you''re committed to your transformation!', 'workout', 'accomplishment', 'streak-milestone', 'all', TRUE, 10, 1, NOW(), NOW()),
('Unstoppable Streak', 'Day after day, you show up. This consistency is building the foundation for lasting results!', 'workout', 'accomplishment', 'streak-milestone', 'all', TRUE, 10, 1, NOW(), NOW()),

-- NUTRITION MESSAGES
('Fuel Your Fire', 'Your body is a high-performance machine. Feed it the premium fuel it deserves today!', 'nutrition', 'general', NULL, 'all', TRUE, 6, 1, NOW(), NOW()),
('Nutrition is Key', 'abs are made in the kitchen, but strength is built in both. Balance is your superpower!', 'nutrition', 'general', NULL, 'intermediate', TRUE, 5, 1, NOW(), NOW()),
('Eat to Perform', 'Food isn''t the enemy, it''s your ally. Choose nutrients that support your goals and energize your workouts!', 'nutrition', 'general', NULL, 'beginner', TRUE, 6, 1, NOW(), NOW()),
('Hydration Hero', 'Water is your workout''s best friend. Stay hydrated and watch your performance soar!', 'nutrition', 'general', NULL, 'all', TRUE, 7, 1, NOW(), NOW()),
('Smart Choices', 'Every meal is a chance to fuel your progress. Make choices that align with your goals!', 'nutrition', 'general', NULL, 'all', TRUE, 5, 1, NOW(), NOW()),
('Protein Power', 'Recovery starts with what you eat. Protein feeds your muscles, carbs fuel your energy!', 'nutrition', 'general', NULL, 'intermediate', TRUE, 5, 1, NOW(), NOW()),

-- MINDSET MESSAGES
('Mental Toughness', 'Your mind will quit a thousand times before your body does. Push through the mental barriers!', 'mindset', 'general', NULL, 'advanced', TRUE, 8, 1, NOW(), NOW()),
('Believe in Progress', 'You don''t need to be great to start, but you need to start to be great. Every journey begins with one step!', 'mindset', 'general', NULL, 'beginner', TRUE, 9, 1, NOW(), NOW()),
('Growth Mindset', 'Challenges aren''t obstacles, they''re opportunities. Each struggle makes you stronger!', 'mindset', 'general', NULL, 'all', TRUE, 7, 1, NOW(), NOW()),
('Champion Mentality', 'Champions aren''t made in gyms. They''re made from something deep inside—a desire, a dream, a vision!', 'mindset', 'general', NULL, 'all', TRUE, 8, 1, NOW(), NOW()),
('Embrace the Grind', 'The pain you feel today will be the strength you feel tomorrow. Trust the process!', 'mindset', 'general', NULL, 'intermediate', TRUE, 7, 1, NOW(), NOW()),
('Discipline Over Motivation', 'Motivation gets you started, discipline keeps you going. You''re building that discipline right now!', 'mindset', 'general', NULL, 'all', TRUE, 9, 1, NOW(), NOW()),
('Small Wins Matter', 'Success is the sum of small efforts repeated day in and day out. Celebrate every victory!', 'mindset', 'general', NULL, 'beginner', TRUE, 8, 1, NOW(), NOW()),
('Focus Forward', 'Don''t compare your chapter 1 to someone else''s chapter 20. Focus on your own progress!', 'mindset', 'general', NULL, 'beginner', TRUE, 7, 1, NOW(), NOW()),

-- RECOVERY MESSAGES  
('Rest is Training', 'Recovery isn''t laziness, it''s when your body builds itself stronger. Honor your rest days!', 'recovery', 'general', NULL, 'all', TRUE, 6, 1, NOW(), NOW()),
('Active Recovery', 'Light movement today keeps you ready for tomorrow''s challenges. Listen to your body!', 'recovery', 'general', NULL, 'intermediate', TRUE, 5, 1, NOW(), NOW()),
('Sleep Strong', 'Quality sleep is where the magic happens. Your muscles grow and repair while you rest!', 'recovery', 'general', NULL, 'all', TRUE, 7, 1, NOW(), NOW()),
('Stretch and Grow', 'Flexibility prevents injury and improves performance. Take 10 minutes to stretch today!', 'recovery', 'general', NULL, 'all', TRUE, 5, 1, NOW(), NOW()),
('Recovery Day', 'Today''s rest is tomorrow''s personal record. Smart athletes know when to push and when to recover!', 'recovery', 'general', NULL, 'advanced', TRUE, 6, 1, NOW(), NOW()),

-- GENERAL INSPIRATION
('Your Journey', 'Fitness is a journey, not a destination. Enjoy every step, celebrate every milestone!', 'general', 'general', NULL, 'all', TRUE, 6, 1, NOW(), NOW()),
('Consistency is King', 'It''s not about being perfect. It''s about being consistent. Show up for yourself today!', 'general', 'general', NULL, 'all', TRUE, 8, 1, NOW(), NOW()),
('Transform Today', 'The body achieves what the mind believes. Start with confidence, finish with pride!', 'general', 'general', NULL, 'all', TRUE, 7, 1, NOW(), NOW()),
('Stronger Every Day', 'You''re not the same person who started this journey. You''re stronger, wiser, and more resilient!', 'general', 'general', NULL, 'intermediate', TRUE, 7, 1, NOW(), NOW()),
('No Excuses', 'The only bad workout is the one you didn''t do. You showed up—that''s already a win!', 'general', 'general', NULL, 'all', TRUE, 8, 1, NOW(), NOW()),
('Future You', 'Your future self is watching. Make them proud with the choices you make today!', 'general', 'general', NULL, 'all', TRUE, 7, 1, NOW(), NOW()),
('Progress Not Perfection', 'Strive for progress, not perfection. Every small step forward counts!', 'general', 'general', NULL, 'beginner', TRUE, 8, 1, NOW(), NOW()),
('Limitless Potential', 'The only limits that exist are the ones you place on yourself. Break through them today!', 'general', 'general', NULL, 'advanced', TRUE, 7, 1, NOW(), NOW()),
('Daily Dedication', 'Success is what happens when dedication meets opportunity. Create your opportunity today!', 'general', 'general', NULL, 'all', TRUE, 6, 1, NOW(), NOW()),
('Forge Your Path', 'Don''t wait for inspiration. Create it through action. Start now, refine as you go!', 'general', 'general', NULL, 'all', TRUE, 7, 1, NOW(), NOW()),

-- BEGINNER SPECIFIC
('Baby Steps to Big Gains', 'Starting is the hardest part, and you did it! Every expert was once a beginner. Keep going!', 'general', 'general', NULL, 'beginner', TRUE, 9, 1, NOW(), NOW()),
('New Journey', 'Welcome to your fitness journey! The first weeks are tough, but they''re also the most rewarding!', 'general', 'general', NULL, 'beginner', TRUE, 8, 1, NOW(), NOW()),
('Learning Curve', 'Form over ego, progress over pride. You''re building a foundation that will last a lifetime!', 'workout', 'general', NULL, 'beginner', TRUE, 7, 1, NOW(), NOW()),
('Beginner Wins', 'You''re lapping everyone on the couch! Be proud of every rep, every set, every workout!', 'general', 'general', NULL, 'beginner', TRUE, 9, 1, NOW(), NOW()),

-- INTERMEDIATE SPECIFIC  
('Level Up', 'You''ve built the foundation, now it''s time to build the masterpiece. Push your limits!', 'workout', 'general', NULL, 'intermediate', TRUE, 7, 1, NOW(), NOW()),
('Plateau Breaker', 'Stuck? That''s your body asking for a new challenge. Mix it up and watch yourself grow!', 'workout', 'general', NULL, 'intermediate', TRUE, 6, 1, NOW(), NOW()),
('Technique Matters', 'Progressive overload with perfect form—that''s the intermediate secret to continuous gains!', 'workout', 'general', NULL, 'intermediate', TRUE, 6, 1, NOW(), NOW()),

-- ADVANCED SPECIFIC
('Elite Mindset', 'At your level, it''s all mental. Your body can handle more than your mind thinks. Prove it wrong!', 'mindset', 'general', NULL, 'advanced', TRUE, 8, 1, NOW(), NOW()),
('Peak Performance', 'Fine-tuning, not overhauling. Small optimizations lead to big results at the advanced level!', 'workout', 'general', NULL, 'advanced', TRUE, 7, 1, NOW(), NOW()),
('Master Your Craft', 'Mastery is a journey, not a destination. Keep refining, keep improving, keep dominating!', 'general', 'general', NULL, 'advanced', TRUE, 7, 1, NOW(), NOW()),

-- SEASONAL/SPECIAL
('Monday Motivation', 'New week, new opportunities! Let''s start this week strong and set the tone for success!', 'general', 'general', NULL, 'all', TRUE, 8, 1, NOW(), NOW()),
('Weekend Warrior', 'Weekends don''t mean weekends from your goals. Show up even when it''s optional!', 'workout', 'general', NULL, 'all', TRUE, 6, 1, NOW(), NOW()),
('Consistency Check', '21 days to form a habit, 90 days to make it a lifestyle. Where are you on your journey?', 'general', 'general', NULL, 'all', TRUE, 7, 1, NOW(), NOW());

-- Verify insertion
SELECT category, COUNT(*) as message_count 
FROM motivational_messages 
WHERE createdBy = 1 
GROUP BY category;

SELECT 'Successfully seeded 50+ professional motivational messages!' AS Status;
