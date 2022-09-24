if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
// IMPORTS
// ===============================================================================
const express = require("express");
const User = require("../../models/userDB");
const passport = require("passport");
const GoogleStrategy = require('passport-google-oauth20').Strategy;

// SETUP
// ===============================================================================
const Router = express.Router({mergeParams:true});

// PASSPORT
// ===============================================================================
const callbackURL = `${process.env.ROOT_URL}/google/login/callback`;
const googleClientID = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

// how we want to use the data given by google. in this case, we only want id & displayname
passport.use(new GoogleStrategy({
    clientID: googleClientID,
    clientSecret: googleClientSecret,
    callbackURL: callbackURL
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ userId: profile.id, username: profile.displayName, accType: "google" }, function (err, user) {
      return cb(err, user);
    });
  }
));

// ROUTING
// ===============================================================================
Router.get("/login",
  passport.authenticate("google", { scope: ['profile'] }));

// google sends credentials here after authenticating...
Router.get("/login/callback", 
  passport.authenticate("google", { failureRedirect: '/user/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect("/");
  });

// EXPORTS
// ===============================================================================
module.exports = Router;
