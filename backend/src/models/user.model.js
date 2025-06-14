const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const userSchema = new mongoose.Schema({
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
        default: 'user'
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
userSchema.virtual('fullName').get(function () {
    return `${this.firstName} ${this.lastName}`;
});
userSchema.virtual('password')
    .set(function (password) {
        this.hash_password = bcrypt.hashSync(password, 10);
    })
userSchema.methods.comparePassword = function (password) {
    return bcrypt.compareSync(password, this.hash_password);
};
module.exports = mongoose.model('User', userSchema);