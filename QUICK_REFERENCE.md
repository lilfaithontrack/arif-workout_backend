# 🚀 Quick Reference Card

## Setup (5 Minutes)

```bash
# 1. Install
cd backend && npm install

# 2. Database
mysql -u root -p
CREATE DATABASE arif_workout;
EXIT;

# 3. Configure
cp .env.example .env
# Edit: DB_PASSWORD, JWT_SECRET, OAuth credentials

# 4. Create Admin
node src/scripts/create-admin.js

# 5. Start
npm run dev
```

---

## Authentication Endpoints

### Staff Login (Email + Password)
```bash
POST /api/auth/login
Body: {"email": "admin@arifworkout.com", "password": "admin123"}
```

### Student Login (OAuth)
```bash
# Google
GET /api/auth/google

# Facebook
GET /api/auth/facebook
```

### Admin: Create Staff
```bash
POST /api/auth/staff
Headers: Authorization: Bearer {admin_token}
Body: {"name": "Jane", "email": "jane@test.com", "password": "pass123", "role": "manager"}
```

---

## User Roles

| Role | Login Method | Can Create |
|------|--------------|------------|
| **Admin** | Email/Password | Manager, Instructor |
| **Manager** | Email/Password | - |
| **Instructor** | Email/Password | - |
| **Student** | OAuth (Google/Facebook) | - |

---

## Default Credentials

```
Email: admin@arifworkout.com
Password: admin123
```

⚠️ Change after first login!

---

## Environment Variables (Required)

```env
DB_HOST=localhost
DB_NAME=arif_workout
DB_USER=root
DB_PASSWORD=your_password
JWT_SECRET=min-32-character-secret
GOOGLE_CLIENT_ID=your-google-id
GOOGLE_CLIENT_SECRET=your-google-secret
FACEBOOK_APP_ID=your-facebook-id
FACEBOOK_APP_SECRET=your-facebook-secret
FRONTEND_URL=http://localhost:5173
```

---

## Testing

```bash
# Test admin login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@arifworkout.com","password":"admin123"}'

# Create manager
curl -X POST http://localhost:5000/api/auth/staff \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"name":"Manager","email":"mgr@test.com","password":"test123","role":"manager"}'
```

---

## File Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js          # MySQL/Sequelize
│   │   └── passport.js          # OAuth strategies
│   ├── controllers/
│   │   └── auth.controller.js   # Auth logic
│   ├── models/
│   │   └── user.model.js        # User model (Sequelize)
│   ├── routes/
│   │   └── auth.routes.js       # Auth routes
│   ├── scripts/
│   │   └── create-admin.js      # Admin creation
│   └── server.js                # Express app
├── .env                         # Configuration
└── package.json                 # Dependencies
```

---

## Common Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Create admin user
node src/scripts/create-admin.js

# Check database
mysql -u root -p arif_workout
SELECT * FROM users;
```

---

## OAuth Setup

### Google
1. Go to: https://console.cloud.google.com/
2. Create project → Enable Google+ API
3. Create OAuth credentials
4. Add redirect: `http://localhost:5000/api/auth/google/callback`
5. Copy Client ID & Secret to `.env`

### Facebook
1. Go to: https://developers.facebook.com/
2. Create app → Add Facebook Login
3. Add redirect: `http://localhost:5000/api/auth/facebook/callback`
4. Copy App ID & Secret to `.env`

---

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Server Error |

---

## Documentation

- **OAUTH_AUTHENTICATION_GUIDE.md** - Complete guide
- **OAUTH_TESTING_GUIDE.md** - Testing instructions
- **BACKEND_OAUTH_COMPLETE.md** - Implementation summary
- **MYSQL_MIGRATION_GUIDE.md** - Database migration

---

## Support

Check logs for errors:
```bash
# Server logs show in console
npm run dev

# Database errors
mysql -u root -p
SHOW DATABASES;
USE arif_workout;
SHOW TABLES;
```

---

**Status**: ✅ Ready to Use!
