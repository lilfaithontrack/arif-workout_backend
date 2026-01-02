# Arif's Apex Fitness - Backend API

> A comprehensive fitness platform backend with AI-powered workout generation, nutritional tracking, and social features built with Node.js, Express, and MySQL.

## 🌟 Features

### Authentication & Security
- **Email/Password Authentication** with OTP verification
- **OAuth Integration** (Google, Facebook)
- **JWT-based** session management
- **Role-based Access Control** (Admin, Manager, Instructor, Student)
- **Rate Limiting** and security headers

### Fitness & Workout Management
- **AI-Powered Workout Generator** - Personalized workout plans based on user goals
- **Exercise Library** - Comprehensive database with images and videos
- **Workout Tracking** - Log exercises, sets, reps, and weight
- **Progress Monitoring** - Track fitness journey with detailed analytics
- **Video Tutorials** - High-quality exercise demonstrations

### Nutrition System
- **Meal Planning** - AI-generated nutrition plans
- **Calorie Tracking** - Monitor daily intake
- **Macro Calculator** - Protein, carbs, fats tracking
- **Recipe Database** - Healthy meal ideas

### Social Features
- **User Profiles** - Customizable fitness profiles
- **Progress Sharing** - Share achievements
- **Community Engagement** - Connect with other fitness enthusiasts

### E-commerce
- **Subscription Management** - Multiple membership tiers
- **Package System** - Premium workout programs
- **Stripe Integration** - Secure payments
- **Advertisement System** - Promotional content management

### Admin Dashboard
- **User Management** - Manage users and roles
- **Content Moderation** - Exercise and workout approval
- **Analytics** - Platform usage statistics
- **Image Management** - Upload and manage media assets

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MySQL (v8 or higher)
- Gmail account (for email OTP)
- Google Cloud Console account (for OAuth)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Set up database**
   ```bash
   # Create MySQL database
   mysql -u root -p
   CREATE DATABASE arif_workout;
   exit;

   # Sync database schema
   npm run db:sync
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

Server runs on `http://localhost:5000`

---

## 📋 Environment Variables

```env
# Server
PORT=5000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=arif_workout
DB_USER=root
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# Email (SMTP - arifworkout.com)
# Google SMTP Configuration (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=contact@arifworkout.com
EMAIL_PASSWORD=your-16-char-app-password
EMAIL_FROM="ARIF WORK OUT" <contact@arifworkout.com>
EMAIL_FROM="ARIF WORK OUT <support@arifworkout.com>"

# OTP Settings
OTP_EXPIRY_MINUTES=10

# OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Frontend
FRONTEND_URL=http://localhost:5173

# Payment
STRIPE_SECRET_KEY=your-stripe-key
```

---

## 📚 API Documentation

### Authentication

#### Sign Up (Email)
```http
POST /api/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Verify OTP
```http
POST /api/auth/verify-otp
Content-Type: application/json

{
  "email": "john@example.com",
  "otpCode": "123456"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Google OAuth
```http
GET /api/auth/google
```

### Exercises

#### Get All Exercises
```http
GET /api/exercises
Authorization: Bearer <token>
```

#### Get Exercise by ID
```http
GET /api/exercises/:id
Authorization: Bearer <token>
```

#### Create Exercise (Admin)
```http
POST /api/exercises
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Bench Press",
  "muscleGroup": "chest",
  "equipment": "barbell",
  "difficulty": "intermediate"
}
```

### Workouts

#### Generate AI Workout
```http
POST /api/workouts/generate
Authorization: Bearer <token>
Content-Type: application/json

{
  "goal": "build_muscle",
  "trainingDays": 4,
  "location": "gym",
  "level": "intermediate"
}
```

#### Get User Workouts
```http
GET /api/workouts/user
Authorization: Bearer <token>
```

For complete API documentation, see [FITNESS_API_DOCUMENTATION.md](./FITNESS_API_DOCUMENTATION.md)

---

## 🗄️ Database Schema

### Core Models
- **User** - User accounts and profiles
- **Role** - User roles (student, instructor, admin, etc.)
- **Exercise** - Exercise database
- **Workout** - Workout plans
- **WorkoutSession** - Training sessions
- **Package** - Subscription packages
- **Order** - Purchase records
- **Advertisement** - Promotional content

### AI Models
- **WorkoutGenerator** - AI workout generation history
- **NutritionGenerator** - AI meal plan generation

See [DATABASE_SETUP_GUIDE.md](./DATABASE_SETUP_GUIDE.md) for detailed schema.

---

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MySQL + Sequelize ORM
- **Authentication:** JWT, Passport.js (Google OAuth, Facebook OAuth)
- **Email:** Nodemailer (Google Workspace SMTP)
- **File Upload:** Multer
- **Payment:** Stripe
- **Validation:** Express Validator
- **Security:** Helmet, bcrypt, Rate Limiting

---

## 📁 Project Structure

```
backend/
├── src/
│   ├── server.js              # Application entry point
│   ├── config/
│   │   ├── database.js        # Database configuration
│   │   ├── multer.js          # File upload config
│   │   └── passport.js        # OAuth strategies
│   ├── models/                # Sequelize models
│   ├── controllers/           # Route controllers
│   ├── routes/                # API routes
│   ├── middlewares/           # Custom middleware
│   ├── services/              # Business logic
│   ├── utils/                 # Helper functions
│   ├── migrations/            # Database migrations
│   └── scripts/               # Utility scripts
├── public/                    # Static files
│   └── images/               # User uploads
├── .env.example              # Environment template
└── package.json
```

---

## 🔐 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Rate limiting on authentication routes
- Helmet.js security headers
- CORS configuration
- Input validation and sanitization
- OTP email verification
- Role-based access control

---

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

---

## 📖 Additional Documentation

All comprehensive documentation is available in the [`docs`](./docs) folder:

**Getting Started:**
- [Quick Start Guide](./docs/QUICKSTART.md)
- [Setup Guide](./docs/SETUP_GUIDE.md)
- [Quick Reference](./docs/QUICK_REFERENCE.md)

**Authentication:**
- [OTP Authentication Guide](./docs/OTP_AUTHENTICATION_GUIDE.md)
- [OAuth Setup Guide](./docs/OAUTH_AUTHENTICATION_GUIDE.md)
- [Google Workspace SMTP Setup](./docs/GOOGLE_WORKSPACE_SMTP_SETUP.md)

**Features:**
- [AI Workout System](./docs/AI_WORKOUT_SYSTEM_GUIDE.md)
- [Nutrition System Guide](./docs/NUTRITION_SYSTEM_GUIDE.md)
- [Fitness API Documentation](./docs/FITNESS_API_DOCUMENTATION.md)

**Database & Deployment:**
- [Database Setup Guide](./docs/DATABASE_SETUP_GUIDE.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)

**📚 [View All Documentation →](./docs/README.md)**

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the ISC License.

---

## 👤 Author

**Arif's Apex Fitness**
- Email: contact@arifworkout.com
- Website: https://arifworkout.com

---

## 🙏 Acknowledgments

- Google Cloud Platform for OAuth
- Stripe for payment processing
- OpenAI for AI-powered features
- All contributors and testers

---

## 📞 Support

For support, email contact@arifworkout.com or create an issue on GitHub.

---

**Built with ❤️ for the fitness community**
