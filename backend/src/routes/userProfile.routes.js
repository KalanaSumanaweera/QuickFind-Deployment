const express = require('express');
const router = express.Router();
const multer = require('multer');

// router.get('/service/provider/:id', getServiceProviderDetails);//

const { getUserProfile, updateUserProfile, changeUserPassword } = require('../controllers/userProfile.controller');

router.get('/profile', getUserProfile);
router.put('/profile', updateUserProfile);
router.put('/profile/password', changeUserPassword);

module.exports = router;
