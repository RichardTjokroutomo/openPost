// IMPORTS
// ===============================================================================
const breaker = "=====================================================";
const User = require("./models/userDB");
const localUser = require("./models/localDB");
const Post = require("./models/postDB");

// FUNCTIONS
// ==============================================================================
const reset = async()=>{
    await User.deleteMany({});
    console.log("userDB has been reset!");
    console.log(breaker);

    await localUser.deleteMany({});
    console.log("localDB has been reset!");
    console.log(breaker);

    await Post.deleteMany({});
    console.log("PostDB has been reset!");
    console.log(breaker);

}

reset();
