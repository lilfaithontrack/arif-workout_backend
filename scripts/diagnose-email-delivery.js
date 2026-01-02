/**
 * Diagnose Email Delivery Issues
 * Checks why emails aren't reaching Gmail
 */

require('dotenv').config();
const nodemailer = require('nodemailer');

const testEmails = [
  'kalu4mom@gmail.com',
  // Add another email if you have one to test
];

async function diagnoseDelivery() {
  console.log('🔍 Diagnosing Email Delivery Issues\n');
  
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT) || 465,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    },
    tls: {
      rejectUnauthorized: false
    },
    debug: true,
    logger: true
  });
  
  console.log('📋 Current Configuration:');
  console.log(`   Host: ${process.env.EMAIL_HOST}`);
  console.log(`   Port: ${process.env.EMAIL_PORT}`);
  console.log(`   From: ${process.env.EMAIL_FROM || process.env.EMAIL_USER}\n`);
  
  // Test 1: Verify connection
  console.log('Test 1: Verifying SMTP connection...');
  try {
    await transporter.verify();
    console.log('✅ SMTP connection verified\n');
  } catch (error) {
    console.log(`❌ SMTP verification failed: ${error.message}\n`);
    return;
  }
  
  // Test 2: Send test email with detailed logging
  for (const email of testEmails) {
    console.log(`\n📧 Sending test email to: ${email}`);
    console.log('─'.repeat(60));
    
    try {
      const mailOptions = {
        from: process.env.EMAIL_FROM || `"ARIF WORK OUT" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: `Test Email - ${new Date().toISOString()}`,
        text: `This is a test email sent at ${new Date().toLocaleString()}`,
        html: `<p>This is a test email sent at ${new Date().toLocaleString()}</p>`,
        // Add headers to help with delivery
        headers: {
          'X-Mailer': 'ARIF WORK OUT',
          'X-Priority': '1',
          'Return-Path': process.env.EMAIL_USER
        }
      };
      
      const info = await transporter.sendMail(mailOptions);
      
      console.log('✅ Email accepted by SMTP server');
      console.log(`   Message ID: ${info.messageId}`);
      console.log(`   Response: ${info.response}`);
      console.log(`   Envelope: ${JSON.stringify(info.envelope)}`);
      
      // Check if there's a rejection
      if (info.rejected && info.rejected.length > 0) {
        console.log(`\n⚠️  Email was REJECTED by recipient server:`);
        console.log(`   Rejected addresses: ${info.rejected.join(', ')}`);
        console.log(`   This means Gmail is blocking/rejecting the email`);
      } else {
        console.log(`\n✅ Email was accepted (no immediate rejection)`);
        console.log(`   However, Gmail might still filter it`);
      }
      
    } catch (error) {
      console.log(`❌ Failed to send: ${error.message}`);
      if (error.code) console.log(`   Code: ${error.code}`);
      if (error.response) console.log(`   Response: ${error.response}`);
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('💡 Possible Issues:');
  console.log('='.repeat(60));
  console.log('1. Gmail is silently rejecting emails from arifworkout.com');
  console.log('2. Missing SPF/DKIM records causing Gmail to filter');
  console.log('3. Domain reputation issue (new domain)');
  console.log('4. Gmail has strict filters for this sender');
  console.log('\n📝 Solutions:');
  console.log('1. Add SPF record in DNS: v=spf1 a mx ip4:91.204.209.46 ~all');
  console.log('2. Add DKIM record (check cPanel for DKIM settings)');
  console.log('3. Use a different email service (SendGrid, Mailgun, etc.)');
  console.log('4. Contact Space Square support about email delivery');
  console.log('5. Check cPanel Mail Queue for delivery status');
}

diagnoseDelivery().catch(console.error);

