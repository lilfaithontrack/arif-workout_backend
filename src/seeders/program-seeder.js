/**
 * Program Seeder
 * Seeds sample program data matching the screenshots
 * 
 * Run with: node src/seeders/program-seeder.js
 */

require('dotenv').config();
const { sequelize } = require('../config/database');
const { Program, ProgramWorkout, WorkoutExercise, Exercise, Category, User, Op } = require('../models');

async function seedPrograms() {
  try {
    await sequelize.authenticate();
    console.log('Database connected');

    // Get or create category for programs
    let stabilizationCategory = await Category.findOne({ where: { name: 'Stabilization Endurance' } });
    let fitnessCategory = await Category.findOne({ where: { name: 'General Fitness' } });
    let muscleCategory = await Category.findOne({ where: { name: 'Muscle Gain' } });

    // Get first admin user for createdBy
    const adminUser = await User.findOne({
      where: { roles: { [Op.like]: '%admin%' } }
    });
    const createdBy = adminUser ? adminUser.id : 1;

    // Create categories if they don't exist
    if (!stabilizationCategory) {
      stabilizationCategory = await Category.create({
        name: 'Stabilization Endurance',
        slug: 'stabilization-endurance',
        description: 'Programs focused on core stability and endurance',
        createdBy: createdBy
      });
    }

    if (!fitnessCategory) {
      fitnessCategory = await Category.create({
        name: 'General Fitness',
        slug: 'general-fitness',
        description: 'Overall fitness improvement programs',
        createdBy: createdBy
      });
    }

    if (!muscleCategory) {
      muscleCategory = await Category.create({
        name: 'Muscle Gain',
        slug: 'muscle-gain',
        description: 'Programs focused on building muscle mass',
        createdBy: createdBy
      });
    }

    console.log('Categories ready');

    // Get exercises for SMR (Self-Myofascial Release)
    const exercises = await Exercise.findAll({ limit: 20 });
    if (exercises.length === 0) {
      console.log('Warning: No exercises found in database. Please seed exercises first.');
      console.log('Skipping workout exercise assignments.');
    }

    // ==========================================
    // Program 1: Bodyweight Stabilization Training
    // ==========================================
    const prog1 = await Program.findOrCreate({
      where: { slug: 'bodyweight-stabilization-training' },
      defaults: {
        name: 'Bodyweight Stabilization Training',
        slug: 'bodyweight-stabilization-training',
        description: 'A comprehensive program to build core stability and endurance using bodyweight exercises',
        categoryId: stabilizationCategory.id,
        categoryName: 'Stabilization Endurance',
        level: 'beginner',
        goal: 'stabilization',
        durationWeeks: 4,
        workoutsCount: 3,
        tags: ['bodyweight', 'stabilization', 'core', 'beginner'],
        equipment: ['foam_roller', 'exercise_mat'],
        orderIndex: 1
      }
    });

    if (prog1[1]) { // If created (not found)
      console.log('Created: Bodyweight Stabilization Training');
      
      // Create workouts for this program
      const workouts1 = await ProgramWorkout.bulkCreate([
        {
          programId: prog1[0].id,
          name: 'Bodyweight Beginner Level 1',
          description: 'Foundation workout with 18 exercises',
          level: 'beginner',
          weekNumber: 1,
          dayNumber: 1,
          durationMinutes: 29,
          exercisesCount: 18,
          focusArea: 'Full Body',
          orderIndex: 0
        },
        {
          programId: prog1[0].id,
          name: 'Bodyweight Beginner Level 2',
          description: 'Progressive workout with increased intensity',
          level: 'beginner',
          weekNumber: 2,
          dayNumber: 1,
          durationMinutes: 35,
          exercisesCount: 18,
          focusArea: 'Full Body',
          orderIndex: 1
        },
        {
          programId: prog1[0].id,
          name: 'Bodyweight Beginner Level 3',
          description: 'Advanced beginner workout',
          level: 'beginner',
          weekNumber: 3,
          dayNumber: 1,
          durationMinutes: 28,
          exercisesCount: 17,
          focusArea: 'Full Body',
          orderIndex: 2
        }
      ]);

      console.log(`Created ${workouts1.length} workouts for Bodyweight Stabilization Training`);

      // Add exercises to first workout if exercises exist
      if (exercises.length > 0 && workouts1.length > 0) {
        const warmUpExercises = [
          { name: 'SMR Calves', section: 'warm_up', sectionName: 'Warm-Up', repsDisplay: 'N/A reps' },
          { name: 'SMR Lateral Thigh', section: 'warm_up', sectionName: 'Warm-Up', repsDisplay: 'N/A reps' },
          { name: 'SMR Latissimus Dorsi', section: 'warm_up', sectionName: 'Warm-Up', repsDisplay: 'N/A reps' },
          { name: 'SMR Tensor Fascia Latae', section: 'warm_up', sectionName: 'Warm-Up', repsDisplay: 'N/A reps' },
          { name: 'SMR Thoracic Spine', section: 'warm_up', sectionName: 'Warm-Up', repsDisplay: 'N/A reps' }
        ];

        for (let i = 0; i < warmUpExercises.length && i < exercises.length; i++) {
          await WorkoutExercise.create({
            programWorkoutId: workouts1[0].id,
            exerciseId: exercises[i].id,
            section: warmUpExercises[i].section,
            sectionName: warmUpExercises[i].sectionName,
            orderIndex: i,
            sets: 1,
            repsDisplay: warmUpExercises[i].repsDisplay,
            tempo: 'Slow',
            restSeconds: 0
          });
        }
        console.log(`Added exercises to Level 1 workout`);
      }
    }

    // ==========================================
    // Program 2: Bodyweight Strength Training
    // ==========================================
    const prog2 = await Program.findOrCreate({
      where: { slug: 'bodyweight-strength-training' },
      defaults: {
        name: 'Bodyweight Strength Training',
        slug: 'bodyweight-strength-training',
        description: 'Build strength using only bodyweight exercises',
        categoryId: fitnessCategory.id,
        categoryName: 'General Fitness',
        level: 'intermediate',
        goal: 'strength',
        durationWeeks: 6,
        workoutsCount: 3,
        tags: ['bodyweight', 'strength', 'no-equipment'],
        equipment: [],
        orderIndex: 2
      }
    });

    if (prog2[1]) {
      console.log('Created: Bodyweight Strength Training');
      
      await ProgramWorkout.bulkCreate([
        {
          programId: prog2[0].id,
          name: 'Strength Foundation 1',
          description: 'Build foundational strength',
          level: 'intermediate',
          durationMinutes: 45,
          exercisesCount: 12,
          focusArea: 'Upper Body',
          orderIndex: 0
        },
        {
          programId: prog2[0].id,
          name: 'Strength Foundation 2',
          description: 'Progressive strength building',
          level: 'intermediate',
          durationMinutes: 50,
          exercisesCount: 14,
          focusArea: 'Lower Body',
          orderIndex: 1
        },
        {
          programId: prog2[0].id,
          name: 'Strength Foundation 3',
          description: 'Full body strength challenge',
          level: 'intermediate',
          durationMinutes: 55,
          exercisesCount: 16,
          focusArea: 'Full Body',
          orderIndex: 2
        }
      ]);
      console.log(`Created 3 workouts for Bodyweight Strength Training`);
    }

    // ==========================================
    // Program 3: Foundational Strength Progression Series
    // ==========================================
    const progressionLevels = [
      { name: 'Foundational Strength: Progression 1', slug: 'foundational-strength-progression-1', order: 3 },
      { name: 'Foundational Strength: Progression 2', slug: 'foundational-strength-progression-2', order: 4 },
      { name: 'Foundational Strength: Progression 3', slug: 'foundational-strength-progression-3', order: 5 }
    ];

    for (const level of progressionLevels) {
      const prog = await Program.findOrCreate({
        where: { slug: level.slug },
        defaults: {
          name: level.name,
          slug: level.slug,
          description: `${level.name} - build strength progressively`,
          categoryId: level.order === 5 ? muscleCategory.id : stabilizationCategory.id,
          categoryName: level.order === 5 ? 'Muscle Gain' : 'Stabilization Endurance',
          level: level.order === 3 ? 'beginner' : level.order === 4 ? 'intermediate' : 'advanced',
          goal: level.order === 5 ? 'muscle_gain' : 'stabilization',
          durationWeeks: 4,
          workoutsCount: 2,
          tags: ['strength', 'progression'],
          orderIndex: level.order
        }
      });

      if (prog[1]) {
        console.log(`Created: ${level.name}`);
        
        await ProgramWorkout.bulkCreate([
          {
            programId: prog[0].id,
            name: `${level.name} - Phase 1`,
            description: 'Phase 1 of progressive strength training',
            durationMinutes: 40,
            exercisesCount: 2,
            focusArea: 'Strength',
            orderIndex: 0
          },
          {
            programId: prog[0].id,
            name: `${level.name} - Phase 2`,
            description: 'Phase 2 of progressive strength training',
            durationMinutes: 45,
            exercisesCount: 2,
            focusArea: 'Strength',
            orderIndex: 1
          }
        ]);
      }
    }

    // ==========================================
    // Program 4: Foundational Total Body Circuit
    // ==========================================
    const circuitLevels = [
      { name: 'Foundational Total Body Circuit: Progression 1', slug: 'foundational-total-body-circuit-1', order: 6 },
      { name: 'Foundational Total Body Circuit: Progression 2', slug: 'foundational-total-body-circuit-2', order: 7 }
    ];

    for (const level of circuitLevels) {
      const prog = await Program.findOrCreate({
        where: { slug: level.slug },
        defaults: {
          name: level.name,
          slug: level.slug,
          description: `${level.name} - full body circuit training`,
          categoryId: stabilizationCategory.id,
          categoryName: 'Stabilization Endurance',
          level: 'beginner',
          goal: 'endurance',
          durationWeeks: 4,
          workoutsCount: 2,
          tags: ['circuit', 'endurance', 'full-body'],
          orderIndex: level.order
        }
      });

      if (prog[1]) {
        console.log(`Created: ${level.name}`);
        
        await ProgramWorkout.bulkCreate([
          {
            programId: prog[0].id,
            name: `${level.name} - Workout A`,
            description: 'Circuit workout A',
            durationMinutes: 30,
            exercisesCount: 2,
            focusArea: 'Full Body',
            orderIndex: 0
          },
          {
            programId: prog[0].id,
            name: `${level.name} - Workout B`,
            description: 'Circuit workout B',
            durationMinutes: 30,
            exercisesCount: 2,
            focusArea: 'Full Body',
            orderIndex: 1
          }
        ]);
      }
    }

    console.log('\n✅ Program seeding completed successfully!');
    console.log('\nPrograms created:');
    const programs = await Program.findAll();
    programs.forEach(p => {
      console.log(`  - ${p.name} (${p.categoryName}) - ${p.workoutsCount} workouts`);
    });

    await sequelize.close();
    process.exit(0);

  } catch (error) {
    console.error('Seeding failed:', error);
    await sequelize.close();
    process.exit(1);
  }
}

// Run seeder
seedPrograms();
