/**
 * Delete all Categories, Exercises, and Workouts (program hierarchy) data.
 *
 * Deletion order respects foreign-key dependencies (children first):
 *   1. workout_exercises   (depends on program_workouts + exercises)
 *   2. user_programs       (depends on program_workouts + programs)
 *   3. program_workouts    (the "workouts")
 *   4. workout_sections    (lookup table for workout sections)
 *   5. programs            (depends on categories)
 *   6. user_workouts       (depends on exercises)
 *   7. exercise_images     (depends on exercises)
 *   8. exercises
 *   9. subcategories       (depends on categories)
 *  10. packages            (depends on categories)
 *  11. categories
 *
 * Usage:
 *   cd backend
 *   node src/scripts/delete-categories-exercises-workouts.js
 *
 * Add `--confirm` as an arg to skip the interactive confirmation prompt.
 */

const mysql = require('mysql2/promise');
require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });

const TABLES_IN_ORDER = [
  { table: 'workout_exercises', label: 'Workout Exercises (mapping)' },
  { table: 'user_programs',     label: 'User Program Enrollments' },
  { table: 'program_workouts',  label: 'Program Workouts (the "workouts")' },
  { table: 'workout_sections',  label: 'Workout Sections' },
  { table: 'programs',          label: 'Programs' },
  { table: 'user_workouts',     label: 'User Workouts (logs)' },
  { table: 'exercise_images',   label: 'Exercise Images' },
  { table: 'exercises',         label: 'Exercises' },
  { table: 'subcategories',     label: 'Subcategories' },
  { table: 'packages',          label: 'Packages (linked to categories)' },
  { table: 'categories',        label: 'Categories' },
];

async function prompt(question) {
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });
  return new Promise(resolve => readline.question(question, ans => {
    readline.close();
    resolve(ans.trim());
  }));
}

async function run() {
  const skipConfirm = process.argv.includes('--confirm');

  console.log('==============================================');
  console.log('  DELETE: Categories, Exercises, Workouts');
  console.log('==============================================\n');

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'workout',
    multipleStatements: false
  });

  console.log(`Connected to database: ${process.env.DB_NAME || 'workout'}\n`);

  // Show current counts
  console.log('Current row counts:');
  for (const { table, label } of TABLES_IN_ORDER) {
    try {
      const [rows] = await connection.query(`SELECT COUNT(*) AS c FROM \`${table}\``);
      console.log(`  - ${label.padEnd(36)} ${table.padEnd(20)} : ${rows[0].c}`);
    } catch (err) {
      console.log(`  - ${label.padEnd(36)} ${table.padEnd(20)} : (table missing: ${err.message})`);
    }
  }
  console.log('');

  if (!skipConfirm) {
    const ans = await prompt('This will PERMANENTLY DELETE all the data above. Type "DELETE" to proceed: ');
    if (ans !== 'DELETE') {
      console.log('Aborted. No data was deleted.');
      await connection.end();
      process.exit(0);
    }
  }

  // Disable FK checks so order issues / missing tables don't block us
  await connection.query('SET FOREIGN_KEY_CHECKS = 0');

  try {
    for (const { table, label } of TABLES_IN_ORDER) {
      try {
        const [before] = await connection.query(`SELECT COUNT(*) AS c FROM \`${table}\``);
        await connection.query(`DELETE FROM \`${table}\``);
        // Reset auto-increment so new inserts start from 1
        try {
          await connection.query(`ALTER TABLE \`${table}\` AUTO_INCREMENT = 1`);
        } catch (_) { /* table has no AI column */ }
        console.log(`  [OK] Cleared ${label} (${table}) - removed ${before[0].c} rows`);
      } catch (err) {
        console.log(`  [SKIP] ${label} (${table}): ${err.message}`);
      }
    }
  } finally {
    await connection.query('SET FOREIGN_KEY_CHECKS = 1');
  }

  // Verify
  console.log('\nVerification (post-delete counts):');
  for (const { table, label } of TABLES_IN_ORDER) {
    try {
      const [rows] = await connection.query(`SELECT COUNT(*) AS c FROM \`${table}\``);
      console.log(`  - ${label.padEnd(36)} ${table.padEnd(20)} : ${rows[0].c}`);
    } catch (_) { /* ignore */ }
  }

  await connection.end();
  console.log('\nDone.');
  process.exit(0);
}

run().catch(async err => {
  console.error('\nError:', err.message);
  process.exit(1);
});
