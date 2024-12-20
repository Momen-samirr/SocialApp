import express from "express";
import { protectRoute } from "../middlewares/protectRoute.js";
import {
  createComment,
  createPost,
  deleteComment,
  deletePost,
  getFeedPosts,
  getPostById,
  getPostComments,
  likePost,
  loveComment,
} from "../controllers/post.controller.js";

const router = express.Router();

router.get("/", protectRoute, getFeedPosts);
router.post("/create", protectRoute, createPost);
router.delete("/delete/:id", protectRoute, deletePost);
router.get("/:id", protectRoute, getPostById);
router.post("/:id/comment", protectRoute, createComment);
router.delete("/delete/:postId/:commentId", protectRoute, deleteComment);
router.post("/:id/like", protectRoute, likePost);
router.post("/love/:postId/:commentId", protectRoute, loveComment);
router.get("/comments/:postId", protectRoute, getPostComments);
export default router;
