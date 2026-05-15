// ============================================================
// models/User.js - User Database Schema
// ============================================================
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false, // Don't return password by default in queries
  },
  age: {
    type: Number,
    min: [10, 'Age must be at least 10'],
    max: [120, 'Age cannot exceed 120'],
  },
  weight: {
    type: Number, // in kg
    min: [20, 'Weight must be at least 20 kg'],
  },
  height: {
    type: Number, // in cm
    min: [50, 'Height must be at least 50 cm'],
  },
  profileImage: {
    type: String,
    default: '', // URL or base64
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt automatically
});

// ── Hash password before saving ──────────────────────────────
userSchema.pre('save', async function(next) {
  // Only hash if password was modified
  if (!this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ── Method: Compare entered password with hashed ─────────────
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
