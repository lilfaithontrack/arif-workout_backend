/**
 * Sequelize-based seeder for fitness categories
 * Run with: node src/utils/seed-categories-sql.js
 */

const { sequelize } = require('../config/database');

const fitnessCategories = [
    {
        name: 'Strength Training',
        description: 'Build muscle and increase strength',
        subcategories: ['Upper Body', 'Lower Body', 'Core', 'Full Body', 'Push', 'Pull', 'Legs']
    },
    {
        name: 'Cardio',
        description: 'Improve cardiovascular endurance',
        subcategories: ['Running', 'Cycling', 'HIIT', 'Jump Rope', 'Rowing', 'Swimming', 'Elliptical']
    },
    {
        name: 'Flexibility & Mobility',
        description: 'Improve flexibility and range of motion',
        subcategories: ['Static Stretching', 'Dynamic Stretching', 'Yoga', 'Pilates', 'Mobility Drills', 'Foam Rolling']
    },
    {
        name: 'Functional Training',
        description: 'Train movements for daily life',
        subcategories: ['Balance', 'Agility', 'Power', 'Plyometrics', 'Core Stability', 'Movement Patterns']
    },
    {
        name: 'Bodyweight Training',
        description: 'No equipment needed exercises',
        subcategories: ['Calisthenics', 'Core Exercises', 'Push-ups', 'Pull-ups', 'Squats', 'Lunges']
    },
    {
        name: 'Weight Training',
        description: 'Training with external weights',
        subcategories: ['Barbell', 'Dumbbell', 'Kettlebell', 'Machines', 'Cable', 'Resistance Bands']
    },
    {
        name: 'Olympic Lifting',
        description: 'Olympic weightlifting movements',
        subcategories: ['Snatch', 'Clean & Jerk', 'Accessory Lifts', 'Technique Drills']
    },
    {
        name: 'Powerlifting',
        description: 'Focus on the big three lifts',
        subcategories: ['Squat', 'Bench Press', 'Deadlift', 'Accessory Work']
    },
    {
        name: 'Sports Specific',
        description: 'Sport-specific training',
        subcategories: ['Basketball', 'Soccer', 'Tennis', 'Boxing', 'MMA', 'CrossFit']
    },
    {
        name: 'Recovery & Regeneration',
        description: 'Active recovery and regeneration',
        subcategories: ['Active Recovery', 'Foam Rolling', 'Stretching', 'Mobility Work', 'Cool Down']
    },
    {
        name: 'Core Training',
        description: 'Dedicated core and abs work',
        subcategories: ['Abs', 'Obliques', 'Lower Back', 'Anti-Rotation', 'Anti-Extension']
    },
    {
        name: 'Endurance Training',
        description: 'Build stamina and endurance',
        subcategories: ['Long Distance', 'Tempo', 'Intervals', 'Fartlek', 'Circuit']
    },
    {
        name: 'Rehab & Prehab',
        description: 'Injury prevention and rehabilitation',
        subcategories: ['Shoulder Health', 'Knee Health', 'Hip Health', 'Ankle Health', 'Corrective Exercise']
    }
];

const seedCategories = async () => {
    try {
        console.log('🌱 Starting to seed fitness categories...\n');

        // Get first admin user ID (or use 1 as default system user)
        const [users] = await sequelize.query(
            "SELECT id FROM users WHERE role = 'admin' LIMIT 1"
        );

        const createdById = users.length > 0 ? users[0].id : 1;
        console.log(`Using user ID ${createdById} for createdBy field\n`);

        let totalCategories = 0;
        let totalSubcategories = 0;

        for (const catData of fitnessCategories) {
            const slug = catData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

            // Insert category using raw SQL to bypass validation
            const [categoryResult] = await sequelize.query(
                `INSERT INTO categories (name, slug, description, createdBy, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, NOW(), NOW())`,
                {
                    replacements: [catData.name, slug, catData.description, createdById]
                }
            );

            const categoryId = categoryResult;
            totalCategories++;
            console.log(`✓ Created category: ${catData.name} (ID: ${categoryId})`);

            // Insert subcategories
            if (catData.subcategories && catData.subcategories.length > 0) {
                for (const subName of catData.subcategories) {
                    const subSlug = subName.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

                    await sequelize.query(
                        `INSERT INTO subcategories (name, slug, categoryId, createdBy, createdAt, updatedAt)
             VALUES (?, ?, ?, ?, NOW(), NOW())`,
                        {
                            replacements: [subName, subSlug, categoryId, createdById]
                        }
                    );

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
    try {
        await sequelize.authenticate();
        console.log('✓ Connected to database\n');

        await seedCategories();

        await sequelize.close();
        console.log('✓ Database connection closed');
        process.exit(0);
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
};

run();
