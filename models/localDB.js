if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

// This DB stores username & pass for users choosing not to login via oauth
// luser means local user

// IMPORTS
// ===============================================================================
const mongoose = require('mongoose');
const breaker = "=====================================================";
const dbUrl = process.env.DB_URL ||'mongodb://localhost:27017/user-database';
mongoose.connect(dbUrl)
.then(()=>{
    console.log("connected to localDB.js!");
    console.log(breaker);
})
.catch((e)=>{
    console.log(e);
    console.log("something went wrong!");
    console.log(breaker);
});

// SETUP
// ===============================================================================
const luserSchema = new mongoose.Schema({
    username: {
        type: String
    },
    password: {
        type: String
    }
});

const Luser = new mongoose.model("luser", luserSchema);

// EXPORTS
// ===============================================================================
module.exports = Luser;