const express = require('express');
const router = express.Router();
const aiWorkoutController = require('../controllers/aiworkout.controller');
const { authenticate, requireAdmin } = require('../middleware/auth');

/**
 * AI Workout Plan Routes
 * @route /api/ai-workout
 */

// User Survey Routes
router.post('/survey', authenticate, aiWorkoutController.submitSurvey);
router.get('/survey/active', authenticate, aiWorkoutController.getActiveSurvey);

// Plan Generation
router.post('/generate', authenticate, aiWorkoutController.generatePlan);

// User Plan Management
router.get('/plans', authenticate, aiWorkoutController.getUserPlans);
router.get('/plans/active', authenticate, aiWorkoutController.getActivePlan);
router.get('/plans/:id', authenticate, aiWorkoutController.getPlanById);
router.patch('/plans/:id/status', authenticate, aiWorkoutController.updatePlanStatus);
router.patch('/plans/:id/progress', authenticate, aiWorkoutController.updateProgress);
router.post('/plans/:id/rate', authenticate, aiWorkoutController.ratePlan);

// Admin Routes
router.get('/admin/plans', authenticate, requireAdmin, aiWorkoutController.getAllPlans);
router.patch('/admin/plans/:id/review', authenticate, requireAdmin, aiWorkoutController.reviewPlan);
router.get('/admin/statistics', authenticate, requireAdmin, aiWorkoutController.getStatistics);

module.exports = router;
