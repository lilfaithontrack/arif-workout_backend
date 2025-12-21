# OTP Authentication System - API Documentation

This document provides comprehensive information about the OTP (One-Time Password) verification system integrated into the authentication flow.

## Overview

The system implements email-based OTP verification for users who sign up with email/password. Google OAuth users are automatically verified and don't require OTP verification.

---

## Authentication Flow

### For Email/Password Users:
1. **Signup** → Receive OTP via email
2. **Verify OTP** → Account activated
3. **Login** → Access granted

### For Google OAuth Users:
1. **Google Sign-in** → Automatically verified and activated
2. **Access granted**

---

## API Endpoints

### 1. User Signup

**Endpoint:** `POST /api/auth/signup`

**Description:** Register a new user with email and password. Sends an OTP to the provided email address.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "gender": "male",  // optional: "male", "female", "other"
  "dob": "1990-01-15"  // optional: ISO date format
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Signup successful! Please check your email for the OTP code.",
  "data": {
    "userId": 123,
    "email": "john@example.com",
    "requiresVerification": true
  }
}
```

**Error Responses:**
- `400` - Validation error (missing required fields)
- `409` - User already exists with this email

---

### 2. Verify OTP

**Endpoint:** `POST /api/auth/verify-otp`

**Description:** Verify the OTP code sent to the user's email. Upon successful verification, the account is activated and a JWT token is returned.

**Request Body:**
```json
{
  "email": "john@example.com",
  "otpCode": "123456"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Email verified successfully! You can now login.",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 123,
      "name": "John Doe",
      "email": "john@example.com",
      "roles": ["student"],
      "isEmailVerified": true
    }
  }
}
```

**Error Responses:**
- `400` - Invalid OTP, expired OTP, or already verified
- `404` - User not found

---

### 3. Resend OTP

**Endpoint:** `POST /api/auth/resend-otp`

**Description:** Request a new OTP code if the previous one expired or was not received.

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "New OTP sent to your email"
}
```

**Error Responses:**
- `400` - Email already verified
- `404` - User not found
- `500` - Failed to send OTP email

---

### 4. Login (Updated)

**Endpoint:** `POST /api/auth/login`

**Description:** Login with email and password. Students must verify their email before logging in. Staff (admin/manager/instructor) can login without OTP verification.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 123,
      "name": "John Doe",
      "email": "john@example.com",
      "roles": ["student"],
      "isActive": true
    }
  }
}
```

**Error Response (403) - Unverified Email:**
```json
{
  "success": false,
  "message": "Please verify your email before logging in. Check your email for the OTP code.",
  "requiresVerification": true,
  "email": "john@example.com"
}
```

---

### 5. Google OAuth (Updated)

**Endpoint:** `GET /api/auth/google`

**Description:** Initiate Google OAuth authentication. Users are automatically verified upon successful Google authentication.

**Flow:**
1. Redirect user to `/api/auth/google`
2. User authenticates with Google
3. Google redirects to `/api/auth/google/callback`
4. User is auto-verified and redirected to frontend with token

**Success Redirect:**
```
{FRONTEND_URL}/auth/callback?token={JWT_TOKEN}
```

---

## Email Configuration

To enable OTP email sending, configure the following environment variables:

```env
# Gmail Configuration (Recommended)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM="Arif's Apex Fitness <noreply@arifsapex.com>"

# OTP Settings
OTP_EXPIRY_MINUTES=10
```

### Getting Gmail App Password:
1. Go to [Google Account Settings](https://myaccount.google.com/)
2. Security → 2-Step Verification (must be enabled)
3. App Passwords → Generate new password
4. Use the generated password as `EMAIL_PASSWORD`

---

## OTP Email Template

Users will receive a professionally designed HTML email with:
- Branded header with gradient background
- Large, centered OTP code (6 digits)
- Expiry time notice (10 minutes by default)
- Security warning
- Professional footer

**Example OTP Email:**
```
🔐 Email Verification

Hello John Doe,

Thank you for signing up with Arif's Apex Fitness! 
To complete your registration, please verify your 
email address using the OTP code below:

┌──────────────┐
│  123456      │  Valid for 10 minutes
└──────────────┘

⚠️ Security Notice: Never share this code with anyone.
```

---

## Security Features

1. **OTP Expiry:** OTPs expire after 10 minutes (configurable)
2. **6-Digit Codes:** Secure random generation using crypto module
3. **One-Time Use:** OTPs are cleared after successful verification
4. **Account Activation:** Accounts remain inactive until email verification
5. **Auto-Verification:** OAuth users (Google/Facebook) bypass OTP requirement

---

## Database Schema

Additional fields added to the `users` table:

| Field | Type | Description |
|-------|------|-------------|
| `otpCode` | STRING(6) | Current OTP code |
| `otpExpiry` | DATE | OTP expiration timestamp |
| `isEmailVerified` | BOOLEAN | Email verification status |
| `isPhoneVerified` | BOOLEAN | Phone verification status (future use) |

---

## Testing Guide

### 1. Test Signup Flow

```bash
# Register new user
POST http://localhost:5000/api/auth/signup
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123"
}

# Check email for OTP code
```

### 2. Test OTP Verification

```bash
# Verify OTP
POST http://localhost:5000/api/auth/verify-otp
Content-Type: application/json

{
  "email": "test@example.com",
  "otpCode": "123456"
}
```

### 3. Test Login

```bash
# Login after verification
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}
```

### 4. Test OTP Resend

```bash
# Request new OTP
POST http://localhost:5000/api/auth/resend-otp
Content-Type: application/json

{
  "email": "test@example.com"
}
```

---

## Common Issues & Solutions

### Email Not Sending
- **Problem:** OTP email not received
- **Solutions:**
  - Check Gmail App Password is correct
  - Verify 2-Step Verification is enabled
  - Check spam/junk folder
  - Ensure `EMAIL_SERVICE` and `EMAIL_USER` are configured

### OTP Expired
- **Problem:** "OTP has expired" error
- **Solution:** Use the resend OTP endpoint to request a new code

### Already Verified
- **Problem:** "Email already verified" message
- **Solution:** User should proceed directly to login

---

## Environment Variables Reference

```env
# Email Configuration
EMAIL_SERVICE=gmail              # Email service provider
EMAIL_USER=email@gmail.com       # Your email address
EMAIL_PASSWORD=app_password      # Gmail app password
EMAIL_FROM="Name <email>"        # From address (optional)

# OTP Configuration
OTP_EXPIRY_MINUTES=10           # OTP validity period (minutes)

# JWT Configuration
JWT_SECRET=your_secret_key      # Secret key for JWT
JWT_EXPIRES_IN=7d               # Token expiration

# Frontend URL
FRONTEND_URL=http://localhost:5173  # For OAuth redirects
```

---

## Next Steps

1. **Update `.env` file** with your email credentials
2. **Restart the backend server** to apply changes
3. **Test the signup flow** with a real email address
4. **Integrate frontend** with the new API endpoints

---

## Support

For issues or questions:
- Check the error messages in the API responses
- Review server logs for detailed error information
- Ensure all environment variables are properly configured
