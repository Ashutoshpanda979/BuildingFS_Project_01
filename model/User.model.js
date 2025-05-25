/**
 * User Model Module
 * Defines the Mongoose schema and model for User entities
 * @module UserModel
 */

import mongoose from "mongoose";
import bcrypt from "bcryptjs";

/**
 * User Schema
 * Defines the structure and validation for user documents
 * @typedef {Object} UserSchema
 */
const userSchema = mongoose.Schema({
    /**
     * User's full name
     * @type {String}
     */
    name: String,
    
    /**
     * User's email address
     * @type {String}
     * Used for authentication and communication
     */
    email: String,
    
    /**
     * User's hashed password
     * @type {String}
     * Automatically hashed before saving via pre-save middleware
     */
    password: String,
    
    /**
     * User's role (default: 'user')
     * @type {String}
     * @enum ['user', 'admin']
     * @default 'user'
     * Determines user permissions within the application
     */
    role:{
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    
    /**
     * Flag indicating if user's email is verified
     * @type {Boolean}
     * @default false
     * Set to true after user confirms their email address
     */
    isVerified:{
        type: Boolean,
        default: false
    },
    
    /**
     * Token for email verification
     * @type {String}
     * Used in verification link sent to user's email
     */
    verificationToken:{
        type: String
    },
    
    /**
     * Token for password reset
     * @type {String}
     * Used for password recovery process
     */
    resetPasswordToken:{
        type: String
    },
    
    /**
     * Expiration timestamp for password reset token
     * @type {Date}
     * Ensures password reset links expire after a certain time
     */
    resetPasswordExpires:{
        type: Date
    }
}, {
    /**
     * Automatically adds createdAt and updatedAt timestamps
     */
    timestamps: true,
});

/**
 * Pre-save middleware to hash password before saving
 * Only hashes the password if it has been modified
 * @function
 * @name preSave
 */
userSchema.pre("save", async function(next){
    if(this.isModified(("password"))){
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

/**
 * Mongoose model for User
 * @type {mongoose.Model}
 */
const User = mongoose.model("User", userSchema);

export default User;
