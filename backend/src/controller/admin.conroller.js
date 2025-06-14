const jwt = require('jsonwebtoken');
const Admin = require('../models/admin.model');
const path = require('path');


exports.adminsignup = async (req, res) => {
    try {
        const { firstName, lastName, email, password, phone } = req.body;

        // Check if user already exists
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).send('Admin already exists');
        }
        if (req.file) {
            req.body.profilePicture = req.file.path; // Save the uploaded file path
        }
        const admin = new Admin({
            firstName,
            lastName,
            email,
            username: Math.random().toString(36).substring(2, 15), // Generate a random username
            hash_password: password,
            phone,
            profilePicture: `http://localhost:2000/uploads/${path.basename(req.file.path)}`,
        });

        await admin.save();
        res.status(201).send('Admin registered successfully');
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).send('Internal server error');
    }
}

exports.adminsignin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const admin = await Admin.findOne({ email });
        if (!admin || admin.comparePassword(password)) {
            return res.status(401).send('Invalid email or password');
        }
        const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true, secure: true }); // Set cookie with token
        res.status(200).send({
            message: 'Signin successful',
            token: token,
            user: {
                id: admin._id,
                fullName: admin.fullName,
                email: admin.email,
                profilePicture: admin.profilePicture
            }
        });
    } catch (error) {
        console.error('Error during signin:', error);
        res.status(500).send('Internal server error');
    }
}