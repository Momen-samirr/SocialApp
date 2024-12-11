// eslint-disable-next-line no-unused-vars
import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const FriendRequest = ({ request }) => {
  const queryClient = useQueryClient();
  const { mutate: acceptRequest } = useMutation({
    mutationFn: async (requestId) =>
      await axiosInstance.put(`/connections/accept/${requestId}`),
    onSuccess: () => {
      toast.success("Friend request accepted successfully");
      queryClient.invalidateQueries({ queryKey: ["requests"] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message);
    },
  });

  const { mutate: rejectRequest } = useMutation({
    mutationFn: async (requestId) =>
      await axiosInstance.put(`/connections/reject/${requestId}`),
    onSuccess: () => {
      toast.success("Friend request rejected successfully");
      queryClient.invalidateQueries({ queryKey: ["requests"] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message);
    },
  });
  return (
    <div className="bg-white rounded-lg shadow p-5 flex items-center justify-between transition-all hover:shadow-md">
      <div className="flex items-center gap-5">
        <Link to={`/profile/${request?.sender?.userName}`}>
          <img
            src={request?.sender?.profilePicure || "/avatar.png"}
            alt={request?.sender?.name}
            className="size-16 rounded-full object-cover"
          />
        </Link>
        <div>
          <Link
            to={`/profile/${request?.sender?.userName}`}
            className="font-semibold text-lg"
          >
            {request?.sender?.name}
          </Link>
          <p className="text-gray-600">{request?.sender?.headLine}</p>
        </div>
      </div>
      <div className="space-x-3">
        <button
          className="btn btn-primary px-3 py-3"
          onClick={() => acceptRequest(request._id)}
        >
          Accept
        </button>
        <button
          className="btn btn-info px-3 py-3"
          onClick={() => rejectRequest(request._id)}
        >
          Reject
        </button>
      </div>
    </div>
  );
};

export default FriendRequest;
