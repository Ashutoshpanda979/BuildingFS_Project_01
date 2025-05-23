// get data
// validating data
// checking whether userId already exists
//create user in db
// create verification token
// save token in db
// send token as email to user
// send success status to user

import User from "../model/User.model.js";
import crypto from "crypto";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// registering user
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
      ` 
    };

    await transporter.sendMail(mailOption);

    res.status(201).json({
        message: "User registered successfully",
        success: true
    })

  } catch (error) {
    res.status(400).json({
        message: "User not registered",
        error: error.message,
        success: false,
    })
  }

};

// verifying user
const verifyUser = async (req, res) => {
    // find user based on token
    // if found user.isVerified = true,
    // remove verification token
    // save
    // return response

    //get token from url
   
    const {token} = req.params;
    console.log(token);
    if(!token){
      res.status(400).json({
        message: "Invalid token"
      })
    }
    // validate token
    const user = await User.findOne({verificationToken: token})
    if(!user){
      res.status(400).json({
        message: "Invalid User",
      })
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save()

};

// Loging In
const login = async (req, res) => {
  const{email,password} = req.body;

  if(!email || !password){
   return res.status(400).json({
    message: "All fields are required"
   })
  }

  
  try{
    const user = await User.findOne({email})
    if(!user){
      return res.status(400).json({
        message: "User not found"
      })
    }

    
    const isMatch = await bcrypt.compare(password, user.password)
    
    console.log(isMatch);
    if(!isMatch){
      return res.status(400).json({
        message: "User not found"
      })
    }
    
    // if psd is matched but user in not verified.
    if(isMatch){
      return res.status(400).json({
        message: "User not verified. Please Verify your email."
      })
    }

    const token = jwt.sign({id: user._id, role:user.role},
      "shhhhh",
      {
        expiresIn: '24h'
      }
    );

    const cookieOptions = {
      httpOnly: true,
      secure: true,
      maxAge: 24*60*60*1000
    }

    // abhi ke liye cookies use karein token store karne keliye
    res.cookie("token", token, cookieOptions);
    res.status(200).json({
      success: true,
      message: "Login Successful",
      token,
      user:{
        id: user._id,
        name: user.name,
        role: user.role
      }
    })


  } catch (error) {
    res.status(400).json({
        message: "User not registered",
        error: error.message,
        success: false,
    })
  }


}


export { registerUser, verifyUser, login };


// user_profile
// logout
// forgot password
// 