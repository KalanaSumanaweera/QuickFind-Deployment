const express = require('express');
const router = express.Router();
const path = require('path');


// Serve index.html for customers
router.get('/home', (req, res) => {
    // res.sendFile(path.join(__dirname, '../../../frontend/pages/auth/index.html'));
    res.sendFile(path.join(__dirname, '../../../frontend/pages/developmentPage.html')); //this is the development forntend
});

// Serve login.html
router.get('/loginpage', (req, res) => {
    res.sendFile(path.join(__dirname, '../../../frontend/pages/auth/login.html'));
    
});

// Serve provider-dashboard.html 
router.get('/provider-dashboard', (req, res) => {
    // res.sendFile(path.join(__dirname, '../../../frontend/pages/provider-dashboard.html'));
    res.sendFile(path.join(__dirname, '../../../frontend/pages/provider-dashboard.html')); //this is the development forntend
});

router.get('/signuppage', (req, res) => {
    res.sendFile(path.join(__dirname, '../../../frontend/pages/auth/signup.html'));
});

router.get('/reset-passwordPage', (req, res) => {
    res.sendFile(path.join(__dirname, '../../../frontend/pages/auth/reset-password.html'));
 });

module.exports = router;