const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const courseController = require('../controllers/course.controller');
const { authenticate, optionalAuth } = require('../middleware/auth');
const { requireInstructor } = require('../middleware/roles');
const validate = require('../middleware/validate');

// Public routes
router.get('/', optionalAuth, courseController.getCourses);
router.get('/:id', optionalAuth, courseController.getCourse);

// Instructor routes
router.post('/',
  authenticate,
  requireInstructor,
  [
    body('title').trim().notEmpty(),
    body('categoryId').notEmpty().isMongoId(),
    body('price').isFloat({ min: 0 }),
    body('currency').optional().isLength({ min: 3, max: 3 })
  ],
  validate,
  courseController.createCourse
);

router.put('/:id',
  authenticate,
  requireInstructor,
  courseController.updateCourse
);

router.post('/:id/submit',
  authenticate,
  requireInstructor,
  courseController.submitForReview
);

router.delete('/:id',
  authenticate,
  requireInstructor,
  courseController.deleteCourse
);

router.get('/instructor/my-courses',
  authenticate,
  requireInstructor,
  courseController.getInstructorCourses
);

module.exports = router;
