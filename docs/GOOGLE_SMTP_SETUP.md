# Google Workspace SMTP Setup

Since your MX records point to `smtp.google.com`, you're using Google Workspace for email. We need to configure the SMTP to use Google's servers.

## Step 1: Get Google App Password

**IMPORTANT:** You cannot use your regular Google password. You need an App Password.

### How to Get Google App Password:

1. Go to: https://myaccount.google.com/security
2. Make sure **2-Step Verification** is enabled (required for App Passwords)
3. Go to: https://myaccount.google.com/apppasswords
4. Under "Select app", choose **"Mail"**
5. Under "Select device", choose **"Other (Custom name)"**
6. Type: **"ARIF WORK OUT Backend"**
7. Click **"Generate"**
8. **Copy the 16-character password** (it looks like: `abcd efgh ijkl mnop`)
   - Remove spaces when adding to .env file
   - Example: `abcdefghijklmnop`

## Step 2: Update .env File

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=support@arifworkout.com
EMAIL_PASSWORD=your-16-char-app-password  # No quotes needed, no spaces
EMAIL_FROM="ARIF WORK OUT <support@arifworkout.com>"
OTP_EXPIRY_MINUTES=10
```

## Step 3: Test Configuration

Run the test script:
```bash
node scripts/test-smtp-diagnostic.js
```

## Alternative: Port 465 with SSL

If port 587 doesn't work, try port 465:

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=465
EMAIL_SECURE=true
EMAIL_USER=support@arifworkout.com
EMAIL_PASSWORD=your-16-char-app-password
EMAIL_FROM="ARIF WORK OUT <support@arifworkout.com>"
```

## Troubleshooting

### "Invalid login" error:
- Make sure you're using an **App Password**, not your regular password
- Make sure 2-Step Verification is enabled
- Check that the email is `support@arifworkout.com` (not @gmail.com)

### "Less secure app access" error:
- This shouldn't happen with App Passwords
- Make sure you're using an App Password, not your regular password

### Emails still not arriving:
- Check spam folder
- Wait 1-2 minutes
- Check Gmail filters

