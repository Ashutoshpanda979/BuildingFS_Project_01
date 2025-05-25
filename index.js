/**
 * Main application entry point.
 * Sets up Express server with middleware, routes and database connection.
 * Configures CORS, JSON parsing, and cookie handling.
 * @module index
 */

// Import comments for better readability
/**
 * Express web framework
 * @const {Object} express
 */
import express from "express"

/**
 * Environment variable configuration
 * @const {Object} dotenv
 */
import dotenv from "dotenv"

/**
 * Cross-Origin Resource Sharing middleware
 * @const {Object} cors
 */
import cors from "cors"

/**
 * Database connection utility
 * @const {Object} db
 */
import db from "./utils/db.js"

/**
 * User route handlers
 * @const {Object} userRoutes
 */
import userRoutes from './routes/user.routes.js'

/**
 * Cookie parsing middleware
 * @const {Object} cookieParser
 */
import cookieParser from "cookie-parser"

dotenv.config()

/**
 * Initialize Express application with middleware
 * @const {Object} app - Express application instance
 */
const app = express();

/**
 * Configure CORS middleware
 * Allows specified origin, credentials, methods and headers
 */
app.use(
    cors({
        origin: process.env.BASE_URL,
        credentials: true,
        methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization']
    })
);

/**
 * Configure Express middleware for parsing request bodies
 */
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

/**
 * Application port configuration
 * Uses environment variable or falls back to 4000
 * @const {number} port
 */
const port = process.env.port || 4000; 
// its a variable port - and we've added 3000
// common ports are - 3000 4000 5000 5173 8080 8000 etc
// there are around 65000 ports in computer science.

/**
 * Root route handler
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
app.get('/', (req, res) => {
  res.send('Cohort!')
});

/**
 * Example route handler
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
app.get("/ashutosh", (req, res) => {
    res.send("Ashutosh!");
});

/**
 * Initialize database connection
 */
db();

/**
 * Mount user routes under /api/v1/users
 */
app.use("/api/v1/users", userRoutes)

/**
 * Start the Express server
 * @listens {number} port - The port number to listen on
 */
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
