# Database Setup Guide

This guide explains how to set up and sync the MySQL database for the Arif Workout platform, specifically for the workout and nutrition generator features.

## Prerequisites

- MySQL 8.0+ installed and running
- Node.js installed
- `.env` file configured with database credentials

## Environment Variables

Ensure your `.env` file contains:

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=arif_workout
DB_USER=root
DB_PASSWORD=your_password
NODE_ENV=development
```

## Database Setup Options

### Option 1: Quick Setup (Recommended for Generators)

Run the generator-specific sync script:

```bash
npm run db:sync:generators
```

This will:
- Create/update `user_surveys` table
- Create/update `exercises` table
- Create/update `nutrition_items` table
- Verify all tables and columns

### Option 2: Full Database Sync

Sync all models in the application:

```bash
npm run db:sync
```

This syncs ALL tables defined in your models (may take longer).

### Option 3: Manual Migration

Run the migration script directly:

```bash
npm run migrate:generators
```

This creates the tables using raw SQL migrations.

## Migration Scripts

### Available Commands

```bash
# Sync generator models (UserSurvey, Exercise, NutritionItem)
npm run db:sync:generators

# Sync all database models
npm run db:sync

# Run generator tables migration
npm run migrate:generators

# Rollback generator tables migration (WARNING: deletes data)
npm run migrate:generators:down

# Add video support to exercise_images
npm run migrate:video
```

### Manual Migration Execution

You can also run migrations manually:

```bash
# Create generator tables
node src/migrations/create-generator-tables.js up

# Rollback generator tables
node src/migrations/create-generator-tables.js down
```

## Tables Created

### 1. user_surveys
Stores user fitness assessment data for personalized workout/nutrition generation.

**Key Fields:**
- Personal info: age, gender, height, weight, targetWeight
- Goals: primaryGoal, secondaryGoals, fitnessLevel
- Activity: activityLevel, workoutFrequency, workoutDuration
- Equipment: workoutLocation, availableEquipment
- Health: injuries, medicalConditions, limitations
- Nutrition: dietaryPreference, dailyCalorieTarget, mealsPerDay
- Recovery: averageSleepHours, stressLevel

### 2. exercises
Exercise database with detailed information.

**Key Fields:**
- Basic: name, slug, description, category
- Targeting: muscleGroups, primaryMuscles, secondaryMuscles
- Details: difficulty, equipment, instructions
- Metrics: caloriesBurnedPerMinute, duration, sets, reps, restTime
- Media: videoUrl, imageUrl
- Tips: tips, variations

### 3. nutrition_items
Food database for meal planning.

**Key Fields:**
- Basic: name, slug, category, servingSize
- Macros: calories, protein, carbs, fats, fiber, sugar
- Micros: vitamins, minerals
- Dietary: isVegetarian, isVegan, isKeto, isGlutenFree, isDairyFree
- Planning: mealTypes, goals, preparationTime
- Media: imageUrl, thumbnailUrl, videoUrl

## Verification

After running any sync/migration, verify the tables:

```sql
-- Check if tables exist
SHOW TABLES LIKE '%user_surveys%';
SHOW TABLES LIKE '%exercises%';
SHOW TABLES LIKE '%nutrition_items%';

-- Check table structure
DESCRIBE user_surveys;
DESCRIBE exercises;
DESCRIBE nutrition_items;

-- Check row counts
SELECT COUNT(*) FROM user_surveys;
SELECT COUNT(*) FROM exercises;
SELECT COUNT(*) FROM nutrition_items;
```

## Troubleshooting

### Error: "Too many keys specified"

This happens when there are too many indexes. Solutions:
1. Use the migration script instead: `npm run migrate:generators`
2. Manually adjust indexes in the migration file
3. Use `alter: true` instead of `force: true` in sync

### Error: "Table already exists"

This is normal. The scripts check for existing tables and skip creation.

### Error: "Access denied"

Check your MySQL user permissions:

```sql
GRANT ALL PRIVILEGES ON arif_workout.* TO 'your_user'@'localhost';
FLUSH PRIVILEGES;
```

### Error: "Unknown database"

Create the database first:

```sql
CREATE DATABASE arif_workout CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

## Seeding Data

After setting up tables, you may want to seed initial data:

```bash
# Seed exercises (if available)
node src/scripts/seed-exercises.js

# Seed nutrition items (if available)
node src/scripts/seed-nutrition.js

# Create admin user (if needed)
node src/scripts/create-admin.js
```

## API Endpoints (After Setup)

Once the database is set up, these generator endpoints will work:

### Workout Generator
- `GET /api/workout-generator/plan` - Generate personalized workout plan
- `GET /api/workout-generator/body-part?bodyPart=chest` - Target specific muscles
- `GET /api/workout-generator/category?category=strength` - Category-based workouts
- `GET /api/workout-generator/weekly-split` - Full week split

### Nutrition Generator
- `GET /api/nutrition-generator/plan` - Generate personalized nutrition plan
- `GET /api/nutrition-generator/meal?mealType=breakfast` - Specific meal
- `GET /api/nutrition-generator/daily` - Complete daily plan
- `GET /api/nutrition-generator/macros?protein=30&carbs=40` - Macro-based suggestions
- `GET /api/nutrition-generator/weekly-prep` - Weekly meal prep

## Development Workflow

1. **Initial Setup:**
   ```bash
   npm run db:sync:generators
   ```

2. **Start Server:**
   ```bash
   npm run dev
   ```

3. **Test Generators:**
   - Create a user account
   - Complete the fitness survey
   - Call generator endpoints

4. **Schema Changes:**
   - Modify model files
   - Run `npm run db:sync:generators` to update tables
   - Or create a new migration file

## Production Deployment

For production:

1. **Never use `force: true`** - it deletes all data
2. **Use migrations** instead of auto-sync
3. **Backup database** before running migrations
4. **Test migrations** on staging first

```bash
# Production migration
NODE_ENV=production npm run migrate:generators
```

## Notes

- The sync scripts use `alter: true` which is safe for development
- Migrations use transactions for safety
- All tables use InnoDB engine with utf8mb4 charset
- Foreign keys are set up for data integrity
- Indexes are created for query performance
