# 🚨 cPanel Production Deployment - Fix Database Tables

## Problem
```
Table 'arifwowt_arif.packages' doesn't exist
```

Your backend is deployed but database tables haven't been created!

---

## ✅ Solution - Create Database Tables on cPanel

### Method 1: Using cPanel Terminal (Recommended)

#### Step 1: Access Terminal
1. Login to **cPanel**
2. Find **Terminal** (under Advanced tab)
3. Click to open terminal

#### Step 2: Navigate to Your App
```bash
cd ~/api.arifworkout.com
```

#### Step 3: Run Database Sync
```bash
# Make sure you're in the right directory
pwd

# Run the sync script
node src/scripts/sync-production-db.js
```

You should see:
```
🔄 Starting production database sync...
📊 Database: arifwowt_arif
✅ Database connection successful!
📦 Loaded XX models
🔨 Creating/updating tables...
✅ All tables created successfully!
```

#### Step 4: Restart Your App
```bash
# If using PM2
pm2 restart all

# If using Node.js selector in cPanel
# Go to Setup Node.js App in cPanel and click "Restart"
```

---

### Method 2: Using SSH

```bash
# SSH into your server
ssh arifwowt@api.arifworkout.com

# Navigate to app directory
cd ~/api.arifworkout.com

# Load environment variables
source ~/nodevenv/api.arifworkout.com/18/bin/activate

# Run sync
node src/scripts/sync-production-db.js

# Restart app
pm2 restart all
```

---

### Method 3: Using npm Script

Add to your `package.json`:
```json
{
  "scripts": {
    "db:sync:prod": "node src/scripts/sync-production-db.js"
  }
}
```

Then run:
```bash
cd ~/api.arifworkout.com
npm run db:sync:prod
```

---

## 🔍 Verify Tables Were Created

### Option A: cPanel Terminal
```bash
cd ~/api.arifworkout.com
node -e "
require('dotenv').config();
const db = require('./src/config/database');
db.connectDB().then(() => {
  db.sequelize.query('SHOW TABLES').then(([tables]) => {
    console.log('Tables:', tables);
    process.exit(0);
  });
});
"
```

### Option B: cPanel phpMyAdmin
1. Open **phpMyAdmin** in cPanel
2. Select database: `arifwowt_arif`
3. Check if tables exist:
   - `users`
   - `packages`
   - `exercises`
   - `nutrition_logs`
   - etc.

---

## 📝 Expected Tables

After sync, you should see approximately 30+ tables:
- `users`
- `roles`
- `packages`
- `orders`
- `exercises`
- `workouts`
- `nutrition_logs`
- `nutrition_items`
- `subscriptions`
- `payments`
- `workout_sessions`
- `body_measurements`
- `achievements`
- `badges`
- `courses`
- `advertisements`
- (and more...)

---

## 🧪 Test Your API

After tables are created, test the packages endpoint:

```bash
curl https://api.arifworkout.com/api/packages
```

Should return:
```json
{
  "success": true,
  "data": {
    "packages": []
  }
}
```

---

## 🔧 Troubleshooting

### Error: "Cannot find module"
```bash
# Make sure you're in the app directory
cd ~/api.arifworkout.com

# Check if node_modules exist
ls -la node_modules

# If missing, install dependencies
npm install
```

### Error: "Access denied"
- Check your `.env` file has correct database credentials:
  ```
  DB_NAME=arifwowt_arif
  DB_USER=arifwowt_kaleb
  DB_PASSWORD=kalebeyasu
  ```

### Error: "Too many connections"
- Your script might be leaving connections open
- Check MySQL connection limit in cPanel
- Restart MySQL service

### Error: "Node version mismatch"
```bash
# Check Node version
node --version

# Should be v18.x (matches your cPanel selector)
```

---

## 📋 Important Notes

1. **Run sync script ONLY ONCE** for initial setup
2. **DO NOT use `sync({ force: true })`** in production (will delete data!)
3. **Backup** your database before any sync operations
4. The script uses `alter: false` for safety

---

## 🚀 After Tables Are Created

1. **Create admin user**:
   ```bash
   node src/scripts/create-admin.js
   ```

2. **Seed initial data** (optional):
   ```bash
   node src/scripts/seed.js
   ```

3. **Test all endpoints**:
   - GET `/api/auth/health`
   - GET `/api/packages`
   - GET `/api/exercises`

---

## ✅ Deployment Checklist

- [x] Code deployed to cPanel
- [ ] `.env` file configured
- [ ] Database tables created ← **YOU ARE HERE**
- [ ] Admin user created
- [ ] App restarted
- [ ] API endpoints tested

---

**Need Help?** Check cPanel error logs:
```bash
# View Node.js logs
tail -f ~/nodevenv/api.arifworkout.com/18/logs/error.log

# View app logs (if using PM2)
pm2 logs
```
