const mongoose = require("mongoose");
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        default: 0
    },
    description: {
        type: String,
        trim: true
    },

    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    image: {
        type: String,
        trim: true
    },
    reviews: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        comment: {
            type: String,
            trim: true
        },
        rating: {
            type: Number,
            min: 1,
            max: 5
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
const Product = mongoose.model("Product", productSchema);
module.exports = Product;
// This code defines a Mongoose schema and model for a product in an e-commerce application.
// The schema includes fields for the product's name, slug, description, price, category ID, image URL, and creation date.  