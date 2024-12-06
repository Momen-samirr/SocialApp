// eslint-disable-next-line no-unused-vars
import React from "react";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../lib/axios";
import Sidebar from "../components/home/Sidebar";
import PostPublish from "../components/home/PostPublish";
import Post from "../components/home/Post";
import { Users } from "lucide-react";
import RecommendUser from "../components/home/RecommendUser";

const HomePage = () => {
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  const { data: recommendedUsers } = useQuery({
    queryKey: ["recommendedUsers"],
    queryFn: async () => {
      const res = await axiosInstance.get("/users/suggestions");
      return res.data;
    },
  });

  const { data: posts } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const res = await axiosInstance.get("/posts");
      return res.data;
    },
  });

  console.log("recommendedUsers", recommendedUsers);
  console.log("posts", posts);
  console.log("authUser", authUser);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="hidden lg:block lg:col-span-1">
        <Sidebar user={authUser} />
      </div>
      <div className="col-span-1 lg:col-span-2 order-first lg:order-none">
        <PostPublish user={authUser} />
        {posts?.data?.map((post) => (
          <Post key={post._id} post={post} />
        ))}

        {posts?.data?.length === 0 && (
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <div className="mb-6">
              <Users className="mx-auto text-blue-500" size={65} />
            </div>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              No posts yet
            </h2>
            <p className="text-info mb-6">Be the first to share a post</p>
          </div>
        )}
      </div>
      {recommendedUsers?.data?.length > 0 && (
        <div className="col-span-1 lg:col-span-1 hidden lg:block">
          <div className="bg-secondary rounded-lg shadow p-4">
            <h2 className="font-semibold mb-4">People you may know</h2>
            {recommendedUsers?.data?.map((user) => (
              <RecommendUser key={user._id} user={user} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
