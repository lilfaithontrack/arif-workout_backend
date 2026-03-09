const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer storage for category images
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Create directory path for categories
        const uploadPath = path.join(__dirname, '../../public/images/categories');

        // Create directories if they don't exist
        fs.mkdirSync(uploadPath, { recursive: true });

        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        // Get file extension
        const ext = path.extname(file.originalname).toLowerCase();

        // Generate filename: category-{timestamp}{ext}
        const timestamp = Date.now();
        const filename = `category-${timestamp}${ext}`;

        cb(null, filename);
    }
});

// Configure multer storage for subcategory images
const subcategoryStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Create directory path for subcategories
        const uploadPath = path.join(__dirname, '../../public/images/subcategories');

        // Create directories if they don't exist
        fs.mkdirSync(uploadPath, { recursive: true });

        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        // Get file extension
        const ext = path.extname(file.originalname).toLowerCase();

        // Generate filename: subcategory-{timestamp}{ext}
        const timestamp = Date.now();
        const filename = `subcategory-${timestamp}${ext}`;

        cb(null, filename);
    }
});

// File filter to validate file types (images only)
const imageFileFilter = (req, file, cb) => {
    const allowedMimeTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/webp',
        'image/gif'
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG, PNG, WebP, and GIF images are allowed.'), false);
    }
};

// Create multer upload instances
const categoryUpload = multer({
    storage: storage,
    fileFilter: imageFileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit for images
    }
});

const subcategoryUpload = multer({
    storage: subcategoryStorage,
    fileFilter: imageFileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit for images
    }
});

// Export middleware functions
module.exports = {
    uploadCategoryImage: categoryUpload.single('image'),
    uploadSubcategoryImage: subcategoryUpload.single('image')
};
