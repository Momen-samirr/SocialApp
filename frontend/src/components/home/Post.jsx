// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../lib/axios";
import toast from "react-hot-toast";
import { Link, useParams } from "react-router-dom";
import {
  Heart,
  Loader,
  MessageCircle,
  Send,
  Share2,
  Trash2,
} from "lucide-react";
import PostAction from "./PostAction";

import { formatDistanceToNow } from "date-fns";

const Post = ({ post }) => {
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState(post.comments || []);
  const [newComment, setNewComment] = useState("");
  const { postId } = useParams();
  const isOwner = authUser?.data?._id === post.author._id;

  const isCommentOwner = comments.some(
    (comment) => comment.user._id === authUser?.data?._id
  );
  const isLiked = post.likes.includes(authUser?.data?._id);

  const queryClient = useQueryClient();

  const { mutate: deletePost, isPending: isDeletePending } = useMutation({
    mutationFn: async () => {
      await axiosInstance.delete(`/posts/delete/${post._id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Post deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete post");
    },
  });

  const { mutate: deleteComment, isPending: isCommentDeletePending } =
    useMutation({
      mutationFn: async (commentId) => {
        await axiosInstance.delete(`/posts/delete/${post._id}/${commentId}`);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["posts"] });
        toast.success("Comment deleted successfully");
      },
      onError: () => {
        toast.error("Failed to delete comment");
      },
    });

  const handelDeletePost = () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    deletePost();
  };

  const handelDeleteComment = (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?"))
      return;
    deleteComment(commentId);
  };

  const { mutate: createComment, isPending: isCommentPending } = useMutation({
    mutationFn: async (newComment) => {
      await axiosInstance.post(`/posts/${post._id}/comment`, {
        content: newComment,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Comment added successfully");
    },
    onError: () => {
      toast.error("Failed to add comment");
    },
  });

  const handelAddComment = (e) => {
    e.preventDefault();
    createComment(newComment);
    setNewComment("");
    setComments((prevComments) => [
      ...prevComments,
      {
        content: newComment,
        user: {
          _id: authUser?.data?._id,
          name: authUser?.data?.name,
          profilePicure: authUser.data?.profilePic,
        },
        createdAt: new Date(),
      },
    ]);
  };

  const { mutate: likePost, isPending: isLikePending } = useMutation({
    mutationFn: async () => {
      await axiosInstance.post(`/posts/${post._id}/like`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
    },
    onError: () => {
      toast.error("Failed to like post");
    },
  });

  const handelLikePost = () => {
    if (isLikePending) return;
    likePost();
  };
  return (
    <div className="bg-secondary rounded-lg shadow mb-4">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Link to={`/profile/${post?.author?.userName}`}>
              <img
                src={post?.author?.profilePicure || "/avatar.png"}
                alt={post?.author?.name}
                className="size-10 rounded-full mr-3"
              />
            </Link>
            <div>
              <Link to={`/profile/${post?.author?.userName}`}>
                <h3 className="font-semibold">{post?.author?.name}</h3>
              </Link>
              <p className="text-info text-xs">{post?.author?.headLine}</p>
              <p className="text-info text-xs">
                {formatDistanceToNow(new Date(post.createdAt), {
                  addSuffix: true,
                })}
              </p>
            </div>
          </div>
          {isOwner && (
            <button
              className="text-red-500 hover:text-red-700"
              onClick={handelDeletePost}
            >
              {isDeletePending ? (
                <Loader size={16} className="animate-spin" />
              ) : (
                <Trash2 size={16} />
              )}
            </button>
          )}
        </div>
        <p className="mb-4">{post.content}</p>
        {post.image && (
          <img src={post.image} alt="post" className="rounded-lg w-full mb-4" />
        )}
        <div className="flex items-center justify-between text-info ">
          <PostAction
            icon={
              <Heart
                size={16}
                className={isLiked ? "text-red-500 fill-red-500" : ""}
              />
            }
            text={`Loves (${post.likes.length})`}
            onClick={handelLikePost}
          />
          <PostAction
            icon={<MessageCircle size={16} />}
            text={`Comment ${comments.length}`}
            onClick={() => setShowComments(!showComments)}
          />
          <PostAction icon={<Share2 size={16} />} text="Share" />
        </div>
      </div>
      {showComments && (
        <div className="px-4 pb-4">
          <div className="mb-4 max-h-60 overflow-y-auto">
            {comments.map((comment) => (
              <div
                key={comment._id}
                className="mb-2 bg-base-100 p-2 rounded flex items-start justify-between"
              >
                <img
                  src={comment.user.profilePicure || "/avatar.png"}
                  alt={comment.user.name}
                  className="w-8 h-8 rounded-full mr-2 flex-shrink-0"
                />
                <div className="flex-grow">
                  <div className="flex items-center mb-1">
                    <span className="font-semibold mr-2">
                      {comment.user.name}
                    </span>
                    <span className="text-info text-xs">
                      {formatDistanceToNow(new Date(comment.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                  <p>{comment.content}</p>
                </div>
                {isCommentOwner && (
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handelDeleteComment(comment._id)}
                  >
                    {isCommentDeletePending ? (
                      <Loader className="animate-spin" />
                    ) : (
                      <Trash2 size={16} />
                    )}
                  </button>
                )}
              </div>
            ))}
          </div>
          <form onSubmit={handelAddComment} className="flex items-center">
            <input
              type="text"
              placeholder="Write a comment..."
              className="flex-grow p-2 rounded-l-full bg-base-100 focus:outline-none ocus:ring-2 focus:ring-primary"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button
              type="submit"
              className="btn btn-primary rounded-r-full"
              disabled={isCommentPending}
            >
              {isCommentPending ? (
                <Loader className="animate-spin" size={16} />
              ) : (
                <Send size={16} />
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Post;
