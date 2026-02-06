//node modules
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const session = require('express-session');

//local modules
const homeRouter = require('./routes/homeworkRouter');
const { MongoConnect } = require('./database/mongo');
const authRouter = require('./routes/authRouter');
const passport = require("./middlewares/Googleauth")

const app = express();

app.use(cors(
{
  origin: "http://127.0.0.1:5500",
  credentials: true
}
));
app.use(express.urlencoded());
app.use(express.json());
app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: true,  
        sameSite: "None"      
    }
}))
app.use(passport.initialize());
app.use(passport.session())

app.use("/auth/API", authRouter);
app.use("/homework/Api", homeRouter);
MongoConnect(() => {
    app.listen(process.env.PORT, () => {
        console.log("Connection Successfull");
    })
})