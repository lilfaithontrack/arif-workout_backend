/**
 * Find Mail Server
 * Helps identify the correct mail server hostname
 */

const dns = require('dns').promises;

const domain = 'arifworkout.com';

async function findMailServer() {
  console.log(`🔍 Finding mail server for ${domain}...\n`);
  
  // Common mail server hostnames to try
  const mailHosts = [
    'mail.arifworkout.com',
    'smtp.arifworkout.com',
    'mail1.arifworkout.com',
    'mail2.arifworkout.com',
    'arifworkout.com'
  ];
  
  console.log('Testing common mail server hostnames:\n');
  
  for (const host of mailHosts) {
    try {
      const addresses = await dns.resolve4(host);
      console.log(`✅ ${host} resolves to: ${addresses.join(', ')}`);
    } catch (error) {
      console.log(`❌ ${host} - ${error.code}`);
    }
  }
  
  // Check MX records
  console.log('\n📧 Checking MX (Mail Exchange) records:\n');
  try {
    const mxRecords = await dns.resolveMx(domain);
    if (mxRecords && mxRecords.length > 0) {
      console.log('MX Records found:');
      mxRecords.forEach((record, i) => {
        console.log(`  ${i + 1}. Priority: ${record.priority}, Host: ${record.exchange}`);
      });
      console.log(`\n💡 Use the hostname from MX record: ${mxRecords[0].exchange}`);
    } else {
      console.log('No MX records found');
    }
  } catch (error) {
    console.log(`❌ Could not resolve MX records: ${error.message}`);
  }
  
  // Check A record
  console.log('\n🌐 Checking A record:\n');
  try {
    const addresses = await dns.resolve4(domain);
    console.log(`A Record: ${domain} → ${addresses.join(', ')}`);
  } catch (error) {
    console.log(`❌ Could not resolve A record: ${error.message}`);
  }
  
  console.log('\n📝 Next Steps:');
  console.log('1. Check your hosting provider (Space Square) documentation');
  console.log('2. Look for "Mail Server" or "SMTP Server" settings in cPanel');
  console.log('3. Common mail server formats:');
  console.log('   - mail.yourdomain.com');
  console.log('   - smtp.yourdomain.com');
  console.log('   - mail.hostingprovider.com');
  console.log('   - smtp.hostingprovider.com');
  console.log('\n4. Update .env file with the correct EMAIL_HOST');
}

findMailServer().catch(console.error);

