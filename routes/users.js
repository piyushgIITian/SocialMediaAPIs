const express = require('express')
const auth = require("../middleware/auth");
const User = require("../models/User");
const Post = require("../models/Post");
const router = express.Router()




//get a user
router.get("/user", auth, async (req, res) => {

  try {
    const user = await User.findById(req.user.user_id);
    const { username,followers,following } = user._doc;
    res.status(200).json({username,followers,following});
  } catch (err) {
    res.status(500).json(err);
  }
});


//like / dislike a post

router.post("/like/:id",auth, async (req, res) => {
    try {
      
      const post = await Post.findById(req.params.id);
      console.log("this worked")
      if (!post.likes.includes(req.user.user_id)) {
        
        await post.updateOne({ $push: { likes: req.user.user_id } });
        res.status(200).json("The post has been liked");
      } 
    } catch (err) {
      
      res.status(500).json(err);
    }
  });
  router.put("/unlike/:id",auth, async (req, res) => {
      try {
        const post = await Post.findById(req.params.id);
        if (post.likes.includes(req.user.user_id)){
          await post.updateOne({ $pull: { likes: req.user.user_id } });
          res.status(200).json("The post has been disliked");
        }
      } catch (err) {
        res.status(500).json(err);
      }
    });
  
  // comment on a post
  String.prototype.shuffle = function () {
    var a = this.split(""),
        n = a.length;

    for(var i = n - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = a[i];
        a[i] = a[j];
        a[j] = tmp;
    }
    return a.join("");
}

  router.post("/comment/:id",auth, async (req, res) => {
      try{
          const post = await Post.findById(req.params.id);
          const comment = {
            comment_id: (req.user.user_id).shuffle(),
            content: req.body.content,
            done_by: req.user.user_id,
          }
          await post.updateOne({$push:{comments: comment}})
          res.status(200).json(`comment posted successfully with comment-id ${comment.comment_id}`);
          
          } 
      catch (err) {
            res.status(500).json(err);
          }    
      
      
  })
  

//follow a user

router.post("/follow/:id",auth, async (req, res) => {
  console.log(req);
  if (req.user.user_id !== req.params.id) {
    try {
      console.log("this worked")
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.user.user_id);
      if (!user.followers.includes(req.user.user_id)) {
        await user.updateOne({ $push: { followers: req.user.user_id } });
        await currentUser.updateOne({ $push: { followings: req.params.id } });
        res.status(200).json("user has been followed");
      } else {
        res.status(403).json("you allready follow this user");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    console.log("this worked aa")
    res.status(403).json("you cant follow yourself");
  }
});

//unfollow a user

router.post("/unfollow/:id",auth, async (req, res) => {
    if (req.user.user_id !== req.params.id) {
      try {
        const user = await User.findById(req.params.id);
        const currentUser = await User.findById(req.user.user_id);
        if (user.followers.includes(req.user.user_id)) {
          await user.updateOne({ $pull: { followers: req.user.user_id } });
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


//get post
router.get("/posts/:id", async (req, res) => {
  try{
    const post=await Post.findById(req.params.id);
    res.json(post);
  }catch(err){
    res.status(500).json(err);
  }});

//get timeline posts

router.get("/all_posts",auth, async (req, res) => {
    try {
      const currentUser = await User.findById(req.user.user_id);
      const userPosts = await Post.find({ userId: currentUser._id });
      // console.log(currentUser)
      // const friendPosts = await Promise.all(
      //   currentUser.followings.map((friendId) => {
      //     return Post.find({ userId: friendId });
      //   })
      // );
      res.json(userPosts)
    } catch (err) {
      res.status(500).json(err);
    }
  });


module.exports = router;
