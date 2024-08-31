import asyncHandler from "../middleware/asyncHanddler.js";
import { CustomError } from "../middleware/errorHandler.js";
import Post from "../model/postModel.js";

const createPost = asyncHandler(async (req, res, next) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return next(new CustomError(400, "All fields are required"));
  }

  const newPost = new Post({
    title,
    content,
  });

  await newPost.save();

  res.status(201).json({ message: "Post created successfully", post: newPost });
});

export { createPost };
