# Quick Start Guide

## Setup (5 minutes)

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment
```bash
# Copy example env file
cp .env.example .env

# Edit .env with your settings (minimum required):
# MONGODB_URI=mongodb://localhost:27017/arif-workout
# JWT_SECRET=your-secret-key-here
```

### 3. Start MongoDB
```bash
# If using local MongoDB
mongod

# Or use MongoDB Atlas cloud database
# Update MONGODB_URI in .env with your Atlas connection string
```

### 4. Seed Database (Optional)
```bash
node src/scripts/seed.js
```

This creates test accounts:
- **Admin**: admin@arifworkout.com
- **Manager**: manager@arifworkout.com
- **Instructor**: instructor@arifworkout.com
- **Student**: student@arifworkout.com

### 5. Start Server
```bash
# Development mode (auto-reload)
npm run dev

# Production mode
npm start
```

Server runs at: **http://localhost:5000**

---

## Testing the API

### 1. Health Check
```bash
curl http://localhost:5000/health
```

### 2. Send OTP (Login)
```bash
curl -X POST http://localhost:5000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@arifworkout.com",
    "type": "login"
  }'
```

**Note**: In development mode without email config, the OTP code will be printed in the server console.

### 3. Verify OTP (Get Token)
```bash
curl -X POST http://localhost:5000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@arifworkout.com",
    "code": "123456",
    "name": "Admin User"
  }'
```

Save the `token` from the response!

### 4. Get Profile (Protected Route)
```bash
curl http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 5. Create Category (Admin Only)
```bash
curl -X POST http://localhost:5000/api/admin/categories \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Strength Training",
    "description": "Build muscle and strength"
  }'
```

### 6. Get All Courses (Public)
```bash
curl http://localhost:5000/api/courses
```

### 7. Get All Packages (Public)
```bash
curl http://localhost:5000/api/packages
```

---

## Common Workflows

### Instructor Creates Course

1. **Create Instructor Profile**
```bash
curl -X POST http://localhost:5000/api/instructors/profile \
  -H "Authorization: Bearer INSTRUCTOR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "bio": "Certified fitness trainer",
    "experienceYears": 5,
    "specialties": ["HIIT", "Strength Training"]
  }'
```

2. **Admin Approves Instructor**
```bash
curl -X PATCH http://localhost:5000/api/admin/instructors/INSTRUCTOR_ID/approve \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "notes": "Approved - verified credentials"
  }'
```

3. **Create Course**
```bash
curl -X POST http://localhost:5000/api/courses \
  -H "Authorization: Bearer INSTRUCTOR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "30-Day HIIT Challenge",
    "categoryId": "CATEGORY_ID",
    "price": 29.99,
    "currency": "USD",
    "description": "Intense 30-day workout program"
  }'
```

4. **Submit for Review**
```bash
curl -X POST http://localhost:5000/api/courses/COURSE_ID/submit \
  -H "Authorization: Bearer INSTRUCTOR_TOKEN"
```

5. **Admin Approves Course**
```bash
curl -X PATCH http://localhost:5000/api/admin/courses/COURSE_ID/approve \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "notes": "Great content!"
  }'
```

### Student Purchases Course

1. **Create Order**
```bash
curl -X POST http://localhost:5000/api/payments/orders \
  -H "Authorization: Bearer STUDENT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "courseId": "COURSE_ID",
    "paymentProvider": "stripe"
  }'
```

2. **Complete Payment** (use clientSecret with Stripe SDK on frontend)

3. **Stripe Webhook** updates order status to "paid"

### Student Subscribes to Package

```bash
curl -X POST http://localhost:5000/api/payments/subscriptions \
  -H "Authorization: Bearer STUDENT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "packageId": "PACKAGE_ID",
    "paymentProvider": "stripe"
  }'
```

### Track Food Intake

```bash
curl -X POST http://localhost:5000/api/tracker/food-logs \
  -H "Authorization: Bearer USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2025-11-25",
    "mealType": "breakfast",
    "items": [
      {
        "name": "Oatmeal with berries",
        "servingSize": "1 cup",
        "calories": 300,
        "proteinGrams": 10,
        "carbsGrams": 50,
        "fatGrams": 5
      }
    ]
  }'
```

### Track Activity

```bash
curl -X POST http://localhost:5000/api/tracker/activity-logs \
  -H "Authorization: Bearer USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "running",
    "distanceMeters": 5000,
    "durationSeconds": 1800,
    "steps": 6500,
    "startTime": "2025-11-25T06:00:00Z",
    "endTime": "2025-11-25T06:30:00Z",
    "caloriesBurned": 400
  }'
```

---

## Environment Variables Reference

### Required
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret for JWT tokens
- `PORT` - Server port (default: 5000)

### Optional (for full features)
- `GOOGLE_CLIENT_ID` - Google OAuth
- `STRIPE_SECRET_KEY` - Stripe payments
- `STRIPE_WEBHOOK_SECRET` - Stripe webhooks
- `TWILIO_ACCOUNT_SID` - SMS OTP
- `TWILIO_AUTH_TOKEN` - SMS OTP
- `EMAIL_HOST` - Email SMTP
- `EMAIL_USER` - Email account
- `EMAIL_PASSWORD` - Email password

---

## Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: Start MongoDB with `mongod` or check your MongoDB Atlas connection string.

### JWT Error
```
Error: JWT_SECRET is not defined
```
**Solution**: Set `JWT_SECRET` in your `.env` file.

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution**: Change `PORT` in `.env` or kill the process using port 5000.

### OTP Not Sending
In development mode without Twilio/Email config, OTP codes are logged to console. Check server logs.

---

## Next Steps

1. **Configure Payment Providers**
   - Set up Stripe account and add keys
   - Configure webhook endpoints

2. **Set up Email/SMS**
   - Configure Twilio for SMS OTP
   - Set up email SMTP for notifications

3. **Deploy to Production**
   - Use MongoDB Atlas for database
   - Deploy to Heroku, Railway, or AWS
   - Set up SSL/HTTPS
   - Configure production environment variables

4. **Build Frontend**
   - Connect to API endpoints
   - Implement Stripe payment flow
   - Add user dashboards

---

## Support

- Check `README.md` for full documentation
- Review API endpoints in route files
- Check model schemas for data structure
