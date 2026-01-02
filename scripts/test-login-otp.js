/**
 * Test script to verify login OTP functionality
 */

require('dotenv').config();
const { sendLoginOTPEmail } = require('../src/services/otp.service');
const User = require('../src/models/user.model');
const OTP = require('../src/models/otp.model');
const { generateOTP, getOTPExpiry } = require('../src/services/otp.service');

async function testLoginOTP() {
  try {
    const testEmail = process.argv[2] || 'kalu4mom@gmail.com';
    
    console.log('🧪 Testing Login OTP Flow');
    console.log('========================');
    console.log(`📧 Test Email: ${testEmail}\n`);

    // Step 1: Check if user exists
    console.log('Step 1: Checking if user exists...');
    const user = await User.findOne({ where: { email: testEmail } });
    
    if (!user) {
      console.log('❌ User not found. Please create a user first.');
      console.log('   Run: node scripts/create-test-user.js');
      process.exit(1);
    }
    
    console.log(`✅ User found: ${user.name} (ID: ${user.id})`);
    console.log(`   Active: ${user.isActive}, Verified: ${user.isEmailVerified}\n`);

    // Step 2: Check user status
    if (!user.isActive || !user.isEmailVerified) {
      console.log('⚠️  User is not active or verified.');
      console.log('   Setting user as active and verified for testing...');
      await user.update({
        isActive: true,
        isEmailVerified: true
      });
      console.log('✅ User updated\n');
    }

    // Step 3: Generate OTP
    console.log('Step 2: Generating OTP...');
    const otpCode = generateOTP();
    const otpExpiry = getOTPExpiry();
    console.log(`✅ OTP Generated: ${otpCode}`);
    console.log(`   Expires at: ${otpExpiry}\n`);

    // Step 4: Store OTP
    console.log('Step 3: Storing OTP in database...');
    await OTP.create({
      userId: user.id,
      email: testEmail,
      code: otpCode,
      type: 'login',
      expiresAt: otpExpiry,
      attempts: 0,
      consumed: false
    });
    console.log('✅ OTP stored in database\n');

    // Step 5: Send email
    console.log('Step 4: Sending OTP email...');
    console.log('   Email configuration:');
    console.log(`   - Host: ${process.env.EMAIL_HOST || 'Gmail service'}`);
    console.log(`   - User: ${process.env.EMAIL_USER}`);
    console.log(`   - Port: ${process.env.EMAIL_PORT || 'N/A'}\n`);
    
    try {
      const result = await sendLoginOTPEmail(testEmail, otpCode, user.name);
      console.log('✅ Email sent successfully!');
      console.log(`   Message ID: ${result.messageId}\n`);
      console.log('📬 Please check your email inbox (and spam folder)');
      console.log(`   OTP Code: ${otpCode}`);
    } catch (emailError) {
      console.error('❌ Failed to send email:');
      console.error('   Error:', emailError.message);
      console.error('   Code:', emailError.code);
      console.error('   Command:', emailError.command);
      console.error('   Response:', emailError.response);
      console.error('\n💡 Troubleshooting:');
      console.error('   1. Check EMAIL_HOST, EMAIL_USER, EMAIL_PASSWORD in .env');
      console.error('   2. For Gmail, ensure you\'re using an App Password');
      console.error('   3. Check firewall/network settings');
      process.exit(1);
    }

    console.log('\n✅ Test completed successfully!');
    console.log(`\n📝 OTP Code for testing: ${otpCode}`);
    console.log('   (This code is stored in the database and can be used to verify)');

  } catch (error) {
    console.error('❌ Test failed:', error);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

// Run test
testLoginOTP()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });

