/**
 * NASM Structure Seeder
 * Seeds workout sections and sample programs with NASM OPT Model structure
 */

require('dotenv').config();
const { sequelize } = require('../config/database');
const { Program, ProgramWorkout, WorkoutExercise, Exercise, Category, WorkoutSection } = require('../models');

async function seedNASMStructure() {
  console.log('\n' + '='.repeat(60));
  console.log('🚀 NASM Structure Seeder');
  console.log('='.repeat(60));

  try {
    await sequelize.authenticate();
    console.log('Database connected\n');

    // 1. Verify workout sections exist (using raw SQL because column names differ)
    const [sections] = await sequelize.query('SELECT * FROM workout_sections');
    console.log(`✅ Found ${sections.length} workout sections`);

    // 2. Create NASM OPT Model Programs
    console.log('\n📚 Creating NASM OPT Model Programs...');

    const nasmPrograms = [
      {
        name: 'Stabilization Endurance',
        slug: 'stabilization-endurance',
        description: 'NASM OPT Phase 1: Focus on improving muscular endurance, stability, and neuromuscular efficiency.',
        categoryName: 'Stabilization',
        level: 'beginner',
        goal: 'stabilization',
        optPhase: 'stabilization_endurance',
        optPhaseNumber: 1,
        durationWeeks: 4,
        hasAssessments: true,
        assessmentRequired: true,
        progressionType: 'linear',
        tags: ['nasm', 'opt-model', 'beginner', 'stabilization'],
        equipment: ['foam roller', 'stability ball', 'resistance bands']
      },
      {
        name: 'Strength Endurance',
        slug: 'strength-endurance',
        description: 'NASM OPT Phase 2: Enhance muscular endurance and stability while increasing strength.',
        categoryName: 'Strength',
        level: 'intermediate',
        goal: 'strength',
        optPhase: 'strength_endurance',
        optPhaseNumber: 2,
        durationWeeks: 4,
        hasAssessments: true,
        assessmentRequired: true,
        progressionType: 'linear',
        tags: ['nasm', 'opt-model', 'intermediate', 'strength-endurance'],
        equipment: ['dumbbells', 'cable machines', 'stability ball']
      },
      {
        name: 'Muscular Development',
        slug: 'muscular-development',
        description: 'NASM OPT Phase 3: Focus on hypertrophy and maximal muscle growth.',
        categoryName: 'Muscle Gain',
        level: 'intermediate',
        goal: 'muscle_gain',
        optPhase: 'muscular_development',
        optPhaseNumber: 3,
        durationWeeks: 4,
        hasAssessments: false,
        assessmentRequired: false,
        progressionType: 'undulating',
        tags: ['nasm', 'opt-model', 'intermediate', 'hypertrophy'],
        equipment: ['barbells', 'dumbbells', 'machines', 'cables']
      },
      {
        name: 'Maximal Strength',
        slug: 'maximal-strength',
        description: 'NASM OPT Phase 4: Develop maximal strength with high intensity and lower volume.',
        categoryName: 'Strength',
        level: 'advanced',
        goal: 'strength',
        optPhase: 'maximal_strength',
        optPhaseNumber: 4,
        durationWeeks: 4,
        hasAssessments: false,
        assessmentRequired: false,
        progressionType: 'block',
        tags: ['nasm', 'opt-model', 'advanced', 'maximal-strength'],
        equipment: ['barbells', 'power rack', 'bench']
      },
      {
        name: 'Power',
        slug: 'power',
        description: 'NASM OPT Phase 5: Enhance power production and athletic performance.',
        categoryName: 'Power',
        level: 'advanced',
        goal: 'strength',
        optPhase: 'power',
        optPhaseNumber: 5,
        durationWeeks: 4,
        hasAssessments: false,
        assessmentRequired: false,
        progressionType: 'conjugate',
        tags: ['nasm', 'opt-model', 'advanced', 'power'],
        equipment: ['plyo boxes', 'medicine balls', 'olympic barbell']
      }
    ];

    const createdPrograms = [];
    for (const progData of nasmPrograms) {
      const [program, created] = await Program.findOrCreate({
        where: { slug: progData.slug },
        defaults: { ...progData, isActive: true }
      });
      
      if (created) {
        console.log(`  ✅ Created: ${program.name} (Phase ${program.optPhaseNumber})`);
        createdPrograms.push(program);
      } else {
        console.log(`  ⚠️ Already exists: ${program.name}`);
      }
    }

    // 3. Create sample workouts for each program
    console.log('\n💪 Creating sample workouts...');

    for (const program of createdPrograms) {
      const workoutCount = Math.min(3, program.workoutsCount || 3);
      
      for (let w = 0; w < workoutCount; w++) {
        const workoutName = w === 0 
          ? `${program.name} - Assessment` 
          : `${program.name} - Workout ${w}`;
        
        const [workout, created] = await ProgramWorkout.findOrCreate({
          where: { 
            programId: program.id,
            name: workoutName
          },
          defaults: {
            programId: program.id,
            name: workoutName,
            description: `Sample workout for ${program.name}`,
            level: program.level,
            weekNumber: w + 1,
            dayNumber: 1,
            durationMinutes: 45,
            focusArea: 'Full Body',
            phase: program.optPhase,
            phaseNumber: w + 1,
            isAssessment: w === 0,
            assessmentType: w === 0 ? 'Postural Assessment' : null,
            orderIndex: w,
            isActive: true
          }
        });

        if (created) {
          console.log(`    ✅ ${workout.name}`);
        }
      }
    }

    // 4. Create sample exercises for each workout
    console.log('\n🏋️ Creating sample exercises...');

    const sampleExercises = [
      { name: 'SMR - Calves', category: 'flexibility', section: 'warm_up', sets: 1, reps: null, repsDisplay: 'N/A' },
      { name: 'SMR - Thoracic Spine', category: 'flexibility', section: 'warm_up', sets: 1, reps: null, repsDisplay: 'N/A' },
      { name: 'Static Stretching - Hip Flexors', category: 'flexibility', section: 'warm_up', sets: 1, reps: null, repsDisplay: '30 sec hold' },
      { name: 'Floor Bridge', category: 'strength', section: 'core_balance_plyometric', sets: 2, reps: 12, repsDisplay: '12 reps' },
      { name: 'Plank', category: 'strength', section: 'core_balance_plyometric', sets: 2, reps: null, repsDisplay: '30 sec' },
      { name: 'Push-Up', category: 'strength', section: 'resistance', sets: 3, reps: 10, repsDisplay: '10 reps' },
      { name: 'Squat to Row', category: 'strength', section: 'resistance', sets: 3, reps: 12, repsDisplay: '12 reps' },
      { name: 'Single-Leg Romanian Deadlift', category: 'strength', section: 'resistance', sets: 3, reps: 10, repsDisplay: '10 reps' },
      { name: 'Standing Calf Stretch', category: 'flexibility', section: 'cool_down', sets: 1, reps: null, repsDisplay: '30 sec' },
      { name: 'Child\'s Pose', category: 'flexibility', section: 'cool_down', sets: 1, reps: null, repsDisplay: '30 sec' }
    ];

    // Get all workouts
    const allWorkouts = await ProgramWorkout.findAll();
    
    for (const workout of allWorkouts) {
      for (let i = 0; i < sampleExercises.length; i++) {
        const exData = sampleExercises[i];
        
        // Create exercise if not exists
        const [exercise] = await Exercise.findOrCreate({
          where: { slug: exData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') },
          defaults: {
            name: exData.name,
            slug: exData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            category: exData.category,
            difficulty: workout.level,
            isActive: true
          }
        });

        // Link to workout
        await WorkoutExercise.findOrCreate({
          where: {
            programWorkoutId: workout.id,
            exerciseId: exercise.id
          },
          defaults: {
            programWorkoutId: workout.id,
            exerciseId: exercise.id,
            section: exData.section,
            sectionName: exData.section.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            orderIndex: i,
            sets: exData.sets,
            reps: exData.reps,
            repsDisplay: exData.repsDisplay,
            restSeconds: 60,
            tempo: 'Medium',
            isActive: true
          }
        });
      }
      
      // Update workout exercises count
      const count = await WorkoutExercise.count({ where: { programWorkoutId: workout.id } });
      await workout.update({ exercisesCount: count });
      
      console.log(`    ✅ ${workout.name}: ${count} exercises`);
    }

    // 5. Update program workout counts
    for (const program of createdPrograms) {
      const count = await ProgramWorkout.count({ where: { programId: program.id } });
      await program.update({ workoutsCount: count });
    }

    console.log('\n' + '='.repeat(60));
    console.log('✅ NASM Structure Seeding Complete!');
    console.log('='.repeat(60));
    console.log(`Programs: ${createdPrograms.length}`);
    console.log(`Workouts: ${allWorkouts.length}`);
    console.log(`Exercises: ${sampleExercises.length}`);
    console.log('='.repeat(60) + '\n');

  } catch (error) {
    console.error('\n❌ Seeding failed:', error);
    throw error;
  }
}

// Run seeder
async function main() {
  try {
    await seedNASMStructure();
    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('Fatal error:', error);
    await sequelize.close();
    process.exit(1);
  }
}

main();
