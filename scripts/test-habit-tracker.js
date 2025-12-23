require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize } = require('../src/config/database');
const User = require('../src/models/user.model');
const Habit = require('../src/models/habit.model');
const HabitCompletion = require('../src/models/habitcompletion.model');

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  red: '\x1b[31m',
  magenta: '\x1b[35m'
};

const log = {
  success: (msg) => console.log(`${colors.green}✓ ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}✗ ${msg}${colors.reset}`),
  header: () => console.log(`\n${colors.bright}${colors.cyan}${'='.repeat(60)}${colors.reset}`),
  title: (msg) => console.log(`${colors.bright}${colors.magenta}${msg}${colors.reset}`),
  section: (msg) => console.log(`\n${colors.bright}${colors.blue}${msg}${colors.reset}`)
};

async function loginUser(email, password) {
  try {
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      log.error('User not found');
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      log.error('Invalid password');
      return null;
    }

    log.success(`Logged in as: ${user.name} (${user.email})`);
    return user;
  } catch (error) {
    log.error(`Login failed: ${error.message}`);
    return null;
  }
}

async function createSampleHabits(userId) {
  log.section('📝 Creating Sample Habits');

  const sampleHabits = [
    {
      userId,
      name: 'Morning Workout',
      description: 'Complete a 30-minute workout session',
      category: 'fitness',
      frequency: 'daily',
      targetCount: 1,
      icon: 'fitness',
      color: '#FF6B6B',
      reminderEnabled: true,
      reminderTime: '06:00:00'
    },
    {
      userId,
      name: 'Drink 8 Glasses of Water',
      description: 'Stay hydrated throughout the day',
      category: 'hydration',
      frequency: 'daily',
      targetCount: 8,
      icon: 'water',
      color: '#4ECDC4'
    },
    {
      userId,
      name: 'Eat Vegetables',
      description: 'Include vegetables in at least 2 meals',
      category: 'nutrition',
      frequency: 'daily',
      targetCount: 2,
      icon: 'nutrition',
      color: '#95E1D3'
    },
    {
      userId,
      name: 'Meditation',
      description: '10 minutes of mindfulness meditation',
      category: 'mindfulness',
      frequency: 'daily',
      targetCount: 1,
      icon: 'flower',
      color: '#A8E6CF'
    },
    {
      userId,
      name: 'Sleep 8 Hours',
      description: 'Get adequate rest for recovery',
      category: 'sleep',
      frequency: 'daily',
      targetCount: 1,
      icon: 'moon',
      color: '#FFD93D'
    },
    {
      userId,
      name: 'Read for 30 Minutes',
      description: 'Daily reading habit',
      category: 'productivity',
      frequency: 'daily',
      targetCount: 1,
      icon: 'book',
      color: '#6BCB77'
    }
  ];

  const createdHabits = [];
  for (const habitData of sampleHabits) {
    const habit = await Habit.create(habitData);
    createdHabits.push(habit);
    log.success(`Created habit: ${habit.name}`);
  }

  return createdHabits;
}

async function simulateHabitCompletions(habits) {
  log.section('✅ Simulating Habit Completions (Last 7 Days)');

  const today = new Date();
  const completions = [];

  for (let daysAgo = 6; daysAgo >= 0; daysAgo--) {
    const date = new Date(today);
    date.setDate(date.getDate() - daysAgo);
    const dateStr = date.toISOString().split('T')[0];

    log.info(`\nDay ${7 - daysAgo} (${dateStr}):`);

    for (const habit of habits) {
      const shouldComplete = Math.random() > 0.3;
      
      if (shouldComplete) {
        const completion = await HabitCompletion.create({
          habitId: habit.id,
          userId: habit.userId,
          completionDate: dateStr,
          completedAt: new Date(date),
          mood: ['great', 'good', 'okay'][Math.floor(Math.random() * 3)],
          difficulty: ['very_easy', 'easy', 'moderate'][Math.floor(Math.random() * 3)],
          value: habit.targetCount,
          notes: `Completed on ${dateStr}`
        });

        completions.push(completion);
        console.log(`  ${colors.green}✓${colors.reset} ${habit.name}`);
      } else {
        console.log(`  ${colors.red}✗${colors.reset} ${habit.name} (skipped)`);
      }
    }
  }

  return completions;
}

async function updateHabitStreaks(habits) {
  log.section('🔥 Calculating Streaks');

  for (const habit of habits) {
    const completions = await HabitCompletion.findAll({
      where: { habitId: habit.id },
      order: [['completionDate', 'DESC']],
      attributes: ['completionDate']
    });

    let currentStreak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let checkDate = new Date(today);
    
    const completionDates = new Set(
      completions.map(c => new Date(c.completionDate).toISOString().split('T')[0])
    );

    while (true) {
      const dateStr = checkDate.toISOString().split('T')[0];
      
      if (completionDates.has(dateStr)) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        if (currentStreak === 0 && dateStr === today.toISOString().split('T')[0]) {
          checkDate.setDate(checkDate.getDate() - 1);
          continue;
        }
        break;
      }
    }

    await habit.update({
      currentStreak,
      longestStreak: Math.max(habit.longestStreak, currentStreak),
      totalCompletions: completions.length,
      lastCompletedAt: completions.length > 0 ? completions[0].completionDate : null
    });

    console.log(`  ${habit.name}: ${colors.yellow}${currentStreak} day streak${colors.reset} (${completions.length} total completions)`);
  }
}

async function displayDashboard(userId) {
  log.header();
  log.title('📊 HABIT TRACKER DASHBOARD');
  log.header();

  const habits = await Habit.findAll({
    where: { userId, isActive: true },
    order: [['currentStreak', 'DESC']]
  });

  const today = new Date().toISOString().split('T')[0];
  const todayCompletions = await HabitCompletion.findAll({
    where: { userId, completionDate: today }
  });

  const completedHabitIds = new Set(todayCompletions.map(c => c.habitId));

  log.section('📈 Summary Statistics');
  console.log(`Total Active Habits: ${colors.bright}${habits.length}${colors.reset}`);
  console.log(`Completed Today: ${colors.green}${todayCompletions.length}${colors.reset}/${habits.length}`);
  console.log(`Completion Rate: ${colors.yellow}${((todayCompletions.length / habits.length) * 100).toFixed(1)}%${colors.reset}`);
  
  const totalStreak = habits.reduce((sum, h) => sum + h.currentStreak, 0);
  const totalCompletions = habits.reduce((sum, h) => sum + h.totalCompletions, 0);
  console.log(`Total Streak Days: ${colors.yellow}${totalStreak}${colors.reset}`);
  console.log(`Total Completions: ${colors.bright}${totalCompletions}${colors.reset}`);

  log.section('🎯 Your Habits');
  for (const habit of habits) {
    const completedToday = completedHabitIds.has(habit.id);
    const statusIcon = completedToday ? '✅' : '⬜';
    const streakEmoji = habit.currentStreak >= 7 ? '🔥' : habit.currentStreak >= 3 ? '⭐' : '';
    
    console.log(`\n${statusIcon} ${colors.bright}${habit.name}${colors.reset} ${streakEmoji}`);
    console.log(`   Category: ${habit.category} | Frequency: ${habit.frequency}`);
    console.log(`   Current Streak: ${colors.yellow}${habit.currentStreak} days${colors.reset} | Longest: ${habit.longestStreak} days`);
    console.log(`   Total Completions: ${habit.totalCompletions}`);
  }

  log.section('📅 Weekly Progress');
  const last7Days = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    const dayCompletions = await HabitCompletion.count({
      where: { userId, completionDate: dateStr }
    });

    const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()];
    const rate = habits.length > 0 ? ((dayCompletions / habits.length) * 100).toFixed(0) : 0;
    const bar = '█'.repeat(Math.floor(rate / 10));
    
    console.log(`${dayName} ${dateStr}: ${colors.green}${bar}${colors.reset} ${rate}% (${dayCompletions}/${habits.length})`);
  }

  log.section('🏆 Top Performers');
  const topHabits = habits.slice(0, 3);
  topHabits.forEach((habit, index) => {
    const medal = ['🥇', '🥈', '🥉'][index];
    console.log(`${medal} ${habit.name} - ${habit.currentStreak} day streak`);
  });

  const categoryBreakdown = habits.reduce((acc, habit) => {
    acc[habit.category] = (acc[habit.category] || 0) + 1;
    return acc;
  }, {});

  log.section('📊 Category Breakdown');
  Object.entries(categoryBreakdown).forEach(([category, count]) => {
    console.log(`${category}: ${count} habit${count > 1 ? 's' : ''}`);
  });
}

async function displayHabitStatistics(habit) {
  log.header();
  log.title(`📊 STATISTICS: ${habit.name.toUpperCase()}`);
  log.header();

  const completions = await HabitCompletion.findAll({
    where: { habitId: habit.id },
    order: [['completionDate', 'DESC']],
    limit: 30
  });

  const days = 30;
  const completionRate = (completions.length / days) * 100;

  log.section('📈 Overview');
  console.log(`Total Completions (30 days): ${colors.bright}${completions.length}${colors.reset}`);
  console.log(`Completion Rate: ${colors.yellow}${completionRate.toFixed(1)}%${colors.reset}`);
  console.log(`Current Streak: ${colors.green}${habit.currentStreak} days${colors.reset}`);
  console.log(`Longest Streak: ${colors.yellow}${habit.longestStreak} days${colors.reset}`);

  const moodDistribution = completions.reduce((acc, c) => {
    if (c.mood) acc[c.mood] = (acc[c.mood] || 0) + 1;
    return acc;
  }, {});

  if (Object.keys(moodDistribution).length > 0) {
    log.section('😊 Mood Distribution');
    Object.entries(moodDistribution).forEach(([mood, count]) => {
      const percentage = ((count / completions.length) * 100).toFixed(1);
      console.log(`${mood}: ${count} (${percentage}%)`);
    });
  }

  const difficultyDistribution = completions.reduce((acc, c) => {
    if (c.difficulty) acc[c.difficulty] = (acc[c.difficulty] || 0) + 1;
    return acc;
  }, {});

  if (Object.keys(difficultyDistribution).length > 0) {
    log.section('💪 Difficulty Distribution');
    Object.entries(difficultyDistribution).forEach(([difficulty, count]) => {
      const percentage = ((count / completions.length) * 100).toFixed(1);
      console.log(`${difficulty}: ${count} (${percentage}%)`);
    });
  }
}

async function main() {
  try {
    await sequelize.authenticate();
    log.success('Database connected');

    log.header();
    log.title('🔐 LOGIN');
    log.header();

    const email = 'admin@arifworkout.com';
    const password = 'admin123';
    
    log.info(`Attempting login with: ${email}`);
    
    const user = await loginUser(email, password);
    
    if (!user) {
      log.error('Login failed. Please check credentials.');
      process.exit(1);
    }

    await Habit.destroy({ where: { userId: user.id } });
    await HabitCompletion.destroy({ where: { userId: user.id } });
    log.info('Cleared existing habits');

    const habits = await createSampleHabits(user.id);
    
    await simulateHabitCompletions(habits);
    
    await updateHabitStreaks(habits);
    
    await displayDashboard(user.id);

    if (habits.length > 0) {
      await displayHabitStatistics(habits[0]);
    }

    log.header();
    log.success('✅ Habit Tracker Test Completed Successfully!');
    log.header();

    log.section('📝 API Endpoints Available:');
    console.log('POST   /api/habits - Create a new habit');
    console.log('GET    /api/habits - Get all habits');
    console.log('GET    /api/habits/dashboard - Get dashboard summary');
    console.log('GET    /api/habits/:habitId - Get specific habit');
    console.log('PUT    /api/habits/:habitId - Update habit');
    console.log('DELETE /api/habits/:habitId - Delete habit');
    console.log('POST   /api/habits/:habitId/complete - Mark habit as completed');
    console.log('POST   /api/habits/:habitId/uncomplete - Remove completion');
    console.log('GET    /api/habits/:habitId/statistics - Get habit statistics');

  } catch (error) {
    log.error(`Error: ${error.message}`);
    console.error(error);
  } finally {
    await sequelize.close();
    log.info('Database connection closed');
  }
}

main();
