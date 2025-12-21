const express = require('express');
const router = express.Router();
const passport = require('../config/passport');
const { body } = require('express-validator');
const authController = require('../controllers/auth.controller');
const { authenticate, requireRole } = require('../middleware/auth');
const validate = require('../middleware/validate');

// ============================================
// USER SIGNUP WITH OTP VERIFICATION
// ============================================

// Signup with Email & Password (Sends OTP)
router.post('/signup',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('gender').optional().isIn(['male', 'female', 'other']),
    body('dob').optional().isISO8601()
  ],
  validate,
  authController.signup
);

// Verify OTP Code
router.post('/verify-otp',
  [
    body('email').isEmail().normalizeEmail(),
    body('otpCode').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits')
  ],
  validate,
  authController.verifyOTPCode
);

// Resend OTP
router.post('/resend-otp',
  [
    body('email').isEmail().normalizeEmail()
  ],
  validate,
  authController.resendOTP
);

// ============================================
// STAFF LOGIN (Admin/Manager/Instructor)
// ============================================

// Email & Password Login for Staff
router.post('/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty().isLength({ min: 6 })
  ],
  validate,
  authController.loginWithPassword
);

// ============================================
// OAUTH LOGIN (Google/Facebook for Students)
// ============================================

// Google OAuth - Initiate
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Google OAuth - Callback
router.get('/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/api/auth/failure',
    session: false
  }),
  authController.oauthSuccess
);

// Facebook OAuth - Initiate
router.get('/facebook',
  passport.authenticate('facebook', { scope: ['email'] })
);

// Facebook OAuth - Callback
router.get('/facebook/callback',
  passport.authenticate('facebook', {
    failureRedirect: '/api/auth/failure',
    session: false
  }),
  authController.oauthSuccess
);

// OAuth Failure
router.get('/failure', authController.oauthFailure);

// Get profile (protected)
router.get('/profile', authenticate, authController.getProfile);

// Update profile (protected)
router.put('/profile', authenticate, authController.updateProfile);

// Logout
router.post('/logout', authenticate, authController.logout);

// ============================================
// ADMIN ONLY - Staff Management
// ============================================

// Create Manager or Instructor
router.post('/staff',
  authenticate,
  requireRole('admin'),
  [
    body('name').trim().notEmpty(),
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('role').isIn(['manager', 'instructor'])
  ],
  validate,
  authController.createStaffUser
);

// Update Staff Password
router.put('/staff/:userId/password',
  authenticate,
  requireRole('admin'),
  [
    body('newPassword').isLength({ min: 6 })
  ],
  validate,
  authController.updateStaffPassword
);

module.exports = router;
