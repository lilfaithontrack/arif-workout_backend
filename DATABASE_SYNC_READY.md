# ✅ Database Sync - Ready to Create Tables!

## 🎯 Current Status

**Models**: ✅ 16 models ready
**Relationships**: ✅ All defined
**Database Config**: ✅ Auto-sync enabled
**Scripts**: ✅ Created

---

## 📊 Tables to be Created (16)

### Core Tables (8):
1. ✅ **users** - User accounts and authentication
2. ✅ **otps** - One-time passwords
3. ✅ **categories** - Workout/course categories
4. ✅ **subcategories** - Category subdivisions
5. ✅ **instructor_profiles** - Instructor details
6. ✅ **packages** - Subscription packages
7. ✅ **payments** - Payment transactions
8. ✅ **subscriptions** - User subscriptions

### Fitness Tables (8):
9. ✅ **workout_plans** - Personalized workout programs
10. ✅ **exercises** - Exercise library
11. ✅ **user_workouts** - Logged workout sessions
12. ✅ **nutrition_logs** - Meal tracking
13. ✅ **body_measurements** - Body composition
14. ✅ **fitness_goals** - Goal tracking
15. ✅ **fitness_assessments** - Fitness evaluations
16. ✅ **achievements** - Gamification badges

---

## 🚀 Quick Start (3 Commands)

### 1. Sync Database (Create Tables)
```bash
node src/scripts/sync-database.js
```

**This will:**
- ✅ Connect to MySQL
- ✅ Create all 16 tables
- ✅ Set up foreign keys
- ✅ Create indexes
- ✅ Show table details

### 2. Create Admin User
```bash
node src/scripts/create-admin.js
```

**Default credentials:**
- Email: `admin@arifworkout.com`
- Password: `admin123`

### 3. Seed Sample Data
```bash
node src/scripts/seed-exercises.js
```

**Adds 10 exercises:**
- Barbell Bench Press
- Push-Ups
- Deadlift
- Pull-Ups
- Barbell Squat
- Running
- Jump Rope
- Plank
- Yoga Sun Salutation
- Burpees

---

## 📋 Alternative: Start Server (Auto-Sync)

```bash
npm run dev
```

The server will automatically:
1. Connect to MySQL
2. Sync all tables (with `alter: true`)
3. Show table count
4. Start API server on port 5000

---

## 🔍 Verify Database

### Check Database Status:
```bash
node src/scripts/check-database.js
```

**This shows:**
- Database connection status
- List of all tables
- Row counts
- Foreign keys count
- Indexes count
- Data summary

### Manual Verification (MySQL):
```sql
USE arif_workout;
SHOW TABLES;

-- Should show 16 tables
```

---

## 📝 Prerequisites

### 1. MySQL Running
```bash
# Windows - Check if MySQL is running
net start | findstr MySQL

# Or start MySQL
net start MySQL80
```

### 2. Database Created
```sql
CREATE DATABASE IF NOT EXISTS arif_workout 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;
```

### 3. .env Configured
```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=arif_workout
DB_USER=root
DB_PASSWORD=your_password
NODE_ENV=development
```

---

## 🗄️ Database Schema

### Foreign Key Relationships:

```
users
  ├─→ otps (userId)
  ├─→ categories (createdBy)
  ├─→ subcategories (createdBy)
  ├─→ instructor_profiles (userId)
  ├─→ packages (createdByAdmin)
  ├─→ payments (userId)
  ├─→ subscriptions (userId)
  ├─→ workout_plans (userId, instructorId)
  ├─→ exercises (createdBy)
  ├─→ user_workouts (userId)
  ├─→ nutrition_logs (userId)
  ├─→ body_measurements (userId)
  ├─→ fitness_goals (userId)
  ├─→ fitness_assessments (userId, assessedBy)
  └─→ achievements (userId)

categories
  ├─→ subcategories (categoryId)
  └─→ packages (categoryId)

packages
  └─→ subscriptions (packageId)

payments
  └─→ subscriptions (paymentMethod)

workout_plans
  └─→ user_workouts (workoutPlanId)

exercises
  └─→ user_workouts (exerciseId)
```

### Indexes Created:

**users:**
- email (unique)
- phone (unique)
- createdAt

**exercises:**
- slug (unique)
- category
- difficulty
- isActive

**user_workouts:**
- userId + date
- exerciseId
- status
- date

**nutrition_logs:**
- userId + date
- mealType
- date

**body_measurements:**
- userId + date
- date

**workout_plans:**
- userId + status
- instructorId
- goal
- level
- startDate

**And many more...**

---

## 🎯 What Happens During Sync

### Step 1: Connection
```
Connecting to MySQL...
✅ MySQL Connected: localhost:3306
```

### Step 2: Table Creation
```
Creating tables...
✅ users
✅ otps
✅ categories
✅ subcategories
✅ instructor_profiles
✅ packages
✅ payments
✅ subscriptions
✅ workout_plans
✅ exercises
✅ user_workouts
✅ nutrition_logs
✅ body_measurements
✅ fitness_goals
✅ fitness_assessments
✅ achievements
```

### Step 3: Foreign Keys
```
Setting up foreign keys...
✅ 30+ foreign key constraints created
```

### Step 4: Indexes
```
Creating indexes...
✅ 50+ indexes created
```

### Step 5: Verification
```
📊 Database Tables (16)
✅ All tables synced successfully!
```

---

## 🔧 Troubleshooting

### Error: "Cannot connect to MySQL"
**Solution:**
```bash
# Start MySQL
net start MySQL80

# Check status
mysql -u root -p -e "SELECT 1"
```

### Error: "Database doesn't exist"
**Solution:**
```sql
CREATE DATABASE arif_workout;
```

### Error: "Access denied"
**Solution:**
```sql
GRANT ALL PRIVILEGES ON arif_workout.* TO 'root'@'localhost';
FLUSH PRIVILEGES;
```

### Error: "Table already exists"
**Solution:**
The sync uses `alter: true` which updates existing tables. If you want fresh tables:
```sql
DROP DATABASE arif_workout;
CREATE DATABASE arif_workout;
```
Then run sync again.

---

## 📊 Expected Output

### After Sync:
```
🔄 Starting database synchronization...

✅ Database connection established successfully

📋 Found 16 models to sync:

   1. User
   2. OTP
   3. Category
   4. Subcategory
   5. InstructorProfile
   6. Package
   7. Payment
   8. Subscription
   9. WorkoutPlan
   10. Exercise
   11. UserWorkout
   12. NutritionLog
   13. BodyMeasurement
   14. FitnessGoal
   15. FitnessAssessment
   16. Achievement

🔨 Creating/updating tables...

✅ All tables synced successfully!

📊 Database Tables (16):

   1. achievements
   2. body_measurements
   3. categories
   4. exercises
   5. fitness_assessments
   6. fitness_goals
   7. instructor_profiles
   8. nutrition_logs
   9. otps
   10. packages
   11. payments
   12. subscriptions
   13. subcategories
   14. user_workouts
   15. users
   16. workout_plans

📝 Table Details:

   achievements (11 columns)
   body_measurements (25 columns)
   categories (7 columns)
   exercises (20 columns)
   fitness_assessments (30 columns)
   fitness_goals (17 columns)
   instructor_profiles (13 columns)
   nutrition_logs (17 columns)
   otps (9 columns)
   packages (18 columns)
   payments (14 columns)
   subscriptions (19 columns)
   subcategories (8 columns)
   user_workouts (18 columns)
   users (14 columns)
   workout_plans (16 columns)

🎉 Database synchronization completed successfully!

📌 Next steps:
   1. Run: node src/scripts/create-admin.js
   2. Run: node src/scripts/seed-exercises.js
   3. Run: npm run dev
```

---

## ✅ Success Checklist

Before running sync:
- [ ] MySQL server is running
- [ ] Database `arif_workout` exists
- [ ] `.env` file is configured
- [ ] `NODE_ENV=development` in `.env`

After running sync:
- [ ] 16 tables created
- [ ] No error messages
- [ ] Foreign keys created
- [ ] Indexes created

After seeding:
- [ ] Admin user created
- [ ] Sample exercises added
- [ ] Server starts successfully

---

## 🚀 Ready to Go!

**Run this command now:**

```bash
node src/scripts/sync-database.js
```

This will create all 16 tables in your MySQL database!

---

**Total Tables**: 16
**Total Columns**: 250+
**Total Foreign Keys**: 30+
**Total Indexes**: 50+

**Your fitness platform database is ready to be created!** 🎉
