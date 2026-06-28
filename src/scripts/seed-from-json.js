/**
 * Seed Categories, Programs, Workouts, Sections, Exercises from seed.json
 *
 * This script:
 *   1. Syncs the program-hierarchy models (creates tables if missing)
 *   2. Finds (or creates) an admin user to use as createdBy
 *   3. Clears all existing data in: workout_exercises, user_programs,
 *      program_workouts, workout_sections, programs, exercises,
 *      subcategories, categories
 *   4. Reads ../seed.json (repo root) and populates everything
 *
 * Usage:
 *   cd backend
 *   node src/scripts/seed-from-json.js
 */

const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const { sequelize } = require('../config/database');
const models = require('../models');
const { User, Category, Subcategory, Program, ProgramWorkout,
        WorkoutSection, WorkoutExercise, Exercise, UserProgram,
        Phase, Assessment, AssessmentResult } = models;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function slugify(str) {
  return String(str)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

function parseReps(repsStr) {
  if (!repsStr) return null;
  const n = parseInt(String(repsStr).replace(/[^0-9]/g, ''), 10);
  return isNaN(n) ? null : n;
}

function parseRest(restStr) {
  if (!restStr) return null;
  const n = parseInt(String(restStr).replace(/[^0-9]/g, ''), 10);
  return isNaN(n) ? null : n;
}

function parseDurationMinutes(durationStr) {
  if (!durationStr) return null;
  const n = parseInt(String(durationStr).replace(/[^0-9]/g, ''), 10);
  return isNaN(n) ? null : n;
}

// Map a section display name to the WorkoutExercise.section ENUM slug
const SECTION_SLUG_MAP = {
  'warm-up': 'warm_up',
  'warm up': 'warm_up',
  'core / balance / plyometric': 'core_balance_plyometric',
  'core/balance/plyometric': 'core_balance_plyometric',
  'speed / agility / quickness': 'speed_agility_quickness',
  'speed/agility/quickness': 'speed_agility_quickness',
  'resistance': 'resistance',
  'cool-down': 'cool_down',
  'cool down': 'cool_down',
  'recovery': 'recovery',
  'main': 'main',
};

function sectionNameToSlug(name) {
  const key = String(name || '').toLowerCase().trim();
  return SECTION_SLUG_MAP[key] || 'main';
}

// Infer Exercise.category from the section it first appears in
function inferExerciseCategory(sectionSlug) {
  if (sectionSlug === 'warm_up' || sectionSlug === 'cool_down' || sectionSlug === 'recovery') {
    return 'flexibility';
  }
  if (sectionSlug === 'core_balance_plyometric') return 'balance';
  if (sectionSlug === 'speed_agility_quickness') return 'cardio';
  return 'strength';
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function run() {
  console.log('==============================================');
  console.log('  SEED from seed.json');
  console.log('==============================================\n');

  await sequelize.authenticate();
  console.log('✓ DB connected\n');

  // 1. Sync all models so tables exist (parent-first)
  //    workout_exercises is created with raw SQL because its model defines a
  //    FK from `section` (ENUM) to workout_sections.slug (VARCHAR) — MySQL
  //    rejects this as errno 150 (mismatched types). We keep the two valid
  //    FKs (program_workouts, exercises) and skip the section→slug FK.
  console.log('🔨 Syncing models...');
  await Phase.sync({ alter: false });             // lookup (no FKs)
  await WorkoutSection.sync({ alter: false });    // standalone lookup
  await Assessment.sync({ alter: false });        // standalone lookup

  // Add missing columns to existing tables (programs, program_workouts, exercises,
  // workout_exercises) since sync({alter:false}) won't add new columns.
  // We use ALTER TABLE ... ADD COLUMN IF NOT EXISTS (MySQL 8+) or catch errors.
  const addColumnIfMissing = async (table, column, definition) => {
    try {
      await sequelize.query(`ALTER TABLE \`${table}\` ADD COLUMN \`${column}\` ${definition}`);
      console.log(`   + ${table}.${column}`);
    } catch (e) {
      // Column already exists or other non-fatal error — ignore
      if (e.original && e.original.code !== 'ER_DUP_FIELDNAME') {
        // re-raise unexpected errors
        if (!String(e.message).includes('Duplicate column')) {
          console.log(`   ~ ${table}.${column} (already exists or skipped)`);
        }
      }
    }
  };

  // programs: new OPT columns
  await addColumnIfMissing('programs', 'optPhaseId', 'INT NULL');
  await addColumnIfMissing('programs', 'optPhaseNumber', 'INT NULL');
  await addColumnIfMissing('programs', 'assessmentRequired', 'BOOLEAN DEFAULT FALSE');
  await addColumnIfMissing('programs', 'hasAssessments', 'BOOLEAN DEFAULT FALSE');
  await addColumnIfMissing('programs', 'progressionType', "ENUM('linear','undulating','block','conjugate') DEFAULT 'linear'");

  // program_workouts: new OPT columns
  await addColumnIfMissing('program_workouts', 'phaseId', 'INT NULL');
  await addColumnIfMissing('program_workouts', 'phaseNumber', 'INT NULL');
  await addColumnIfMissing('program_workouts', 'isAssessment', 'BOOLEAN DEFAULT FALSE');
  await addColumnIfMissing('program_workouts', 'assessmentType', 'VARCHAR(100) NULL');
  await addColumnIfMissing('program_workouts', 'weekNumber', 'INT NULL');
  await addColumnIfMissing('program_workouts', 'dayNumber', 'INT NULL');
  await addColumnIfMissing('program_workouts', 'instructions', 'TEXT NULL');
  await addColumnIfMissing('program_workouts', 'focusArea', 'VARCHAR(100) NULL');

  // exercises: new classification columns
  await addColumnIfMissing('exercises', 'movementType', "ENUM('stable','stabilization','functional','power') DEFAULT 'stable'");
  await addColumnIfMissing('exercises', 'planeOfMotion', "ENUM('sagittal','frontal','transverse','multiplanar') DEFAULT 'sagittal'");
  await addColumnIfMissing('exercises', 'primaryMuscles', "JSON DEFAULT '[]'");
  await addColumnIfMissing('exercises', 'secondaryMuscles', "JSON DEFAULT '[]'");

  // workout_sections: new metadata columns
  await addColumnIfMissing('workout_sections', 'purpose', 'VARCHAR(255) NULL');
  await addColumnIfMissing('workout_sections', 'typicalDuration', 'INT NULL');

  // workout_exercises: tempo breakdown columns
  await addColumnIfMissing('workout_exercises', 'tempoEccentric', 'INT NULL');
  await addColumnIfMissing('workout_exercises', 'tempoIsometric', 'INT NULL');
  await addColumnIfMissing('workout_exercises', 'tempoConcentric', 'INT NULL');
  await addColumnIfMissing('workout_exercises', 'tempoRestPause', 'INT DEFAULT 0');

  // Now sync the models (won't try to add columns again, just ensures table exists)
  await Program.sync({ alter: false });           // FK to categories + phases
  await ProgramWorkout.sync({ alter: false });    // FK to programs + phases
  await Exercise.sync({ alter: false });          // parent for workout_exercises
  // Create workout_exercises with raw SQL (skip the broken section→slug FK)
  await sequelize.query(`
    CREATE TABLE IF NOT EXISTS \`workout_exercises\` (
      \`id\` INTEGER AUTO_INCREMENT PRIMARY KEY,
      \`programWorkoutId\` INTEGER NOT NULL,
      \`exerciseId\` INTEGER NOT NULL,
      \`section\` ENUM('warm_up','core_balance_plyometric','speed_agility_quickness','resistance','cool_down','recovery','main') NOT NULL DEFAULT 'main',
      \`sectionName\` VARCHAR(100),
      \`orderIndex\` INTEGER DEFAULT 0,
      \`sets\` INTEGER DEFAULT 3,
      \`reps\` INTEGER,
      \`repsDisplay\` VARCHAR(50),
      \`durationSeconds\` INTEGER,
      \`restSeconds\` INTEGER DEFAULT 60,
      \`tempo\` VARCHAR(20),
      \`tempoEccentric\` INTEGER,
      \`tempoIsometric\` INTEGER,
      \`tempoConcentric\` INTEGER,
      \`tempoRestPause\` INTEGER DEFAULT 0,
      \`weight\` DECIMAL(6,2),
      \`intensity\` ENUM('low','moderate','high','very_high'),
      \`instructions\` TEXT,
      \`videoUrl\` VARCHAR(500),
      \`isActive\` TINYINT(1) DEFAULT true,
      \`createdAt\` DATETIME NOT NULL,
      \`updatedAt\` DATETIME NOT NULL,
      INDEX \`we_program_workout_order\` (\`programWorkoutId\`, \`orderIndex\`),
      INDEX \`we_program_workout_section\` (\`programWorkoutId\`, \`section\`),
      INDEX \`we_exercise\` (\`exerciseId\`),
      INDEX \`we_active\` (\`isActive\`),
      CONSTRAINT \`we_fk_program_workout\` FOREIGN KEY (\`programWorkoutId\`) REFERENCES \`program_workouts\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE,
      CONSTRAINT \`we_fk_exercise\` FOREIGN KEY (\`exerciseId\`) REFERENCES \`exercises\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
    ) ENGINE=InnoDB;
  `);
  await UserProgram.sync({ alter: false });       // FK to programs + program_workouts
  await AssessmentResult.sync({ alter: false });  // FK to users + assessments + programs
  console.log('✓ Tables ready\n');

  // 2. Find or create an admin user
  let admin = await User.findOne({ where: { roles: ['admin'] } });
  if (!admin) {
    // Fallback: any user whose roles contain 'admin' as a string
    const all = await User.findAll();
    admin = all.find(u => {
      const r = u.roles || [];
      return Array.isArray(r) && r.includes('admin');
    });
  }
  if (!admin) {
    console.log('⚠️  No admin user found — creating a default admin...');
    admin = await User.create({
      name: 'Seed Admin',
      email: 'seed-admin@arifworkout.local',
      phone: '0000000000',
      roles: ['admin'],
      isActive: true,
      isEmailVerified: true,
    });
  }
  console.log(`✓ Using admin user: id=${admin.id} (${admin.name})\n`);

  // 3. Clear all existing data (child-first)
  console.log('🧹 Clearing existing data...');
  await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
  try {
    await AssessmentResult.destroy({ where: {}, truncate: true });
    await WorkoutExercise.destroy({ where: {}, truncate: true });
    await UserProgram.destroy({ where: {}, truncate: true });
    await ProgramWorkout.destroy({ where: {}, truncate: true });
    await Program.destroy({ where: {}, truncate: true });
    await Exercise.destroy({ where: {}, truncate: true });
    await WorkoutSection.destroy({ where: {}, truncate: true });
    await Assessment.destroy({ where: {}, truncate: true });
    await Phase.destroy({ where: {}, truncate: true });
    await Subcategory.destroy({ where: {}, truncate: true });
    await Category.destroy({ where: {}, truncate: true });
    // Reset auto-increments
    for (const t of ['assessment_results', 'workout_exercises', 'user_programs',
                     'program_workouts', 'programs', 'exercises',
                     'assessments', 'phases', 'subcategories', 'categories']) {
      try { await sequelize.query(`ALTER TABLE \`${t}\` AUTO_INCREMENT = 1`); } catch (_) {}
    }
  } finally {
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
  }
  console.log('✓ All cleared\n');

  // 4. Seed the 5 OPT phases (lookup data — always seeded)
  console.log('📋 Seeding 5 OPT phases...');
  const PHASES = [
    { phaseNumber: 1, name: 'Stabilization Endurance', slug: 'stabilization_endurance',
      description: 'Phase 1: Improve muscular endurance, stability, and neuromuscular efficiency.',
      minSets: 1, maxSets: 3, minReps: 12, maxReps: 25, tempoPattern: '4-2-1',
      minRestSeconds: 0, maxRestSeconds: 90, intensity: 'low',
      trainingFocus: 'Muscular endurance, stability, neuromuscular efficiency',
      adaptationType: 'stabilization', progressionType: 'linear', assessmentRequired: true },
    { phaseNumber: 2, name: 'Strength Endurance', slug: 'strength_endurance',
      description: 'Phase 2: Enhance muscular endurance and stability while increasing strength.',
      minSets: 2, maxSets: 4, minReps: 8, maxReps: 12, tempoPattern: '2-0-2',
      minRestSeconds: 0, maxRestSeconds: 60, intensity: 'moderate',
      trainingFocus: 'Muscular endurance + strength, superset training',
      adaptationType: 'strength_endurance', progressionType: 'linear', assessmentRequired: true },
    { phaseNumber: 3, name: 'Muscular Development', slug: 'muscular_development',
      description: 'Phase 3: Hypertrophy training for maximal muscle growth.',
      minSets: 3, maxSets: 5, minReps: 6, maxReps: 12, tempoPattern: '2-0-2',
      minRestSeconds: 0, maxRestSeconds: 60, intensity: 'moderate',
      trainingFocus: 'Hypertrophy, muscle growth, volume training',
      adaptationType: 'hypertrophy', progressionType: 'undulating', assessmentRequired: false },
    { phaseNumber: 4, name: 'Maximal Strength', slug: 'maximal_strength',
      description: 'Phase 4: Develop maximal strength with high intensity, low volume.',
      minSets: 4, maxSets: 6, minReps: 1, maxReps: 5, tempoPattern: '4-0-1',
      minRestSeconds: 180, maxRestSeconds: 300, intensity: 'high',
      trainingFocus: 'Maximal strength, motor unit recruitment, heavy loads',
      adaptationType: 'maximal_strength', progressionType: 'block', assessmentRequired: false },
    { phaseNumber: 5, name: 'Power', slug: 'power',
      description: 'Phase 5: Enhance power production and athletic performance.',
      minSets: 3, maxSets: 5, minReps: 1, maxReps: 5, tempoPattern: '1-0-1',
      minRestSeconds: 180, maxRestSeconds: 300, intensity: 'very_high',
      trainingFocus: 'Power, rate of force production, athletic performance',
      adaptationType: 'power', progressionType: 'conjugate', assessmentRequired: false },
  ];
  const phaseMap = {}; // slug → Phase record
  for (const p of PHASES) {
    const phase = await Phase.create({ ...p, isActive: true });
    phaseMap[p.slug] = phase;
    console.log(`   ✓ Phase ${p.phaseNumber}: ${p.name} (id=${phase.id})`);
  }
  console.log('');

  // 5. Seed the 6 workout sections (lookup data)
  console.log('📋 Seeding 6 workout sections...');
  const SECTIONS = [
    { name: 'Warm-Up', slug: 'warm_up', description: 'SMR and static stretching to prepare the body',
      ordinal: 0, color: '#FF6B6B', purpose: 'SMR + Static Stretching', typicalDuration: 5, isHidden: false },
    { name: 'Core / Balance / Plyometric', slug: 'core_balance_plyometric',
      description: 'Core stabilization, balance training, and plyometric exercises',
      ordinal: 1, color: '#4ECDC4', purpose: 'Core + Balance + Plyometric', typicalDuration: 5, isHidden: false },
    { name: 'Speed / Agility / Quickness', slug: 'speed_agility_quickness',
      description: 'SAQ training for athletic performance',
      ordinal: 2, color: '#45B7D1', purpose: 'Speed, Agility, Quickness drills', typicalDuration: 5, isHidden: true },
    { name: 'Resistance', slug: 'resistance',
      description: 'Strength training with resistance exercises',
      ordinal: 3, color: '#96CEB4', purpose: 'Resistance training (main)', typicalDuration: 25, isHidden: false },
    { name: 'Cool-Down', slug: 'cool_down',
      description: 'Static stretching and SMR to recover',
      ordinal: 4, color: '#FFEAA7', purpose: 'SMR + Static Stretching', typicalDuration: 5, isHidden: false },
    { name: 'Recovery', slug: 'recovery',
      description: 'Active recovery and regeneration techniques',
      ordinal: 5, color: '#DDA0DD', purpose: 'Active recovery, regeneration', typicalDuration: 10, isHidden: true },
  ];
  const sectionMap = {}; // slug → WorkoutSection record
  for (const s of SECTIONS) {
    const sec = await WorkoutSection.create({ ...s, isActive: true });
    sectionMap[s.slug] = sec;
    console.log(`   ✓ ${s.name} (slug=${s.slug})`);
  }
  console.log('');

  // 6. Seed standard assessments (lookup data)
  console.log('📋 Seeding assessments...');
  const ASSESSMENTS = [
    { name: 'Postural Assessment', slug: 'postural-assessment', category: 'postural',
      description: 'Static postural assessment to identify muscle imbalances.',
      instructions: 'Observe from anterior, posterior, and lateral views.', durationMinutes: 10 },
    { name: 'Overhead Squat Assessment', slug: 'overhead-squat-assessment', category: 'movement',
      description: 'Dynamic movement assessment for compensations.',
      instructions: 'Client squats with arms overhead. Observe from anterior and lateral.', durationMinutes: 5 },
    { name: 'Single-Leg Squat Assessment', slug: 'single-leg-squat-assessment', category: 'movement',
      description: 'Assess dynamic balance and lower extremity alignment.',
      instructions: 'Client performs single-leg squat to 60 degrees.', durationMinutes: 5 },
    { name: 'Pushing Assessment', slug: 'pushing-assessment', category: 'movement',
      description: 'Observe pushing movement patterns.',
      instructions: 'Client performs push-up or standing cable press.', durationMinutes: 5 },
    { name: 'Pulling Assessment', slug: 'pulling-assessment', category: 'movement',
      description: 'Observe pulling movement patterns.',
      instructions: 'Client performs pull-up or seated row.', durationMinutes: 5 },
    { name: 'Thoracic Spine Mobility', slug: 'thoracic-spine-mobility', category: 'flexibility',
      description: 'Assess thoracic spine extension and rotation.',
      instructions: 'Client performs seated rotation and extension tests.', durationMinutes: 5 },
    { name: '1RM Bench Press', slug: '1rm-bench-press', category: 'performance',
      description: 'One-rep max bench press for upper body strength.',
      instructions: 'Standard 1RM protocol with warm-up sets.', durationMinutes: 20 },
    { name: '1RM Squat', slug: '1rm-squat', category: 'performance',
      description: 'One-rep max squat for lower body strength.',
      instructions: 'Standard 1RM protocol with warm-up sets.', durationMinutes: 20 },
    { name: 'Vertical Jump', slug: 'vertical-jump', category: 'performance',
      description: 'Power assessment using vertical jump height.',
      instructions: 'Client performs maximum vertical jump.', durationMinutes: 5 },
  ];
  for (const a of ASSESSMENTS) {
    await Assessment.create({ ...a, isActive: true });
  }
  console.log(`   ✓ ${ASSESSMENTS.length} assessments created\n`);

  // 7. Read seed.json
  const seedPath = path.join(__dirname, '../../../seed.json');
  console.log(`📄 Reading ${seedPath}...`);
  const raw = fs.readFileSync(seedPath, 'utf8');
  const data = JSON.parse(raw);
  console.log(`✓ Loaded ${data.programs.length} programs\n`);

  // 8. Collect unique categories from programs
  const uniqueCategories = [...new Set(data.programs.map(p => p.category))];
  console.log(`📋 Creating ${uniqueCategories.length} categories...`);
  const categoryMap = {}; // name -> Category record
  for (const catName of uniqueCategories) {
    const cat = await Category.create({
      name: catName,
      slug: slugify(catName),
      description: `${catName} training programs`,
      createdBy: admin.id,
    });
    categoryMap[catName] = cat;
    console.log(`   ✓ ${catName} (id=${cat.id})`);
  }
  console.log('');

  // 7. Collect unique exercise names → create exercises (deduplicated)
  const exerciseNameMap = {}; // name -> Exercise record
  const exerciseNameToCategory = {}; // name -> category slug guess
  for (const prog of data.programs) {
    for (const wo of prog.workouts) {
      for (const sec of wo.sections) {
        const secSlug = sectionNameToSlug(sec.sectionName);
        for (const ex of sec.exercises) {
          if (!exerciseNameMap[ex.name]) {
            // First time we see this exercise — infer category from section
            if (!exerciseNameToCategory[ex.name]) {
              exerciseNameToCategory[ex.name] = inferExerciseCategory(secSlug);
            }
          }
        }
      }
    }
  }

  const uniqueExerciseNames = Object.keys(exerciseNameToCategory);
  console.log(`🏋️  Creating ${uniqueExerciseNames.length} unique exercises...`);
  let exCount = 0;
  for (const exName of uniqueExerciseNames) {
    const cat = exerciseNameToCategory[exName];
    const slug = slugify(exName);
    // Ensure slug uniqueness
    let uniqueSlug = slug;
    let suffix = 1;
    while (true) {
      const existing = await Exercise.findOne({ where: { slug: uniqueSlug } });
      if (!existing) break;
      uniqueSlug = `${slug}_${suffix++}`;
    }
    const ex = await Exercise.create({
      name: exName,
      slug: uniqueSlug,
      description: `${exName} exercise`,
      category: cat,
      difficulty: 'beginner',
      createdBy: admin.id,
      isActive: true,
    });
    exerciseNameMap[exName] = ex;
    exCount++;
    if (exCount % 20 === 0) console.log(`   ...${exCount} created`);
  }
  console.log(`✓ Created ${exCount} exercises\n`);

  // 8. Create programs → program_workouts → workout_exercises
  console.log('📦 Creating programs, workouts, and exercise mappings...');
  let programCount = 0;
  let workoutCount = 0;
  let mappingCount = 0;

  for (const progData of data.programs) {
    const category = categoryMap[progData.category];
    const progSlug = slugify(progData.programName);
    // Ensure unique program slug
    let uniqueProgSlug = progSlug;
    let ps = 1;
    while (true) {
      const existing = await Program.findOne({ where: { slug: uniqueProgSlug } });
      if (!existing) break;
      uniqueProgSlug = `${progSlug}_${ps++}`;
    }

    // Map category name to OPT phase
    const CATEGORY_TO_PHASE = {
      'Stabilization Endurance': 'stabilization_endurance',
      'Muscle Gain': 'muscular_development',
      'General Fitness': 'stabilization_endurance',
    };
    const phaseSlug = CATEGORY_TO_PHASE[progData.category] || 'stabilization_endurance';
    const phase = phaseMap[phaseSlug];

    const program = await Program.create({
      name: progData.programName,
      slug: uniqueProgSlug,
      description: `${progData.programName} — ${progData.category}`,
      categoryId: category.id,
      categoryName: progData.category,
      level: 'all_levels',
      goal: 'general_fitness',
      workoutsCount: progData.workouts.length,
      isActive: true,
      createdBy: admin.id,
      orderIndex: programCount,
      optPhaseId: phase ? phase.id : null,
      optPhaseNumber: phase ? phase.phaseNumber : null,
      assessmentRequired: phase ? phase.assessmentRequired : false,
      progressionType: phase ? phase.progressionType : 'linear',
    });
    programCount++;
    console.log(`  ✓ Program: ${progData.programName} (id=${program.id}, ${progData.workouts.length} workouts)`);

    for (let wi = 0; wi < progData.workouts.length; wi++) {
      const woData = progData.workouts[wi];
      const woSlug = slugify(woData.workoutName);
      let uniqueWoSlug = woSlug;
      let ws = 1;
      while (true) {
        const existing = await ProgramWorkout.findOne({ where: { name: woData.workoutName } });
        if (!existing) break;
        uniqueWoSlug = `${woSlug}_${ws++}`;
        break; // names can repeat; slug isn't unique in this model
      }

      const workout = await ProgramWorkout.create({
        programId: program.id,
        name: woData.workoutName,
        description: `${woData.workoutName} — ${woData.exerciseCount} exercises, ${woData.durationMinutes} min`,
        level: 'beginner',
        durationMinutes: woData.durationMinutes,
        exercisesCount: woData.exerciseCount,
        orderIndex: wi,
        isActive: true,
        phaseId: phase ? phase.id : null,
        phaseNumber: phase ? phase.phaseNumber : null,
      });
      workoutCount++;

      // Insert workout_exercises for each section
      let orderInWorkout = 0;
      for (const secData of woData.sections) {
        const secSlug = sectionNameToSlug(secData.sectionName);
        for (const exData of secData.exercises) {
          const exercise = exerciseNameMap[exData.name];
          if (!exercise) {
            console.log(`    ⚠️  Exercise not found in map: ${exData.name} — skipping`);
            continue;
          }
          // Parse tempo: "Slow"→null (use phase default), "3-1-2-0"→breakdown
          const tempoStr = exData.tempo && exData.tempo !== 'N/A' ? exData.tempo : null;
          let tempoEccentric = null, tempoIsometric = null, tempoConcentric = null, tempoRestPause = 0;
          if (tempoStr && tempoStr.includes('-')) {
            const parts = tempoStr.split('-').map(n => parseInt(n, 10));
            tempoEccentric = isNaN(parts[0]) ? null : parts[0];
            tempoIsometric = isNaN(parts[1]) ? null : parts[1];
            tempoConcentric = isNaN(parts[2]) ? null : parts[2];
            tempoRestPause = isNaN(parts[3]) ? 0 : parts[3];
          }

          await WorkoutExercise.create({
            programWorkoutId: workout.id,
            exerciseId: exercise.id,
            section: secSlug,
            sectionName: secData.sectionName,
            orderIndex: orderInWorkout++,
            sets: exData.sets || null,
            reps: parseReps(exData.reps),
            repsDisplay: String(exData.reps || 'N/A'),
            tempo: tempoStr,
            tempoEccentric,
            tempoIsometric,
            tempoConcentric,
            tempoRestPause,
            restSeconds: parseRest(exData.rest),
            isActive: true,
          });
          mappingCount++;
        }
      }
    }
  }

  console.log(`\n✅ Seeding complete!`);
  console.log(`   Phases:            ${PHASES.length}`);
  console.log(`   Sections:          ${SECTIONS.length}`);
  console.log(`   Assessments:       ${ASSESSMENTS.length}`);
  console.log(`   Categories:        ${uniqueCategories.length}`);
  console.log(`   Programs:          ${programCount}`);
  console.log(`   Program Workouts:  ${workoutCount}`);
  console.log(`   Exercises:         ${exCount}`);
  console.log(`   Workout Mappings:  ${mappingCount}`);

  // 9. Verify with counts
  console.log('\n📊 Verification:');
  const verify = async (Model, label) => {
    const c = await Model.count();
    console.log(`   ${label.padEnd(25)} : ${c}`);
  };
  await verify(Phase, 'phases');
  await verify(WorkoutSection, 'workout_sections');
  await verify(Assessment, 'assessments');
  await verify(Category, 'categories');
  await verify(Program, 'programs');
  await verify(ProgramWorkout, 'program_workouts');
  await verify(Exercise, 'exercises');
  await verify(WorkoutExercise, 'workout_exercises');

  await sequelize.close();
  process.exit(0);
}

run().catch(async err => {
  console.error('\n❌ Error:', err);
  try { await sequelize.close(); } catch (_) {}
  process.exit(1);
});
