// ============================================================
// controllers/nutritionController.js - Meal Tracking
// ============================================================
const Meal = require('../models/Meal');

// ── POST /api/meals ──────────────────────────────────────────
const addMeal = async (req, res) => {
  try {
    const { mealName, mealType, calories, protein, carbs, fats, fiber, date } = req.body;

    if (!mealName || calories === undefined) {
      return res.status(400).json({ success: false, message: 'Meal name and calories are required.' });
    }

    const meal = await Meal.create({
      userId: req.user._id,
      mealName,
      mealType,
      calories,
      protein,
      carbs,
      fats,
      fiber,
      date: date || Date.now(),
    });

    res.status(201).json({ success: true, message: 'Meal logged! 🥗', meal });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error adding meal.' });
  }
};

// ── GET /api/meals ───────────────────────────────────────────
const getMeals = async (req, res) => {
  try {
    const { page = 1, limit = 10, date, mealType } = req.query;

    const filter = { userId: req.user._id };

    // Filter by specific date (today, etc.)
    if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      filter.date = { $gte: start, $lte: end };
    }

    if (mealType && mealType !== 'all') {
      filter.mealType = mealType;
    }

    const total = await Meal.countDocuments(filter);
    const meals = await Meal.find(filter)
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    // Calculate today's totals
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const dailyTotals = await Meal.aggregate([
      { $match: { userId: req.user._id, date: { $gte: today, $lte: todayEnd } } },
      {
        $group: {
          _id: null,
          totalCalories: { $sum: '$calories' },
          totalProtein: { $sum: '$protein' },
          totalCarbs: { $sum: '$carbs' },
          totalFats: { $sum: '$fats' },
        },
      },
    ]);

    res.json({
      success: true,
      meals,
      dailyTotals: dailyTotals[0] || { totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFats: 0 },
      pagination: { total, page: Number(page), pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching meals.' });
  }
};

// ── DELETE /api/meals/:id ────────────────────────────────────
const deleteMeal = async (req, res) => {
  try {
    const meal = await Meal.findOne({ _id: req.params.id, userId: req.user._id });
    if (!meal) return res.status(404).json({ success: false, message: 'Meal not found.' });
    await meal.deleteOne();
    res.json({ success: true, message: 'Meal deleted.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting meal.' });
  }
};

// ── GET /api/meals/analytics ─────────────────────────────────
const getMealAnalytics = async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const weeklyData = await Meal.aggregate([
      { $match: { userId: req.user._id, date: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
          totalCalories: { $sum: '$calories' },
          totalProtein: { $sum: '$protein' },
          totalCarbs: { $sum: '$carbs' },
          totalFats: { $sum: '$fats' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({ success: true, weeklyData });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching analytics.' });
  }
};

module.exports = { addMeal, getMeals, deleteMeal, getMealAnalytics };
