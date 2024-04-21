"use strict";
// Description: This file is the entry point of the application.
const express = require("express");
const app = express();

// Body parser middleware
const bodyParser = require("body-parser");
app.use(bodyParser.json());

// Dynamic port binding.
const path = require("path");
const dotenv = require("dotenv");
dotenv.config({
    path: path.join(__dirname, `/env/${process.env.NODE_ENV}.env`)
})

// Connect to MongoDB
const connectMongoDB = require('./connection');
connectMongoDB(process.env.MONGO_URI);

// Routes
const indexRoute = require("./routes/index");

// Use routes
app.use("/stocks", indexRoute);

// Port configuration
const port = process.env.PORT || 3000;
// Start server
app.listen(port, (err) => {
    if (err) throw err;
    console.log(`Server is running on port ${port}`);
})