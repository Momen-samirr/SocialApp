// eslint-disable-next-line no-unused-vars
import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";
import ProfileHeader from "../components/ProfileHeader";

const ProfilePage = () => {
  const { data: authUser, isLoading: authUserLoading } = useQuery({
    queryKey: ["authUser"],
  });
  const { userName } = useParams();
  const queryClient = useQueryClient();

  const { data: userProfile, isLoading: userProfileLoading } = useQuery({
    queryKey: ["userProfile", userName],
    queryFn: async () => await axiosInstance.get(`/users/${userName}`),
  });

  const { mutate: updateProfile } = useMutation({
    mutationFn: async (updatedData) =>
      await axiosInstance.put(`/users/profile`, updatedData),
    onSuccess: () => {
      toast.success("Profile updated successfully");
      queryClient.invalidateQueries(["userProfile", userName]);
    },
  });

  if (authUserLoading || userProfileLoading) return null;

  const isOwnProfile =
    authUser?.data?.userName === userProfile?.data?.data?.userName;
  const userData = isOwnProfile ? authUser?.data : userProfile?.data?.data;

  console.log("isOwnProfile", isOwnProfile);

  console.log("userData", userData);

  const handelSave = (updatedData) => {
    updateProfile(updatedData);
  };

  return (
    <div className="max-w-4xl mx-auto p-5">
      <ProfileHeader
        isOwnProfile={isOwnProfile}
        userData={userData}
        onSave={handelSave}
      />
    </div>
  );
};

export default ProfilePage;
