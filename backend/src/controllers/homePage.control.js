// controllers/homePage.control.js
const Service = require("../models/service.model");
const Category = require("../models/category.model");
const ServiceImage = require("../models/serviceImage.model");
const Rating = require("../models/rating.model");

exports.getEarlyAddedProviders = async (req, res) => {
  try {
    const providers = await Service.findAll({
      order: [["createdAt", "ASC"]],  // Order by createdAt in ascending order
      limit: 5,                       // Limit to the first 5 providers
      include: [
        {
          model: Category,            // Include category details
          attributes: ["name"],
        },
        {
          model: ServiceImage,        // Include service images
          as: 'image',
          attributes: ['id', 'imageUrls']
        },
        {
          model: Rating,              // Include rating details
          attributes: ["ratingScore", "reviewCount"],
        },
      ],
    });

    console.log("First 5 providers fetched with additional details:", providers);
    res.json(providers);
  } catch (error) {
    console.error("Error in fetching first added providers:", error);
    res.status(500).json({ error: "Failed to fetch providers" });
  }
};
