# MySQL Conversion Status

## ✅ Completed

### 1. Database Configuration
- **File**: `src/config/database.js`
- **Status**: ✅ Complete
- **Changes**:
  - Replaced Mongoose with Sequelize
  - MySQL connection with pooling
  - Auto-sync tables in development
  - Graceful shutdown handling

### 2. Package Dependencies
- **File**: `package.json`
- **Status**: ✅ Complete
- **Changes**:
  - ❌ Removed: `mongoose@^8.9.3`
  - ✅ Added: `sequelize@^6.35.2`
  - ✅ Added: `mysql2@^3.6.5`

### 3. Environment Configuration
- **File**: `.env.example`
- **Status**: ✅ Complete
- **Changes**:
  - Replaced `MONGODB_URI` with MySQL variables:
    - `DB_HOST`
    - `DB_PORT`
    - `DB_NAME`
    - `DB_USER`
    - `DB_PASSWORD`

### 4. Server Configuration
- **File**: `src/server.js`
- **Status**: ✅ Complete
- **Changes**:
  - Updated import: `const { connectDB } = require('./config/database')`

### 5. Model Conversions
- **User Model** (`src/models/user.model.js`) - ✅ Complete
  - Converted to Sequelize
  - JSON fields for roles, authProviders, personalInfo, consents
  - Instance methods preserved
  - Indexes configured

- **OTP Model** (`src/models/otp.model.js`) - ✅ Complete
  - Converted to Sequelize
  - Foreign key to users table
  - Instance methods preserved
  - Added cleanup method for expired OTPs

### 6. Model Relationships
- **File**: `src/models/index.js`
- **Status**: ✅ Complete
- **Features**:
  - Centralized relationship definitions
  - All 14 models imported
  - Foreign key associations configured
  - Ready for remaining model conversions

### 7. Documentation
- **MYSQL_MIGRATION_GUIDE.md** - ✅ Complete
  - Complete migration instructions
  - Query syntax comparison
  - Data type mapping
  - Troubleshooting guide

- **CONVERT_MODELS.md** - ✅ Complete
  - Step-by-step conversion instructions
  - Conversion templates
  - Priority order for remaining models

---

## ⏳ Pending Conversions

### Models Requiring Conversion (12 remaining):

1. **category.model.js** - Simple model, no complex relationships
2. **subcategory.model.js** - References Category
3. **instructor.model.js** - References User
4. **media.model.js** - Standalone model
5. **workout.model.js** - References User, has JSON fields
6. **course.model.js** - Complex model with multiple references
7. **package.model.js** - References Category, User
8. **payment.model.js** - References User
9. **order.model.js** - References User, Course, Payment
10. **subscription.model.js** - References User, Package
11. **foodlog.model.js** - References User, has JSON arrays
12. **activitylog.model.js** - References User
13. **workoutprogress.model.js** - References User, Workout, Course

### Controllers Requiring Updates:

All controllers need Sequelize query syntax updates:
- `src/controllers/auth.controller.js`
- `src/controllers/admin.controller.js`
- `src/controllers/course.controller.js`
- `src/controllers/instructor.controller.js`
- `src/controllers/manager.controller.js`
- `src/controllers/payment.controller.js`
- `src/controllers/tracker.controller.js`
- `src/controllers/webhook.controller.js`

### Services Requiring Updates:

- `src/services/otp.service.js`
- `src/services/payment.service.js`
- `src/services/subscription.service.js`
- `src/services/notification.service.js`

### Scripts Requiring Updates:

- `src/scripts/seed.js` - Database seeding script

---

## 🚀 Quick Start (Current State)

### 1. Install MySQL

```bash
# Install MySQL Server
# Windows: Download from https://dev.mysql.com/downloads/installer/
# Mac: brew install mysql
# Linux: sudo apt-get install mysql-server
```

### 2. Create Database

```sql
CREATE DATABASE arif_workout CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3. Install Dependencies

```bash
cd backend
npm install
```

This will install:
- `sequelize` - ORM for MySQL
- `mysql2` - MySQL driver for Node.js

### 4. Configure Environment

```bash
cp .env.example .env
```

Edit `.env`:
```env
# MySQL Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=arif_workout
DB_USER=root
DB_PASSWORD=your_password

# Other settings remain the same
JWT_SECRET=your-secret-key
PORT=5000
```

### 5. Start Server

```bash
npm run dev
```

**Expected Output:**
```
MySQL Connected: localhost:3306
Database tables synced
Server running on port 5000
```

### 6. Verify Tables Created

```sql
USE arif_workout;
SHOW TABLES;
```

**Expected Tables (so far):**
- `users`
- `otps`

---

## 📊 Conversion Progress

| Component | Status | Progress |
|-----------|--------|----------|
| Database Config | ✅ Complete | 100% |
| Package Dependencies | ✅ Complete | 100% |
| Environment Config | ✅ Complete | 100% |
| Server Config | ✅ Complete | 100% |
| Model Relationships | ✅ Complete | 100% |
| Models | 🟡 Partial | 14% (2/14) |
| Controllers | ❌ Pending | 0% (0/8) |
| Services | ❌ Pending | 0% (0/4) |
| Scripts | ❌ Pending | 0% (0/1) |
| **Overall** | 🟡 **In Progress** | **~30%** |

---

## 🎯 Next Steps

### Immediate (Required for Basic Functionality):

1. **Convert Category Model**
   ```javascript
   // Simple model, good starting point
   // File: src/models/category.model.js
   ```

2. **Convert Course Model**
   ```javascript
   // Critical for core functionality
   // File: src/models/course.model.js
   ```

3. **Update Auth Controller**
   ```javascript
   // Most used controller
   // File: src/controllers/auth.controller.js
   ```

### Priority Order:

**Phase 1: Core Models (Priority: High)**
- Category
- Subcategory
- InstructorProfile
- Course

**Phase 2: E-commerce Models (Priority: High)**
- Package
- Payment
- Order
- Subscription

**Phase 3: Content Models (Priority: Medium)**
- Media
- Workout

**Phase 4: Tracking Models (Priority: Medium)**
- FoodLog
- ActivityLog
- WorkoutProgress

**Phase 5: Controllers & Services (Priority: High)**
- Update all controllers
- Update all services
- Update seed script

---

## 🔧 Conversion Template

For each remaining model, use this template:

```javascript
const { DataTypes, Op } = require('sequelize');
const { sequelize } = require('../config/database');

const ModelName = sequelize.define('ModelName', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  // String fields
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  // Foreign keys
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  // Enums
  status: {
    type: DataTypes.ENUM('active', 'inactive'),
    defaultValue: 'active'
  },
  // JSON fields (for arrays/objects)
  metadata: {
    type: DataTypes.JSON,
    defaultValue: {}
  },
  // Decimals
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  // Booleans
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'table_name',
  timestamps: true,
  indexes: [
    { fields: ['name'] },
    { fields: ['userId'] },
    { fields: ['status'] }
  ]
});

// Instance methods
ModelName.prototype.myMethod = function() {
  // method logic
};

// Class methods
ModelName.myStaticMethod = async function() {
  // static method logic
};

module.exports = ModelName;
```

---

## 📚 Resources

- **Sequelize Documentation**: https://sequelize.org/docs/v6/
- **MySQL Documentation**: https://dev.mysql.com/doc/
- **Migration Guide**: `MYSQL_MIGRATION_GUIDE.md`
- **Conversion Instructions**: `CONVERT_MODELS.md`
- **Example Models**:
  - `src/models/user.model.js`
  - `src/models/otp.model.js`

---

## ⚠️ Important Notes

### 1. ID Fields
- MongoDB uses `_id` (ObjectId string)
- MySQL uses `id` (INTEGER)
- **Action Required**: Update frontend if it expects string IDs

### 2. JSON Fields
MySQL stores arrays and objects as JSON:
```javascript
// Works the same as MongoDB
user.roles // ['admin', 'student']
user.personalInfo.bio // 'Fitness enthusiast'
```

### 3. Timestamps
Sequelize auto-adds:
- `createdAt` (DATETIME)
- `updatedAt` (DATETIME)

### 4. Query Differences
```javascript
// MongoDB
User.find({ role: 'admin' })

// Sequelize
User.findAll({ where: { role: 'admin' } })
```

### 5. Relationships
Defined in `src/models/index.js`:
```javascript
User.hasMany(Course, { foreignKey: 'instructorId' });
Course.belongsTo(User, { foreignKey: 'instructorId' });
```

---

## 🐛 Known Issues

### Issue 1: Remaining Models Not Converted
**Status**: Expected
**Impact**: API endpoints using unconverted models will fail
**Solution**: Convert remaining models using provided templates

### Issue 2: Controllers Use Mongoose Syntax
**Status**: Expected
**Impact**: API calls will fail until controllers are updated
**Solution**: Update controllers to use Sequelize syntax

### Issue 3: Seed Script Uses Mongoose
**Status**: Expected
**Impact**: Cannot seed database yet
**Solution**: Update seed script after models are converted

---

## ✅ Testing Checklist

After completing conversions:

- [ ] All 14 models converted
- [ ] All controllers updated
- [ ] All services updated
- [ ] Seed script updated
- [ ] Server starts without errors
- [ ] All tables created in MySQL
- [ ] API endpoints respond correctly
- [ ] Authentication works
- [ ] CRUD operations work
- [ ] Relationships work (joins)
- [ ] Frontend connects successfully

---

## 📞 Support

For questions or issues:
1. Check `MYSQL_MIGRATION_GUIDE.md`
2. Review example models (User, OTP)
3. Consult Sequelize documentation
4. Test incrementally (one model at a time)

---

**Last Updated**: Migration started - 2 of 14 models converted
**Estimated Completion**: Depends on conversion speed (~2-4 hours for remaining models + controllers)
