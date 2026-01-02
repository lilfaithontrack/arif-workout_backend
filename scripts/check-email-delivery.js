/**
 * Check Email Delivery
 * Diagnose why emails might not be received
 */

require('dotenv').config();
const { sequelize } = require('../src/config/database');
const { sendLoginOTPEmail } = require('../src/services/otp.service');
const OTP = require('../src/models/otp.model');
const User = require('../src/models/user.model');

const email = 'kalu4mom@gmail.com';

async function checkEmailDelivery() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected\n');
    
    // Check user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      console.log('❌ User not found!');
      process.exit(1);
    }
    console.log(`✅ User found: ${user.name} (${user.email})\n`);
    
    // Check recent OTPs
    console.log('📋 Recent OTPs sent:');
    const recentOTPs = await OTP.findAll({
      where: {
        email: email,
        type: 'login'
      },
      order: [['createdAt', 'DESC']],
      limit: 5
    });
    
    if (recentOTPs.length === 0) {
      console.log('   No OTPs found in database\n');
    } else {
      recentOTPs.forEach((otp, i) => {
        console.log(`\n   OTP ${i + 1}:`);
        console.log(`   Code: ${otp.code}`);
        console.log(`   Created: ${otp.createdAt}`);
        console.log(`   Expires: ${otp.expiresAt}`);
        console.log(`   Consumed: ${otp.consumed ? 'Yes' : 'No'}`);
        console.log(`   Is Expired: ${otp.isExpired() ? 'Yes' : 'No'}`);
      });
      console.log('');
    }
    
    // Test sending email again
    console.log('📧 Testing email delivery...');
    console.log(`   Sending to: ${email}`);
    console.log(`   From: ${process.env.EMAIL_FROM || process.env.EMAIL_USER}\n`);
    
    const testOTP = '999999';
    try {
      const result = await sendLoginOTPEmail(email, testOTP, user.name);
      console.log('✅ Email sent successfully!');
      console.log(`   Message ID: ${result.messageId || 'N/A'}\n`);
    } catch (error) {
      console.log('❌ Failed to send email:');
      console.log(`   Error: ${error.message}`);
      if (error.code) console.log(`   Code: ${error.code}`);
      if (error.response) console.log(`   Response: ${error.response}`);
      console.log('');
    }
    
    // Check SMTP configuration
    console.log('🔍 SMTP Configuration:');
    console.log(`   Host: ${process.env.EMAIL_HOST}`);
    console.log(`   Port: ${process.env.EMAIL_PORT}`);
    console.log(`   Secure: ${process.env.EMAIL_SECURE}`);
    console.log(`   User: ${process.env.EMAIL_USER}`);
    console.log(`   From: ${process.env.EMAIL_FROM || process.env.EMAIL_USER}\n`);
    
    // Common issues
    console.log('💡 Common reasons emails don\'t arrive:');
    console.log('   1. Check SPAM/JUNK folder');
    console.log('   2. Check email filters');
    console.log('   3. Email might be delayed (wait 1-2 minutes)');
    console.log('   4. Email provider might be blocking');
    console.log('   5. Check if email address is correct');
    console.log('   6. SMTP server might have sending limits\n');
    
    // Check if email is Gmail
    if (email.includes('gmail.com')) {
      console.log('📬 Gmail-specific tips:');
      console.log('   - Check "Promotions" tab');
      console.log('   - Check "Updates" tab');
      console.log('   - Check "Spam" folder');
      console.log('   - Gmail might delay emails from new senders');
      console.log('   - Check Gmail filters/settings\n');
    }
    
    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
    await sequelize.close();
    process.exit(1);
  }
}

checkEmailDelivery();

