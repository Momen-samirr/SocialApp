// eslint-disable-next-line no-unused-vars
import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../lib/axios";
import { Link } from "react-router-dom";
import { Bell, Home, LogOut, User, Users } from "lucide-react";

const Navbar = () => {
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const queryClient = useQueryClient();

  const { data: notifications } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => axiosInstance.get("/notifications"),
    enabled: !!authUser,
  });

  console.log("notifications", notifications);

  const { data: connectionRequests } = useQuery({
    queryKey: ["connectionRequests"],
    queryFn: () => axiosInstance.get("/connections/requests"),
    enabled: !!authUser,
  });

  const { mutate: logOut } = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.post("/auth/logout");
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
  });

  const unreadNotifications = notifications?.data.filter(
    (notification) => !notification.read
  ).length;

  const unreadConnectionRequests = connectionRequests?.data.length;
  return (
    <div className="bg-secondary shadow-md sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          <div className="flex items-center space-x-4">
            <Link to={"/"}>
              <img className="h-8 rounded" src="/mo2.png" alt="Logo" />
            </Link>
          </div>
          <div className="flex items-center gap-2 md:gap-6">
            {authUser ? (
              <>
                <Link
                  to={"/"}
                  className="flex flex-col items-center text-neutral"
                >
                  <Home size={20} />
                  <span className="text-xs hidden md:block">Home</span>
                </Link>
                <Link
                  to={"/network"}
                  className="flex flex-col items-center text-neutral relative"
                >
                  <Users size={20} />
                  <span className="text-xs hidden md:block">Connections</span>
                  {unreadConnectionRequests > 0 && (
                    <span
                      className="absolute -top-1 -right-1 md:right-4 bg-blue-500 text-white text-xs 
										rounded-full size-3 md:size-4 flex items-center justify-center"
                    >
                      {unreadConnectionRequests}
                    </span>
                  )}
                </Link>
                <Link
                  to={"/notifications"}
                  className="flex flex-col items-center text-neutral relative"
                >
                  <Bell size={20} />
                  <span className="text-xs hidden md:block">Notifications</span>
                  {unreadNotifications > 0 && (
                    <span className="absolute -top-1 -right-1 md:right-4 bg-blue-500 text-white text-xs rounded-full size-3 md:size-4 flex items-center justify-center">
                      {unreadNotifications}
                    </span>
                  )}
                </Link>
                <Link
                  to={`/profile/${authUser.userName}`}
                  className="flex flex-col items-center text-neutral"
                >
                  <User size={20} />
                  <span className="text-xs hidden md:block">Me</span>
                </Link>
                <button
                  className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-800"
                  onClick={() => logOut()}
                >
                  <LogOut size={20} />
                  <span className="text-xs hidden md:block">Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to={"/signup"} className="btn btn-ghost">
                  Sign Up
                </Link>
                <Link to={"/login"} className="btn btn-primary text-white">
                  Join now
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
