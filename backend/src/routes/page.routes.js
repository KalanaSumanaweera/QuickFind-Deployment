const express = require('express');
const path = require('path');


const router = express.Router();
const frontendDir = path.resolve(__dirname, '../../../frontend/pages');

// Public Routes
router.get('/', (req, res) => {
    res.sendFile(path.join(frontendDir, 'auth/index.html'));
});

router.get('/loginpage', (req, res) => {
    res.sendFile(path.join(frontendDir, 'auth/login.html'));
});

router.get('/signuppage', (req, res) => {
    res.sendFile(path.join(frontendDir, 'auth/signup.html'));
});

router.get('/reset-passwordPage', (req, res) => {
    res.sendFile(path.join(frontendDir, 'auth/reset-password.html'));
});

router.get('/provider-dashboard', (req, res) => {
    res.sendFile(path.join(frontendDir, 'provider-dashboard.html'));
});

// Admin Routes
router.get('/admin/login', (req, res) => {
    res.sendFile(path.join(frontendDir, 'admin/adminLogin.html'));
});

router.get('/admin/dashboard', (req, res) => {
    res.sendFile(path.join(frontendDir, 'admin/adminPanel.html'));
});

// // 404 Error Page
// router.use((req, res) => {
//     res.status(404).sendFile(path.join(frontendDir, 'error/404.html'));
// });

module.exports = router;
