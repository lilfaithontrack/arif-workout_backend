const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const OTP = require('../models/otp.model');
const { generateOTP, getOTPExpiry, sendOTPEmail, sendLoginOTPEmail, verifyOTP } = require('../services/otp.service');


/**
 * Generate JWT token
 */
const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
      roles: user.roles
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};


/**
 * User Signup with Email & Password
 * Sends OTP for email verification
 */
exports.signup = async (req, res, next) => {
  try {
    const { name, email, password, gender, dob } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP
    const otpCode = generateOTP();
    const otpExpiry = getOTPExpiry();

    // Create user (not verified yet)
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      gender,
      dob,
      roles: ['student'],
      authProviders: [{
        provider: 'email',
        providerId: email,
        lastUsed: new Date()
      }],
      otpCode,
      otpExpiry,
      isEmailVerified: false,
      isActive: false  // Activate after OTP verification
    });

    // Send OTP email
    try {
      await sendOTPEmail(email, otpCode, name);
    } catch (emailError) {
      console.error('Failed to send OTP email:', emailError);
      // Continue even if email fails - user can request resend
    }

    res.status(201).json({
      success: true,
      message: 'Signup successful! Please check your email for the OTP code.',
      data: {
        userId: user.id,
        email: user.email,
        requiresVerification: true
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Verify OTP Code
 * Activates user account after successful verification
 */
exports.verifyOTPCode = async (req, res, next) => {
  try {
    const { email, otpCode } = req.body;

    if (!email || !otpCode) {
      return res.status(400).json({
        success: false,
        message: 'Email and OTP code are required'
      });
    }

    // Find user
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if already verified
    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email already verified. Please login.'
      });
    }

    // Verify OTP
    const verification = verifyOTP(otpCode, user.otpCode, user.otpExpiry);

    if (!verification.valid) {
      return res.status(400).json({
        success: false,
        message: verification.message
      });
    }

    // Update user - mark as verified and active
    await user.update({
      isEmailVerified: true,
      isActive: true,
      otpCode: null,
      otpExpiry: null
    });

    // Generate token for immediate login
    const token = generateToken(user);

    res.status(200).json({
      success: true,
      message: 'Email verified successfully! You can now login.',
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          roles: user.roles,
          isEmailVerified: user.isEmailVerified
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Resend OTP Code
 * Generates and sends a new OTP
 */
exports.resendOTP = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Find user
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if already verified
    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email already verified. Please login.'
      });
    }

    // Generate new OTP
    const otpCode = generateOTP();
    const otpExpiry = getOTPExpiry();

    // Update user with new OTP
    await user.update({
      otpCode,
      otpExpiry
    });

    // Send OTP email
    try {
      await sendOTPEmail(email, otpCode, user.name);
    } catch (emailError) {
      console.error('Failed to send OTP email:', emailError);
      return res.status(500).json({
        success: false,
        message: 'Failed to send OTP email. Please try again later.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'New OTP sent to your email'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Admin/Manager/Instructor Login with Email & Password
 */
exports.loginWithPassword = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find user by email
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if user is a student and requires verification
    const isStudent = user.roles.includes('student');

    if (isStudent && !user.isEmailVerified) {
      return res.status(403).json({
        success: false,
        message: 'Please verify your email before logging in. Check your email for the OTP code.',
        requiresVerification: true,
        email: user.email
      });
    }

    // Check if user has admin/manager/instructor role for staff login
    const allowedRoles = ['admin', 'manager', 'instructor'];
    const hasAllowedRole = user.roles.some(role => allowedRoles.includes(role));

    if (!hasAllowedRole && !isStudent) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Invalid role.'
      });
    }

    // Verify password
    if (!user.password) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Update last login
    await user.update({ lastLogin: new Date() });

    // Generate token
    const token = generateToken(user);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          roles: user.roles,
          isActive: user.isActive
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * OAuth Success Callback (Google/Facebook)
 * Called after successful OAuth authentication
 */
exports.oauthSuccess = async (req, res, next) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication failed'
      });
    }

    // Auto-verify OAuth users (Google/Facebook)
    if (!user.isEmailVerified) {
      await user.update({
        isEmailVerified: true,
        isActive: true
      });
    }

    // Generate token
    const token = generateToken(user);

    // Redirect to frontend with token
    const frontendURL = process.env.FRONTEND_URL || 'http://localhost:5173';
    res.redirect(`${frontendURL}/auth/callback?token=${token}`);
  } catch (error) {
    next(error);
  }
};

/**
 * OAuth Failure Callback
 */
exports.oauthFailure = (req, res) => {
  const frontendURL = process.env.FRONTEND_URL || 'http://localhost:5173';
  res.redirect(`${frontendURL}/login?error=oauth_failed`);
};

/**
 * Get Current User Profile
 */
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update User Profile
 */
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, gender, dob, personalInfo, consents } = req.body;

    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update allowed fields
    const updates = {};
    if (name) updates.name = name;
    if (gender) updates.gender = gender;
    if (dob) updates.dob = dob;
    if (personalInfo) updates.personalInfo = { ...user.personalInfo, ...personalInfo };
    if (consents) updates.consents = { ...user.consents, ...consents };

    await user.update(updates);

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          gender: user.gender,
          dob: user.dob,
          roles: user.roles,
          personalInfo: user.personalInfo,
          consents: user.consents
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Admin: Create Staff User (Manager/Instructor)
 */
exports.createStaffUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    // Validate input
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, password, and role are required'
      });
    }

    // Validate role
    const allowedRoles = ['manager', 'instructor'];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Role must be either manager or instructor'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      roles: [role],
      authProviders: [{
        provider: 'email',
        providerId: email,
        lastUsed: new Date()
      }],
      isActive: true
    });

    res.status(201).json({
      success: true,
      message: `${role.charAt(0).toUpperCase() + role.slice(1)} created successfully`,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          roles: user.roles,
          isActive: user.isActive
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Admin: Update Staff Password
 */
exports.updateStaffPassword = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({
        success: false,
        message: 'New password is required'
      });
    }

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if user is staff
    const staffRoles = ['admin', 'manager', 'instructor'];
    const isStaff = user.roles.some(role => staffRoles.includes(role));

    if (!isStaff) {
      return res.status(403).json({
        success: false,
        message: 'Can only update passwords for staff users'
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await user.update({ password: hashedPassword });

    res.status(200).json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Request Login OTP
 * Generates and sends OTP code for passwordless login
 */
exports.requestLoginOTP = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Find user by email
    const user = await User.findOne({ where: { email } });

    if (!user) {
      // Don't reveal if user exists for security
      return res.status(200).json({
        success: true,
        message: 'If an account exists with this email, an OTP has been sent.'
      });
    }

    // Check if user is active and verified
    if (!user.isActive || !user.isEmailVerified) {
      return res.status(403).json({
        success: false,
        message: 'Account is not active or verified. Please verify your email first.'
      });
    }

    // Generate OTP
    const otpCode = generateOTP();
    const otpExpiry = getOTPExpiry();

    // Invalidate any existing login OTPs for this email
    await OTP.update(
      { consumed: true },
      {
        where: {
          email: email,
          type: 'login',
          consumed: false
        }
      }
    );

    // Store OTP in database
    await OTP.create({
      userId: user.id,
      email: email,
      code: otpCode,
      type: 'login',
      expiresAt: otpExpiry,
      attempts: 0,
      consumed: false
    });

    // Send OTP email
    try {
      await sendLoginOTPEmail(email, otpCode, user.name);
    } catch (emailError) {
      console.error('Failed to send login OTP email:', emailError);
      return res.status(500).json({
        success: false,
        message: 'Failed to send OTP email. Please try again later.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'OTP sent to your email. Please check your inbox.'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Verify Login OTP
 * Verifies OTP code and logs user in
 */
exports.verifyLoginOTP = async (req, res, next) => {
  try {
    const { email, otpCode } = req.body;

    if (!email || !otpCode) {
      return res.status(400).json({
        success: false,
        message: 'Email and OTP code are required'
      });
    }

    // Find user
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or OTP code'
      });
    }

    // Check if user is active and verified
    if (!user.isActive || !user.isEmailVerified) {
      return res.status(403).json({
        success: false,
        message: 'Account is not active or verified'
      });
    }

    // Find the most recent non-consumed login OTP for this email
    const otpRecord = await OTP.findOne({
      where: {
        email: email,
        type: 'login',
        consumed: false
      },
      order: [['createdAt', 'DESC']]
    });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: 'No OTP found. Please request a new one.'
      });
    }

    // Check if OTP has expired
    if (otpRecord.isExpired()) {
      await otpRecord.update({ consumed: true });
      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new one.'
      });
    }

    // Check if OTP matches
    if (otpRecord.code !== otpCode) {
      // Increment attempts
      await otpRecord.incrementAttempts();

      // Check if too many attempts (optional: lock after 5 attempts)
      if (otpRecord.attempts >= 5) {
        await otpRecord.update({ consumed: true });
        return res.status(400).json({
          success: false,
          message: 'Too many failed attempts. Please request a new OTP.'
        });
      }

      return res.status(400).json({
        success: false,
        message: 'Invalid OTP code. Please try again.'
      });
    }

    // Mark OTP as consumed
    await otpRecord.update({ consumed: true });

    // Update last login
    await user.update({ lastLogin: new Date() });

    // Generate token
    const token = generateToken(user);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          roles: user.roles,
          isActive: user.isActive,
          isEmailVerified: user.isEmailVerified
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Logout (client-side token removal, but we can track it)
 */
exports.logout = async (req, res, next) => {
  try {
    // In a stateless JWT system, logout is handled client-side
    // But we can log the event or invalidate refresh tokens if implemented

    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    next(error);
  }
};
