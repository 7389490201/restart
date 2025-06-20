const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const path = require('path');
exports.signup = async (req, res) => {
    try {
        const { firstName, lastName, email, password, phone } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send('User already exists');
        }
        if (req.file) {
            req.body.profilePicture = req.file.path; // Save the uploaded file path
        }
        const user = new User({
            firstName,
            lastName,
            email,
            username: Math.random().toString(36).substring(2, 15), // Generate a random username
            hash_password: password,
            phone,
            profilePicture: `http://localhost:2000/uploads/${path.basename(req.file.path)}`
        });

        await user.save();
        res.status(201).send('User registered successfully');
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).send('Internal server error');
    }
}

exports.signin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user || user.comparePassword(password)) {
            return res.status(401).send('Invalid email or password');
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true, secure: true }); // Set cookie with token
        res.status(200).send({
            message: 'Signin successful',
            token: token,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                profilePicture: user.profilePicture
            }
        });
    } catch (error) {
        console.error('Error during signin:', error);
        res.status(500).send('Internal server error');
    }
}

exports.signout = (req, res) => {
    res.clearCookie('token'); // Clear the token cookie
    res.status(200).send('Signout successful');
}