const crypto = require('crypto');
const nodemailer = require('nodemailer');

/**
 * OTP Service for Email Verification
 * Handles OTP generation, sending, and validation
 */

// Configure email transporter - Uses Google SMTP (Gmail) by default
const createTransporter = () => {
  // Priority 1: Use Google SMTP if EMAIL_HOST is set to smtp.gmail.com
  if (process.env.EMAIL_HOST && process.env.EMAIL_HOST.includes('gmail.com')) {
    const port = parseInt(process.env.EMAIL_PORT) || 587;
    const isSecure = process.env.EMAIL_SECURE === 'true' || port === 465;
    
    console.log('📧 Using Google SMTP (Gmail) configuration');
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: port,
      secure: isSecure, // true for 465 (SSL), false for 587 (STARTTLS)
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      },
      tls: {
        rejectUnauthorized: false
      }
    });
  }

  // Priority 2: Use Gmail service (fallback if no EMAIL_HOST or EMAIL_HOST is not Gmail)
  // This ensures we always use Google SMTP, not cPanel
  console.log('📧 Using Gmail service (Google SMTP)');
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
};

/**
 * Generate a 6-digit OTP code
 */
const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

/**
 * Calculate OTP expiry time
 */
const getOTPExpiry = () => {
  const expiryMinutes = parseInt(process.env.OTP_EXPIRY_MINUTES) || 10;
  return new Date(Date.now() + expiryMinutes * 60 * 1000);
};

/**
 * Send OTP via Email
 * @param {string} email - Recipient email address
 * @param {string} otp - OTP code
 * @param {string} name - User's name
 */
const sendOTPEmail = async (email, otp, name = 'User') => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_FROM || `"ARIF WORK OUT" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Email Verification - OTP Code',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: 'Arial', sans-serif;
              line-height: 1.6;
              color: #333;
              background-color: #f4f4f4;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 20px auto;
              background: #ffffff;
              border-radius: 8px;
              overflow: hidden;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 30px;
              text-align: center;
            }
            .header h1 {
              margin: 0;
              font-size: 24px;
            }
            .content {
              padding: 40px 30px;
            }
            .otp-box {
              background: #f8f9fa;
              border: 2px dashed #667eea;
              border-radius: 8px;
              padding: 20px;
              text-align: center;
              margin: 30px 0;
            }
            .otp-code {
              font-size: 36px;
              font-weight: bold;
              color: #667eea;
              letter-spacing: 8px;
              font-family: 'Courier New', monospace;
            }
            .warning {
              background: #fff3cd;
              border-left: 4px solid #ffc107;
              padding: 12px;
              margin: 20px 0;
              font-size: 14px;
            }
            .footer {
              background: #f8f9fa;
              padding: 20px;
              text-align: center;
              font-size: 12px;
              color: #6c757d;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔐 Email Verification</h1>
            </div>
            <div class="content">
              <p>Hello <strong>${name}</strong>,</p>
              <p>Thank you for signing up with ARIF WORK OUT! To complete your registration, please verify your email address using the OTP code below:</p>
              
              <div class="otp-box">
                <div style="color: #6c757d; font-size: 14px; margin-bottom: 10px;">Your OTP Code</div>
                <div class="otp-code">${otp}</div>
                <div style="color: #6c757d; font-size: 12px; margin-top: 10px;">Valid for ${process.env.OTP_EXPIRY_MINUTES || 10} minutes</div>
              </div>
              
              <div class="warning">
                ⚠️ <strong>Security Notice:</strong> Never share this code with anyone. Our team will never ask for your OTP.
              </div>
              
              <p>If you didn't request this code, please ignore this email or contact our support team.</p>
              
              <p style="margin-top: 30px;">
                Best regards,<br>
                <strong>ARIF WORK OUT Team</strong>
              </p>
            </div>
            <div class="footer">
              <p>This is an automated message, please do not reply to this email.</p>
              <p>&copy; ${new Date().getFullYear()} ARIF WORK OUT. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('OTP Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending OTP email:', error);
    throw new Error('Failed to send OTP email');
  }
};

/**
 * Verify OTP code
 * @param {string} providedOTP - User-provided OTP
 * @param {string} storedOTP - Stored OTP from database
 * @param {Date} otpExpiry - OTP expiration time
 */
const verifyOTP = (providedOTP, storedOTP, otpExpiry) => {
  // Check if OTP exists
  if (!storedOTP || !otpExpiry) {
    return {
      valid: false,
      message: 'No OTP found. Please request a new one.'
    };
  }

  // Check if OTP has expired
  if (new Date() > new Date(otpExpiry)) {
    return {
      valid: false,
      message: 'OTP has expired. Please request a new one.'
    };
  }

  // Check if OTP matches
  if (providedOTP !== storedOTP) {
    return {
      valid: false,
      message: 'Invalid OTP code. Please try again.'
    };
  }

  return {
    valid: true,
    message: 'OTP verified successfully'
  };
};

/**
 * Send Login OTP via Email
 * @param {string} email - Recipient email address
 * @param {string} otp - OTP code
 * @param {string} name - User's name
 */
const sendLoginOTPEmail = async (email, otp, name = 'User') => {
  try {
    console.log(`📧 Preparing to send login OTP email to ${email}`);
    console.log(`📧 OTP Code: ${otp}, Name: ${name}`);
    
    const transporter = createTransporter();
    
    // Verify transporter configuration
    if (!transporter) {
      throw new Error('Email transporter not configured');
    }
    
    console.log(`📧 Email transporter created successfully`);

    const mailOptions = {
      from: process.env.EMAIL_FROM || `"ARIF WORK OUT" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Login Verification - OTP Code',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: 'Arial', sans-serif;
              line-height: 1.6;
              color: #333;
              background-color: #f4f4f4;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 20px auto;
              background: #ffffff;
              border-radius: 8px;
              overflow: hidden;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 30px;
              text-align: center;
            }
            .header h1 {
              margin: 0;
              font-size: 24px;
            }
            .content {
              padding: 40px 30px;
            }
            .otp-box {
              background: #f8f9fa;
              border: 2px dashed #667eea;
              border-radius: 8px;
              padding: 20px;
              text-align: center;
              margin: 30px 0;
            }
            .otp-code {
              font-size: 36px;
              font-weight: bold;
              color: #667eea;
              letter-spacing: 8px;
              font-family: 'Courier New', monospace;
            }
            .warning {
              background: #fff3cd;
              border-left: 4px solid #ffc107;
              padding: 12px;
              margin: 20px 0;
              font-size: 14px;
            }
            .footer {
              background: #f8f9fa;
              padding: 20px;
              text-align: center;
              font-size: 12px;
              color: #6c757d;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔐 Login Verification</h1>
            </div>
            <div class="content">
              <p>Hello <strong>${name}</strong>,</p>
              <p>You requested to log in to your ARIF WORK OUT account. Use the OTP code below to complete your login:</p>
              
              <div class="otp-box">
                <div style="color: #6c757d; font-size: 14px; margin-bottom: 10px;">Your Login OTP Code</div>
                <div class="otp-code">${otp}</div>
                <div style="color: #6c757d; font-size: 12px; margin-top: 10px;">Valid for ${process.env.OTP_EXPIRY_MINUTES || 10} minutes</div>
              </div>
              
              <div class="warning">
                ⚠️ <strong>Security Notice:</strong> Never share this code with anyone. Our team will never ask for your OTP. If you didn't request this login, please ignore this email and secure your account.
              </div>
              
              <p>If you didn't request this login code, please ignore this email or contact our support team immediately.</p>
              
              <p style="margin-top: 30px;">
                Best regards,<br>
                <strong>ARIF WORK OUT Team</strong>
              </p>
            </div>
            <div class="footer">
              <p>This is an automated message, please do not reply to this email.</p>
              <p>&copy; ${new Date().getFullYear()} ARIF WORK OUT. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    console.log(`📧 Sending email with OTP ${otp} to ${email}...`);
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Login OTP Email sent successfully:', {
      messageId: info.messageId,
      response: info.response,
      accepted: info.accepted,
      rejected: info.rejected
    });
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending login OTP email:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      command: error.command,
      response: error.response,
      responseCode: error.responseCode
    });
    throw new Error(`Failed to send login OTP email: ${error.message}`);
  }
};

module.exports = {
  generateOTP,
  getOTPExpiry,
  sendOTPEmail,
  sendLoginOTPEmail,
  verifyOTP
};

