// routes/goalRoutes.js
const express = require('express');
const router = express.Router();
const { setGoal, getGoals } = require('../controllers/goalController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);
router.post('/', setGoal);
router.get('/', getGoals);

module.exports = router;
