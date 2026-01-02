/**
 * Test Space Square Mail Server Options
 * Tests common mail server hostnames for Space Square hosting
 */

require('dotenv').config();
const nodemailer = require('nodemailer');

const email = 'kalu4mom@gmail.com';
const testOTP = '123456';

// Common Space Square mail server options
const mailServers = [
  { host: 'mail.arifworkout.com', port: 465, secure: true },
  { host: 'mail.arifworkout.com', port: 587, secure: false },
  { host: 'smtp.arifworkout.com', port: 465, secure: true },
  { host: 'smtp.arifworkout.com', port: 587, secure: false },
  { host: 'arifworkout.com', port: 465, secure: true }, // Current
  { host: 'arifworkout.com', port: 587, secure: false },
];

async function testMailServer(config) {
  return new Promise((resolve) => {
    const transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      },
      tls: {
        rejectUnauthorized: false
      },
      connectionTimeout: 10000
    });

    transporter.verify(function(error, success) {
      if (error) {
        resolve({ success: false, error: error.message, code: error.code });
      } else {
        resolve({ success: true });
      }
    });
  });
}

async function testAllServers() {
  console.log('🧪 Testing Space Square Mail Server Options\n');
  console.log(`Email: ${process.env.EMAIL_USER}`);
  console.log(`Testing ${mailServers.length} configurations...\n`);
  
  for (let i = 0; i < mailServers.length; i++) {
    const config = mailServers[i];
    console.log(`Test ${i + 1}/${mailServers.length}: ${config.host}:${config.port} (${config.secure ? 'SSL' : 'TLS'})`);
    
    const result = await testMailServer(config);
    
    if (result.success) {
      console.log(`   ✅ SUCCESS! This configuration works!\n`);
      console.log(`📝 Update your .env file with:`);
      console.log(`   EMAIL_HOST=${config.host}`);
      console.log(`   EMAIL_PORT=${config.port}`);
      console.log(`   EMAIL_SECURE=${config.secure}\n`);
      
      // Test sending an email
      console.log('📧 Testing email send...');
      try {
        const transporter = nodemailer.createTransport({
          host: config.host,
          port: config.port,
          secure: config.secure,
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
          },
          tls: {
            rejectUnauthorized: false
          }
        });
        
        const info = await transporter.sendMail({
          from: process.env.EMAIL_FROM || `"ARIF WORK OUT" <${process.env.EMAIL_USER}>`,
          to: email,
          subject: 'Test Email - Space Square Mail Server',
          text: `Test email from ${config.host}:${config.port}\n\nOTP Code: ${testOTP}`
        });
        
        console.log(`   ✅ Email sent! Message ID: ${info.messageId}\n`);
        console.log(`✅ RECOMMENDED CONFIGURATION:`);
        console.log(`   EMAIL_HOST=${config.host}`);
        console.log(`   EMAIL_PORT=${config.port}`);
        console.log(`   EMAIL_SECURE=${config.secure}\n`);
        
        return; // Stop after first successful test
      } catch (sendError) {
        console.log(`   ⚠️  Connection works but sending failed: ${sendError.message}\n`);
      }
    } else {
      console.log(`   ❌ Failed: ${result.error}\n`);
    }
  }
  
  console.log('❌ None of the tested configurations worked.');
  console.log('\n💡 Next steps:');
  console.log('   1. Check your cPanel for the correct mail server hostname');
  console.log('   2. Look in Email Accounts > Connect Devices');
  console.log('   3. Contact Space Square support for mail server details');
}

testAllServers().catch(console.error);

