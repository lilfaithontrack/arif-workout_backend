const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const nutritionItemController = require('../controllers/nutritionitem.controller');
const { authenticate } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/roles');
const validate = require('../middleware/validate');

/**
 * Public routes (no authentication required)
 */

/**
 * @route   GET /api/nutrition-items
 * @desc    Get all nutrition items with filters
 * @access  Public
 */
router.get('/', nutritionItemController.getNutritionItems);

/**
 * @route   GET /api/nutrition-items/categories
 * @desc    Get nutrition categories
 * @access  Public
 */
router.get('/categories', nutritionItemController.getCategories);

/**
 * @route   GET /api/nutrition-items/popular
 * @desc    Get popular nutrition items
 * @access  Public
 */
router.get('/popular', nutritionItemController.getPopularItems);

/**
 * @route   GET /api/nutrition-items/search
 * @desc    Search nutrition items
 * @access  Public
 */
router.get('/search', nutritionItemController.searchNutritionItems);

/**
 * @route   GET /api/nutrition-items/:id
 * @desc    Get single nutrition item by ID or slug
 * @access  Public
 */
router.get('/:id', nutritionItemController.getNutritionItem);

/**
 * Admin routes (authentication + admin role required)
 */

/**
 * @route   POST /api/nutrition-items
 * @desc    Create new nutrition item
 * @access  Private/Admin
 */
router.post(
  '/',
  authenticate,
  requireAdmin,
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('category').isIn(['protein', 'carbs', 'fats', 'vegetables', 'fruits', 'dairy', 'grains', 'snacks', 'beverages']).withMessage('Invalid category'),
    body('calories').isInt({ min: 0 }).withMessage('Calories must be a positive number')
  ],
  validate,
  nutritionItemController.createNutritionItem
);

/**
 * @route   PUT /api/nutrition-items/:id
 * @desc    Update nutrition item
 * @access  Private/Admin
 */
router.put(
  '/:id',
  authenticate,
  requireAdmin,
  nutritionItemController.updateNutritionItem
);

/**
 * @route   DELETE /api/nutrition-items/:id
 * @desc    Delete nutrition item (soft delete)
 * @access  Private/Admin
 */
router.delete(
  '/:id',
  authenticate,
  requireAdmin,
  nutritionItemController.deleteNutritionItem
);

module.exports = router;
