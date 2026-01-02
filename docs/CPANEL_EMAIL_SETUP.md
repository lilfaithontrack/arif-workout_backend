# cPanel Email Setup Guide

Since you have cPanel hosting, follow these steps to find the correct SMTP settings.

## Step 1: Log into cPanel

1. Log into your cPanel (usually: `yourdomain.com:2083` or provided by hosting)
2. Use your cPanel username and password

## Step 2: Find Email Account Settings

1. In cPanel, go to **"Email Accounts"** section
2. Look for **"contact@arifworkout.com"**
3. If it doesn't exist, create it:
   - Click **"Create"** or **"Add Email Account"**
   - Email: `contact@arifworkout.com`
   - Password: `Ha@603887` (or set a new one)
   - Click **"Create"**

## Step 3: Get SMTP Settings

1. Find **"contact@arifworkout.com"** in the email accounts list
2. Click on it or click **"Connect Devices"** / **"Mail Client Configuration"**
3. Look for **"Outgoing Server"** or **"SMTP Server"**
4. It will show something like:
   ```
   Outgoing Server: mail.arifworkout.com
   SMTP Port: 465
   SMTP Authentication: Required
   ```

## Step 4: Update .env File

Once you have the SMTP server hostname, update your `.env`:

```env
EMAIL_HOST=mail.arifworkout.com  # Use the hostname from Step 3
EMAIL_PORT=465                   # Usually 465 (SSL) or 587 (TLS)
EMAIL_SECURE=true                 # true for 465, false for 587
EMAIL_USER=contact@arifworkout.com
EMAIL_PASSWORD="Ha@603887"
EMAIL_FROM="ARIF WORK OUT <contact@arifworkout.com>"
```

## Common cPanel SMTP Settings

### Option 1: Port 465 (SSL)
```env
EMAIL_HOST=mail.arifworkout.com  # or arifworkout.com
EMAIL_PORT=465
EMAIL_SECURE=true
```

### Option 2: Port 587 (TLS)
```env
EMAIL_HOST=mail.arifworkout.com  # or arifworkout.com
EMAIL_PORT=587
EMAIL_SECURE=false
```

## Troubleshooting

### "Incorrect authentication data" error:
1. **Verify email account exists** in cPanel
2. **Check password** - try logging into webmail with the same credentials
3. **Enable SMTP** - some cPanel accounts need SMTP enabled
4. **Check email account status** - make sure it's active

### To test email account:
1. In cPanel, go to **"Email Accounts"**
2. Click **"Check Email"** or **"Webmail"**
3. Try logging in with: `contact@arifworkout.com` / `Ha@603887`
4. If webmail login works, the credentials are correct

### If mail server is different:
- Check cPanel for the actual mail server hostname
- It might be: `mail.yourhostingprovider.com`
- Or check your hosting provider's documentation

## Quick Update Script

After finding the mail server in cPanel, run:
```bash
node scripts/update-smtp-config.js
```

Then manually edit `.env` to set the correct `EMAIL_HOST` from cPanel.

