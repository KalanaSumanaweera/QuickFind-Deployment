// const express = require('express');
// const multer = require('multer');
// const { verifyAdmin, verifyServiceProvider } = require('../middleware/auth.middleware');
// const { 
//     addService, 
//     getAllServices, 
//     deleteService, 
//     updateServiceStatus, 
//     getServicesByProvider, 
//     editService, 
//     getServiceById, 
//     updateService,
//     // getPendingAds, 
//     updateAdStatus
// } = require('../controllers/service.controller');

// const getPendingAds = require('../controllers/adminService.control')

// const router = express.Router();

// // Multer setup for file uploads
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads/'); // Specify the uploads folder
//     },
//     filename: (req, file, cb) => {
//         cb(null, `${Date.now()}-${file.originalname}`);
//     },
// });
// const upload = multer({ storage });

// // Routes
// router.post('/add', upload.array('serviceImages', 5), addService); // Allow up to 5 images
// router.get('/', getAllServices);
// router.delete('/:id', deleteService);
// router.get('/provider/:providerId', getServicesByProvider);
// router.get('/:serviceId', getServiceById);
// router.put('/:serviceId', upload.array('images', 5), updateService);
// router.get('/pending', getPendingAds);
// router.patch("/:id/status", updateAdStatus);



// module.exports = router;


const express = require('express');
const multer = require('multer');
const { verifyAdmin, verifyServiceProvider } = require('../middleware/auth.middleware');
const { 
    addService, 
    getAllServices, 
    deleteService, 
    getServicesByProvider, 
    getServiceById, 
    updateService,
    updateAdStatus 
} = require('../controllers/service.controller');

// const { getPendingAds } = require('../controllers/adminService.control'); // Correct import

const router = express.Router();

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Uploads folder for saving files
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Unique filename with timestamp
    },
});
const upload = multer({ storage });

// Routes
router.post('/add', upload.array('serviceImages', 5), addService); // Allow up to 5 images
router.get('/', getAllServices);
router.delete('/:id', deleteService);
router.get('/provider/:providerId', getServicesByProvider);
router.get('/:serviceId', getServiceById);
router.put('/:serviceId', upload.array('images', 5), updateService);
router.patch('/:id/status', updateAdStatus); // Update ad status

module.exports = router;
