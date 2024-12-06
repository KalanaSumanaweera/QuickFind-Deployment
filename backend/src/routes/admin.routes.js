const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');


// Admin login route
router.post("/login", adminController.adminLogin);

// Dashboard Data
router.get('/dashboard', adminController.getDashboardData);

// Users
router.get('/users', adminController.getAllUsers);
router.post('/users/suspend/:id', adminController.suspendUser);

// Ads
router.get('/ads', adminController.getAllAds);
router.delete('/ads/:id', adminController.deleteAd);

// Categories
router.get('/categories', adminController.getAllCategories);
router.post('/categories', adminController.addCategory);

// Reviews
router.get('/reviews', adminController.getFlaggedReviews);
router.delete('/reviews/:id', adminController.deleteReview);

// Reports
router.get('/reports', adminController.getReports);

module.exports = router;
