const router = require("express").Router();
const Product = require("../models/product.model");
const Order = require("../models/order.model");
const { requireSignin } = require("../middleware/auth");
const User = require("../models/user.model");
const mongoose = require("mongoose");

// Create a new order
router.post("/create", requireSignin, async (req, res) => {
    try {
        const { products, totalAmount } = req.body;

        if (!products || !Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ error: "Products are required" });
        }

        if (!totalAmount || isNaN(totalAmount)) {
            return res.status(400).json({ error: "Total amount is required and must be a number" });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const order = new Order({
            userId: user._id,
            products,
            totalAmount
        });

        const savedOrder = await order.save();
        res.status(201).json({
            message: "Order created successfully",
            order: savedOrder
        });
    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
// Get all orders for a user
router.get("/user-orders", requireSignin, async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user.id }).populate('products.productId', 'name price image');
        res.status(200).json(orders);
    } catch (error) {
        console.error("Error fetching user orders:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
// Get all orders for admin
router.get("/admin-orders", requireSignin, async (req, res) => {
    try {
        const orders = await Order.find().populate('userId', 'fullName email').populate('products.productId', 'name price image');
        res.status(200).json(orders);
    } catch (error) {
        console.error("Error fetching admin orders:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
// Update order status
router.put("/update-status/:id", requireSignin, async (req, res) => {
    try {
        const { status } = req.body;
        if (!status || !['Pending', 'Shipped', 'Delivered', 'Cancelled'].includes(status)) {
            return res.status(400).json({ error: "Valid status is required" });
        }

        const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }

        res.status(200).json({
            message: "Order status updated successfully",
            order
        });
    } catch (error) {
        console.error("Error updating order status:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
// Get order details by ID
router.get("/:id", requireSignin, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('userId', 'fullName email').populate('products.productId', 'name price image');
        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }
        res.status(200).json(order);
    } catch (error) {
        console.error("Error fetching order details:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
module.exports = router;
// This code defines the routes for managing orders in an e-commerce application.