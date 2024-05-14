// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken } = require('../middlewares/authMiddleware');

router.get('/profile', authenticateToken, userController.getUserProfile);
router.put('/profile', authenticateToken, userController.updateUserProfile);
router.put('/update-password', authenticateToken, userController.updatePassword)
router.put('/upload-photo', authenticateToken, userController.uploadPhoto)
router.get('/public-profiles', authenticateToken, userController.getPublicProfiles)
router.get('/profile/:userId', authenticateToken, userController.getProfile)
module.exports = router;