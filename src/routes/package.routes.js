const express = require('express');
const router = express.Router();
const Package = require('../models/package.model');
const { optionalAuth } = require('../middleware/auth');
const { Op } = require('sequelize');

// Get all packages (public with optional auth for personalization)
router.get('/', optionalAuth, async (req, res, next) => {
  try {
    const {
      status = 'active',
      gender,
      level,
      billingCycle,
      categoryId,
      page = 1,
      limit = 20
    } = req.query;

    const where = { status };

    // Filter by user's gender if authenticated
    if (req.user?.gender && !gender) {
      where[Op.or] = [
        { genderRestriction: 'any' },
        { genderRestriction: req.user.gender }
      ];
    } else if (gender) {
      where[Op.or] = [
        { genderRestriction: 'any' },
        { genderRestriction: gender }
      ];
    }

    if (level) {
      where.levelRestriction = { [Op.or]: ['any', level] };
    }

    if (billingCycle) where.billingCycle = billingCycle;
    if (categoryId) where.categoryId = categoryId;

    const offset = (page - 1) * limit;

    const { count, rows: packages } = await Package.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: offset,
      order: [
        ['subscriberCount', 'DESC'],
        ['createdAt', 'DESC']
      ]
    });

    res.status(200).json({
      success: true,
      packages,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get single package
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    // Try to find by ID or slug
    const pkg = await Package.findOne({
      where: {
        [Op.or]: [
          { id: id },
          { slug: id }
        ],
        status: 'active'
      }
    });

    if (!pkg) {
      return res.status(404).json({
        success: false,
        message: 'Package not found'
      });
    }

    res.status(200).json({
      success: true,
      package: pkg
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
