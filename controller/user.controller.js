/**
 * User Controller Module
 * Handles user registration, verification, authentication and profile management
 * @module userController
 */

import User from "../model/User.model.js";
import crypto from "crypto";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/**
 * Register a new user and send verification email
 * @async
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body containing user details
 * @param {string} req.body.name - User's full name
 * @param {string} req.body.email - User's email address
 * @param {string} req.body.password - User's password
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with success/error message
 * @throws {Error} When registration fails or email sending fails
 */
const registerUser = async (req, res) => {
  // if (!req.body) {
  //   return res.status(400).json({ message: "Request body is missing" });
  // }

  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (password.length > 6) {
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: `User already exists`,
      });
    }

    // creating user in db
    const user = await User.create({
      name,
      email,
      password,
    });

    if (!user) {
      return res.status(400).json({
        message: `User not registered`,
      });
    }

    const token = crypto.randomBytes(32).toString("hex");
    console.log(token);
    user.verificationToken = token;

    await user.save();

    const transporter = nodemailer.createTransport({
      host: process.env.MAILTRAP_HOST,
      port: process.env.MAILTRAP_PORT,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.MAILTRAP_USERNAME,
        pass: process.env.MAILTRAP_PASSWORD,
      },
    });

    const mailOption = {
      from: process.env.MAILTRAP_SENDEREMAIL,
      to: user.email,
      subject: "Email Verification",
      text: `Please click on the following link:
      ${process.env.BASE_URL}/api/v1/users/verify${verificationToken}
      `,
    };

    await transporter.sendMail(mailOption);

    res.status(201).json({
      message: "User registered successfully",
      success: true,
    });
  } catch (error) {
    res.status(400).json({
      message: "User not registered",
      error: error.message,
      success: false,
    });
  }
};

/**
 * Verify user's email address using verification token
 * @async
 * @param {Object} req - Express request object
 * @param {Object} req.params - URL parameters
 * @param {string} req.params.token - Verification token
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with success/error message
 * @throws {Error} When token is invalid or verification fails
 */
const verifyUser = async (req, res) => {
  // find user based on token
  // if found user.isVerified = true,
  // remove verification token
  // save
  // return response

  //get token from url

  const { token } = req.params;
  console.log(token);
  if (!token) {
    return res.status(400).json({
      message: "Invalid token no token",
    });
  }
  // validate token
  const user = await User.findOne({ verificationToken: token });

  if (!user) {
    return res.status(400).json({
      message: "Invalid User",
    });
  }

  user.isVerified = true;
  user.verificationToken = undefined;
  await user.save();

  return res.status(200).json({
    success: true,
    message: "Email verified successfully. You can now log in.",
  });
};

/**
 * Authenticate user and generate JWT token
 * @async
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body
 * @param {string} req.body.email - User's email
 * @param {string} req.body.password - User's password
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with token and user details
 * @throws {Error} When authentication fails
 */
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    console.log(isMatch);
    if (!isMatch) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    // // if psd is matched but user in not verified.
    // if(isMatch){
    //   return res.status(400).json({
    //     message: "User not verified. Please Verify your email."
    //   })
    // }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "24h",
      }
    );

    const cookieOptions = {
      httpOnly: true,
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    };

    // abhi ke liye cookies use karein token store karne keliye
    res.cookie("token", token, cookieOptions);
    res.status(200).json({
      success: true,
      message: "Login Successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(400).json({
      message: "User not registered",
      error: error.message,
      success: false,
    });
  }
};

/**
 * Get authenticated user's profile
 * @async
 * @param {Object} req - Express request object
 * @param {Object} req.user - Authenticated user object from middleware
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with user profile data
 * @throws {Error} When user is not found
 */
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    console.log(user);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log("Here is the error in getMe", error);
  }
};

/**
 * Logout user by clearing auth cookie
 * @async
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} JSON response confirming logout
 * @throws {Error} When logout operation fails
 */
const logoutUser = async (req, res) => {
  try {
    res.cookie("token", "", {});
    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {}
};

/**
 * Initiate password reset process
 * @async
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body
 * @param {string} req.body.email - User's email address
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with reset instructions
 * @throws {Error} When user not found or email sending fails
 */
const forgotPassword = async (req, res) => {
  // get email - from req.body
  // find user based on email
  // reset token + reset expiry => Date.now() + 10 * 60 * 1000 => user.save()
  // send email with reset link
  try {
  } catch (error) {}
};

/**
 * Reset user's password using reset token
 * @async
 * @param {Object} req - Express request object
 * @param {Object} req.params - URL parameters
 * @param {string} req.params.token - Password reset token
 * @param {Object} req.body - Request body
 * @param {string} req.body.password - New password
 * @param {Object} res - Express response object
 * @returns {Object} JSON response confirming password reset
 * @throws {Error} When token is invalid or reset fails
 */
const resetPassword = async (req, res) => {
  try {
    // collect token from params
    // password from req.body
    //
    const { token } = req.params;
    const { password } = req.body;

    try {
      const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() },
      });

      // set password in user
      // resetToken, resetExpire - field should be reset.
      // user.save()
    } catch (error) {}
  } catch (error) {}
};

export {
  registerUser,
  verifyUser,
  login,
  getMe,
  logoutUser,
  forgotPassword,
  resetPassword,
};

// user_profile
// logout
// forgot password
//
