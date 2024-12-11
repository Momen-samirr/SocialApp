// eslint-disable-next-line no-unused-vars
import React from "react";
import { useParams } from "react-router-dom";
import Sidebar from "./home/Sidebar";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../lib/axios";
import Post from "./home/Post";

const PostPage = () => {
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const { postId } = useParams();

  const { data: post, isLoading } = useQuery({
    queryKey: ["post", postId],
    queryFn: async () => await axiosInstance.get(`/posts/${postId}`),
  });
  console.log("post", post?.data?.data);
  if (isLoading)
    return (
      <div className="flex w-52 flex-col gap-4">
        <div className="skeleton h-32 w-full"></div>
        <div className="skeleton h-4 w-28"></div>
        <div className="skeleton h-4 w-full"></div>
        <div className="skeleton h-4 w-full"></div>
      </div>
    );
  if (!post?.data?.data) return <div>Post not found</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="hidden lg:block lg:col-span-1">
        <Sidebar user={authUser} />
      </div>
      <div className="col-span-1 lg:col-span-3">
        <Post post={post?.data?.data} />
      </div>
    </div>
  );
};

export default PostPage;
