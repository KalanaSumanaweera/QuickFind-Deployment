const  ServiceImage = require('../models/serviceImage.model'); // Adjust path as needed
const Service  = require('../models/service.model'); // Adjust path as needed

// Fetch all pending ads with images
exports.getPendingAds = async (req, res) => {
    try {
        const pendingServices = await Service.findAll({
            where: { status: "pending" }, // Filter by 'pending' status
            include: [
                {
                    model: ServiceImage,
                    as: 'image', // Ensure alias matches your model association
                    attributes: ['imageUrls'], // Select only imageUrls
                },
            ],
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
            imageUrls: service.image ? service.image.imageUrls : [], // Return imageUrls or empty array
        }));

        res.status(200).json(transformedServices);
    } catch (error) {
        console.error('Error fetching pending ads:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
