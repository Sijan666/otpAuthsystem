const express = require('express');
const router = express.Router();
const nodemailer = require("nodemailer");
const otpGenerator = require('otp-generator')
const User = require('../models/userSchema')

const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    secure: false,
    auth: {
        user: '666majharulislam@gmail.com',
        pass: 'rhvmfvcnqeegqyxv',
    },
});

// sendotp
router.post('/sendotp' , async (req,res) => {
    try {
        const {email} = req.body

        if (!email) {
            return res.status(400).json({
                success : false , 
                message : "email not found"
            })
        }

        const otp = otpGenerator.generate(6);
        const existinguser = await User.findOne({email:email})

        if (!existinguser) {
            const user = await new User({
                email : email,
                otp : otp
            }).save()
        }
        else{
            await User.findOneAndUpdate({email:email},{otp:otp})
        }

        const info = await transporter.sendMail({
            from: '"Sijan" 666majharulislam@gmail.com',
            to: email,
            subject: "This is your OTP",
            html: `<body style="margin:0;padding:40px 0;background:#f5f5f7;font-family:Arial,Helvetica,sans-serif;"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center"><table width="520" cellpadding="0" cellspacing="0" border="0" style="background:#fff;border-radius:16px;padding:48px 40px;"><tr><td align="center" style="font-size:28px;font-weight:bold;color:#111827;">Your OTP</td></tr><tr><td align="center" style="padding-top:16px;font-size:15px;line-height:24px;color:#6b7280;">Use the verification code below to continue.</td></tr><tr><td align="center" style="padding:36px 0;"><table cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background:#111827;color:#fff;font-size:34px;font-weight:bold;letter-spacing:10px;padding:18px 40px;border-radius:12px;">${otp}</td></tr></table></td></tr><tr><td align="center" style="font-size:14px;color:#9ca3af;line-height:22px;">This code expires in <strong style="color:#111827;">10 minutes</strong>.<br>Never share your OTP with anyone.</td></tr><tr><td align="center" style="padding-top:40px;font-size:12px;color:#c0c0c0;">© 2026 Your Company</td></tr></table></td></tr></table></body>`,
        });
        console.log("Message sent: %s", info.messageId);
        
        res.status(200).json({
            success: true,
            message: "done"
        }) 
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "server error"
        });
    }
})

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
    const { email } = req.body;

    if (!email) {
        return res.send("Email is required");
    }

    const existinguser = await User.findOne({ email: email });

    if (!existinguser) {
        return res.send("User not found");
    }

    if (!existinguser.isLogin) {
        return res.send("User is already logged out");
    }

    await User.findOneAndUpdate({ email: email }, { isLogin: false });

    res.send('logout successful');
});



module.exports = router