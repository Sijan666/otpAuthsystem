const express = require('express');
const router = express.Router();
const nodemailer = require("nodemailer");
const otpGenerator = require('otp-generator')
const User = require('../models/userSchema')
const {sendotp} = require('../controller/authController')

// sendotp
router.post('/sendotp' , sendotp)

// login
router.post('/login', async (req,res) => {
    try {
        const {email, otp} = req.body;
        const existinguser = await User.findOne({email:email})
        
        if (!existinguser) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (existinguser.isLogin) {
            return res.status(400).json({
                success: false,
                message: "Already logged in"
            });
        }

        if (!existinguser.otp || existinguser.otp === "") {
            return res.status(400).json({
                success: false,
                message: "OTP expired or invalid"
            });
        }

        if (existinguser.otp == otp) {
            await User.findOneAndUpdate({email:email},{otp:"" , isLogin: true})
            res.status(200).json({
                success: true,
                message: "login successful"
            });
        }
        else{
            res.status(400).json({
                success: false,
                message: "otp not matched"
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
})

// logout
router.post('/logout', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required"
            });
        }

        const existinguser = await User.findOne({ email: email });

        if (!existinguser) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (!existinguser.isLogin) {
            return res.status(400).json({
                success: false,
                message: "User is already logged out"
            });
        }
        
        await User.findOneAndUpdate({ email: email }, { isLogin: false });
        res.status(200).json({
            success: true,
            message: "logout successful"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

// sir
// router.post('/logout' , async (req,res) => {
//     const {email} = req.body
//     const existinguser = await User.findOne({ email: email });
//     if (existinguser.isLogin) {
//         await User.findOneAndUpdate({ email: email }, { isLogin: false });
//     }
// })

// ai
// router.post('/logout', async (req, res) => {
//     try {
//         const { email } = req.body;
//         const existinguser = await User.findOne({ email: email });
//         if (!existinguser) {
//             return res.status(404).send({ success: false, message: "User not found" });
//         }

//         if (existinguser.isLogin) {
//             await User.findOneAndUpdate({ email: email }, { isLogin: false });
//             return res.send({
//                 success: true,
//                 message: "Logout successful"
//             });
//         } 
//         return res.status(400).send({
//             success: false,
//             message: "User is already logged out"
//         });

//     } catch (error) {
//         return res.status(500).send({ success: false, message: "Server error" });
//     }
// });

// login without registration
router.post('/login', async (req, res) => {
    try {
        const { email, otp } = req.body;

        let existinguser = await User.findOne({ email: email });

        if (existinguser) {
            if (otp) {
                if (otp === existinguser.otp) {
                    return res.send("login successful");
                } else {
                    return res.send("wrong otp");
                }
            } else {
                return res.send("generate otp");
            }
        } 
        else {
            if (otp) {
                await new User({
                    email: email,
                    otp: otp
                }).save();
                return res.send("User registered");
            } else {
                await new User({
                    email: email
                }).save();
                return res.send("New user created. Please generate otp.");
            }
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send("Server Error");
    }
});


module.exports = router