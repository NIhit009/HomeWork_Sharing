const User = require('../models/user');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { check, validationResult } = require('express-validator');
const nodeMailer = require('nodemailer');
exports.postLoginPage = (req, res, next) => {
    const { Email, Password, UserType } = req.body;
    console.log(req.body);
    User.getUser().then(() => {
        User.getUserByEmail(Email).then((userInfo) => {
            if (userInfo.Email !== Email || userInfo.Password !== Password || userInfo.UserType !== UserType) {
                console.log("Incorrect Details")
                return res.sendStatus(400)
            }
            console.log("Login Successful");
            const token = jwt.sign({
                userEmail: userInfo.email,
                userType: userInfo.UserType
            }, process.env.JWT_TOKEN, { expiresIn: "1h" });
            res.cookie("authCookie", token, { httpOnly: true, sameSite: "None", secure: true });
            return res.status(200).json({ message: "Login successfull" });
        }).catch((err) => {
            console.log("User not found", err);
            return res.sendStatus(400);
        })
    }).catch((err) => {
        console.log("Error while finding the user", err);
        return res.sendStatus(500);
    })

}
exports.postSignUpPage = [
    check("fullName")
        .trim()
        .isLength({ min: 2 })
        .withMessage("Name cannot be 2 letter or shorter!!")
        .matches(/^[A-Za-z]+\s[A-Za-z]/)
        .withMessage("Please enter a valid Full Name"),
    check("Email")
        .trim()
        .isEmail()
        .withMessage("Please enter a valid email"),
    check("Password")
        .isLength({ max: 10 })
        .withMessage("Password cannot be more than 10 characters")
        .isLength({ min: 2 })
        .withMessage("Password need to be longer than 2 letters")
        .matches(/[A-Z]/)
        .withMessage("Password needs at least one upper case letter")
        .matches(/[0-9]/)
        .withMessage("Password needs at least 1 number")
        .matches(/[!@#$%^&*]/)
        .withMessage("Password needs at least 1 special character")
        .trim(),
    check("confirm_password")
        .trim()
        .custom((value, { req }) => {
            if (value != req.body.Password) {
                throw new Error("Password does not match");
            } return true
        }),
    async (req, res, next) => {
        console.log(req.body);
        const { fullName, Email, Password, userType } = req.body;
        const GoogleId = null
        const errors = validationResult(req);
        const EmailSender = nodeMailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.user_gmail,
                pass: process.env.user_password
            }
        })
        console.log(req.body);
        if (!errors.isEmpty()) {
            console.log("Some error has occurred", errors);
            return res.status(400).json({ success: false, errors: errors.array() });
        }
        const verifyToken = Math.floor(Math.random() * (9000 - 1000 + 1) + 1000);
        const codeExpires = Date.now() + (10 * 60 * 1000);
        const user = new User(fullName, Email, Password, GoogleId, userType, false, verifyToken, codeExpires);
        if (await User.getUserByEmail(Email)){
            return res.status(400).json({message: "User already exists!!"});
        }
        user.save().then(async () => {
            console.log("User saved successfully");
            const token = jwt.sign({email: user.Email}, process.env.JWT_TOKEN, {expiresIn: "1h"});
            const mailOptions = {
                from: process.env.user_gmail,
                to: user.Email,
                subject: "Verify your email",
                html: `To verify use this token:
                ${verifyToken}`
            }
            try {
                await EmailSender.sendMail(mailOptions);
            }
            catch (err) {
                return res.status(400).json({ message: "Could not send email" });
            }
            res.cookie('verifyEmail', token, {httpOnly: true, secure: true, sameSite: "None"});
            return res.status(200).json({ Access: true });
        }).catch((err) => {
            console.log("Could not save user Data", err);
            return res.sendStatus(500);
        })
    }
]

exports.logoutPage = (req, res, next) => {
    res.clearCookie('authCookie', {
        httpOnly: true,
        secure: true,
        sameSite: "None"
    })
    return res.status(200).json({ message: "Logout successful", Access: false })
}

exports.postVerifyStatus = async (req, res) => {
    const userToken = req.body.code;
    const verifyCookie = req.cookies['verifyEmail'];
    if (!verifyCookie){
        return res.status(404).json({message: "Token not found!!"});
    }
    const decoded = jwt.verify(verifyCookie, process.env.JWT_TOKEN);
    const email = decoded.email;
    const user = await User.getUserByEmail(email);
    console.log(user);
    if (!user) {
        return res.status(404).json({ message: "User not Found..." });
    }
    if (Date.now() > Date(user.CodeExpired)) {
        return res.status(400).json({ message: "Code has expired" });
    }
    console.log(user.VerifyCode)
    console.log(userToken);
    if (String(user.VerifyCode) !== String(userToken)) {
        return res.status(401).json({ message: "Code is incorrect" });
    }
    await User.verifyEmail(user.Email);
    res.clearCookie('verifyEmail', {
        httpOnly: true,
        secure: true,
        sameSite: "None"
    })
    const token = jwt.sign({ user_fullName: user.fullName, email: user.Email, userType: user.UserType }, process.env.JWT_TOKEN, { expiresIn: "1h" })
    res.cookie("authCookie", token, { secure: true, httpOnly: true, sameSite: "None" });
    return res.status(200).json({ message: "User verified!!" });
}