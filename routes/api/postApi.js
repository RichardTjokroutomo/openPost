// IMPORTS
// ===============================================================================
const express = require("express");
const Post = require("../../models/postDB");
const User = require("../../models/userDB");

// SETUP
// ===============================================================================
const route = express.Router({mergeParams:true});


// ROUTING
// ===============================================================================
route.get("/index", async (req, resp)=>{
    const allPosts = await Post.find({});
    let latestPost = {};
    for(let post of allPosts){
        latestPost = post;
    };
    const index = latestPost.sNum;
    resp.send({latest: index});
});

route.get("/loadmore", async (req, resp)=>{
    const {latest_index, posts_loaded} = req.query;
    const startingSnum = latest_index-posts_loaded;

    // get 3 posts
    const postLists = [];
    for(let i = 0; i<3; i++){
      const idx = startingSnum - i;
      //console.log(idx);
      if(idx >= 0){
        const post = await Post.findOne({sNum: idx});
        postLists.push(post);
      }
    }

    // get username from user id
    const usernameList = [];
    for(let post of postLists){
      const username = await User.findOne({userId: post.authorId});
      usernameList.push(username.username);
    }

    reply = {postLists, usernameList};
    console.log(reply);
    resp.send(reply);
});



// EXPORTS
// ===============================================================================
module.exports = route;