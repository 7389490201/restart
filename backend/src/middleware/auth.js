const jwt = require('jsonwebtoken');
const Admin = require('../models/admin.model');
const path = require('path');
const User = require('../models/user.model');


exports.requireSignin = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: "Authorization header missing" });
    }
    const token = authHeader.split(" ")[1]; // Bearer <token>
    if (!token) {
        return res.status(401).json({ error: "Token missing" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token.' });
    }

}

exports.isAdmin = async (req, res, next) => {
    try {
        const admin = await Admin.findById(req.user.id);
        if (!admin || admin.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admins only.' });
        }
        next();
    } catch (error) {
        console.error('Error checking admin role:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}