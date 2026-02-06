const express = require("express");
const authRouter = express.Router();
const authController = require('../controller/authController');
const passport = require("../middlewares/Googleauth");
const jwt = require('jsonwebtoken');
require('dotenv').config();

authRouter.post("/login", authController.postLoginPage);
authRouter.post("/signup", authController.postSignUpPage);
authRouter.post("/verify-email-status", authController.postVerifyStatus);
authRouter.post("/logout", authController.logoutPage);
authRouter.get("/google", passport.authenticate("google", {
  scope: ["profile", "email"]
}));
authRouter.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login", session: false }),
  (req, res) => {
    // this runs AFTER authentication succeeds
    const user = req.user;
    const token = jwt.sign(
      { user: { id: user._id, email: user.email } },
      process.env.JWT_TOKEN,
      { expiresIn: "1h" }
    );
    res.cookie("authCookie", token, { httpOnly: true, secure: true, sameSite: "None" });
    // res.status(200).json({message: "Login successful", Access: true})
    return res.redirect("http://127.0.0.1:5500/Expense-Tracker/Frontend/index.html");
  }
);
module.exports = authRouter;
