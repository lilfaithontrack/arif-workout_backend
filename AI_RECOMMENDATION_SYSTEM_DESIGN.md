# AI-Powered Recommendation System Design

## 🎯 Overview

Transform your manual admin-created workout/nutrition system into an **AI-driven personalized recommendation engine** that automatically suggests exercises, workouts, and nutrition plans based on user profiles, goals, and progress.

---

## 📊 Recommended Approach: **Hybrid System**

### **Best Solution: JSON-Based Data + ML Algorithm**

**Why JSON over CSV/MySQL for ML data?**
- ✅ **Flexible schema** - Easy to add new exercise attributes
- ✅ **Nested data** - Store complex relationships (muscle groups, equipment, variations)
- ✅ **Fast reads** - Load entire dataset into memory for ML processing
- ✅ **Version control** - Track changes in Git
- ✅ **Easy updates** - Admin can update via API, auto-generates JSON

**Why keep MySQL for user data?**
- ✅ **Transactional integrity** - User profiles, progress, subscriptions
- ✅ **Relational queries** - Complex joins for analytics
- ✅ **Existing infrastructure** - Your current system works well

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     USER REQUEST                            │
│  "Give me a workout plan for weight loss, beginner level"  │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│              AI RECOMMENDATION ENGINE                       │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  1. User Profile Analysis (MySQL)                   │   │
│  │     - Age, gender, fitness level, goals             │   │
│  │     - Health conditions, preferences                │   │
│  │     - Past workout history & progress               │   │
│  └─────────────────────────────────────────────────────┘   │
│                      │                                      │
│                      ▼                                      │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  2. Load Exercise/Nutrition Database (JSON)         │   │
│  │     - 500+ exercises with metadata                  │   │
│  │     - 1000+ nutrition items with macros             │   │
│  │     - Pre-calculated similarity scores              │   │
│  └─────────────────────────────────────────────────────┘   │
│                      │                                      │
│                      ▼                                      │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  3. ML Algorithm (Content-Based Filtering)          │   │
│  │     - Feature matching (difficulty, muscle groups)  │   │
│  │     - Goal alignment (weight loss, muscle gain)     │   │
│  │     - Progressive overload calculation              │   │
│  └─────────────────────────────────────────────────────┘   │
│                      │                                      │
│                      ▼                                      │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  4. Personalized Plan Generation                    │   │
│  │     - 7-day workout schedule                        │   │
│  │     - Daily nutrition targets                       │   │
│  │     - Progressive difficulty increase               │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                  RESPONSE (JSON)                            │
│  {                                                          │
│    "workoutPlan": [...],                                    │
│    "nutritionPlan": [...],                                  │
│    "reasoning": "Based on your beginner level..."          │
│  }                                                          │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 Data Structure Design

### **1. Exercise Database (JSON)**

**File: `data/exercises_database.json`**

```json
{
  "version": "1.0.0",
  "lastUpdated": "2024-12-02T20:00:00Z",
  "totalExercises": 500,
  "exercises": [
    {
      "id": "ex_001",
      "name": "Push-ups",
      "slug": "push-ups",
      "category": "strength",
      "subcategory": "bodyweight",
      "muscleGroups": {
        "primary": ["chest", "triceps"],
        "secondary": ["shoulders", "core"]
      },
      "equipment": ["none"],
      "difficulty": "beginner",
      "caloriesBurnRate": 7.5,
      "duration": 300,
      "sets": 3,
      "reps": 10,
      "restTime": 60,
      "instructions": [
        "Start in plank position",
        "Lower body until chest nearly touches floor",
        "Push back up to starting position"
      ],
      "videoUrl": "https://...",
      "imageUrl": "https://...",
      "tips": ["Keep core tight", "Don't let hips sag"],
      "variations": [
        {"name": "Knee Push-ups", "difficulty": "easier"},
        {"name": "Diamond Push-ups", "difficulty": "harder"}
      ],
      "goals": ["muscle_gain", "strength", "endurance"],
      "contraindications": ["shoulder_injury", "wrist_pain"],
      "tags": ["upper_body", "no_equipment", "home_workout"],
      "popularityScore": 95,
      "effectivenessScore": 88
    }
  ]
}
```

### **2. Nutrition Database (JSON)**

**File: `data/nutrition_database.json`**

```json
{
  "version": "1.0.0",
  "lastUpdated": "2024-12-02T20:00:00Z",
  "totalFoods": 1000,
  "foods": [
    {
      "id": "food_001",
      "name": "Grilled Chicken Breast",
      "category": "protein",
      "servingSize": "100g",
      "macros": {
        "calories": 165,
        "protein": 31,
        "carbs": 0,
        "fats": 3.6,
        "fiber": 0,
        "sugar": 0
      },
      "micronutrients": {
        "vitamins": {
          "B6": 0.5,
          "B12": 0.3,
          "niacin": 14
        },
        "minerals": {
          "iron": 1,
          "zinc": 1.5,
          "selenium": 27
        }
      },
      "dietaryInfo": {
        "isVegetarian": false,
        "isVegan": false,
        "isGlutenFree": true,
        "isDairyFree": true,
        "isKeto": true,
        "allergens": []
      },
      "mealTypes": ["lunch", "dinner", "post_workout"],
      "goals": ["muscle_gain", "weight_loss", "maintenance"],
      "preparationTime": 15,
      "cost": "medium",
      "tags": ["high_protein", "low_carb", "lean"],
      "popularityScore": 92
    }
  ],
  "mealPlans": [
    {
      "id": "meal_plan_001",
      "name": "High Protein Weight Loss",
      "goal": "weight_loss",
      "dailyCalories": 1800,
      "macroRatio": {
        "protein": 40,
        "carbs": 30,
        "fats": 30
      },
      "meals": [
        {
          "type": "breakfast",
          "foods": ["food_045", "food_102", "food_203"],
          "totalCalories": 450
        }
      ]
    }
  ]
}
```

### **3. User Profile Schema (MySQL - Enhanced)**

```sql
-- Add new columns to existing users table
ALTER TABLE users ADD COLUMN fitness_profile JSON;

-- Example fitness_profile structure:
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
  "healthConditions": ["knee_pain"],
  "dietaryPreferences": ["vegetarian"],
  "allergens": ["nuts"],
  "experienceLevel": {
    "strength": "beginner",
    "cardio": "intermediate",
    "flexibility": "beginner"
  },
  "preferences": {
    "workoutDuration": 45,
    "workoutTime": "morning",
    "restDays": ["sunday"]
  }
}
```

---

## 🤖 ML Algorithm Implementation

### **Approach 1: Content-Based Filtering (Recommended for Start)**

**Why?**
- ✅ No cold start problem
- ✅ Works immediately with new users
- ✅ Explainable recommendations
- ✅ No need for large user base

**Implementation:**

```javascript
// File: src/services/recommendation.service.js

class RecommendationEngine {
  constructor() {
    this.exerciseDB = require('../../data/exercises_database.json');
    this.nutritionDB = require('../../data/nutrition_database.json');
  }

  /**
   * Generate personalized workout plan
   */
  async generateWorkoutPlan(userId, preferences = {}) {
    // 1. Get user profile
    const user = await User.findByPk(userId);
    const profile = user.fitness_profile;

    // 2. Filter exercises by constraints
    let candidates = this.exerciseDB.exercises.filter(ex => {
      return this.matchesDifficulty(ex, profile.fitnessLevel) &&
             this.hasEquipment(ex, profile.availableEquipment) &&
             !this.hasContraindication(ex, profile.healthConditions) &&
             this.alignsWithGoals(ex, profile.goals);
    });

    // 3. Score each exercise
    candidates = candidates.map(ex => ({
      ...ex,
      score: this.calculateExerciseScore(ex, profile)
    }));

    // 4. Sort by score and diversify
    candidates.sort((a, b) => b.score - a.score);
    
    // 5. Create weekly plan with progressive overload
    const weeklyPlan = this.createWeeklySchedule(candidates, profile);

    return weeklyPlan;
  }

  /**
   * Calculate exercise score based on user profile
   */
  calculateExerciseScore(exercise, profile) {
    let score = 0;

    // Goal alignment (40% weight)
    const goalMatch = exercise.goals.filter(g => 
      profile.goals.includes(g)
    ).length;
    score += (goalMatch / profile.goals.length) * 40;

    // Difficulty match (20% weight)
    const difficultyMatch = this.getDifficultyMatch(
      exercise.difficulty, 
      profile.fitnessLevel
    );
    score += difficultyMatch * 20;

    // Muscle group diversity (20% weight)
    score += this.getMuscleGroupDiversity(exercise) * 20;

    // Popularity & effectiveness (20% weight)
    score += (exercise.popularityScore * 0.5 + 
              exercise.effectivenessScore * 0.5) * 0.2;

    return score;
  }

  /**
   * Create 7-day workout schedule
   */
  createWeeklySchedule(exercises, profile) {
    const schedule = [];
    const daysPerWeek = profile.workoutFrequency || 4;
    const restDays = profile.preferences.restDays || ['sunday'];

    // Distribute exercises across muscle groups
    const muscleGroupRotation = [
      ['chest', 'triceps'],
      ['back', 'biceps'],
      ['legs', 'glutes'],
      ['shoulders', 'core']
    ];

    for (let day = 0; day < 7; day++) {
      const dayName = ['monday', 'tuesday', 'wednesday', 'thursday', 
                       'friday', 'saturday', 'sunday'][day];
      
      if (restDays.includes(dayName) || schedule.length >= daysPerWeek) {
        schedule.push({ day: dayName, type: 'rest' });
        continue;
      }

      // Select exercises for this day
      const targetMuscles = muscleGroupRotation[day % muscleGroupRotation.length];
      const dayExercises = this.selectExercisesForDay(
        exercises, 
        targetMuscles, 
        profile.preferences.workoutDuration
      );

      schedule.push({
        day: dayName,
        type: 'workout',
        focus: targetMuscles,
        exercises: dayExercises,
        estimatedDuration: this.calculateTotalDuration(dayExercises),
        estimatedCalories: this.calculateTotalCalories(dayExercises)
      });
    }

    return schedule;
  }

  /**
   * Generate nutrition plan
   */
  async generateNutritionPlan(userId, preferences = {}) {
    const user = await User.findByPk(userId);
    const profile = user.fitness_profile;

    // 1. Calculate daily calorie needs
    const tdee = this.calculateTDEE(profile);
    const targetCalories = this.adjustForGoal(tdee, profile.goals);

    // 2. Calculate macro targets
    const macros = this.calculateMacros(targetCalories, profile.goals);

    // 3. Filter foods by dietary preferences
    let foods = this.nutritionDB.foods.filter(food => {
      return this.matchesDiet(food, profile.dietaryPreferences) &&
             !this.hasAllergen(food, profile.allergens) &&
             this.alignsWithGoals(food, profile.goals);
    });

    // 4. Create meal plan
    const mealPlan = this.createDailyMealPlan(foods, macros, profile);

    return {
      dailyCalories: targetCalories,
      macros: macros,
      meals: mealPlan,
      hydration: this.calculateWaterIntake(profile)
    };
  }

  /**
   * Calculate TDEE (Total Daily Energy Expenditure)
   */
  calculateTDEE(profile) {
    // Mifflin-St Jeor Equation
    let bmr;
    if (profile.gender === 'male') {
      bmr = 10 * profile.weight + 6.25 * profile.height - 5 * profile.age + 5;
    } else {
      bmr = 10 * profile.weight + 6.25 * profile.height - 5 * profile.age - 161;
    }

    // Activity multiplier
    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9
    };

    return bmr * (activityMultipliers[profile.activityLevel] || 1.55);
  }

  /**
   * Adjust calories based on goal
   */
  adjustForGoal(tdee, goals) {
    if (goals.includes('weight_loss')) {
      return tdee - 500; // 500 calorie deficit
    } else if (goals.includes('muscle_gain')) {
      return tdee + 300; // 300 calorie surplus
    }
    return tdee; // maintenance
  }

  /**
   * Calculate macro distribution
   */
  calculateMacros(calories, goals) {
    let proteinPercent, carbsPercent, fatsPercent;

    if (goals.includes('muscle_gain')) {
      proteinPercent = 30;
      carbsPercent = 45;
      fatsPercent = 25;
    } else if (goals.includes('weight_loss')) {
      proteinPercent = 40;
      carbsPercent = 30;
      fatsPercent = 30;
    } else {
      proteinPercent = 25;
      carbsPercent = 50;
      fatsPercent = 25;
    }

    return {
      protein: Math.round((calories * proteinPercent / 100) / 4),
      carbs: Math.round((calories * carbsPercent / 100) / 4),
      fats: Math.round((calories * fatsPercent / 100) / 9)
    };
  }
}

module.exports = new RecommendationEngine();
```

### **Approach 2: Collaborative Filtering (Future Enhancement)**

Once you have enough user data:

```javascript
/**
 * Find similar users and recommend what worked for them
 */
async findSimilarUsers(userId) {
  const user = await User.findByPk(userId);
  const profile = user.fitness_profile;

  // Find users with similar profiles
  const similarUsers = await User.findAll({
    where: {
      id: { [Op.ne]: userId }
    }
  });

  // Calculate similarity scores
  const scored = similarUsers.map(other => ({
    user: other,
    similarity: this.calculateUserSimilarity(profile, other.fitness_profile)
  }));

  // Return top 10 most similar
  return scored.sort((a, b) => b.similarity - a.similarity).slice(0, 10);
}

/**
 * Calculate similarity between two user profiles
 */
calculateUserSimilarity(profile1, profile2) {
  let score = 0;

  // Age similarity (20%)
  const ageDiff = Math.abs(profile1.age - profile2.age);
  score += Math.max(0, 20 - ageDiff) / 20 * 20;

  // Goal overlap (30%)
  const goalOverlap = profile1.goals.filter(g => 
    profile2.goals.includes(g)
  ).length;
  score += (goalOverlap / Math.max(profile1.goals.length, profile2.goals.length)) * 30;

  // Fitness level match (25%)
  if (profile1.fitnessLevel === profile2.fitnessLevel) score += 25;

  // BMI similarity (25%)
  const bmi1 = profile1.weight / ((profile1.height / 100) ** 2);
  const bmi2 = profile2.weight / ((profile2.height / 100) ** 2);
  const bmiDiff = Math.abs(bmi1 - bmi2);
  score += Math.max(0, 25 - bmiDiff * 5);

  return score;
}
```

---

## 🚀 Implementation Plan

### **Phase 1: Data Collection (Week 1-2)**

1. **Create Exercise Database**
   ```bash
   # Create data directory
   mkdir backend/data
   
   # Create initial JSON files
   touch backend/data/exercises_database.json
   touch backend/data/nutrition_database.json
   ```

2. **Populate with 100+ exercises** (can use web scraping or manual entry)
   - Use existing Exercise model data
   - Add ML-specific fields (goals, tags, scores)

3. **Populate with 200+ nutrition items**
   - Common foods with accurate macros
   - Use USDA database or similar

### **Phase 2: ML Service Development (Week 3-4)**

1. **Create recommendation service**
   ```bash
   touch backend/src/services/recommendation.service.js
   ```

2. **Implement algorithms**
   - Content-based filtering
   - Scoring functions
   - Plan generation logic

3. **Add user profile enhancement**
   - Update User model with fitness_profile
   - Create onboarding flow

### **Phase 3: API Integration (Week 5)**

1. **Create new endpoints**
   ```javascript
   // backend/src/routes/recommendation.routes.js
   
   router.post('/api/recommendations/workout-plan', 
     authenticate, 
     recommendationController.generateWorkoutPlan
   );
   
   router.post('/api/recommendations/nutrition-plan', 
     authenticate, 
     recommendationController.generateNutritionPlan
   );
   
   router.get('/api/recommendations/exercises', 
     authenticate, 
     recommendationController.getRecommendedExercises
   );
   ```

2. **Create controller**
   ```bash
   touch backend/src/controllers/recommendation.controller.js
   ```

### **Phase 4: Testing & Refinement (Week 6)**

1. **Test with various user profiles**
2. **Tune scoring algorithms**
3. **Add A/B testing capability**

### **Phase 5: Advanced Features (Week 7+)**

1. **Collaborative filtering** (once you have user data)
2. **Deep learning models** (for image-based food recognition)
3. **Real-time adaptation** (adjust based on progress)

---

## 📦 Required NPM Packages

```bash
npm install --save \
  ml-matrix \          # Matrix operations for ML
  natural \            # NLP for text analysis
  compromise \         # Text processing
  lodash \             # Utility functions
  date-fns             # Date calculations
```

---

## 🎯 Data Sources for Populating Databases

### **Exercise Data:**
1. **ExerciseDB API** - https://rapidapi.com/justin-WFnsXH_t6/api/exercisedb
2. **Wger API** - https://wger.de/api/v2/ (Open source)
3. **Manual curation** from fitness websites

### **Nutrition Data:**
1. **USDA FoodData Central** - https://fdc.nal.usda.gov/api-guide.html
2. **Nutritionix API** - https://www.nutritionix.com/business/api
3. **Open Food Facts** - https://world.openfoodfacts.org/data

---

## 📊 Example API Response

```json
{
  "success": true,
  "data": {
    "workoutPlan": {
      "planId": "wp_12345",
      "userId": 42,
      "duration": "4_weeks",
      "goal": "weight_loss",
      "schedule": [
        {
          "week": 1,
          "days": [
            {
              "day": "monday",
              "type": "workout",
              "focus": ["chest", "triceps"],
              "exercises": [
                {
                  "id": "ex_001",
                  "name": "Push-ups",
                  "sets": 3,
                  "reps": 12,
                  "restTime": 60,
                  "videoUrl": "https://...",
                  "reasoning": "Great for building upper body strength as a beginner"
                }
              ],
              "estimatedDuration": 45,
              "estimatedCalories": 300
            }
          ]
        }
      ]
    },
    "nutritionPlan": {
      "planId": "np_12345",
      "dailyCalories": 1800,
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
              "id": "food_045",
              "name": "Oatmeal with berries",
              "servingSize": "1 cup",
              "calories": 300,
              "protein": 10,
              "carbs": 54,
              "fats": 6
            }
          ],
          "totalCalories": 450
        }
      ],
      "hydration": {
        "dailyWaterGoal": 2500,
        "unit": "ml"
      }
    },
    "reasoning": {
      "workout": "Based on your beginner fitness level and weight loss goal, we've created a balanced program focusing on compound movements...",
      "nutrition": "Your calorie target of 1800 creates a 500-calorie deficit for healthy weight loss of 0.5kg per week..."
    },
    "progressTracking": {
      "checkInFrequency": "weekly",
      "adjustmentTriggers": ["plateau", "injury", "goal_change"]
    }
  }
}
```

---

## 🔄 Continuous Improvement

### **Feedback Loop:**

```javascript
// Track user engagement
await WorkoutFeedback.create({
  userId: user.id,
  workoutPlanId: plan.id,
  exerciseId: exercise.id,
  rating: 4,
  difficulty: 'too_easy',
  completion: true,
  notes: 'Need more challenging exercises'
});

// Use feedback to improve recommendations
async function adjustRecommendations(userId) {
  const feedback = await WorkoutFeedback.findAll({
    where: { userId },
    order: [['createdAt', 'DESC']],
    limit: 20
  });

  // Analyze patterns
  const avgRating = feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length;
  const tooEasy = feedback.filter(f => f.difficulty === 'too_easy').length;

  // Adjust user profile
  if (tooEasy > 10) {
    // Increase difficulty level
    await user.update({
      fitness_profile: {
        ...user.fitness_profile,
        fitnessLevel: 'intermediate'
      }
    });
  }
}
```

---

## 💡 Summary & Recommendation

### **Start Simple, Scale Smart:**

1. **Phase 1 (Months 1-2):** 
   - ✅ JSON-based exercise/nutrition databases
   - ✅ Content-based filtering algorithm
   - ✅ Basic personalization (difficulty, goals, equipment)

2. **Phase 2 (Months 3-4):**
   - ✅ User feedback collection
   - ✅ Progressive overload automation
   - ✅ A/B testing different algorithms

3. **Phase 3 (Months 5-6):**
   - ✅ Collaborative filtering (user similarity)
   - ✅ Advanced ML models (TensorFlow.js)
   - ✅ Real-time adaptation

### **Why This Approach Wins:**

| Aspect | JSON + Content-Based | Pure MySQL | CSV Files |
|--------|---------------------|------------|-----------|
| **Development Speed** | ⚡ Fast | 🐌 Slow | ⚡ Fast |
| **Flexibility** | ✅ High | ❌ Low | ✅ High |
| **Performance** | ✅ Excellent | ⚠️ Good | ✅ Excellent |
| **Scalability** | ✅ Good (to 10k exercises) | ✅ Excellent | ❌ Poor |
| **ML Integration** | ✅ Easy | ⚠️ Moderate | ✅ Easy |
| **Version Control** | ✅ Yes | ❌ No | ✅ Yes |
| **Admin Updates** | ✅ API + Auto-gen | ✅ Direct DB | ❌ Manual |

---

## 🚀 Next Steps

1. **Review this design** with your team
2. **Decide on data sources** (API vs manual curation)
3. **Start with 50-100 exercises** as MVP
4. **Implement Phase 1** (basic content-based filtering)
5. **Test with real users** and collect feedback
6. **Iterate and improve** based on data

**Ready to build the future of personalized fitness! 💪**
