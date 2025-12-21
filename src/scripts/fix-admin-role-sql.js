require('dotenv').config();
const { sequelize } = require('../config/database');

async function fixAdminRoleSQL() {
  try {
    console.log('🔧 Fixing admin user role with direct SQL...\n');

    await sequelize.authenticate();
    console.log('✅ Database connected\n');

    // Direct SQL update to bypass Sequelize model
    await sequelize.query(
      `UPDATE users SET roles = '["admin"]' WHERE email = 'admin@arifworkout.com'`
    );

    console.log('✅ Admin role updated successfully!\n');

    // Verify the update
    const [results] = await sequelize.query(
      `SELECT id, name, email, roles, isActive FROM users WHERE email = 'admin@arifworkout.com'`
    );

    if (results.length > 0) {
      const admin = results[0];
      console.log('📋 Updated admin details:');
      console.log('   ID:', admin.id);
      console.log('   Name:', admin.name);
      console.log('   Email:', admin.email);
      console.log('   Roles:', admin.roles);
      console.log('   Is Active:', admin.isActive);
      console.log('');
    }

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

fixAdminRoleSQL();
