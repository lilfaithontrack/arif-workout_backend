const express = require('express');
const router = express.Router();
const programController = require('../controllers/program.controller');
const { authenticate, requireRole } = require('../middleware/auth');

// ==========================================
// PROGRAM WORKOUT ROUTES (Admin Panel)
// Mounted at: /api/program-workouts
// ==========================================

// Get all program workouts (with optional filtering by programId, phaseId, search)
router.get('/', programController.getAllProgramWorkouts);

// Get all exercises for a specific workout
router.get('/:workoutId/exercises', programController.getExercisesForWorkout);

module.exports = router;
