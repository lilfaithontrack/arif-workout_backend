# Database Migration Guide

## 📋 Migration Files Created

Three SQL migration files have been created in `src/migrations/`:

1. **`create-nutrition-images-table.sql`** - Nutrition images table only
2. **`create-advertisements-table.sql`** - Advertisements table only  
3. **`complete-migration.sql`** - All missing tables in one file ⭐ **Use this one**

---

## 🚀 How to Import (Local Development)

### Option 1: MySQL Workbench
1. Open MySQL Workbench
2. Connect to your local database
3. Go to **File → Run SQL Script**
4. Select `complete-migration.sql`
5. Click **Run**

### Option 2: Command Line
```bash
# Navigate to backend directory
cd "c:\Users\kalu4\Pictures\arif workout\backend"

# Import the migration
mysql -u root -p arif_workout < src/migrations/complete-migration.sql
```

### Option 3: phpMyAdmin (if you have it locally)
1. Open phpMyAdmin
2. Select database: `arif_workout`
3. Click **Import** tab
4. Choose file: `complete-migration.sql`
5. Click **Go**

---

## 🌐 How to Import (cPanel Production)

### Method 1: phpMyAdmin in cPanel
1. **Login to cPanel**
2. **Open phpMyAdmin**
3. **Select database:** `arifwowt_arif`
4. **Click Import tab**
5. **Choose file:** Upload `complete-migration.sql`
6. **Click Go**
7. **Verify:** Check that tables appear in left sidebar

### Method 2: cPanel File Manager + Terminal
1. **Upload SQL file:**
   - Go to cPanel → File Manager
   - Navigate to `/home/arifwowt/`
   - Upload `complete-migration.sql`

2. **Run via SSH:**
   ```bash
   mysql -u arifwowt_kaleb -p arifwowt_arif < ~/complete-migration.sql
   ```

---

## ✅ Verification

After importing, verify tables were created:

### In MySQL/phpMyAdmin:
```sql
-- Check nutrition_images table
SHOW TABLES LIKE 'nutrition_images';

-- Check advertisements table
SHOW TABLES LIKE 'advertisements';

-- List all tables
SHOW TABLES;

-- Count rows (should be 0 initially)
SELECT COUNT(*) FROM nutrition_images;
SELECT COUNT(*) FROM advertisements;
```

### Expected Result:
```
+--------------------+
| Tables_in_database |
+--------------------+
| advertisements     |
| nutrition_images   |
| ... (other tables) |
+--------------------+
```

---

## 📊 Tables Created

### 1. nutrition_images
- **Purpose:** Store nutrition item images and videos
- **Columns:** id, nutritionSlug, nutritionItemId, subfolder, mediaType, filename, url, etc.
- **Indexes:** 6 indexes for optimal performance
- **Foreign Keys:** Links to users and nutrition_items

### 2. advertisements
- **Purpose:** Manage advertisements in the app
- **Columns:** id, title, description, imageUrl, type, placement, priority, etc.
- **Indexes:** 8 indexes for filtering and sorting
- **Foreign Keys:** Links to users (creator and approver)

---

## 🔧 Troubleshooting

### Error: "Table already exists"
- **Solution:** The migration uses `CREATE TABLE IF NOT EXISTS`, so it's safe to run multiple times

### Error: "Cannot add foreign key constraint"
- **Cause:** Referenced table doesn't exist (e.g., nutrition_items)
- **Solution:** Make sure all base tables exist first

### Error: "Access denied"
- **Solution:** Check database user permissions
  ```sql
  GRANT ALL PRIVILEGES ON arif_workout.* TO 'root'@'localhost';
  FLUSH PRIVILEGES;
  ```

---

## 📝 Next Steps

After importing:

1. **Restart your backend server** (if running)
   ```bash
   # Server will auto-restart with nodemon
   # Or manually: npm run dev
   ```

2. **Test the API endpoints:**
   ```bash
   # Test nutrition upload endpoint
   GET http://localhost:5000/api/nutrition-upload/subfolders
   
   # Test advertisements endpoint
   GET http://localhost:5000/api/advertisements
   ```

3. **Verify in database:**
   - Check tables exist
   - Verify structure matches models
   - Test inserting sample data

---

## 🎯 Production Deployment Checklist

- [ ] Upload `complete-migration.sql` to cPanel
- [ ] Import via phpMyAdmin
- [ ] Verify tables created
- [ ] Test API endpoints
- [ ] Check foreign key constraints
- [ ] Restart Node.js app

---

**Files Location:**
- `src/migrations/create-nutrition-images-table.sql`
- `src/migrations/create-advertisements-table.sql`
- `src/migrations/complete-migration.sql` ⭐

**Recommended:** Use `complete-migration.sql` for both local and production!
