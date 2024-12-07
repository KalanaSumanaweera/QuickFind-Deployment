const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // Get token from headers
    const token = req.headers.authorization?.split(' ')[1]; // Expecting "Bearer <token>"

    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach user info to request object
        next(); // Proceed to the next middleware/controller
    } catch (err) {
        res.status(403).json({ error: 'Invalid or expired token.' });
    }
};

const { User } = require('../models/user.model');


exports.verifyServiceProvider = async (req, res, next) => {
    const token = req.headers['authorization'];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);

    if (user.role !== 'service_provider') return res.status(403).send('Access denied');
    next();
};

const verifyAdminToken = (req, res, next) => {
    const token = req.headers["authorization"]?.split(" ")[1]; // Assuming Bearer Token

    if (!token) {
        return res.status(403).json({ message: "No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== "admin") {
            return res.status(403).json({ message: "Unauthorized access" });
        }
        req.user = decoded; // Attach decoded token data to the request
        next();
    } catch (error) {
        console.error("Token validation error:", error);
        return res.status(401).json({ message: "Invalid token" });
    }
};

module.exports = {
    verifyAdminToken,
};

