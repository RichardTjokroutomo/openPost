if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

// IMPORTS
// ===============================================================================
const mongoose = require('mongoose');
const findOrCreate = require("mongoose-findorcreate");
const breaker = "=====================================================";
const dbUrl = process.env.DB_URL ||'mongodb://localhost:27017/user-database';
mongoose.connect(dbUrl)
.then(()=>{
    console.log("connected to userDB.js!");
    console.log(breaker);
})
.catch((e)=>{
    console.log(e);
    console.log("something went wrong!");
    console.log(breaker);
});


// SETUP
// ===============================================================================
const userSchema = new mongoose.Schema({
    userId: {
        type: String
    },
    username: {
        type: String
    },
    accType:{  // local, google, or github
        type: String   
    },
    postList:[{
        type: String
    }]
});
userSchema.plugin(findOrCreate);

const User = new mongoose.model("User", userSchema);

// EXPORTS
// ===============================================================================
module.exports = User;