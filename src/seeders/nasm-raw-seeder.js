/**
 * NASM Raw SQL Seeder
 * Uses direct SQL queries to match database schema
 */

require('dotenv').config();
const { sequelize } = require('../config/database');

async function seedNASM() {
  console.log('\n' + '='.repeat(60));
  console.log('🚀 NASM Raw SQL Seeder');
  console.log('='.repeat(60));

  try {
    await sequelize.authenticate();
    console.log('Database connected\n');

    // 1. Insert workout sections if empty
    const [sectionCount] = await sequelize.query('SELECT COUNT(*) as count FROM workout_sections');
    if (sectionCount[0].count === 0) {
      console.log('Inserting workout sections...');
      await sequelize.query(`
        INSERT INTO workout_sections (id, name, slug, description, ordinal, color, is_active, is_hidden) VALUES
        (UUID(), 'Warm-Up', 'warm_up', 'Self-myofascial release and stretching', 0, '#FF6B6B', 1, 0),
        (UUID(), 'Core / Balance / Plyometric', 'core_balance_plyometric', 'Core stabilization and plyometric exercises', 1, '#4ECDC4', 1, 0),
        (UUID(), 'Speed / Agility / Quickness', 'speed_agility_quickness', 'SAQ training', 2, '#45B7D1', 1, 0),
        (UUID(), 'Resistance', 'resistance', 'Strength training', 3, '#96CEB4', 1, 0),
        (UUID(), 'Cool-Down', 'cool_down', 'Static stretching', 4, '#FFEAA7', 1, 0),
        (UUID(), 'Recovery', 'recovery', 'Active recovery', 5, '#DDA0DD', 1, 0)
      `);
      console.log('  ✅ 6 sections inserted');
    } else {
      console.log(`  ✅ ${sectionCount[0].count} sections already exist`);
    }

    // 2. Insert NASM programs
    console.log('\n📚 Creating NASM programs...');
    
    const programs = [
      ['Stabilization Endurance', 'stabilization-endurance', 'NASM OPT Phase 1: Focus on muscular endurance, stability, and neuromuscular efficiency.', 'stabilization', 'beginner', 'stabilization_endurance', 1, 4, 1, 1],
      ['Strength Endurance', 'strength-endurance', 'NASM OPT Phase 2: Enhance muscular endurance and stability while increasing strength.', 'strength', 'intermediate', 'strength_endurance', 2, 4, 1, 1],
      ['Muscular Development', 'muscular-development', 'NASM OPT Phase 3: Focus on hypertrophy and maximal muscle growth.', 'muscle_gain', 'intermediate', 'muscular_development', 3, 4, 0, 0],
      ['Maximal Strength', 'maximal-strength', 'NASM OPT Phase 4: Develop maximal strength with high intensity.', 'strength', 'advanced', 'maximal_strength', 4, 4, 0, 0],
      ['Power', 'power', 'NASM OPT Phase 5: Enhance power production and athletic performance.', 'strength', 'advanced', 'power', 5, 4, 0, 0]
    ];

    for (const [name, slug, desc, goal, level, optPhase, optNum, weeks, hasAssess, assessReq] of programs) {
      const [existing] = await sequelize.query(
        `SELECT id FROM programs WHERE slug = '${slug}'`
      );
      
      if (existing.length === 0) {
        await sequelize.query(`
          INSERT INTO programs 
          (name, slug, description, category_name, level, goal, duration_weeks, workouts_count, opt_phase, opt_phase_number, has_assessments, assessment_required, is_active, order_index, created_at, updated_at)
          VALUES 
          ('${name}', '${slug}', '${desc}', '${goal}', '${level}', '${goal}', ${weeks}, 0, '${optPhase}', ${optNum}, ${hasAssess}, ${assessReq}, 1, ${optNum}, NOW(), NOW())
        `);
        console.log(`  ✅ Created: ${name}`);
      } else {
        console.log(`  ⚠️ Exists: ${name}`);
      }
    }

    // 3. Create workouts for each program
    console.log('\n💪 Creating workouts...');
    
    const [progRows] = await sequelize.query('SELECT id, name, opt_phase, level FROM programs WHERE opt_phase IS NOT NULL');
    
    for (const prog of progRows) {
      for (let w = 0; w < 3; w++) {
        const workoutName = w === 0 
          ? `${prog.name} - Assessment` 
          : `${prog.name} - Workout ${w}`;
        
        const [existing] = await sequelize.query(
          `SELECT id FROM program_workouts WHERE program_id = ${prog.id} AND name = '${workoutName}'`
        );
        
        if (existing.length === 0) {
          await sequelize.query(`
            INSERT INTO program_workouts 
            (program_id, name, description, level, week_number, day_number, duration_minutes, focus_area, phase, phase_number, is_assessment, order_index, is_active, created_at, updated_at)
            VALUES 
            (${prog.id}, '${workoutName}', 'Sample workout', '${prog.level}', ${w + 1}, 1, 45, 'Full Body', '${prog.opt_phase}', ${w + 1}, ${w === 0 ? 1 : 0}, ${w}, 1, NOW(), NOW())
          `);
          console.log(`    ✅ ${workoutName}`);
        }
      }
    }

    // 4. Create sample exercises
    console.log('\n🏋️ Creating sample exercises...');
    
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
      ['Child\'s Pose', 'childs-pose', 'flexibility']
    ];

    for (const [name, slug, category] of exercises) {
      const [existing] = await sequelize.query(`SELECT id FROM exercises WHERE slug = '${slug}'`);
      if (existing.length === 0) {
        await sequelize.query(`
          INSERT INTO exercises (name, slug, category, difficulty, is_active, created_at, updated_at)
          VALUES ('${name}', '${slug}', '${category}', 'beginner', 1, NOW(), NOW())
        `);
      }
    }

    // 5. Link exercises to workouts
    console.log('\n🔗 Linking exercises to workouts...');
    
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
        
        const [existing] = await sequelize.query(
          `SELECT id FROM workout_exercises WHERE program_workout_id = ${workout.id} AND exercise_id = ${exercise.id}`
        );
        
        if (existing.length === 0) {
          const sets = section === 'warm_up' || section === 'cool_down' ? 1 : 3;
          const reps = section === 'warm_up' || section === 'cool_down' ? null : 10;
          const repsDisplay = section === 'warm_up' || section === 'cool_down' ? 'N/A' : '10 reps';
          
          await sequelize.query(`
            INSERT INTO workout_exercises 
            (program_workout_id, exercise_id, section, section_name, order_index, sets, reps, reps_display, rest_seconds, tempo, is_active, created_at, updated_at)
            VALUES 
            (${workout.id}, ${exercise.id}, '${section}', '${sectionName}', ${idx}, ${sets}, ${reps}, '${repsDisplay}', 60, 'Medium', 1, NOW(), NOW())
          `);
        }
        idx++;
      }
      
      // Update exercise count
      await sequelize.query(
        `UPDATE program_workouts SET exercises_count = ${exerciseRows.length} WHERE id = ${workout.id}`
      );
      
      console.log(`    ✅ ${workout.name}: ${exerciseRows.length} exercises`);
    }

    // 6. Update program workout counts
    for (const prog of progRows) {
      const [count] = await sequelize.query(
        `SELECT COUNT(*) as cnt FROM program_workouts WHERE program_id = ${prog.id}`
      );
      await sequelize.query(
        `UPDATE programs SET workouts_count = ${count[0].cnt} WHERE id = ${prog.id}`
      );
    }

    console.log('\n' + '='.repeat(60));
    console.log('✅ NASM Seeding Complete!');
    console.log('='.repeat(60));
    console.log(`Programs: ${progRows.length}`);
    console.log(`Workouts: ${workoutRows.length}`);
    console.log(`Exercises: ${exerciseRows.length}`);
    console.log('='.repeat(60) + '\n');

  } catch (error) {
    console.error('\n❌ Seeding failed:', error);
    throw error;
  }
}

async function main() {
  try {
    await seedNASM();
    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('Fatal error:', error);
    await sequelize.close();
    process.exit(1);
  }
}

main();
