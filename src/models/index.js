const { sequelize } = require('../config/database');

// Import all models (CONVERTED TO SEQUELIZE)
const User = require('./user.model');
const OTP = require('./otp.model');
const Category = require('./category.model');
const Subcategory = require('./subcategory.model');
const InstructorProfile = require('./instructor.model');
const Package = require('./package.model');
const Payment = require('./payment.model');
const Subscription = require('./subscription.model');

// NEW: Fitness-focused models
const WorkoutPlan = require('./workoutplan.model');
const Exercise = require('./exercise.model');
const UserWorkout = require('./userworkout.model');
const NutritionLog = require('./nutrition.model');
const NutritionItem = require('./nutritionitem.model');
const BodyMeasurement = require('./bodymeasurement.model');
const FitnessGoal = require('./fitnessgoal.model');
const FitnessAssessment = require('./fitnessassessment.model');
const Achievement = require('./achievement.model');
const ExerciseImage = require('./exerciseimage.model');
const MotivationalMessage = require('./motivationalmessage.model');
const Badge = require('./badge.model');
const UserSurvey = require('./usersurvey.model');
const AIWorkoutPlan = require('./aiworkoutplan.model');
const Advertisement = require('./advertisement.model');


// TODO: Convert these models to Sequelize
// const Media = require('./media.model');
// const Workout = require('./workout.model');
// const Course = require('./course.model');
// const Order = require('./order.model');
// const FoodLog = require('./foodlog.model');
// const ActivityLog = require('./activitylog.model');
// const WorkoutProgress = require('./workoutprogress.model');

// Define relationships

// User <-> OTP
User.hasMany(OTP, { foreignKey: 'userId', as: 'otps' });
OTP.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// User <-> Category
User.hasMany(Category, { foreignKey: 'createdBy', as: 'categories' });
Category.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });

// Category <-> Subcategory
Category.hasMany(Subcategory, { foreignKey: 'categoryId', as: 'subcategories' });
Subcategory.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

// User <-> Subcategory
User.hasMany(Subcategory, { foreignKey: 'createdBy', as: 'subcategories' });
Subcategory.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });

// User <-> InstructorProfile
User.hasOne(InstructorProfile, { foreignKey: 'userId', as: 'instructorProfile' });
InstructorProfile.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// User <-> Package
User.hasMany(Package, { foreignKey: 'createdByAdmin', as: 'packages' });
Package.belongsTo(User, { foreignKey: 'createdByAdmin', as: 'admin' });

// Category <-> Package
Category.hasMany(Package, { foreignKey: 'categoryId', as: 'packages' });
Package.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

// User <-> Payment
User.hasMany(Payment, { foreignKey: 'userId', as: 'payments' });
Payment.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// User <-> Subscription
User.hasMany(Subscription, { foreignKey: 'userId', as: 'subscriptions' });
Subscription.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Package <-> Subscription
Package.hasMany(Subscription, { foreignKey: 'packageId', as: 'subscriptions' });
Subscription.belongsTo(Package, { foreignKey: 'packageId', as: 'package' });

// Payment <-> Subscription
Payment.hasMany(Subscription, { foreignKey: 'paymentMethod', as: 'subscriptions' });
Subscription.belongsTo(Payment, { foreignKey: 'paymentMethod', as: 'payment' });

// NEW: Fitness model relationships

// User <-> WorkoutPlan
User.hasMany(WorkoutPlan, { foreignKey: 'userId', as: 'workoutPlans' });
WorkoutPlan.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(WorkoutPlan, { foreignKey: 'instructorId', as: 'createdPlans' });
WorkoutPlan.belongsTo(User, { foreignKey: 'instructorId', as: 'instructor' });

// User <-> Exercise
User.hasMany(Exercise, { foreignKey: 'createdBy', as: 'exercises' });
Exercise.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });

// User <-> UserWorkout
User.hasMany(UserWorkout, { foreignKey: 'userId', as: 'userWorkouts' });
UserWorkout.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// WorkoutPlan <-> UserWorkout
WorkoutPlan.hasMany(UserWorkout, { foreignKey: 'workoutPlanId', as: 'workouts' });
UserWorkout.belongsTo(WorkoutPlan, { foreignKey: 'workoutPlanId', as: 'plan' });

// Exercise <-> UserWorkout
Exercise.hasMany(UserWorkout, { foreignKey: 'exerciseId', as: 'userWorkouts' });
UserWorkout.belongsTo(Exercise, { foreignKey: 'exerciseId', as: 'exercise' });

// User <-> NutritionLog
User.hasMany(NutritionLog, { foreignKey: 'userId', as: 'nutritionLogs' });
NutritionLog.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// User <-> NutritionItem
User.hasMany(NutritionItem, { foreignKey: 'createdBy', as: 'nutritionItems' });
NutritionItem.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });

// User <-> BodyMeasurement
User.hasMany(BodyMeasurement, { foreignKey: 'userId', as: 'bodyMeasurements' });
BodyMeasurement.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// User <-> FitnessGoal
User.hasMany(FitnessGoal, { foreignKey: 'userId', as: 'fitnessGoals' });
FitnessGoal.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// User <-> FitnessAssessment
User.hasMany(FitnessAssessment, { foreignKey: 'userId', as: 'fitnessAssessments' });
FitnessAssessment.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(FitnessAssessment, { foreignKey: 'assessedBy', as: 'conductedAssessments' });
FitnessAssessment.belongsTo(User, { foreignKey: 'assessedBy', as: 'assessor' });

// User <-> Achievement
User.hasMany(Achievement, { foreignKey: 'userId', as: 'achievements' });
Achievement.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// User <-> ExerciseImage
User.hasMany(ExerciseImage, { foreignKey: 'uploadedBy', as: 'uploadedImages' });
ExerciseImage.belongsTo(User, { foreignKey: 'uploadedBy', as: 'uploader' });

// Exercise <-> ExerciseImage
Exercise.hasMany(ExerciseImage, { foreignKey: 'exerciseId', as: 'images' });
ExerciseImage.belongsTo(Exercise, { foreignKey: 'exerciseId', as: 'exercise' });

// User <-> NutritionImage
User.hasMany(NutritionImage, { foreignKey: 'uploadedBy', as: 'nutritionImages' });
NutritionImage.belongsTo(User, { foreignKey: 'uploadedBy', as: 'uploader' });

// NutritionItem <-> NutritionImage
NutritionItem.hasMany(NutritionImage, { foreignKey: 'nutritionItemId', as: 'images' });
NutritionImage.belongsTo(NutritionItem, { foreignKey: 'nutritionItemId', as: 'nutritionItem' });


// User <-> MotivationalMessage
User.hasMany(MotivationalMessage, { foreignKey: 'createdBy', as: 'motivationalMessages' });
MotivationalMessage.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });

// User <-> UserSurvey
User.hasMany(UserSurvey, { foreignKey: 'userId', as: 'surveys' });
UserSurvey.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// User <-> AIWorkoutPlan
User.hasMany(AIWorkoutPlan, { foreignKey: 'userId', as: 'aiWorkoutPlans' });
AIWorkoutPlan.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// UserSurvey <-> AIWorkoutPlan
UserSurvey.hasMany(AIWorkoutPlan, { foreignKey: 'surveyId', as: 'generatedPlans' });
AIWorkoutPlan.belongsTo(UserSurvey, { foreignKey: 'surveyId', as: 'survey' });

// User (reviewer) <-> AIWorkoutPlan
User.hasMany(AIWorkoutPlan, { foreignKey: 'reviewedBy', as: 'reviewedPlans' });
AIWorkoutPlan.belongsTo(User, { foreignKey: 'reviewedBy', as: 'reviewer' });

// User <-> Advertisement
User.hasMany(Advertisement, { foreignKey: 'createdBy', as: 'createdAdvertisements' });
Advertisement.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });
User.hasMany(Advertisement, { foreignKey: 'approvedBy', as: 'approvedAdvertisements' });
Advertisement.belongsTo(User, { foreignKey: 'approvedBy', as: 'approver' });

// TODO: Add relationships for unconverted models once they're converted
// User.hasMany(Course, { foreignKey: 'instructorId', as: 'courses' });
// User.hasMany(Order, { foreignKey: 'userId', as: 'orders' });

// Export all models and sequelize
module.exports = {
  sequelize,
  User,
  OTP,
  Category,
  Subcategory,
  InstructorProfile,
  Package,
  Payment,
  Subscription,
  // NEW: Fitness models
  WorkoutPlan,
  Exercise,
  UserWorkout,
  NutritionLog,
  NutritionItem,
  BodyMeasurement,
  FitnessGoal,
  FitnessAssessment,
  Achievement,
  ExerciseImage,
  NutritionImage,
  MotivationalMessage,
  Badge,
  UserSurvey,
  AIWorkoutPlan,
  Advertisement
  // TODO: Export these once converted
  // Media,
  // Workout,
  // Course,
  // Order
};
