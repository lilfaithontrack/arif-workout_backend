# 🏋️ Fitness API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
Most endpoints require authentication. Include JWT token in header:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## 📋 Workout Plans API

### Get All Workout Plans
```http
GET /api/workout-plans
```

**Query Parameters:**
- `status` - Filter by status (draft, active, completed, paused, cancelled)
- `goal` - Filter by goal
- `level` - Filter by level

**Response:**
```json
{
  "success": true,
  "count": 5,
  "data": {
    "plans": [...]
  }
}
```

### Get Single Workout Plan
```http
GET /api/workout-plans/:id
```

### Create Workout Plan
```http
POST /api/workout-plans
```

**Body:**
```json
{
  "name": "Beginner Strength Program",
  "description": "12-week strength building program",
  "goal": "muscle_gain",
  "level": "beginner",
  "durationWeeks": 12,
  "daysPerWeek": 4,
  "workoutSchedule": [
    {
      "day": 1,
      "exercises": [1, 2, 3],
      "sets": 3,
      "reps": 12
    }
  ],
  "notes": "Focus on form"
}
```

### Update Workout Plan
```http
PUT /api/workout-plans/:id
```

### Start Workout Plan
```http
POST /api/workout-plans/:id/start
```

### Complete Workout Plan
```http
POST /api/workout-plans/:id/complete
```

### Delete Workout Plan
```http
DELETE /api/workout-plans/:id
```

### Get Workout Plan Statistics
```http
GET /api/workout-plans/stats
```

**Response:**
```json
{
  "success": true,
  "data": {
    "stats": {
      "total": 5,
      "active": 2,
      "completed": 2,
      "draft": 1,
      "totalWorkoutsCompleted": 45,
      "averageProgress": 67.5
    }
  }
}
```

---

## 💪 Exercises API

### Get All Exercises
```http
GET /api/exercises
```

**Query Parameters:**
- `category` - Filter by category (cardio, strength, flexibility, etc.)
- `difficulty` - Filter by difficulty (beginner, intermediate, advanced)
- `muscleGroup` - Filter by muscle group
- `equipment` - Filter by equipment
- `search` - Search by name or description
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)

**Response:**
```json
{
  "success": true,
  "count": 150,
  "page": 1,
  "totalPages": 8,
  "data": {
    "exercises": [...]
  }
}
```

### Get Single Exercise
```http
GET /api/exercises/:id
```
*Can use ID or slug*

### Create Exercise (Admin/Instructor)
```http
POST /api/exercises
```

**Body:**
```json
{
  "name": "Barbell Squat",
  "slug": "barbell-squat",
  "description": "Compound leg exercise",
  "category": "strength",
  "muscleGroups": ["legs", "glutes", "core"],
  "equipment": ["barbell", "squat_rack"],
  "difficulty": "intermediate",
  "instructions": [
    "Position bar on upper back",
    "Feet shoulder-width apart",
    "Lower until thighs parallel",
    "Drive through heels to stand"
  ],
  "videoUrl": "https://example.com/video.mp4",
  "caloriesBurnedPerMinute": 9.5,
  "sets": 4,
  "reps": 10,
  "restTime": 90,
  "tips": ["Keep chest up", "Don't let knees cave"],
  "variations": ["Front Squat", "Goblet Squat"]
}
```

### Update Exercise (Admin/Instructor)
```http
PUT /api/exercises/:id
```

### Delete Exercise (Admin)
```http
DELETE /api/exercises/:id
```

### Get Exercise Categories
```http
GET /api/exercises/categories
```

### Get Muscle Groups
```http
GET /api/exercises/muscle-groups
```

---

## 🏃 User Workouts API

### Get All Workouts
```http
GET /api/workouts
```

**Query Parameters:**
- `status` - Filter by status
- `startDate` - Filter from date
- `endDate` - Filter to date
- `exerciseId` - Filter by exercise
- `page` - Page number
- `limit` - Items per page

### Get Single Workout
```http
GET /api/workouts/:id
```

### Log Workout
```http
POST /api/workouts
```

**Body:**
```json
{
  "exerciseId": 1,
  "workoutPlanId": 5,
  "date": "2025-11-27",
  "startTime": "2025-11-27T10:00:00Z",
  "endTime": "2025-11-27T11:00:00Z",
  "duration": 3600,
  "sets": 4,
  "reps": 12,
  "weight": 80,
  "distance": 5.5,
  "caloriesBurned": 350,
  "heartRateAvg": 145,
  "heartRateMax": 175,
  "intensity": "high",
  "rating": 4,
  "mood": "good",
  "notes": "Felt strong today"
}
```

### Update Workout
```http
PUT /api/workouts/:id
```

### Delete Workout
```http
DELETE /api/workouts/:id
```

### Get Workout Statistics
```http
GET /api/workouts/stats?period=30
```

**Response:**
```json
{
  "success": true,
  "period": 30,
  "data": {
    "stats": {
      "totalWorkouts": 24,
      "totalDuration": 86400,
      "totalCalories": 8400,
      "totalDistance": 132,
      "averageRating": 4.2,
      "workoutStreak": 7
    }
  }
}
```

### Get Workout Calendar
```http
GET /api/workouts/calendar?month=11&year=2025
```

**Response:**
```json
{
  "success": true,
  "month": 11,
  "year": 2025,
  "data": {
    "calendar": {
      "2025-11-01": [...],
      "2025-11-02": [...],
      ...
    }
  }
}
```

---

## 🍎 Nutrition API

### Get Nutrition Logs
```http
GET /api/nutrition
```

**Query Parameters:**
- `mealType` - Filter by meal type
- `startDate` - Filter from date
- `endDate` - Filter to date
- `page` - Page number
- `limit` - Items per page

### Get Single Nutrition Log
```http
GET /api/nutrition/:id
```

### Log Meal
```http
POST /api/nutrition
```

**Body:**
```json
{
  "date": "2025-11-27",
  "mealType": "breakfast",
  "foodName": "Oatmeal with berries",
  "servingSize": "1 bowl",
  "calories": 350,
  "protein": 12,
  "carbs": 65,
  "fats": 8,
  "fiber": 10,
  "sugar": 15,
  "sodium": 150,
  "vitamins": {
    "vitaminC": 25,
    "vitaminD": 5
  },
  "minerals": {
    "calcium": 200,
    "iron": 4
  },
  "waterIntake": 250,
  "imageUrl": "https://example.com/meal.jpg",
  "notes": "Homemade with fresh berries"
}
```

### Update Nutrition Log
```http
PUT /api/nutrition/:id
```

### Delete Nutrition Log
```http
DELETE /api/nutrition/:id
```

### Get Daily Summary
```http
GET /api/nutrition/daily?date=2025-11-27
```

**Response:**
```json
{
  "success": true,
  "data": {
    "summary": {
      "date": "2025-11-27",
      "totalCalories": 2150,
      "totalProtein": 125,
      "totalCarbs": 250,
      "totalFats": 70,
      "totalFiber": 35,
      "totalWater": 2500,
      "mealCount": 5,
      "mealsByType": {
        "breakfast": 1,
        "lunch": 1,
        "dinner": 1,
        "snack": 2
      }
    },
    "logs": [...]
  }
}
```

### Get Weekly Summary
```http
GET /api/nutrition/weekly?startDate=2025-11-20
```

### Get Nutrition Statistics
```http
GET /api/nutrition/stats?period=30
```

---

## 📏 Body Measurements API

### Get All Measurements
```http
GET /api/measurements
```

**Query Parameters:**
- `startDate` - Filter from date
- `endDate` - Filter to date
- `limit` - Items to return

### Get Single Measurement
```http
GET /api/measurements/:id
```

### Log Body Measurement
```http
POST /api/measurements
```

**Body:**
```json
{
  "date": "2025-11-27",
  "weight": 75.5,
  "height": 180,
  "bodyFatPercentage": 18.5,
  "muscleMassPercentage": 42.3,
  "visceralFat": 8,
  "waterPercentage": 58.2,
  "metabolicAge": 28,
  "basalMetabolicRate": 1750,
  "chest": 100,
  "waist": 85,
  "hips": 98,
  "thighLeft": 58,
  "thighRight": 58,
  "bicepLeft": 35,
  "bicepRight": 36,
  "imageUrl": "https://example.com/progress.jpg",
  "notes": "Feeling great!"
}
```

### Update Measurement
```http
PUT /api/measurements/:id
```

### Delete Measurement
```http
DELETE /api/measurements/:id
```

### Get Measurement Trends
```http
GET /api/measurements/trends?period=90&metric=weight
```

**Response:**
```json
{
  "success": true,
  "metric": "weight",
  "period": 90,
  "data": {
    "trends": [
      { "date": "2025-09-01", "value": 80 },
      { "date": "2025-10-01", "value": 77.5 },
      { "date": "2025-11-01", "value": 75.5 }
    ],
    "stats": {
      "current": 75.5,
      "start": 80,
      "change": -4.5,
      "percentageChange": "-5.63",
      "average": "77.67",
      "min": 75.5,
      "max": 80
    }
  }
}
```

### Get Latest Measurement
```http
GET /api/measurements/latest
```

### Compare Measurements
```http
GET /api/measurements/compare?id1=1&id2=5
```

---

## 📊 Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error"
}
```

---

## 🔐 Authentication Endpoints

### Staff Login (Email & Password)
```http
POST /api/auth/login
```

**Body:**
```json
{
  "email": "admin@arifworkout.com",
  "password": "admin123"
}
```

### OAuth Login (Students)
```http
GET /api/auth/google
GET /api/auth/facebook
```

### Get Profile
```http
GET /api/auth/profile
```

### Update Profile
```http
PUT /api/auth/profile
```

---

## 📈 Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 500 | Server Error |

---

## 🎯 Quick Examples

### Complete Workout Flow
```bash
# 1. Get exercises
GET /api/exercises?category=strength

# 2. Log workout
POST /api/workouts
{
  "exerciseId": 1,
  "sets": 4,
  "reps": 12,
  "weight": 80,
  "caloriesBurned": 250
}

# 3. Check stats
GET /api/workouts/stats?period=7
```

### Daily Nutrition Tracking
```bash
# 1. Log breakfast
POST /api/nutrition
{
  "mealType": "breakfast",
  "foodName": "Eggs and toast",
  "calories": 400
}

# 2. Get daily summary
GET /api/nutrition/daily?date=2025-11-27

# 3. Check weekly progress
GET /api/nutrition/weekly
```

### Body Progress Tracking
```bash
# 1. Log measurement
POST /api/measurements
{
  "weight": 75.5,
  "bodyFatPercentage": 18.5
}

# 2. View trends
GET /api/measurements/trends?metric=weight&period=90

# 3. Compare progress
GET /api/measurements/compare?id1=1&id2=10
```

---

## ✅ API Summary

**Total Endpoints**: 40+

### Workout Plans: 8 endpoints
### Exercises: 7 endpoints
### User Workouts: 7 endpoints
### Nutrition: 9 endpoints
### Body Measurements: 9 endpoints

**All endpoints are RESTful and return JSON responses.**

---

**API Version**: 1.0.0
**Last Updated**: November 27, 2025
