const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/adminloginpage', (req, res) => {
    res.sendFile(path.join(__dirname, '../../../frontend/pages/admin/adminLogin.html')); 
});

router.get('/admin/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '../../../frontend/pages/admin/adminPanel.html')); 
});

router.get('/loginpage', (req, res) => {
    res.sendFile(path.join(__dirname, '../../../frontend/pages/auth/login.html')); 
});

router.get('/provider-dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '../../../frontend/pages/provider-dashboard.html')); 
});

router.get('/signuppage', (req, res) => {
    res.sendFile(path.join(__dirname, '../../../frontend/pages/auth/signup.html'));
});

router.get('/reset-passwordPage', (req, res) => {
    res.sendFile(path.join(__dirname, '../../../frontend/pages/auth/reset-password.html'));
 });

module.exports = router;