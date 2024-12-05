// const Service = require('../models/service.model');
// const Category = require('../models/category.model');
// const ServiceImage = require('../models/serviceImage.model');
const { Op } = require('sequelize');
const { 
    User, 
    Service, 
    ServiceImage, 
    Category, 
    Review, 
    Transaction, 
    Booking, 
    Notification, 
    Rating, 
    Admin, 
    Message, 
    Favourite 
} = require('../models/associations');



// Create a new service
exports.addService = async (req, res) => {
    const t = await Service.sequelize.transaction();
    try {
        const {
            title,
            description,
            price,
            priceType,
            location,
            serviceArea,
            availableDays,
            workingHoursStart,
            workingHoursEnd,
            contactNumber,
            contactEmail,
            providerId,
            categoryId,
        } = req.body;

        // Create the service
        const newService = await Service.create({
            title,
            description,
            price,
            priceType,
            location,
            serviceArea,
            availableDays: JSON.parse(availableDays),
            workingHours: { start: workingHoursStart, end: workingHoursEnd },
            contactNumber,
            contactEmail,
            providerId,
            categoryId,
        }, { transaction: t });

        // Save service images
        const imageFiles = req.files; // Assuming images are uploaded as `multipart/form-data`
        const imageUrls = imageFiles.map(file => file.path); // Extract file paths
        await ServiceImage.create({
            serviceId: newService.id,
            imageUrls,
        }, { transaction: t });

        await t.commit();
        res.status(201).json({ message: 'Service created successfully', service: newService });
    } catch (error) {
        await t.rollback();
        console.error(error);
        res.status(500).json({ message: 'Error creating service', error: error.message });
    }
};

// Get all services
exports.getAllServices = async (req, res) => {
    try {
        const services = await Service.findAll({
            include: [
                { model: ServiceImage, attributes: ['imageUrls'] },
            ],
        });
        res.status(200).json(services);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving services', error: error.message });
    }
};

exports.deleteService = async (req, res) => {
    const { id } = req.params;
    await Service.destroy({ where: { id } });
    res.json({ message: 'Service deleted successfully' });
};

exports.getServicesByProvider = async (req, res) => {
    const { providerId } = req.params;

    try {
        // Fetch services with associated category and images
        const services = await Service.findAll({
            where: { providerId: providerId },
            include: [
                {
                    model: require('../models/category.model'),
                    attributes: ['name'],
                },
                {
                    model: require('../models/serviceImage.model'),
                    as: 'image',
                    attributes: ['id', 'imageUrls'],
                },
            ],
        });

        if (services.length === 0) {
            return res.status(404).json({ message: 'No services found for this provider' });
        }

        // Transform services to include a flattened image list (optional)
        const transformedServices = services.map(service => ({
            ...service.toJSON(),
            image: service.image ? service.image.imageUrls : [],
        }));

        res.status(200).json(transformedServices);
    } catch (error) {
        console.error('Error fetching services:', error);
        res.status(500).json({ message: 'Failed to fetch services', error });
    }
};


exports.getServiceById = async (req, res) => {
    try {
        const { serviceId } = req.params;

        // Fetch the service and associated images
        const service = await Service.findByPk(serviceId, {
            include: {
                model: ServiceImage,
                as: 'image', // Alias defined in associations
                attributes: ['id', 'imageUrls'], // Fetch required fields only
            },
        });

        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }

        res.json({
            ...service.toJSON(),
            image: service.image ? service.image.imageUrls : [], // Use the alias and safely handle null
        });
    } catch (error) {
        console.error('Error fetching service:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


exports.updateService = async (req, res) => {
    try {
        const { serviceId } = req.params;

        // Find the service with its associated images
        const service = await Service.findByPk(serviceId, {
            include: {
                model: ServiceImage,
                as: 'image',
                attributes: ['id', 'imageUrls']
            }
        });

        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }

        // Update basic fields
        service.title = req.body.title || service.title;
        service.description = req.body.description || service.description;
        service.price = req.body.price || service.price;
        service.priceType = req.body.priceType || service.priceType;
        service.contactEmail = req.body.contactEmail || service.contactEmail;
        service.contactNumber = req.body.contactNumber || service.contactNumber;
        service.serviceArea = req.body.serviceArea || service.serviceArea;

        // Handle removed images
        if (req.body.removedImages) {
            const removedIndexes = JSON.parse(req.body.removedImages);

            // Get existing images and filter out the removed ones
            const existingImages = service.image ? service.image.imageUrls : [];
            const updatedImages = existingImages.filter((_, index) => !removedIndexes.includes(index));

            // Update the database with the new image array
            if (service.image) {
                service.image.imageUrls = updatedImages;
                await service.image.save();
            }
        }

        // Handle new uploaded images
        if (req.files && req.files.length > 0) {
            const uploadedImagePaths = req.files.map((file) => file.path);

            if (service.image) {
                // Append new images to the existing array
                service.image.imageUrls = [...service.image.imageUrls, ...uploadedImagePaths];
                await service.image.save();
            } else {
                // Create a new ServiceImage record if it doesn't exist
                await ServiceImage.create({
                    serviceId: service.id,
                    imageUrls: uploadedImagePaths
                });
            }
        }

        // Ensure the total image count does not exceed the limit
        const totalImages = service.image ? service.image.imageUrls.length : 0;
        if (totalImages > 5) {
            return res.status(400).json({ message: 'You can only have up to 5 images.' });
        }

        // Save the updated service
        await service.save();

        res.json({ message: 'Service updated successfully', service });
    } catch (error) {
        console.error('Error updating service:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


// Fetch all pending ads with images
exports.getPendingAds = async (req, res) => {
    try {
        const pendingServices = await Service.findAll({
            where: { status: "pending" }, // Correct: filter by 'status'
            include: [
                {
                    model: ServiceImage,
                    as: 'image',
                    attributes: ['imageUrls'], // Fetch image URLs
                },
            ],
            logging: console.log, // Log query to inspect SQL
        });

        const transformedServices = pendingServices.map(service => ({
            id: service.id,
            title: service.title,
            description: service.description,
            price: service.price,
            priceType: service.priceType,
            location: service.location,
            serviceArea: service.serviceArea,
            contactNumber: service.contactNumber,
            contactEmail: service.contactEmail,
            imageUrls: service.image ? service.image.imageUrls : [], // Conditional image URLs
        }));

        res.status(200).json(transformedServices);
    } catch (error) {
        console.error('Error fetching pending ads:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};




// Update ad status
exports.updateAdStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const ad = await Service.findByPk(id);

        if (!ad) {
            return res.status(404).json({ message: "Ad not found." });
        }

        ad.status = status;
        await ad.save();
        res.json({ message: "Ad status updated successfully." });
    } catch (error) {
        console.error("Error updating ad status:", error);
        res.status(500).json({ message: "Internal server error." });
    }
}
