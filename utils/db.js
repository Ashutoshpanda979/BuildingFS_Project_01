/**
 * Database Connection Module
 * Establishes and manages MongoDB connection using Mongoose
 * @module database
 */

import mongoose from "mongoose";

/**
 * Connect to MongoDB database
 * Uses MONGO_URL environment variable for connection string
 * Implements promise-based connection with error handling
 * 
 * @function db
 * @returns {void}
 * @throws {Error} When connection fails
 */
const db = () => {
    mongoose
    .connect(process.env.MONGO_URL) // connecting mongodb - ref link saved in .env file as global variable.
    .then(() => {
        console.log(`Connected to mongodb`);
    })
    .catch((err) => {
        console.log(`Error connecting to mongodb`);
        console.error(err);
    });
};

export default db;
