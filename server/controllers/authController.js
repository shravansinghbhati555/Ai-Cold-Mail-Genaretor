const { json } = require("express");
const User = require("../models/UserModel");
const sendEmail = require("../utils/sendEmail");
const jwt = require("jsonwebtoken")

const generateAuthToken = function(id){
  const token = jwt.sign({id}, process.env.JWT_SECRET,{expiresIn: '24h'})
  return token;
}

const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({
        message: "Invalid email format",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "Email already in use",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // otp valid for 10 minutes

    const user = await User.create({ username, email, password, otp, otpExpiry });
    res.status(201).json({
      message: "User registered successfully",
      user,
    });

    //opt sending
    try {
       
      await sendEmail({
        to: email,
        subject: "Your otp code for AI cold mail generater",
        text: `Your OTP is ${otp}. It is valid for 10 minutes only`,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error Sending OTP",
        error: error.message,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error registering user",
      error: error.message,
    });
  }
};

const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({
        message: "Email and otp are required",
      });
    }

    const user = await User.findOne({ email }).select("+otp +otpExpiry");
    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        message: "User already verified",
      });
    }

    if (user.otpExpiry < new Date()) {
      return res.status(400).json({
        message: "OTP has expired",
      });
    }

    user.isVerified = true;
    await user.save();
    const token = generateAuthToken(user._id);
    return res.status(200).json({
       token, message: "OTP verified successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error verified OTP",
      error: error.message,
    });
  }
};

 const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email })
      .select("+password +isVerified");

    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    if (!user.isVerified) {
      return res.status(400).json({
        message: "User not verified. Please verify your email first",
      });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    // Generate JWT token
    const token = generateAuthToken(user._id);

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        username: user.username,
        email: user.email,
      },
    });

  } catch (error) {
    console.error("LOGIN ERROR:", error);

    return res.status(500).json({
      message: "Error logging in",
      error: error.message,
    });
  }
};

module.exports = {
  registerUser,
  verifyOTP,
  loginUser,
};
