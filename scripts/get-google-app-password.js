/**
 * Google App Password Guide
 * Instructions for getting a Google App Password
 */

console.log('🔐 Google App Password Setup Guide\n');
console.log('='.repeat(60));
console.log('\n⚠️  IMPORTANT: You need a Google App Password, not your regular password!\n');

console.log('📋 Step-by-Step Instructions:\n');
console.log('1. Go to: https://myaccount.google.com/security');
console.log('2. Make sure "2-Step Verification" is ENABLED');
console.log('   (If not enabled, enable it first - this is required)');
console.log('3. Go to: https://myaccount.google.com/apppasswords');
console.log('4. Under "Select app", choose: Mail');
console.log('5. Under "Select device", choose: Other (Custom name)');
console.log('6. Type: ARIF WORK OUT Backend');
console.log('7. Click "Generate"');
console.log('8. Copy the 16-character password (looks like: abcd efgh ijkl mnop)');
console.log('9. Remove ALL spaces when adding to .env file');
console.log('   Example: If you see "abcd efgh ijkl mnop", use "abcdefghijklmnop"\n');

console.log('='.repeat(60));
console.log('\n📝 After Getting App Password:\n');
console.log('1. Update your .env file:');
console.log('   EMAIL_PASSWORD=your-16-char-app-password  (no quotes, no spaces)');
console.log('\n2. Test the connection:');
console.log('   node scripts/test-smtp-diagnostic.js');
console.log('\n3. Send a test email:');
console.log('   node scripts/send-simple-test-email.js\n');

console.log('='.repeat(60));
console.log('\n💡 Quick Links:');
console.log('   Security Settings: https://myaccount.google.com/security');
console.log('   App Passwords: https://myaccount.google.com/apppasswords\n');

console.log('='.repeat(60));
console.log('\n❓ Common Questions:\n');
console.log('Q: Why do I need an App Password?');
console.log('A: Google requires App Passwords for SMTP access to improve security.\n');
console.log('Q: Can I use my regular password?');
console.log('A: No, Google will reject it. You MUST use an App Password.\n');
console.log('Q: What if 2-Step Verification is not enabled?');
console.log('A: You must enable it first. Go to Security settings and enable it.\n');

