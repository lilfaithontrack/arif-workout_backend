require('dotenv').config();
const bcrypt = require('bcryptjs');
const { User } = require('../models');
const { sequelize } = require('../config/database');

async function checkAdmin() {
  try {
    console.log('🔍 Checking admin user...\n');

    await sequelize.authenticate();
    console.log('✅ Database connected\n');

    // Find admin
    const admin = await User.findOne({ 
      where: { email: 'admin@arifworkout.com' } 
    });

    if (!admin) {
      console.log('❌ Admin user NOT FOUND!\n');
      console.log('💡 Create admin with:');
      console.log('   node src/scripts/create-admin.js\n');
      process.exit(1);
    }

    console.log('📋 Admin User Details:');
    console.log('========================');
    console.log('ID:', admin.id);
    console.log('Name:', admin.name);
    console.log('Email:', admin.email);
    console.log('Phone:', admin.phone || 'Not set');
    console.log('Roles:', JSON.stringify(admin.roles));
    console.log('Has Password:', !!admin.password);
    console.log('Password Length:', admin.password ? admin.password.length : 0);
    console.log('Is Active:', admin.isActive);
    console.log('Created At:', admin.createdAt);
    console.log('Last Login:', admin.lastLogin || 'Never');
    console.log('');

    if (!admin.password) {
      console.log('❌ PROBLEM: Admin has NO PASSWORD!\n');
      console.log('💡 Fix with:');
      console.log('   node src/scripts/reset-admin-password.js\n');
      process.exit(1);
    }

    // Test password
    console.log('🧪 Testing password "admin123"...');
    const testPassword = 'admin123';
    const isValid = await bcrypt.compare(testPassword, admin.password);
    
    if (isValid) {
      console.log('✅ Password test: PASSED\n');
      console.log('🎉 Admin user is configured correctly!');
      console.log('');
      console.log('🔑 Login Credentials:');
      console.log('   Email: admin@arifworkout.com');
      console.log('   Password: admin123');
      console.log('');
    } else {
      console.log('❌ Password test: FAILED\n');
      console.log('💡 The password is NOT "admin123"');
      console.log('   Reset it with:');
      console.log('   node src/scripts/reset-admin-password.js\n');
      process.exit(1);
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

checkAdmin();
