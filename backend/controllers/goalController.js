// ============================================================
// controllers/goalController.js - Fitness Goals
// ============================================================
const Goal = require('../models/Goal');
const Meal = require('../models/Meal');
const Workout = require('../models/Workout');

// ── POST /api/goals ──────────────────────────────────────────
const setGoal = async (req, res) => {
  try {
    const { targetWeight, dailyCalories, dailyProtein, dailyWater, weeklyWorkouts, fitnessGoal } = req.body;

    // Upsert: update if exists, create if not
    const goal = await Goal.findOneAndUpdate(
      { userId: req.user._id },
      { userId: req.user._id, targetWeight, dailyCalories, dailyProtein, dailyWater, weeklyWorkouts, fitnessGoal },
      { new: true, upsert: true, runValidators: true }
    );

    res.json({ success: true, message: 'Goals saved! You got this 🎯', goal });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error saving goals.' });
  }
};

// ── GET /api/goals ───────────────────────────────────────────
const getGoals = async (req, res) => {
  try {
    const goal = await Goal.findOne({ userId: req.user._id });

    if (!goal) {
      return res.json({
        success: true,
        goal: null,
        message: 'No goals set yet. Set your first goal!',
      });
    }

    // Calculate today's progress
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const [mealData] = await Meal.aggregate([
      { $match: { userId: req.user._id, date: { $gte: today, $lte: todayEnd } } },
      { $group: { _id: null, calories: { $sum: '$calories' }, protein: { $sum: '$protein' } } },
    ]);

    const [workoutData] = await Workout.aggregate([
      { $match: { userId: req.user._id, date: { $gte: today, $lte: todayEnd } } },
      { $group: { _id: null, duration: { $sum: '$duration' } } },
    ]);

    res.json({
      success: true,
      goal,
      todayProgress: {
        caloriesConsumed: mealData?.calories || 0,
        proteinConsumed: mealData?.protein || 0,
        workoutDuration: workoutData?.duration || 0,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching goals.' });
  }
};

module.exports = { setGoal, getGoals };
