// IMPORTS
// ===============================================================================
const express = require("express");
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const methodOverride = require("method-override");

const localRoute = require("./routes/auth/localAuth");
const googleRoute = require("./routes/auth/googleAuth");
const githubRoute = require("./routes/auth/githubAuth");

const dashboardRoute = require("./routes/dashboard/dashboard");
//const { allowedNodeEnvironmentFlags } = require("process");
//const { markAsUntransferable } = require("worker_threads");

// VARIABLES
// ===============================================================================
const port = process.env.PORT || 3000;
const breaker = "=====================================================";

// INITIALIZATIONS
// ===============================================================================
const app = express();
app.listen(port, ()=>{
    console.log(`listening on port ${port}...`);
    console.log(breaker);
});
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, "/public")));
app.use(methodOverride("_override"));
app.use(session({
    secret: process.env.SESSION_SECRET || 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
  }));

// SETTING UP PASSPORT
// ===============================================================================
app.use(passport.initialize());
app.use(passport.session());

// inserting data obtained from auth to req.user
passport.serializeUser(function(user, cb) {
      process.nextTick(function() {
        return cb(null, {
          id: user.userId,
          username: user.username,
          accType: user.accType,
          postList: user.postList
          //picture: user.picture
        });
      });
  });

// used every time the session data is needed
passport.deserializeUser(function(user, cb) {
      process.nextTick(function() {
        return cb(null, user);
      });
  });

// ROUTING
// ===============================================================================
app.get("/", async (req, resp)=>{
   // session handling business
    let session = req.session;
    if(req.user){
        session = req.user;
    }
    resp.render("home", {session});
});

// routes
app.use("/user", localRoute);
app.use("/google", googleRoute);
app.use("/github", githubRoute);
app.use("/dashboard", dashboardRoute);

// in case some error happened
app.use((err, req, resp, next)=>{
    resp.render("error", {err});
});
