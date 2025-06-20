const express = require('express');
const router = express.Router();

const multer = require('multer');

const path = require('path');
const { signup, signin } = require('../controller/user.controller');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './src/uploads'); // Directory to save uploaded files
        // Ensure the directory exists or create it if necessary
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

router.post('/signup', upload.single('profilePicture'), signup);


router.post("/signin", signin);


module.exports = router;