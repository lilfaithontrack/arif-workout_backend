require('dotenv').config();
const { sequelize } = require('../config/database');

async function up() {
  const queryInterface = sequelize.getQueryInterface();

  console.log('Creating habits table...');
  await queryInterface.createTable('habits', {
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
    name: {
      type: 'VARCHAR(255)',
      allowNull: false
    },
    description: {
      type: 'TEXT',
      allowNull: true
    },
    category: {
      type: "ENUM('fitness', 'nutrition', 'sleep', 'hydration', 'mindfulness', 'productivity', 'health', 'custom')",
      allowNull: false,
      defaultValue: 'custom'
    },
    frequency: {
      type: "ENUM('daily', 'weekly', 'monthly')",
      allowNull: false,
      defaultValue: 'daily'
    },
    targetCount: {
      type: 'INTEGER',
      allowNull: false,
      defaultValue: 1
    },
    icon: {
      type: 'VARCHAR(50)',
      allowNull: true
    },
    color: {
      type: 'VARCHAR(20)',
      allowNull: true
    },
    reminderEnabled: {
      type: 'BOOLEAN',
      defaultValue: false
    },
    reminderTime: {
      type: 'TIME',
      allowNull: true
    },
    currentStreak: {
      type: 'INTEGER',
      defaultValue: 0
    },
    longestStreak: {
      type: 'INTEGER',
      defaultValue: 0
    },
    totalCompletions: {
      type: 'INTEGER',
      defaultValue: 0
    },
    lastCompletedAt: {
      type: 'DATETIME',
      allowNull: true
    },
    startDate: {
      type: 'DATE',
      allowNull: false
    },
    isActive: {
      type: 'BOOLEAN',
      defaultValue: true
    },
    isArchived: {
      type: 'BOOLEAN',
      defaultValue: false
    },
    notes: {
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

  console.log('Creating indexes for habits table...');
  await queryInterface.addIndex('habits', ['userId']);
  await queryInterface.addIndex('habits', ['category']);
  await queryInterface.addIndex('habits', ['isActive']);
  await queryInterface.addIndex('habits', ['startDate']);

  console.log('Creating habit_completions table...');
  await queryInterface.createTable('habit_completions', {
    id: {
      type: 'INTEGER',
      primaryKey: true,
      autoIncrement: true
    },
    habitId: {
      type: 'INTEGER',
      allowNull: false,
      references: {
        model: 'habits',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
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
    completedAt: {
      type: 'DATETIME',
      allowNull: false
    },
    completionDate: {
      type: 'DATE',
      allowNull: false
    },
    notes: {
      type: 'TEXT',
      allowNull: true
    },
    mood: {
      type: "ENUM('great', 'good', 'okay', 'bad', 'terrible')",
      allowNull: true
    },
    difficulty: {
      type: "ENUM('very_easy', 'easy', 'moderate', 'hard', 'very_hard')",
      allowNull: true
    },
    value: {
      type: 'INTEGER',
      allowNull: true
    },
    metadata: {
      type: 'JSON',
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

  console.log('Creating indexes for habit_completions table...');
  await queryInterface.addIndex('habit_completions', ['habitId']);
  await queryInterface.addIndex('habit_completions', ['userId']);
  await queryInterface.addIndex('habit_completions', ['completionDate']);
  await queryInterface.addIndex('habit_completions', ['completedAt']);

  console.log('✓ Habit tracker tables created successfully!');
}

async function down() {
  const queryInterface = sequelize.getQueryInterface();

  console.log('Dropping habit_completions table...');
  await queryInterface.dropTable('habit_completions');

  console.log('Dropping habits table...');
  await queryInterface.dropTable('habits');

  console.log('✓ Habit tracker tables dropped successfully!');
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
      console.log('Usage: node create-habit-tables.js [up|down]');
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
