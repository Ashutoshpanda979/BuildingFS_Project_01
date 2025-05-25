/**
 * Authentication Middleware Module
 * Provides JWT authentication middleware for protected routes
 * @module authMiddleware
 */

import jwt, { decode } from "jsonwebtoken";

/**
 * Middleware to verify if user is logged in using JWT token
 * Checks for valid JWT token in cookies and sets user info in request
 * 
 * @async
 * @function isLoggedIn
 * @param {Object} req - Express request object
 * @param {Object} req.cookies - Request cookies containing JWT token
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void}
 * @throws {Error} When token is missing or invalid
 */
export const isLoggedIn = async (req, res, next) => {
  try {
    console.log(req.cookies);
    /**
     * Extract JWT token from cookies
     * @const {string} token
     */
    let token = req.cookies?.token;
    console.log("Token Found: ", token ? "YES" : "No");

    // If no token is present, return unauthorized
    if (!token) {
      console.log("No Token");
      return res.status(401).json({
        success: false,
        message: "Authentication failed",
      });
    }

    /**
     * Verify and decode JWT token
     * @const {Object} decoded - Contains user ID and role from token
     */
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    console.log("decoded data: ", decoded);
    
    // Attach decoded user info to request object
    req.user = decoded;

    next();
  } catch (error) {
    // Handle token verification errors
    console.log("Auth middleware error");
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
