// routes/nutritionRoutes.js
const express = require('express');
const router = express.Router();
const { addMeal, getMeals, deleteMeal, getMealAnalytics } = require('../controllers/nutritionController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);
router.post('/', addMeal);
router.get('/', getMeals);
router.get('/analytics', getMealAnalytics);
router.delete('/:id', deleteMeal);

module.exports = router;
