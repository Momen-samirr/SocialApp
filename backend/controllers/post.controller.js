import expressAsyncHandler from "express-async-handler";
import Post from "../models/post.model.js";
import appError from "../utilities/appError.js";
import httpStatus from "../utilities/httpStatus.js";
import cloudinary from "../lib/cloudinary.js";
import Notification from "../models/notification.model.js";
import { sendCommentNotificationEmail } from "../mails/emailsHandler.js";

export const getFeedPosts = expressAsyncHandler(async (req, res, next) => {
  const posts = await Post.find({
    author: { $in: [...req.user.connections, req.user._id] },
  })
    .populate("author", "name email userName profilePicure bannerImg headLine")
    .populate(
      "comments.user",
      "name email userName profilePicure bannerImg headLine"
    )
    .sort({ createdAt: -1 });

  if (!posts)
    return next(new appError("Posts not found", 404, httpStatus.FAILED));

  res.status(200).json({
    status: httpStatus.SUCCESS,
    message: "Posts fetched successfully",
    data: posts,
  });
});

export const createPost = expressAsyncHandler(async (req, res, next) => {
  const { content, image } = req.body;
  let newPost;

  if (image) {
    const imgResult = await cloudinary.uploader.upload(image);
    newPost = new Post({
      author: req.user._id,
      content,
      image: imgResult.secure_url,
    });
  } else {
    newPost = new Post({
      author: req.user._id,
      content,
    });
  }

  if (!content) {
    return next(new appError("Content is required", 400, httpStatus.FAILED));
  }

  await newPost.save();

  res.status(201).json(newPost);

  res.status(201).json({
    status: httpStatus.SUCCESS,
    message: "Post created successfully",
    data: newPost,
  });
});

export const deletePost = expressAsyncHandler(async (req, res, next) => {
  const postId = req.params.id;

  const post = await Post.findById(postId);

  if (!post)
    return next(new appError("Post not found", 404, httpStatus.FAILED));

  if (post.author.toString() !== req.user._id.toString()) {
    return next(
      new appError(
        "You are not authorized to delete this post",
        401,
        httpStatus.FAILED
      )
    );
  }

  if (post.image) {
    await cloudinary.uploader.destroy(
      post.image.split("/").pop().split(".")[0]
    );
  }

  await Post.findByIdAndDelete(postId);

  res.status(200).json({
    status: httpStatus.SUCCESS,
    message: "Post deleted successfully",
  });
});

export const getPostById = expressAsyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id)
    .populate("author", "name email userName profilePicure bannerImg headLine")
    .populate(
      "comments.user",
      "name userName email profilePicure bannerImg headLine"
    );

  if (!post)
    return next(new appError("Post not found", 404, httpStatus.FAILED));

  res.status(200).json({
    status: httpStatus.SUCCESS,
    message: "Post fetched successfully",
    data: post,
  });
});

export const createComment = expressAsyncHandler(async (req, res, next) => {
  const postId = req.params.id;
  const { content } = req.body;

  const post = await Post.findByIdAndUpdate(
    postId,
    {
      $push: {
        comments: {
          user: req.user._id,
          content,
        },
      },
    },
    {
      new: true,
    }
  ).populate("author", "name userName email profilePicure bannerImg headLine");
  if (post.author._id.toString() !== req.user._id.toString()) {
    const newNotification = new Notification({
      recipient: post.author,
      type: "comment",
      relatedUser: req.user._id,
      relatedPost: postId,
    });
    await newNotification.save();
    try {
      const postUrl = process.env.CLIENT_URL + "/post/" + postId;
      await sendCommentNotificationEmail(
        post.author.email,
        post.author.name,
        req.user.name,
        content,
        postUrl
      );
    } catch (error) {
      console.log(error);
    }
    res.status(201).json({
      status: httpStatus.SUCCESS,
      message: "Comment created successfully",
      data: post,
    });
  }
});

export const likePost = expressAsyncHandler(async (req, res, next) => {
  const postId = req.params.id;
  const post = await Post.findById(postId);
  if (!post)
    return next(new appError("Post not found", 404, httpStatus.FAILED));
  if (post.likes.includes(req.user._id)) {
    post.likes = post.likes.filter(
      (id) => id.toString() !== req.user._id.toString()
    );
  } else {
    post.likes.push(req.user._id);
    if (post.author.toString() !== req.user._id.toString()) {
      const newNotification = new Notification({
        recipient: post.author,
        type: "like",
        relatedUser: req.user._id,
        relatedPost: postId,
      });
      await newNotification.save();
    }
  }
  await post.save();
  res.status(200).json({
    status: httpStatus.SUCCESS,
    message: "Post liked successfully",
    data: post,
  });
});

export const deleteComment = expressAsyncHandler(async (req, res, next) => {
  const { postId, commentId } = req.params;
  const currentUserId = req.user._id;

  const post = await Post.findByIdAndUpdate(
    postId,
    {
      $pull: {
        comments: {
          _id: commentId,
          user: currentUserId,
        },
      },
    },
    {
      new: true,
    }
  );
  if (!post)
    return next(new appError("Post not found", 404, httpStatus.FAILED));
  res.status(200).json({
    status: httpStatus.SUCCESS,
    message: "Comment deleted successfully",
    data: post,
  });
});
