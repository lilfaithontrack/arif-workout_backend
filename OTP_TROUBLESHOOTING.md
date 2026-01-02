# OTP Email Troubleshooting Guide

## Issue: OTP Code Not Being Sent

If you're not receiving OTP codes when trying to login, follow these steps:

### 1. Check Backend Server Status

First, verify the backend server is running:

```bash
cd backend
npm start
```

Check the console for:
- ✅ Server started message
- ✅ Database connection success
- ✅ No error messages

### 2. Test the Route

The route should be available at:
```
POST /api/auth/login/request-otp
```

Test it with:
```bash
curl -X POST http://localhost:5000/api/auth/login/request-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"your-email@example.com"}'
```

Or use the test script:
```bash
cd backend
node scripts/test-login-otp.js your-email@example.com
```

### 3. Check Email Configuration

Verify your `.env` file has correct email settings:

```env
# For Gmail SMTP
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=contact@arifworkout.com
EMAIL_PASSWORD=your-app-password-here
EMAIL_FROM="ARIF WORK OUT" <contact@arifworkout.com>
```

**Important for Gmail:**
- You MUST use an App Password, not your regular password
- Enable 2-Step Verification first
- Generate App Password: https://myaccount.google.com/apppasswords

### 4. Check Backend Logs

When requesting OTP, you should see:
```
🔐 Login OTP request received for email: user@example.com
👤 User lookup result: Found user ID 123
✅ User 123 is active and verified, proceeding with OTP generation
📧 Attempting to send login OTP to user@example.com for user Name
📧 Preparing to send login OTP email to user@example.com
📧 OTP Code: 123456, Name: User Name
📧 Email transporter created successfully
📧 Sending email with OTP 123456 to user@example.com...
✅ Login OTP Email sent successfully: { messageId: '...' }
```

If you see errors, check:
- Email configuration (host, port, credentials)
- Network connectivity
- Firewall settings

### 5. Check User Status

The user must be:
- ✅ Active (`isActive: true`)
- ✅ Email verified (`isEmailVerified: true`)

If not, you'll get: "Account is not active or verified"

### 6. Common Issues

#### Issue: "Route not found"
**Solution:** 
- Restart the backend server
- Check that routes are properly mounted in `server.js`
- Verify the route path matches exactly: `/api/auth/login/request-otp`

#### Issue: "Failed to send OTP email"
**Solution:**
- Check email credentials in `.env`
- For Gmail, use App Password (not regular password)
- Check SMTP port (587 for STARTTLS, 465 for SSL)
- Verify firewall allows outbound SMTP

#### Issue: Email sent but not received
**Solution:**
- Check spam/junk folder
- Wait a few minutes (email delivery can be delayed)
- Verify email address is correct
- Check email provider's filtering rules

### 7. Test Email Service Directly

Run the test script:
```bash
cd backend
node scripts/test-login-otp.js your-email@example.com
```

This will:
1. Check if user exists
2. Activate/verify user if needed (for testing)
3. Generate OTP
4. Store in database
5. Send email
6. Show the OTP code for verification

### 8. Debug Mode

Enable detailed logging by checking:
- Backend console logs (should show email sending process)
- Frontend console logs (should show API request/response)
- Network tab in browser/dev tools (check API call status)

### 9. Verify Email Template

The OTP code should appear in the email template. Check:
- `backend/src/services/otp.service.js` line 326
- Should have: `<div class="otp-code">${otp}</div>`

### 10. Check Database

Verify OTP is stored:
```sql
SELECT * FROM otps 
WHERE email = 'your-email@example.com' 
AND type = 'login' 
AND consumed = 0 
ORDER BY createdAt DESC 
LIMIT 1;
```

## Quick Fix Checklist

- [ ] Backend server is running
- [ ] Email credentials are correct in `.env`
- [ ] Using Gmail App Password (if using Gmail)
- [ ] User account is active and verified
- [ ] Email address is correct
- [ ] Checked spam folder
- [ ] Network connection is working
- [ ] No firewall blocking SMTP

## Still Not Working?

1. Check backend logs for detailed error messages
2. Test email service directly with the test script
3. Verify SMTP settings with your email provider
4. Check if emails are being sent but filtered by provider

