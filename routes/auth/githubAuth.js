/*
if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
*/
require('dotenv').config();
// IMPORTS
// ===============================================================================
const express = require("express");
const User = require("../../models/userDB");
const passport = require("passport");
const GitHubStrategy = require('passport-github').Strategy;

// SETUP
// ===============================================================================
const Router = express.Router({mergeParams:true});

// PASSPORT
// ===============================================================================
const callbackURL = `${process.env.ROOT_URL}/github/login/callback`;
const githubClientId = process.env.GITHUB_CLIENT_ID;
const githubClientSecret = process.env.GITHUB_CLIENT_SECRET;

// how we want to use the credentials given by github. in this case, we only want profile id & username
passport.use(new GitHubStrategy({
    clientID: githubClientId,
    clientSecret: githubClientSecret,
    callbackURL: callbackURL
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ userId: profile.id, username: profile.username, accType: "github" }, function (err, user) {
      return cb(err, user);
    });
  }
));

// ROUTES
// ===============================================================================
Router.get("/login", passport.authenticate("github"));

// github sends credentials back to this path
Router.get("/login/callback", 
  passport.authenticate("github", { failureRedirect: '/user/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

// EXPORTS
// ===============================================================================
module.exports = Router;