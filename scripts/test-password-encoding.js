/**
 * Test password encoding for SMTP
 */

require('dotenv').config();

console.log('Password from .env:');
console.log(`  Raw: "${process.env.EMAIL_PASSWORD}"`);
console.log(`  Length: ${process.env.EMAIL_PASSWORD ? process.env.EMAIL_PASSWORD.length : 0}`);
console.log(`  Characters: ${process.env.EMAIL_PASSWORD ? process.env.EMAIL_PASSWORD.split('').map(c => c.charCodeAt(0)).join(', ') : 'none'}`);

// Test different password formats
const passwords = [
  process.env.EMAIL_PASSWORD, // Original
  process.env.EMAIL_PASSWORD?.replace(/"/g, ''), // Remove quotes if any
  encodeURIComponent(process.env.EMAIL_PASSWORD || ''), // URL encoded
  Buffer.from(process.env.EMAIL_PASSWORD || '').toString('base64') // Base64
];

console.log('\nTesting different password formats:');
passwords.forEach((pwd, i) => {
  console.log(`  Format ${i + 1}: "${pwd}" (length: ${pwd.length})`);
});

console.log('\n💡 The password should be exactly: Kalebeyasu123@#');
console.log('   Make sure there are no extra spaces, quotes, or line breaks in .env file');

