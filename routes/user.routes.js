/**
 * User Routes Module
 * Defines all routes for user-related operations including registration,
 * authentication, profile management, and password recovery
 * @module userRoutes
 */

import express from "express";
import {
  registerUser,
  verifyUser,
  login,
  getMe,
  logoutUser,
} from "../controller/user.controller.js";
import { isLoggedIn } from "../middleware/auth.middleware.js";

/**
 * Express router instance for handling user routes
 * @const {Object} router
 */
const router = express.Router();

/**
 * @route POST /api/v1/users/register
 * @description Register a new user and send verification email
 * @access Public
 */
router.post("/register", registerUser);

/**
 * @route GET /api/v1/users/verify/:token
 * @description Verify user's email address using verification token
 * @access Public
 * @param {string} token - Email verification token
 */
router.get("/verify/:token", verifyUser);

/**
 * @route POST /api/v1/users/login
 * @description Authenticate user and generate JWT token
 * @access Public
 */
router.post("/login", login);

/**
 * @route GET /api/v1/users/profile
 * @description Get authenticated user's profile
 * @access Private
 * @middleware isLoggedIn - Verifies JWT token
 */
router.get("/profile", isLoggedIn, getMe);

/**
 * @route GET /api/v1/users/logout
 * @description Logout user and clear authentication cookie
 * @access Private
 * @middleware isLoggedIn - Verifies JWT token
 */
router.get("/logout", isLoggedIn, logoutUser);

// Commented routes for future implementation
// /**
//  * @route POST /api/v1/users/forgotPassword
//  * @description Initiate password reset process
//  * @access Public
//  */
// router.post("/forgotPassword", forgotPassword);

// /**
//  * @route POST /api/v1/users/resetPassword
//  * @description Reset user's password using reset token
//  * @access Public
//  */
// router.post("/resetPassword", resetPassword);

export default router;
