const { Advertisement, User } = require('../models');
const { Op } = require('sequelize');

/**
 * Get all advertisements with filters
 */
exports.getAdvertisements = async (req, res, next) => {
  try {
    const {
      status,
      type,
      category,
      isActive,
      placement,
      search,
      page = 1,
      limit = 20
    } = req.query;

    const where = {};

    if (status) where.status = status;
    if (type) where.type = type;
    if (category) where.category = category;
    if (isActive !== undefined) where.isActive = isActive === 'true';

    if (placement) {
      where.placement = {
        [Op.contains]: [placement]
      };
    }

    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { advertiserName: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const offset = (page - 1) * limit;

    const { count, rows: advertisements } = await Advertisement.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'name', 'email']
        },
        {
          model: User,
          as: 'approver',
          attributes: ['id', 'name', 'email']
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['priority', 'DESC'], ['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      count,
      page: parseInt(page),
      totalPages: Math.ceil(count / limit),
      data: { advertisements }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get active advertisements for public display
 */
exports.getActiveAds = async (req, res, next) => {
  try {
    const { placement, type, category, deviceType = 'desktop' } = req.query;

    const now = new Date();
    const where = {
      isActive: true,
      status: 'active',
      startDate: { [Op.lte]: now },
      [Op.or]: [
        { endDate: null },
        { endDate: { [Op.gte]: now } }
      ]
    };

    if (placement) {
      where.placement = {
        [Op.contains]: [placement]
      };
    }

    if (type) where.type = type;
    if (category) where.category = category;

    if (deviceType) {
      where.targetDevices = {
        [Op.contains]: [deviceType]
      };
    }

    const advertisements = await Advertisement.findAll({
      where,
      attributes: [
        'id', 'title', 'description', 'type', 'category',
        'imageUrl', 'thumbnailUrl', 'videoUrl',
        'targetUrl', 'ctaText', 'placement', 'position',
        'dimensions', 'priority'
      ],
      order: [['priority', 'DESC']],
      limit: 10
    });

    res.status(200).json({
      success: true,
      count: advertisements.length,
      data: { advertisements }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single advertisement by ID
 */
exports.getAdvertisement = async (req, res, next) => {
  try {
    const advertisement = await Advertisement.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'name', 'email']
        },
        {
          model: User,
          as: 'approver',
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    if (!advertisement) {
      return res.status(404).json({
        success: false,
        message: 'Advertisement not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { advertisement }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create advertisement (Admin only)
 */
exports.createAdvertisement = async (req, res, next) => {
  try {
    const {
      title,
      description,
      type,
      category,
      imageUrl,
      thumbnailUrl,
      videoUrl,
      targetUrl,
      ctaText,
      placement,
      position,
      dimensions,
      startDate,
      endDate,
      targetAudience,
      targetDevices,
      priority,
      dailyBudget,
      totalBudget,
      costPerClick,
      costPerImpression,
      advertiserName,
      advertiserEmail,
      advertiserPhone,
      advertiserWebsite,
      maxImpressions,
      maxClicks,
      frequency,
      tags,
      notes
    } = req.body;

    const advertisement = await Advertisement.create({
      title,
      description,
      type,
      category,
      imageUrl,
      thumbnailUrl,
      videoUrl,
      targetUrl,
      ctaText,
      placement: placement || [],
      position,
      dimensions: dimensions || {},
      startDate: startDate || new Date(),
      endDate,
      targetAudience: targetAudience || {},
      targetDevices: targetDevices || ['desktop', 'mobile', 'tablet'],
      priority: priority || 5,
      dailyBudget,
      totalBudget,
      costPerClick,
      costPerImpression,
      advertiserName,
      advertiserEmail,
      advertiserPhone,
      advertiserWebsite,
      maxImpressions,
      maxClicks,
      frequency: frequency || {},
      tags: tags || [],
      notes,
      status: 'draft',
      createdBy: req.user.id
    });

    res.status(201).json({
      success: true,
      message: 'Advertisement created successfully',
      data: { advertisement }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Upload media files for advertisement
 */
exports.uploadMedia = async (req, res, next) => {
  try {
    const { id } = req.params;

    const advertisement = await Advertisement.findByPk(id);
    if (!advertisement) {
      return res.status(404).json({
        success: false,
        message: 'Advertisement not found'
      });
    }

    const updateData = {};

    // Handle image upload
    if (req.files && req.files.image) {
      const imageFile = req.files.image[0];
      updateData.imageUrl = `/images/advertisements/${imageFile.filename}`;
    }

    // Handle thumbnail upload
    if (req.files && req.files.thumbnail) {
      const thumbnailFile = req.files.thumbnail[0];
      updateData.thumbnailUrl = `/images/advertisements/${thumbnailFile.filename}`;
    }

    // Handle video upload
    if (req.files && req.files.video) {
      const videoFile = req.files.video[0];
      updateData.videoUrl = `/images/advertisements/${videoFile.filename}`;
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
    }

    await advertisement.update(updateData);

    res.status(200).json({
      success: true,
      message: 'Media uploaded successfully',
      data: {
        advertisement,
        uploaded: updateData
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update advertisement (Admin only)
 */
exports.updateAdvertisement = async (req, res, next) => {
  try {
    const advertisement = await Advertisement.findByPk(req.params.id);

    if (!advertisement) {
      return res.status(404).json({
        success: false,
        message: 'Advertisement not found'
      });
    }

    const {
      title,
      description,
      type,
      category,
      imageUrl,
      thumbnailUrl,
      videoUrl,
      targetUrl,
      ctaText,
      placement,
      position,
      dimensions,
      startDate,
      endDate,
      targetAudience,
      targetDevices,
      priority,
      dailyBudget,
      totalBudget,
      costPerClick,
      costPerImpression,
      advertiserName,
      advertiserEmail,
      advertiserPhone,
      advertiserWebsite,
      status,
      maxImpressions,
      maxClicks,
      frequency,
      tags,
      notes,
      moderationNotes
    } = req.body;

    await advertisement.update({
      title: title || advertisement.title,
      description: description !== undefined ? description : advertisement.description,
      type: type || advertisement.type,
      category: category || advertisement.category,
      imageUrl: imageUrl !== undefined ? imageUrl : advertisement.imageUrl,
      thumbnailUrl: thumbnailUrl !== undefined ? thumbnailUrl : advertisement.thumbnailUrl,
      videoUrl: videoUrl !== undefined ? videoUrl : advertisement.videoUrl,
      targetUrl: targetUrl || advertisement.targetUrl,
      ctaText: ctaText !== undefined ? ctaText : advertisement.ctaText,
      placement: placement || advertisement.placement,
      position: position || advertisement.position,
      dimensions: dimensions || advertisement.dimensions,
      startDate: startDate || advertisement.startDate,
      endDate: endDate !== undefined ? endDate : advertisement.endDate,
      targetAudience: targetAudience || advertisement.targetAudience,
      targetDevices: targetDevices || advertisement.targetDevices,
      priority: priority !== undefined ? priority : advertisement.priority,
      dailyBudget: dailyBudget !== undefined ? dailyBudget : advertisement.dailyBudget,
      totalBudget: totalBudget !== undefined ? totalBudget : advertisement.totalBudget,
      costPerClick: costPerClick !== undefined ? costPerClick : advertisement.costPerClick,
      costPerImpression: costPerImpression !== undefined ? costPerImpression : advertisement.costPerImpression,
      advertiserName: advertiserName || advertisement.advertiserName,
      advertiserEmail: advertiserEmail !== undefined ? advertiserEmail : advertisement.advertiserEmail,
      advertiserPhone: advertiserPhone !== undefined ? advertiserPhone : advertisement.advertiserPhone,
      advertiserWebsite: advertiserWebsite !== undefined ? advertiserWebsite : advertisement.advertiserWebsite,
      status: status || advertisement.status,
      maxImpressions: maxImpressions !== undefined ? maxImpressions : advertisement.maxImpressions,
      maxClicks: maxClicks !== undefined ? maxClicks : advertisement.maxClicks,
      frequency: frequency || advertisement.frequency,
      tags: tags || advertisement.tags,
      notes: notes !== undefined ? notes : advertisement.notes,
      moderationNotes: moderationNotes !== undefined ? moderationNotes : advertisement.moderationNotes
    });

    res.status(200).json({
      success: true,
      message: 'Advertisement updated successfully',
      data: { advertisement }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete advertisement (Admin only)
 */
exports.deleteAdvertisement = async (req, res, next) => {
  try {
    const advertisement = await Advertisement.findByPk(req.params.id);

    if (!advertisement) {
      return res.status(404).json({
        success: false,
        message: 'Advertisement not found'
      });
    }

    await advertisement.destroy();

    res.status(200).json({
      success: true,
      message: 'Advertisement deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Approve advertisement (Admin only)
 */
exports.approveAdvertisement = async (req, res, next) => {
  try {
    const advertisement = await Advertisement.findByPk(req.params.id);

    if (!advertisement) {
      return res.status(404).json({
        success: false,
        message: 'Advertisement not found'
      });
    }

    await advertisement.update({
      status: 'approved',
      approvedBy: req.user.id,
      approvedAt: new Date()
    });

    res.status(200).json({
      success: true,
      message: 'Advertisement approved successfully',
      data: { advertisement }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Activate/Deactivate advertisement (Admin only)
 */
exports.toggleAdvertisement = async (req, res, next) => {
  try {
    const advertisement = await Advertisement.findByPk(req.params.id);

    if (!advertisement) {
      return res.status(404).json({
        success: false,
        message: 'Advertisement not found'
      });
    }

    const newStatus = advertisement.status === 'active' ? 'paused' : 'active';

    await advertisement.update({
      status: newStatus
    });

    res.status(200).json({
      success: true,
      message: `Advertisement ${newStatus === 'active' ? 'activated' : 'paused'} successfully`,
      data: { advertisement }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Track advertisement impression
 */
exports.trackImpression = async (req, res, next) => {
  try {
    const advertisement = await Advertisement.findByPk(req.params.id);

    if (!advertisement) {
      return res.status(404).json({
        success: false,
        message: 'Advertisement not found'
      });
    }

    await advertisement.increment('impressions', { by: 1 });

    if (advertisement.costPerImpression) {
      const cost = parseFloat(advertisement.costPerImpression) / 1000;
      await advertisement.increment('totalSpent', { by: cost });
    }

    if (advertisement.maxImpressions &&
      advertisement.impressions >= advertisement.maxImpressions) {
      await advertisement.update({ status: 'completed', isActive: false });
    }

    res.status(200).json({
      success: true,
      message: 'Impression tracked'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Track advertisement click
 */
exports.trackClick = async (req, res, next) => {
  try {
    const advertisement = await Advertisement.findByPk(req.params.id);

    if (!advertisement) {
      return res.status(404).json({
        success: false,
        message: 'Advertisement not found'
      });
    }

    await advertisement.increment('clicks', { by: 1 });

    if (advertisement.costPerClick) {
      await advertisement.increment('totalSpent', { by: parseFloat(advertisement.costPerClick) });
    }

    if (advertisement.maxClicks &&
      advertisement.clicks >= advertisement.maxClicks) {
      await advertisement.update({ status: 'completed', isActive: false });
    }

    res.status(200).json({
      success: true,
      message: 'Click tracked',
      data: { targetUrl: advertisement.targetUrl }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Track advertisement conversion
 */
exports.trackConversion = async (req, res, next) => {
  try {
    const advertisement = await Advertisement.findByPk(req.params.id);

    if (!advertisement) {
      return res.status(404).json({
        success: false,
        message: 'Advertisement not found'
      });
    }

    await advertisement.increment('conversions', { by: 1 });

    res.status(200).json({
      success: true,
      message: 'Conversion tracked'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get advertisement analytics
 */
exports.getAnalytics = async (req, res, next) => {
  try {
    const advertisement = await Advertisement.findByPk(req.params.id);

    if (!advertisement) {
      return res.status(404).json({
        success: false,
        message: 'Advertisement not found'
      });
    }

    const ctr = advertisement.impressions > 0
      ? ((advertisement.clicks / advertisement.impressions) * 100).toFixed(2)
      : 0;

    const conversionRate = advertisement.clicks > 0
      ? ((advertisement.conversions / advertisement.clicks) * 100).toFixed(2)
      : 0;

    const avgCostPerClick = advertisement.clicks > 0
      ? (parseFloat(advertisement.totalSpent) / advertisement.clicks).toFixed(2)
      : 0;

    const analytics = {
      impressions: advertisement.impressions,
      clicks: advertisement.clicks,
      conversions: advertisement.conversions,
      totalSpent: parseFloat(advertisement.totalSpent),
      ctr: parseFloat(ctr),
      conversionRate: parseFloat(conversionRate),
      avgCostPerClick: parseFloat(avgCostPerClick),
      remainingBudget: advertisement.totalBudget
        ? (parseFloat(advertisement.totalBudget) - parseFloat(advertisement.totalSpent)).toFixed(2)
        : null,
      daysActive: advertisement.startDate
        ? Math.floor((new Date() - new Date(advertisement.startDate)) / (1000 * 60 * 60 * 24))
        : 0
    };

    res.status(200).json({
      success: true,
      data: { analytics }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get advertisement statistics (Admin only)
 */
exports.getStatistics = async (req, res, next) => {
  try {
    const totalAds = await Advertisement.count();
    const activeAds = await Advertisement.count({ where: { isActive: true } });
    const pendingAds = await Advertisement.count({ where: { status: 'pending' } });
    const completedAds = await Advertisement.count({ where: { status: 'completed' } });

    const totalImpressions = await Advertisement.sum('impressions');
    const totalClicks = await Advertisement.sum('clicks');
    const totalConversions = await Advertisement.sum('conversions');
    const totalSpent = await Advertisement.sum('totalSpent');

    const topPerformers = await Advertisement.findAll({
      where: { isActive: true },
      order: [['clicks', 'DESC']],
      limit: 5,
      attributes: ['id', 'title', 'impressions', 'clicks', 'conversions']
    });

    res.status(200).json({
      success: true,
      data: {
        statistics: {
          totalAds,
          activeAds,
          pendingAds,
          completedAds,
          totalImpressions: totalImpressions || 0,
          totalClicks: totalClicks || 0,
          totalConversions: totalConversions || 0,
          totalSpent: parseFloat(totalSpent || 0),
          averageCTR: totalImpressions > 0
            ? ((totalClicks / totalImpressions) * 100).toFixed(2)
            : 0
        },
        topPerformers
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = exports;
