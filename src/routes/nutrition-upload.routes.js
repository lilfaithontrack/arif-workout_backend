const express = require('express');
const router = express.Router();
const nutritionUploadController = require('../controllers/nutrition-upload.controller');
const { authenticate, requireRole } = require('../middleware/auth');
const { uploadMultiple } = require('../middleware/upload.middleware');

// All routes require authentication
router.use(authenticate);

/**
 * @route   POST /api/nutrition-upload/folders
 * @desc    Create nutrition folder structure
 * @access  Admin/Instructor
 */
router.post(
    '/folders',
    requireRole('admin', 'instructor'),
    nutritionUploadController.createNutritionFolder
);

/**
 * @route   POST /api/nutrition-upload/images
 * @desc    Upload nutrition images
 * @access  Admin/Instructor
 */
router.post(
    '/images',
    requireRole('admin', 'instructor'),
    uploadMultiple, // Allow up to 10 images at once
    nutritionUploadController.uploadNutritionImage
);

/**
 * @route   GET /api/nutrition-upload/images
 * @desc    Get nutrition images with filters
 * @access  Private
 */
router.get(
    '/images',
    nutritionUploadController.getNutritionImages
);

/**
 * @route   DELETE /api/nutrition-upload/images/:id
 * @desc    Delete nutrition image
 * @access  Admin/Instructor
 */
router.delete(
    '/images/:id',
    requireRole('admin', 'instructor'),
    nutritionUploadController.deleteNutritionImage
);

/**
 * @route   PUT /api/nutrition-upload/images/:id/primary
 * @desc    Set image as primary for nutrition item
 * @access  Admin/Instructor
 */
router.put(
    '/images/:id/primary',
    requireRole('admin', 'instructor'),
    nutritionUploadController.setPrimaryImage
);

/**
 * @route   GET /api/nutrition-upload/subfolders
 * @desc    Get list of allowed subfolders
 * @access  Private
 */
router.get(
    '/subfolders',
    nutritionUploadController.getSubfolders
);

module.exports = router;
