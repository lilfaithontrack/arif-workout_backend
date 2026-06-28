# Program Backend Structure

This document describes the backend structure for the Exercise Program hierarchy that follows the UI shown in the screenshots.

## Overview

The structure follows a 3-tier hierarchy:

```
Program (e.g., "Bodyweight Stabilization Training")
  └── ProgramWorkout (e.g., "Bodyweight Beginner Level 1")
        └── WorkoutExercise (e.g., "SMR Calves" with reps/sets)
              └── Exercise (base exercise entity)
```

## Database Models

### 1. Program (`programs` table)

The top-level container for a training program.

**Key Fields:**
- `name` - Program name (e.g., "Bodyweight Stabilization Training")
- `slug` - URL-friendly identifier
- `categoryId` - Reference to category (Stabilization Endurance, Muscle Gain, etc.)
- `level` - beginner, intermediate, advanced, all_levels
- `goal` - weight_loss, muscle_gain, endurance, flexibility, general_fitness, strength, stabilization
- `durationWeeks` - Total program duration
- `workoutsCount` - Number of workouts in the program
- `tags` - JSON array for filtering
- `equipment` - Required equipment

### 2. ProgramWorkout (`program_workouts` table)

Individual workouts within a program (levels/phases).

**Key Fields:**
- `programId` - Parent program reference
- `name` - Workout name (e.g., "Bodyweight Beginner Level 1")
- `weekNumber` - Which week this belongs to
- `dayNumber` - Day within the week
- `durationMinutes` - Estimated duration (e.g., 29 min)
- `exercisesCount` - Number of exercises
- `focusArea` - Full Body, Upper Body, Lower Body, Core
- `orderIndex` - Display order

### 3. WorkoutExercise (`workout_exercises` table)

Junction table linking workouts to exercises with workout-specific settings.

**Key Fields:**
- `programWorkoutId` - Parent workout reference
- `exerciseId` - Reference to base exercise
- `section` - warm_up, main, cool_down, superset
- `sectionName` - Display name (e.g., "Warm-Up")
- `sets`, `reps`, `repsDisplay` - Exercise parameters
- `durationSeconds` - For time-based exercises
- `restSeconds` - Rest between sets
- `tempo` - Speed (Slow, Medium, Fast)
- `orderIndex` - Order within the workout

### 4. UserProgram (`user_programs` table)

Tracks user enrollment and progress in programs.

**Key Fields:**
- `userId`, `programId` - User and program references
- `currentWorkoutId` - Where user left off
- `currentWeek`, `currentDay` - Progress tracking
- `status` - not_started, in_progress, completed, paused
- `progressPercentage` - 0-100 completion
- `completedWorkouts` / `totalWorkouts` - Progress stats
- `completedDate` - When program was finished

## API Endpoints

### Public Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/programs` | Get all programs (with filters) |
| GET | `/api/programs/:id` | Get program by ID |
| GET | `/api/programs/slug/:slug` | Get program by slug |
| GET | `/api/programs/workouts/:workoutId` | Get workout with exercises |

### Protected Routes (Authenticated)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/programs/my/programs` | Get user's enrolled programs |
| POST | `/api/programs/:programId/enroll` | Enroll in a program |
| PUT | `/api/programs/enrollments/:enrollmentId/progress` | Update progress |
| POST | `/api/programs/enrollments/:enrollmentId/complete` | Complete current workout |
| DELETE | `/api/programs/enrollments/:enrollmentId` | Unenroll from program |

### Admin/Instructor Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/programs` | Create new program |
| PUT | `/api/programs/:id` | Update program |
| DELETE | `/api/programs/:id` | Delete program (soft) |
| POST | `/api/programs/:programId/workouts` | Add workout to program |
| PUT | `/api/programs/workouts/:workoutId` | Update workout |
| DELETE | `/api/programs/workouts/:workoutId` | Delete workout |
| POST | `/api/programs/workouts/:workoutId/exercises` | Add exercise to workout |
| PUT | `/api/programs/workouts/exercises/:exerciseId` | Update workout exercise |
| DELETE | `/api/programs/workouts/exercises/:exerciseId` | Remove exercise |
| PUT | `/api/programs/workouts/:workoutId/reorder` | Reorder exercises |

## Database Relationships

```javascript
// Program relationships
Program.hasMany(ProgramWorkout, { as: 'workouts' });
Program.belongsTo(Category, { as: 'category' });

// ProgramWorkout relationships
ProgramWorkout.belongsTo(Program, { as: 'program' });
ProgramWorkout.hasMany(WorkoutExercise, { as: 'exercises' });

// WorkoutExercise relationships
WorkoutExercise.belongsTo(ProgramWorkout, { as: 'programWorkout' });
WorkoutExercise.belongsTo(Exercise, { as: 'exercise' });

// UserProgram (enrollment) relationships
UserProgram.belongsTo(User, { as: 'user' });
UserProgram.belongsTo(Program, { as: 'program' });
UserProgram.belongsTo(ProgramWorkout, { as: 'currentWorkout' });
```

## Setup Instructions

### 1. Run Migration

```bash
cd backend
node src/migrations/create-program-tables.js up
```

Or execute the SQL directly in MySQL:
```bash
mysql -u root -p arif_workout < src/migrations/create-program-tables.sql
```

### 2. Seed Sample Data

```bash
node src/seeders/program-seeder.js
```

### 3. API Usage Examples

#### Get Programs with Filters
```javascript
GET /api/programs?category=1&level=beginner&goal=stabilization
```

#### Get Program with Workouts
```javascript
GET /api/programs/1?includeWorkouts=true
```

#### Get Workout with Exercises (Grouped by Section)
```javascript
GET /api/programs/workouts/1
// Returns exercises grouped by: warm_up, main, cool_down
```

#### Enroll in Program
```javascript
POST /api/programs/1/enroll
Headers: Authorization: Bearer <token>
```

#### Complete Workout & Advance
```javascript
POST /api/programs/enrollments/123/complete
Headers: Authorization: Bearer <token>
```

## Files Created

| File | Purpose |
|------|---------|
| `src/models/program.model.js` | Program model |
| `src/models/programworkout.model.js` | ProgramWorkout model |
| `src/models/workoutexercise.model.js` | WorkoutExercise junction model |
| `src/models/userprogram.model.js` | User enrollment model |
| `src/models/index.js` | Updated with relationships |
| `src/controllers/program.controller.js` | Full CRUD controller |
| `src/routes/program.routes.js` | API routes |
| `src/server.js` | Updated with route registration |
| `src/migrations/create-program-tables.js` | Database migration (JS) |
| `src/migrations/create-program-tables.sql` | Database migration (SQL) |
| `src/seeders/program-seeder.js` | Sample data seeder |

## Data Flow Example

Based on the screenshots, here's how the data flows:

1. **Programs List Page**: GET `/api/programs`
   - Returns: Bodyweight Stabilization Training (3 workouts), Bodyweight Strength Training (3 workouts), etc.

2. **Program Detail Page**: GET `/api/programs/1?includeWorkouts=true`
   - Returns: Program info + array of workouts (Level 1, Level 2, Level 3)

3. **Workout Detail Page**: GET `/api/programs/workouts/1`
   - Returns: Workout info + exercises grouped by section (Warm-Up with SMR exercises)

4. **Exercise Detail**: Data from `WorkoutExercise` + linked `Exercise`
   - Shows: Reps: N/A, Sets: 1, Tempo: Slow, Rest: 0s + exercise image/video
