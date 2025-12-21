const InstructorProfile = require('../models/instructor.model');
const User = require('../models/user.model');

// Create instructor profile
exports.createProfile = async (req, res, next) => {
  try {
    const existing = await InstructorProfile.findOne({ userId: req.userId });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Instructor profile already exists' });
    }

    const profile = new InstructorProfile({
      userId: req.userId,
      ...req.body
    });

    await profile.save();
    res.status(201).json({ success: true, message: 'Instructor profile created', profile });
  } catch (error) {
    next(error);
  }
};

// Get instructor profile
exports.getProfile = async (req, res, next) => {
  try {
    const profile = await InstructorProfile.findOne({ userId: req.userId }).populate('userId', 'name email');

    if (!profile) {
      return res.status(404).json({ success: false, message: 'Instructor profile not found' });
    }

    res.status(200).json({ success: true, profile });
  } catch (error) {
    next(error);
  }
};

// Update instructor profile
exports.updateProfile = async (req, res, next) => {
  try {
    const allowedUpdates = ['bio', 'experienceYears', 'specialties', 'languages'];
    const updates = {};

    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    const profile = await InstructorProfile.findOneAndUpdate(
      { userId: req.userId },
      updates,
      { new: true, runValidators: true }
    );

    if (!profile) {
      return res.status(404).json({ success: false, message: 'Instructor profile not found' });
    }

    res.status(200).json({ success: true, message: 'Profile updated', profile });
  } catch (error) {
    next(error);
  }
};

// Get all instructors (public)
exports.getInstructors = async (req, res, next) => {
  try {
    const { approved = true, specialty, page = 1, limit = 20 } = req.query;
    const { Op } = require('sequelize');
    const where = {};

    if (approved !== undefined) where.approved = approved === 'true';
    if (specialty) {
      // For JSON array field in Sequelize
      where.specialties = { [Op.contains]: [specialty] };
    }

    const offset = (page - 1) * limit;
    const { count: total, rows: instructors } = await InstructorProfile.findAndCountAll({
      where,
      include: [{
        model: User,
        as: 'user',
        attributes: ['name', 'email']
      }],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset
    });

    res.status(200).json({
      success: true,
      instructors,
      pagination: { total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    next(error);
  }
};

// Get instructor by ID (public)
exports.getInstructorById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const profile = await InstructorProfile.findById(id).populate('userId', 'name email');

    if (!profile) {
      return res.status(404).json({ success: false, message: 'Instructor not found' });
    }

    res.status(200).json({ success: true, profile });
  } catch (error) {
    next(error);
  }
};
