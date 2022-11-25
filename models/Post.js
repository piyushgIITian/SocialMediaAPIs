const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {

    title:{
        type: String,
        max: 200,
        requred: true,
    },
    desc:{
        type: String,
        max: 500,
        requred: true,
    },
    comments: {
        type: Object,
        default: {comment_id:{type:String, required:true},content:{type: String, required: true}, done_by:{type: String, required: true}},
    },
    likes: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
