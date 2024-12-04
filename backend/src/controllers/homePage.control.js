// controllers/homePage.control.js
const Service = require("../models/service.model");
const Category = require("../models/category.model");
const Review = require("../models/review.model");

exports.getEarlyAddedProviders = async (req, res) => {
  try {
    const providers = await Service.findAll({
      order: [["createdAt", "DESC"]],  // Order by the createdAt column in ascending order
      limit: 5,                        // Limit the results to 5 providers
    });
    console.log("First 5 providers fetched by createdAt:", providers);
    res.json(providers);
  } catch (error) {
    console.error("Error in fetching first added providers:", error);
    res.status(500).json({ error: "Failed to fetch providers" });
  }
};
