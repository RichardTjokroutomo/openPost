// IMPORTS
// ===============================================================================
const express = require("express");
const bcrypt = require("bcrypt");
const passportLogin = require("passport");
const localStrategy = require("passport-local");

const User = require("../../models/userDB");
const localUser = require("../../models/localDB");

const saltRounds = 10;

// SETUP
// ===============================================================================
const Router = express.Router({mergeParams:true});

// PASSPORT STUFF
// ===============================================================================
passportLogin.use(new localStrategy( async (username, password, done)=>{
    const getLocalUser = await localUser.findOne({username: username});
    if(!getLocalUser){
        return done(null, false);
    }
    const passValid = await bcrypt.compare(password, getLocalUser.password);
    if(!passValid){
        return done(null, false);
    }

    const getUser = await User.findOne({userId: getLocalUser._id});
    return done(null, getUser);
}));

// ROUTES
// ===============================================================================

// login
Router.get("/login", (req, resp)=>{
    let newUser = null;
    if(req.query.newuser == "yes"){
        console.log("new user! yay!")
        newUser = req.query.newuser;
    }
    resp.render("login", {newUser});
});
Router.post('/login', 
  passportLogin.authenticate('local', { failureRedirect: '/user/signup' }),
  function(req, res) {
    res.redirect('/');
  });

// signup
Router.get("/signup", (req, resp)=>{
    let message = null;
    if(req.query.status == "fail"){
        message = req.query;
    }
    resp.render("signup", {message});
});

Router.post("/signup", async (req, resp)=>{
    const {username, password} = req.body;
    const getLocalUser = await localUser.findOne({username: username});
    if(getLocalUser){
        resp.redirect("/user/signup?status=fail");
        return null; // so what's underneath wont get triggered
    }
    
    const hashedPass = await bcrypt.hash(password, saltRounds);

    const newLocalUser = new localUser({username: username, password: hashedPass});
    await newLocalUser.save();

    const newUser = new User({userId: newLocalUser._id, username: newLocalUser.username, accType: "local"});
    await newUser.save();
    resp.redirect("/user/login?newuser=yes");
});

// logout
Router.get("/logout", (req, resp)=>{
    req.logout(function(err) {
        if (err) { return next(err); }
        resp.redirect('/');
      });
});


    
// EXPORTS
// ===============================================================================
module.exports = Router;








