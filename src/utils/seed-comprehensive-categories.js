/**
 * COMPREHENSIVE Fitness Categories Seeder - 50+ Categories
 * Run with: node src/utils/seed-comprehensive-categories.js
 */

const { sequelize } = require('../config/database');

const comprehensiveFitnessCategories = [
    // Main Training Types
    { name: 'Strength Training', description: 'Build muscle and increase strength' },
    { name: 'Cardio Training', description: 'Improve cardiovascular endurance' },
    { name: 'Flexibility Training', description: 'Improve flexibility and range of motion' },
    { name: 'Mobility Training', description: 'Joint mobility and movement quality' },
    { name: 'Functional Training', description: 'Train movements for daily life' },
    { name: 'Bodyweight Training', description: 'No equipment needed exercises' },
    { name: 'Weight Training', description: 'Training with external weights' },

    // Specific Lifting Styles
    { name: 'Olympic Lifting', description: 'Olympic weightlifting movements' },
    { name: 'Powerlifting', description: 'Focus on squat, bench, deadlift' },
    { name: 'Strongman', description: 'Strongman training and events' },
    { name: 'CrossFit', description: 'High-intensity functional fitness' },
    { name: 'Calisthenics', description: 'Advanced bodyweight movements' },

    // Body Parts - Upper Body
    { name: 'Chest Exercises', description: 'Pectoral muscle development' },
    { name: 'Back Exercises', description: 'Lat, rhomboid, and back development' },
    { name: 'Shoulder Exercises', description: 'Deltoid muscle development' },
    { name: 'Arm Exercises', description: 'Biceps and triceps training' },
    { name: 'Bicep Exercises', description: 'Bicep muscle isolation' },
    { name: 'Tricep Exercises', description: 'Tricep muscle isolation' },
    { name: 'Forearm Exercises', description: 'Forearm and grip strength' },
    { name: 'Trap Exercises', description: 'Trapezius muscle development' },
    { name: 'Rotator Cuff', description: 'Shoulder health and stability' },

    // Body Parts - Core & Abs
    { name: 'Core Training', description: 'Core strength and stability' },
    { name: 'Abs Exercises', description: 'Abdominal muscle development' },
    { name: 'Oblique Exercises', description: 'Side ab training' },
    { name: 'Lower Back', description: 'Lower back strengthening' },
    { name: 'Serratus', description: 'Serratus anterior exercises' },

    // Body Parts - Lower Body
    { name: 'Leg Exercises', description: 'Complete leg development' },
    { name: 'Quad Exercises', description: 'Quadriceps muscle development' },
    { name: 'Hamstring Exercises', description: 'Hamstring muscle development' },
    { name: 'Glute Exercises', description: 'Glute muscle development' },
    { name: 'Calf Exercises', description: 'Calf muscle development' },
    { name: 'Hip Exercises', description: 'Hip strength and mobility' },
    { name: 'Adductor Exercises', description: 'Inner thigh training' },
    { name: 'Abductor Exercises', description: 'Outer hip training' },

    // Equipment-Based
    { name: 'Barbell Exercises', description: 'Barbell training' },
    { name: 'Dumbbell Exercises', description: 'Dumbbell training' },
    { name: 'Kettlebell Exercises', description: 'Kettlebell training' },
    { name: 'Machine Exercises', description: 'Weight machine exercises' },
    { name: 'Cable Exercises', description: 'Cable machine training' },
    { name: 'Resistance Bands', description: 'Band resistance training' },
    { name: 'TRX & Suspension', description: 'Suspension training' },
    { name: 'Medicine Ball', description: 'Medicine ball exercises' },
    { name: 'Stability Ball', description: 'Stability ball training' },
    { name: 'Sandbag Training', description: 'Sandbag exercises' },
    { name: 'Battle Ropes', description: 'Battle rope conditioning' },
    { name: 'Sled Training', description: 'Sled push and pull' },

    // Cardio Types
    { name: 'Running', description: 'Running and jogging' },
    { name: 'Sprinting', description: 'Sprint training and speed work' },
    { name: 'Cycling', description: 'Bike training' },
    { name: 'Swimming', description: 'Swimming exercises' },
    { name: 'Rowing', description: 'Rowing machine and water rowing' },
    { name: 'Jump Rope', description: 'Rope skipping' },
    { name: 'Elliptical', description: 'Elliptical machine training' },
    { name: 'Stair Climbing', description: 'Stair stepper and climbing' },
    { name: 'HIIT', description: 'High intensity interval training' },

    // Special Training Methods
    { name: 'Plyometrics', description: 'Jump and explosive training' },
    { name: 'Isometric Training', description: 'Static holds and tension' },
    { name: 'Eccentric Training', description: 'Negative rep training' },
    { name: 'Tempo Training', description: 'Controlled tempo lifts' },
    { name: 'Superset Training', description: 'Back-to-back exercises' },
    { name: 'Circuit Training', description: 'Multi-exercise circuits' },
    { name: 'Pyramid Training', description: 'Progressive set schemes' },
    { name: 'Drop Sets', description: 'Descending weight sets' },

    // Sports-Specific
    { name: 'Basketball Training', description: 'Basketball conditioning' },
    { name: 'Soccer Training', description: 'Soccer fitness' },
    { name: 'Tennis Training', description: 'Tennis conditioning' },
    { name: 'Boxing Training', description: 'Boxing and striking' },
    { name: 'MMA Training', description: 'Mixed martial arts' },
    { name: 'Wrestling', description: 'Wrestling conditioning' },
    { name: 'Baseball Training', description: 'Baseball conditioning' },
    { name: 'Football Training', description: 'Football conditioning' },
    { name: 'Track & Field', description: 'Track and field training' },
    { name: 'Volleyball', description: 'Volleyball training' },

    // Flexibility & Mobility
    { name: 'Yoga', description: 'Yoga practice' },
    { name: 'Pilates', description: 'Pilates training' },
    { name: 'Static Stretching', description: 'Hold stretches' },
    { name: 'Dynamic Stretching', description: 'Active stretches' },
    { name: 'PNF Stretching', description: 'Proprioceptive neuromuscular facilitation' },
    { name: 'Foam Rolling', description: 'Self-myofascial release' },

    // Performance Training
    { name: 'Speed Training', description: 'Improve speed and quickness' },
    { name: 'Agility Training', description: 'Agility and coordination' },
    { name: 'Power Development', description: 'Explosive power' },
    { name: 'Endurance Training', description: 'Build stamina' },
    { name: 'Balance Training', description: 'Balance and stability' },
    { name: 'Coordination Drills', description: 'Movement coordination' },
    { name: 'Reaction Training', description: 'Reaction time improvement' },

    // Recovery & Health
    { name: 'Active Recovery', description: 'Light movement recovery' },
    { name: 'Stretching & Cool Down', description: 'Post-workout recovery' },
    { name: 'Regeneration', description: 'Tissue recovery' },
    { name: 'Prehab', description: 'Injury prevention' },
    { name: 'Rehab Exercises', description: 'Injury rehabilitation' },
    { name: 'Corrective Exercise', description: 'Movement correction' },
    { name: 'Postural Training', description: 'Posture improvement' },

    // Special Populations
    { name: 'Beginner Training', description: 'Exercises for beginners' },
    { name: 'Senior Fitness', description: 'Senior-friendly exercises' },
    { name: 'Prenatal Fitness', description: 'Pregnancy-safe exercises' },
    { name: 'Postnatal Fitness', description: 'Post-pregnancy recovery' },
    { name: 'Youth Training', description: 'Exercises for youth' },

    // Specific Goals
    { name: 'Fat Loss', description: 'Fat burning exercises' },
    { name: 'Muscle Building', description: 'Hypertrophy training' },
    { name: 'Athletic Performance', description: 'Sport performance enhancement' },
    { name: 'General Fitness', description: 'Overall fitness improvement' },
    { name: 'Body Composition', description: 'Body recomposition' },
];

const seedCategories = async () => {
    try {
        console.log('🌱 Seeding COMPREHENSIVE fitness categories...\n');
        console.log(`Total categories to create: ${comprehensiveFitnessCategories.length}\n`);

        // Get admin user
        const [users] = await sequelize.query(
            "SELECT id FROM users WHERE role = 'admin' LIMIT 1"
        );

        const createdById = users.length > 0 ? users[0].id : 1;
        console.log(`Using user ID ${createdById} for createdBy\n`);

        let count = 0;

        for (const cat of comprehensiveFitnessCategories) {
            const slug = cat.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

            try {
                await sequelize.query(
                    `INSERT INTO categories (name, slug, description, createdBy, createdAt, updatedAt)
           VALUES (?, ?, ?, ?, NOW(), NOW())`,
                    {
                        replacements: [cat.name, slug, cat.description, createdById]
                    }
                );

                count++;
                if (count % 10 === 0) {
                    console.log(`✓ Created ${count} categories...`);
                }
            } catch (error) {
                if (error.message && error.message.includes('Duplicate')) {
                    console.log(`  ⊘ Skipped (duplicate): ${cat.name}`);
                } else {
                    throw error;
                }
            }
        }

        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('✅ SUCCESS! Categories seeded');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`📁 Total categories created: ${count}`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    } catch (error) {
        console.error('❌ Error seeding categories:', error);
        throw error;
    }
};

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
