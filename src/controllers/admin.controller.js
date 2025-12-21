const Course = require('../models/course.model');
const Package = require('../models/package.model');
const Category = require('../models/category.model');
const Subcategory = require('../models/subcategory.model');
const InstructorProfile = require('../models/instructor.model');
const User = require('../models/user.model');
const BodyMeasurement = require('../models/bodymeasurement.model');
const notificationService = require('../services/notification.service');
const { Op } = require('sequelize');

// Course approval
exports.approveCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;

    const course = await Course.findById(id).populate('instructorId');
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    course.status = 'approved';
    course.approvedBy = req.userId;
    course.approvalDate = new Date();
    course.approvalNotes = notes;
    await course.save();

    const instructor = await User.findById(course.instructorId.userId);
    await notificationService.notifyCourseStatus(course, instructor, 'approved', notes);

    res.status(200).json({ success: true, message: 'Course approved', course });
  } catch (error) {
    next(error);
  }
};

exports.rejectCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;

    const course = await Course.findById(id).populate('instructorId');
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    course.status = 'rejected';
    course.approvalNotes = notes;
    await course.save();

    const instructor = await User.findById(course.instructorId.userId);
    await notificationService.notifyCourseStatus(course, instructor, 'rejected', notes);

    res.status(200).json({ success: true, message: 'Course rejected', course });
  } catch (error) {
    next(error);
  }
};

// Instructor approval
exports.approveInstructor = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;

    const instructor = await InstructorProfile.findById(id);
    if (!instructor) {
      return res.status(404).json({ success: false, message: 'Instructor not found' });
    }

    instructor.approved = true;
    instructor.approvalBy = req.userId;
    instructor.approvalDate = new Date();
    instructor.approvalNotes = notes;
    await instructor.save();

    // Add instructor role to user
    await User.findByIdAndUpdate(instructor.userId, {
      $addToSet: { roles: 'instructor' }
    });

    res.status(200).json({ success: true, message: 'Instructor approved', instructor });
  } catch (error) {
    next(error);
  }
};

// Category management
exports.createCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

    const category = new Category({
      name,
      slug,
      description,
      createdBy: req.userId
    });

    await category.save();
    res.status(201).json({ success: true, message: 'Category created', category });
  } catch (error) {
    next(error);
  }
};

exports.getCategories = async (req, res, next) => {
  try {
    const Subcategory = require('../models/subcategory.model');

    const categories = await Category.findAll({
      include: [{
        model: Subcategory,
        as: 'subcategories',
        attributes: ['id', 'name', 'slug', 'description']
      }],
      order: [['name', 'ASC']]
    });

    res.status(200).json({ success: true, categories });
  } catch (error) {
    next(error);
  }
};

exports.updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates.name) {
      updates.slug = updates.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
    }

    const category = await Category.findByIdAndUpdate(id, updates, { new: true });
    res.status(200).json({ success: true, message: 'Category updated', category });
  } catch (error) {
    next(error);
  }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Category.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: 'Category deleted' });
  } catch (error) {
    next(error);
  }
};

// Subcategory management
exports.createSubcategory = async (req, res, next) => {
  try {
    const { name, description, categoryId } = req.body;
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

    const subcategory = new Subcategory({
      name,
      slug,
      description,
      categoryId,
      createdBy: req.userId
    });

    await subcategory.save();
    res.status(201).json({ success: true, message: 'Subcategory created', subcategory });
  } catch (error) {
    next(error);
  }
};

// Package management
exports.createPackage = async (req, res, next) => {
  try {
    const packageData = {
      ...req.body,
      slug: req.body.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''),
      createdByAdmin: req.userId
    };

    const pkg = new Package(packageData);
    await pkg.save();

    res.status(201).json({ success: true, message: 'Package created', package: pkg });
  } catch (error) {
    next(error);
  }
};

exports.updatePackage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates.title) {
      updates.slug = updates.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
    }
    updates.updatedAt = new Date();

    const pkg = await Package.findByIdAndUpdate(id, updates, { new: true });
    res.status(200).json({ success: true, message: 'Package updated', package: pkg });
  } catch (error) {
    next(error);
  }
};

exports.getPackages = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = status ? { status } : {};
    const skip = (page - 1) * limit;

    const [packages, total] = await Promise.all([
      Package.find(query)
        .populate('categoryId', 'name')
        .populate('includedCourses', 'title')
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))
        .skip(skip),
      Package.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      packages,
      pagination: { total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    next(error);
  }
};

// User management
exports.getUsers = async (req, res, next) => {
  try {
    const { role, search, page = 1, limit = 20 } = req.query;
    const where = {};

    if (role) {
      // For Sequelize JSON field, we need to use JSON contains
      where.roles = { [Op.contains]: [role] };
    }
    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const offset = (page - 1) * limit;
    const [users, total] = await Promise.all([
      User.findAll({
        where,
        attributes: { exclude: ['password'] },
        order: [['createdAt', 'DESC']],
        limit: parseInt(limit),
        offset
      }),
      User.count({ where })
    ]);

    res.status(200).json({
      success: true,
      users,
      pagination: { total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    next(error);
  }
};

exports.updateUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { roles } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    await user.update({ roles });

    res.status(200).json({ success: true, message: 'User roles updated', user });
  } catch (error) {
    next(error);
  }
};

// Body Measurements management
exports.getMeasurements = async (req, res, next) => {
  try {
    const { page = 1, limit = 50, userId, startDate, endDate } = req.query;
    const where = {};

    if (userId) where.userId = userId;
    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date[Op.gte] = startDate;
      if (endDate) where.date[Op.lte] = endDate;
    }

    const skip = (page - 1) * limit;
    const [measurements, total] = await Promise.all([
      BodyMeasurement.findAll({
        where,
        include: [{
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email']
        }],
        limit: parseInt(limit),
        offset: skip,
        order: [['date', 'DESC']]
      }),
      BodyMeasurement.count({ where })
    ]);

    // Format response with user data
    const formattedMeasurements = measurements.map(m => ({
      id: m.id,
      userId: m.userId,
      userName: m.user?.name || 'Unknown User',
      userEmail: m.user?.email,
      date: m.date,
      weightKg: m.weight,
      heightCm: m.height,
      bmi: m.bmi,
      bodyFatPercentage: m.bodyFatPercentage,
      muscleMassPercentage: m.muscleMassPercentage,
      chest: m.chest,
      waist: m.waist,
      hips: m.hips,
      notes: m.notes,
      createdAt: m.createdAt
    }));

    res.status(200).json({
      success: true,
      count: formattedMeasurements.length,
      total,
      data: formattedMeasurements,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};
