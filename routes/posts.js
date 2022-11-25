const express = require('express')
const router = express.Router()
const Post = require("../models/Post");
// const User = require("../models/User");
const auth = require("../middleware/auth");


//create a post
router.post("/", auth, async (req, res) => {

  const newPost = new Post({
    title: req.body.title,
    desc: req.body.description,
  });
  
  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

//delete a post

router.delete("/:id",auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.deleteOne();
      res.status(200).json("the post has been deleted");
    } else {
      res.status(403).json("you can delete only your post");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});



module.exports = router;
