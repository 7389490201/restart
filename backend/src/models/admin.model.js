const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const adminSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    hash_password: {
        type: String,
        required: true,
        minlength: 6
    },
    role: {
        type: String,
        default: 'admin'
    },
    profilePicture: {
        type: String,
        trim: true
    },
    phone: {
        type: String,
        unique: true,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
adminSchema.virtual('fullName').get(function () {
    return `${this.firstName} ${this.lastName}`;
});
adminSchema.virtual('password')
    .set(function (password) {
        this.hash_password = bcrypt.hashSync(password, 10);
    })
adminSchema.methods.comparePassword = function (password) {
    return bcrypt.compareSync(password, this.hash_password);
};
module.exports = mongoose.model('Admin', adminSchema);