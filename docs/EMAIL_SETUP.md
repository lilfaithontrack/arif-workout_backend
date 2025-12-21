# Email Configuration - Quick Reference

## 🔐 Credentials
- **Email:** contact@arifworkout.com
- **Password:** Ha@603887

---

## 💻 Development (Localhost)

Your `.env` file for **local development**:

```env
# Email Configuration (Development)
EMAIL_HOST=smtp-relay.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=contact@arifworkout.com
EMAIL_PASSWORD=Ha@603887
EMAIL_FROM="Arif's Apex Fitness <contact@arifworkout.com>"

# OTP Settings
OTP_EXPIRY_MINUTES=10
```

---

## 🚀 Production

Your `.env` file for **production**:

```env
# Email Configuration (Production)
EMAIL_HOST=smtp-relay.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=contact@arifworkout.com
EMAIL_PASSWORD=Ha@603887
EMAIL_FROM="Arif's Apex Fitness <contact@arifworkout.com>"

# OTP Settings
OTP_EXPIRY_MINUTES=10
```

### Production Server IP Requirement:
- Your production server must have IP: **91.204.209.46**
- Or add your production server's IP to Google Workspace SMTP Relay allowed list

---

## ✅ Setup Steps

### 1. Update .env file
Copy the development configuration above to your `.env` file

### 2. Sync Database
```bash
npm run db:sync
```

### 3. Start Server
```bash
npm run dev
```

### 4. Test Signup
```bash
POST http://localhost:5000/api/auth/signup
Content-Type: application/json

{
  "name": "Test User",
  "email": "yourtest@gmail.com",
  "password": "test123"
}
```

Check `yourtest@gmail.com` inbox for the OTP email!

---

## 🔍 Production Deployment Checklist

When deploying to production:

- [ ] Production server IP is **91.204.209.46** (or update SMTP Relay settings)
- [ ] `.env` file has correct email credentials
- [ ] Database synced with `npm run db:sync`
- [ ] JWT_SECRET changed to strong random value
- [ ] NODE_ENV set to `production`

---

## 🧪 Testing

After setup, test the flow:

1. **Signup** → OTP sent to email
2. **Check email** → Verify OTP received from contact@arifworkout.com
3. **Verify OTP** → Account activated
4. **Login** → Success!

---

## ⚠️ Security Note

**IMPORTANT:** Never commit your `.env` file to git!

Make sure `.env` is in `.gitignore`:
```
.env
```

---

## 🎯 Ready to Test!

Your configuration is complete. Just:
1. Copy the development config to `.env`
2. Run `npm run db:sync`
3. Run `npm run dev`
4. Test the signup endpoint!
