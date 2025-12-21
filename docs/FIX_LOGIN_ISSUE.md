# 🔧 Fix "Invalid Email or Password" Issue

## 🎯 Quick Fix

Run this command in the backend directory:

```bash
node src/scripts/reset-admin-password.js
```

This will:
- ✅ Check if admin user exists
- ✅ Reset password to `admin123`
- ✅ Verify the password works
- ✅ Show you the credentials

---

## 📋 Step-by-Step Solution

### Step 1: Check if Backend is Running
```bash
cd backend
npm run dev
```

**Expected output:**
```
MySQL Connected: localhost:3306
✅ Database tables synced successfully
Server running on port 5000
```

### Step 2: Reset Admin Password
```bash
# In backend directory
node src/scripts/reset-admin-password.js
```

**Expected output:**
```
✅ Password reset successfully!

🔑 New Login Credentials:
   Email: admin@arifworkout.com
   Password: admin123

✅ Password verification test: PASSED
```

### Step 3: Test Login
1. Open `http://localhost:5173`
2. Enter:
   - Email: `admin@arifworkout.com`
   - Password: `admin123`
3. Click "Sign In"

---

## 🔍 Common Issues & Solutions

### Issue 1: Admin User Doesn't Exist

**Symptoms:**
- "Invalid email or password"
- Script says "Admin user not found"

**Solution:**
```bash
node src/scripts/create-admin.js
```

### Issue 2: Database Not Connected

**Symptoms:**
- "Error connecting to MySQL"
- Backend won't start

**Solution:**
1. Check if MySQL is running:
   ```bash
   # Windows
   net start MySQL80
   ```

2. Verify `.env` file:
   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=arif_workout
   DB_USER=root
   DB_PASSWORD=your_password
   ```

3. Test connection:
   ```bash
   node src/scripts/check-database.js
   ```

### Issue 3: Wrong API URL

**Symptoms:**
- Network error in browser console
- "Failed to fetch"

**Solution:**
Check frontend `.env` file:
```env
VITE_API_URL=http://localhost:5000/api
```

### Issue 4: CORS Error

**Symptoms:**
- "CORS policy" error in console
- Request blocked

**Solution:**
Check `backend/src/server.js`:
```javascript
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
```

### Issue 5: Token Not Stored

**Symptoms:**
- Login successful but redirects back
- No token in localStorage

**Solution:**
1. Open browser DevTools (F12)
2. Go to Application → Local Storage
3. Check if `token` and `user` keys exist
4. If not, check browser console for errors

---

## 🧪 Test Authentication Manually

### Using cURL:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@arifworkout.com",
    "password": "admin123"
  }'
```

**Expected response:**
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

### Using Postman:
1. Method: `POST`
2. URL: `http://localhost:5000/api/auth/login`
3. Headers: `Content-Type: application/json`
4. Body (raw JSON):
   ```json
   {
     "email": "admin@arifworkout.com",
     "password": "admin123"
   }
   ```

---

## 🔐 Password Verification

The backend uses bcrypt to hash passwords. Here's what happens:

1. **During Registration/Reset:**
   ```javascript
   const hashedPassword = await bcrypt.hash('admin123', 10);
   // Stored in database
   ```

2. **During Login:**
   ```javascript
   const isValid = await bcrypt.compare(password, user.password);
   // Returns true if match
   ```

---

## 📊 Check Database Directly

### Using MySQL Command Line:
```sql
USE arif_workout;

-- Check if admin exists
SELECT id, name, email, roles, password IS NOT NULL as has_password, isActive 
FROM users 
WHERE email = 'admin@arifworkout.com';

-- Should show:
-- id | name       | email                    | roles      | has_password | isActive
-- 1  | Admin User | admin@arifworkout.com    | ["admin"]  | 1            | 1
```

---

## 🚀 Complete Reset Process

If nothing works, do a complete reset:

### 1. Stop Servers
```bash
# Stop backend (Ctrl+C)
# Stop frontend (Ctrl+C)
```

### 2. Reset Database
```bash
cd backend

# Drop and recreate database
mysql -u root -p -e "DROP DATABASE IF EXISTS arif_workout; CREATE DATABASE arif_workout;"

# Sync tables
node src/scripts/sync-database.js
```

### 3. Create Admin
```bash
node src/scripts/create-admin.js
```

### 4. Restart Servers
```bash
# Terminal 1
npm run dev

# Terminal 2 (in fit-journey-pro)
npm run dev
```

### 5. Test Login
```
http://localhost:5173
Email: admin@arifworkout.com
Password: admin123
```

---

## 📝 Debugging Checklist

- [ ] Backend server running on port 5000
- [ ] Frontend running on port 5173
- [ ] MySQL server running
- [ ] Database `arif_workout` exists
- [ ] Admin user exists in database
- [ ] Admin has password set
- [ ] `.env` files configured correctly
- [ ] No CORS errors in console
- [ ] API URL correct in frontend
- [ ] Browser console shows no errors

---

## 💡 Quick Verification Commands

```bash
# Check if backend is running
curl http://localhost:5000/health

# Check if admin exists
cd backend
node -e "require('dotenv').config(); const {User} = require('./src/models'); const {sequelize} = require('./src/config/database'); sequelize.authenticate().then(() => User.findOne({where: {email: 'admin@arifworkout.com'}}).then(u => console.log(u ? 'Admin exists' : 'Admin not found')))"

# Reset password
node src/scripts/reset-admin-password.js
```

---

## ✅ Success Indicators

After fixing, you should see:

1. **Backend logs:**
   ```
   POST /api/auth/login 200 - - 45.123 ms
   ```

2. **Browser console:**
   ```
   POST http://localhost:5000/api/auth/login 200 OK
   ```

3. **Browser localStorage:**
   - `token`: JWT string
   - `user`: JSON object with admin data

4. **Redirect:**
   - Automatically redirected to `/admin`
   - Dashboard loads with real data

---

## 🆘 Still Not Working?

1. **Check backend logs** for detailed error messages
2. **Check browser console** for frontend errors
3. **Verify database** has admin user with password
4. **Test API directly** with cURL or Postman
5. **Run reset script** to ensure password is correct

---

**Most Common Fix:** Just run the reset password script!

```bash
cd backend
node src/scripts/reset-admin-password.js
```

Then try logging in again! 🚀
