const User = require('../models/user.model');
const bcrypt = require('bcrypt');

// Fetch user profile
exports.getUserProfile = async (req, res) => {
    try {
        // Extract token from localStorage (assume token is sent in headers for backend)
        const userId = req.headers['x-user-id']; // Replace this with proper token validation in real-world scenarios

        if (!userId) {
            return res.status(401).json({ message: 'User ID is missing' });
        }

        // Fetch user details
        const user = await User.findByPk(userId, {
            attributes: ['id', 'firstName', 'lastName', 'email', 'phone', 'photoURL']
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Update user profile
exports.updateUserProfile = async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];
        const { firstName, lastName, email, phone } = req.body;

        if (!userId) {
            return res.status(401).json({ message: 'User ID is missing' });
        }

        // Update user details
        await User.update({ firstName, lastName, email, phone }, { where: { id: userId } });

        res.status(200).json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Change user password
exports.changeUserPassword = async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];
        const { oldPassword, newPassword } = req.body;

        if (!userId) {
            return res.status(401).json({ message: 'User ID is missing' });
        }

        // Fetch the user
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Validate old password
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Old password is incorrect' });
        }

        // Hash and update new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
        console.error('Error changing user password:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
