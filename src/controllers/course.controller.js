const Course = require('../models/course.model');
const InstructorProfile = require('../models/instructor.model');
const notificationService = require('../services/notification.service');

/**
 * Create a new course (Instructor)
 */
exports.createCourse = async (req, res, next) => {
  try {
    const instructorProfile = await InstructorProfile.findOne({ userId: req.userId });

    if (!instructorProfile) {
      return res.status(403).json({
        success: false,
        message: 'Instructor profile not found. Please create one first.'
      });
    }

    if (!instructorProfile.approved) {
      return res.status(403).json({
        success: false,
        message: 'Your instructor profile must be approved before creating courses.'
      });
    }

    const courseData = {
      ...req.body,
      instructorId: instructorProfile._id,
      slug: req.body.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''),
      status: 'draft'
    };

    const course = new Course(courseData);
    await course.save();

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      course
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all courses with filters
 */
exports.getCourses = async (req, res, next) => {
  try {
    const {
      status = 'approved',
      categoryId,
      level,
      minPrice,
      maxPrice,
      search,
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const query = {};

    // Only show approved courses to non-admin users
    if (!req.user?.isAdmin()) {
      query.status = 'approved';
    } else if (status) {
      query.status = status;
    }

    if (categoryId) query.categoryId = categoryId;
    if (level) query.level = level;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }
    if (search) {
      query.$text = { $search: search };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    const [courses, total] = await Promise.all([
      Course.find(query)
        .populate('instructorId', 'userId bio specialties')
        .populate('categoryId', 'name slug')
        .populate('images')
        .sort(sort)
        .limit(parseInt(limit))
        .skip(skip),
      Course.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      courses,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single course by ID or slug
 */
exports.getCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const course = await Course.findOne({
      $or: [{ _id: id }, { slug: id }]
    })
      .populate('instructorId')
      .populate('categoryId')
      .populate('workouts')
      .populate('images');

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if user can view this course
    if (course.status !== 'approved' && !req.user?.isAdmin() && 
        course.instructorId.userId.toString() !== req.userId?.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.status(200).json({
      success: true,
      course
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update course (Instructor)
 */
exports.updateCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id).populate('instructorId');

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check ownership
    if (course.instructorId.userId.toString() !== req.userId.toString() && !req.user.isAdmin()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Don't allow updating approved courses without admin
    if (course.status === 'approved' && !req.user.isAdmin()) {
      return res.status(403).json({
        success: false,
        message: 'Cannot update approved courses. Contact admin.'
      });
    }

    const allowedUpdates = ['title', 'description', 'price', 'currency', 'categoryId', 
                            'subcategory', 'workouts', 'images', 'level', 'durationWeeks'];
    const updates = {};

    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    if (updates.title) {
      updates.slug = updates.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
    }

    updates.updatedAt = new Date();

    const updatedCourse = await Course.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    ).populate('instructorId categoryId workouts images');

    res.status(200).json({
      success: true,
      message: 'Course updated successfully',
      course: updatedCourse
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Submit course for review (Instructor)
 */
exports.submitForReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id).populate('instructorId');

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    if (course.instructorId.userId.toString() !== req.userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    if (course.status !== 'draft' && course.status !== 'rejected') {
      return res.status(400).json({
        success: false,
        message: 'Only draft or rejected courses can be submitted for review'
      });
    }

    course.status = 'pending';
    course.updatedAt = new Date();
    await course.save();

    // Notify admins
    const instructor = await require('../models/user.model').findById(course.instructorId.userId);
    await notificationService.notifyCourseSubmission(course, instructor);

    res.status(200).json({
      success: true,
      message: 'Course submitted for review',
      course
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete course (Instructor/Admin)
 */
exports.deleteCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id).populate('instructorId');

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check ownership or admin
    if (course.instructorId.userId.toString() !== req.userId.toString() && !req.user.isAdmin()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Don't allow deleting approved courses with enrollments
    if (course.status === 'approved' && course.enrollmentCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete courses with active enrollments'
      });
    }

    await Course.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Course deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get instructor's courses
 */
exports.getInstructorCourses = async (req, res, next) => {
  try {
    const instructorProfile = await InstructorProfile.findOne({ userId: req.userId });

    if (!instructorProfile) {
      return res.status(404).json({
        success: false,
        message: 'Instructor profile not found'
      });
    }

    const { status, page = 1, limit = 20 } = req.query;
    const query = { instructorId: instructorProfile._id };
    
    if (status) query.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [courses, total] = await Promise.all([
      Course.find(query)
        .populate('categoryId', 'name slug')
        .populate('images')
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))
        .skip(skip),
      Course.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      courses,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    next(error);
  }
};
