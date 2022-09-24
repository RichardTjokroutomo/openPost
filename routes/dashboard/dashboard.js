// IMPORTS
// ===============================================================================
const express = require("express");
const User = require("../../models/userDB");
const Post = require("../../models/postDB");

const Router = express.Router({mergeParams:true});
const breaker = "=====================================================";

// MIDDLEWARE
// ===============================================================================
Router.use((req, resp, next)=>{
    if(!req.user){
        return resp.redirect("/user/login");
    }
    next();
});

// ROUTING (CRUD)
// ===============================================================================

// READ all post 
Router.get("/posts",async (req, resp)=>{
    const userDetails = await User.findOne({userId: req.user.id});

    // getting the posts
    const userPosts = [];
    for(let post of userDetails.postList){
        const userPost = await Post.findById(post);
        userPosts.push(userPost);
    }
    const arrLength = userPosts.length;


    resp.render("dashboardHome", {userDetails, userPosts, arrLength});
});

// get ADD new post page
Router.get("/post", async(req, resp)=>{
    resp.render("postForm");
});

// CREATE new post
Router.post("/post", async(req, resp)=>{
    const {title, content} = req.body;
    let index = 0;

    // GET LATEST POST
    const allPosts = await Post.find({});
    let latestPost = {};
    for(let post of allPosts){
        latestPost = post;
    };

    if(!latestPost.title){
        index = 0;
    }
    else{
        index = latestPost.sNum + 1;
    }

    const newPost = new Post({sNum: index, title: title, content: content, authorId: req.user.id});
    await newPost.save();

    const editUser = await User.findOne({userId: req.user.id});
    await editUser.postList.push(newPost._id);
    await editUser.save();

    resp.redirect("/dashboard/posts");
});

// get EDIT post page
Router.get("/edit", async (req, resp)=>{
    // get the post
    const getPost = await Post.findById(req.query.postid);
    resp.render("edit", {getPost});
});

// UPDATE post
Router.put("/edit", async(req, resp)=>{
    const {_override, postid} = req.query;
    const {title, content} = req.body;

    // fetch the post
    const id = {_id: postid};
    const updatePost = {title: title, content: content};
    await Post.findOneAndUpdate(id, updatePost);

    resp.redirect("/dashboard/posts");
});

// DELETE post
Router.delete("/edit", async(req, resp)=>{
    const {_override, postid} = req.query;

    // get post
    const getPost = await Post.findById(postid);
    const getUser = await User.findOne({userId: getPost.authorId});

    const userPosts = getUser.postList;
    userPosts.remove(postid);

    const id = {userId: getPost.authorId};
    const updatedUserPosts = {postList: userPosts};

    await User.findOneAndUpdate(id, updatedUserPosts);

    // delete the post
    await Post.deleteOne({_id: postid});
    
    resp.redirect("/dashboard/posts");
});

// EXPORTS
// ===============================================================================
module.exports = Router;