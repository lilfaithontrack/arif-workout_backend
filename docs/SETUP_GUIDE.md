# Complete Setup Guide - Email & Google OAuth

This guide explains exactly what information you need and how to get it for both email OTP and Google OAuth authentication.

---

## 📧 Part 1: Gmail Setup (For Sending OTP Emails)

### What You Need:
1. A Gmail account
2. Gmail App Password (NOT your regular Gmail password)

### Step-by-Step Process:

#### Step 1: Choose/Create Gmail Account
- Use an existing Gmail account OR create a new one
- Example: `arifapexfitness@gmail.com`

#### Step 2: Enable 2-Step Verification
1. Go to: https://myaccount.google.com/security
2. Scroll to "How you sign in to Google"
3. Click **"2-Step Verification"**
4. Click **"Get Started"**
5. Follow the prompts to set up (phone verification required)

#### Step 3: Generate App Password
1. Go to: https://myaccount.google.com/apppasswords
   - OR: Google Account → Security → 2-Step Verification → App passwords
2. You may need to sign in again
3. Under "Select app", choose **"Mail"**
4. Under "Select device", choose **"Other (Custom name)"**
5. Type: **"Arif Workout Backend"**
6. Click **"Generate"**
7. **IMPORTANT:** Copy the 16-character password shown
   - Example: `abcd efgh ijkl mnop` (no spaces in .env)
   - You won't be able to see this again!

#### Step 4: Add to .env File

```env
EMAIL_SERVICE=gmail
EMAIL_USER=arifapexfitness@gmail.com
EMAIL_PASSWORD=abcdefghijklmnop
EMAIL_FROM="Arif's Apex Fitness <noreply@arifsapex.com>"
OTP_EXPIRY_MINUTES=10
```

### ✅ What Each Variable Means:

| Variable | What It Is | Example |
|----------|-----------|---------|
| `EMAIL_SERVICE` | Email provider | `gmail` (always this for Gmail) |
| `EMAIL_USER` | Your Gmail address | `arifapexfitness@gmail.com` |
| `EMAIL_PASSWORD` | 16-char app password from Step 3 | `abcdefghijklmnop` |
| `EMAIL_FROM` | Display name in emails | `"Arif's Apex Fitness <noreply@arifsapex.com>"` |
| `OTP_EXPIRY_MINUTES` | How long OTP is valid | `10` (10 minutes) |

---

## 🔐 Part 2: Google OAuth Setup (For Google Sign-In)

### What You Need:
1. Google Cloud Console account (free)
2. OAuth 2.0 Client ID
3. OAuth 2.0 Client Secret
4. Callback URL configured

### Step-by-Step Process:

#### Step 1: Go to Google Cloud Console
1. Visit: https://console.cloud.google.com/
2. Sign in with your Google account (can be same as email above)

#### Step 2: Create a New Project
1. Click the project dropdown (top left, next to "Google Cloud")
2. Click **"New Project"**
3. Project name: **"Arif Workout Platform"** (or any name)
4. Click **"Create"**
5. Wait for project creation, then select it

#### Step 3: Enable Google+ API
1. In the search bar, type **"Google+ API"**
2. Click on **"Google+ API"**
3. Click **"Enable"**
4. Wait for it to enable

#### Step 4: Configure OAuth Consent Screen
1. In left menu, go to **"APIs & Services"** → **"OAuth consent screen"**
2. Choose **"External"** (unless you have Google Workspace)
3. Click **"Create"**

**Fill in the form:**
- **App name:** `Arif's Apex Fitness`
- **User support email:** Your email
- **App logo:** (optional, can skip for now)
- **Application home page:** `http://localhost:5173` (your frontend URL)
- **Authorized domains:** (leave empty for local dev)
- **Developer contact email:** Your email
4. Click **"Save and Continue"**
5. **Scopes:** Click "Add or Remove Scopes"
   - Check: `userinfo.email`
   - Check: `userinfo.profile`
   - Click **"Update"**
6. Click **"Save and Continue"**
7. **Test users:** Click "Add Users"
   - Add your email for testing
   - Click **"Save and Continue"**
8. Review and click **"Back to Dashboard"**

#### Step 5: Create OAuth Credentials
1. Go to **"Credentials"** (left menu)
2. Click **"Create Credentials"** → **"OAuth client ID"**
3. **Application type:** Choose **"Web application"**
4. **Name:** `Arif Workout Web Client`

**Authorized JavaScript origins:**
- Add: `http://localhost:5000`
- Add: `http://localhost:5173` (if your frontend is here)
- Click **"ADD URI"** for each

**Authorized redirect URIs:**
- Add: `http://localhost:5000/api/auth/google/callback`
- Click **"ADD URI"**

5. Click **"Create"**

#### Step 6: Copy Your Credentials
A popup will show your credentials:

```
Your Client ID
1234567890-abcdefghijklmnopqrstuvwxyz123456.apps.googleusercontent.com

Your Client Secret  
GOCSPX-AbCdEfGhIjKlMnOpQrStUvWxYz
```

**IMPORTANT:** Copy both values immediately!

#### Step 7: Add to .env File

```env
GOOGLE_CLIENT_ID=1234567890-abcdefghijklmnopqrstuvwxyz123456.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-AbCdEfGhIjKlMnOpQrStUvWxYz
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
```

### ✅ What Each Variable Means:

| Variable | What It Is | Example |
|----------|-----------|---------|
| `GOOGLE_CLIENT_ID` | Your OAuth Client ID (long string) | `123456-abc...xyz.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | Your OAuth Client Secret | `GOCSPX-AbCdEf...` |
| `GOOGLE_CALLBACK_URL` | Where Google redirects after auth | `http://localhost:5000/api/auth/google/callback` |

---

## 📝 Complete .env File Template

Here's what your `.env` file should look like with all values:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MySQL Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=arif_workout
DB_USER=root
DB_PASSWORD=your_mysql_password

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# ========================================
# EMAIL CONFIGURATION (For OTP Emails)
# ========================================
EMAIL_SERVICE=gmail
EMAIL_USER=arifapexfitness@gmail.com
EMAIL_PASSWORD=abcdefghijklmnop
EMAIL_FROM="Arif's Apex Fitness <noreply@arifsapex.com>"

# OTP Configuration
OTP_EXPIRY_MINUTES=10

# ========================================
# GOOGLE OAUTH (For Google Sign-In)
# ========================================
GOOGLE_CLIENT_ID=1234567890-abcdefghijklmnopqrstuvwxyz123456.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-AbCdEfGhIjKlMnOpQrStUvWxYz
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Frontend URL (for OAuth redirects)
FRONTEND_URL=http://localhost:5173
```

---

## 🔍 Quick Verification Checklist

### Email Setup ✓
- [ ] Gmail account created/selected
- [ ] 2-Step Verification enabled
- [ ] App Password generated (16 characters)
- [ ] `EMAIL_USER` set to your Gmail address
- [ ] `EMAIL_PASSWORD` set to App Password (no spaces)
- [ ] `EMAIL_SERVICE` set to `gmail`

### Google OAuth Setup ✓
- [ ] Google Cloud project created
- [ ] OAuth consent screen configured
- [ ] OAuth Client ID created
- [ ] `GOOGLE_CLIENT_ID` copied (ends with `.apps.googleusercontent.com`)
- [ ] `GOOGLE_CLIENT_SECRET` copied (starts with `GOCSPX-`)
- [ ] Callback URL matches your backend URL

---

## 🧪 Testing After Setup

### Test 1: Email (Send Test OTP)
After setting up email, test signup:
```bash
POST http://localhost:5000/api/auth/signup
{
  "name": "Test User",
  "email": "your-personal-email@gmail.com",
  "password": "test123"
}
```
**Check:** Email should arrive within 30 seconds

### Test 2: Google OAuth
Visit in browser:
```
http://localhost:5000/api/auth/google
```
**Check:** Should redirect to Google login page

---

## ❓ Common Issues & Solutions

### Issue 1: "Invalid credentials" when sending email
**Problem:** Email password is wrong
**Solution:** 
- Make sure you're using the 16-character App Password, not your Gmail password
- Remove any spaces from the password in .env

### Issue 2: "App Password option not showing"
**Problem:** 2-Step Verification not enabled
**Solution:** Enable 2-Step Verification first at https://myaccount.google.com/security

### Issue 3: Google OAuth "Error 400: redirect_uri_mismatch"
**Problem:** Callback URL doesn't match Google Console
**Solution:** 
- Check `GOOGLE_CALLBACK_URL` in .env matches exactly what you entered in Google Console
- Include `http://` and correct port (5000)

### Issue 4: "Access blocked: This app's request is invalid"
**Problem:** Scopes not configured in OAuth consent
**Solution:** Add `userinfo.email` and `userinfo.profile` scopes in Google Console

---

## 🎯 Summary - What You Need to Gather

### For Email (Gmail):
1. ✉️ **Gmail address** - The email account to send from
2. 🔑 **App Password** - 16 characters from Google Account settings

### For Google OAuth:
1. 🆔 **Client ID** - Long string ending in `.apps.googleusercontent.com`
2. 🔐 **Client Secret** - String starting with `GOCSPX-`

**That's it!** Just these 4 pieces of information and you're ready to go.

---

## 📞 Need Help?

If you get stuck at any step:
1. Double-check you followed each step exactly
2. Make sure there are no extra spaces in your .env values
3. Restart the backend server after changing .env
4. Check the server console logs for specific error messages

---

## ✅ After Setup

Once you have all values in your `.env` file:

1. **Sync database:**
   ```bash
   npm run db:sync
   ```

2. **Restart server:**
   ```bash
   npm run dev
   ```

3. **Test the features!**
