/**
 * Seed script for adding comprehensive fitness categories
 * Run with: node src/utils/seed-fitness-categories.js
 */

const mongoose = require('mongoose');
const Category = require('../models/category.model');
const Subcategory = require('../models/subcategory.model');

// MongoDB connection (uses same connection as main app)
const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/workout-app';
        await mongoose.connect(mongoURI);
        console.log('✓ Connected to MongoDB');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

const fitnessCategories = [
    {
        name: 'Strength Training',
        description: 'Build muscle and increase strength',
        subcategories: [
            { name: 'Upper Body', description: 'Chest, back, shoulders, arms' },
            { name: 'Lower Body', description: 'Legs, glutes, calves' },
            { name: 'Core', description: 'Abs, obliques, lower back' },
            { name: 'Full Body', description: 'Compound movements' },
            { name: 'Push', description: 'Chest, shoulders, triceps' },
            { name: 'Pull', description: 'Back, biceps, traps' },
            { name: 'Legs', description: 'Quads, hamstrings, glutes' }
        ]
    },
    {
        name: 'Cardio',
        description: 'Improve cardiovascular endurance',
        subcategories: [
            { name: 'Running', description: 'Treadmill and outdoor running' },
            { name: 'Cycling', description: 'Stationary and road cycling' },
            { name: 'HIIT', description: 'High intensity interval training' },
            { name: 'Jump Rope', description: 'Rope skipping exercises' },
            { name: 'Rowing', description: 'Rowing machine workouts' },
            { name: 'Swimming', description: 'Swim-based cardio' },
            { name: 'Elliptical', description: 'Elliptical machine workouts' }
        ]
    },
    {
        name: 'Flexibility & Mobility',
        description: 'Improve flexibility and range of motion',
        subcategories: [
            { name: 'Static Stretching', description: 'Hold stretches for flexibility' },
            { name: 'Dynamic Stretching', description: 'Active movement stretches' },
            { name: 'Yoga', description: 'Yoga poses and flows' },
            { name: 'Pilates', description: 'Pilates core and flexibility' },
            { name: 'Mobility Drills', description: 'Joint mobility exercises' },
            { name: 'Foam Rolling', description: 'Self-myofascial release' }
        ]
    },
    {
        name: 'Functional Training',
        description: 'Train movements for daily life',
        subcategories: [
            { name: 'Balance', description: 'Balance and stability exercises' },
            { name: 'Agility', description: 'Agility and coordination drills' },
            { name: 'Power', description: 'Explosive power movements' },
            { name: 'Plyometrics', description: 'Jump and explosive training' },
            { name: 'Core Stability', description: 'Functional core strength' },
            { name: 'Movement Patterns', description: 'Natural movement training' }
        ]
    },
    {
        name: 'Bodyweight Training',
        description: 'No equipment needed exercises',
        subcategories: [
            { name: 'Calisthenics', description: 'Bodyweight strength moves' },
            { name: 'Core Exercises', description: 'Abs and core bodyweight' },
            { name: 'Push-ups', description: 'Push-up variations' },
            { name: 'Pull-ups', description: 'Pull-up and chin-up variations' },
            { name: 'Squats', description: 'Bodyweight squat variations' },
            { name: 'Lunges', description: 'Lunge variations' }
        ]
    },
    {
        name: 'Weight Training',
        description: 'Training with external weights',
        subcategories: [
            { name: 'Barbell', description: 'Barbell exercises' },
            { name: 'Dumbbell', description: 'Dumbbell exercises' },
            { name: 'Kettlebell', description: 'Kettlebell movements' },
            { name: 'Machines', description: 'Weight machines' },
            { name: 'Cable', description: 'Cable machine exercises' },
            { name: 'Resistance Bands', description: 'Band resistance training' }
        ]
    },
    {
        name: 'Olympic Lifting',
        description: 'Olympic weightlifting movements',
        subcategories: [
            { name: 'Snatch', description: 'Snatch variations' },
            { name: 'Clean & Jerk', description: 'Clean and jerk variations' },
            { name: 'Accessory Lifts', description: 'Supporting movements' },
            { name: 'Technique Drills', description: 'Form and technique practice' }
        ]
    },
    {
        name: 'Powerlifting',
        description: 'Focus on the big three lifts',
        subcategories: [
            { name: 'Squat', description: 'Back squat and variations' },
            { name: 'Bench Press', description: 'Bench press variations' },
            { name: 'Deadlift', description: 'Deadlift variations' },
            { name: 'Accessory Work', description: 'Supporting exercises' }
        ]
    },
    {
        name: 'Sports Specific',
        description: 'Sport-specific training',
        subcategories: [
            { name: 'Basketball', description: 'Basketball conditioning' },
            { name: 'Soccer', description: 'Soccer fitness drills' },
            { name: 'Tennis', description: 'Tennis-specific training' },
            { name: 'Boxing', description: 'Boxing and combat sports' },
            { name: 'MMA', description: 'Mixed martial arts training' },
            { name: 'CrossFit', description: 'CrossFit WODs' }
        ]
    },
    {
        name: 'Recovery & Regeneration',
        description: 'Active recovery and regeneration',
        subcategories: [
            { name: 'Active Recovery', description: 'Light movement recovery' },
            { name: 'Foam Rolling', description: 'Self-massage recovery' },
            { name: 'Stretching', description: 'Recovery stretches' },
            { name: 'Mobility Work', description: 'Movement quality drills' },
            { name: 'Cool Down', description: 'Post-workout cool downs' }
        ]
    },
    {
        name: 'Core Training',
        description: 'Dedicated core and abs work',
        subcategories: [
            { name: 'Abs', description: 'Abdominal exercises' },
            { name: 'Obliques', description: 'Side ab exercises' },
            { name: 'Lower Back', description: 'Lower back strengthening' },
            { name: 'Anti-Rotation', description: 'Rotational stability' },
            { name: 'Anti-Extension', description: 'Core bracing exercises' }
        ]
    },
    {
        name: 'Endurance Training',
        description: 'Build stamina and endurance',
        subcategories: [
            { name: 'Long Distance', description: 'Long steady efforts' },
            { name: 'Tempo', description: 'Sustained hard efforts' },
            { name: 'Intervals', description: 'Interval training' },
            { name: 'Fartlek', description: 'Speed play training' },
            { name: 'Circuit', description: 'Circuit-based endurance' }
        ]
    },
    {
        name: 'Rehab & Prehab',
        description: 'Injury prevention and rehabilitation',
        subcategories: [
            { name: 'Shoulder Health', description: 'Shoulder stability and mobility' },
            { name: 'Knee Health', description: 'Knee strengthening' },
            { name: 'Hip Health', description: 'Hip mobility and strength' },
            { name: 'Ankle Health', description: 'Ankle stability' },
            { name: 'Corrective Exercise', description: 'Movement correction' }
        ]
    }
];

const seedCategories = async () => {
    try {
        console.log('🌱 Starting to seed fitness categories...\n');

        // Clear existing categories (optional - comment out if you want to keep existing)
        // await Category.deleteMany({});
        // await Subcategory.deleteMany({});
        // console.log('✓ Cleared existing categories\n');

        let totalCategories = 0;
        let totalSubcategories = 0;

        for (const catData of fitnessCategories) {
            // Create category
            const category = new Category({
                name: catData.name,
                description: catData.description,
                slug: catData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')
            });

            await category.save();
            totalCategories++;
            console.log(`✓ Created category: ${category.name}`);

            // Create subcategories
            if (catData.subcategories && catData.subcategories.length > 0) {
                for (const subData of catData.subcategories) {
                    const subcategory = new Subcategory({
                        name: subData.name,
                        description: subData.description,
                        slug: subData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''),
                        categoryId: category._id
                    });

                    await subcategory.save();
                    totalSubcategories++;
                }
                console.log(`  ✓ Created ${catData.subcategories.length} subcategories\n`);
            }
        }

        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('✅ SUCCESS! Fitness categories seeded');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`📁 Total categories: ${totalCategories}`);
        console.log(`📂 Total subcategories: ${totalSubcategories}`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    } catch (error) {
        console.error('❌ Error seeding categories:', error);
        throw error;
    }
};

// Run the seeder
const run = async () => {
    await connectDB();
    await seedCategories();
    await mongoose.connection.close();
    console.log('✓ Database connection closed');
    process.exit(0);
};

run().catch((error) => {
    console.error('Seeding failed:', error);
    process.exit(1);
});
