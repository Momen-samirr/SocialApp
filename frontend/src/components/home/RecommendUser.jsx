// eslint-disable-next-line no-unused-vars
import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../lib/axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { Check, Clock, UserCheck, UserPlus, X } from "lucide-react";

const RecommendUser = ({ user }) => {
  const { data: connectionStatus, isLoading } = useQuery({
    queryKey: ["connectionStatus", user._id],
    queryFn: () => axiosInstance.get(`/connections/status/${user._id}`),
  });
  console.log("connectionStatus", connectionStatus);

  const queryClient = useQueryClient();

  const { mutate: sendConnectionRequest } = useMutation({
    mutationFn: (userId) =>
      axiosInstance.post(`/connections/request/${userId}`),
    onSuccess: () => {
      toast.success("Connection request sent successfully");
      queryClient.invalidateQueries({
        queryKey: ["connectionStatus", user._id],
      });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message);
    },
  });

  const { mutate: unSendConnectionRequest } = useMutation({
    mutationFn: (userId) =>
      axiosInstance.post(`/connections/unrequest/${userId}`),
    onSuccess: () => {
      toast.success("Connection request unsend successfully");
      queryClient.invalidateQueries({
        queryKey: ["connectionStatus", user._id],
      });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message);
    },
  });

  const { mutate: acceptRequest } = useMutation({
    mutationFn: (requestId) =>
      axiosInstance.put(`/connections/accept/${requestId}`),
    onSuccess: () => {
      toast.success("Connection request accepted successfully");
      queryClient.invalidateQueries({
        queryKey: ["connectionStatus", user._id],
      });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message);
    },
  });
  const { mutate: rejectRequest } = useMutation({
    mutationFn: (requestId) =>
      axiosInstance.put(`/connections/reject/${requestId}`),
    onSuccess: () => {
      toast.success("Connection request rejected successfully");
      queryClient.invalidateQueries({
        queryKey: ["connectionStatus", user._id],
      });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message);
    },
  });

  const renderButton = () => {
    if (isLoading) {
      return (
        <button className="btn btn-info" disabled>
          Loading
        </button>
      );
    }
    switch (connectionStatus?.data?.status) {
      case "Pending":
        return (
          <button onClick={handelUnConnect} className="btn btn-warning">
            <Clock size={16} className="mr-1" />
            Pending
          </button>
        );
      case "Received":
        return (
          <div className="flex gap-2 justify-center">
            <button
              className="btn btn-circle bg-green-500 hover:bg-green-600"
              onClick={() =>
                acceptRequest(connectionStatus?.data?.pendingRequestId)
              }
            >
              <Check size={16} />
            </button>
            <button
              className="btn btn-circle bg-red-500 hover:bg-red-600"
              onClick={() =>
                rejectRequest(connectionStatus?.data?.pendingRequestId)
              }
            >
              <X size={16} />
            </button>
          </div>
        );
      case "Connected":
        return (
          <button
            className="btn btn-outline btn-success flex items-center"
            disabled
          >
            <UserCheck size={16} className="mr-1" />
            Connected
          </button>
        );
      default:
        return (
          <button
            className="btn btn-outline btn-success"
            onClick={handelConnect}
          >
            <UserPlus size={16} className="mr-1" />
            Connect
          </button>
        );
    }
  };

  const handelUnConnect = () => {
    unSendConnectionRequest(user._id);
  };

  const handelConnect = () => {
    sendConnectionRequest(user._id);
  };

  return (
    <div className="flex items-center justify-between mb-4">
      <Link
        to={`/profile/${user?.userName}`}
        className="flex items-center flex-grow-0"
      >
        <img
          src={user?.profilePicure || "/avatar.png"}
          alt={user?.name}
          className="w-12 h-12 rounded-full mr-3"
        />
        <h3 className="font-semibold text-sm">{user?.name}</h3>
        <p className="text-info text-xs">{user?.headLine}</p>
      </Link>
      {renderButton()}
    </div>
  );
};

export default RecommendUser;
