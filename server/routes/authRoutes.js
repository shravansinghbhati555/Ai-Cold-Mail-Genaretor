const express = require("express")
const router = express.Router()
const {registerUser, verifyOTP, loginUser} = require("../controllers/authController")
 
 

// //Register a new user
router.post("/register", registerUser)

// //Login a user
router.post("/login", loginUser)

// //Verify OTP
router.post("/verify-otp", verifyOTP)

module.exports =router