const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
const env = require('dotenv').config();
const cors = require('cors');
const path = require('path');
const userRoutes = require("./src/routes/user.routes");


app.use(cors());
app.use(express.json());
app.use('/api/user', userRoutes);
app.use("/api/admin", require("./src/routes/admin.routes"));
app.use('/uploads', express.static(path.join(__dirname, 'src/uploads')));
app.use("/api/category", require("./src/routes/category.route"));
app.use("/api/product", require("./src/routes/product.route"));
app.use("/api/cart", require("./src/routes/cart.route"));
app.use("/api/order", require("./src/routes/order.routes"));


mongoose.connect(process.env.MONGODB_URI).then(() => {
    console.log("MongoDB connected successfully");
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    });

}).catch(err => {
    console.error("MongoDB connection error:", err);
});
