# OAuth Authentication System - Backend Complete

## ✅ What Has Been Implemented

### 1. **User Model Updated** ✅
- **File**: `src/models/user.model.js`
- **Changes**:
  - Added `password` field (VARCHAR 255) for admin/manager/instructor
  - Password is nullable (only required for staff)
  - Students use OAuth only (no password)

### 2. **Package Dependencies** ✅
- **File**: `package.json`
- **Added**:
  - `passport@^0.7.0` - Authentication middleware
  - `passport-google-oauth20@^2.0.0` - Google OAuth strategy
  - `passport-facebook@^3.0.0` - Facebook OAuth strategy
  - `express-session@^1.17.3` - Session support
  - `bcryptjs@^2.4.3` - Password hashing (already existed)

### 3. **Passport Configuration** ✅
- **File**: `src/config/passport.js`
- **Features**:
  - Google OAuth Strategy configured
  - Facebook OAuth Strategy configured
  - Auto-creates student users on first OAuth login
  - Updates existing users' auth providers
  - Tracks last login time

### 4. **Auth Controller Rewritten** ✅
- **File**: `src/controllers/auth.controller.js`
- **Endpoints**:

#### Staff Authentication (Email & Password):
- `loginWithPassword` - Admin/Manager/Instructor login
  - Validates email and password
  - Checks user has staff role
  - Verifies bcrypt hashed password
  - Returns JWT token

#### OAuth Callbacks:
- `oauthSuccess` - Handles successful OAuth login
  - Generates JWT token
  - Redirects to frontend with token
- `oauthFailure` - Handles OAuth failures
  - Redirects to frontend login with error

#### Profile Management:
- `getProfile` - Get current user profile
- `updateProfile` - Update user profile

#### Admin Staff Management:
- `createStaffUser` - Create manager/instructor with email & password
  - Admin only
  - Hashes password with bcrypt
  - Validates role (manager or instructor only)
- `updateStaffPassword` - Update staff member password
  - Admin only
  - Hashes new password

### 5. **Auth Routes Updated** ✅
- **File**: `src/routes/auth.routes.js`
- **Routes**:

```javascript
// Staff Login (Email & Password)
POST /api/auth/login
Body: { email, password }

// Google OAuth
GET  /api/auth/google              // Initiate OAuth
GET  /api/auth/google/callback     // OAuth callback

// Facebook OAuth
GET  /api/auth/facebook            // Initiate OAuth
GET  /api/auth/facebook/callback   // OAuth callback

// OAuth Failure
GET  /api/auth/failure

// Profile
GET  /api/auth/profile             // Get profile (protected)
PUT  /api/auth/profile             // Update profile (protected)

// Logout
POST /api/auth/logout              // Logout (protected)

// Admin: Staff Management
POST /api/auth/staff               // Create manager/instructor (admin only)
PUT  /api/auth/staff/:userId/password  // Update staff password (admin only)
```

### 6. **Server Configuration** ✅
- **File**: `src/server.js`
- **Changes**:
  - Imported passport configuration
  - Added `app.use(passport.initialize())`

### 7. **Environment Configuration** ✅
- **File**: `.env.example`
- **Added Variables**:
```env
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

## 🔧 Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

This will install:
- `passport`
- `passport-google-oauth20`
- `passport-facebook`
- `express-session`
- `bcryptjs`

### 2. Configure Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:5000/api/auth/google/callback`
6. Copy Client ID and Client Secret to `.env`

### 3. Configure Facebook OAuth

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app
3. Add Facebook Login product
4. Add redirect URI: `http://localhost:5000/api/auth/facebook/callback`
5. Copy App ID and App Secret to `.env`

### 4. Update .env File

```env
# MySQL Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=arif_workout
DB_USER=root
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_EXPIRES_IN=7d

# Google OAuth
GOOGLE_CLIENT_ID=your-actual-google-client-id
GOOGLE_CLIENT_SECRET=your-actual-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Facebook OAuth
FACEBOOK_APP_ID=your-actual-facebook-app-id
FACEBOOK_APP_SECRET=your-actual-facebook-app-secret
FACEBOOK_CALLBACK_URL=http://localhost:5000/api/auth/facebook/callback

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

### 5. Create Admin User (First Time)

Since admin uses email/password, you need to create the first admin manually:

```javascript
// Run this script once: src/scripts/create-admin.js
const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const { sequelize } = require('../config/database');

async function createAdmin() {
  await sequelize.sync();
  
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@arifworkout.com',
    password: hashedPassword,
    roles: ['admin'],
    authProviders: [{
      provider: 'email',
      providerId: 'admin@arifworkout.com',
      lastUsed: new Date()
    }],
    isActive: true
  });
  
  console.log('Admin created:', admin.email);
  process.exit(0);
}

createAdmin();
```

Run it:
```bash
node src/scripts/create-admin.js
```

### 6. Start Server

```bash
npm run dev
```

---

## 🎯 Authentication Flow

### For Students (OAuth Only):

1. User clicks "Login with Google" or "Login with Facebook" on frontend
2. Frontend redirects to: `http://localhost:5000/api/auth/google` or `/facebook`
3. User authenticates with Google/Facebook
4. OAuth provider redirects back to callback URL
5. Backend creates/updates user (student role)
6. Backend generates JWT token
7. Backend redirects to: `http://localhost:5173/auth/callback?token=JWT_TOKEN`
8. Frontend stores token and redirects to dashboard

### For Staff (Email & Password):

1. Admin/Manager/Instructor enters email and password
2. Frontend sends POST to: `http://localhost:5000/api/auth/login`
3. Backend verifies credentials
4. Backend returns JWT token
5. Frontend stores token and redirects to appropriate dashboard

### Admin Creating Staff:

1. Admin logs in with email/password
2. Admin goes to staff management page
3. Admin sends POST to: `http://localhost:5000/api/auth/staff`
   ```json
   {
     "name": "John Manager",
     "email": "john@arifworkout.com",
     "password": "secure123",
     "role": "manager"
   }
   ```
4. Backend creates user with hashed password
5. New staff member can now login with email/password

---

## 📝 API Examples

### 1. Staff Login (Email & Password)

```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "admin@arifworkout.com",
  "password": "admin123"
}
```

**Response:**
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

### 2. Google OAuth (Browser)

```
GET http://localhost:5000/api/auth/google
```

This will redirect to Google login page.

### 3. Facebook OAuth (Browser)

```
GET http://localhost:5000/api/auth/facebook
```

This will redirect to Facebook login page.

### 4. Create Manager (Admin Only)

```bash
POST http://localhost:5000/api/auth/staff
Authorization: Bearer YOUR_ADMIN_JWT_TOKEN
Content-Type: application/json

{
  "name": "Jane Manager",
  "email": "jane@arifworkout.com",
  "password": "secure123",
  "role": "manager"
}
```

**Response:**
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

### 5. Create Instructor (Admin Only)

```bash
POST http://localhost:5000/api/auth/staff
Authorization: Bearer YOUR_ADMIN_JWT_TOKEN
Content-Type: application/json

{
  "name": "Bob Instructor",
  "email": "bob@arifworkout.com",
  "password": "secure123",
  "role": "instructor"
}
```

### 6. Update Staff Password (Admin Only)

```bash
PUT http://localhost:5000/api/auth/staff/2/password
Authorization: Bearer YOUR_ADMIN_JWT_TOKEN
Content-Type: application/json

{
  "newPassword": "newsecure456"
}
```

### 7. Get Profile (Any Authenticated User)

```bash
GET http://localhost:5000/api/auth/profile
Authorization: Bearer YOUR_JWT_TOKEN
```

### 8. Update Profile (Any Authenticated User)

```bash
PUT http://localhost:5000/api/auth/profile
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "name": "Updated Name",
  "gender": "male",
  "personalInfo": {
    "bio": "Fitness enthusiast",
    "heightCm": 180,
    "weightKg": 75
  }
}
```

---

## 🔐 Security Features

### Password Security:
- Passwords hashed with bcrypt (10 rounds)
- Passwords only for admin/manager/instructor
- Students cannot set passwords (OAuth only)

### JWT Tokens:
- Signed with JWT_SECRET
- Contains: userId, email, roles
- Expires in 7 days (configurable)

### Role-Based Access:
- Staff login endpoint checks for admin/manager/instructor roles
- OAuth creates student users by default
- Admin can only create manager/instructor (not admin)

### OAuth Security:
- Uses official passport strategies
- Validates OAuth tokens with providers
- Auto-creates users on first login
- Links multiple auth providers to same email

---

## 🧪 Testing

### Test Staff Login:

```bash
# Create admin first
node src/scripts/create-admin.js

# Test login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@arifworkout.com","password":"admin123"}'
```

### Test OAuth (Browser):

1. Open: `http://localhost:5000/api/auth/google`
2. Login with Google account
3. Should redirect to: `http://localhost:5173/auth/callback?token=...`

### Test Staff Creation:

```bash
# Get admin token first
ADMIN_TOKEN="your-admin-jwt-token"

# Create manager
curl -X POST http://localhost:5000/api/auth/staff \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Manager","email":"manager@test.com","password":"test123","role":"manager"}'

# Test manager login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"manager@test.com","password":"test123"}'
```

---

## 📊 Database Schema

### Users Table:

```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE,
  password VARCHAR(255),  -- Only for admin/manager/instructor
  phone VARCHAR(50) UNIQUE,
  gender ENUM('male', 'female', 'other'),
  dob DATE,
  roles JSON DEFAULT '["student"]',
  authProviders JSON DEFAULT '[]',
  personalInfo JSON DEFAULT '{}',
  consents JSON DEFAULT '{}',
  lastLogin DATETIME,
  isActive BOOLEAN DEFAULT true,
  createdAt DATETIME,
  updatedAt DATETIME
);
```

### Example User Records:

**Admin:**
```json
{
  "id": 1,
  "name": "Admin User",
  "email": "admin@arifworkout.com",
  "password": "$2a$10$hashed...",
  "roles": ["admin"],
  "authProviders": [{"provider": "email", "providerId": "admin@arifworkout.com"}]
}
```

**Manager:**
```json
{
  "id": 2,
  "name": "Jane Manager",
  "email": "jane@arifworkout.com",
  "password": "$2a$10$hashed...",
  "roles": ["manager"],
  "authProviders": [{"provider": "email", "providerId": "jane@arifworkout.com"}]
}
```

**Student (OAuth):**
```json
{
  "id": 3,
  "name": "John Student",
  "email": "john@gmail.com",
  "password": null,
  "roles": ["student"],
  "authProviders": [{"provider": "google", "providerId": "google-user-id-123"}]
}
```

---

## 🎯 Summary

### ✅ Completed:
1. User model with password field
2. Passport OAuth configuration (Google + Facebook)
3. Auth controller with all endpoints
4. Auth routes with OAuth and email/password
5. Server configured with passport
6. Environment variables documented
7. Admin staff management endpoints

### 🔄 Authentication Methods:
- **Students**: Google OAuth or Facebook OAuth only
- **Admin/Manager/Instructor**: Email & Password only
- **Admin**: Can create Manager/Instructor with email & password

### 🚀 Ready to Use:
The backend OAuth system is complete and ready for testing. Just:
1. Run `npm install`
2. Configure OAuth credentials in `.env`
3. Create admin user with script
4. Start server with `npm run dev`
5. Test endpoints

---

**Status**: ✅ Backend OAuth Authentication Complete!
