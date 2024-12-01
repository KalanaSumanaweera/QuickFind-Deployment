const Service = require('../models/service.model');
const ServiceImage = require('../models/serviceImage.model');
const { Op } = require('sequelize');

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
        const service = await Service.findByPk(serviceId, {
            include: {
                model: ServiceImage,
                as: 'image', // Alias defined in associations
                attributes: ['id', 'imageUrls'], // Fetch only imageUrls and id
            },
        });

        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }

        // Ensure images field is an array
        service.image = service.image || [];  // Make sure the image is always an array

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
            service.image = service.image.filter((image, index) => !removedIndexes.includes(index));
        }

        // Handle new uploaded images
        if (req.files && req.files.length > 0) {
            const newImages = req.files.map((file) => file.path); // Assuming you're storing file paths
            // Adding new images to the existing image array
            service.image = [...service.image, ...newImages];
        }

        // Ensure image count doesn't exceed the limit
        if (service.image.length > 5) {
            return res.status(400).json({ message: 'You can only have up to 5 images.' });
        }

        await service.save();
        res.json({ message: 'Service updated successfully', service });
    } catch (error) {
        console.error('Error updating service:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
