-- ============================================
-- Badge Query Reference (MariaDB Compatible)
-- Various SQL queries to view and analyze badges
-- ============================================

-- 1. View ALL badges with full details
SELECT 
    id,
    name,
    slug,
    icon,
    description,
    category,
    CAST(requirement AS CHAR) as requirement_json,
    points,
    displayOrder,
    isActive,
    createdAt
FROM badges
ORDER BY displayOrder ASC, id ASC;

-- 2. View badges grouped by category
SELECT 
    category,
    COUNT(*) as badge_count,
    SUM(points) as total_points,
    GROUP_CONCAT(CONCAT(icon, ' ', name) SEPARATOR ', ') as badges
FROM badges
WHERE isActive = TRUE
GROUP BY category
ORDER BY badge_count DESC;

-- 3. View only ACTIVE badges (user-facing) - MariaDB Compatible
SELECT 
    id,
    CONCAT(icon, ' ', name) as badge_display,
    description,
    category,
    points,
    JSON_VALUE(requirement, '$.type') as requirement_type,
    JSON_VALUE(requirement, '$.value') as requirement_value
FROM badges
WHERE isActive = TRUE
ORDER BY displayOrder ASC, points ASC;

-- 4. View badges by point value (easiest to hardest)
SELECT 
    points,
    COUNT(*) as badge_count,
    GROUP_CONCAT(CONCAT(icon, ' ', name) SEPARATOR ', ') as badges
FROM badges
WHERE isActive = TRUE
GROUP BY points
ORDER BY points ASC;

-- 5. View MILESTONE badges only
SELECT 
    id,
    icon,
    name,
    description,
    points,
    JSON_VALUE(requirement, '$.value') as required_count
FROM badges
WHERE category = 'milestone' AND isActive = TRUE
ORDER BY CAST(JSON_VALUE(requirement, '$.value') AS UNSIGNED) ASC;

-- 6. View STREAK badges only
SELECT 
    id,
    icon,
    name,
    description,
    points,
    JSON_VALUE(requirement, '$.value') as days_required
FROM badges
WHERE category = 'streak' AND isActive = TRUE
ORDER BY CAST(JSON_VALUE(requirement, '$.value') AS UNSIGNED) ASC;

-- 7. View WORKOUT badges only
SELECT 
    id,
    icon,
    name,
    description,
    points,
    JSON_VALUE(requirement, '$.value') as workouts_required
FROM badges
WHERE category = 'workout' AND isActive = TRUE
ORDER BY CAST(JSON_VALUE(requirement, '$.value') AS UNSIGNED) ASC;

-- 8. View badges by requirement type
SELECT 
    JSON_VALUE(requirement, '$.type') as requirement_type,
    COUNT(*) as badge_count,
    AVG(points) as avg_points,
    GROUP_CONCAT(name SEPARATOR ', ') as badge_names
FROM badges
WHERE isActive = TRUE
GROUP BY JSON_VALUE(requirement, '$.type');

-- 9. Simple badge list for admin panel (matches your BadgesView)
SELECT 
    id,
    name,
    icon,
    description,
    category,
    points,
    isActive,
    displayOrder,
    createdAt
FROM badges
ORDER BY displayOrder ASC, createdAt DESC;

-- 10. Badge statistics summary
SELECT 
    COUNT(*) as total_badges,
    COUNT(CASE WHEN isActive = TRUE THEN 1 END) as active_badges,
    COUNT(CASE WHEN isActive = FALSE THEN 1 END) as inactive_badges,
    COUNT(DISTINCT category) as categories,
    MIN(points) as min_points,
    MAX(points) as max_points,
    AVG(points) as avg_points,
    SUM(points) as total_points_available
FROM badges;

-- 11. View badges with formatted requirement details - MariaDB Compatible
SELECT 
    id,
    CONCAT(icon, ' ', name) as badge,
    description,
    category,
    points,
    CASE JSON_VALUE(requirement, '$.type')
        WHEN 'workout_count' THEN CONCAT('Complete ', JSON_VALUE(requirement, '$.value'), ' workouts')
        WHEN 'streak_days' THEN CONCAT('Workout for ', JSON_VALUE(requirement, '$.value'), ' consecutive days')
        WHEN 'category_count' THEN CONCAT('Complete ', JSON_VALUE(requirement, '$.value'), ' ', JSON_VALUE(requirement, '$.category'), ' workouts')
        WHEN 'time_based' THEN CONCAT('Complete ', JSON_VALUE(requirement, '$.value'), ' ', JSON_VALUE(requirement, '$.time'), ' workouts')
        ELSE 'Custom requirement'
    END as requirement_description
FROM badges
WHERE isActive = TRUE
ORDER BY displayOrder ASC;

-- 12. Count badges by category (pie chart data)
SELECT 
    category,
    COUNT(*) as count,
    ROUND((COUNT(*) * 100.0 / (SELECT COUNT(*) FROM badges WHERE isActive = TRUE)), 2) as percentage
FROM badges
WHERE isActive = TRUE
GROUP BY category
ORDER BY count DESC;

-- 13. View recently added badges
SELECT 
    id,
    CONCAT(icon, ' ', name) as badge,
    category,
    points,
    createdAt,
    DATEDIFF(NOW(), createdAt) as days_old
FROM badges
ORDER BY createdAt DESC
LIMIT 10;

-- 14. Search badges by name (example)
SELECT 
    id,
    icon,
    name,
    description,
    category,
    points
FROM badges
WHERE name LIKE '%Workout%' OR description LIKE '%Workout%'
ORDER BY name;

-- 15. Export-friendly badge list (CSV-ready)
SELECT 
    name,
    description,
    icon,
    category,
    points,
    JSON_VALUE(requirement, '$.type') as req_type,
    JSON_VALUE(requirement, '$.value') as req_value,
    CASE WHEN isActive = TRUE THEN 'Yes' ELSE 'No' END as active
FROM badges
ORDER BY category, displayOrder;

-- BONUS: Simple view without JSON parsing (if JSON functions don't work)
SELECT 
    id,
    icon,
    name,
    description,
    category,
    points,
    CAST(requirement AS CHAR) as requirement,
    isActive
FROM badges
ORDER BY displayOrder ASC;
