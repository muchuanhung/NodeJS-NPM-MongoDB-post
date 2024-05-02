const mongoose = require("mongoose");
const postSchema = new mongoose.Schema(
  {
    name: {
      type: mongoose.Schema.ObjectId,
      ref:"user",
      trim: true,
      required: [true, "姓名必填"],
    },
    tags: [
      {
        type: String,
        trim: true,
        required: [true, '貼文標籤必填']
      }
    ],
    type: {
      type: String,
      default: 'public',
      enum: {
        values: ['public', 'private'],
        required: [true, '貼文類型必填'],
        message: '貼文類型錯誤'
      }
    },
    image: {
      type: String,
      default: "",
    },
    createdAt: {
      type: Date,
      default: Date.now,
      select: false,
    },
    content: {
      type: String,
      required: [true, "內文必填"],
    },
    likes: {
      type: Number,
      default: 0,
    },
    comments: {
      type: Number,
      default: 0,
    },
  },
  { versionKey: false }
);

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
