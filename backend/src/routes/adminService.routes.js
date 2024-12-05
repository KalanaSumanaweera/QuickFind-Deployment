const express = require('express');
const { getPendingAds } = require('../controllers/adminService.control'); // Correct import

const router = express.Router();
router.get('/pending', getPendingAds); // Fetch pending ads

module.exports = router;
