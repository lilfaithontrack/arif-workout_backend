/**
 * Test Script for SMTP OTP Login
 * Tests the OTP login functionality with arifworkout.com SMTP
 */

require('dotenv').config();
const axios = require('axios');
const { sequelize } = require('../src/config/database');
const { sendLoginOTPEmail } = require('../src/services/otp.service');
const User = require('../src/models/user.model');
const OTP = require('../src/models/otp.model');

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000';
const TEST_EMAIL = process.env.TEST_EMAIL || 'test@example.com';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
  console.log('\n' + '='.repeat(60));
  log(title, 'cyan');
  console.log('='.repeat(60));
}

function logTest(testName) {
  console.log('\n' + '-'.repeat(60));
  log(`🧪 ${testName}`, 'blue');
  console.log('-'.repeat(60));
}

/**
 * Test 1: SMTP Connection Test
 */
async function testSMTPConnection() {
  logSection('TEST 1: SMTP Connection Test');
  
  try {
    log('📧 Testing SMTP connection to arifworkout.com...', 'yellow');
    
    // Check environment variables
    if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      log('❌ Missing email environment variables!', 'red');
      log('Required: EMAIL_HOST, EMAIL_USER, EMAIL_PASSWORD', 'yellow');
      return false;
    }
    
    log(`✓ EMAIL_HOST: ${process.env.EMAIL_HOST}`, 'green');
    log(`✓ EMAIL_PORT: ${process.env.EMAIL_PORT || '465'}`, 'green');
    log(`✓ EMAIL_SECURE: ${process.env.EMAIL_SECURE || 'true'}`, 'green');
    log(`✓ EMAIL_USER: ${process.env.EMAIL_USER}`, 'green');
    log(`✓ EMAIL_FROM: ${process.env.EMAIL_FROM || `"ARIF WORK OUT" <${process.env.EMAIL_USER}>`}`, 'green');
    
    // Test sending a login OTP email
    log('\n📨 Sending test login OTP email...', 'yellow');
    const testOTP = '123456';
    const testName = 'Test User';
    
    await sendLoginOTPEmail(TEST_EMAIL, testOTP, testName);
    
    log('✅ SMTP connection successful! Email sent.', 'green');
    log(`📬 Check ${TEST_EMAIL} for the test OTP email`, 'cyan');
    return true;
    
  } catch (error) {
    log(`❌ SMTP connection failed: ${error.message}`, 'red');
    if (error.code) {
      log(`   Error code: ${error.code}`, 'yellow');
    }
    if (error.response) {
      log(`   Response: ${error.response}`, 'yellow');
    }
    return false;
  }
}

/**
 * Test 2: Request Login OTP via API
 */
async function testRequestLoginOTP(email) {
  logTest('Test 2: Request Login OTP via API');
  
  try {
    log(`📤 Requesting login OTP for: ${email}`, 'yellow');
    
    const response = await axios.post(`${API_BASE_URL}/api/auth/login/request-otp`, {
      email: email
    });
    
    if (response.data.success) {
      log('✅ Login OTP request successful!', 'green');
      log(`   Message: ${response.data.message}`, 'cyan');
      return true;
    } else {
      log(`❌ Request failed: ${response.data.message}`, 'red');
      return false;
    }
    
  } catch (error) {
    if (error.response) {
      log(`❌ API Error: ${error.response.status} - ${error.response.data.message || error.response.statusText}`, 'red');
      if (error.response.data) {
        console.log('   Response:', JSON.stringify(error.response.data, null, 2));
      }
    } else {
      log(`❌ Network Error: ${error.message}`, 'red');
      log('   Make sure the server is running on ' + API_BASE_URL, 'yellow');
    }
    return false;
  }
}

/**
 * Test 3: Verify Login OTP via API
 */
async function testVerifyLoginOTP(email, otpCode) {
  logTest('Test 3: Verify Login OTP via API');
  
  try {
    log(`🔐 Verifying OTP code: ${otpCode}`, 'yellow');
    
    const response = await axios.post(`${API_BASE_URL}/api/auth/login/verify-otp`, {
      email: email,
      otpCode: otpCode
    });
    
    if (response.data.success) {
      log('✅ Login OTP verification successful!', 'green');
      log(`   Message: ${response.data.message}`, 'cyan');
      if (response.data.data && response.data.data.token) {
        log(`   Token: ${response.data.data.token.substring(0, 50)}...`, 'cyan');
        log(`   User: ${response.data.data.user.name} (${response.data.data.user.email})`, 'cyan');
        log(`   Roles: ${response.data.data.user.roles.join(', ')}`, 'cyan');
      }
      return true;
    } else {
      log(`❌ Verification failed: ${response.data.message}`, 'red');
      return false;
    }
    
  } catch (error) {
    if (error.response) {
      log(`❌ API Error: ${error.response.status} - ${error.response.data.message || error.response.statusText}`, 'red');
      if (error.response.data) {
        console.log('   Response:', JSON.stringify(error.response.data, null, 2));
      }
    } else {
      log(`❌ Network Error: ${error.message}`, 'red');
    }
    return false;
  }
}

/**
 * Test 4: Get OTP from Database
 */
async function testGetOTPFromDB(email) {
  logTest('Test 4: Get OTP from Database');
  
  try {
    log(`🔍 Looking up OTP for: ${email}`, 'yellow');
    
    const otpRecord = await OTP.findOne({
      where: {
        email: email,
        type: 'login',
        consumed: false
      },
      order: [['createdAt', 'DESC']]
    });
    
    if (otpRecord) {
      log('✅ OTP found in database!', 'green');
      log(`   Code: ${otpRecord.code}`, 'cyan');
      log(`   Expires at: ${otpRecord.expiresAt}`, 'cyan');
      log(`   Attempts: ${otpRecord.attempts}`, 'cyan');
      log(`   Is expired: ${otpRecord.isExpired() ? 'Yes' : 'No'}`, 'cyan');
      return otpRecord.code;
    } else {
      log('❌ No OTP found in database', 'red');
      log('   Make sure you requested an OTP first', 'yellow');
      return null;
    }
    
  } catch (error) {
    log(`❌ Database error: ${error.message}`, 'red');
    return null;
  }
}

/**
 * Test 5: Check User Status
 */
async function testCheckUserStatus(email) {
  logTest('Test 5: Check User Status');
  
  try {
    log(`👤 Checking user status for: ${email}`, 'yellow');
    
    const user = await User.findOne({ where: { email } });
    
    if (user) {
      log('✅ User found!', 'green');
      log(`   ID: ${user.id}`, 'cyan');
      log(`   Name: ${user.name}`, 'cyan');
      log(`   Email: ${user.email}`, 'cyan');
      log(`   Active: ${user.isActive ? 'Yes' : 'No'}`, user.isActive ? 'green' : 'red');
      log(`   Verified: ${user.isEmailVerified ? 'Yes' : 'No'}`, user.isEmailVerified ? 'green' : 'red');
      log(`   Roles: ${user.roles.join(', ')}`, 'cyan');
      return user;
    } else {
      log('❌ User not found', 'red');
      log('   You may need to create a user first or use an existing email', 'yellow');
      return null;
    }
    
  } catch (error) {
    log(`❌ Database error: ${error.message}`, 'red');
    return null;
  }
}

/**
 * Main Test Function
 */
async function runTests() {
  console.clear();
  log('\n╔════════════════════════════════════════════════════════════╗', 'bright');
  log('║     ARIF WORK OUT - SMTP OTP Login Test Script           ║', 'bright');
  log('╚════════════════════════════════════════════════════════════╝', 'bright');
  
  // Get test email from command line or use default
  const testEmail = process.argv[2] || TEST_EMAIL;
  log(`\n📧 Test Email: ${testEmail}`, 'cyan');
  log(`🌐 API Base URL: ${API_BASE_URL}\n`, 'cyan');
  
  try {
    // Connect to database
    log('🔌 Connecting to database...', 'yellow');
    await sequelize.authenticate();
    log('✅ Database connected!', 'green');
    
    // Test 1: SMTP Connection
    const smtpSuccess = await testSMTPConnection();
    if (!smtpSuccess) {
      log('\n⚠️  SMTP test failed. Continuing with other tests...', 'yellow');
    }
    
    // Test 5: Check User Status (before requesting OTP)
    const user = await testCheckUserStatus(testEmail);
    if (!user) {
      log('\n⚠️  User not found. Some tests may fail.', 'yellow');
      log('   Create a user first or use an existing email address.', 'yellow');
    } else if (!user.isActive || !user.isEmailVerified) {
      log('\n⚠️  User is not active or verified. OTP login will fail.', 'yellow');
      log('   Please activate and verify the user first.', 'yellow');
    }
    
    // Test 2: Request Login OTP
    const requestSuccess = await testRequestLoginOTP(testEmail);
    
    if (requestSuccess) {
      // Wait a moment for email to be sent
      log('\n⏳ Waiting 2 seconds for email to be processed...', 'yellow');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Test 4: Get OTP from Database
      const otpCode = await testGetOTPFromDB(testEmail);
      
      if (otpCode) {
        // Test 3: Verify Login OTP
        log('\n💡 Using OTP from database for verification test...', 'yellow');
        await testVerifyLoginOTP(testEmail, otpCode);
      } else {
        log('\n💡 To test verification, manually enter the OTP code from your email:', 'yellow');
        log('   Run: node scripts/test-otp-login.js <email> <otp_code>', 'cyan');
      }
    }
    
    // Summary
    logSection('Test Summary');
    log('✅ SMTP Connection: ' + (smtpSuccess ? 'PASSED' : 'FAILED'), smtpSuccess ? 'green' : 'red');
    log('✅ Request OTP: ' + (requestSuccess ? 'PASSED' : 'FAILED'), requestSuccess ? 'green' : 'red');
    
    log('\n📝 Next Steps:', 'cyan');
    log('   1. Check your email inbox for the OTP code', 'yellow');
    log('   2. To verify manually, run:', 'yellow');
    log(`      node scripts/test-otp-login.js ${testEmail} <otp_code>`, 'cyan');
    
  } catch (error) {
    log(`\n❌ Fatal Error: ${error.message}`, 'red');
    console.error(error);
  } finally {
    await sequelize.close();
    log('\n✅ Test script completed!', 'green');
    process.exit(0);
  }
}

// Handle manual OTP verification
if (process.argv[3]) {
  const testEmail = process.argv[2];
  const otpCode = process.argv[3];
  
  (async () => {
    try {
      await sequelize.authenticate();
      logSection('Manual OTP Verification');
      await testVerifyLoginOTP(testEmail, otpCode);
      await sequelize.close();
      process.exit(0);
    } catch (error) {
      log(`❌ Error: ${error.message}`, 'red');
      process.exit(1);
    }
  })();
} else {
  // Run full test suite
  runTests();
}

