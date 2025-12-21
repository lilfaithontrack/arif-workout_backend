# Video Upload Feature Guide

## Overview

The exercise data collection system now supports both **image** and **video** uploads. This allows you to collect comprehensive exercise demonstration media including form videos, variation demonstrations, and more.

## Features

### Supported Video Formats
- **MP4** (`.mp4`) - Recommended
- **MOV** (`.mov`) - QuickTime
- **AVI** (`.avi`) - Windows Video
- **WebM** (`.webm`) - Web Video
- **MPEG** (`.mpeg`) - MPEG Video

### File Size Limits
- **Images**: Up to 5MB per file
- **Videos**: Up to 50MB per file

### Upload Methods
1. **Drag & Drop**: Drag video files directly into the upload zone
2. **File Browser**: Click to browse and select video files
3. **Clipboard Paste**: Paste images from clipboard (Ctrl+V)
4. **URL Download**: Download videos from external URLs
5. **Bulk URL Download**: Download multiple videos from a list of URLs

## Database Schema

### New Fields Added to `exercise_images` Table

```sql
-- Media type indicator
mediaType ENUM('image', 'video') NOT NULL DEFAULT 'image'

-- Video-specific fields
duration INT NULL COMMENT 'Duration in seconds (for videos only)'
thumbnailUrl VARCHAR(1000) NULL COMMENT 'Thumbnail URL for video files'
```

### Indexes
- `idx_mediaType` - Index on mediaType column
- `idx_exerciseSlug_mediaType` - Composite index for filtering by exercise and media type

## Migration

To enable video support on an existing database, run the migration:

```bash
# Navigate to migrations directory
cd backend/src/migrations

# Apply migration
node add-video-support.js up

# Rollback (if needed)
node add-video-support.js down
```

## API Usage

### Upload Videos

**Endpoint**: `POST /api/admin/upload/exercise-image`

**Request** (multipart/form-data):
```javascript
const formData = new FormData();
formData.append('exerciseSlug', 'barbell-squat');
formData.append('subfolder', 'form-guide');
formData.append('images', videoFile1);
formData.append('images', videoFile2);
// Can mix images and videos in same upload
```

**Response**:
```json
{
  "success": true,
  "message": "2 video(s) uploaded successfully",
  "data": [
    {
      "id": 123,
      "exerciseSlug": "barbell-squat",
      "subfolder": "form-guide",
      "mediaType": "video",
      "filename": "barbell-squat-form-guide-1234567890.mp4",
      "url": "/images/exercises/barbell-squat/form-guide/barbell-squat-form-guide-1234567890.mp4",
      "size": 15728640,
      "mimeType": "video/mp4"
    }
  ]
}
```

### Download Video from URL

**Endpoint**: `POST /api/admin/upload/download-from-url`

**Request**:
```json
{
  "exerciseSlug": "barbell-squat",
  "subfolder": "form-guide",
  "imageUrl": "https://example.com/squat-demo.mp4"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Video downloaded and saved successfully",
  "data": {
    "id": 124,
    "mediaType": "video",
    "filename": "barbell-squat-form-guide-1234567891.mp4",
    "url": "/images/exercises/barbell-squat/form-guide/barbell-squat-form-guide-1234567891.mp4"
  }
}
```

### Get Media Files (with filtering)

**Endpoint**: `GET /api/admin/upload/exercise-images`

**Query Parameters**:
- `exerciseSlug` - Filter by exercise
- `subfolder` - Filter by subfolder
- `mediaType` - Filter by type: 'image' or 'video' (NEW)
- `page` - Page number
- `limit` - Items per page

**Example**:
```
GET /api/admin/upload/exercise-images?exerciseSlug=barbell-squat&mediaType=video
```

## Frontend Usage

### Admin Panel - Image Upload Sidebar

The `ImageUploadSidebar` component now supports video uploads:

1. **Select Exercise Folder**: Choose the exercise
2. **Select Subfolder**: Choose category (main, form-guide, etc.)
3. **Upload Media**:
   - Drag & drop video files
   - Click to browse for videos
   - Enter video URL to download
   - Paste multiple URLs for bulk download

### Video Display

Videos are displayed with:
- HTML5 video player with controls
- "Video" badge indicator
- Responsive container
- Same actions as images (copy URL, delete)

## Best Practices

### Video Guidelines
1. **Format**: Use MP4 with H.264 codec for best compatibility
2. **Resolution**: 720p (1280x720) or 1080p (1920x1080) recommended
3. **Duration**: Keep videos under 2 minutes for form demonstrations
4. **File Size**: Compress videos to stay under 50MB
5. **Naming**: Use descriptive filenames (auto-generated on upload)

### Organization
- **Main**: Primary exercise demonstration videos
- **Form-guide**: Proper form and technique videos
- **Variations**: Different exercise variations
- **Common-mistakes**: What to avoid videos
- **Progression**: Progressive difficulty demonstrations

### Performance Tips
1. Use `preload="metadata"` for video elements (already implemented)
2. Consider generating thumbnails for better UX (future enhancement)
3. Implement lazy loading for video galleries
4. Use CDN for video delivery in production

## Future Enhancements

### Planned Features
- [ ] Automatic thumbnail generation from video
- [ ] Video duration extraction and storage
- [ ] Video compression/optimization on upload
- [ ] Video streaming support for large files
- [ ] Video preview on hover
- [ ] Batch video processing
- [ ] Video transcoding to multiple formats

### Integration Ideas
- Link videos to specific exercise records
- Add video chapters/timestamps
- Support for slow-motion playback
- Add video annotations/markers
- Support for 360° videos

## Troubleshooting

### Common Issues

**Video won't upload**
- Check file size (must be under 50MB)
- Verify format is supported
- Check network connection

**Video won't play**
- Ensure browser supports the video codec
- Check video file isn't corrupted
- Verify URL is accessible

**Migration fails**
- Check database connection
- Verify user has ALTER TABLE permissions
- Check if columns already exist

## Technical Details

### Backend Changes
1. **Model**: `exerciseimage.model.js` - Added mediaType, duration, thumbnailUrl fields
2. **Middleware**: `upload.middleware.js` - Added video MIME types, increased file size limit
3. **Controller**: `upload.controller.js` - Added video detection and handling
4. **Routes**: No changes needed (uses existing endpoints)

### Frontend Changes
1. **Component**: `ImageUploadSidebar.tsx` - Added video support to UI
2. **API**: `api.ts` - No changes needed (already generic)
3. **Types**: Added mediaType to ExerciseImage interface

### File Storage
Videos are stored in the same directory structure as images:
```
public/images/exercises/
  └── {exercise-slug}/
      ├── main/
      ├── variations/
      ├── form-guide/
      ├── muscles/
      ├── equipment/
      ├── progression/
      └── common-mistakes/
```

## Support

For issues or questions:
1. Check this guide
2. Review migration logs
3. Check browser console for errors
4. Verify backend logs for upload errors

---

**Last Updated**: December 2024
**Version**: 1.0.0
