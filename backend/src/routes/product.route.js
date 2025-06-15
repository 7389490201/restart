const router = require("express").Router();
const Product = require("../models/product.model");
const multer = require("multer");
const path = require("path");
const { requireSignin, isAdmin } = require("../middleware/auth");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './src/uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.post("/create", requireSignin, isAdmin, upload.single("image"), async (req, res) => {
    try {
        const { name, description, price, quantity, categoryId, createdBy } = req.body;

        if (!name || !description || !price || !quantity || !categoryId) {
            return res.status(400).json({ error: "All fields are required" });
        }
        priceAsNumber = Number(price);
        quantityAsNumber = Number(quantity);
        if (isNaN(priceAsNumber) || isNaN(quantityAsNumber)) {
            return res.status(400).json({ error: "Price and quantity must be numbers" });
        }

        if (!req.file) {
            return res.status(400).json({ error: "Image file is required" });
        }
        // Assuming req.user is populated with the admin's info after authentication

        const product = {
            name,
            description,
            price: priceAsNumber,
            quantity: quantityAsNumber,
            categoryId,
            image: `http://localhost:2000/uploads/${path.basename(req.file.path)}`, // Assuming the server is running on localhost:2000
            createdBy
        };

        const newProduct = await Product.create(product);
        res.status(201).json({
            message: "Product created successfully",
            product: newProduct
        });
    } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.get("/list", async (req, res) => {
    try {
        const products = await Product.find().populate('categoryId', 'name').populate('createdBy', 'fullName');
        res.status(200).json(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('categoryId', 'name').populate('createdBy', 'fullName');
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }
        res.status(200).json(product);
    } catch (error) {
        console.error("Error fetching product:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.put("/:id", requireSignin, isAdmin, upload.single("image"), async (req, res) => {
    try {
        const { name, description, price, quantity, categoryId } = req.body;

        if (!name || !description || !price || !quantity || !categoryId) {
            return res.status(400).json({ error: "All fields are required" });
        }
        priceAsNumber = Number(price);
        quantityAsNumber = Number(quantity);
        if (isNaN(priceAsNumber) || isNaN(quantityAsNumber)) {
            return res.status(400).json({ error: "Price and quantity must be numbers" });
        }

        const updateData = {
            name,
            description,
            price: priceAsNumber,
            quantity: quantityAsNumber,
            categoryId
        };

        if (req.file) {
            updateData.image = `http://localhost:2000/uploads/${path.basename(req.file.path)}`;
        }

        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!updatedProduct) {
            return res.status(404).json({ error: "Product not found" });
        }
        res.status(200).json({
            message: "Product updated successfully",
            product: updatedProduct
        });
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.delete("/:id", requireSignin, isAdmin, async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) {
            return res.status(404).json({ error: "Product not found" });
        }
        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
module.exports = router;