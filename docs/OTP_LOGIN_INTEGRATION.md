# OTP Login Integration - Complete Guide

## Overview

The OTP (One-Time Password) login system has been fully integrated into the ARIF WORK OUT application. Users can now log in using passwordless authentication via email OTP.

## Backend Implementation

### API Endpoints

#### 1. Request Login OTP
**Endpoint:** `POST /api/auth/login/request-otp`

**Request:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP sent to your email. Please check your inbox."
}
```

#### 2. Verify Login OTP
**Endpoint:** `POST /api/auth/login/verify-otp`

**Request:**
```json
{
  "email": "user@example.com",
  "otpCode": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 123,
      "name": "John Doe",
      "email": "user@example.com",
      "roles": ["student"],
      "isActive": true,
      "isEmailVerified": true
    }
  }
}
```

### Security Features

- OTP expiry: 10 minutes (configurable)
- Rate limiting: Applied to all auth routes
- Attempt tracking: Maximum 5 attempts per OTP
- One-time use: OTPs marked as consumed after verification
- User validation: Only active and verified users can request OTP

## Frontend Implementation

### Login Screen Features

The login screen now supports two methods:

1. **OTP Login (Default)**
   - Enter email
   - Click "Send OTP"
   - Enter 6-digit OTP code
   - Click "Verify & Login"

2. **Password Login**
   - Enter email and password
   - Click "Sign In"

### User Flow

```
┌─────────────────┐
│  Enter Email    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Click Send OTP │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Check Email    │
│  for OTP Code   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Enter OTP Code │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Click Verify   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Login Success  │
│  (JWT Token)    │
└─────────────────┘
```

## Configuration

### Environment Variables

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=contact@arifworkout.com
EMAIL_PASSWORD=brvbtjdlryutvprw
EMAIL_FROM="ARIF WORK OUT <contact@arifworkout.com>"
OTP_EXPIRY_MINUTES=10
```

## Testing

### Test Scripts

1. **Request OTP:**
   ```bash
   node scripts/create-user-and-request-otp.js
   ```

2. **Verify OTP:**
   ```bash
   node scripts/test-otp-login.js <email> <otp_code>
   ```

3. **Full Test:**
   ```bash
   node scripts/test-otp-login.js <email>
   ```

## Frontend Usage

### In React Native Components

```typescript
import { useAuth } from '@/contexts/auth-context';

const { requestLoginOTP, verifyLoginOTP, isLoading } = useAuth();

// Request OTP
await requestLoginOTP('user@example.com');

// Verify OTP
await verifyLoginOTP('user@example.com', '123456');
```

## Email Template

Users receive a branded email with:
- ARIF WORK OUT branding
- Large, easy-to-read OTP code
- Expiry time (10 minutes)
- Security notice
- Professional design

## Status

✅ Backend endpoints implemented
✅ Frontend integration complete
✅ Email delivery working (Google SMTP)
✅ OTP verification working
✅ JWT token generation working
✅ User authentication working

## Next Steps

The system is ready for production use. Users can now:
- Log in using OTP (passwordless)
- Receive OTP emails reliably
- Verify OTP and get authenticated
- Use both OTP and password login methods

