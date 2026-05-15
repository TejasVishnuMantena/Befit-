// routes/workoutRoutes.js
const express = require('express');
const router = express.Router();
const { addWorkout, getWorkouts, deleteWorkout, getWorkoutAnalytics } = require('../controllers/workoutController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // All workout routes require auth

router.post('/', addWorkout);
router.get('/', getWorkouts);
router.get('/analytics', getWorkoutAnalytics);
router.delete('/:id', deleteWorkout);

module.exports = router;
