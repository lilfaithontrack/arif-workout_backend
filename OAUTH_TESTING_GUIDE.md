# OAuth Authentication Testing Guide

## 🚀 Quick Start Testing

### Step 1: Install Dependencies

```bash
cd backend
npm install
```

### Step 2: Setup Database

```bash
# Make sure MySQL is running
mysql -u root -p

# Create database
CREATE DATABASE arif_workout CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

### Step 3: Configure Environment

```bash
cp .env.example .env
```

Edit `.env`:
```env
# MySQL
DB_HOST=localhost
DB_PORT=3306
DB_NAME=arif_workout
DB_USER=root
DB_PASSWORD=your_mysql_password

# JWT
JWT_SECRET=arif-workout-super-secret-jwt-key-2025
JWT_EXPIRES_IN=7d

# Google OAuth (get from Google Cloud Console)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Facebook OAuth (get from Facebook Developers)
FACEBOOK_APP_ID=your-facebook-app-id
FACEBOOK_APP_SECRET=your-facebook-app-secret
FACEBOOK_CALLBACK_URL=http://localhost:5000/api/auth/facebook/callback

# Frontend
FRONTEND_URL=http://localhost:5173
```

### Step 4: Create Admin User

```bash
node src/scripts/create-admin.js
```

**Output:**
```
✅ Admin user created successfully!

Login Credentials:
==================
Email: admin@arifworkout.com
Password: admin123

⚠️  IMPORTANT: Change this password after first login!
```

### Step 5: Start Server

```bash
npm run dev
```

**Expected Output:**
```
MySQL Connected: localhost:3306
Database tables synced
Server running on port 5000
```

---

## 🧪 Test Cases

### Test 1: Admin Login (Email & Password)

**Request:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@arifworkout.com",
    "password": "admin123"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "name": "Admin User",
      "email": "admin@arifworkout.com",
      "roles": ["admin"],
      "isActive": true
    }
  }
}
```

**Status:** ✅ Should return 200 with JWT token

---

### Test 2: Invalid Login Credentials

**Request:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@arifworkout.com",
    "password": "wrongpassword"
  }'
```

**Expected Response:**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

**Status:** ✅ Should return 401

---

### Test 3: Student Trying Staff Login

**Request:**
```bash
# First create a student user via OAuth, then try staff login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@gmail.com",
    "password": "anypassword"
  }'
```

**Expected Response:**
```json
{
  "success": false,
  "message": "Access denied. This login is for staff only."
}
```

**Status:** ✅ Should return 403

---

### Test 4: Create Manager (Admin Only)

**Request:**
```bash
# Replace YOUR_ADMIN_TOKEN with token from Test 1
curl -X POST http://localhost:5000/api/auth/staff \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Manager",
    "email": "jane@arifworkout.com",
    "password": "manager123",
    "role": "manager"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Manager created successfully",
  "data": {
    "user": {
      "id": 2,
      "name": "Jane Manager",
      "email": "jane@arifworkout.com",
      "roles": ["manager"],
      "isActive": true
    }
  }
}
```

**Status:** ✅ Should return 201

---

### Test 5: Manager Login

**Request:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane@arifworkout.com",
    "password": "manager123"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 2,
      "name": "Jane Manager",
      "email": "jane@arifworkout.com",
      "roles": ["manager"],
      "isActive": true
    }
  }
}
```

**Status:** ✅ Should return 200

---

### Test 6: Create Instructor (Admin Only)

**Request:**
```bash
curl -X POST http://localhost:5000/api/auth/staff \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Bob Instructor",
    "email": "bob@arifworkout.com",
    "password": "instructor123",
    "role": "instructor"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Instructor created successfully",
  "data": {
    "user": {
      "id": 3,
      "name": "Bob Instructor",
      "email": "bob@arifworkout.com",
      "roles": ["instructor"],
      "isActive": true
    }
  }
}
```

**Status:** ✅ Should return 201

---

### Test 7: Non-Admin Creating Staff (Should Fail)

**Request:**
```bash
# Use manager token instead of admin token
curl -X POST http://localhost:5000/api/auth/staff \
  -H "Authorization: Bearer MANAGER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@test.com",
    "password": "test123",
    "role": "instructor"
  }'
```

**Expected Response:**
```json
{
  "success": false,
  "message": "Access denied"
}
```

**Status:** ✅ Should return 403

---

### Test 8: Update Staff Password (Admin Only)

**Request:**
```bash
# Update manager's password (userId = 2)
curl -X PUT http://localhost:5000/api/auth/staff/2/password \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "newPassword": "newmanager456"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Password updated successfully"
}
```

**Status:** ✅ Should return 200

---

### Test 9: Login with Updated Password

**Request:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane@arifworkout.com",
    "password": "newmanager456"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "...",
    "user": { ... }
  }
}
```

**Status:** ✅ Should return 200

---

### Test 10: Get Profile (Authenticated)

**Request:**
```bash
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "name": "Admin User",
      "email": "admin@arifworkout.com",
      "roles": ["admin"],
      "gender": null,
      "dob": null,
      "personalInfo": {},
      "consents": {...},
      "lastLogin": "2025-11-27T08:00:00.000Z",
      "isActive": true,
      "createdAt": "2025-11-27T08:00:00.000Z",
      "updatedAt": "2025-11-27T08:00:00.000Z"
    }
  }
}
```

**Status:** ✅ Should return 200

---

### Test 11: Update Profile

**Request:**
```bash
curl -X PUT http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Admin",
    "gender": "male",
    "personalInfo": {
      "bio": "Fitness platform administrator",
      "heightCm": 180,
      "weightKg": 75
    }
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "user": {
      "id": 1,
      "name": "Updated Admin",
      "email": "admin@arifworkout.com",
      "gender": "male",
      "roles": ["admin"],
      "personalInfo": {
        "bio": "Fitness platform administrator",
        "heightCm": 180,
        "weightKg": 75
      }
    }
  }
}
```

**Status:** ✅ Should return 200

---

### Test 12: Google OAuth (Browser Test)

**Steps:**
1. Open browser
2. Navigate to: `http://localhost:5000/api/auth/google`
3. Login with Google account
4. Should redirect to: `http://localhost:5173/auth/callback?token=JWT_TOKEN`

**Expected Behavior:**
- Google login page appears
- After login, redirects to frontend with token
- User is created with student role
- No password stored

**Status:** ✅ Manual browser test required

---

### Test 13: Facebook OAuth (Browser Test)

**Steps:**
1. Open browser
2. Navigate to: `http://localhost:5000/api/auth/facebook`
3. Login with Facebook account
4. Should redirect to: `http://localhost:5173/auth/callback?token=JWT_TOKEN`

**Expected Behavior:**
- Facebook login page appears
- After login, redirects to frontend with token
- User is created with student role
- No password stored

**Status:** ✅ Manual browser test required

---

### Test 14: Logout

**Request:**
```bash
curl -X POST http://localhost:5000/api/auth/logout \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

**Status:** ✅ Should return 200

---

## 📊 Test Summary

| Test # | Description | Method | Expected Status | Auth Required |
|--------|-------------|--------|-----------------|---------------|
| 1 | Admin Login | POST | 200 | No |
| 2 | Invalid Login | POST | 401 | No |
| 3 | Student Staff Login | POST | 403 | No |
| 4 | Create Manager | POST | 201 | Admin |
| 5 | Manager Login | POST | 200 | No |
| 6 | Create Instructor | POST | 201 | Admin |
| 7 | Non-Admin Create Staff | POST | 403 | Manager |
| 8 | Update Password | PUT | 200 | Admin |
| 9 | Login New Password | POST | 200 | No |
| 10 | Get Profile | GET | 200 | Any |
| 11 | Update Profile | PUT | 200 | Any |
| 12 | Google OAuth | GET | 302 | No |
| 13 | Facebook OAuth | GET | 302 | No |
| 14 | Logout | POST | 200 | Any |

---

## 🔍 Database Verification

After running tests, verify in MySQL:

```sql
USE arif_workout;

-- Check all users
SELECT id, name, email, roles, 
       CASE WHEN password IS NULL THEN 'OAuth' ELSE 'Password' END as auth_type
FROM users;

-- Expected results:
-- 1 | Admin User      | admin@arifworkout.com | ["admin"]      | Password
-- 2 | Jane Manager    | jane@arifworkout.com  | ["manager"]    | Password
-- 3 | Bob Instructor  | bob@arifworkout.com   | ["instructor"] | Password
-- 4 | John Student    | john@gmail.com        | ["student"]    | OAuth

-- Check auth providers
SELECT id, name, email, authProviders
FROM users;
```

---

## ⚠️ Common Issues & Solutions

### Issue 1: "Cannot connect to MySQL"
**Solution:**
```bash
# Check if MySQL is running
mysql -u root -p

# If not, start MySQL service
# Windows: net start MySQL
# Mac: brew services start mysql
# Linux: sudo systemctl start mysql
```

### Issue 2: "Table doesn't exist"
**Solution:**
```bash
# Make sure NODE_ENV=development in .env
# Restart server to auto-create tables
npm run dev
```

### Issue 3: "Invalid JWT token"
**Solution:**
- Make sure JWT_SECRET in .env matches
- Token might be expired (check JWT_EXPIRES_IN)
- Copy token correctly (no extra spaces)

### Issue 4: "OAuth redirect not working"
**Solution:**
- Check GOOGLE_CALLBACK_URL and FACEBOOK_CALLBACK_URL in .env
- Make sure URLs match in OAuth provider console
- Check FRONTEND_URL is correct

### Issue 5: "Admin already exists"
**Solution:**
```sql
-- Delete existing admin
DELETE FROM users WHERE email = 'admin@arifworkout.com';

-- Run create script again
node src/scripts/create-admin.js
```

---

## 🎯 Testing Checklist

- [ ] MySQL database created
- [ ] Dependencies installed (`npm install`)
- [ ] `.env` configured
- [ ] Admin user created
- [ ] Server starts without errors
- [ ] Admin can login with email/password
- [ ] Invalid credentials rejected
- [ ] Admin can create manager
- [ ] Admin can create instructor
- [ ] Manager can login
- [ ] Instructor can login
- [ ] Non-admin cannot create staff
- [ ] Admin can update staff password
- [ ] Profile endpoints work
- [ ] Google OAuth configured (optional)
- [ ] Facebook OAuth configured (optional)
- [ ] JWT tokens work correctly
- [ ] Unauthorized requests return 401

---

## 🚀 Next Steps

After all tests pass:

1. **Configure OAuth Providers** (if needed):
   - Set up Google OAuth credentials
   - Set up Facebook OAuth credentials
   - Update `.env` with real credentials

2. **Change Default Password**:
   ```bash
   # Login as admin, then update password via API
   ```

3. **Create Initial Staff**:
   - Create managers
   - Create instructors
   - Assign appropriate roles

4. **Test Frontend Integration**:
   - Update frontend login page
   - Test OAuth flow
   - Test staff login flow

---

**Testing Status**: Ready to test! Follow the steps above to verify all functionality.
