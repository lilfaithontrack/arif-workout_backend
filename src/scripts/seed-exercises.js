require('dotenv').config();
const { sequelize, Exercise } = require('../models');

const sampleExercises = [
  // Strength - Chest
  {
    name: 'Barbell Bench Press',
    slug: 'barbell-bench-press',
    description: 'Classic compound exercise for building chest, shoulders, and triceps strength.',
    category: 'strength',
    muscleGroups: ['chest', 'shoulders', 'triceps'],
    equipment: ['barbell', 'bench'],
    difficulty: 'intermediate',
    instructions: [
      'Lie flat on bench with feet on floor',
      'Grip barbell slightly wider than shoulder width',
      'Lower bar to mid-chest with control',
      'Press bar up until arms are fully extended',
      'Repeat for desired reps'
    ],
    caloriesBurnedPerMinute: 7.5,
    sets: 4,
    reps: 8,
    restTime: 90,
    tips: [
      'Keep shoulder blades retracted',
      'Maintain natural arch in lower back',
      'Control the weight on the way down',
      'Use a spotter for heavy weights'
    ],
    variations: ['Incline Bench Press', 'Decline Bench Press', 'Close-Grip Bench Press'],
    isActive: true
  },
  {
    name: 'Push-Ups',
    slug: 'push-ups',
    description: 'Bodyweight exercise for chest, shoulders, and core strength.',
    category: 'strength',
    muscleGroups: ['chest', 'shoulders', 'triceps', 'core'],
    equipment: ['bodyweight'],
    difficulty: 'beginner',
    instructions: [
      'Start in plank position with hands shoulder-width apart',
      'Lower body until chest nearly touches floor',
      'Keep core tight and body straight',
      'Push back up to starting position',
      'Repeat for desired reps'
    ],
    caloriesBurnedPerMinute: 8,
    sets: 3,
    reps: 15,
    restTime: 60,
    tips: [
      'Keep elbows at 45-degree angle',
      'Don\'t let hips sag',
      'Breathe out as you push up',
      'Maintain neutral spine'
    ],
    variations: ['Diamond Push-Ups', 'Wide Push-Ups', 'Decline Push-Ups', 'Knee Push-Ups'],
    isActive: true
  },
  
  // Strength - Back
  {
    name: 'Deadlift',
    slug: 'deadlift',
    description: 'King of exercises for overall strength and muscle building.',
    category: 'strength',
    muscleGroups: ['back', 'legs', 'core', 'glutes'],
    equipment: ['barbell'],
    difficulty: 'advanced',
    instructions: [
      'Stand with feet hip-width apart, bar over mid-foot',
      'Bend down and grip bar just outside legs',
      'Keep chest up, back straight, core tight',
      'Drive through heels to lift bar',
      'Stand fully upright, then lower with control'
    ],
    caloriesBurnedPerMinute: 10,
    sets: 4,
    reps: 5,
    restTime: 120,
    tips: [
      'Keep bar close to body throughout',
      'Don\'t round your back',
      'Use proper form over heavy weight',
      'Engage lats before lifting'
    ],
    variations: ['Sumo Deadlift', 'Romanian Deadlift', 'Trap Bar Deadlift'],
    isActive: true
  },
  {
    name: 'Pull-Ups',
    slug: 'pull-ups',
    description: 'Bodyweight exercise for back and bicep development.',
    category: 'strength',
    muscleGroups: ['back', 'biceps', 'shoulders'],
    equipment: ['pull_up_bar'],
    difficulty: 'intermediate',
    instructions: [
      'Hang from bar with overhand grip, hands shoulder-width',
      'Pull yourself up until chin clears bar',
      'Lower with control to full extension',
      'Repeat for desired reps'
    ],
    caloriesBurnedPerMinute: 9,
    sets: 3,
    reps: 8,
    restTime: 90,
    tips: [
      'Avoid swinging or kipping',
      'Engage core throughout',
      'Full range of motion',
      'Use assistance band if needed'
    ],
    variations: ['Chin-Ups', 'Wide-Grip Pull-Ups', 'Neutral-Grip Pull-Ups'],
    isActive: true
  },
  
  // Strength - Legs
  {
    name: 'Barbell Squat',
    slug: 'barbell-squat',
    description: 'Fundamental lower body compound exercise.',
    category: 'strength',
    muscleGroups: ['legs', 'glutes', 'core'],
    equipment: ['barbell', 'squat_rack'],
    difficulty: 'intermediate',
    instructions: [
      'Position bar on upper back, feet shoulder-width',
      'Keep chest up and core tight',
      'Lower by bending knees and hips',
      'Go down until thighs parallel to floor',
      'Drive through heels to stand'
    ],
    caloriesBurnedPerMinute: 9.5,
    sets: 4,
    reps: 10,
    restTime: 90,
    tips: [
      'Keep knees tracking over toes',
      'Maintain neutral spine',
      'Don\'t let knees cave inward',
      'Breathe properly'
    ],
    variations: ['Front Squat', 'Goblet Squat', 'Bulgarian Split Squat'],
    isActive: true
  },
  
  // Cardio
  {
    name: 'Running',
    slug: 'running',
    description: 'Classic cardiovascular exercise for endurance and fat loss.',
    category: 'cardio',
    muscleGroups: ['legs', 'core'],
    equipment: ['none'],
    difficulty: 'beginner',
    instructions: [
      'Start with 5-minute warm-up walk',
      'Maintain steady pace',
      'Keep upright posture',
      'Land mid-foot, not heel',
      'Cool down with 5-minute walk'
    ],
    caloriesBurnedPerMinute: 11,
    duration: 1800,
    tips: [
      'Start slow and build up',
      'Proper running shoes essential',
      'Stay hydrated',
      'Listen to your body'
    ],
    variations: ['Interval Running', 'Hill Sprints', 'Treadmill Running'],
    isActive: true
  },
  {
    name: 'Jump Rope',
    slug: 'jump-rope',
    description: 'High-intensity cardio exercise for coordination and endurance.',
    category: 'cardio',
    muscleGroups: ['legs', 'shoulders', 'core'],
    equipment: ['jump_rope'],
    difficulty: 'beginner',
    instructions: [
      'Hold rope handles at hip height',
      'Jump with both feet together',
      'Use wrists to rotate rope',
      'Land softly on balls of feet',
      'Maintain steady rhythm'
    ],
    caloriesBurnedPerMinute: 13,
    duration: 600,
    tips: [
      'Keep jumps low',
      'Relax shoulders',
      'Use proper length rope',
      'Start with short intervals'
    ],
    variations: ['Double Unders', 'Single Leg Jumps', 'Criss-Cross'],
    isActive: true
  },
  
  // Core
  {
    name: 'Plank',
    slug: 'plank',
    description: 'Isometric core strengthening exercise.',
    category: 'strength',
    muscleGroups: ['core', 'shoulders'],
    equipment: ['bodyweight'],
    difficulty: 'beginner',
    instructions: [
      'Start in forearm plank position',
      'Keep body in straight line',
      'Engage core and glutes',
      'Hold position without sagging',
      'Breathe steadily'
    ],
    caloriesBurnedPerMinute: 5,
    duration: 60,
    tips: [
      'Don\'t let hips drop',
      'Keep neck neutral',
      'Squeeze glutes',
      'Start with shorter holds'
    ],
    variations: ['Side Plank', 'Plank with Leg Lift', 'Plank Jacks'],
    isActive: true
  },
  
  // Flexibility
  {
    name: 'Yoga Sun Salutation',
    slug: 'yoga-sun-salutation',
    description: 'Flowing yoga sequence for flexibility and mindfulness.',
    category: 'yoga',
    muscleGroups: ['full_body'],
    equipment: ['yoga_mat'],
    difficulty: 'beginner',
    instructions: [
      'Start in mountain pose',
      'Raise arms overhead',
      'Forward fold',
      'Half lift',
      'Plank to chaturanga',
      'Upward dog',
      'Downward dog',
      'Step forward and rise'
    ],
    caloriesBurnedPerMinute: 4,
    duration: 300,
    tips: [
      'Move with breath',
      'Modify as needed',
      'Focus on form',
      'Stay present'
    ],
    variations: ['Sun Salutation A', 'Sun Salutation B', 'Sun Salutation C'],
    isActive: true
  },
  
  // HIIT
  {
    name: 'Burpees',
    slug: 'burpees',
    description: 'Full-body high-intensity exercise.',
    category: 'hiit',
    muscleGroups: ['full_body'],
    equipment: ['bodyweight'],
    difficulty: 'intermediate',
    instructions: [
      'Start standing',
      'Drop into squat, hands on floor',
      'Jump feet back to plank',
      'Do a push-up',
      'Jump feet back to squat',
      'Explode up with jump'
    ],
    caloriesBurnedPerMinute: 12,
    sets: 3,
    reps: 10,
    restTime: 60,
    tips: [
      'Maintain good form',
      'Land softly',
      'Modify by removing jump',
      'Pace yourself'
    ],
    variations: ['Half Burpees', 'Burpee Box Jumps', 'Burpee Pull-Ups'],
    isActive: true
  }
];

async function seedExercises() {
  try {
    await sequelize.sync();
    
    console.log('Seeding exercises...');
    
    for (const exercise of sampleExercises) {
      const [created, wasCreated] = await Exercise.findOrCreate({
        where: { slug: exercise.slug },
        defaults: exercise
      });
      
      if (wasCreated) {
        console.log(`✅ Created: ${exercise.name}`);
      } else {
        console.log(`⏭️  Already exists: ${exercise.name}`);
      }
    }
    
    console.log('\n🎉 Exercise seeding completed!');
    console.log(`Total exercises in database: ${await Exercise.count()}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding exercises:', error);
    process.exit(1);
  }
}

seedExercises();
