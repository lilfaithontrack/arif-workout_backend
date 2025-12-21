const NutritionItem = require('../models/nutritionitem.model');
const { Op } = require('sequelize');

/**
 * Get all nutrition items with filters
 */
exports.getNutritionItems = async (req, res, next) => {
  try {
    const {
      category,
      isVegetarian,
      isVegan,
      isGlutenFree,
      isKeto,
      mealType,
      goal,
      search,
      page = 1,
      limit = 1000,
      sortBy = 'popularityScore',
      sortOrder = 'DESC'
    } = req.query;

    const where = { isActive: true };

    // Category filter
    if (category) where.category = category;

    // Dietary filters
    if (isVegetarian === 'true') where.isVegetarian = true;
    if (isVegan === 'true') where.isVegan = true;
    if (isGlutenFree === 'true') where.isGlutenFree = true;
    if (isKeto === 'true') where.isKeto = true;

    // Search by name
    if (search) {
      where.name = { [Op.like]: `%${search}%` };
    }

    const offset = (page - 1) * limit;

    const { count, rows: items } = await NutritionItem.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [[sortBy, sortOrder]]
    });

    // Filter by meal type or goal if provided (JSON fields)
    let filteredItems = items;
    if (mealType) {
      filteredItems = items.filter(item =>
        item.mealTypes && item.mealTypes.includes(mealType)
      );
    }
    if (goal) {
      filteredItems = items.filter(item =>
        item.goals && item.goals.includes(goal)
      );
    }

    res.status(200).json({
      success: true,
      count: filteredItems.length,
      total: count,
      page: parseInt(page),
      totalPages: Math.ceil(count / limit),
      data: filteredItems
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single nutrition item by ID or slug
 */
exports.getNutritionItem = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if id is numeric (ID) or string (slug)
    const where = isNaN(id) ? { slug: id } : { id: parseInt(id) };

    const item = await NutritionItem.findOne({ where });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Nutrition item not found'
      });
    }

    res.status(200).json({
      success: true,
      data: item
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create new nutrition item (Admin only)
 */
exports.createNutritionItem = async (req, res, next) => {
  try {
    const {
      foodId,
      name,
      category,
      servingSize,
      calories,
      protein,
      carbs,
      fats,
      fiber,
      sugar,
      vitamins,
      minerals,
      isVegetarian,
      isVegan,
      isGlutenFree,
      isDairyFree,
      isKeto,
      allergens,
      mealTypes,
      goals,
      preparationTime,
      cost,
      tags,
      popularityScore,
      imageUrl,
      thumbnailUrl,
      videoUrl
    } = req.body;

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const item = await NutritionItem.create({
      foodId,
      name,
      slug,
      category,
      servingSize,
      calories,
      protein: protein || 0,
      carbs: carbs || 0,
      fats: fats || 0,
      fiber: fiber || 0,
      sugar: sugar || 0,
      vitamins: vitamins || {},
      minerals: minerals || {},
      isVegetarian: isVegetarian || false,
      isVegan: isVegan || false,
      isGlutenFree: isGlutenFree || false,
      isDairyFree: isDairyFree || false,
      isKeto: isKeto || false,
      allergens: allergens || [],
      mealTypes: mealTypes || [],
      goals: goals || [],
      preparationTime,
      cost,
      tags: tags || [],
      popularityScore: popularityScore || 50,
      imageUrl,
      thumbnailUrl,
      videoUrl,
      createdBy: req.userId || 1
    });

    res.status(201).json({
      success: true,
      message: 'Nutrition item created successfully',
      data: item
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update nutrition item (Admin only)
 */
exports.updateNutritionItem = async (req, res, next) => {
  try {
    const { id } = req.params;

    const item = await NutritionItem.findByPk(id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Nutrition item not found'
      });
    }

    // Update slug if name changes
    if (req.body.name && req.body.name !== item.name) {
      req.body.slug = req.body.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    await item.update(req.body);

    res.status(200).json({
      success: true,
      message: 'Nutrition item updated successfully',
      data: item
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete nutrition item (Admin only)
 */
exports.deleteNutritionItem = async (req, res, next) => {
  try {
    const { id } = req.params;

    const item = await NutritionItem.findByPk(id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Nutrition item not found'
      });
    }

    // Soft delete by setting isActive to false
    await item.update({ isActive: false });

    res.status(200).json({
      success: true,
      message: 'Nutrition item deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get nutrition categories
 */
exports.getCategories = async (req, res, next) => {
  try {
    const categories = [
      'protein',
      'carbs',
      'fats',
      'vegetables',
      'fruits',
      'dairy',
      'grains',
      'snacks',
      'beverages'
    ];

    // Get count for each category
    const categoriesWithCount = await Promise.all(
      categories.map(async (category) => {
        const count = await NutritionItem.count({
          where: { category, isActive: true }
        });
        return { category, count };
      })
    );

    res.status(200).json({
      success: true,
      data: categoriesWithCount
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get popular nutrition items
 */
exports.getPopularItems = async (req, res, next) => {
  try {
    const { limit = 10 } = req.query;

    const items = await NutritionItem.findAll({
      where: { isActive: true },
      order: [['popularityScore', 'DESC']],
      limit: parseInt(limit)
    });

    res.status(200).json({
      success: true,
      count: items.length,
      data: items
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Search nutrition items
 */
exports.searchNutritionItems = async (req, res, next) => {
  try {
    const { q, limit = 20 } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const items = await NutritionItem.findAll({
      where: {
        isActive: true,
        [Op.or]: [
          { name: { [Op.like]: `%${q}%` } },
          { slug: { [Op.like]: `%${q}%` } }
        ]
      },
      limit: parseInt(limit),
      order: [['popularityScore', 'DESC']]
    });

    res.status(200).json({
      success: true,
      count: items.length,
      data: items
    });
  } catch (error) {
    next(error);
  }
};

module.exports = exports;
