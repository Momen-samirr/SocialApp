// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";
import { Camera, Clock, MapPin, UserCheck, UserPlus, X } from "lucide-react";

const ProfileHeader = ({ isOwnProfile, userData, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});

  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const queryClient = useQueryClient();
  const { data: connectionStatus, refetch: refetchConnectionStatus } = useQuery(
    {
      queryKey: ["connectionStatus", userData._id],
      queryFn: async () =>
        await axiosInstance.get(`/connections/status/${userData._id}`),
      enabled: !isOwnProfile,
    }
  );
  const isConnected = userData?.data?.connections?.some(
    (connection) => connection === authUser?.data?._id
  );

  const { mutate: sendConnectionRequest } = useMutation({
    mutationFn: async (userId) =>
      await axiosInstance.post(`/connections/request/${userId}`),
    onSuccess: () => {
      toast.success("Connection request sent");
      refetchConnectionStatus();
      queryClient.invalidateQueries({ queryKey: ["connectionRequests"] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message);
    },
  });

  const { mutate: acceptRequest } = useMutation({
    mutationFn: async (requestId) =>
      await axiosInstance.put(`/connections/accept/${requestId}`),
    onSuccess: () => {
      toast.success("Connection request accepted");
      refetchConnectionStatus();
      queryClient.invalidateQueries({ queryKey: ["connectionRequests"] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message);
    },
  });

  const { mutate: rejectRequest } = useMutation({
    mutationFn: async (requestId) =>
      await axiosInstance.put(`/connections/reject/${requestId}`),
    onSuccess: () => {
      toast.success("Connection request accepted");
      refetchConnectionStatus();
      queryClient.invalidateQueries({ queryKey: ["connectionRequests"] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message);
    },
  });

  const { mutate: removeConnection } = useMutation({
    mutationFn: async (userId) =>
      await axiosInstance.delete(`/connections/${userId}`),
    onSuccess: () => {
      toast.success("Connection removed");
      refetchConnectionStatus();
      queryClient.invalidateQueries({ queryKey: ["connectionRequests"] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message);
    },
  });

  const getConnectionStatus = () => {
    if (isConnected) return "Connected";
    if (!isConnected) return "Not Connected";
    return connectionStatus?.data?.status;
  };

  const renderConnectionButton = () => {
    const baseClass =
      "text-white py-2 px-4 rounded-full transition duration-300 flex items-center justify-center";
    switch (getConnectionStatus()) {
      case "Connected":
        return (
          <div className="flex gap-2 justify-center">
            <div className={`${baseClass} bg-blue-500 hover:bg-blue-600`}>
              <UserCheck size={16} className="mr-3" />
              Connected
            </div>
            <button
              className={`${baseClass} bg-red-500 hover:bg-red-600 text-sm`}
              onClick={() => removeConnection(userData._id)}
            >
              <X size={16} className="mr-3" />
              Remove Connection
            </button>
          </div>
        );
      case "Pending":
        return (
          <button
            className={`${baseClass} bg-yellow-500 hover:bg-yellow-600 text-sm`}
          >
            <Clock size={16} className="mr-3" />
            Pending
          </button>
        );

      case "received":
        return (
          <div className="flex gap-2 justify-center">
            <button
              className={`${baseClass} bg-green-500 hover:bg-green-600`}
              onClick={() =>
                acceptRequest(connectionStatus?.data?.pendingRequestId)
              }
            >
              <UserCheck size={16} className="mr-3" />
              Accept
            </button>
            <button
              className={`${baseClass} bg-red-500 hover:bg-red-600 text-sm`}
              onClick={() =>
                rejectRequest(connectionStatus?.data?.pendingRequestId)
              }
            >
              <X size={16} className="mr-3" />
              Reject
            </button>
          </div>
        );

      default:
        return (
          <button
            className={`${baseClass} bg-blue-500 hover:bg-blue-600`}
            onClick={() => sendConnectionRequest(userData._id)}
          >
            <UserPlus size={16} className="mr-3" />
            Connect
          </button>
        );
    }
  };

  const handelImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedData((prevData) => ({
          ...prevData,
          [e.target.name]: reader.result,
        }));
      };
    }
  };
  const handelSave = () => {
    onSave(editedData);
    setIsEditing(false);
  };
  return (
    <div className="bg-white shadow rounded-lg mb-6">
      <div
        className="relative h-48 rounded-t-lg bg-cover bg-center"
        style={{
          backgroundImage: `url('${
            editedData.bannerImg || userData.bannerImg || "/banner.png"
          }')`,
        }}
      >
        {isEditing && (
          <label className="absolute top-3 right-3 cursor-pointer bg-white p-2 rounded-full shadow">
            <Camera size={16} />
            <input
              type="file"
              className="hidden"
              name="bannerImg"
              accept="image/*"
              onChange={handelImageChange}
            />
          </label>
        )}
      </div>
      <div className="p-5">
        <div className="relative -mt-20 mb-5">
          <img
            src={
              editedData.profilePicture ||
              userData.profilePicture ||
              "/avatar.png"
            }
            alt={userData.name}
            className="w-36 h-36 rounded-full mx-auto object-cover"
          />
          {isEditing && (
            <label className="absolute bottom-0 right-1/3 transform translate-x-16 bg-white p-3 rounded-full shadow cursor-pointer">
              <Camera size={16} />
              <input
                type="file"
                className="hidden"
                name="profilePicture"
                accept="image/*"
                onChange={handelImageChange}
              />
            </label>
          )}
        </div>
        <div className="text-center mb-6">
          {isEditing ? (
            <input
              type="text"
              className="text-2xl font-bold mb-3 text-center w-full"
              value={editedData.name ?? userData.name}
              onChange={(e) =>
                setEditedData({ ...editedData, name: e.target.value })
              }
            />
          ) : (
            <h1 className="text-2xl font-bold mb-3">{userData.name}</h1>
          )}
          {isEditing ? (
            <input
              type="text"
              className="text-gray-600 mb-3 text-center w-full"
              value={editedData.headLine ?? userData.headLine}
              onChange={(e) =>
                setEditedData({ ...editedData, headLine: e.target.value })
              }
            />
          ) : (
            <p className="text-gray-600">{userData.headLine}</p>
          )}
          <div className="flex items-center justify-center mt-3">
            <MapPin size={16} className="text-gray-500 mr-3" />
            {isEditing ? (
              <input
                type="text"
                className="text-gray-600 text-center w-full"
                value={editedData.location ?? userData.location}
                onChange={(e) =>
                  setEditedData({ ...editedData, location: e.target.value })
                }
              />
            ) : (
              <span className="text-gray-600">{userData.location}</span>
            )}
          </div>
        </div>
        {isOwnProfile ? (
          isEditing ? (
            <button
              className="w-full bg-primary text-white py-4 px-5 rounded-full hover:bg-primary/80 transition duration-300"
              onClick={handelSave}
            >
              Save Profile
            </button>
          ) : (
            <button
              className="w-full bg-primary text-white py-3 px-5 rounded-full hover:bg-primary/80 transition duration-300"
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </button>
          )
        ) : (
          <div className="flex justify-center">{renderConnectionButton()}</div>
        )}
      </div>
    </div>
  );
};

export default ProfileHeader;
