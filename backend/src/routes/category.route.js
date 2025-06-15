const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const slugify = require('slugify');
const Category = require('../models/category.model'); // Assuming you have a Category model defined

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './src/uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.post('/create', upload.single('image'), async (req, res) => {
    try {
        const { name, description } = req.body;
        if (!req.file) {
            return res.status(400).json({ error: 'Image file is required' });
        }

        if (!name) {
            return res.status(400).json({ error: 'Category name is required' });
        }

        const category = {
            name,
            slug: slugify(name, { lower: true }),
            description,
            image: `http://localhost:2000/uploads/${path.basename(req.file.path)}`,
            parentId: req.body.parentId ? req.body.parentId : null
        };

        // Check if category already exists
        const existingCategory = await Category.findOne({ slug: category.slug });
        if (existingCategory) {
            return res.status(400).json({ error: 'Category already exists' });
        }

        const newCategory = await Category.create(category);
        res.status(201).json({
            message: 'Category created successfully',
            category: newCategory
        });
    } catch (error) {
        console.error('Error creating category:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get("/get", async (req, res) => {
    try {
        const categories = await Category.find({});
        res.status(200).json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
router.get("/get/:id", async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }
        res.status(200).json(category);
    } catch (error) {
        console.error('Error fetching category:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.put('/update/:id', upload.single('image'), async (req, res) => {
    try {
        const { name, description } = req.body;
        const categoryId = req.params.id;

        if (!name) {
            return res.status(400).json({ error: 'Category name is required' });
        }

        const updateData = {
            name,
            slug: slugify(name, { lower: true }),
            description,
            parentId: req.body.parentId ? req.body.parentId : null
        };

        if (req.file) {
            updateData.image = `http://localhost:2000/uploads/${path.basename(req.file.path)}`;
        }

        const updatedCategory = await Category.findByIdAndUpdate(categoryId, updateData, { new: true });
        if (!updatedCategory) {
            return res.status(404).json({ error: 'Category not found' });
        }

        res.status(200).json({
            message: 'Category updated successfully',
            category: updatedCategory
        });
    } catch (error) {
        console.error('Error updating category:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
router.delete('/delete/:id', async (req, res) => {
    try {
        const categoryId = req.params.id;
        const deletedCategory = await Category.findByIdAndDelete(categoryId);
        if (!deletedCategory) {
            return res.status(404).json({ error: 'Category not found' });
        }
        res.status(200).json({
            message: 'Category deleted successfully',
            category: deletedCategory
        });
    } catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


module.exports = router;
