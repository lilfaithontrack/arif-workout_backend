const path = require('path');
const fs = require('fs').promises;
const NutritionImage = require('../models/nutritionimage.model');

// Allowed subfolders for nutrition images
const NUTRITION_SUBFOLDERS = [
    'main',
    'portions',
    'prepared',
    'nutrition-label',
    'meal-prep',
    'recipes',
    'alternatives'
];

/**
 * Create nutrition image folder structure
 */
exports.createNutritionFolder = async (req, res, next) => {
    try {
        const { slug } = req.body;

        if (!slug) {
            return res.status(400).json({ success: false, message: 'Nutrition slug is required' });
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
        const basePath = path.join(__dirname, '../../public/images/nutrition', sanitizedSlug);

        // Check if folder already exists
        try {
            await fs.access(basePath);
            return res.status(400).json({
                success: false,
                message: 'Nutrition folder already exists'
            });
        } catch (err) {
            // Folder doesn't exist, which is good
        }

        // Create all subfolders
        await fs.mkdir(basePath, { recursive: true });

        for (const subfolder of NUTRITION_SUBFOLDERS) {
            const subfolderPath = path.join(basePath, subfolder);
            await fs.mkdir(subfolderPath, { recursive: true });
        }

        res.status(201).json({
            success: true,
            message: 'Nutrition folder created successfully',
            data: {
                slug: sanitizedSlug,
                subfolders: NUTRITION_SUBFOLDERS,
                path: `/images/nutrition/${sanitizedSlug}`
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Upload nutrition image(s)
 */
exports.uploadNutritionImage = async (req, res, next) => {
    try {
        const { nutritionSlug, subfolder, isPrimary } = req.body;
        const files = req.files || [req.file];

        if (!files || files.length === 0) {
            return res.status(400).json({ success: false, message: 'No files uploaded' });
        }

        if (!nutritionSlug || !subfolder) {
            return res.status(400).json({
                success: false,
                message: 'nutritionSlug and subfolder are required'
            });
        }

        // Validate subfolder
        if (!NUTRITION_SUBFOLDERS.includes(subfolder)) {
            return res.status(400).json({
                success: false,
                message: `Invalid subfolder. Allowed: ${NUTRITION_SUBFOLDERS.join(', ')}`
            });
        }

        // Create database records for uploaded files
        const uploadedImages = await Promise.all(
            files.map(async (file, index) => {
                // Determine media type based on MIME type
                const mediaType = file.mimetype.startsWith('video/') ? 'video' : 'image';

                // Only first image can be primary
                const isThisPrimary = isPrimary && index === 0;

                const imageRecord = await NutritionImage.create({
                    nutritionSlug,
                    subfolder,
                    mediaType,
                    filename: file.filename,
                    originalName: file.originalname,
                    path: file.path,
                    url: `/images/nutrition/${nutritionSlug}/${subfolder}/${file.filename}`,
                    size: file.size,
                    mimeType: file.mimetype,
                    uploadedBy: req.user?.id || req.userId,
                    isPrimary: isThisPrimary
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

/**
 * Get nutrition images
 */
exports.getNutritionImages = async (req, res, next) => {
    try {
        const { nutritionSlug, subfolder, page = 1, limit = 50 } = req.query;

        const where = {};
        if (nutritionSlug) where.nutritionSlug = nutritionSlug;
        if (subfolder) where.subfolder = subfolder;

        const offset = (page - 1) * limit;

        const { count, rows: images } = await NutritionImage.findAndCountAll({
            where,
            order: [
                ['isPrimary', 'DESC'], // Primary images first
                ['createdAt', 'DESC']
            ],
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

/**
 * Delete nutrition image
 */
exports.deleteNutritionImage = async (req, res, next) => {
    try {
        const { id } = req.params;

        const image = await NutritionImage.findByPk(id);
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

/**
 * Set primary image for nutrition item
 */
exports.setPrimaryImage = async (req, res, next) => {
    try {
        const { id } = req.params;

        const image = await NutritionImage.findByPk(id);
        if (!image) {
            return res.status(404).json({ success: false, message: 'Image not found' });
        }

        // Unset all other primary images for this nutrition item
        await NutritionImage.update(
            { isPrimary: false },
            { where: { nutritionSlug: image.nutritionSlug } }
        );

        // Set this image as primary
        await image.update({ isPrimary: true });

        res.status(200).json({
            success: true,
            message: 'Primary image updated successfully',
            data: image
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get subfolder list (utility endpoint)
 */
exports.getSubfolders = async (req, res) => {
    res.status(200).json({
        success: true,
        data: NUTRITION_SUBFOLDERS
    });
};

module.exports.NUTRITION_SUBFOLDERS = NUTRITION_SUBFOLDERS;
