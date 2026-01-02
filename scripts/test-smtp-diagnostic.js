/**
 * SMTP Diagnostic Script
 * Tests SMTP connection with detailed error reporting
 */

require('dotenv').config();
const nodemailer = require('nodemailer');

const config = {
  host: process.env.EMAIL_HOST || 'arifworkout.com',
  port: parseInt(process.env.EMAIL_PORT) || 465,
  secure: process.env.EMAIL_SECURE === 'true' || parseInt(process.env.EMAIL_PORT) === 465,
  auth: {
    user: process.env.EMAIL_USER || 'support@arifworkout.com',
    pass: process.env.EMAIL_PASSWORD || 'Kalebeyasu123@#'
  }
};

console.log('🔍 SMTP Diagnostic Test\n');
console.log('Configuration:');
console.log(`  Host: ${config.host}`);
console.log(`  Port: ${config.port}`);
console.log(`  Secure: ${config.secure}`);
console.log(`  User: ${config.auth.user}`);
console.log(`  Password: ${config.auth.pass.substring(0, 5)}... (length: ${config.auth.pass.length})\n`);

// Test 1: Basic connection
console.log('Test 1: Creating transporter...');
const transporter = nodemailer.createTransport({
  host: config.host,
  port: config.port,
  secure: config.secure,
  auth: {
    user: config.auth.user,
    pass: config.auth.pass
  },
  tls: {
    rejectUnauthorized: false
  },
  debug: true, // Enable debug output
  logger: true // Log to console
});

// Test 2: Verify connection
console.log('\nTest 2: Verifying SMTP connection...');
transporter.verify(function(error, success) {
  if (error) {
    console.log('❌ Connection failed!');
    console.log('Error details:');
    console.log(`  Code: ${error.code}`);
    console.log(`  Command: ${error.command}`);
    console.log(`  Response: ${error.response}`);
    console.log(`  Response Code: ${error.responseCode}`);
    
    if (error.code === 'EAUTH') {
      console.log('\n⚠️  Authentication Error (535)');
      console.log('Possible causes:');
      console.log('  1. Incorrect username or password');
      console.log('  2. Password contains special characters that need encoding');
      console.log('  3. Account does not have SMTP access enabled');
      console.log('  4. Account is locked or disabled');
      console.log('\n💡 Try:');
      console.log('  - Verify the password is correct');
      console.log('  - Check if the account has SMTP sending enabled in cPanel');
      console.log('  - Try logging into webmail with these credentials');
    }
  } else {
    console.log('✅ Server is ready to take our messages!');
    
    // Test 3: Send test email
    console.log('\nTest 3: Sending test email...');
    const mailOptions = {
      from: process.env.EMAIL_FROM || `"ARIF WORK OUT" <${config.auth.user}>`,
      to: 'kalu4mom@gmail.com',
      subject: 'Test Email from ARIF WORK OUT',
      text: 'This is a test email to verify SMTP configuration.',
      html: '<p>This is a <b>test email</b> to verify SMTP configuration.</p>'
    };
    
    transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
        console.log('❌ Failed to send email!');
        console.log('Error:', error.message);
      } else {
        console.log('✅ Email sent successfully!');
        console.log('Message ID:', info.messageId);
        console.log('Response:', info.response);
      }
      process.exit(0);
    });
  }
});

