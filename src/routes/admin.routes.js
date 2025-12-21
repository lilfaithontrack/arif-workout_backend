const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const adminController = require('../controllers/admin.controller');
const uploadController = require('../controllers/upload.controller');
const { authenticate } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/roles');
const validate = require('../middleware/validate');
const { uploadSingle, uploadMultiple } = require('../middleware/upload.middleware');

// All routes require admin authentication
router.use(authenticate);
router.use(requireAdmin);

// Course management
router.patch('/courses/:id/approve', adminController.approveCourse);
router.patch('/courses/:id/reject', adminController.rejectCourse);

// Instructor management
router.patch('/instructors/:id/approve', adminController.approveInstructor);

// Category management
router.post('/categories',
  [body('name').trim().notEmpty()],
  validate,
  adminController.createCategory
);
router.get('/categories', adminController.getCategories);
router.put('/categories/:id', adminController.updateCategory);
router.delete('/categories/:id', adminController.deleteCategory);

// Subcategory management
router.post('/subcategories',
  [
    body('name').trim().notEmpty(),
    body('categoryId').isMongoId()
  ],
  validate,
  adminController.createSubcategory
);

// Package management
router.post('/packages',
  [
    body('title').trim().notEmpty(),
    body('price').isFloat({ min: 0 }),
    body('billingCycle').isIn(['monthly', 'quarterly', 'yearly'])
  ],
  validate,
  adminController.createPackage
);
router.get('/packages', adminController.getPackages);
router.put('/packages/:id', adminController.updatePackage);

// User management
router.get('/users', adminController.getUsers);
router.patch('/users/:id/roles', adminController.updateUserRole);

// Body measurements management
router.get('/measurements', adminController.getMeasurements);

// Image upload management
router.get('/upload/subfolders', uploadController.getSubfolders);
router.post('/upload/exercise-folder',
  [body('slug').trim().notEmpty()],
  validate,
  uploadController.createExerciseFolder
);
router.get('/upload/exercise-folders', uploadController.getExerciseFolders);
router.delete('/upload/exercise-folder/:slug', uploadController.deleteExerciseFolder);
router.post('/upload/exercise-image',
  uploadMultiple,
  uploadController.uploadExerciseImage
);
router.post('/upload/download-from-url',
  [
    body('exerciseSlug').trim().notEmpty(),
    body('subfolder').trim().notEmpty(),
    body('imageUrl').trim().isURL()
  ],
  validate,
  uploadController.downloadImageFromUrl
);
router.get('/upload/exercise-images', uploadController.getExerciseImages);
router.delete('/upload/exercise-image/:id', uploadController.deleteExerciseImage);

module.exports = router;
