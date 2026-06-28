const express = require('express');
const router = express.Router();
const optModelController = require('../controllers/optmodel.controller');
const { authenticate, requireRole } = require('../middleware/auth');

// ==========================================
// OPT MODEL CRUD ROUTES
// Mounted at: /api/opt-model
// ==========================================

// ---- Phases ----
router.get('/phases', optModelController.getPhases);
router.get('/phases/:id', optModelController.getPhase);
router.post('/phases', authenticate, requireRole('admin', 'instructor'), optModelController.createPhase);
router.put('/phases/:id', authenticate, requireRole('admin', 'instructor'), optModelController.updatePhase);
router.delete('/phases/:id', authenticate, requireRole('admin'), optModelController.deletePhase);

// ---- Workout Sections ----
router.get('/sections', optModelController.getWorkoutSections);
router.get('/sections/:id', optModelController.getWorkoutSection);
router.post('/sections', authenticate, requireRole('admin', 'instructor'), optModelController.createWorkoutSection);
router.put('/sections/:id', authenticate, requireRole('admin', 'instructor'), optModelController.updateWorkoutSection);
router.delete('/sections/:id', authenticate, requireRole('admin'), optModelController.deleteWorkoutSection);

// ---- Assessments ----
router.get('/assessments', optModelController.getAssessments);
router.get('/assessments/:id', optModelController.getAssessment);
router.post('/assessments', authenticate, requireRole('admin', 'instructor'), optModelController.createAssessment);
router.put('/assessments/:id', authenticate, requireRole('admin', 'instructor'), optModelController.updateAssessment);
router.delete('/assessments/:id', authenticate, requireRole('admin'), optModelController.deleteAssessment);

// ---- Assessment Results ----
router.get('/results', optModelController.getAssessmentResults);
router.get('/results/:id', optModelController.getAssessmentResult);
router.post('/results', authenticate, requireRole('admin', 'instructor'), optModelController.createAssessmentResult);
router.put('/results/:id', authenticate, requireRole('admin', 'instructor'), optModelController.updateAssessmentResult);
router.delete('/results/:id', authenticate, requireRole('admin'), optModelController.deleteAssessmentResult);

module.exports = router;
