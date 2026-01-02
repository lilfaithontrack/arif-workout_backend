/**
 * Find cPanel Mail Server
 * Helps identify the correct mail server for cPanel email accounts
 */

const dns = require('dns').promises;

const domain = 'arifworkout.com';

console.log('🔍 Finding cPanel Mail Server for ARIF WORK OUT\n');
console.log('='.repeat(60));

async function findMailServer() {
  // Common cPanel mail server hostnames
  const mailHosts = [
    'mail.arifworkout.com',
    'smtp.arifworkout.com',
    'mail1.arifworkout.com',
    'arifworkout.com'
  ];
  
  console.log('📧 Testing common cPanel mail server hostnames:\n');
  
  for (const host of mailHosts) {
    try {
      const addresses = await dns.resolve4(host);
      console.log(`✅ ${host} → ${addresses.join(', ')}`);
    } catch (error) {
      console.log(`❌ ${host} - ${error.code}`);
    }
  }
  
  // Check MX records
  console.log('\n📋 Checking MX Records:\n');
  try {
    const mxRecords = await dns.resolveMx(domain);
    if (mxRecords && mxRecords.length > 0) {
      console.log('MX Records:');
      mxRecords.forEach((record, i) => {
        console.log(`  ${i + 1}. ${record.exchange} (Priority: ${record.priority})`);
      });
    }
  } catch (error) {
    console.log(`❌ Could not resolve MX records: ${error.message}`);
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('\n📝 How to Find Your cPanel Mail Server:\n');
  console.log('1. Log into your cPanel');
  console.log('2. Go to "Email Accounts"');
  console.log('3. Find "contact@arifworkout.com"');
  console.log('4. Click "Connect Devices" or "Mail Client Configuration"');
  console.log('5. Look for "Outgoing Server" or "SMTP Server"');
  console.log('   It will show something like:');
  console.log('   - mail.arifworkout.com');
  console.log('   - smtp.arifworkout.com');
  console.log('   - mail.yourhostingprovider.com\n');
  
  console.log('💡 Common cPanel Mail Server Formats:');
  console.log('   - mail.arifworkout.com (most common)');
  console.log('   - smtp.arifworkout.com');
  console.log('   - mail.yourhostingprovider.com');
  console.log('   - arifworkout.com (if mail is on main domain)\n');
  
  console.log('🔧 Once you find it, update .env:');
  console.log('   EMAIL_HOST=mail.arifworkout.com  (or whatever cPanel shows)');
  console.log('   EMAIL_PORT=465');
  console.log('   EMAIL_SECURE=true');
  console.log('   EMAIL_USER=contact@arifworkout.com');
  console.log('   EMAIL_PASSWORD="Ha@603887"\n');
}

findMailServer().catch(console.error);

