/**
 * NASM Seeder - Final version with correct column names
 */

require('dotenv').config();
const { sequelize } = require('../config/database');

async function seedNASM() {
  console.log('\n' + '='.repeat(60));
  console.log('🚀 NASM Seeder');
  console.log('='.repeat(60));

  try {
    await sequelize.authenticate();
    console.log('Database connected\n');

    // 1. Insert workout sections
    const [sectionCount] = await sequelize.query('SELECT COUNT(*) as count FROM workout_sections');
    if (sectionCount[0].count === 0) {
      await sequelize.query(`
        INSERT INTO workout_sections (id, name, slug, description, ordinal, color, is_active, is_hidden) VALUES
        (UUID(), 'Warm-Up', 'warm_up', 'Self-myofascial release and stretching', 0, '#FF6B6B', 1, 0),
        (UUID(), 'Core / Balance / Plyometric', 'core_balance_plyometric', 'Core stabilization and plyometric', 1, '#4ECDC4', 1, 0),
        (UUID(), 'Speed / Agility / Quickness', 'speed_agility_quickness', 'SAQ training', 2, '#45B7D1', 1, 0),
        (UUID(), 'Resistance', 'resistance', 'Strength training', 3, '#96CEB4', 1, 0),
        (UUID(), 'Cool-Down', 'cool_down', 'Static stretching', 4, '#FFEAA7', 1, 0),
        (UUID(), 'Recovery', 'recovery', 'Active recovery', 5, '#DDA0DD', 1, 0)
      `);
      console.log('✅ 6 workout sections inserted');
    }

    // 2. Insert NASM programs (using camelCase columns)
    console.log('\n📚 Creating NASM programs...');
    
    const programs = [
      ['Stabilization Endurance', 'stabilization-endurance', 'NASM OPT Phase 1', 'stabilization', 'beginner', 'stabilization_endurance', 1],
      ['Strength Endurance', 'strength-endurance', 'NASM OPT Phase 2', 'strength', 'intermediate', 'strength_endurance', 2],
      ['Muscular Development', 'muscular-development', 'NASM OPT Phase 3', 'muscle_gain', 'intermediate', 'muscular_development', 3],
      ['Maximal Strength', 'maximal-strength', 'NASM OPT Phase 4', 'strength', 'advanced', 'maximal_strength', 4],
      ['Power', 'power', 'NASM OPT Phase 5', 'strength', 'advanced', 'power', 5]
    ];

    for (const [name, slug, desc, goal, level, optPhase, optNum] of programs) {
      const [existing] = await sequelize.query(`SELECT id FROM programs WHERE slug = '${slug}'`);
      
      if (existing.length === 0) {
        await sequelize.query(`
          INSERT INTO programs 
          (name, slug, description, categoryName, level, goal, durationWeeks, optPhase, optPhaseNumber, hasAssessments, assessmentRequired, isActive, orderIndex, createdAt, updatedAt)
          VALUES 
          ('${name}', '${slug}', '${desc}', '${goal}', '${level}', '${goal}', 4, '${optPhase}', ${optNum}, ${optNum <= 2 ? 1 : 0}, ${optNum <= 2 ? 1 : 0}, 1, ${optNum}, NOW(), NOW())
        `);
        console.log(`  ✅ ${name}`);
      } else {
        console.log(`  ⚠️ ${name} exists`);
      }
    }

    // 3. Create workouts
    console.log('\n💪 Creating workouts...');
    const [progRows] = await sequelize.query('SELECT id, name, optPhase, level FROM programs WHERE optPhase IS NOT NULL');
    
    for (const prog of progRows) {
      for (let w = 0; w < 3; w++) {
        const workoutName = w === 0 ? `${prog.name} - Assessment` : `${prog.name} - Workout ${w}`;
        const [existing] = await sequelize.query(`SELECT id FROM program_workouts WHERE programId = ${prog.id} AND name = '${workoutName}'`);
        
        if (existing.length === 0) {
          await sequelize.query(`
            INSERT INTO program_workouts 
            (programId, name, description, level, weekNumber, dayNumber, durationMinutes, focusArea, phase, phase_number, is_assessment, orderIndex, isActive, createdAt, updatedAt)
            VALUES 
            (${prog.id}, '${workoutName}', 'Sample workout', '${prog.level}', ${w + 1}, 1, 45, 'Full Body', '${prog.optPhase}', ${w + 1}, ${w === 0 ? 1 : 0}, ${w}, 1, NOW(), NOW())
          `);
          console.log(`    ✅ ${workoutName}`);
        }
      }
    }

    // 4. Create exercises
    console.log('\n🏋️ Creating exercises...');
    const exercises = [
      ['SMR Calves', 'smr-calves', 'flexibility'],
      ['SMR Thoracic Spine', 'smr-thoracic-spine', 'flexibility'],
      ['Static Stretch Hip Flexors', 'static-stretch-hip-flexors', 'flexibility'],
      ['Floor Bridge', 'floor-bridge', 'strength'],
      ['Plank', 'plank', 'strength'],
      ['Push-Up', 'push-up', 'strength'],
      ['Squat to Row', 'squat-to-row', 'strength'],
      ['Single-Leg RDL', 'single-leg-rdl', 'strength'],
      ['Standing Calf Stretch', 'standing-calf-stretch', 'flexibility'],
      ['Childs Pose', 'childs-pose', 'flexibility']
    ];

    for (const [name, slug, category] of exercises) {
      const [existing] = await sequelize.query(`SELECT id FROM exercises WHERE slug = '${slug}'`);
      if (existing.length === 0) {
        await sequelize.query(`INSERT INTO exercises (name, slug, category, difficulty, isActive, createdAt, updatedAt) VALUES ('${name}', '${slug}', '${category}', 'beginner', 1, NOW(), NOW())`);
      }
    }

    // 5. Link exercises to workouts
    console.log('\n🔗 Linking exercises...');
    const [workoutRows] = await sequelize.query('SELECT id, name FROM program_workouts');
    const [exerciseRows] = await sequelize.query('SELECT id, slug FROM exercises');
    
    const sectionMap = {
      'smr-calves': 'warm_up',
      'smr-thoracic-spine': 'warm_up',
      'static-stretch-hip-flexors': 'warm_up',
      'floor-bridge': 'core_balance_plyometric',
      'plank': 'core_balance_plyometric',
      'push-up': 'resistance',
      'squat-to-row': 'resistance',
      'single-leg-rdl': 'resistance',
      'standing-calf-stretch': 'cool_down',
      'childs-pose': 'cool_down'
    };

    const sectionNames = {
      'warm_up': 'Warm-Up',
      'core_balance_plyometric': 'Core / Balance / Plyometric',
      'resistance': 'Resistance',
      'cool_down': 'Cool-Down'
    };

    for (const workout of workoutRows) {
      let idx = 0;
      for (const exercise of exerciseRows) {
        const section = sectionMap[exercise.slug] || 'main';
        const sectionName = sectionNames[section] || section;
        
        const [existing] = await sequelize.query(`SELECT id FROM workout_exercises WHERE programWorkoutId = ${workout.id} AND exerciseId = ${exercise.id}`);
        
        if (existing.length === 0) {
          const sets = (section === 'warm_up' || section === 'cool_down') ? 1 : 3;
          const reps = (section === 'warm_up' || section === 'cool_down') ? null : 10;
          const repsDisplay = (section === 'warm_up' || section === 'cool_down') ? 'N/A' : '10 reps';
          
          await sequelize.query(`
            INSERT INTO workout_exercises 
            (programWorkoutId, exerciseId, section, sectionName, orderIndex, sets, reps, repsDisplay, restSeconds, tempo, isActive, createdAt, updatedAt)
            VALUES 
            (${workout.id}, ${exercise.id}, '${section}', '${sectionName}', ${idx}, ${sets}, ${reps || 'NULL'}, '${repsDisplay}', 60, 'Medium', 1, NOW(), NOW())
          `);
        }
        idx++;
      }
      
      await sequelize.query(`UPDATE program_workouts SET exercisesCount = ${exerciseRows.length} WHERE id = ${workout.id}`);
      console.log(`    ✅ ${workout.name}: ${exerciseRows.length} exercises`);
    }

    // 6. Update program workout counts
    for (const prog of progRows) {
      const [count] = await sequelize.query(`SELECT COUNT(*) as cnt FROM program_workouts WHERE programId = ${prog.id}`);
      await sequelize.query(`UPDATE programs SET workoutsCount = ${count[0].cnt} WHERE id = ${prog.id}`);
    }

    console.log('\n' + '='.repeat(60));
    console.log('✅ NASM Seeding Complete!');
    console.log('='.repeat(60));
    console.log(`Programs: ${progRows.length}`);
    console.log(`Workouts: ${workoutRows.length}`);
    console.log(`Exercises: ${exerciseRows.length}`);
    console.log('='.repeat(60));

  } catch (error) {
    console.error('\n❌ Error:', error);
    throw error;
  }
}

async function main() {
  try {
    await seedNASM();
    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('Fatal:', error);
    await sequelize.close();
    process.exit(1);
  }
}

main();
