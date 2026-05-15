// ============================================================
// models/Goal.js - Fitness Goals Database Schema
// ============================================================
const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true, // One goal set per user
  },
  targetWeight: {
    type: Number, // kg
    default: null,
  },
  dailyCalories: {
    type: Number, // kcal
    default: 2000,
  },
  dailyProtein: {
    type: Number, // grams
    default: 50,
  },
  dailyWater: {
    type: Number, // liters
    default: 2.5,
  },
  weeklyWorkouts: {
    type: Number, // sessions per week
    default: 3,
  },
  fitnessGoal: {
    type: String,
    enum: ['lose_weight', 'gain_muscle', 'maintain', 'improve_endurance'],
    default: 'maintain',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Goal', goalSchema);
