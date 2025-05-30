# Node.js Authentication Project - Learning Guide

This document explains the code structure, implementation details, and concepts used in this authentication project.

## Project Architecture

The project follows a Model-View-Controller (MVC) architecture pattern with the following components:

`
BuildingFSProject_01/
├── controller/         # Business logic
├── model/             # Database schemas
├── routes/            # API route definitions
├── utils/             # Helper functions
└── index.js           # Application entry point
`

## Code Explanation

### 1. Entry Point (index.js)

`javascript
import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import db from "./utils/db.js"
`

Key components:
- Modern ES6 import syntax instead of CommonJS require()
- Express.js as the web framework
- Environment variables with dotenv
- CORS middleware for handling cross-origin requests
- Database connection utility

Configuration:
`javascript
app.use(cors({
    origin: process.env.BASE_URL,
    credentials: true,
    methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({extended:true}));
`

- CORS configuration for security
- JSON body parsing middleware
- URL-encoded data parsing

### 2. Database Connection (utils/db.js)

`javascript
import mongoose from "mongoose";

const db = () => {
    mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
        console.log('Connected to mongodb');
    })
    .catch((err) => {
        console.log('Error connecting to mongodb');
    })
}
`

- MongoDB connection using Mongoose
- Environment variable for database URL
- Promise-based connection handling

### 3. Routes (routes/user.routes.js)

`javascript
import express from 'express';
import {registerUser} from '../controller/user.coontroller.js';

const router = express.Router()

router.get("/register", registerUser);
`

- Express Router for modular routing
- Route handler import from controller
- RESTful API endpoint structure

### 4. Controllers (controller/user.controller.js)

`javascript
const registerUser = async (req, res) => {
    res.send("registered");
}
`

- Async controller function for user registration
- Currently a placeholder implementation
- Will handle user registration logic

## Environment Configuration

The project uses the following environment variables:
`
PORT = 3000
MONGO_URL = mongodb+srv://[username]:[password]@[cluster]/[database]
BASE_URL = http://127.0.0.1:3000
`

## API Endpoints

Current endpoints:
1. Root endpoint: GET '/'
   - Returns: "Cohort!"
   - Purpose: Basic server health check

2. User Registration: GET '/api/v1/users/register'
   - Returns: "registered"
   - Purpose: Will handle user registration (currently placeholder)

## Implementation Notes

1. **Modern JavaScript:**
   - Using ES6 module syntax (import/export)
   - Async/await for asynchronous operations

2. **Security Considerations:**
   - CORS configuration
   - Environment variables for sensitive data
   - Request method restrictions

3. **API Structure:**
   - RESTful API design
   - Versioned API endpoints (/api/v1/)
   - Modular routing

4. **Error Handling:**
   - Database connection error handling
   - (To be implemented: API error handling)

## To Be Implemented

1. User Model Schema
2. Complete Registration Logic
3. Authentication Middleware
4. Password Hashing
5. JWT Token Implementation
6. Error Handling Middleware
7. Input Validation
8. User Login/Logout Logic

## Best Practices Used

1. **Code Organization:**
   - Separation of concerns (MVC pattern)
   - Modular file structure
   - Clear naming conventions

2. **Configuration:**
   - Environment-based configuration
   - Secure credential management
   - Flexible port configuration

3. **Scalability:**
   - Modular routing
   - Database utility separation
   - Middleware-based architecture
