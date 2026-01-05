# Authentication Flow Documentation

## Overview

This document explains the authentication and registration flow for the ARIF WORKOUT application.

## Registration Flow

### ✅ Current Implementation (Simplified - No Email Verification)

Users are **automatically verified** upon registration. No email verification is required.

#### Registration Process:

1. **User submits registration form** with:
   - Name
   - Email
   - Password
   - (Optional) Gender, Date of Birth

2. **Backend creates user account**:
   - Password is hashed using bcrypt
   - User is created with:
     - `isEmailVerified: true` (auto-verified)
     - `isActive: true` (auto-activated)
     - `otpCode: null` (no OTP needed)
     - `otpExpiry: null`

3. **User can immediately log in** using either:
   - Password login
   - OTP login (passwordless)

#### API Endpoint:
```
POST /api/auth/signup
Body: { name, email, password, gender?, dob? }
Response: { success: true, message: "Account created successfully! You can now log in." }
```

### ❌ Old Flow (Deprecated - Not Used)

The following endpoints exist for backward compatibility but are **NOT USED** in the current signup flow:

- `POST /api/auth/verify-otp` - Deprecated
- `POST /api/auth/resend-otp` - Deprecated

These endpoints were part of an old email verification flow that is no longer active.

---

## Login Flow

Users have **two login options**:

### Option 1: Password Login

Traditional email + password authentication.

#### Process:
1. User enters email and password
2. Backend verifies credentials
3. JWT token is generated and returned
4. User is logged in

#### API Endpoint:
```
POST /api/auth/login
Body: { email, password }
Response: { success: true, token, user }
```

### Option 2: OTP Login (Passwordless)

Secure one-time password sent via email.

#### Process:
1. **Request OTP**:
   - User enters email
   - Backend generates 6-digit OTP
   - OTP is stored in database with expiry (10 minutes)
   - OTP is sent to user's email

2. **Verify OTP**:
   - User enters OTP code
   - Backend verifies OTP is valid and not expired
   - JWT token is generated and returned
   - User is logged in

#### API Endpoints:
```
POST /api/auth/request-login-otp
Body: { email }
Response: { success: true, message: "OTP sent to your email" }

POST /api/auth/verify-login-otp
Body: { email, otpCode }
Response: { success: true, token, user }
```

---

## Email Configuration

The application uses **Google SMTP (Gmail)** for sending OTP emails.

### Environment Variables:
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM="ARIF WORK OUT <your-email@gmail.com>"
OTP_EXPIRY_MINUTES=10
```

### Email Types:

1. **Login OTP Email** (Used):
   - Subject: "Login Verification - OTP Code"
   - Contains 6-digit OTP code
   - Valid for 10 minutes
   - Sent when user requests passwordless login

2. **Signup Verification Email** (NOT Used):
   - This email is NO LONGER SENT
   - Users are auto-verified on signup

---

## User States

### After Registration:
- `isEmailVerified: true` ✅
- `isActive: true` ✅
- Can log in immediately ✅

### After Login (Both Methods):
- JWT token issued
- Token expires in 7 days (configurable)
- User can access protected routes

---

## Security Features

1. **Password Security**:
   - Passwords hashed with bcrypt (10 rounds)
   - Minimum 6 characters required

2. **OTP Security**:
   - 6-digit random code
   - Expires after 10 minutes
   - Maximum 5 attempts before invalidation
   - Stored securely in database
   - Marked as consumed after successful verification

3. **JWT Security**:
   - Signed with secret key
   - Contains user ID, email, and roles
   - Expires after 7 days

---

## Frontend Integration

### Registration Screen (`app/auth/register.tsx`):
- Collects user information
- Calls signup API
- Shows success message
- Redirects to login screen
- **No OTP verification step**

### Login Screen (`app/auth/login.tsx`):
- Toggle between password and OTP login
- Password login: Direct authentication
- OTP login: Request OTP → Enter OTP → Verify
- "Continue as Guest" option for limited access

---

## Guest Mode

Users can access the app without logging in (guest mode):

### Guest Access:
- Can browse workouts
- Can view exercises
- Can see motivational content
- **Cannot** generate nutrition plans
- **Cannot** save progress
- **Cannot** access personalized features

### Login Prompts:
- Clear prompts when accessing premium features
- Direct navigation to login screen
- Benefits of signing up are highlighted

---

## Summary

✅ **Registration**: Simple, no email verification required  
✅ **Login**: Two options (password or OTP)  
✅ **Guest Mode**: Browse without account  
✅ **Security**: Bcrypt, JWT, OTP expiry  
✅ **Email**: Google SMTP for OTP delivery  

**No verification emails are sent during registration. Users can log in immediately after signing up.**
