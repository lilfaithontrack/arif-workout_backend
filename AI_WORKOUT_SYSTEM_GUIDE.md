# AI Workout Plan Generator System

## Overview

An advanced AI-powered system that generates personalized workout and nutrition plans based on comprehensive user surveys. The system analyzes user data including fitness level, goals, available equipment, physical limitations, and dietary preferences to create optimal training programs.

---

## Features

### 🤖 AI-Powered Plan Generation
- **Intelligent Algorithm**: Rule-based AI that considers 15+ factors
- **Personalization**: Custom plans based on individual needs
- **Progressive Overload**: Automatic progression scheduling
- **Nutrition Integration**: Meal plans using nutrition database
- **Confidence Scoring**: AI confidence level for each plan (0-100)

### 📋 Comprehensive User Survey
- Personal metrics (age, gender, height, weight)
- Fitness goals (weight loss, muscle gain, strength, endurance, etc.)
- Current fitness level and experience
- Activity level and workout preferences
- Available equipment and location
- Physical limitations and injuries
- Dietary preferences
- Sleep and stress levels
- Optional: Body composition and performance metrics

### 💪 Workout Plan Features
- Multiple training splits (full body, upper/lower, PPL, body part split)
- Exercise selection based on equipment and preferences
- Sets, reps, rest periods, and tempo
- Warm-up and cool-down routines
- Progressive overload strategies
- Weekly focus and intensity variations
- 4-24 week programs

### 🍽️ Nutrition Plan Features
- Calorie and macro calculations (BMR, TDEE)
- Personalized macro split based on goals
- Weekly meal plans using nutrition database
- Dietary preference filtering (vegan, vegetarian, keto, etc.)
- Meal timing recommendations
- Hydration guidelines
- Supplement recommendations

---

## Database Schema

### UserSurvey Table
```sql
CREATE TABLE user_surveys (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT NOT NULL,
  
  -- Personal Info
  age INT NOT NULL,
  gender ENUM('male', 'female', 'other'),
  height FLOAT NOT NULL,
  weight FLOAT NOT NULL,
  targetWeight FLOAT,
  
  -- Goals
  primaryGoal ENUM('weight_loss', 'muscle_gain', 'strength', 'endurance', ...),
  secondaryGoals JSON,
  
  -- Fitness Level
  fitnessLevel ENUM('beginner', 'intermediate', 'advanced', 'expert'),
  yearsOfExperience FLOAT,
  
  -- Activity
  activityLevel ENUM('sedentary', 'lightly_active', 'moderately_active', ...),
  workoutFrequency INT,
  workoutDuration INT,
  
  -- Equipment & Location
  workoutLocation ENUM('gym', 'home', 'outdoor', 'hybrid'),
  availableEquipment JSON,
  
  -- Limitations
  injuries JSON,
  medicalConditions JSON,
  limitations TEXT,
  
  -- Preferences
  preferredExerciseTypes JSON,
  dislikedExercises JSON,
  dietaryPreference ENUM('omnivore', 'vegetarian', 'vegan', ...),
  
  -- Metrics
  bodyFatPercentage FLOAT,
  benchPressMax FLOAT,
  squatMax FLOAT,
  deadliftMax FLOAT,
  
  -- AI Metadata
  aiScore FLOAT,
  lastPlanGenerated DATETIME,
  isActive BOOLEAN,
  
  createdAt DATETIME,
  updatedAt DATETIME
);
```

### AIWorkoutPlan Table
```sql
CREATE TABLE ai_workout_plans (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT NOT NULL,
  surveyId INT NOT NULL,
  
  -- Plan Info
  planName VARCHAR(255),
  planDescription TEXT,
  durationWeeks INT,
  workoutsPerWeek INT,
  
  -- Structure
  planStructure JSON,  -- Complete weekly workout structure
  exerciseDistribution JSON,
  
  -- Nutrition
  nutritionPlan JSON,
  mealPlan JSON,
  
  -- Progression
  progressionStrategy ENUM('linear', 'undulating', 'block_periodization', ...),
  progressionSchedule JSON,
  
  -- AI Metadata
  aiVersion VARCHAR(50),
  confidenceScore FLOAT,
  generationMethod ENUM('rule_based', 'ml_model', 'hybrid'),
  personalizationFactors JSON,
  expectedOutcomes JSON,
  
  -- Tracking
  startDate DATETIME,
  endDate DATETIME,
  currentWeek INT DEFAULT 1,
  completionRate FLOAT DEFAULT 0,
  
  -- Status
  status ENUM('draft', 'active', 'paused', 'completed', 'abandoned'),
  isActive BOOLEAN,
  
  -- Feedback
  userRating INT,
  userFeedback TEXT,
  
  -- Admin Review
  reviewedBy INT,
  reviewNotes TEXT,
  isApproved BOOLEAN,
  
  createdAt DATETIME,
  updatedAt DATETIME
);
```

---

## API Endpoints

### User Survey

#### Submit Survey
```http
POST /api/ai-workout/survey
Authorization: Bearer <token>

Body:
{
  "age": 28,
  "gender": "male",
  "height": 180,
  "weight": 85,
  "targetWeight": 80,
  "primaryGoal": "weight_loss",
  "secondaryGoals": ["muscle_gain", "endurance"],
  "fitnessLevel": "intermediate",
  "yearsOfExperience": 3,
  "activityLevel": "moderately_active",
  "workoutFrequency": 4,
  "workoutDuration": 60,
  "workoutLocation": "gym",
  "availableEquipment": ["dumbbells", "barbell", "machines", "cardio"],
  "injuries": [],
  "medicalConditions": [],
  "preferredExerciseTypes": ["strength", "cardio"],
  "dislikedExercises": [],
  "dietaryPreference": "flexible",
  "averageSleepHours": 7,
  "stressLevel": "moderate"
}
```

#### Get Active Survey
```http
GET /api/ai-workout/survey/active
Authorization: Bearer <token>
```

### Plan Generation

#### Generate AI Plan
```http
POST /api/ai-workout/generate
Authorization: Bearer <token>

Body:
{
  "surveyId": 1
}

Response:
{
  "success": true,
  "message": "AI workout plan generated successfully",
  "data": {
    "id": 1,
    "planName": "Intermediate Weight Loss Program",
    "planDescription": "A personalized 4-day per week program...",
    "durationWeeks": 12,
    "workoutsPerWeek": 4,
    "planStructure": {...},
    "nutritionPlan": {...},
    "confidenceScore": 85,
    "expectedOutcomes": {
      "weightChange": -6,
      "estimatedBodyFatChange": -5,
      "timeframe": "12 weeks"
    }
  }
}
```

### Plan Management

#### Get Active Plan
```http
GET /api/ai-workout/plans/active
Authorization: Bearer <token>
```

#### Get All User Plans
```http
GET /api/ai-workout/plans
Authorization: Bearer <token>
```

#### Get Plan by ID
```http
GET /api/ai-workout/plans/:id
Authorization: Bearer <token>
```

#### Update Plan Status
```http
PATCH /api/ai-workout/plans/:id/status
Authorization: Bearer <token>

Body:
{
  "status": "active"  // draft, active, paused, completed, abandoned
}
```

#### Update Progress
```http
PATCH /api/ai-workout/plans/:id/progress
Authorization: Bearer <token>

Body:
{
  "currentWeek": 3,
  "completionRate": 75
}
```

#### Rate Plan
```http
POST /api/ai-workout/plans/:id/rate
Authorization: Bearer <token>

Body:
{
  "rating": 5,
  "feedback": "Great plan! Seeing amazing results."
}
```

### Admin Endpoints

#### Get All Plans
```http
GET /api/ai-workout/admin/plans?page=1&limit=20&status=active
Authorization: Bearer <admin-token>
```

#### Review Plan
```http
PATCH /api/ai-workout/admin/plans/:id/review
Authorization: Bearer <admin-token>

Body:
{
  "isApproved": true,
  "reviewNotes": "Plan looks good, approved for user."
}
```

#### Get Statistics
```http
GET /api/ai-workout/admin/statistics
Authorization: Bearer <admin-token>

Response:
{
  "success": true,
  "data": {
    "totalPlans": 150,
    "activePlans": 85,
    "completedPlans": 45,
    "totalSurveys": 200,
    "avgConfidence": 82,
    "avgCompletion": 68
  }
}
```

---

## AI Algorithm

### Plan Generation Process

1. **Calculate User Metrics**
   - BMI calculation
   - BMR (Basal Metabolic Rate) using Mifflin-St Jeor equation
   - TDEE (Total Daily Energy Expenditure)
   - Target calories based on goals
   - Macro distribution

2. **Determine Training Split**
   - Frequency-based selection
   - Experience level consideration
   - Goal alignment
   - Options: Full Body, Upper/Lower, PPL, Body Part Split

3. **Select Exercises**
   - Equipment filtering
   - Difficulty matching
   - Muscle group distribution
   - User preference consideration
   - Injury/limitation avoidance

4. **Create Workout Structure**
   - Weekly plan generation
   - Daily workout creation
   - Exercise formatting (sets, reps, rest)
   - Progressive overload application

5. **Generate Nutrition Plan**
   - Calorie and macro targets
   - Meal plan creation
   - Dietary preference filtering
   - Meal timing optimization

6. **Create Progression Schedule**
   - Intensity variations
   - Volume progression
   - Deload weeks
   - Phase planning

7. **Calculate Confidence Score**
   - Data completeness
   - Exercise availability
   - Equipment match
   - Medical considerations

8. **Predict Outcomes**
   - Weight change estimation
   - Body composition predictions
   - Strength gain projections

### Training Splits

**Full Body** (1-3 days/week)
- All major muscle groups each session
- Best for beginners
- Efficient for time-limited users

**Upper/Lower** (4 days/week)
- Upper body: Chest, back, shoulders, arms
- Lower body: Legs, glutes, core
- Balanced approach

**Push/Pull/Legs** (3-6 days/week)
- Push: Chest, shoulders, triceps
- Pull: Back, biceps
- Legs: Quads, hamstrings, glutes, calves
- Popular for intermediate/advanced

**Body Part Split** (5-6 days/week)
- Individual muscle groups per day
- High volume per muscle
- Advanced lifters

### Macro Calculations

**Muscle Gain**
- Protein: 30%
- Carbs: 45%
- Fats: 25%
- Calorie surplus: +300

**Weight Loss**
- Protein: 35%
- Carbs: 30%
- Fats: 35%
- Calorie deficit: -500

**Strength**
- Protein: 30%
- Carbs: 40%
- Fats: 30%
- Maintenance calories

**Endurance**
- Protein: 20%
- Carbs: 55%
- Fats: 25%
- Maintenance calories

---

## Plan Structure Example

```json
{
  "week1": {
    "day1": {
      "dayNumber": 1,
      "weekNumber": 1,
      "focus": "Push",
      "warmUp": {
        "duration": 10,
        "activities": ["5 minutes light cardio", "Dynamic stretching", "Push-specific mobility"]
      },
      "exercises": [
        {
          "exerciseId": 1,
          "name": "Barbell Bench Press",
          "sets": 4,
          "reps": "8-12",
          "rest": 90,
          "tempo": "2-0-2-1",
          "notes": "Focus on controlled movement",
          "progressionNotes": "Focus on form and technique"
        },
        {
          "exerciseId": 5,
          "name": "Overhead Press",
          "sets": 3,
          "reps": "10-12",
          "rest": 90,
          "tempo": "2-0-2-1"
        }
      ],
      "coolDown": {
        "duration": 10,
        "activities": ["5 minutes light cardio", "Static stretching", "Foam rolling (optional)"]
      },
      "estimatedDuration": 60,
      "notes": "Week 1 - Push focus. Maintain proper form and gradually increase intensity."
    }
  }
}
```

---

## Usage Guide

### For Users

1. **Complete Survey**
   - Fill out comprehensive fitness assessment
   - Be honest about fitness level and limitations
   - Specify available equipment

2. **Generate Plan**
   - Submit survey
   - AI generates personalized plan
   - Review plan details and confidence score

3. **Start Training**
   - Activate plan
   - Follow weekly structure
   - Track progress

4. **Monitor Progress**
   - Update completion rate
   - Log workouts
   - Adjust as needed

5. **Provide Feedback**
   - Rate plan effectiveness
   - Share results
   - Request adjustments

### For Admins

1. **Monitor Plans**
   - View all generated plans
   - Check confidence scores
   - Review user feedback

2. **Review Plans**
   - Approve/reject plans
   - Add review notes
   - Make recommendations

3. **Analyze Statistics**
   - Track success rates
   - Monitor completion rates
   - Identify improvements

---

## Integration with Existing Systems

### Exercise Database
- AI selects from existing exercises
- Filters by equipment and difficulty
- Considers muscle groups

### Nutrition Database
- Uses 100+ food items
- Filters by dietary preferences
- Creates balanced meal plans

### User Workouts
- Plans can be logged as workouts
- Progress tracking integration
- Performance analytics

---

## Future Enhancements

- [ ] Machine learning model training
- [ ] Real-time plan adaptation based on performance
- [ ] Video exercise demonstrations
- [ ] Social features (share plans, compare progress)
- [ ] Wearable device integration
- [ ] Advanced analytics and insights
- [ ] Coach/trainer collaboration features
- [ ] Mobile app with offline support

---

## Testing

### Test Survey Submission
```bash
curl -X POST http://localhost:5000/api/ai-workout/survey \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "age": 28,
    "gender": "male",
    "height": 180,
    "weight": 85,
    "primaryGoal": "muscle_gain",
    "fitnessLevel": "intermediate",
    "workoutFrequency": 4,
    "workoutDuration": 60,
    "workoutLocation": "gym",
    "availableEquipment": ["dumbbells", "barbell", "machines"]
  }'
```

### Test Plan Generation
```bash
curl -X POST http://localhost:5000/api/ai-workout/generate \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"surveyId": 1}'
```

---

## Files Created

### Backend
1. `models/usersurvey.model.js` - User survey model
2. `models/aiworkoutplan.model.js` - AI workout plan model
3. `services/ai-workout-generator.service.js` - AI algorithm (1000+ lines)
4. `controllers/aiworkout.controller.js` - API controllers
5. `routes/aiworkout.routes.js` - API routes

### Documentation
1. `AI_WORKOUT_SYSTEM_GUIDE.md` - This comprehensive guide

---

## Support

For questions or issues:
- Check API documentation
- Review example requests
- Contact development team

---

**Version**: 1.0.0  
**Last Updated**: December 11, 2024  
**Status**: ✅ Production Ready
