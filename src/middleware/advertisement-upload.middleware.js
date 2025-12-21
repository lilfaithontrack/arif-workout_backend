const path = require('path');
const fs = require('fs').promises;
const multer = require('multer');

// Configure multer storage for advertisements
const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../../public/images/advertisements');

        // Create directory if it doesn't exist
        try {
            await fs.mkdir(uploadPath, { recursive: true });
        } catch (err) {
            // Directory already exists
        }

        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        // Generate filename: ad-{timestamp}-{random}{ext}
        const ext = path.extname(file.originalname).toLowerCase();
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 10000);
        const filename = `ad-${timestamp}-${random}${ext}`;

        cb(null, filename);
    }
});

// File filter for advertisements (images and videos)
const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = [
        // Images
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/webp',
        'image/gif',
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
        cb(new Error('Invalid file type. Only JPEG, PNG, WebP, GIF images and MP4, MOV, AVI, WebM videos are allowed.'), false);
    }
};

// Create multer upload instance
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 100 * 1024 * 1024 // 100MB limit for video ads
    }
});

module.exports = {
    uploadSingle: upload.single('file'),
    uploadMultiple: upload.fields([
        { name: 'image', maxCount: 1 },
        { name: 'thumbnail', maxCount: 1 },
        { name: 'video', maxCount: 1 }
    ])
};
