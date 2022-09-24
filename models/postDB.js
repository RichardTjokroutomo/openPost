if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

// IMPORTS
// ===============================================================================
const mongoose = require('mongoose');
const breaker = "=====================================================";
const dbUrl = process.env.DB_URL ||'mongodb://localhost:27017/user-database';
mongoose.connect(dbUrl)
.then(()=>{
    console.log("connected to postDB.js!");
    console.log(breaker);
})
.catch((e)=>{
    console.log(e);
    console.log("something went wrong!");
    console.log(breaker);
});

// SETUP
// ===============================================================================
const postSchema = new mongoose.Schema({
    sNum:{
        type: Number
    },
    title:{
        type: String
    },
    content:{
        type: String
    },
    authorId:{
        type: String
    }
});

const Post = new mongoose.model("Post", postSchema);

// EXPORTS
// ===============================================================================
module.exports = Post;