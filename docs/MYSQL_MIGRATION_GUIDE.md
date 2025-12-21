# MongoDB to MySQL Migration Guide

## ✅ What Has Been Converted

The backend has been converted from MongoDB/Mongoose to MySQL/Sequelize ORM.

### Changes Made:

1. **Database Configuration** (`src/config/database.js`)
   - Replaced Mongoose connection with Sequelize
   - MySQL connection pooling configured
   - Auto-sync tables in development mode

2. **Package Dependencies** (`package.json`)
   - ❌ Removed: `mongoose`
   - ✅ Added: `sequelize` + `mysql2`

3. **Models Converted** (2 of 14 completed):
   - ✅ `user.model.js` - Sequelize model with JSON fields for arrays/objects
   - ✅ `otp.model.js` - Sequelize model with cleanup method
   - ⏳ Remaining 12 models need conversion

4. **Model Relationships** (`src/models/index.js`)
   - Created centralized file for all Sequelize associations
   - Defined foreign keys and relationships

## 🔧 MySQL Setup

### 1. Install MySQL

**Windows:**
```bash
# Download from: https://dev.mysql.com/downloads/installer/
# Or use XAMPP/WAMP
```

**Mac:**
```bash
brew install mysql
brew services start mysql
```

**Linux:**
```bash
sudo apt-get install mysql-server
sudo systemctl start mysql
```

### 2. Create Database

```bash
mysql -u root -p
```

```sql
CREATE DATABASE arif_workout CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create user (optional)
CREATE USER 'arif_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON arif_workout.* TO 'arif_user'@'localhost';
FLUSH PRIVILEGES;

EXIT;
```

### 3. Configure Environment

Update `.env`:
```env
# MySQL Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=arif_workout
DB_USER=root
DB_PASSWORD=your_mysql_password

# Or use connection URL
# DATABASE_URL=mysql://root:password@localhost:3306/arif_workout
```

## 📊 Data Type Mapping

| MongoDB | MySQL (Sequelize) | Notes |
|---------|-------------------|-------|
| ObjectId | INTEGER AUTO_INCREMENT | Primary keys |
| String | VARCHAR(255) | Text fields |
| Number | INTEGER / DECIMAL | Numeric values |
| Boolean | BOOLEAN (TINYINT) | True/false |
| Date | DATETIME | Timestamps |
| Array | JSON | Arrays stored as JSON |
| Object | JSON | Objects stored as JSON |
| Mixed | JSON | Dynamic data |

## 🔄 Remaining Model Conversions

### Models to Convert (12 remaining):

1. **category.model.js**
2. **subcategory.model.js**
3. **instructor.model.js**
4. **media.model.js**
5. **workout.model.js**
6. **course.model.js**
7. **package.model.js**
8. **payment.model.js**
9. **order.model.js**
10. **subscription.model.js**
11. **foodlog.model.js**
12. **activitylog.model.js**
13. **workoutprogress.model.js**

### Conversion Template:

```javascript
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ModelName = sequelize.define('ModelName', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  // Add fields here
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
  // JSON fields for arrays/objects
  metadata: {
    type: DataTypes.JSON,
    defaultValue: {}
  }
}, {
  tableName: 'table_name',
  timestamps: true,
  indexes: [
    { fields: ['name'] },
    { fields: ['userId'] }
  ]
});

module.exports = ModelName;
```

## 🔨 Controller Updates Needed

### Query Syntax Changes:

**MongoDB (Mongoose):**
```javascript
// Find
const users = await User.find({ role: 'admin' });

// Find one
const user = await User.findById(id);

// Create
const user = new User(data);
await user.save();

// Update
await User.findByIdAndUpdate(id, data);

// Delete
await User.findByIdAndDelete(id);

// Populate
await User.findById(id).populate('courses');
```

**MySQL (Sequelize):**
```javascript
// Find
const users = await User.findAll({ where: { roles: { [Op.contains]: 'admin' } } });

// Find one
const user = await User.findByPk(id);

// Create
const user = await User.create(data);

// Update
await User.update(data, { where: { id } });
// Or: await user.update(data);

// Delete
await User.destroy({ where: { id } });
// Or: await user.destroy();

// Include (populate)
await User.findByPk(id, { include: ['courses'] });
```

### Operators:

```javascript
const { Op } = require('sequelize');

// Comparison
{ age: { [Op.gt]: 18 } }           // greater than
{ age: { [Op.gte]: 18 } }          // greater than or equal
{ age: { [Op.lt]: 65 } }           // less than
{ age: { [Op.lte]: 65 } }          // less than or equal
{ age: { [Op.ne]: 25 } }           // not equal
{ age: { [Op.between]: [18, 65] } } // between

// String
{ name: { [Op.like]: '%John%' } }   // LIKE
{ name: { [Op.startsWith]: 'J' } }  // starts with
{ name: { [Op.endsWith]: 'n' } }    // ends with

// Array
{ id: { [Op.in]: [1, 2, 3] } }      // IN
{ id: { [Op.notIn]: [1, 2, 3] } }   // NOT IN

// Logical
{ [Op.and]: [{ a: 5 }, { b: 6 }] }  // AND
{ [Op.or]: [{ a: 5 }, { b: 6 }] }   // OR
```

## 🚀 Running the Converted Backend

### 1. Install Dependencies

```bash
cd backend
npm install
```

This will install:
- `sequelize` - ORM
- `mysql2` - MySQL driver

### 2. Configure Database

```bash
cp .env.example .env
# Edit .env with your MySQL credentials
```

### 3. Start Server

```bash
npm run dev
```

The server will:
1. Connect to MySQL
2. Auto-create tables (in development mode)
3. Start listening on port 5000

### 4. Verify Tables Created

```sql
USE arif_workout;
SHOW TABLES;

-- Should see:
-- users
-- otps
-- (more tables as models are converted)
```

## 📝 Migration Checklist

- [x] Install MySQL
- [x] Create database
- [x] Update package.json dependencies
- [x] Convert database.js to Sequelize
- [x] Convert User model
- [x] Convert OTP model
- [ ] Convert remaining 12 models
- [ ] Update all controllers for Sequelize syntax
- [ ] Update services for Sequelize
- [ ] Test all API endpoints
- [ ] Create seed script for MySQL
- [ ] Update documentation

## ⚠️ Important Notes

### JSON Fields
MySQL stores arrays and objects as JSON. Access them normally:
```javascript
user.roles // ['admin', 'student']
user.personalInfo.bio // 'Fitness enthusiast'
```

### Auto-Increment IDs
- MongoDB uses ObjectId (string)
- MySQL uses INTEGER AUTO_INCREMENT
- Update frontend if it expects string IDs

### Timestamps
Sequelize automatically adds:
- `createdAt` (DATETIME)
- `updatedAt` (DATETIME)

### Indexes
Defined in model options:
```javascript
indexes: [
  { fields: ['email'], unique: true },
  { fields: ['createdAt'] }
]
```

### Relationships
Defined in `src/models/index.js`:
```javascript
User.hasMany(Course, { foreignKey: 'instructorId' });
Course.belongsTo(User, { foreignKey: 'instructorId' });
```

## 🐛 Troubleshooting

### Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:3306
```
**Solution**: Start MySQL service

### Authentication Error
```
Error: Access denied for user 'root'@'localhost'
```
**Solution**: Check DB_USER and DB_PASSWORD in .env

### Table Not Found
```
Error: Table 'arif_workout.users' doesn't exist
```
**Solution**: Set `NODE_ENV=development` to auto-create tables

### JSON Field Issues
```
Error: Invalid JSON
```
**Solution**: Ensure JSON fields have valid default values

## 📚 Resources

- [Sequelize Documentation](https://sequelize.org/docs/v6/)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [Sequelize Migrations](https://sequelize.org/docs/v6/other-topics/migrations/)

## 🎯 Next Steps

1. **Convert remaining models** - Use the template above
2. **Update controllers** - Replace Mongoose queries with Sequelize
3. **Update services** - Adjust for Sequelize syntax
4. **Test thoroughly** - Verify all endpoints work
5. **Create migrations** - For production deployments
6. **Update seed script** - Use Sequelize instead of Mongoose

---

**Status**: 🟡 Partial Conversion (2/14 models converted)

Complete the remaining model conversions to fully migrate to MySQL.
