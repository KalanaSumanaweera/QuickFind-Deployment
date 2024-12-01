const express = require('express');
const multer = require('multer');
const { addService, getAllServices, deleteService, getServicesByProvider,editService,getServiceById, updateService } = require('../controllers/service.controller');

const router = express.Router();

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Specify the uploads folder
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
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



module.exports = router;
