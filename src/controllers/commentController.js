import asyncHandler from "../middleware/asyncHanddler.js";
import { CustomError } from "../middleware/errorHandler.js";
import Comment from "../model/commentModel.js";
import Post from "../model/postModel.js";
import mongoose from "mongoose";

const addComment = asyncHandler(async (req, res, next) => {
  const { postId, text } = req.body;
  const userId = new mongoose.Types.ObjectId();

  if (!postId || !text) {
    return next(new CustomError(400, "Post ID and text are required"));
  }

  const comment = new Comment({
    postId,
    userId,
    text,
  });

  await comment.save();

  await Post.findByIdAndUpdate(postId, { $push: { comments: comment._id } });

  res.status(201).json({
    success: true,
    message: "Comment added successfully",
    data: comment,
  });
});

const addReply = asyncHandler(async (req, res, next) => {
  const { postId, text, parentCommentId } = req.body;
  const userId = new mongoose.Types.ObjectId();

  if (!postId || !text || !parentCommentId) {
    return next(
      new CustomError(400, "Post ID, text, and parent comment ID are required")
    );
  }

  const parentComment = await Comment.findById(parentCommentId);
  if (!parentComment) {
    return next(new CustomError(404, "Parent comment not found"));
  }

  const replyComment = new Comment({
    postId,
    userId,
    text,
    parentCommentId,
  });

  await replyComment.save();

  parentComment.replies.push(replyComment._id);
  await parentComment.save();

  res.status(201).json({
    success: true,
    message: "Reply added successfully",
    data: replyComment,
  });
});

export { addComment, addReply };
