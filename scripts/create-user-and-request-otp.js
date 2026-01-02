/**
 * Create User and Request Login OTP
 * Creates a user account and requests a login OTP
 */

require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize } = require('../src/config/database');
const User = require('../src/models/user.model');
const { sendLoginOTPEmail, generateOTP, getOTPExpiry } = require('../src/services/otp.service');
const OTP = require('../src/models/otp.model');

const email = 'kalu4mom@gmail.com';
const name = 'Test User';
const password = 'Test123456'; // Default password

async function createUserAndRequestOTP() {
  try {
    // Connect to database
    await sequelize.authenticate();
    console.log('✅ Database connected\n');
    
    // Check if user already exists
    let user = await User.findOne({ where: { email } });
    
    if (user) {
      console.log('ℹ️  User already exists!');
      console.log(`   Email: ${user.email}`);
      console.log(`   Name: ${user.name}`);
      console.log(`   Active: ${user.isActive ? 'Yes' : 'No'}`);
      console.log(`   Verified: ${user.isEmailVerified ? 'Yes' : 'No'}\n`);
      
      // Update user to be active and verified if not already
      if (!user.isActive || !user.isEmailVerified) {
        await user.update({
          isActive: true,
          isEmailVerified: true
        });
        console.log('✅ User updated to active and verified\n');
      }
    } else {
      console.log('📝 Creating new user...');
      
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Create user (active and verified so they can use OTP login)
      user = await User.create({
        name: name,
        email: email,
        password: hashedPassword,
        roles: ['student'],
        authProviders: [{
          provider: 'email',
          providerId: email,
          lastUsed: new Date()
        }],
        isActive: true,
        isEmailVerified: true // Verified so they can use OTP login
      });
      
      console.log('✅ User created successfully!');
      console.log(`   ID: ${user.id}`);
      console.log(`   Name: ${user.name}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Password: ${password}\n`);
    }
    
    // Now request login OTP
    console.log('📧 Requesting login OTP...');
    
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
    const otpRecord = await OTP.create({
      userId: user.id,
      email: email,
      code: otpCode,
      type: 'login',
      expiresAt: otpExpiry,
      attempts: 0,
      consumed: false
    });
    
    console.log('✅ OTP generated and stored in database');
    console.log(`   OTP Code: ${otpCode}`);
    console.log(`   Expires at: ${otpExpiry}\n`);
    
    // Send OTP email
    try {
      await sendLoginOTPEmail(email, otpCode, user.name);
      console.log('✅ Login OTP email sent successfully!');
      console.log(`   Check ${email} for the OTP code\n`);
    } catch (emailError) {
      console.error('❌ Failed to send OTP email:', emailError.message);
      console.log(`\n💡 OTP Code: ${otpCode}`);
      console.log('   You can manually verify with this code\n');
    }
    
    console.log('📋 Summary:');
    console.log('===========');
    console.log(`Email: ${email}`);
    console.log(`OTP Code: ${otpCode}`);
    console.log(`Expires: ${otpExpiry}`);
    console.log('\n💡 To verify the OTP, run:');
    console.log(`   node scripts/test-otp-login.js ${email} ${otpCode}`);
    
    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
    await sequelize.close();
    process.exit(1);
  }
}

createUserAndRequestOTP();

