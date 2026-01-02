/**
 * Send Simple Test Email
 * Sends a simple plain text email to test delivery
 */

require('dotenv').config();
const nodemailer = require('nodemailer');

const email = 'kalu4mom@gmail.com';

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT) || 465,
  secure: process.env.EMAIL_SECURE === 'true' || parseInt(process.env.EMAIL_PORT) === 465,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  },
  tls: {
    rejectUnauthorized: false
  }
});

async function sendSimpleEmail() {
  try {
    console.log('📧 Sending simple test email...\n');
    console.log(`To: ${email}`);
    console.log(`From: ${process.env.EMAIL_FROM || process.env.EMAIL_USER}\n`);
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || `"ARIF WORK OUT" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Test Email from ARIF WORK OUT - Simple Test',
      text: `Hello!

This is a simple test email from ARIF WORK OUT.

If you receive this email, your SMTP configuration is working correctly.

Your OTP code is: 123456

This email was sent at: ${new Date().toLocaleString()}

Best regards,
ARIF WORK OUT Team`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #667eea;">Test Email from ARIF WORK OUT</h2>
          <p>Hello!</p>
          <p>This is a simple test email from ARIF WORK OUT.</p>
          <p>If you receive this email, your SMTP configuration is working correctly.</p>
          <div style="background: #f8f9fa; border: 2px dashed #667eea; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
            <div style="font-size: 36px; font-weight: bold; color: #667eea; letter-spacing: 8px;">123456</div>
            <div style="color: #6c757d; font-size: 14px; margin-top: 10px;">Your OTP Code</div>
          </div>
          <p>This email was sent at: ${new Date().toLocaleString()}</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #6c757d; font-size: 12px;">
            Best regards,<br>
            <strong>ARIF WORK OUT Team</strong>
          </p>
        </div>
      `
    };
    
    const info = await transporter.sendMail(mailOptions);
    
    console.log('✅ Email sent successfully!');
    console.log(`   Message ID: ${info.messageId}`);
    console.log(`   Response: ${info.response}\n`);
    
    console.log('📬 Please check:');
    console.log('   1. Your inbox (kalu4mom@gmail.com)');
    console.log('   2. SPAM/JUNK folder');
    console.log('   3. Gmail "Promotions" tab');
    console.log('   4. Gmail "Updates" tab');
    console.log('   5. Wait 1-2 minutes (emails can be delayed)\n');
    
    console.log('💡 If you still don\'t see it:');
    console.log('   - Check Gmail filters');
    console.log('   - Check Gmail settings > Filters and Blocked Addresses');
    console.log('   - The email might be blocked by Gmail\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to send email:');
    console.error(`   Error: ${error.message}`);
    if (error.code) console.error(`   Code: ${error.code}`);
    if (error.response) console.error(`   Response: ${error.response}`);
    process.exit(1);
  }
}

sendSimpleEmail();

