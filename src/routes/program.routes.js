const express = require('express');
const router = express.Router();
const programController = require('../controllers/program.controller');
const { authenticate, requireAdmin, requireRole } = require('../middleware/auth');

// ==========================================
// PUBLIC ROUTES
// ==========================================

// Get all programs (with filtering)
router.get('/', programController.getPrograms);

// Get all OPT phases
router.get('/opt/phases', programController.getPhases);

// Get program by ID
router.get('/:id', programController.getProgramById);

// Get program by slug
router.get('/slug/:slug', programController.getProgramBySlug);

// Get all workouts for a specific program (admin panel)
router.get('/:programId/workouts', programController.getWorkoutsForProgram);

// Get single workout with exercises
router.get('/workouts/:workoutId', programController.getWorkoutById);

// Get workout with exercises grouped by NASM sections
router.get('/workouts/:workoutId/sections', programController.getWorkoutWithSections);

// Get workout sections (NASM style)
router.get('/sections', programController.getWorkoutSections);

// Get programs by NASM OPT Phase
router.get('/phase/:phase', programController.getProgramsByPhase);

// Get full program detail with all workouts and exercises
router.get('/:id/full', programController.getFullProgramDetail);

// ==========================================
// PROTECTED ROUTES (Authenticated Users)
// ==========================================

// Get my enrolled programs
router.get('/my/programs', authenticate, programController.getMyPrograms);

// Enroll in program
router.post('/:programId/enroll', authenticate, programController.enrollInProgram);

// Update program progress
router.put('/enrollments/:enrollmentId/progress', authenticate, programController.updateProgress);

// Complete workout and advance
router.post('/enrollments/:enrollmentId/complete', authenticate, programController.completeWorkout);

// Unenroll from program
router.delete('/enrollments/:enrollmentId', authenticate, programController.unenrollFromProgram);

// ==========================================
// ADMIN/INSTRUCTOR ROUTES
// ==========================================

// Create new program (Admin/Instructor)
router.post('/', authenticate, requireRole('admin', 'instructor'), programController.createProgram);

// Update program
router.put('/:id', authenticate, requireRole('admin', 'instructor'), programController.updateProgram);

// Delete program (soft delete - Admin only)
router.delete('/:id', authenticate, requireRole('admin'), programController.deleteProgram);

// Add workout to program
router.post('/:programId/workouts', authenticate, requireRole('admin', 'instructor'), programController.addWorkoutToProgram);

// Update workout
router.put('/workouts/:workoutId', authenticate, requireRole('admin', 'instructor'), programController.updateWorkout);

// Delete workout
router.delete('/workouts/:workoutId', authenticate, requireRole('admin', 'instructor'), programController.deleteWorkout);

// Add exercise to workout
router.post('/workouts/:workoutId/exercises', authenticate, requireRole('admin', 'instructor'), programController.addExerciseToWorkout);

// Update workout exercise
router.put('/workouts/exercises/:exerciseId', authenticate, requireRole('admin', 'instructor'), programController.updateWorkoutExercise);

// Remove exercise from workout
router.delete('/workouts/exercises/:exerciseId', authenticate, requireRole('admin', 'instructor'), programController.removeWorkoutExercise);

// Reorder exercises
router.put('/workouts/:workoutId/reorder', authenticate, requireRole('admin', 'instructor'), programController.reorderExercises);

module.exports = router;
