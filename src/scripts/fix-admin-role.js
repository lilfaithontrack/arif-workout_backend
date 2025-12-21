require('dotenv').config();
const { User } = require('../models');
const { sequelize } = require('../config/database');

async function fixAdminRole() {
  try {
    console.log('🔧 Fixing admin user role...\n');

    await sequelize.authenticate();
    console.log('✅ Database connected\n');

    // Find admin user
    const admin = await User.findOne({ 
      where: { email: 'admin@arifworkout.com' } 
    });

    if (!admin) {
      console.log('❌ Admin user not found!\n');
      console.log('💡 Create admin with:');
      console.log('   node src/scripts/create-admin.js\n');
      process.exit(1);
    }

    console.log('📋 Current admin details:');
    console.log('   Email:', admin.email);
    console.log('   Current Roles:', JSON.stringify(admin.roles));
    console.log('');

    // Update role to admin using setDataValue to bypass getter
    admin.setDataValue('roles', ['admin']);
    await admin.save();

    console.log('✅ Admin role updated successfully!\n');
    console.log('📋 New admin details:');
    console.log('   Email:', admin.email);
    console.log('   New Roles:', JSON.stringify(admin.roles));
    console.log('');
    console.log('🔑 Login Credentials:');
    console.log('   ========================');
    console.log('   Email: admin@arifworkout.com');
    console.log('   Password: admin123');
    console.log('');
    console.log('🚀 You can now login at: http://localhost:5173\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

fixAdminRole();
