const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user');
require('dotenv').config();

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/API/google/callback"
}, async function (token, tokenSecret, profile, done) {
    const user = await User.getUserByGoogleId(profile.id);
    if (!user) {
        try {
            const fullName = profile.name.givenName + profile.name.familyName
            const Email = profile.emails[0].value;
            const Password = null
            const GoogleId = profile.id
            const newUser = new User(fullName, Email, Password, GoogleId);
            await newUser.save()
            return done(null, newUser)
        }
        catch (err) {
            console.log("Error Occured!!", err);
            return done(err, null);
        }
    }
    else{
        return done(null, user)
    }
}))

passport.serializeUser((user, done) => done(null, user));

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.getUserById(id);
        return done(null, user)
    }
    catch(err){
        return done(err, null);
    }

    
})

module.exports = passport

