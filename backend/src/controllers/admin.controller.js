const db = require('../models/associations'); // Import database models
const Report = require('../models/report.model');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Sequelize = require('sequelize');
const fs = require('fs');
const path = require('path');
const multer = require('multer');




// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'frontend/icons'); // Save icons in the public/icons folder
    },
    filename: (req, file, cb) => {
        const categoryName = req.body.name.toLowerCase().replace(/\s+/g, '_');
        cb(null, `${categoryName}.png`); // Save file as category_name.png
    }
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'image/png') {
            cb(null, true); // Accept PNG files
        } else {
            cb(new Error('Only PNG files are allowed.'));
        }
    }
}).single('icon');


// Admin login
exports.adminLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await db.User.findOne({ where: { email, role: "admin" } });

        if (!user) {
            return res.status(401).json({ message: "Admin not found." });
        }

        // Validate the password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials." });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        console.error("Error during admin login:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

// Dashboard Data
exports.getDashboardData = async (req, res) => {
    try {
        const totalUsers = await db.User.count();
        const activeAds = await db.Service.count({ where: { status: 'active' } });
        const pendingAds = await db.Service.count({ where: { status: 'pending' } });
        const reports = await Report.count();

        // res.json({ totalUsers, activeAds, pendingReviews, reports });
        res.json({ totalUsers, activeAds , pendingAds , reports });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch dashboard data' });
    }
};

// Users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await db.User.findAll();
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch users' });
    }
};

exports.suspendUser = async (req, res) => {
    try {
        const { id } = req.params;
        await db.User.update({ status: 'suspended' }, { where: { id } });
        res.json({ message: 'User suspended successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to suspend user' });
    }
};

// Ads
exports.getAllAds = async (req, res) => {
    try {
        const ads = await db.Ad.findAll();
        res.json(ads);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch ads' });
    }
};

exports.deleteAd = async (req, res) => {
    try {
        const { id } = req.params;
        await db.Ad.destroy({ where: { id } });
        res.json({ message: 'Ad deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to delete ad' });
    }
};

// Categories
exports.getAllCategories = async (req, res) => {
    try {
        const categories = await db.Category.findAll();
        res.json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ message: 'Failed to fetch categories' });
    }
};

exports.addCategory = async (req, res) => {
    // Handle file upload first
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: err.message });
        }

        const { name, description } = req.body;

        try {
            // Check if the category already exists (case-insensitive)
            const existingCategory = await db.Category.findOne({
                where: Sequelize.where(
                    Sequelize.fn('LOWER', Sequelize.col('name')),
                    name.toLowerCase()
                )
            });

            if (existingCategory) {
                // Remove the uploaded file if category already exists
                if (req.file) {
                    const filePath = path.join('frontend/icons', `${name.toLowerCase().replace(/\s+/g, '_')}.png`);
                    if (fs.existsSync(filePath)) {
                        fs.unlinkSync(filePath);
                    }
                }
                return res.status(400).json({ message: 'Category already exists.' });
            }

            // Create the category
            const category = await db.Category.create({ name, description });

            // Send success response
            res.status(201).json({ message: 'Category created successfully.', category });
        } catch (error) {
            console.error('Error creating category:', error);

            // Cleanup the uploaded file in case of errors
            if (req.file) {
                const filePath = path.join('frontend/icons', `${name.toLowerCase().replace(/\s+/g, '_')}.png`);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            }

            res.status(500).json({ message: 'Failed to create category.' });
        }
    });
};



exports.updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        await db.Category.update({ name }, { where: { id } });
        res.json({ message: 'Category updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to update category' });
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        await db.Category.destroy({ where: { id } });
        res.json({ message: 'Category deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to delete category' });
    }
};

// Reviews
exports.getFlaggedReviews = async (req, res) => {
    try {
        const reviews = await db.Review.findAll({ where: { status: 'flagged' } });
        res.json(reviews);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch flagged reviews' });
    }
};

exports.deleteReview = async (req, res) => {
    try {
        const { id } = req.params;
        await db.Review.destroy({ where: { id } });
        res.json({ message: 'Review deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to delete review' });
    }
};

// Reports
exports.getReports = async (req, res) => {
    try {
        const reports = await db.Report.findAll();
        res.json(reports);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch reports' });
    }
};
