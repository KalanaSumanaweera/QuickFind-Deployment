const Service = require('../models/service.model');
const User = require('../models/user.model');
const Review = require('../models/review.model');
const Rating = require('../models/rating.model');

exports.getProviderOverview = async (req, res) => {
    try {
        const { providerId } = req.query; // Destructure providerId from query parameters

        if (!providerId) {
            return res.status(400).json({ message: 'Provider ID is required' });
        }

        // Fetch active services count
        const activeServicesCount = await Service.count({
            where: { providerId, status: 'active' },
        });

        // Fetch total reviews count
        const providerServices = await Service.findAll({
            where: { providerId },
            attributes: ['id'],
        });

        const serviceIds = providerServices.map(service => service.id);

        const totalReviewsCount = await Rating.sum('reviewCount', {
            where: { serviceId: serviceIds },
        });

        // Fetch recent reviews
        const recentReviews = await Review.findAll({
            include: [
                {
                    model: Service,
                    attributes: ['title'],
                },
                {
                    model: User,
                    attributes: ['firstName', 'lastName'],
                },
            ],
            order: [['createdAt', 'DESC']],
            limit: 5,
        });

        const recentActivity = recentReviews.map((review) => ({
            action: `Review received: "${review.comment}" from ${review.User.firstName} ${review.User.lastName}`,
            timestamp: review.createdAt.toLocaleString(), // Format as needed
        }));

        // Fetch provider's details from User table
        const providerDetails = await User.findOne({
            where: { id: providerId },
            attributes: ['firstName', 'lastName', 'role'],
        });

        if (!providerDetails) {
            return res.status(404).json({ message: 'Provider not found' });
        }

        res.json({
            provider: {
                firstName: providerDetails.firstName,
                lastName: providerDetails.lastName,
                role: providerDetails.role,
            },
            stats: {
                activeServices: activeServicesCount,
                totalReviews: totalReviewsCount || 0, // Handle null if no reviews
            },
            recentActivity,
        });
    } catch (error) {
        console.error('Error fetching provider overview:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


exports.getReviewsForProvider = async (req, res) => {
    try {
        const { providerId } = req.query;

        if (!providerId) {
            return res.status(400).json({ message: 'Provider ID is required' });
        }

        // Fetch all services for the given provider
        const services = await Service.findAll({
            where: { providerId },  // Fetch services that belong to the provider
            attributes: ['id', 'title'], // Only need the service ID and title
        });

        // If no services are found for this provider, return an error
        if (!services.length) {
            return res.status(404).json({ message: 'No services found for this provider' });
        }

        // Fetch reviews for all the services of the provider
        const reviews = await Review.findAll({
            where: {
                serviceId: services.map(service => service.id)  // Get reviews for all service IDs belonging to the provider
            },
            include: [
                {
                    model: User,  // Include User information (e.g., name, image)
                    attributes: ['firstName', 'lastName', 'photoURL'],
                },
                {
                    model: Service,  // Include the service info (in case you need to return service details)
                    attributes: ['title'],
                },
            ],
            order: [['createdAt', 'DESC']],  // Order reviews by the most recent first
        });

        // If no reviews are found, return a message indicating no reviews for the services
        if (!reviews.length) {
            return res.status(404).json({ message: 'No reviews found for this provider\'s services' });
        }

        // Format reviews data before sending to the frontend
        const formattedReviews = reviews.map((review) => ({
            userName: `${review.User.firstName} ${review.User.lastName}`,
            userImage: review.User.photoURL || '',//add a deafult img
            comment: review.comment,
            rating: review.ratingScore,
            date: review.createdAt,
            serviceTitle: review.Service.title,  // Service title
        }));

        // Send the formatted reviews as a response
        res.json(formattedReviews);
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
