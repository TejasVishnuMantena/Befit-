// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const { getAllUsers, deleteUser, getAdminAnalytics, toggleUserStatus } = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.use(protect, adminOnly); // All admin routes: must be logged in AND admin

router.get('/users', getAllUsers);
router.get('/analytics', getAdminAnalytics);
router.delete('/user/:id', deleteUser);
router.put('/user/:id/toggle', toggleUserStatus);

module.exports = router;
