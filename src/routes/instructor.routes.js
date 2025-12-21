const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const instructorController = require('../controllers/instructor.controller');
const { authenticate } = require('../middleware/auth');
const { requireInstructor } = require('../middleware/roles');
const validate = require('../middleware/validate');

// Public routes
router.get('/', instructorController.getInstructors);
router.get('/:id', instructorController.getInstructorById);

// Protected routes
router.post('/profile',
  authenticate,
  [body('bio').optional().trim()],
  validate,
  instructorController.createProfile
);

router.get('/profile/me',
  authenticate,
  requireInstructor,
  instructorController.getProfile
);

router.put('/profile',
  authenticate,
  requireInstructor,
  instructorController.updateProfile
);

module.exports = router;
