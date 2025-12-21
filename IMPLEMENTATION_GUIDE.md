# AI Recommendation System - Implementation Guide

## 🚀 Quick Start

### Step 1: Register Routes

Add the recommendation routes to your main server file:

```javascript
// In src/server.js or src/app.js

const recommendationRoutes = require('./routes/recommendation.routes');

// Add this line with your other routes
app.use('/api/recommendations', recommendationRoutes);
```

### Step 2: Update User Model

Add the `fitness_profile` field to your User model if using Sequelize:

```javascript
// In src/models/user.model.js

// Add this field to your User model definition:
fitness_profile: {
  type: DataTypes.JSON,
  allowNull: true,
  defaultValue: null,
  comment: 'User fitness profile for AI recommendations'
}
```

Then run a migration:

```sql
-- For MySQL
ALTER TABLE users ADD COLUMN fitness_profile JSON;
```

### Step 3: Test the API

#### 1. Update Fitness Profile

```bash
POST http://localhost:5000/api/recommendations/fitness-profile
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "goals": ["weight_loss", "muscle_gain"],
  "fitnessLevel": "beginner",
  "age": 28,
  "gender": "male",
  "height": 175,
  "weight": 80,
  "targetWeight": 75,
  "activityLevel": "moderate",
  "workoutFrequency": 4,
  "availableEquipment": ["dumbbells", "resistance_band"],
  "healthConditions": [],
  "dietaryPreferences": ["vegetarian"],
  "allergens": [],
  "preferences": {
    "workoutDuration": 45,
    "workoutTime": "morning",
    "restDays": ["sunday"]
  }
}
```

#### 2. Generate Workout Plan

```bash
POST http://localhost:5000/api/recommendations/workout-plan
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "duration": "4_weeks",
  "workoutFrequency": 4
}
```

#### 3. Generate Nutrition Plan

```bash
POST http://localhost:5000/api/recommendations/nutrition-plan
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "goals": ["weight_loss"]
}
```

#### 4. Get Complete Plan (Workout + Nutrition)

```bash
POST http://localhost:5000/api/recommendations/complete-plan
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{}
```

#### 5. Get Recommended Exercises

```bash
GET http://localhost:5000/api/recommendations/exercises?category=strength&limit=10
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## 📊 Expected Response Format

### Workout Plan Response

```json
{
  "success": true,
  "data": {
    "planId": "wp_1701547200000",
    "userId": 42,
    "duration": "4_weeks",
    "goal": "weight_loss",
    "schedule": [
      {
        "day": "monday",
        "type": "workout",
        "name": "Upper Body Push",
        "focus": ["chest", "triceps"],
        "exercises": [
          {
            "id": "ex_001",
            "name": "Push-ups",
            "category": "strength",
            "sets": 3,
            "reps": 12,
            "duration": null,
            "restTime": 60,
            "videoUrl": "https://example.com/videos/pushups.mp4",
            "instructions": ["..."],
            "tips": ["..."]
          }
        ],
        "estimatedDuration": 2700,
        "estimatedCalories": 300
      },
      {
        "day": "sunday",
        "type": "rest",
        "activities": ["Recovery", "Light stretching", "Walking"]
      }
    ],
    "reasoning": "Based on your beginner fitness level and weight loss goal...",
    "progressTracking": {
      "checkInFrequency": "weekly",
      "adjustmentTriggers": ["plateau", "injury", "goal_change"]
    }
  },
  "message": "Workout plan generated successfully"
}
```

### Nutrition Plan Response

```json
{
  "success": true,
  "data": {
    "planId": "np_1701547200000",
    "userId": 42,
    "dailyCalories": 1800,
    "tdee": 2300,
    "macros": {
      "protein": 180,
      "carbs": 135,
      "fats": 60
    },
    "meals": [
      {
        "type": "breakfast",
        "time": "08:00",
        "foods": [
          {
            "id": "food_005",
            "name": "Oatmeal",
            "servingSize": "1 cup cooked (234g)",
            "calories": 166,
            "protein": 6,
            "carbs": 28,
            "fats": 3.6
          }
        ],
        "targetCalories": 450
      }
    ],
    "hydration": {
      "dailyWaterGoal": 2500,
      "unit": "ml"
    },
    "reasoning": "Your daily calorie target of 1800 kcal creates a 500-calorie deficit..."
  },
  "message": "Nutrition plan generated successfully"
}
```

---

## 🔧 Customization Options

### Adding More Exercises

Edit `backend/data/exercises_database.json`:

```json
{
  "id": "ex_021",
  "name": "Your Exercise Name",
  "slug": "your-exercise-name",
  "category": "strength",
  "muscleGroups": {
    "primary": ["chest"],
    "secondary": ["triceps"]
  },
  "equipment": ["dumbbells"],
  "difficulty": "intermediate",
  "caloriesBurnedPerMinute": 7.0,
  "sets": 3,
  "reps": 10,
  "restTime": 60,
  "instructions": ["Step 1", "Step 2"],
  "goals": ["muscle_gain", "strength"],
  "popularityScore": 85,
  "effectivenessScore": 88
}
```

After adding exercises, reload the database:

```bash
POST http://localhost:5000/api/recommendations/reload-databases
Authorization: Bearer ADMIN_JWT_TOKEN
```

### Adding More Foods

Edit `backend/data/nutrition_database.json` following the same pattern.

---

## 🎯 Integration with Frontend

### Example React Component

```javascript
import { useState } from 'react';
import axios from 'axios';

function WorkoutPlanGenerator() {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  const generatePlan = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        'http://localhost:5000/api/recommendations/workout-plan',
        {
          duration: '4_weeks',
          workoutFrequency: 4
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      setPlan(response.data.data);
    } catch (error) {
      console.error('Error generating plan:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={generatePlan} disabled={loading}>
        {loading ? 'Generating...' : 'Generate Workout Plan'}
      </button>
      
      {plan && (
        <div>
          <h2>Your Personalized Workout Plan</h2>
          {plan.schedule.map((day, index) => (
            <div key={index}>
              <h3>{day.day}</h3>
              {day.type === 'workout' ? (
                <div>
                  <p>Focus: {day.focus.join(', ')}</p>
                  <p>Duration: {Math.round(day.estimatedDuration / 60)} minutes</p>
                  <p>Calories: {Math.round(day.estimatedCalories)} kcal</p>
                  <ul>
                    {day.exercises.map((ex, i) => (
                      <li key={i}>
                        {ex.name} - {ex.sets} sets x {ex.reps} reps
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p>Rest Day - {day.activities.join(', ')}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

---

## 🔄 Workflow

```
User Registration
       ↓
Complete Fitness Profile (onboarding)
       ↓
AI Generates Personalized Plans
       ↓
User Follows Plan & Logs Progress
       ↓
System Tracks Performance
       ↓
AI Adjusts Plans Based on Progress
```

---

## 📈 Future Enhancements

### Phase 2: Collaborative Filtering

Once you have 100+ users with workout history:

```javascript
// Add to recommendation.service.js

async getCollaborativeRecommendations(userId) {
  // Find similar users
  const similarUsers = await this.findSimilarUsers(userId);
  
  // Get exercises they completed successfully
  const recommendations = await this.getSuccessfulExercises(similarUsers);
  
  return recommendations;
}
```

### Phase 3: Deep Learning

Integrate TensorFlow.js for:
- Image-based food recognition
- Form analysis from workout videos
- Predictive analytics for injury prevention

```bash
npm install @tensorflow/tfjs @tensorflow/tfjs-node
```

### Phase 4: Real-time Adaptation

```javascript
// Adjust difficulty based on completion rates
async adaptPlanDifficulty(userId) {
  const completionRate = await this.getCompletionRate(userId);
  
  if (completionRate > 0.9) {
    // Increase difficulty
    await this.increaseDifficulty(userId);
  } else if (completionRate < 0.5) {
    // Decrease difficulty
    await this.decreaseDifficulty(userId);
  }
}
```

---

## 🐛 Troubleshooting

### Issue: "Cannot find module '../data/exercises_database.json'"

**Solution:** Make sure the `data` directory exists and contains the JSON files:

```bash
ls backend/data/
# Should show: exercises_database.json, nutrition_database.json
```

### Issue: "fitness_profile is null"

**Solution:** User needs to complete their fitness profile first:

```bash
PUT /api/recommendations/fitness-profile
```

### Issue: "No exercises match user constraints"

**Solution:** The algorithm will automatically relax constraints. Check if:
1. User has realistic equipment requirements
2. Health conditions aren't too restrictive
3. Exercise database has enough variety

---

## 📚 Additional Resources

- **Exercise Database APIs:**
  - ExerciseDB: https://rapidapi.com/justin-WFnsXH_t6/api/exercisedb
  - Wger: https://wger.de/api/v2/

- **Nutrition Database APIs:**
  - USDA FoodData Central: https://fdc.nal.usda.gov/api-guide.html
  - Nutritionix: https://www.nutritionix.com/business/api

- **ML Libraries:**
  - TensorFlow.js: https://www.tensorflow.org/js
  - Brain.js: https://brain.js.org/

---

## ✅ Checklist

- [ ] Routes registered in server.js
- [ ] User model updated with fitness_profile
- [ ] JSON databases created and populated
- [ ] Test API endpoints with Postman/Thunder Client
- [ ] Frontend integration started
- [ ] User onboarding flow for fitness profile
- [ ] Feedback collection system implemented

---

**Ready to revolutionize fitness with AI! 🚀💪**
