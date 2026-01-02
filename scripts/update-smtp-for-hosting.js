/**
 * Update SMTP Configuration for Hosting Provider
 * Updates SMTP settings based on hosting provider mail server
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env');

console.log('🔧 SMTP Configuration Helper for Space Square Hosting\n');

console.log('📋 Current Configuration:');
console.log(`   EMAIL_HOST: ${process.env.EMAIL_HOST}`);
console.log(`   EMAIL_PORT: ${process.env.EMAIL_PORT}`);
console.log(`   EMAIL_USER: ${process.env.EMAIL_USER}\n`);

console.log('💡 For Space Square hosting, the mail server is usually:');
console.log('   Option 1: mail.arifworkout.com (if mail subdomain is configured)');
console.log('   Option 2: arifworkout.com (current - might work)');
console.log('   Option 3: mail.spacesquare.com or smtp.spacesquare.com');
console.log('   Option 4: Check cPanel > Email Accounts > Connect Devices\n');

console.log('📝 To find the correct mail server:');
console.log('   1. Log into your cPanel (Space Square hosting)');
console.log('   2. Go to "Email Accounts"');
console.log('   3. Click "Connect Devices" or "Mail Client Configuration"');
console.log('   4. Look for "Outgoing Server" or "SMTP Server"');
console.log('   5. It will show something like:');
console.log('      - mail.arifworkout.com');
console.log('      - smtp.arifworkout.com');
console.log('      - mail.spacesquare.com\n');

console.log('🔍 Common Space Square mail server settings:');
console.log('   Host: mail.yourdomain.com or mail.spacesquare.com');
console.log('   Port: 465 (SSL) or 587 (TLS)');
console.log('   Authentication: Required\n');

// Ask user for mail server
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Enter the mail server hostname (or press Enter to keep current): ', (mailHost) => {
  if (mailHost.trim()) {
    // Update .env file
    try {
      let envContent = fs.readFileSync(envPath, 'utf8');
      
      // Update EMAIL_HOST
      const hostRegex = /^EMAIL_HOST=.*$/m;
      if (hostRegex.test(envContent)) {
        envContent = envContent.replace(hostRegex, `EMAIL_HOST=${mailHost.trim()}`);
      } else {
        envContent += `\nEMAIL_HOST=${mailHost.trim()}`;
      }
      
      fs.writeFileSync(envPath, envContent, 'utf8');
      console.log(`\n✅ Updated EMAIL_HOST to: ${mailHost.trim()}`);
      console.log('\n📝 You may also need to update:');
      console.log('   - EMAIL_PORT (usually 465 or 587)');
      console.log('   - EMAIL_SECURE (true for 465, false for 587)');
    } catch (error) {
      console.error('❌ Error updating .env file:', error.message);
    }
  } else {
    console.log('\nℹ️  Keeping current configuration');
  }
  
  rl.close();
  process.exit(0);
});

