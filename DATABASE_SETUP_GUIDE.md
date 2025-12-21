# 🗄️ Database Setup Guide

## Prerequisites

1. **MySQL Server** installed and running
2. **Node.js** and **npm** installed
3. **.env** file configured

---

## Step 1: Create Database

Open MySQL command line or MySQL Workbench and run:

```sql
CREATE DATABASE IF NOT EXISTS arif_workout CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Or use command line:

```bash
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS arif_workout CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

---

## Step 2: Configure Environment Variables

Create or update `.env` file in the backend root:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=arif_workout
DB_USER=root
DB_PASSWORD=your_mysql_password

# Node Environment
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=5000
CORS_ORIGIN=http://localhost:5173

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Facebook OAuth
FACEBOOK_APP_ID=your-facebook-app-id
FACEBOOK_APP_SECRET=your-facebook-app-secret
FACEBOOK_CALLBACK_URL=http://localhost:5000/api/auth/facebook/callback

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

---

## Step 3: Install Dependencies

```bash
npm install
```

---

## Step 4: Sync Database (Create Tables)

### Option A: Using Sync Script (Recommended)

```bash
node src/scripts/sync-database.js
```

This will:
- ✅ Test database connection
- ✅ Create all 16 tables
- ✅ Show table details
- ✅ Provide next steps

### Option B: Start Server (Auto-sync)

```bash
npm run dev
```

The server will automatically sync tables when `NODE_ENV=development`

---

## Step 5: Verify Tables Created

### Using MySQL Command Line:

```sql
USE arif_workout;
SHOW TABLES;
```

### Expected Tables (16):

```
1.  achievements
2.  body_measurements
3.  categories
4.  exercises
5.  fitness_assessments
6.  fitness_goals
7.  instructor_profiles
8.  nutrition_logs
9.  otps
10. packages
11. payments
12. subscriptions
13. subcategories
14. user_workouts
15. users
16. workout_plans
```

### Check Table Structure:

```sql
DESCRIBE users;
DESCRIBE exercises;
DESCRIBE workout_plans;
-- etc.
```

---

## Step 6: Seed Initial Data

### Create Admin User:

```bash
node src/scripts/create-admin.js
```

**Default Admin Credentials:**
- Email: `admin@arifworkout.com`
- Password: `admin123`

### Seed Exercises:

```bash
node src/scripts/seed-exercises.js
```

This adds 10 sample exercises to the database.

---

## Step 7: Start the Server

```bash
npm run dev
```

You should see:

```
[dotenv] injecting env...
MySQL Connected: localhost:3306
✅ Database tables synced successfully
📊 Total tables: 16
Server running on port 5000
```

---

## Troubleshooting

### Error: "Access denied for user"

**Solution:**
1. Check MySQL username and password in `.env`
2. Grant privileges:
   ```sql
   GRANT ALL PRIVILEGES ON arif_workout.* TO 'root'@'localhost';
   FLUSH PRIVILEGES;
   ```

### Error: "Unknown database 'arif_workout'"

**Solution:**
```sql
CREATE DATABASE arif_workout;
```

### Error: "Cannot connect to MySQL server"

**Solution:**
1. Check if MySQL is running:
   ```bash
   # Windows
   net start MySQL80
   
   # Or check services
   services.msc
   ```
2. Verify port 3306 is not blocked
3. Check `DB_HOST` and `DB_PORT` in `.env`

### Error: "Table already exists"

**Solution:**
The sync script uses `alter: true` which updates existing tables without dropping them. If you want to recreate all tables:

```sql
DROP DATABASE arif_workout;
CREATE DATABASE arif_workout;
```

Then run sync script again.

### Error: "Foreign key constraint fails"

**Solution:**
This happens if tables are created in wrong order. Drop and recreate database:

```bash
node src/scripts/sync-database.js
```

---

## Database Schema Overview

### Core Tables:

**users**
- Authentication and user profiles
- Roles: student, admin, manager, instructor
- OAuth provider support

**otps**
- One-time passwords for verification
- Email/phone verification

**categories & subcategories**
- Workout/course categorization

**instructor_profiles**
- Extended instructor information
- Approval workflow

**packages**
- Subscription packages
- Pricing and billing

**payments**
- Payment transactions
- Multiple providers (Stripe, Apple Pay, Telebirr)

**subscriptions**
- User subscriptions to packages
- Billing cycles and status

### Fitness Tables:

**workout_plans**
- Personalized workout programs
- Progress tracking

**exercises**
- Exercise library
- Instructions and media

**user_workouts**
- Logged workout sessions
- Performance metrics

**nutrition_logs**
- Meal tracking
- Macro/micro nutrients

**body_measurements**
- Body composition tracking
- Progress photos

**fitness_goals**
- Goal setting and tracking
- Milestones

**fitness_assessments**
- Professional fitness evaluations
- Test results

**achievements**
- Gamification badges
- Points system

---

## Verification Commands

### Check All Tables:

```sql
SELECT 
  TABLE_NAME, 
  TABLE_ROWS, 
  CREATE_TIME 
FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_SCHEMA = 'arif_workout'
ORDER BY TABLE_NAME;
```

### Check Foreign Keys:

```sql
SELECT 
  TABLE_NAME,
  COLUMN_NAME,
  CONSTRAINT_NAME,
  REFERENCED_TABLE_NAME,
  REFERENCED_COLUMN_NAME
FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
WHERE TABLE_SCHEMA = 'arif_workout'
  AND REFERENCED_TABLE_NAME IS NOT NULL;
```

### Check Indexes:

```sql
SELECT 
  TABLE_NAME,
  INDEX_NAME,
  COLUMN_NAME,
  NON_UNIQUE
FROM INFORMATION_SCHEMA.STATISTICS
WHERE TABLE_SCHEMA = 'arif_workout'
ORDER BY TABLE_NAME, INDEX_NAME;
```

---

## Quick Setup (All Steps)

```bash
# 1. Create database
mysql -u root -p -e "CREATE DATABASE arif_workout;"

# 2. Install dependencies
npm install

# 3. Configure .env (edit manually)
cp .env.example .env

# 4. Sync database
node src/scripts/sync-database.js

# 5. Create admin
node src/scripts/create-admin.js

# 6. Seed exercises
node src/scripts/seed-exercises.js

# 7. Start server
npm run dev
```

---

## Production Setup

For production, update `.env`:

```env
NODE_ENV=production
DB_HOST=your-production-host
DB_NAME=your-production-db
DB_USER=your-production-user
DB_PASSWORD=your-secure-password
```

And use migrations instead of sync:

```bash
# Install Sequelize CLI
npm install -g sequelize-cli

# Generate migrations
sequelize-cli migration:generate --name create-all-tables

# Run migrations
sequelize-cli db:migrate
```

---

## Backup & Restore

### Backup:

```bash
mysqldump -u root -p arif_workout > backup.sql
```

### Restore:

```bash
mysql -u root -p arif_workout < backup.sql
```

---

## ✅ Success Checklist

- [ ] MySQL server running
- [ ] Database `arif_workout` created
- [ ] `.env` file configured
- [ ] Dependencies installed
- [ ] 16 tables created successfully
- [ ] Admin user created
- [ ] Sample exercises seeded
- [ ] Server starts without errors
- [ ] Can access API endpoints

---

**Status**: Ready to use! 🚀

All 16 tables are properly configured with relationships, indexes, and constraints.
