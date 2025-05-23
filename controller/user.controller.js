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

export { registerUser, verifyUser };
