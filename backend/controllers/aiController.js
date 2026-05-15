// ============================================================
// controllers/aiController.js - Smart AI-Based Fitness Tips
// ============================================================
const Meal = require('../models/Meal');
const Workout = require('../models/Workout');
const Goal = require('../models/Goal');
const User = require('../models/User');

// ── POST /api/ai/suggestions ─────────────────────────────────
// This generates rule-based AI suggestions without needing an API key.
// You can swap this with OpenAI API calls for production.
const getSuggestions = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    const goal = await Goal.findOne({ userId });

    // Gather last 7 days of data
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentMeals = await Meal.find({ userId, date: { $gte: sevenDaysAgo } });
    const recentWorkouts = await Workout.find({ userId, date: { $gte: sevenDaysAgo } });

    // Calculate averages
    const avgDailyCalories = recentMeals.length > 0
      ? recentMeals.reduce((sum, m) => sum + m.calories, 0) / 7
      : 0;
    const avgDailyProtein = recentMeals.length > 0
      ? recentMeals.reduce((sum, m) => sum + m.protein, 0) / 7
      : 0;
    const workoutsPerWeek = recentWorkouts.length;

    // ── Build smart suggestions based on data ────────────────
    const suggestions = [];

    // Calorie suggestions
    if (goal) {
      const calorieDiff = avgDailyCalories - goal.dailyCalories;
      if (calorieDiff > 300) {
        suggestions.push({
          category: 'Nutrition',
          icon: '🍽️',
          priority: 'high',
          title: 'Calorie Surplus Detected',
          message: `You're averaging ${Math.round(calorieDiff)} extra calories per day over your goal of ${goal.dailyCalories} kcal. Consider reducing portion sizes or replacing high-calorie snacks with fruits or vegetables.`,
        });
      } else if (calorieDiff < -300) {
        suggestions.push({
          category: 'Nutrition',
          icon: '⚡',
          priority: 'high',
          title: 'Calorie Deficit Too Large',
          message: `You're eating ${Math.abs(Math.round(calorieDiff))} fewer calories than needed. Very low calorie intake can slow metabolism. Try adding healthy, nutrient-dense foods like nuts, avocados, or whole grains.`,
        });
      } else {
        suggestions.push({
          category: 'Nutrition',
          icon: '✅',
          priority: 'low',
          title: 'Calorie Intake On Track',
          message: `Your average calorie intake is close to your ${goal.dailyCalories} kcal goal. Keep it up! Consistency is the key to results.`,
        });
      }

      // Protein suggestions
      if (avgDailyProtein < goal.dailyProtein * 0.8) {
        suggestions.push({
          category: 'Protein',
          icon: '🥩',
          priority: 'medium',
          title: 'Boost Your Protein Intake',
          message: `Your average protein is ${Math.round(avgDailyProtein)}g/day, below your goal of ${goal.dailyProtein}g. Try adding eggs, chicken breast, Greek yogurt, lentils, or protein shakes to your meals.`,
        });
      }

      // Workout frequency suggestions
      if (workoutsPerWeek < goal.weeklyWorkouts) {
        suggestions.push({
          category: 'Workout',
          icon: '🏋️',
          priority: 'high',
          title: 'Increase Workout Frequency',
          message: `You've done ${workoutsPerWeek} workout(s) this week, but your goal is ${goal.weeklyWorkouts}. Schedule your workouts in advance — treat them like important meetings!`,
        });
      }

      // Goal-specific suggestions
      if (goal.fitnessGoal === 'lose_weight') {
        suggestions.push({
          category: 'Strategy',
          icon: '📉',
          priority: 'medium',
          title: 'Weight Loss Tip',
          message: 'For effective fat loss, combine cardio (3-4x/week) with strength training (2-3x/week). Strength training preserves muscle while burning fat, boosting your metabolism long-term.',
        });
      } else if (goal.fitnessGoal === 'gain_muscle') {
        suggestions.push({
          category: 'Strategy',
          icon: '💪',
          priority: 'medium',
          title: 'Muscle Building Tip',
          message: 'For muscle gain, ensure you\'re in a slight calorie surplus (200-300 kcal above maintenance) with adequate protein (1.6-2.2g per kg body weight). Progressive overload in your lifts is essential.',
        });
      }
    }

    // Recovery suggestion
    if (workoutsPerWeek >= 5) {
      suggestions.push({
        category: 'Recovery',
        icon: '😴',
        priority: 'medium',
        title: 'Prioritize Recovery',
        message: `You've been very active with ${workoutsPerWeek} workouts this week! Make sure you're getting 7-9 hours of sleep and taking at least 1-2 rest days to allow muscle repair and prevent overtraining.`,
      });
    }

    // Hydration reminder (always included)
    suggestions.push({
      category: 'Hydration',
      icon: '💧',
      priority: 'low',
      title: 'Stay Hydrated',
      message: 'Aim for 2.5-3.5L of water per day. Proper hydration improves workout performance by up to 25%, aids nutrient absorption, and supports metabolism. Start each morning with a glass of water!',
    });

    // General wellness tip
    const wellnessTips = [
      'Take a 10-minute walk after meals — it helps regulate blood sugar and improves digestion.',
      'Try meal prepping on Sundays to stay consistent with your nutrition goals throughout the week.',
      'Add variety to your workouts every 4-6 weeks to prevent plateaus and keep things interesting.',
      'Track your progress weekly, not daily — weight fluctuates naturally due to water retention and food intake.',
    ];
    suggestions.push({
      category: 'Wellness',
      icon: '🌟',
      priority: 'low',
      title: 'Wellness Tip of the Day',
      message: wellnessTips[Math.floor(Math.random() * wellnessTips.length)],
    });

    res.json({
      success: true,
      suggestions,
      summary: {
        avgDailyCalories: Math.round(avgDailyCalories),
        avgDailyProtein: Math.round(avgDailyProtein),
        workoutsPerWeek,
        dataPoints: recentMeals.length + recentWorkouts.length,
      },
    });
  } catch (error) {
    console.error('AI suggestions error:', error);
    res.status(500).json({ success: false, message: 'Error generating suggestions.' });
  }
};

module.exports = { getSuggestions };
