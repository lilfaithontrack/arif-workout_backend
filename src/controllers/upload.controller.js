const path = require('path');
const fs = require('fs').promises;
const ExerciseImage = require('../models/exerciseimage.model');
const { ALLOWED_SUBFOLDERS } = require('../middleware/upload.middleware');

// Create exercise folder with all subfolders
exports.createExerciseFolder = async (req, res, next) => {
    try {
        const { slug } = req.body;

        if (!slug) {
            return res.status(400).json({ success: false, message: 'Exercise slug is required' });
        }

        // Sanitize slug
        const sanitizedSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, '');
        if (sanitizedSlug !== slug) {
            return res.status(400).json({
                success: false,
                message: 'Invalid slug format. Use lowercase letters, numbers, and hyphens only.'
            });
        }

        // Create base folder
        const basePath = path.join(__dirname, '../../public/images/exercises', sanitizedSlug);

        // Check if folder already exists
        try {
            await fs.access(basePath);
            return res.status(400).json({
                success: false,
                message: 'Exercise folder already exists'
            });
        } catch (err) {
            // Folder doesn't exist, which is good
        }

        // Create all subfolders
        await fs.mkdir(basePath, { recursive: true });

        for (const subfolder of ALLOWED_SUBFOLDERS) {
            const subfolderPath = path.join(basePath, subfolder);
            await fs.mkdir(subfolderPath, { recursive: true });
        }

        res.status(201).json({
            success: true,
            message: 'Exercise folder created successfully',
            data: {
                slug: sanitizedSlug,
                subfolders: ALLOWED_SUBFOLDERS,
                path: `/images/exercises/${sanitizedSlug}`
            }
        });
    } catch (error) {
        next(error);
    }
};

// Get all exercise folders
exports.getExerciseFolders = async (req, res, next) => {
    try {
        const exercisesPath = path.join(__dirname, '../../public/images/exercises');

        // Read all directories
        const folders = await fs.readdir(exercisesPath, { withFileTypes: true });
        const exerciseFolders = folders
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name);

        // Get image counts for each folder
        const foldersWithCounts = await Promise.all(
            exerciseFolders.map(async (slug) => {
                const counts = {};
                let totalImages = 0;

                for (const subfolder of ALLOWED_SUBFOLDERS) {
                    const count = await ExerciseImage.count({
                        where: { exerciseSlug: slug, subfolder }
                    });
                    counts[subfolder] = count;
                    totalImages += count;
                }

                return {
                    slug,
                    subfolders: ALLOWED_SUBFOLDERS,
                    imageCounts: counts,
                    totalImages
                };
            })
        );

        res.status(200).json({
            success: true,
            count: foldersWithCounts.length,
            data: foldersWithCounts
        });
    } catch (error) {
        next(error);
    }
};

// Delete exercise folder and all images
exports.deleteExerciseFolder = async (req, res, next) => {
    try {
        const { slug } = req.params;

        // Sanitize slug
        const sanitizedSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, '');
        const folderPath = path.join(__dirname, '../../public/images/exercises', sanitizedSlug);

        // Check if folder exists
        try {
            await fs.access(folderPath);
        } catch (err) {
            return res.status(404).json({
                success: false,
                message: 'Exercise folder not found'
            });
        }

        // Delete all database records
        const deletedCount = await ExerciseImage.destroy({
            where: { exerciseSlug: sanitizedSlug }
        });

        // Delete folder and all contents
        await fs.rm(folderPath, { recursive: true, force: true });

        res.status(200).json({
            success: true,
            message: 'Exercise folder deleted successfully',
            data: {
                slug: sanitizedSlug,
                imagesDeleted: deletedCount
            }
        });
    } catch (error) {
        next(error);
    }
};

// Upload exercise image(s) or video(s)
exports.uploadExerciseImage = async (req, res, next) => {
    try {
        const { exerciseSlug, subfolder } = req.body;
        const files = req.files || [req.file];

        if (!files || files.length === 0) {
            return res.status(400).json({ success: false, message: 'No files uploaded' });
        }

        // Create database records for uploaded files
        const uploadedImages = await Promise.all(
            files.map(async (file) => {
                // Determine media type based on MIME type
                const mediaType = file.mimetype.startsWith('video/') ? 'video' : 'image';
                
                const imageRecord = await ExerciseImage.create({
                    exerciseSlug,
                    subfolder,
                    mediaType,
                    filename: file.filename,
                    originalName: file.originalname,
                    path: file.path,
                    url: `/images/exercises/${exerciseSlug}/${subfolder}/${file.filename}`,
                    size: file.size,
                    mimeType: file.mimetype,
                    uploadedBy: req.userId
                });

                return imageRecord;
            })
        );

        const imageCount = uploadedImages.filter(f => f.mediaType === 'image').length;
        const videoCount = uploadedImages.filter(f => f.mediaType === 'video').length;
        
        let message = '';
        if (imageCount > 0 && videoCount > 0) {
            message = `${imageCount} image(s) and ${videoCount} video(s) uploaded successfully`;
        } else if (videoCount > 0) {
            message = `${videoCount} video(s) uploaded successfully`;
        } else {
            message = `${imageCount} image(s) uploaded successfully`;
        }

        res.status(201).json({
            success: true,
            message,
            data: uploadedImages
        });
    } catch (error) {
        next(error);
    }
};

// Get exercise images (with optional filters)
exports.getExerciseImages = async (req, res, next) => {
    try {
        const { exerciseSlug, subfolder, page = 1, limit = 50 } = req.query;

        const where = {};
        if (exerciseSlug) where.exerciseSlug = exerciseSlug;
        if (subfolder) where.subfolder = subfolder;

        const offset = (page - 1) * limit;

        const { count, rows: images } = await ExerciseImage.findAndCountAll({
            where,
            order: [['createdAt', 'DESC']],
            limit: parseInt(limit),
            offset
        });

        res.status(200).json({
            success: true,
            count: images.length,
            total: count,
            data: images,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(count / limit)
            }
        });
    } catch (error) {
        next(error);
    }
};

// Delete exercise image
exports.deleteExerciseImage = async (req, res, next) => {
    try {
        const { id } = req.params;

        const image = await ExerciseImage.findByPk(id);
        if (!image) {
            return res.status(404).json({ success: false, message: 'Image not found' });
        }

        // Delete file from filesystem
        try {
            await fs.unlink(image.path);
        } catch (err) {
            console.error('Error deleting file:', err);
            // Continue even if file deletion fails
        }

        // Delete database record
        await image.destroy();

        res.status(200).json({
            success: true,
            message: 'Image deleted successfully',
            data: { id, filename: image.filename }
        });
    } catch (error) {
        next(error);
    }
};

// Download image from URL
exports.downloadImageFromUrl = async (req, res, next) => {
    try {
        const { exerciseSlug, subfolder, imageUrl } = req.body;

        // Validate required fields
        if (!exerciseSlug || !subfolder || !imageUrl) {
            return res.status(400).json({
                success: false,
                message: 'exerciseSlug, subfolder, and imageUrl are required'
            });
        }

        // Sanitize exerciseSlug
        const sanitizedSlug = exerciseSlug.toLowerCase().replace(/[^a-z0-9-]/g, '');

        // Validate subfolder
        if (!ALLOWED_SUBFOLDERS.includes(subfolder)) {
            return res.status(400).json({
                success: false,
                message: `Invalid subfolder. Allowed: ${ALLOWED_SUBFOLDERS.join(', ')}`
            });
        }

        // Validate URL
        let url;
        try {
            url = new URL(imageUrl);
        } catch (err) {
            return res.status(400).json({
                success: false,
                message: 'Invalid image URL'
            });
        }

        // Download image or video
        const axios = require('axios');
        const response = await axios.get(imageUrl, {
            responseType: 'arraybuffer',
            timeout: 60000, // 60 second timeout (for larger video files)
            maxContentLength: 50 * 1024 * 1024 // 50MB limit (to accommodate videos)
        });

        // Validate content type
        const contentType = response.headers['content-type'];
        const allowedTypes = [
            'image/jpeg', 'image/jpg', 'image/png', 'image/webp',
            'video/mp4', 'video/mpeg', 'video/quicktime', 'video/x-msvideo', 'video/webm'
        ];
        if (!allowedTypes.some(type => contentType.includes(type))) {
            return res.status(400).json({
                success: false,
                message: 'URL does not point to a valid image or video file'
            });
        }

        // Determine media type and file extension
        const mediaType = contentType.startsWith('video/') ? 'video' : 'image';
        let ext = '.jpg';
        
        if (mediaType === 'image') {
            if (contentType.includes('png')) ext = '.png';
            else if (contentType.includes('webp')) ext = '.webp';
        } else {
            if (contentType.includes('mp4')) ext = '.mp4';
            else if (contentType.includes('quicktime')) ext = '.mov';
            else if (contentType.includes('x-msvideo')) ext = '.avi';
            else if (contentType.includes('webm')) ext = '.webm';
            else if (contentType.includes('mpeg')) ext = '.mpeg';
        }

        // Generate filename
        const timestamp = Date.now();
        const filename = `${sanitizedSlug}-${subfolder}-${timestamp}${ext}`;

        // Create directory path
        const uploadPath = path.join(__dirname, '../../public/images/exercises', sanitizedSlug, subfolder);
        await fs.mkdir(uploadPath, { recursive: true });

        // Save file
        const filePath = path.join(uploadPath, filename);
        await fs.writeFile(filePath, response.data);

        // Create database record
        const imageRecord = await ExerciseImage.create({
            exerciseSlug: sanitizedSlug,
            subfolder,
            mediaType,
            filename,
            originalName: path.basename(url.pathname) || `downloaded-${mediaType}`,
            path: filePath,
            url: `/images/exercises/${sanitizedSlug}/${subfolder}/${filename}`,
            size: response.data.length,
            mimeType: contentType,
            uploadedBy: req.userId
        });

        res.status(201).json({
            success: true,
            message: `${mediaType === 'video' ? 'Video' : 'Image'} downloaded and saved successfully`,
            data: imageRecord
        });
    } catch (error) {
        if (error.code === 'ECONNABORTED') {
            return res.status(408).json({
                success: false,
                message: 'Request timeout. The image took too long to download.'
            });
        }
        if (error.response) {
            return res.status(400).json({
                success: false,
                message: `Failed to download image: ${error.response.status} ${error.response.statusText}`
            });
        }
        next(error);
    }
};

// Get subfolder list (utility endpoint)
exports.getSubfolders = async (req, res) => {
    res.status(200).json({
        success: true,
        data: ALLOWED_SUBFOLDERS
    });
};

