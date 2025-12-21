-- Check indexes on all tables
-- Run this to see which tables have too many indexes

SELECT 
    TABLE_NAME,
    COUNT(DISTINCT INDEX_NAME) as index_count,
    GROUP_CONCAT(DISTINCT INDEX_NAME ORDER BY INDEX_NAME SEPARATOR ', ') as indexes
FROM 
    INFORMATION_SCHEMA.STATISTICS
WHERE 
    TABLE_SCHEMA = DATABASE()
    AND INDEX_NAME != 'PRIMARY'
GROUP BY 
    TABLE_NAME
HAVING 
    index_count > 10
ORDER BY 
    index_count DESC;

-- Show all indexes for users table specifically
SELECT 
    INDEX_NAME,
    COLUMN_NAME,
    NON_UNIQUE,
    SEQ_IN_INDEX
FROM 
    INFORMATION_SCHEMA.STATISTICS
WHERE 
    TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'users'
ORDER BY 
    INDEX_NAME, SEQ_IN_INDEX;
