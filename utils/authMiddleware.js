// utils/authMiddleware.js

const jwt = require('jsonwebtoken');
const User = require('../models/user'); // Adjust the path according to your project structure

// Middleware to verify the token
const verifyToken = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'Access Denied: No Token Provided!' });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({ message: 'Invalid Token' });
    }
};

// Middleware to check if the user is authenticated
const isAuthenticated = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(401).json({ message: 'User Not Found' });
        }
        req.user = user;
        next();
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// Middleware to check if the user has admin privileges
const isAdmin = async (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access Denied: Admins Only' });
    }
    next();
};

module.exports = {
    verifyToken,
    isAuthenticated,
    isAdmin,
};
