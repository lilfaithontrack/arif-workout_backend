# Backend-Only Deployment Guide

## File Upload Configuration (Backend Directory Structure)

The upload system now works entirely within the backend directory, making deployment simpler and more contained.

### 1. Backend Directory Structure

```
backend/
├── src/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── server.js
├── uploads/              ← Created automatically
│   ├── categories/       ← Category images
│   └── subcategories/    ← Subcategory images
├── package.json
├── .env.production
└── DEPLOYMENT.md
```

### 2. Environment Variables

Create `.env.production` in your backend directory:

```bash
# File Upload Configuration
UPLOAD_PATH=/home/yourusername/backend/uploads
STATIC_PATH=/home/yourusername/backend/uploads
```

### 3. cPanel Deployment Steps

1. **Upload backend folder to cPanel**
2. **Set environment variables** in cPanel:
   - `UPLOAD_PATH=/home/yourusername/backend/uploads`
   - `STATIC_PATH=/home/yourusername/backend/uploads`

3. **Create directories** (optional - created automatically):
   ```
   /home/yourusername/backend/uploads/categories/
   /home/yourusername/backend/uploads/subcategories/
   ```

4. **Set permissions**:
   ```bash
   chmod 755 /home/yourusername/backend/uploads
   chmod 755 /home/yourusername/backend/uploads/categories
   chmod 755 /home/yourusername/backend/uploads/subcategories
   ```

### 4. How It Works

- **Default**: Files are saved to `backend/uploads/`
- **Images served at**: `/images/categories/filename.jpg`
- **Database stores**: `/images/categories/filename.jpg`
- **Automatic**: Directories are created if they don't exist

### 5. cPanel Specific Example

If your backend is at `/home/arifworkout/backend/`:

```bash
UPLOAD_PATH=/home/arifworkout/backend/uploads
STATIC_PATH=/home/arifworkout/backend/uploads
```

Files will be saved to:
- `/home/arifworkout/backend/uploads/categories/`
- `/home/arifworkout/backend/uploads/subcategories/`

And accessible via:
- `https://api.arifworkout.com/images/categories/filename.jpg`

### 6. Directory Permissions (Optional)

The system creates directories automatically, but you can set permissions manually:

```bash
chmod 755 /home/yourusername/backend/uploads
chmod 755 /home/yourusername/backend/uploads/categories
chmod 755 /home/yourusername/backend/uploads/subcategories
```

### 5. Nginx Configuration (if using Nginx)

Add this to your Nginx config to serve uploaded files:

```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location /images/ {
        alias /var/www/arif-workout/public/images/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    location /uploads/ {
        alias /var/www/arif-workout/uploads/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    location / {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 6. Apache Configuration (if using Apache)

Add this to your .htaccess or Apache config:

```apache
<IfModule mod_alias.c>
    Alias /images /var/www/arif-workout/public/images
    Alias /uploads /var/www/arif-workout/uploads
</IfModule>

<Directory /var/www/arif-workout/public/images>
    Options -Indexes
    AllowOverride None
    Require all granted
</Directory>

<Directory /var/www/arif-workout/uploads>
    Options -Indexes
    AllowOverride None
    Require all granted
</Directory>
```

### 7. Testing the Upload

After deployment, test the upload functionality:

1. Check server logs for upload path messages
2. Verify files are being saved to the correct directory
3. Test image URLs are accessible via browser

### 8. Cloud Storage Alternative

For better scalability, consider using cloud storage:

```javascript
// Example for AWS S3 (in production)
const AWS = require('aws-sdk');
const s3 = new AWS.S3();

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Then upload to S3 instead of local disk
```

### 9. Debugging Tips

If uploads still don't work:

1. Check the server logs for directory creation messages
2. Verify the UPLOAD_PATH environment variable is set correctly
3. Ensure the directories exist and have proper permissions
4. Test file creation manually: `touch /var/www/arif-workout/uploads/test.txt`

### 10. Common Issues

- **Permission Denied**: Fix with proper chmod/chown
- **Directory Not Found**: Create directories manually
- **Wrong Path**: Check UPLOAD_PATH environment variable
- **CORS Issues**: Ensure static files are served with CORS headers

## SQL for Database Setup

Here's the SQL to create the necessary tables with image columns:

```sql
-- Add image columns to categories table (if not exists)
ALTER TABLE categories 
ADD COLUMN IF NOT EXISTS image VARCHAR(500) NULL 
COMMENT 'Path to category image file' 
AFTER description;

-- Add image columns to subcategories table (if not exists)
ALTER TABLE subcategories 
ADD COLUMN IF NOT EXISTS image VARCHAR(500) NULL 
COMMENT 'Path to subcategory image file' 
AFTER description;

-- Create advertisements table (if not exists)
CREATE TABLE IF NOT EXISTS advertisements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL COMMENT 'Advertisement title',
    description TEXT NULL COMMENT 'Advertisement description/content',
    type ENUM('banner', 'popup', 'sidebar', 'inline', 'video', 'native') NOT NULL DEFAULT 'banner',
    category ENUM('fitness', 'nutrition', 'equipment', 'supplements', 'apparel', 'general') NOT NULL DEFAULT 'general',
    imageUrl VARCHAR(500) NULL COMMENT 'Main advertisement image URL',
    thumbnailUrl VARCHAR(500) NULL COMMENT 'Thumbnail image URL',
    videoUrl VARCHAR(500) NULL COMMENT 'Video advertisement URL',
    targetUrl VARCHAR(1000) NOT NULL COMMENT 'URL where ad clicks should redirect',
    ctaText VARCHAR(100) NULL DEFAULT 'Learn More' COMMENT 'Call-to-action button text',
    placement JSON NULL COMMENT 'Array of page placements',
    position ENUM('top', 'bottom', 'left', 'right', 'center', 'floating') NULL DEFAULT 'top',
    dimensions JSON NULL COMMENT 'Width and height',
    startDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    endDate DATETIME NULL,
    targetAudience JSON NULL,
    targetDevices JSON NULL,
    priority INT NOT NULL DEFAULT 5,
    dailyBudget DECIMAL(10, 2) NULL,
    totalBudget DECIMAL(10, 2) NULL,
    costPerClick DECIMAL(10, 2) NULL,
    costPerImpression DECIMAL(10, 4) NULL,
    impressions INT DEFAULT 0,
    clicks INT DEFAULT 0,
    conversions INT DEFAULT 0,
    totalSpent DECIMAL(10, 2) DEFAULT 0,
    advertiserName VARCHAR(255) NOT NULL,
    advertiserEmail VARCHAR(255) NULL,
    advertiserPhone VARCHAR(50) NULL,
    advertiserWebsite VARCHAR(500) NULL,
    status ENUM('draft', 'pending', 'approved', 'active', 'paused', 'completed', 'rejected') NOT NULL DEFAULT 'draft',
    isActive BOOLEAN DEFAULT FALSE,
    moderationNotes TEXT NULL,
    createdBy INT NULL,
    approvedBy INT NULL,
    approvedAt DATETIME NULL,
    maxImpressions INT NULL,
    maxClicks INT NULL,
    frequency JSON NULL,
    tags JSON NULL,
    notes TEXT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_status (status),
    INDEX idx_isActive (isActive),
    INDEX idx_type (type),
    INDEX idx_category (category),
    INDEX idx_startDate (startDate),
    INDEX idx_endDate (endDate),
    INDEX idx_priority (priority),
    INDEX idx_createdBy (createdBy),
    INDEX idx_approvedBy (approvedBy),
    INDEX idx_advertiserName (advertiserName),
    
    FOREIGN KEY (createdBy) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (approvedBy) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

This should resolve your image upload issues in deployment!
