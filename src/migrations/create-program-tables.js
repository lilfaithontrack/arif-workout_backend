require('dotenv').config();
const { sequelize } = require('../config/database');

async function up() {
  const queryInterface = sequelize.getQueryInterface();

  console.log('Creating programs table...');
  await queryInterface.createTable('programs', {
    id: {
      type: 'INTEGER',
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: 'VARCHAR(255)',
      allowNull: false
    },
    slug: {
      type: 'VARCHAR(255)',
      allowNull: false,
      unique: true
    },
    description: {
      type: 'TEXT',
      allowNull: true
    },
    categoryId: {
      type: 'INTEGER',
      allowNull: true,
      references: {
        model: 'categories',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    categoryName: {
      type: 'VARCHAR(100)',
      allowNull: true
    },
    level: {
      type: "ENUM('beginner', 'intermediate', 'advanced', 'all_levels')",
      allowNull: false,
      defaultValue: 'beginner'
    },
    goal: {
      type: "ENUM('weight_loss', 'muscle_gain', 'endurance', 'flexibility', 'general_fitness', 'strength', 'stabilization')",
      allowNull: true
    },
    durationWeeks: {
      type: 'INTEGER',
      allowNull: true
    },
    workoutsCount: {
      type: 'INTEGER',
      allowNull: true,
      defaultValue: 0
    },
    imageUrl: {
      type: 'VARCHAR(500)',
      allowNull: true
    },
    bannerImageUrl: {
      type: 'VARCHAR(500)',
      allowNull: true
    },
    isActive: {
      type: 'BOOLEAN',
      defaultValue: true
    },
    isFeatured: {
      type: 'BOOLEAN',
      defaultValue: false
    },
    tags: {
      type: 'JSON',
      defaultValue: '[]'
    },
    equipment: {
      type: 'JSON',
      defaultValue: '[]'
    },
    createdBy: {
      type: 'INTEGER',
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    orderIndex: {
      type: 'INTEGER',
      defaultValue: 0
    },
    createdAt: {
      type: 'DATETIME',
      allowNull: false
    },
    updatedAt: {
      type: 'DATETIME',
      allowNull: false
    }
  });

  console.log('Creating indexes for programs table...');
  await queryInterface.addIndex('programs', ['categoryId']);
  await queryInterface.addIndex('programs', ['level']);
  await queryInterface.addIndex('programs', ['goal']);
  await queryInterface.addIndex('programs', ['isActive']);
  await queryInterface.addIndex('programs', ['isFeatured']);
  await queryInterface.addIndex('programs', ['createdBy']);
  await queryInterface.addIndex('programs', ['orderIndex']);

  console.log('Creating program_workouts table...');
  await queryInterface.createTable('program_workouts', {
    id: {
      type: 'INTEGER',
      primaryKey: true,
      autoIncrement: true
    },
    programId: {
      type: 'INTEGER',
      allowNull: false,
      references: {
        model: 'programs',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    name: {
      type: 'VARCHAR(255)',
      allowNull: false
    },
    description: {
      type: 'TEXT',
      allowNull: true
    },
    level: {
      type: "ENUM('beginner', 'intermediate', 'advanced')",
      allowNull: true
    },
    weekNumber: {
      type: 'INTEGER',
      allowNull: true
    },
    dayNumber: {
      type: 'INTEGER',
      allowNull: true
    },
    durationMinutes: {
      type: 'INTEGER',
      allowNull: true
    },
    exercisesCount: {
      type: 'INTEGER',
      defaultValue: 0
    },
    caloriesBurnEstimate: {
      type: 'INTEGER',
      allowNull: true
    },
    focusArea: {
      type: 'VARCHAR(100)',
      allowNull: true
    },
    orderIndex: {
      type: 'INTEGER',
      defaultValue: 0
    },
    isActive: {
      type: 'BOOLEAN',
      defaultValue: true
    },
    instructions: {
      type: 'TEXT',
      allowNull: true
    },
    createdAt: {
      type: 'DATETIME',
      allowNull: false
    },
    updatedAt: {
      type: 'DATETIME',
      allowNull: false
    }
  });

  console.log('Creating indexes for program_workouts table...');
  await queryInterface.addIndex('program_workouts', ['programId', 'orderIndex']);
  await queryInterface.addIndex('program_workouts', ['programId', 'weekNumber', 'dayNumber']);
  await queryInterface.addIndex('program_workouts', ['level']);
  await queryInterface.addIndex('program_workouts', ['isActive']);

  console.log('Creating workout_exercises table...');
  await queryInterface.createTable('workout_exercises', {
    id: {
      type: 'INTEGER',
      primaryKey: true,
      autoIncrement: true
    },
    programWorkoutId: {
      type: 'INTEGER',
      allowNull: false,
      references: {
        model: 'program_workouts',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    exerciseId: {
      type: 'INTEGER',
      allowNull: false,
      references: {
        model: 'exercises',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    section: {
      type: "ENUM('warm_up', 'main', 'cool_down', 'superset')",
      defaultValue: 'main',
      allowNull: false
    },
    sectionName: {
      type: 'VARCHAR(100)',
      allowNull: true
    },
    orderIndex: {
      type: 'INTEGER',
      defaultValue: 0
    },
    sets: {
      type: 'INTEGER',
      allowNull: true,
      defaultValue: 3
    },
    reps: {
      type: 'INTEGER',
      allowNull: true
    },
    repsDisplay: {
      type: 'VARCHAR(50)',
      allowNull: true
    },
    durationSeconds: {
      type: 'INTEGER',
      allowNull: true
    },
    restSeconds: {
      type: 'INTEGER',
      allowNull: true,
      defaultValue: 60
    },
    tempo: {
      type: 'VARCHAR(20)',
      allowNull: true
    },
    weight: {
      type: 'DECIMAL(6,2)',
      allowNull: true
    },
    intensity: {
      type: "ENUM('low', 'moderate', 'high')",
      allowNull: true
    },
    instructions: {
      type: 'TEXT',
      allowNull: true
    },
    videoUrl: {
      type: 'VARCHAR(500)',
      allowNull: true
    },
    isActive: {
      type: 'BOOLEAN',
      defaultValue: true
    },
    createdAt: {
      type: 'DATETIME',
      allowNull: false
    },
    updatedAt: {
      type: 'DATETIME',
      allowNull: false
    }
  });

  console.log('Creating indexes for workout_exercises table...');
  await queryInterface.addIndex('workout_exercises', ['programWorkoutId', 'orderIndex']);
  await queryInterface.addIndex('workout_exercises', ['programWorkoutId', 'section']);
  await queryInterface.addIndex('workout_exercises', ['exerciseId']);
  await queryInterface.addIndex('workout_exercises', ['isActive']);

  console.log('Creating user_programs table...');
  await queryInterface.createTable('user_programs', {
    id: {
      type: 'INTEGER',
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: 'INTEGER',
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    programId: {
      type: 'INTEGER',
      allowNull: false,
      references: {
        model: 'programs',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    currentWorkoutId: {
      type: 'INTEGER',
      allowNull: true,
      references: {
        model: 'program_workouts',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    currentWeek: {
      type: 'INTEGER',
      defaultValue: 1
    },
    currentDay: {
      type: 'INTEGER',
      defaultValue: 1
    },
    status: {
      type: "ENUM('not_started', 'in_progress', 'completed', 'paused')",
      defaultValue: 'not_started'
    },
    progressPercentage: {
      type: 'DECIMAL(5,2)',
      defaultValue: 0
    },
    completedWorkouts: {
      type: 'INTEGER',
      defaultValue: 0
    },
    totalWorkouts: {
      type: 'INTEGER',
      defaultValue: 0
    },
    startDate: {
      type: 'DATETIME',
      allowNull: true
    },
    endDate: {
      type: 'DATETIME',
      allowNull: true
    },
    completedDate: {
      type: 'DATETIME',
      allowNull: true
    },
    rating: {
      type: 'INTEGER',
      allowNull: true
    },
    feedback: {
      type: 'TEXT',
      allowNull: true
    },
    isFavorite: {
      type: 'BOOLEAN',
      defaultValue: false
    },
    createdAt: {
      type: 'DATETIME',
      allowNull: false
    },
    updatedAt: {
      type: 'DATETIME',
      allowNull: false
    }
  });

  console.log('Creating indexes for user_programs table...');
  await queryInterface.addIndex('user_programs', ['userId', 'status']);
  await queryInterface.addIndex('user_programs', ['userId', 'programId'], { unique: true });
  await queryInterface.addIndex('user_programs', ['programId']);
  await queryInterface.addIndex('user_programs', ['status']);

  console.log('✓ Program hierarchy tables created successfully!');
}

async function down() {
  const queryInterface = sequelize.getQueryInterface();

  console.log('Dropping user_programs table...');
  await queryInterface.dropTable('user_programs');

  console.log('Dropping workout_exercises table...');
  await queryInterface.dropTable('workout_exercises');

  console.log('Dropping program_workouts table...');
  await queryInterface.dropTable('program_workouts');

  console.log('Dropping programs table...');
  await queryInterface.dropTable('programs');

  console.log('✓ Program hierarchy tables dropped successfully!');
}

async function main() {
  try {
    await sequelize.authenticate();
    console.log('Database connected');

    const command = process.argv[2];

    if (command === 'up') {
      await up();
    } else if (command === 'down') {
      await down();
    } else {
      console.log('Usage: node create-program-tables.js [up|down]');
      process.exit(1);
    }

    await sequelize.close();
    console.log('Migration completed');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

main();
