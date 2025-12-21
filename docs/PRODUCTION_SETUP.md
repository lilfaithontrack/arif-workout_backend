# Production Environment Setup Guide

## ⚠️ IMPORTANT: Security Best Practices

**NEVER commit actual credentials to Git!** This guide shows you how to set up production environment variables securely.

## 🚀 Production Database Configuration

### Your Production Credentials:
```bash
DB_NAME=arifwowt_arif
DB_USER=arifwowt_kaleb
DB_PASSWORD=kalebeyasu
```

### Setup on Production Server:

#### Option 1: Using cPanel File Manager (Recommended for Shared Hosting)

1. **Login to cPanel**
2. **Go to File Manager**
3. **Navigate to your app directory** (where backend code is deployed)
4. **Create/Edit `.env` file** (create if doesn't exist)
5. **Add these lines:**
   ```bash
   # Server
   NODE_ENV=production
   PORT=5000
   
   # Database (Production)
   DB_HOST=localhost
   DB_NAME=arifwowt_arif
   DB_USER=arifwowt_kaleb
   DB_PASSWORD=kalebeyasu
   
   # JWT (Generate a strong secret!)
   JWT_SECRET=your-super-secret-production-jwt-key-change-this
   JWT_EXPIRES_IN=7d
   
   # Frontend URL (Your production domain)
   FRONTEND_URL=https://arifworkout.com
   
   # Email (Your actual Gmail app password)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_SECURE=false
   EMAIL_USER=contact@arifworkout.com
   EMAIL_PASSWORD=your-actual-app-password-here
   EMAIL_FROM="Arif's Apex Fitness <contact@arifworkout.com>"
   
   # OAuth (Production URLs)
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   GOOGLE_CALLBACK_URL=https://api.arifworkout.com/api/auth/google/callback
   
   # Stripe
   STRIPE_SECRET_KEY=sk_live_your_live_stripe_key
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
   ```

6. **Save the file**
7. **Set file permissions to 600** (only owner can read/write)

#### Option 2: Using SSH/Terminal

```bash
# SSH into your server
ssh username@your-server.com

# Navigate to your app directory
cd /path/to/your/backend

# Create .env file
nano .env

# Paste the configuration above
# Save with Ctrl+X, then Y, then Enter

# Set secure permissions
chmod 600 .env

# Restart your Node.js application
pm2 restart arif-backend
# OR
systemctl restart arif-backend
```

#### Option 3: Using Environment Variables (Cloud Platforms)

**For platforms like Heroku, Railway, Vercel, etc:**

1. Go to your platform's dashboard
2. Find "Environment Variables" or "Secrets" section
3. Add each variable individually:
   - `DB_NAME` = `arifwowt_arif`
   - `DB_USER` = `arifwowt_kaleb`  
   - `DB_PASSWORD` = `kalebeyasu`
   - `NODE_ENV` = `production`
   - etc.

---

## 🔒 Security Checklist

- [ ] `.env` file is added to `.gitignore`
- [ ] No credentials in `.env.example`
- [ ] Production `.env` has different JWT_SECRET than development
- [ ] Database password is strong
- [ ] File permissions set to 600 on `.env` file
- [ ] Using HTTPS in production
- [ ] OAuth callback URLs point to production domain
- [ ] Stripe using live keys (not test keys)

---

## 🧪 Test Production Database Connection

```bash
# On your production server
cd /path/to/backend

# Test database connection
node -e "require('dotenv').config(); const {connectDB} = require('./src/config/database'); connectDB();"
```

Expected output:
```
MySQL Connected: localhost:3306
📊 Total tables: XX
```

---

## 📝 Important Notes

1. **Database Host**: Usually `localhost` if MySQL is on same server
2. **Database already exists**: Make sure `arifwowt_arif` database is created in cPanel/phpMyAdmin
3. **User permissions**: Ensure `arifwowt_kaleb` has full permissions on `arifwowt_arif` database
4. **SSL**: If using remote database, you may need SSL configuration

---

## 🚀 Next Steps After Setup

1. **Run migrations** (creates database tables):
   ```bash
   npm run db:sync
   ```

2. **Create admin user**:
   ```bash
   node src/scripts/create-admin.js
   ```

3. **Start production server**:
   ```bash
   npm start
   # OR with PM2
   pm2 start src/server.js --name arif-backend
   ```

4. **Test API**:
   ```bash
   curl https://api.arifworkout.com/api/auth/health
   ```

---

## 🆘 Troubleshooting

### "Access denied for user"
- Check username and password are correct
- Verify user has permissions on database
- Check if remote connections are allowed (if not localhost)

### "Unknown database"
- Create the database first in cPanel/phpMyAdmin:
  ```sql
  CREATE DATABASE arifwowt_arif;
  ```

### "Connection timeout"
- Check firewall allows MySQL connection
- Verify DB_HOST is correct
- Check if MySQL is running

---

**Need help?** Contact your hosting provider's support for database connection issues.
