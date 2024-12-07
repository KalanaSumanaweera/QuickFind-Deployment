const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { verifyAdminToken } = require("../middleware/auth.middleware");


// Admin login route
router.post("/login", adminController.adminLogin);

// Dashboard Data
router.get('/dashboard', verifyAdminToken , adminController.getDashboardData);

// Users
router.get('/users', verifyAdminToken, adminController.getAllUsers);
router.post('/users/suspend/:id', verifyAdminToken, adminController.suspendUser);

// Ads
router.get('/ads ', verifyAdminToken , adminController.getAllAds);
router.delete('/ads/:id', verifyAdminToken, adminController.deleteAd);

// Categories
router.get('/categories', verifyAdminToken, adminController.getAllCategories);
router.post('/categories', verifyAdminToken, adminController.addCategory);

// Reviews
router.get('/reviews', verifyAdminToken, adminController.getFlaggedReviews);
router.delete('/reviews/:id', verifyAdminToken, adminController.deleteReview);

// Reports
router.get('/reports', verifyAdminToken, adminController.getReports);

module.exports = router;
