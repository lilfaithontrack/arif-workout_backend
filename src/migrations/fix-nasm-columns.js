/**
 * Fix NASM columns migration
 */

const { sequelize } = require('../config/database');

async function up() {
  console.log('Fixing NASM columns...\n');

  // 1. Add missing columns to programs (camelCase)
  const programCols = [
    'ALTER TABLE programs ADD COLUMN IF NOT EXISTS optPhase ENUM("stabilization_endurance","strength_endurance","muscular_development","maximal_strength","power") NULL',
    'ALTER TABLE programs ADD COLUMN IF NOT EXISTS optPhaseNumber INT NULL',
    'ALTER TABLE programs ADD COLUMN IF NOT EXISTS assessmentRequired TINYINT(1) DEFAULT 0',
    'ALTER TABLE programs ADD COLUMN IF NOT EXISTS hasAssessments TINYINT(1) DEFAULT 0',
    'ALTER TABLE programs ADD COLUMN IF NOT EXISTS progressionType ENUM("linear","undulating","block","conjugate") DEFAULT "linear"'
  ];

  for (const sql of programCols) {
    try {
      await sequelize.query(sql);
      console.log('  ✅ ' + sql.split('ADD COLUMN')[1].split(' ')[1]);
    } catch (e) {
      console.log('  ⚠️ ' + e.message);
    }
  }

  // 2. Update workout_exercises section enum
  console.log('\nUpdating workout_exercises section enum...');
  try {
    await sequelize.query(`
      ALTER TABLE workout_exercises 
      MODIFY COLUMN section ENUM('warm_up','core_balance_plyometric','speed_agility_quickness','resistance','cool_down','recovery','main') DEFAULT 'main' NOT NULL
    `);
    console.log('  ✅ Section enum updated');
  } catch (e) {
    console.log('  ⚠️ ' + e.message);
  }

  console.log('\n✅ Done');
}

up().then(() => {
  sequelize.close();
  process.exit(0);
}).catch(e => {
  console.error(e);
  sequelize.close();
  process.exit(1);
});
