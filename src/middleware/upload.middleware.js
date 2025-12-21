const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Allowed subfolders
const ALLOWED_SUBFOLDERS = [
    'main',
    'variations',
    'form-guide',
    'muscles',
    'equipment',
    'progression',
    'common-mistakes'
];

// Configure multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const { exerciseSlug, subfolder } = req.body;

        // Validate required fields
        if (!exerciseSlug || !subfolder) {
            return cb(new Error('exerciseSlug and subfolder are required'));
        }

        // Sanitize exerciseSlug (only allow lowercase letters, numbers, and hyphens)
        const sanitizedSlug = exerciseSlug.toLowerCase().replace(/[^a-z0-9-]/g, '');
        if (sanitizedSlug !== exerciseSlug) {
            return cb(new Error('Invalid exerciseSlug format. Use lowercase letters, numbers, and hyphens only.'));
        }

        // Validate subfolder
        if (!ALLOWED_SUBFOLDERS.includes(subfolder)) {
            return cb(new Error(`Invalid subfolder. Allowed: ${ALLOWED_SUBFOLDERS.join(', ')}`));
        }

        // Create directory path
        const uploadPath = path.join(__dirname, '../../public/images/exercises', sanitizedSlug, subfolder);

        // Create directories if they don't exist
        fs.mkdirSync(uploadPath, { recursive: true });

        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const { exerciseSlug, subfolder } = req.body;
        const sanitizedSlug = exerciseSlug.toLowerCase().replace(/[^a-z0-9-]/g, '');

        // Get file extension
        const ext = path.extname(file.originalname).toLowerCase();

        // Generate filename: {exerciseSlug}-{subfolder}-{timestamp}{ext}
        const timestamp = Date.now();
        const filename = `${sanitizedSlug}-${subfolder}-${timestamp}${ext}`;

        cb(null, filename);
    }
});

// File filter to validate file types (images and videos)
const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = [
        // Images
        'image/jpeg', 
        'image/jpg', 
        'image/png', 
        'image/webp',
        // Videos
        'video/mp4',
        'video/mpeg',
        'video/quicktime',
        'video/x-msvideo',
        'video/webm'
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG, PNG, WebP images and MP4, MOV, AVI, WebM videos are allowed.'), false);
    }
};

// Create multer upload instance
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 50 * 1024 * 1024 // 50MB limit (to accommodate videos)
    }
});

// Export middleware functions
module.exports = {
    uploadSingle: upload.single('image'),
    uploadMultiple: upload.array('images', 10), // Max 10 files at once
    ALLOWED_SUBFOLDERS
};
