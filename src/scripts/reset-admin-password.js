require('dotenv').config();
const bcrypt = require('bcryptjs');
const { User } = require('../models');
const { sequelize } = require('../config/database');

async function resetAdminPassword() {
  try {
    console.log('🔄 Resetting admin password...\n');

    // Connect to database
    await sequelize.authenticate();
    console.log('✅ Database connected\n');

    // Find admin user
    const admin = await User.findOne({ 
      where: { email: 'admin@arifworkout.com' } 
    });

    if (!admin) {
      console.log('❌ Admin user not found!');
      console.log('\n💡 Run this command to create admin:');
      console.log('   node src/scripts/create-admin.js\n');
      process.exit(1);
    }

    console.log('📋 Current admin details:');
    console.log('   ID:', admin.id);
    console.log('   Name:', admin.name);
    console.log('   Email:', admin.email);
    console.log('   Roles:', admin.roles);
    console.log('   Has Password:', !!admin.password);
    console.log('   Is Active:', admin.isActive);
    console.log('');

    // Hash new password
    const newPassword = 'admin123';
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await admin.update({ 
      password: hashedPassword,
      isActive: true 
    });

    console.log('✅ Password reset successfully!\n');
    console.log('🔑 New Login Credentials:');
    console.log('   ========================');
    console.log('   Email: admin@arifworkout.com');
    console.log('   Password: admin123');
    console.log('');
    console.log('🚀 You can now login at: http://localhost:5173\n');

    // Test password
    const isValid = await bcrypt.compare(newPassword, hashedPassword);
    console.log('✅ Password verification test:', isValid ? 'PASSED' : 'FAILED');
    console.log('');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

resetAdminPassword();
