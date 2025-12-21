/**
 * Database seeding script for development
 * Run with: node src/scripts/seed.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/user.model');
const Category = require('../models/category.model');
const Package = require('../models/package.model');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    console.log('Starting database seed...');

    // Clear existing data
    await User.deleteMany({});
    await Category.deleteMany({});
    await Package.deleteMany({});

    // Create admin user
    const admin = new User({
      name: 'Admin User',
      email: 'admin@arifworkout.com',
      phone: '+251911111111',
      roles: ['admin'],
      authProviders: [{
        provider: 'email',
        providerId: 'admin@arifworkout.com',
        verified: true
      }],
      consents: {
        tosAccepted: true,
        personalInfoConsent: true
      }
    });
    await admin.save();
    console.log('✓ Admin user created');

    // Create manager user
    const manager = new User({
      name: 'Manager User',
      email: 'manager@arifworkout.com',
      phone: '+251922222222',
      roles: ['manager'],
      authProviders: [{
        provider: 'email',
        providerId: 'manager@arifworkout.com',
        verified: true
      }],
      consents: {
        tosAccepted: true,
        personalInfoConsent: true
      }
    });
    await manager.save();
    console.log('✓ Manager user created');

    // Create instructor user
    const instructor = new User({
      name: 'Instructor User',
      email: 'instructor@arifworkout.com',
      phone: '+251933333333',
      roles: ['instructor'],
      authProviders: [{
        provider: 'email',
        providerId: 'instructor@arifworkout.com',
        verified: true
      }],
      consents: {
        tosAccepted: true,
        personalInfoConsent: true
      }
    });
    await instructor.save();
    console.log('✓ Instructor user created');

    // Create student user
    const student = new User({
      name: 'Student User',
      email: 'student@arifworkout.com',
      phone: '+251944444444',
      roles: ['student'],
      gender: 'male',
      authProviders: [{
        provider: 'email',
        providerId: 'student@arifworkout.com',
        verified: true
      }],
      consents: {
        tosAccepted: true,
        personalInfoConsent: true
      }
    });
    await student.save();
    console.log('✓ Student user created');

    // Create categories
    const categories = [
      {
        name: 'Strength Training',
        slug: 'strength-training',
        description: 'Build muscle and increase strength',
        createdBy: admin._id
      },
      {
        name: 'Cardio',
        slug: 'cardio',
        description: 'Improve cardiovascular health',
        createdBy: admin._id
      },
      {
        name: 'Yoga',
        slug: 'yoga',
        description: 'Flexibility and mindfulness',
        createdBy: admin._id
      },
      {
        name: 'HIIT',
        slug: 'hiit',
        description: 'High-intensity interval training',
        createdBy: admin._id
      },
      {
        name: 'Weight Loss',
        slug: 'weight-loss',
        description: 'Programs focused on fat loss',
        createdBy: admin._id
      }
    ];

    const createdCategories = await Category.insertMany(categories);
    console.log('✓ Categories created');

    // Create sample packages
    const packages = [
      {
        title: 'Beginner Fitness - Monthly',
        slug: 'beginner-fitness-monthly',
        createdByAdmin: admin._id,
        price: 9.99,
        currency: 'USD',
        billingCycle: 'monthly',
        trialDays: 7,
        genderRestriction: 'any',
        levelRestriction: 'beginner',
        categoryId: createdCategories[0]._id,
        status: 'active',
        description: 'Perfect for fitness beginners',
        features: ['Access to beginner courses', '7-day free trial', 'Community support']
      },
      {
        title: 'Women - Weight Loss Monthly',
        slug: 'women-weight-loss-monthly',
        createdByAdmin: admin._id,
        price: 14.99,
        currency: 'USD',
        billingCycle: 'monthly',
        trialDays: 0,
        genderRestriction: 'female',
        ageRange: { min: 18, max: 60 },
        levelRestriction: 'any',
        categoryId: createdCategories[4]._id,
        status: 'active',
        description: 'Specialized weight loss program for women',
        features: ['Customized meal plans', 'Female-focused workouts', 'Progress tracking']
      },
      {
        title: 'Premium All-Access - Yearly',
        slug: 'premium-all-access-yearly',
        createdByAdmin: admin._id,
        price: 99.99,
        currency: 'USD',
        billingCycle: 'yearly',
        trialDays: 14,
        genderRestriction: 'any',
        levelRestriction: 'any',
        categoryId: createdCategories[0]._id,
        status: 'active',
        description: 'Full access to all courses and features',
        features: ['All courses included', '14-day trial', 'Priority support', 'Nutrition guides']
      }
    ];

    await Package.insertMany(packages);
    console.log('✓ Packages created');

    console.log('\n✅ Database seeded successfully!');
    console.log('\nTest Accounts:');
    console.log('Admin: admin@arifworkout.com');
    console.log('Manager: manager@arifworkout.com');
    console.log('Instructor: instructor@arifworkout.com');
    console.log('Student: student@arifworkout.com');
    console.log('\nUse OTP login with these emails to get access tokens.');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
    process.exit(0);
  }
};

// Run seed
connectDB().then(() => seedData());
