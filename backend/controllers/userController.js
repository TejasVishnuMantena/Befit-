// ============================================================
// controllers/userController.js - User Profile Management
// ============================================================
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// ── GET /api/user/profile ────────────────────────────────────
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching profile.' });
  }
};

// ── PUT /api/user/profile ────────────────────────────────────
const updateProfile = async (req, res) => {
  try {
    const { name, age, weight, height, profileImage } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name, age, weight, height, profileImage },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Profile updated successfully!',
      user: updatedUser,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: 'Error updating profile.' });
  }
};

// ── PUT /api/user/change-password ────────────────────────────
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Both passwords are required.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters.' });
    }

    // Get user with password
    const user = await User.findById(req.user._id).select('+password');
    const isMatch = await user.matchPassword(currentPassword);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect.' });
    }

    user.password = newPassword;
    await user.save(); // Pre-save hook will hash the new password

    res.json({ success: true, message: 'Password changed successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error changing password.' });
  }
};

module.exports = { getProfile, updateProfile, changePassword };
