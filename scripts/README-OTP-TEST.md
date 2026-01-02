# SMTP OTP Login Test Script

## Overview
This script tests the SMTP OTP login functionality with arifworkout.com email credentials.

## Prerequisites
1. Backend server must be running (`npm run dev`)
2. Database must be connected and synced
3. Environment variables must be configured in `.env`:
   ```env
   EMAIL_HOST=arifworkout.com
   EMAIL_PORT=465
   EMAIL_SECURE=true
   EMAIL_USER=support@arifworkout.com
   EMAIL_PASSWORD=Kalebeyasu123@#
   EMAIL_FROM="ARIF WORK OUT <support@arifworkout.com>"
   OTP_EXPIRY_MINUTES=10
   ```

## Usage

### Full Test Suite
Run all tests (SMTP connection, request OTP, verify OTP):
```bash
npm run test:otp
# or
node scripts/test-otp-login.js
```

### Test with Specific Email
```bash
npm run test:otp your-email@example.com
# or
node scripts/test-otp-login.js your-email@example.com
```

### Manual OTP Verification
If you received an OTP code via email, verify it manually:
```bash
node scripts/test-otp-login.js your-email@example.com 123456
```

## Test Flow

1. **SMTP Connection Test**
   - Checks environment variables
   - Tests sending a login OTP email
   - Verifies SMTP connection to arifworkout.com

2. **User Status Check**
   - Verifies user exists in database
   - Checks if user is active and verified

3. **Request Login OTP**
   - Sends POST request to `/api/auth/login/request-otp`
   - Generates and stores OTP in database
   - Sends OTP email via SMTP

4. **Get OTP from Database**
   - Retrieves the OTP code from database
   - Shows expiry time and attempts

5. **Verify Login OTP**
   - Sends POST request to `/api/auth/login/verify-otp`
   - Validates OTP code
   - Returns JWT token on success

## Expected Output

```
╔════════════════════════════════════════════════════════════╗
║     ARIF WORK OUT - SMTP OTP Login Test Script           ║
╚════════════════════════════════════════════════════════════╝

📧 Test Email: test@example.com
🌐 API Base URL: http://localhost:5000

🔌 Connecting to database...
✅ Database connected!

============================================================
TEST 1: SMTP Connection Test
============================================================
📧 Testing SMTP connection to arifworkout.com...
✓ EMAIL_HOST: arifworkout.com
✓ EMAIL_PORT: 465
✓ EMAIL_SECURE: true
✓ EMAIL_USER: support@arifworkout.com

📨 Sending test login OTP email...
✅ SMTP connection successful! Email sent.
📬 Check test@example.com for the test OTP email

------------------------------------------------------------
🧪 Test 2: Request Login OTP via API
------------------------------------------------------------
📤 Requesting login OTP for: test@example.com
✅ Login OTP request successful!
   Message: OTP sent to your email. Please check your inbox.
```

## Troubleshooting

### SMTP Connection Failed
- Check that `EMAIL_HOST`, `EMAIL_USER`, and `EMAIL_PASSWORD` are set correctly
- Verify port 465 is not blocked by firewall
- Ensure SSL/TLS is properly configured
- Check email credentials are correct

### User Not Found
- Create a user first or use an existing email
- Ensure user is active and email verified

### API Connection Failed
- Make sure backend server is running (`npm run dev`)
- Check that API_BASE_URL is correct (default: http://localhost:5000)

### OTP Not Received
- Check spam/junk folder
- Verify email address is correct
- Check SMTP logs in server console
- Ensure OTP_EXPIRY_MINUTES is set appropriately

