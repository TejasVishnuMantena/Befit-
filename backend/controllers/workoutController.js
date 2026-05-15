// ============================================================
// controllers/workoutController.js - Workout CRUD Operations
// ============================================================
const Workout = require('../models/Workout');

// ── POST /api/workouts ───────────────────────────────────────
const addWorkout = async (req, res) => {
  try {
    const { exercise, exerciseType, duration, caloriesBurned, sets, reps, notes, date } = req.body;

    if (!exercise || !duration || caloriesBurned === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Exercise, duration, and calories burned are required.',
      });
    }

    const workout = await Workout.create({
      userId: req.user._id,
      exercise,
      exerciseType,
      duration,
      caloriesBurned,
      sets,
      reps,
      notes,
      date: date || Date.now(),
    });

    res.status(201).json({
      success: true,
      message: 'Workout logged successfully! 🔥',
      workout,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error adding workout.' });
  }
};

// ── GET /api/workouts ────────────────────────────────────────
// Supports: ?page=1&limit=10&search=running&type=cardio&startDate=&endDate=
const getWorkouts = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, type, startDate, endDate } = req.query;

    // Build filter object
    const filter = { userId: req.user._id };

    if (search) {
      filter.exercise = { $regex: search, $options: 'i' }; // case-insensitive search
    }

    if (type && type !== 'all') {
      filter.exerciseType = type;
    }

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate)   filter.date.$lte = new Date(endDate);
    }

    const total = await Workout.countDocuments(filter);
    const workouts = await Workout.find(filter)
      .sort({ date: -1 }) // newest first
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      success: true,
      workouts,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit),
        limit: Number(limit),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching workouts.' });
  }
};

// ── DELETE /api/workouts/:id ─────────────────────────────────
const deleteWorkout = async (req, res) => {
  try {
    const workout = await Workout.findOne({
      _id: req.params.id,
      userId: req.user._id, // Ensure user owns this workout
    });

    if (!workout) {
      return res.status(404).json({ success: false, message: 'Workout not found.' });
    }

    await workout.deleteOne();
    res.json({ success: true, message: 'Workout deleted.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting workout.' });
  }
};

// ── GET /api/workouts/analytics ──────────────────────────────
const getWorkoutAnalytics = async (req, res) => {
  try {
    // Last 7 days data
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const weeklyData = await Workout.aggregate([
      {
        $match: {
          userId: req.user._id,
          date: { $gte: sevenDaysAgo },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
          totalCalories: { $sum: '$caloriesBurned' },
          totalDuration: { $sum: '$duration' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({ success: true, weeklyData });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching analytics.' });
  }
};

module.exports = { addWorkout, getWorkouts, deleteWorkout, getWorkoutAnalytics };
