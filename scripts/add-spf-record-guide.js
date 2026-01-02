/**
 * SPF Record Addition Guide
 * Provides exact DNS record to add and verifies it
 */

const dns = require('dns').promises;

const domain = 'arifworkout.com';
const serverIP = '91.204.209.46';

console.log('📋 SPF Record Addition Guide for ARIF WORK OUT\n');
console.log('='.repeat(60));

console.log('\n📝 Step 1: Add SPF Record in Space Square cPanel\n');
console.log('1. Log into your Space Square cPanel');
console.log('2. Go to "DNS Zone Editor" or "Advanced DNS Zone Editor"');
console.log('3. Click "Add Record" or "Add"');
console.log('4. Fill in the following:\n');

console.log('   ┌─────────────────────────────────────────────┐');
console.log('   │ Type:     TXT                              │');
console.log('   │ Name:     @  (or leave blank)              │');
console.log('   │ TTL:      3600  (or default)               │');
console.log(`   │ Value:    v=spf1 a mx ip4:${serverIP} ~all  │`);
console.log('   └─────────────────────────────────────────────┘\n');

console.log('5. Click "Add Record" or "Save"');
console.log('6. Wait 5-10 minutes for DNS propagation\n');

console.log('='.repeat(60));
console.log('\n🔍 Step 2: Verify SPF Record\n');
console.log('After adding the record, run this script again to verify:');
console.log('   node scripts/add-spf-record-guide.js verify\n');

// Check if user wants to verify
if (process.argv[2] === 'verify') {
  verifySPFRecord();
} else {
  console.log('\n💡 Quick Command:');
  console.log('   node scripts/add-spf-record-guide.js verify\n');
}

async function verifySPFRecord() {
  console.log('\n🔍 Checking SPF record...\n');
  
  try {
    const records = await dns.resolveTxt(domain);
    
    // Find SPF record
    const spfRecord = records.find(record => 
      record.some(line => line.toLowerCase().includes('v=spf1'))
    );
    
    if (spfRecord) {
      const spfValue = Array.isArray(spfRecord) ? spfRecord.join('') : spfRecord[0];
      console.log('✅ SPF Record Found!');
      console.log(`   Value: ${spfValue}\n`);
      
      // Check if it includes the IP
      if (spfValue.includes(serverIP)) {
        console.log('✅ SPF record includes your server IP!');
        console.log('✅ Configuration looks correct!\n');
        console.log('📧 Now test sending an email:');
        console.log('   node scripts/send-simple-test-email.js\n');
      } else {
        console.log('⚠️  SPF record found but might not include your server IP');
        console.log(`   Expected IP: ${serverIP}`);
        console.log('   You may need to update the SPF record\n');
      }
    } else {
      console.log('❌ SPF Record Not Found');
      console.log('   The record may not be added yet, or DNS hasn\'t propagated');
      console.log('   Wait 5-10 minutes and try again\n');
    }
    
    // Show all TXT records
    console.log('📋 All TXT Records for', domain + ':');
    records.forEach((record, i) => {
      const value = Array.isArray(record) ? record.join('') : record[0];
      console.log(`   ${i + 1}. ${value}`);
    });
    
  } catch (error) {
    console.log('❌ Error checking DNS:', error.message);
    console.log('   This might mean:');
    console.log('   - DNS hasn\'t propagated yet (wait 5-10 minutes)');
    console.log('   - Record not added yet');
    console.log('   - DNS lookup issue\n');
  }
}

