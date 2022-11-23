const User = require("../models/User");
const express = require('express')
const router = express.Router()
const auth = require("../middleware/auth");




//get a user
router.get("/user/:id",auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { username,followers,following } = user._doc;
    res.status(200).json({username,followers,following});
  } catch (err) {
    res.status(500).json(err);
  }
});


//like / dislike a post

router.put("/like/:id",auth, async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      if (!post.likes.includes(req.body.userId)) {
        await post.updateOne({ $push: { likes: req.body.userId } });
        res.status(200).json("The post has been liked");
      } 
    } catch (err) {
      res.status(500).json(err);
    }
  });
  router.put("/unlike/:id",auth, async (req, res) => {
      try {
        const post = await Post.findById(req.params.id);
        if (post.likes.includes(req.body.userId)){
          await post.updateOne({ $pull: { likes: req.body.userId } });
          res.status(200).json("The post has been disliked");
        }
      } catch (err) {
        res.status(500).json(err);
      }
    });
  
  // comment on a post
  
  router.post("/comment/:id",auth, async (req, res) => {
      try{
          const post = await Post.findById(req.params.id);
          if (post.userId === req.body.userId) {
              await post.updateOne({$push:{comments: req.body.comments}})
              res.status(200).json("comment posted successfully");
            }
          } 
      catch (err) {
            res.status(500).json(err);
          }    
      
      
  })
  

//follow a user

router.put("/follow/:id",auth, async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({ $push: { followers: req.body.userId } });
        await currentUser.updateOne({ $push: { followings: req.params.id } });
        res.status(200).json("user has been followed");
      } else {
        res.status(403).json("you allready follow this user");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("you cant follow yourself");
  }
});

//unfollow a user

router.put("/unfollow/:id",auth, async (req, res) => {
    if (req.body.userId !== req.params.id) {
      try {
        const user = await User.findById(req.params.id);
        const currentUser = await User.findById(req.body.userId);
        if (user.followers.includes(req.body.userId)) {
          await user.updateOne({ $pull: { followers: req.body.userId } });
          await currentUser.updateOne({ $pull: { followings: req.params.id } });
          res.status(200).json("user has been unfollowed");
        } else {
          res.status(403).json("you dont follow this user");
        }
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(403).json("you cant unfollow yourself");
    }
  });

//get timeline posts

router.get("/all_posts",auth, async (req, res) => {
    try {
      const currentUser = await User.findById(req.body.userId);
      const userPosts = await Post.find({ userId: currentUser._id });
      const friendPosts = await Promise.all(
        currentUser.followings.map((friendId) => {
          return Post.find({ userId: friendId });
        })
      );
      res.json(userPosts.concat(...friendPosts))
    } catch (err) {
      res.status(500).json(err);
    }
  });


module.exports = router;
