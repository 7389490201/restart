const express = require('express');
const router = express.Router();
const Cart = require('../models/cart.model');

router.post('/add', async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        if (!productId || !quantity) {
            return res.status(400).json({ error: 'Product ID and quantity are required' });
        }

        const cart = await Cart.findOne({ userId: req.user._id });

        if (cart) {
            const productIndex = cart.products.findIndex(p => p.productId.toString() === productId);
            if (productIndex > -1) {
                cart.products[productIndex].quantity += quantity;
            } else {
                cart.products.push({ productId, quantity });
            }
            cart.totalAmount += quantity * 10; // Assuming a fixed price of 10 for simplicity
            await cart.save();
        } else {
            const newCart = new Cart({
                userId: req.user._id,
                products: [{ productId, quantity }],
                totalAmount: quantity * 10 // Assuming a fixed price of 10 for simplicity
            });
            await newCart.save();
        }

        res.status(200).json({ message: 'Product added to cart successfully' });
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/view', async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.user._id }).populate('products.productId', 'name price image');
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        res.status(200).json(cart);
    } catch (error) {
        console.error('Error viewing cart:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/update', async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        if (!productId || !quantity) {
            return res.status(400).json({ error: 'Product ID and quantity are required' });
        }

        const cart = await Cart.findOne({ userId: req.user._id });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const productIndex = cart.products.findIndex(p => p.productId.toString() === productId);
        if (productIndex > -1) {
            cart.products[productIndex].quantity = quantity;
            cart.totalAmount += (quantity - cart.products[productIndex].quantity) * 10; // Assuming a fixed price of 10 for simplicity
            await cart.save();
            res.status(200).json({ message: 'Cart updated successfully' });
        } else {
            res.status(404).json({ message: 'Product not found in cart' });
        }
    } catch (error) {
        console.error('Error updating cart:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/remove', async (req, res) => {
    try {
        const { productId } = req.body;

        if (!productId) {
            return res.status(400).json({ error: 'Product ID is required' });
        }

        const cart = await Cart.findOne({ userId: req.user._id });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const productIndex = cart.products.findIndex(p => p.productId.toString() === productId);
        if (productIndex > -1) {
            cart.totalAmount -= cart.products[productIndex].quantity * 10; // Assuming a fixed price of 10 for simplicity
            cart.products.splice(productIndex, 1);
            await cart.save();
            res.status(200).json({ message: 'Product removed from cart successfully' });
        } else {
            res.status(404).json({ message: 'Product not found in cart' });
        }
    } catch (error) {
        console.error('Error removing from cart:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/clear', async (req, res) => {
    try {
        const cart = await Cart.findOneAndDelete({ userId: req.user._id });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        res.status(200).json({ message: 'Cart cleared successfully' });
    } catch (error) {
        console.error('Error clearing cart:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/total', async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.user._id });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        res.status(200).json({ totalAmount: cart.totalAmount });
    } catch (error) {
        console.error('Error fetching total amount:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});



module.exports = router;