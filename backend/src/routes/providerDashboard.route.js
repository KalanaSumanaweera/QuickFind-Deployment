const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/providerDashboard.controller');

// Route to fetch provider overview data
router.get('/overview', dashboardController.getProviderOverview);
router.get('/reviews', dashboardController.getReviewsForProvider);

module.exports = router;
