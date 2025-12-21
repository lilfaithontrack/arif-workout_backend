# 🏋️ Fitness Features Guide

## Overview

Added 8 comprehensive fitness-focused models to help users track their fitness journey and enable admins/instructors to provide personalized guidance.

---

## 📊 New Models

### 1. **WorkoutPlan** 
**Purpose**: Create and manage personalized workout plans

**Key Features**:
- Customizable workout schedules (days per week, duration)
- Goal-based plans (weight loss, muscle gain, endurance, etc.)
- Progress tracking (completed workouts, percentage)
- Instructor-created or self-created plans
- Status management (draft, active, completed, paused)

**Use Cases**:
- Instructor creates personalized plan for client
- User creates self-guided workout plan
- Track plan completion and progress
- Pause/resume plans as needed

**Fields**:
```javascript
{
  userId, instructorId, name, description,
  goal: 'weight_loss' | 'muscle_gain' | 'endurance' | 'flexibility' | 'general_fitness' | 'strength',
  level: 'beginner' | 'intermediate' | 'advanced',
  durationWeeks, daysPerWeek,
  workoutSchedule: [{day, workoutId, exercises, sets, reps, rest}],
  status, startDate, endDate,
  completedWorkouts, totalWorkouts, progressPercentage
}
```

---

### 2. **Exercise**
**Purpose**: Exercise library with detailed instructions

**Key Features**:
- Comprehensive exercise database
- Categorized by type (cardio, strength, flexibility, etc.)
- Muscle group targeting
- Equipment requirements
- Video/image demonstrations
- Difficulty levels
- Calorie burn estimates

**Use Cases**:
- Admin/instructor adds new exercises
- Users browse exercise library
- Filter by category, muscle group, equipment
- View instructions and demonstrations

**Fields**:
```javascript
{
  name, slug, description,
  category: 'cardio' | 'strength' | 'flexibility' | 'balance' | 'sports' | 'yoga' | 'pilates' | 'hiit',
  muscleGroups: ['chest', 'back', 'legs', 'shoulders', 'arms', 'core'],
  equipment: ['dumbbells', 'barbell', 'resistance_band', 'bodyweight'],
  difficulty: 'beginner' | 'intermediate' | 'advanced',
  instructions: [step1, step2, ...],
  videoUrl, imageUrl,
  caloriesBurnedPerMinute,
  duration, sets, reps, restTime,
  tips: [], variations: []
}
```

---

### 3. **UserWorkout**
**Purpose**: Track individual workout sessions

**Key Features**:
- Log completed workouts
- Track sets, reps, weight, distance
- Monitor heart rate and intensity
- Record duration and calories burned
- Rate workout difficulty
- Track mood and energy levels

**Use Cases**:
- User logs workout after completion
- Track personal records
- Monitor workout intensity
- Analyze workout patterns
- Generate workout history reports

**Fields**:
```javascript
{
  userId, workoutPlanId, exerciseId,
  date, startTime, endTime, duration,
  sets, reps, weight, distance,
  caloriesBurned,
  heartRateAvg, heartRateMax,
  intensity: 'low' | 'moderate' | 'high' | 'very_high',
  status: 'planned' | 'in_progress' | 'completed' | 'skipped',
  rating: 1-5,
  mood: 'great' | 'good' | 'okay' | 'tired' | 'exhausted',
  notes
}
```

---

### 4. **NutritionLog**
**Purpose**: Track daily nutrition and meals

**Key Features**:
- Log meals by type (breakfast, lunch, dinner, snacks)
- Track macronutrients (protein, carbs, fats)
- Monitor micronutrients (vitamins, minerals)
- Calorie counting
- Water intake tracking
- Meal photos

**Use Cases**:
- User logs daily meals
- Track calorie intake
- Monitor macro/micro nutrients
- Analyze eating patterns
- Generate nutrition reports

**Fields**:
```javascript
{
  userId, date,
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'pre_workout' | 'post_workout',
  foodName, servingSize,
  calories, protein, carbs, fats,
  fiber, sugar, sodium,
  vitamins: {vitaminA, vitaminC, ...},
  minerals: {calcium, iron, ...},
  waterIntake,
  imageUrl, notes
}
```

---

### 5. **BodyMeasurement**
**Purpose**: Track body composition and measurements

**Key Features**:
- Weight and height tracking
- BMI calculation
- Body fat percentage
- Muscle mass percentage
- Detailed body measurements (chest, waist, arms, etc.)
- Metabolic age and BMR
- Progress photos

**Use Cases**:
- User tracks weekly measurements
- Monitor body composition changes
- Track progress photos
- Generate transformation reports
- Compare measurements over time

**Fields**:
```javascript
{
  userId, date,
  weight, height, bmi,
  bodyFatPercentage, muscleMassPercentage,
  visceralFat, boneMass, waterPercentage,
  metabolicAge, basalMetabolicRate,
  // Detailed measurements in cm
  chest, waist, hips,
  thighLeft, thighRight,
  calfLeft, calfRight,
  bicepLeft, bicepRight,
  forearmLeft, forearmRight,
  neck, shoulders,
  imageUrl, notes
}
```

---

### 6. **FitnessGoal**
**Purpose**: Set and track fitness goals

**Key Features**:
- Multiple goal types (weight loss, muscle gain, etc.)
- Target values and deadlines
- Progress tracking
- Milestone management
- Priority levels
- Public/private goals

**Use Cases**:
- User sets fitness goals
- Track goal progress
- Celebrate milestones
- Share goals with community
- Instructor monitors client goals

**Fields**:
```javascript
{
  userId,
  goalType: 'weight_loss' | 'weight_gain' | 'muscle_gain' | 'fat_loss' | 'endurance' | 'strength' | 'flexibility' | 'body_recomposition' | 'maintain_weight' | 'custom',
  title, description,
  targetValue, currentValue, startValue, unit,
  startDate, targetDate,
  status: 'active' | 'completed' | 'paused' | 'abandoned',
  progressPercentage,
  milestones: [{value, date, achieved, notes}],
  weeklyTarget, priority,
  isPublic, completedAt, notes
}
```

---

### 7. **FitnessAssessment**
**Purpose**: Comprehensive fitness evaluations

**Key Features**:
- Initial and periodic assessments
- Cardiovascular fitness tests
- Strength tests (push-ups, sit-ups, plank, etc.)
- Flexibility tests
- Endurance tests
- Overall fitness scoring
- Personalized recommendations

**Use Cases**:
- Instructor conducts fitness assessment
- Track fitness level improvements
- Identify strengths and weaknesses
- Generate personalized recommendations
- Compare assessments over time

**Fields**:
```javascript
{
  userId, assessedBy, date,
  assessmentType: 'initial' | 'progress' | 'final' | 'periodic',
  // Cardiovascular
  restingHeartRate, maxHeartRate, vo2Max,
  // Strength
  pushUpsMax, sitUpsMax, plankTime, squatsMax,
  benchPressMax, deadliftMax, squatMax,
  // Flexibility
  sitAndReach, shoulderFlexibility,
  // Endurance
  runTime1Mile, runTime5K,
  // Balance & Agility
  balanceScore, agilityScore,
  // Overall
  overallFitnessScore,
  fitnessLevel: 'poor' | 'below_average' | 'average' | 'above_average' | 'excellent',
  recommendations: [], strengths: [], weaknesses: [],
  notes
}
```

---

### 8. **Achievement**
**Purpose**: Gamification and motivation

**Key Features**:
- Unlock achievements for milestones
- Badge levels (bronze, silver, gold, etc.)
- Points system
- Achievement types (streaks, milestones, challenges)
- Social sharing
- Public/private achievements

**Use Cases**:
- User unlocks achievements automatically
- Track workout streaks
- Celebrate personal records
- Share achievements on social media
- Leaderboards and competitions

**Fields**:
```javascript
{
  userId,
  type: 'workout_streak' | 'weight_milestone' | 'strength_milestone' | 'distance_milestone' | 'time_milestone' | 'consistency' | 'goal_completed' | 'personal_record' | 'challenge_completed' | 'custom',
  title, description,
  iconUrl,
  badgeLevel: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond',
  points,
  unlockedAt,
  criteria: {},
  isPublic, shareCount
}
```

---

## 🗄️ Database Tables Created

When you start the server, these tables will be created:

```sql
✅ workout_plans
✅ exercises
✅ user_workouts
✅ nutrition_logs
✅ body_measurements
✅ fitness_goals
✅ fitness_assessments
✅ achievements
```

---

## 🔗 Relationships

### User Relationships:
- **User** → **WorkoutPlan** (1:many) - User's workout plans
- **User** → **Exercise** (1:many) - Created exercises
- **User** → **UserWorkout** (1:many) - Logged workouts
- **User** → **NutritionLog** (1:many) - Nutrition entries
- **User** → **BodyMeasurement** (1:many) - Body measurements
- **User** → **FitnessGoal** (1:many) - Fitness goals
- **User** → **FitnessAssessment** (1:many) - Assessments
- **User** → **Achievement** (1:many) - Unlocked achievements

### Instructor Relationships:
- **Instructor** → **WorkoutPlan** (1:many) - Created plans for clients
- **Instructor** → **FitnessAssessment** (1:many) - Conducted assessments

### Cross-Model Relationships:
- **WorkoutPlan** → **UserWorkout** (1:many)
- **Exercise** → **UserWorkout** (1:many)

---

## 💡 Use Cases

### For Users:

1. **Track Workouts**:
   ```javascript
   // Log a workout
   POST /api/workouts
   {
     exerciseId: 1,
     sets: 3,
     reps: 12,
     weight: 50,
     duration: 1800,
     caloriesBurned: 250,
     rating: 4,
     mood: 'good'
   }
   ```

2. **Log Nutrition**:
   ```javascript
   // Log a meal
   POST /api/nutrition
   {
     mealType: 'breakfast',
     foodName: 'Oatmeal with berries',
     calories: 350,
     protein: 12,
     carbs: 65,
     fats: 8
   }
   ```

3. **Track Body Measurements**:
   ```javascript
   // Log measurements
   POST /api/measurements
   {
     weight: 75.5,
     bodyFatPercentage: 18.5,
     chest: 100,
     waist: 85,
     bicepRight: 35
   }
   ```

4. **Set Goals**:
   ```javascript
   // Create a goal
   POST /api/goals
   {
     goalType: 'weight_loss',
     title: 'Lose 10kg',
     targetValue: 70,
     currentValue: 80,
     targetDate: '2025-06-01'
   }
   ```

### For Instructors:

1. **Create Workout Plans**:
   ```javascript
   // Create plan for client
   POST /api/workout-plans
   {
     userId: 123,
     name: 'Beginner Strength Program',
     goal: 'muscle_gain',
     level: 'beginner',
     durationWeeks: 12,
     daysPerWeek: 4,
     workoutSchedule: [...]
   }
   ```

2. **Conduct Assessments**:
   ```javascript
   // Assess client fitness
   POST /api/assessments
   {
     userId: 123,
     assessmentType: 'initial',
     pushUpsMax: 20,
     plankTime: 60,
     vo2Max: 35,
     overallFitnessScore: 65,
     recommendations: [...]
   }
   ```

### For Admins:

1. **Add Exercises**:
   ```javascript
   // Add to exercise library
   POST /api/exercises
   {
     name: 'Barbell Squat',
     category: 'strength',
     muscleGroups: ['legs', 'core'],
     equipment: ['barbell'],
     difficulty: 'intermediate',
     instructions: [...]
   }
   ```

2. **View Analytics**:
   ```javascript
   // Get platform statistics
   GET /api/admin/analytics
   {
     totalWorkouts: 15000,
     activeUsers: 500,
     avgWorkoutsPerUser: 30,
     popularExercises: [...]
   }
   ```

---

## 📈 Analytics & Reports

### User Dashboard:
- Weekly workout summary
- Nutrition overview (calories, macros)
- Weight/body composition trends
- Goal progress
- Achievement highlights
- Workout streak

### Instructor Dashboard:
- Client progress overview
- Assessment comparisons
- Plan adherence rates
- Client goals status
- Upcoming assessments

### Admin Dashboard:
- Platform-wide statistics
- Most popular exercises
- User engagement metrics
- Goal completion rates
- Achievement distribution

---

## 🎯 Gamification Features

### Achievement Types:

1. **Workout Streaks**:
   - 7-day streak → Bronze
   - 30-day streak → Silver
   - 90-day streak → Gold
   - 365-day streak → Platinum

2. **Weight Milestones**:
   - Lost 5kg → Bronze
   - Lost 10kg → Silver
   - Lost 20kg → Gold

3. **Strength Milestones**:
   - Bench press bodyweight → Bronze
   - Bench press 1.5x bodyweight → Silver
   - Bench press 2x bodyweight → Gold

4. **Distance Milestones**:
   - Run 100km total → Bronze
   - Run 500km total → Silver
   - Run 1000km total → Gold

5. **Consistency**:
   - 50 workouts → Bronze
   - 100 workouts → Silver
   - 500 workouts → Gold

---

## 🚀 API Endpoints (To Be Created)

### Workout Plans:
```
GET    /api/workout-plans          - List user's plans
POST   /api/workout-plans          - Create plan
GET    /api/workout-plans/:id      - Get plan details
PUT    /api/workout-plans/:id      - Update plan
DELETE /api/workout-plans/:id      - Delete plan
POST   /api/workout-plans/:id/start - Start plan
```

### Exercises:
```
GET    /api/exercises              - List exercises
POST   /api/exercises              - Create exercise (admin/instructor)
GET    /api/exercises/:id          - Get exercise details
PUT    /api/exercises/:id          - Update exercise
DELETE /api/exercises/:id          - Delete exercise
GET    /api/exercises/search       - Search exercises
```

### User Workouts:
```
GET    /api/workouts               - List user's workouts
POST   /api/workouts               - Log workout
GET    /api/workouts/:id           - Get workout details
PUT    /api/workouts/:id           - Update workout
DELETE /api/workouts/:id           - Delete workout
GET    /api/workouts/stats         - Get workout statistics
```

### Nutrition:
```
GET    /api/nutrition              - List nutrition logs
POST   /api/nutrition              - Log meal
GET    /api/nutrition/:id          - Get meal details
PUT    /api/nutrition/:id          - Update meal
DELETE /api/nutrition/:id          - Delete meal
GET    /api/nutrition/daily        - Get daily summary
GET    /api/nutrition/weekly       - Get weekly summary
```

### Body Measurements:
```
GET    /api/measurements           - List measurements
POST   /api/measurements           - Log measurement
GET    /api/measurements/:id       - Get measurement details
PUT    /api/measurements/:id       - Update measurement
DELETE /api/measurements/:id       - Delete measurement
GET    /api/measurements/trends    - Get trends
```

### Fitness Goals:
```
GET    /api/goals                  - List goals
POST   /api/goals                  - Create goal
GET    /api/goals/:id              - Get goal details
PUT    /api/goals/:id              - Update goal
DELETE /api/goals/:id              - Delete goal
POST   /api/goals/:id/complete     - Mark goal complete
```

### Fitness Assessments:
```
GET    /api/assessments            - List assessments
POST   /api/assessments            - Create assessment
GET    /api/assessments/:id        - Get assessment details
PUT    /api/assessments/:id        - Update assessment
DELETE /api/assessments/:id        - Delete assessment
GET    /api/assessments/compare    - Compare assessments
```

### Achievements:
```
GET    /api/achievements           - List user's achievements
GET    /api/achievements/available - List available achievements
POST   /api/achievements/:id/share - Share achievement
```

---

## ✅ Summary

**Total New Models**: 8
**Total New Tables**: 8
**Total Relationships**: 20+

### Benefits:

**For Users**:
- ✅ Comprehensive fitness tracking
- ✅ Personalized workout plans
- ✅ Nutrition monitoring
- ✅ Progress visualization
- ✅ Goal setting and tracking
- ✅ Gamification and motivation

**For Instructors**:
- ✅ Client management
- ✅ Personalized plan creation
- ✅ Fitness assessments
- ✅ Progress monitoring
- ✅ Data-driven recommendations

**For Admins**:
- ✅ Exercise library management
- ✅ Platform analytics
- ✅ User engagement insights
- ✅ Content management

---

**Status**: ✅ **All Models Created and Ready!**

Start the server to create all tables automatically.
