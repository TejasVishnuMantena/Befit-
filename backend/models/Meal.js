// ============================================================
// models/Meal.js - Meal/Nutrition Database Schema
// ============================================================
const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  mealName: {
    type: String,
    required: [true, 'Meal name is required'],
    trim: true,
  },
  mealType: {
    type: String,
    enum: ['breakfast', 'lunch', 'dinner', 'snack'],
    default: 'snack',
  },
  calories: {
    type: Number,
    required: [true, 'Calories are required'],
    min: [0, 'Calories cannot be negative'],
  },
  protein: {
    type: Number,
    default: 0,
    min: 0,
  }, // grams
  carbs: {
    type: Number,
    default: 0,
    min: 0,
  }, // grams
  fats: {
    type: Number,
    default: 0,
    min: 0,
  }, // grams
  fiber: {
    type: Number,
    default: 0,
    min: 0,
  }, // grams
  date: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Index for faster queries
mealSchema.index({ userId: 1, date: -1 });

module.exports = mongoose.model('Meal', mealSchema);
