const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {

    title:{
        type: String,
        max: 200,
    },
    desc:{
        type: String,
        max: 500,
    },
    comments: {
        type: Object,
        default: {comment:{type: String, required: true}, done_by:{type: String, required: true}},
    },
    likes: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
