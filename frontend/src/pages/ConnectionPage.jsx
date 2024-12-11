// eslint-disable-next-line no-unused-vars
import React from "react";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../lib/axios";
import Sidebar from "../components/home/Sidebar";
import FriendRequest from "../components/FriendRequest";
import { UserPlus } from "lucide-react";
import ConnectionCard from "../components/ConnectionCard";

const ConnectionPage = () => {
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  const { data: requests } = useQuery({
    queryKey: ["requests"],
    queryFn: async () => await axiosInstance.get("/connections/requests"),
  });

  const { data: connections } = useQuery({
    queryKey: ["connections"],
    queryFn: async () => await axiosInstance.get("/connections"),
  });

  console.log("requests", requests);
  console.log("connections", connections?.data?.data);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="col-span-1 lg:col-span-1">
        <Sidebar user={authUser} />
      </div>
      <div className="col-span-1 lg:col-span-3">
        <div className="bg-secondary rounded-lg shadow p-6 mb-6">
          <h1 className="text-2xl font-bold mb-6">Connections</h1>
          {requests?.data?.length > 0 ? (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-3">
                Connection Requests
              </h2>
              <div className="space-y-5">
                {requests?.data?.map((request) => (
                  <FriendRequest key={request.id} request={request} />
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-6 text-center mb-6">
              <UserPlus size={48} className="mx-auto text-gray-500 mb-5" />
              <h3 className="text-xl font-semibold mb-2">No Friend Requests</h3>
              <p className="text-gray-600">
                You don&apos;t have any friend requests.
              </p>
              <p className="text-gray-600 mt-2">
                Check back later for new friend requests.
              </p>
            </div>
          )}
          {connections?.data?.data?.length > 0 ? (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-3">Your Connections</h2>
              <div className="grid grid-cols-1 text-center md:grid-cols-2 lg:grid-cols-2 gap-6">
                {connections?.data?.data?.map((connection) => (
                  <ConnectionCard
                    key={connection._id}
                    connection={connection}
                    isConnection={true}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-6 text-center mb-6">
              <UserPlus size={48} className="mx-auto text-gray-500 mb-5" />
              <h3 className="text-xl font-semibold mb-2">No Connections</h3>
              <p className="text-gray-600">
                You don&apos;t have any connections yet.
              </p>
              <p className="text-gray-600 mt-2">
                Connect with other users to expand your network.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConnectionPage;
