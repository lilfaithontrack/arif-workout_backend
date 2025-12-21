require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const passport = require('./config/passport');
const { connectDB } = require('./config/database');
const { errorHandler, notFound } = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./routes/auth.routes');
const courseRoutes = require('./routes/course.routes');
const packageRoutes = require('./routes/package.routes');
const workoutRoutes = require('./routes/workout.routes');
const adminRoutes = require('./routes/admin.routes');
const instructorRoutes = require('./routes/instructor.routes');
const paymentRoutes = require('./routes/payment.routes');
const trackerRoutes = require('./routes/tracker.routes');
const managerRoutes = require('./routes/manager.routes');
const webhookRoutes = require('./routes/webhook.routes');

// NEW: Fitness routes
const workoutPlanRoutes = require('./routes/workoutplan.routes');
const exerciseRoutes = require('./routes/exercise.routes');
const userWorkoutRoutes = require('./routes/userworkout.routes');
const nutritionRoutes = require('./routes/nutrition.routes');
const nutritionItemRoutes = require('./routes/nutritionitem.routes');
const bodyMeasurementRoutes = require('./routes/bodymeasurement.routes');
const subscriptionRoutes = require('./routes/subscription.routes');
const messageRoutes = require('./routes/message.routes');
const badgeRoutes = require('./routes/badge.routes');
const aiWorkoutRoutes = require('./routes/aiworkout.routes');
const workoutGeneratorRoutes = require('./routes/workout-generator.routes');
const nutritionGeneratorRoutes = require('./routes/nutrition-generator.routes');
const advertisementRoutes = require('./routes/advertisement.routes');
const nutritionUploadRoutes = require('./routes/nutrition-upload.routes');


// Initialize express app
const app = express();

// Connect to database
connectDB();

// Trust proxy (for rate limiting behind reverse proxy)
app.set('trust proxy', 1);

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting to all routes
app.use('/api/', limiter);

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" } // Allow images to load cross-origin
})); // Security headers
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:8081',
    'http://localhost:8080',
    'https://admin.arifworkout.com',
    'http://admin.arifworkout.com',
    process.env.CORS_ORIGIN
  ].filter(Boolean),
  credentials: true
}));

// Webhook routes (must be before express.json())
app.use('/api/webhooks', webhookRoutes);

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Initialize Passport
app.use(passport.initialize());

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Serve static files with CORS (exercise images)
app.use('/images', cors(), express.static('public/images'));

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/workouts', userWorkoutRoutes); // User workout logging
app.use('/api/admin', adminRoutes);
app.use('/api/instructors', instructorRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/tracker', trackerRoutes);
app.use('/api/manager', managerRoutes);

// NEW: Fitness API Routes
app.use('/api/workout-plans', workoutPlanRoutes);
app.use('/api/exercises', exerciseRoutes);
app.use('/api/nutrition', nutritionRoutes); // Nutrition logs (user tracking)
app.use('/api/nutrition-items', nutritionItemRoutes); // Nutrition database (food items)
app.use('/api/measurements', bodyMeasurementRoutes);
app.use('/api/admin/subscriptions', subscriptionRoutes); // Admin subscription management
app.use('/api/messages', messageRoutes);
app.use('/api/badges', badgeRoutes);
app.use('/api/ai-workout', aiWorkoutRoutes); // AI workout plan generation
app.use('/api/workout-generator', workoutGeneratorRoutes); // Workout generator based on survey
app.use('/api/nutrition-generator', nutritionGeneratorRoutes); // Nutrition generator based on survey
app.use('/api/advertisements', advertisementRoutes); // Advertisement management
app.use('/api/nutrition-upload', nutritionUploadRoutes); // Nutrition image upload


// Root route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Arif Workout API',
    version: '1.0.0',
    documentation: '/api/docs'
  });
});

// 404 handler
app.use(notFound);

// Error handler (must be last)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════╗
║   Arif Workout API Server Running    ║
║   Environment: ${process.env.NODE_ENV || 'development'}              ║
║   Port: ${PORT}                          ║
║   URL: http://localhost:${PORT}         ║
╚═══════════════════════════════════════╝
  `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  server.close(() => process.exit(1));
});

module.exports = app;
