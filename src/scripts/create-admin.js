require('dotenv').config();
const bcrypt = require('bcryptjs');
const { User } = require('../models');
const { sequelize } = require('../config/database');

async function createAdmin() {
  try {
    // Connect to database
    await sequelize.authenticate();
    console.log('✅ Database connected\n');
    
    console.log('Creating admin user...');
    
    // Check if admin already exists
    const existingAdmin = await User.findOne({ 
      where: { email: 'admin@arifworkout.com' } 
    });
    
    if (existingAdmin) {
      console.log('❌ Admin user already exists!');
      console.log('Email:', existingAdmin.email);
      console.log('To reset password, delete the user first or use the update password endpoint.');
      process.exit(0);
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@arifworkout.com',
      password: hashedPassword,
      roles: ['admin'],
      authProviders: [{
        provider: 'email',
        providerId: 'admin@arifworkout.com',
        lastUsed: new Date()
      }],
      consents: {
        termsAccepted: true,
        privacyAccepted: true,
        marketingOptIn: false,
        dataProcessingConsent: true
      },
      isActive: true
    });
    
    console.log('✅ Admin user created successfully!');
    console.log('');
    console.log('Login Credentials:');
    console.log('==================');
    console.log('Email:', admin.email);
    console.log('Password: admin123');
    console.log('');
    console.log('⚠️  IMPORTANT: Change this password after first login!');
    console.log('');
    console.log('You can now login at: POST http://localhost:5000/api/auth/login');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
    process.exit(1);
  }
}

createAdmin();
