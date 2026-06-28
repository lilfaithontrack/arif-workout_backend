/**
 * Migration: Update database to NASM structure
 * - Creates workout_sections table
 * - Adds NASM fields to programs and program_workouts
 * - Updates workout_exercises section ENUM
 */

const { sequelize } = require('../config/database');
const { QueryTypes } = require('sequelize');

async function up() {
  console.log('Updating database to NASM structure...\n');

  try {
    // 1. Create workout_sections table
    console.log('Creating workout_sections table...');
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS workout_sections (
        id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
        name VARCHAR(100) NOT NULL,
        slug VARCHAR(100) NOT NULL UNIQUE,
        description TEXT,
        ordinal INT DEFAULT 0,
        color VARCHAR(20),
        is_active TINYINT(1) DEFAULT 1,
        is_hidden TINYINT(1) DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_ordinal (ordinal),
        INDEX idx_active (is_active)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
    console.log('  ✅ workout_sections table created');

    // 2. Insert NASM sections
    console.log('Inserting NASM workout sections...');
    await sequelize.query(`
      INSERT INTO workout_sections (id, name, slug, description, ordinal, color, is_active) VALUES
      (UUID(), 'Warm-Up', 'warm_up', 'Self-myofascial release and stretching to prepare the body', 0, '#FF6B6B', 1),
      (UUID(), 'Core / Balance / Plyometric', 'core_balance_plyometric', 'Core stabilization, balance training, and plyometric exercises', 1, '#4ECDC4', 1),
      (UUID(), 'Speed / Agility / Quickness', 'speed_agility_quickness', 'SAQ training for athletic performance', 2, '#45B7D1', 1),
      (UUID(), 'Resistance', 'resistance', 'Strength training with resistance exercises', 3, '#96CEB4', 1),
      (UUID(), 'Cool-Down', 'cool_down', 'Static stretching and recovery exercises', 4, '#FFEAA7', 1),
      (UUID(), 'Recovery', 'recovery', 'Active recovery and regeneration techniques', 5, '#DDA0DD', 1)
      ON DUPLICATE KEY UPDATE name = name;
    `);
    console.log('  ✅ NASM sections inserted');

    // 3. Add NASM fields to programs table
    console.log('Adding NASM fields to programs table...');
    const programColumns = [
      "ALTER TABLE programs ADD COLUMN opt_phase ENUM('stabilization_endurance', 'strength_endurance', 'muscular_development', 'maximal_strength', 'power') NULL AFTER order_index",
      "ALTER TABLE programs ADD COLUMN opt_phase_number INT NULL AFTER opt_phase",
      "ALTER TABLE programs ADD COLUMN assessment_required TINYINT(1) DEFAULT 0 AFTER opt_phase_number",
      "ALTER TABLE programs ADD COLUMN has_assessments TINYINT(1) DEFAULT 0 AFTER assessment_required",
      "ALTER TABLE programs ADD COLUMN progression_type ENUM('linear', 'undulating', 'block', 'conjugate') DEFAULT 'linear' AFTER has_assessments"
    ];

    for (const sql of programColumns) {
      try {
        await sequelize.query(sql);
      } catch (e) {
        if (!e.message.includes('Duplicate')) {
          console.log(`  ⚠️ ${e.message}`);
        }
      }
    }
    console.log('  ✅ NASM fields added to programs');

    // 4. Add NASM fields to program_workouts table
    console.log('Adding NASM fields to program_workouts table...');
    const workoutColumns = [
      "ALTER TABLE program_workouts ADD COLUMN phase ENUM('stabilization_endurance', 'strength_endurance', 'muscular_development', 'maximal_strength', 'power') NULL AFTER instructions",
      "ALTER TABLE program_workouts ADD COLUMN phase_number INT NULL AFTER phase",
      "ALTER TABLE program_workouts ADD COLUMN is_assessment TINYINT(1) DEFAULT 0 AFTER phase_number",
      "ALTER TABLE program_workouts ADD COLUMN assessment_type VARCHAR(100) NULL AFTER is_assessment"
    ];

    for (const sql of workoutColumns) {
      try {
        await sequelize.query(sql);
      } catch (e) {
        if (!e.message.includes('Duplicate')) {
          console.log(`  ⚠️ ${e.message}`);
        }
      }
    }
    console.log('  ✅ NASM fields added to program_workouts');

    // 5. Update workout_exercises section column if needed
    console.log('Checking workout_exercises section column...');
    try {
      const [results] = await sequelize.query(`
        SELECT COLUMN_TYPE 
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_NAME = 'workout_exercises' 
        AND COLUMN_NAME = 'section'
        AND TABLE_SCHEMA = DATABASE()
      `, { type: QueryTypes.SELECT });

      if (results && results.length > 0) {
        const currentType = results[0].COLUMN_TYPE;
        if (currentType && !currentType.includes('core_balance_plyometric')) {
          console.log('  Updating section ENUM to include NASM sections...');
          await sequelize.query(`
            ALTER TABLE workout_exercises 
            MODIFY COLUMN section ENUM(
              'warm_up', 
              'core_balance_plyometric', 
              'speed_agility_quickness', 
              'resistance', 
              'cool_down', 
              'recovery',
              'main'
            ) DEFAULT 'main' NOT NULL
          `);
          console.log('  ✅ Section ENUM updated');
        } else {
          console.log('  ✅ Section ENUM already up to date');
        }
      }
    } catch (e) {
      console.log(`  ⚠️ ${e.message}`);
    }

    console.log('\n' + '='.repeat(60));
    console.log('✅ Migration completed successfully!');
    console.log('='.repeat(60));

  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    throw error;
  }
}

async function down() {
  console.log('Rolling back NASM structure changes...\n');

  try {
    // Remove NASM fields from programs
    await sequelize.query('ALTER TABLE programs DROP COLUMN IF EXISTS opt_phase');
    await sequelize.query('ALTER TABLE programs DROP COLUMN IF EXISTS opt_phase_number');
    await sequelize.query('ALTER TABLE programs DROP COLUMN IF EXISTS assessment_required');
    await sequelize.query('ALTER TABLE programs DROP COLUMN IF EXISTS has_assessments');
    await sequelize.query('ALTER TABLE programs DROP COLUMN IF EXISTS progression_type');

    // Remove NASM fields from program_workouts
    await sequelize.query('ALTER TABLE program_workouts DROP COLUMN IF EXISTS phase');
    await sequelize.query('ALTER TABLE program_workouts DROP COLUMN IF EXISTS phase_number');
    await sequelize.query('ALTER TABLE program_workouts DROP COLUMN IF EXISTS is_assessment');
    await sequelize.query('ALTER TABLE program_workouts DROP COLUMN IF EXISTS assessment_type');

    // Drop workout_sections table
    await sequelize.query('DROP TABLE IF EXISTS workout_sections');

    console.log('✅ Rollback completed');

  } catch (error) {
    console.error('Rollback failed:', error.message);
    throw error;
  }
}

// Run migration
async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'up';

  try {
    await sequelize.authenticate();
    console.log('Database connected\n');

    if (command === 'up') {
      await up();
    } else if (command === 'down') {
      await down();
    } else {
      console.log('Usage: node update-nasm-structure.js [up|down]');
    }

    await sequelize.close();
    process.exit(0);

  } catch (error) {
    console.error('Fatal error:', error);
    await sequelize.close();
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { up, down };
