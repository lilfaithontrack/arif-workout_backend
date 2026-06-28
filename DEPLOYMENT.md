# Backend-Only Deployment Guide

## File Upload Configuration (Backend Directory Structure)

The upload system works entirely within the backend's `public/images` directory.

### 1. Backend Directory Structure

```
backend/
├── src/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── server.js
├── public/               ← Static files root
│   └── images/           ← All uploaded images/videos
│       ├── exercises/    ← Exercise media (auto-created per slug)
│       │   └── {slug}/   ← One folder per exercise slug
│       │       ├── main/
│       │       ├── variations/
│       │       ├── form-guide/
│       │       ├── muscles/
│       │       ├── equipment/
│       │       ├── progression/
│       │       └── common-mistakes/
│       ├── categories/
│       ├── subcategories/
│       ├── nutrition/
│       ├── advertisements/
│       └── users/
├── package.json
├── .env.production
└── DEPLOYMENT.md
```

### 2. Environment Variables

Create `.env` (or set in cPanel) in your backend directory:

```bash
# File Upload Configuration
# Point STATIC_PATH to the backend's public directory
# The server serves /images from {STATIC_PATH}/images
STATIC_PATH=/home/yourusername/backend/public
```

### 3. cPanel Deployment Steps

1. **Upload backend folder to cPanel** (e.g. `/home/arifworkout/backend/`)
2. **Set environment variables** in cPanel or `.env`:
   - `STATIC_PATH=/home/arifworkout/backend/public`
   - `NODE_ENV=production`
   - `DB_HOST=localhost`, `DB_NAME=arif_workout`, etc.

3. **Create the public/images directory** (optional — created automatically on first upload):
   ```
   mkdir -p /home/arifworkout/backend/public/images/exercises
   ```

4. **Set permissions** so Node can write to the images directory:
   ```bash
   chmod 755 /home/arifworkout/backend/public
   chmod -R 755 /home/arifworkout/backend/public/images
   ```

### 4. How It Works

- **Files saved to**: `{STATIC_PATH}/images/exercises/{slug}/{subfolder}/{filename}`
- **Images served at**: `https://api.arifworkout.com/images/exercises/{slug}/{subfolder}/{filename}`
- **Database stores**: `/images/exercises/{slug}/{subfolder}/{filename}`
- **Automatic**: Subfolders are created with `mkdirSync({ recursive: true })` on first upload — no manual setup needed per exercise

### 5. cPanel Specific Example

If your backend is at `/home/arifworkout/backend/`:

```bash
STATIC_PATH=/home/arifworkout/backend/public
```

Files will be saved to:
- `/home/arifworkout/backend/public/images/exercises/{slug}/main/video.mp4`
- `/home/arifworkout/backend/public/images/categories/filename.jpg`

And accessible via:
- `https://api.arifworkout.com/images/exercises/{slug}/main/video.mp4`
- `https://api.arifworkout.com/images/categories/filename.jpg`

### 6. Folder Creation Behavior

- **Exercise folders**: Created automatically when an admin uploads media via the admin panel (drag-and-drop or file picker). The multer middleware calls `fs.mkdirSync(uploadPath, { recursive: true })`.
- **Category/subcategory folders**: Created automatically on first upload.
- **No manual folder creation needed** — the system handles it.

### 7. Migrating Existing Local Images to cPanel

If you have exercise images locally that you want on the server:

```bash
# Upload the entire public/images folder from your local machine
# to /home/arifworkout/backend/public/images/ on cPanel
scp -r backend/public/images/ user@server:/home/arifworkout/backend/public/
```

Or use cPanel's File Manager to upload a ZIP and extract it.

### 8. Nginx Configuration (if using Nginx)

```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location /images/ {
        alias /home/arifworkout/backend/public/images/;
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

### 9. Apache Configuration (if using Apache)

```apache
<IfModule mod_alias.c>
    Alias /images /home/arifworkout/backend/public/images
</IfModule>

<Directory /home/arifworkout/backend/public/images>
    Options -Indexes
    AllowOverride None
    Require all granted
</Directory>
```

### 10. Testing the Upload

After deployment, test the upload functionality:

1. Check server logs for: `📁 Serving static files from: .../public/images`
2. Upload a test image via the admin panel
3. Verify the file appears in `/home/arifworkout/backend/public/images/exercises/{slug}/main/`
4. Test the image URL is accessible via browser

### 11. Debugging Tips

If uploads don't work:

1. Check the server logs for the static files path message
2. Verify `STATIC_PATH` env variable is set correctly to the `public` directory
3. Ensure `public/images/` exists and has write permissions (`chmod 755`)
4. Test file creation manually: `touch /home/arifworkout/backend/public/images/test.txt`

### 12. Common Issues

- **Permission Denied**: Fix with `chmod -R 755 public/images` and ensure the Node process owns the directory
- **Directory Not Found**: Create `public/images/` manually — subfolders are auto-created
- **Wrong Path**: Check `STATIC_PATH` points to `backend/public` (not `backend/uploads`)
- **CORS Issues**: Static files are served with `cors()` middleware — already handled
