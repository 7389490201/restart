const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    parentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        default: null
    },
    image: {
        type: String,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;