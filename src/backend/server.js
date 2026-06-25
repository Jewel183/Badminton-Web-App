require('dotenv').config();
const connectDB = require('./config/mongodb');
const express = require('express');
const jwt = require("jsonwebtoken");
const path = require("path");
const bcrypt = require('bcryptjs'); 
const handleCors = require ('./middleware/corsMiddleware')
const app = express();
const port = process.env.PORT || 4000;
app.use(express.json());
app.use(handleCors);

connectDB();
const productsRouter = require('./routes/productsRoutes');
const userRouter = require('./routes/usersRouter');
const promotionRoutes = require('./routes/promotionRoutes');
const authRoutes = require('./routes/authRoutes');
const categoryRouter = require('./routes/categoryRoutes');
const brandRouter = require('./routes/brandRoutes');
const uploadRouter = require('./routes/uploadRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRouter = require('./routes/orderRoutes');
const dashboardRouter = require('./routes/dashboardRoutes');
const ratingRouter = require('./routes/ratingRoutes');
app.use('/api/products', productsRouter);
app.use('/api/users', userRouter);
app.use('/api/promotions', promotionRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRouter);
app.use('/api/brands', brandRouter);
app.use('/api/upload', uploadRouter); 
app.use('/api/cart', cartRoutes);
app.use('/api/order', orderRouter); 
app.use('/api/dashboard', dashboardRouter);
app.use('/api/ratings', ratingRouter);
app.get("/", (req, res) => {
    res.send("Express App is running successfully!");
});

app.get("/api/health", (req, res) => {
    res.status(200).json({ status: "OK" });
});

app.listen(port, "0.0.0.0", (error) => {
    if (!error) {
        console.log("Server started on port: " + port);
    } else {
        console.log("Error starting server: " + error);
    }
});