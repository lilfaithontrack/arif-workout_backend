# Google Workspace App Password Setup (Domain Email)

If you're using a Google Workspace domain email (like `contact@arifworkout.com`), the App Password feature might not be visible because it's controlled by your workspace administrator.

---

## 🔍 Why Can't I See App Passwords?

Google Workspace accounts have **different security settings** than regular Gmail. The App Password option might be:
- Disabled by your workspace administrator
- Hidden because 2-Step Verification isn't enabled
- Replaced by more secure authentication methods

---

## ✅ Solution: Enable App Passwords in Workspace

### Option 1: For Workspace Admins (Recommended)

If you're the **admin** of the workspace:

#### Step 1: Go to Admin Console
1. Visit: https://admin.google.com/
2. Sign in with your admin account

#### Step 2: Enable Less Secure Apps (if needed)
1. Go to **Security** → **Authentication**
2. Scroll to **Less secure apps**
3. Click **"Go to settings for less secure apps"**
4. Select **"Allow users to manage their access to less secure apps"**
5. Click **Save**

#### Step 3: Enable 2-Step Verification for User
1. Still in Admin Console
2. Go to **Security** → **Authentication** → **2-Step Verification**
3. Click **"Enforcement"**
4. Select organizational unit (or all users)
5. Choose **"Allow users to turn on 2-Step Verification"** or **"Enforce for all users"**
6. Click **Save**

#### Step 4: User Creates App Password
Now the user (`contact@arifworkout.com`) can:
1. Go to: https://myaccount.google.com/security
2. Sign in with `contact@arifworkout.com`
3. Enable **2-Step Verification** (if not enforced)
4. Go to **App Passwords**
5. Generate password for "Mail"

---

### Option 2: For Non-Admins

If you're **not the admin**, you need to:

1. **Ask your workspace admin** to enable App Passwords
2. **Or ask them** to create an app password for `contact@arifworkout.com`
3. **Or ask them** to create a dedicated email account with the necessary permissions

---

### Option 3: Use OAuth2 (Advanced, but more secure)

Instead of app passwords, use OAuth2 authentication:

#### Setup:
1. Create OAuth2 credentials in Google Cloud Console
2. Use `nodemailer` with OAuth2 configuration
3. More complex setup but more secure

**Code changes needed:**
```javascript
// In otp.service.js
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: 'contact@arifworkout.com',
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
    accessToken: process.env.GOOGLE_ACCESS_TOKEN
  }
});
```

---

### Option 4: Use SMTP Relay (Easiest for Workspace)

Google Workspace can use SMTP Relay without app passwords:

#### Admin Setup:
1. Go to: https://admin.google.com/
2. **Apps** → **Google Workspace** → **Gmail** → **Routing**
3. Click **"SMTP Relay service"**
4. Click **"Add another"** or configure existing
5. Settings:
   - Allowed senders: **Only addresses in my domain**
   - Authentication: **Require SMTP Authentication**
   - Click **Save**

#### Your .env Configuration:
```env
EMAIL_HOST=smtp-relay.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=contact@arifworkout.com
EMAIL_PASSWORD=your-workspace-password
EMAIL_FROM="Arif's Apex Fitness <contact@arifworkout.com>"
```

**Note:** With SMTP Relay, you might use your regular workspace password instead of an app password.

---

## 🎯 Quick Decision Guide

**Are you the workspace admin?**
- ✅ **YES** → Follow Option 1 above to enable App Passwords
- ❌ **NO** → Use Option 4 (SMTP Relay) or ask admin for Option 1

---

## 📞 Contact Your Workspace Admin

If you need help from your admin, send them this message:

```
Hi [Admin Name],

I need to send automated emails from contact@arifworkout.com 
for our workout platform's OTP verification system.

Could you please enable App Passwords for this account?

Steps needed:
1. Admin Console → Security → Authentication
2. Enable "Allow users to manage access to less secure apps"
3. Enable 2-Step Verification for contact@arifworkout.com
4. I'll then generate an App Password

Alternatively, we could use SMTP Relay if that's easier.

Thank you!
```

---

## 🧪 Testing SMTP Relay (Option 4)

Try this configuration first:

```env
EMAIL_HOST=smtp-relay.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=contact@arifworkout.com
EMAIL_PASSWORD=your-workspace-password
EMAIL_FROM="Arif's Apex Fitness <contact@arifworkout.com>"
```

Then test with:
```bash
npm run dev
# Try signup endpoint
```

---

## ✅ Recommended Solution

For **Google Workspace**, I recommend **Option 4 (SMTP Relay)** because:
- ✅ No App Password needed
- ✅ Works with regular workspace password
- ✅ More reliable for domain emails
- ✅ Better deliverability

---

## 🔐 Security Note

If you can't access admin settings and can't get App Passwords:
1. Ask your workspace admin to help
2. Or create a separate Gmail account temporarily for testing
3. Switch to workspace email once admin enables it

---

## Need Help?

If you're still stuck, tell me:
1. Are you the workspace admin?
2. What do you see when you go to https://myaccount.google.com/security?
3. Have you tried SMTP Relay option?
