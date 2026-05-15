// ============================================================
// controllers/adminController.js - Admin Panel
// ============================================================
const User = require('../models/User');
const Workout = require('../models/Workout');
const Meal = require('../models/Meal');

// ── GET /api/admin/users ─────────────────────────────────────
const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await User.countDocuments(filter);
    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      success: true,
      users,
      pagination: { total, page: Number(page), pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching users.' });
  }
};

// ── DELETE /api/admin/user/:id ───────────────────────────────
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

    // Prevent deleting yourself or other admins
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'Cannot delete your own account.' });
    }
    if (user.role === 'admin') {
      return res.status(400).json({ success: false, message: 'Cannot delete another admin.' });
    }

    // Delete user's data too
    await Workout.deleteMany({ userId: user._id });
    await Meal.deleteMany({ userId: user._id });
    await user.deleteOne();

    res.json({ success: true, message: `User ${user.name} deleted successfully.` });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting user.' });
  }
};

// ── GET /api/admin/analytics ─────────────────────────────────
const getAdminAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const activeUsers = await User.countDocuments({ role: 'user', isActive: true });
    const totalWorkouts = await Workout.countDocuments();
    const totalMeals = await Meal.countDocuments();

    // New users in last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const newUsers = await User.countDocuments({ createdAt: { $gte: sevenDaysAgo } });

    // User growth per day (last 7 days)
    const userGrowth = await User.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      success: true,
      analytics: { totalUsers, activeUsers, totalWorkouts, totalMeals, newUsers, userGrowth },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching analytics.' });
  }
};

// ── PUT /api/admin/user/:id/toggle ───────────────────────────
const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

    user.isActive = !user.isActive;
    await user.save();

    res.json({
      success: true,
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully.`,
      isActive: user.isActive,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating user status.' });
  }
};

module.exports = { getAllUsers, deleteUser, getAdminAnalytics, toggleUserStatus };
