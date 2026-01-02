/**
 * Script to update SMTP configuration in .env file
 * Updates email settings to use arifworkout.com SMTP
 */

const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env');

// New SMTP configuration - Google SMTP (Gmail)
// Using Google App Password for better deliverability
const smtpConfig = {
  EMAIL_HOST: 'smtp.gmail.com',  // Google's SMTP server
  EMAIL_PORT: '587',  // Port 587 with STARTTLS
  EMAIL_SECURE: 'false',  // false for STARTTLS (port 587), true for SSL (port 465)
  EMAIL_USER: 'contact@arifworkout.com',  // Google Workspace email
  EMAIL_PASSWORD: 'brvbtjdlryutvprw',  // Google App Password (16 characters, no spaces)
  EMAIL_FROM: '"ARIF WORK OUT <contact@arifworkout.com>"',
  OTP_EXPIRY_MINUTES: '10'
};

function updateEnvFile() {
  try {
    // Check if .env file exists
    if (!fs.existsSync(envPath)) {
      console.log('❌ .env file not found!');
      console.log('📝 Creating new .env file with SMTP configuration...');
      
      // Create basic .env file
      let envContent = `# SMTP Configuration for ARIF WORK OUT
EMAIL_HOST=${smtpConfig.EMAIL_HOST}
EMAIL_PORT=${smtpConfig.EMAIL_PORT}
EMAIL_SECURE=${smtpConfig.EMAIL_SECURE}
EMAIL_USER=${smtpConfig.EMAIL_USER}
EMAIL_PASSWORD=${smtpConfig.EMAIL_PASSWORD}
EMAIL_FROM=${smtpConfig.EMAIL_FROM}
OTP_EXPIRY_MINUTES=${smtpConfig.OTP_EXPIRY_MINUTES}
`;
      
      fs.writeFileSync(envPath, envContent, 'utf8');
      console.log('✅ Created .env file with SMTP configuration!');
      return;
    }
    
    // Read existing .env file
    let envContent = fs.readFileSync(envPath, 'utf8');
    let updated = false;
    
    // Update or add each SMTP configuration
    Object.keys(smtpConfig).forEach(key => {
      const regex = new RegExp(`^${key}=.*$`, 'm');
      const newLine = `${key}=${smtpConfig[key]}`;
      
      if (regex.test(envContent)) {
        // Update existing
        envContent = envContent.replace(regex, newLine);
        console.log(`✅ Updated ${key}`);
        updated = true;
      } else {
        // Add new
        envContent += `\n${newLine}`;
        console.log(`✅ Added ${key}`);
        updated = true;
      }
    });
    
    // Write updated content
    if (updated) {
      fs.writeFileSync(envPath, envContent, 'utf8');
      console.log('\n✅ SMTP configuration updated successfully!');
      console.log('\n📋 Updated configuration:');
      console.log(`   EMAIL_HOST=${smtpConfig.EMAIL_HOST}`);
      console.log(`   EMAIL_PORT=${smtpConfig.EMAIL_PORT}`);
      console.log(`   EMAIL_SECURE=${smtpConfig.EMAIL_SECURE}`);
      console.log(`   EMAIL_USER=${smtpConfig.EMAIL_USER}`);
      console.log(`   EMAIL_PASSWORD=${smtpConfig.EMAIL_PASSWORD.substring(0, 5)}...`);
      console.log(`   EMAIL_FROM=${smtpConfig.EMAIL_FROM}`);
    } else {
      console.log('ℹ️  No changes needed. Configuration already correct.');
    }
    
  } catch (error) {
    console.error('❌ Error updating .env file:', error.message);
    process.exit(1);
  }
}

console.log('🔧 Updating SMTP configuration in .env file...\n');
updateEnvFile();
console.log('\n✨ Done! You can now test the OTP login.');

