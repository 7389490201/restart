const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { adminsignup, adminsignin } = require('../controller/admin.conroller');

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

router.post('/signup', upload.single('profilePicture'), adminsignup);
router.post('/signin', adminsignin);




module.exports = router;