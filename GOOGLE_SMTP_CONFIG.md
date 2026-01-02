# Google SMTP Configuration

## Current Configuration

The backend OTP system is now configured to **ONLY use Google SMTP (Gmail)**, not cPanel.

## Email Transporter Priority

1. **Priority 1**: If `EMAIL_HOST` contains `gmail.com` → Uses Google SMTP with custom host/port
2. **Priority 2**: If no `EMAIL_HOST` or not Gmail → Uses Gmail service (Google SMTP)

This ensures we **never use cPanel SMTP** - always Google SMTP.

## Required Environment Variables

Add these to your `.env` file:

```env
# Google SMTP Configuration (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=contact@arifworkout.com
EMAIL_PASSWORD=brvbtjdlryutvprw
EMAIL_FROM="ARIF WORK OUT" <contact@arifworkout.com>
```

## Important Notes

1. **App Password Required**: You MUST use a Google App Password, not your regular Gmail password
2. **Port 587**: Uses STARTTLS (not SSL on port 465)
3. **No cPanel**: The system will always use Google SMTP, even if cPanel settings exist
4. **Email Address**: Use `contact@arifworkout.com` (your Google Workspace email)

## Verification

To verify the configuration is working:

```bash
cd backend
node scripts/test-login-otp.js your-email@example.com
```

This will:
- Check user exists
- Generate OTP
- Send email via Google SMTP
- Show the OTP code

## Troubleshooting

If emails aren't sending:

1. **Check App Password**: Ensure you're using a 16-character App Password
2. **Check Email**: Verify `contact@arifworkout.com` is a valid Google Workspace account
3. **Check Logs**: Look for `📧 Using Google SMTP` or `📧 Using Gmail service` in logs
4. **Test Connection**: Run the test script to verify SMTP connection

## Logs

When sending OTP, you should see:
```
📧 Using Google SMTP (Gmail) configuration
```
or
```
📧 Using Gmail service (Google SMTP)
```

This confirms Google SMTP is being used, not cPanel.

