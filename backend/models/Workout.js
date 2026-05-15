// ============================================================
// models/Workout.js - Workout Database Schema
// ============================================================
const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  exercise: {
    type: String,
    required: [true, 'Exercise name is required'],
    trim: true,
  },
  exerciseType: {
    type: String,
    enum: ['cardio', 'strength', 'flexibility', 'hiit', 'sports', 'other'],
    default: 'other',
  },
  duration: {
    type: Number, // in minutes
    required: [true, 'Duration is required'],
    min: [1, 'Duration must be at least 1 minute'],
  },
  caloriesBurned: {
    type: Number,
    required: [true, 'Calories burned is required'],
    min: [0, 'Calories cannot be negative'],
  },
  sets: { type: Number, default: null },   // for strength training
  reps: { type: Number, default: null },   // for strength training
  notes: { type: String, trim: true },
  date: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Index for faster queries by user and date
workoutSchema.index({ userId: 1, date: -1 });

module.exports = mongoose.model('Workout', workoutSchema);
