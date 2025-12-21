# Google Workspace SMTP Setup Guide

This guide explains how to set up Google Workspace SMTP for sending OTP emails using your custom domain email (e.g., `noreply@yourdomain.com`).

---

## 📧 What is Google Workspace?

Google Workspace (formerly G Suite) allows you to use Gmail with your own custom domain:
- Example: `support@arifsapex.com` instead of `support@gmail.com`
- Professional business email
- Same Gmail interface and features

---

## 🔧 SMTP Configuration

### What You Need:

1. **Custom domain email address** (e.g., `noreply@yourdomain.com`)
2. **App Password** from Google Workspace account
3. **SMTP server details** (provided below)

---

## 📋 Step-by-Step Setup

### Step 1: Access Your Google Workspace Account

1. Go to: https://admin.google.com/
2. Sign in with your workspace admin account
3. Or sign in directly to the email account you want to use

### Step 2: Enable 2-Step Verification

1. Go to: https://myaccount.google.com/security
2. Sign in with your workspace email (e.g., `noreply@yourdomain.com`)
3. Scroll to **"How you sign in to Google"**
4. Click **"2-Step Verification"**
5. Click **"Get Started"** and follow the setup

> **Note:** This must be enabled on the specific email account you'll use for sending

### Step 3: Generate App Password

1. Go to: https://myaccount.google.com/apppasswords
2. Sign in with your workspace email
3. Under "Select app", choose **"Mail"**
4. Under "Select device", choose **"Other (Custom name)"**
5. Type: **"Arif Workout Backend SMTP"**
6. Click **"Generate"**
7. **Copy the 16-character password** (e.g., `abcd efgh ijkl mnop`)
   - Remove spaces when adding to .env
   - You can't view this again, so save it securely

### Step 4: Configure Environment Variables

Add these to your `.env` file:

```env
# Google Workspace SMTP Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=noreply@yourdomain.com
EMAIL_PASSWORD=abcdefghijklmnop
EMAIL_FROM="Arif's Apex Fitness <noreply@yourdomain.com>"

# OTP Settings
OTP_EXPIRY_MINUTES=10
```

---

## 🔍 Configuration Explained

| Variable | Value | Description |
|----------|-------|-------------|
| `EMAIL_HOST` | `smtp.gmail.com` | Google's SMTP server (same for Workspace) |
| `EMAIL_PORT` | `587` | Standard TLS port (or use 465 for SSL) |
| `EMAIL_SECURE` | `false` | `false` for port 587, `true` for port 465 |
| `EMAIL_USER` | `noreply@yourdomain.com` | Your Workspace email address |
| `EMAIL_PASSWORD` | `abcdefghijklmnop` | 16-char App Password (no spaces) |
| `EMAIL_FROM` | `"Name <email>"` | Display name and email |

---

## ⚙️ Alternative Port Configuration

### Option 1: Port 587 (TLS - Recommended)
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
```

### Option 2: Port 465 (SSL)
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=465
EMAIL_SECURE=true
```

---

## ✅ Verification Checklist

Before testing, ensure:

- [ ] You have access to Google Workspace admin or the email account
- [ ] 2-Step Verification is enabled on the sending email account
- [ ] App Password has been generated (16 characters)
- [ ] All values added to `.env` file
- [ ] No spaces in `EMAIL_PASSWORD`
- [ ] `EMAIL_USER` is your full workspace email (with domain)
- [ ] Backend server restarted after `.env` changes

---

## 🧪 Testing

### Test 1: Start Server

```bash
npm run dev
```

Check console for any email configuration errors.

### Test 2: Send Test Signup

```bash
POST http://localhost:5000/api/auth/signup
Content-Type: application/json

{
  "name": "Test User",
  "email": "your-personal-email@gmail.com",
  "password": "test123"
}
```

### Test 3: Check Email Receipt

- Check the personal email inbox
- Email should arrive from your workspace address
- Subject: "Email Verification - OTP Code"
- From: "Arif's Apex Fitness <noreply@yourdomain.com>"

---

## 🚨 Common Issues & Solutions

### Issue 1: "Invalid login" or "Username and Password not accepted"

**Cause:** Using regular email password instead of App Password

**Solution:**
- Use the 16-character App Password, NOT your regular workspace password
- Regenerate App Password if lost
- Ensure no spaces in password in .env

### Issue 2: "Could not connect to smtp.gmail.com"

**Cause:** Firewall or incorrect port

**Solutions:**
- Try port 465 with `EMAIL_SECURE=true`
- Check firewall allows outbound SMTP
- Verify internet connection

### Issue 3: "Authentication failed"

**Cause:** 2-Step Verification not enabled

**Solution:**
- Enable 2-Step Verification on the workspace account
- Wait 5-10 minutes for changes to propagate
- Try generating a new App Password

### Issue 4: "Sender address rejected"

**Cause:** EMAIL_FROM doesn't match EMAIL_USER domain

**Solution:**
```env
# Make sure the email domain matches
EMAIL_USER=noreply@yourdomain.com
EMAIL_FROM="Arif's Apex Fitness <noreply@yourdomain.com>"
# ✅ Domain matches: yourdomain.com
```

### Issue 5: Emails going to spam

**Solutions:**
- Configure SPF record for your domain
- Set up DKIM signing
- Configure DMARC policy
- (Contact your domain administrator for DNS changes)

---

## 📊 Email Delivery Settings (Advanced)

### SPF Record (Recommended)

Add to your domain's DNS:
```
Type: TXT
Name: @
Value: v=spf1 include:_spf.google.com ~all
```

### DKIM Setup (Recommended)

1. Go to Google Admin Console: https://admin.google.com/
2. Apps → Google Workspace → Gmail → Authenticate email
3. Generate new record
4. Add the TXT record to your domain's DNS

---

## 🔐 Security Best Practices

1. **Use a dedicated email** - Create `noreply@yourdomain.com` specifically for app emails
2. **Limit permissions** - Don't use your main admin account
3. **Rotate App Passwords** - Generate new ones periodically
4. **Monitor usage** - Check Google Admin Console for suspicious activity
5. **Revoke unused passwords** - Remove old App Passwords

---

## 🌍 Multiple Environments

### Development (.env)
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=dev-noreply@yourdomain.com
EMAIL_PASSWORD=dev_app_password
```

### Production
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=noreply@yourdomain.com
EMAIL_PASSWORD=prod_app_password
```

---

## 🎯 Complete Example

Here's a complete working configuration:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_NAME=arif_workout
DB_USER=root
DB_PASSWORD=yourpassword

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# Email (Google Workspace)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=noreply@arifsapex.com
EMAIL_PASSWORD=abcd efgh ijkl mnop
EMAIL_FROM="Arif's Apex Fitness <noreply@arifsapex.com>"

# OTP
OTP_EXPIRY_MINUTES=10

# Frontend
FRONTEND_URL=http://localhost:5173
```

---

## 📞 Still Having Issues?

1. **Check server logs** - Look for specific error messages
2. **Test SMTP credentials** - Use a tool like [https://www.smtper.net/](https://www.smtper.net/)
3. **Verify DNS settings** - Ensure your domain is properly configured
4. **Contact support** - Reach out to Google Workspace support if authentication fails

---

## ✅ Summary

**What you need:**
1. ✉️ Google Workspace email address (e.g., `noreply@yourdomain.com`)
2. 🔑 16-character App Password

**Configuration:**
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-workspace-email@yourdomain.com
EMAIL_PASSWORD=your-16-char-app-password
EMAIL_FROM="Your App Name <your-workspace-email@yourdomain.com>"
```

That's it! Your backend will now send OTP emails from your professional domain email. 🚀
