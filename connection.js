"use strict";
const mongoose = require('mongoose');

async function connectMongoDB(connectionString) {
    try {
        await mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Connected to MongoDB.');
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

module.exports = connectMongoDB;