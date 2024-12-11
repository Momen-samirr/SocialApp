// eslint-disable-next-line no-unused-vars
import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";
import {
  ExternalLink,
  Eye,
  Heart,
  MessageSquare,
  Trash2,
  UserPlus,
  UserRoundX,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";
import Sidebar from "../components/home/Sidebar";

const NotificationsPage = () => {
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const { data: notifications, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => axiosInstance.get("/notifications"),
  });
  const queryClient = useQueryClient();

  const { mutate: markNotificationAsRead } = useMutation({
    mutationFn: (id) => axiosInstance.put(`/notifications/${id}/markAsRead`),
    onSuccess: () => {
      toast.success("Notification marked as read");
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message);
    },
  });

  const { mutate: markAllNotificationsAsRead } = useMutation({
    mutationFn: async () =>
      await axiosInstance.put("/notifications/markAllAsRead"),
    onSuccess: () => {
      toast.success("All notifications marked as read");
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message);
    },
  });

  const { mutate: deleteNotification } = useMutation({
    mutationFn: async (id) =>
      await axiosInstance.delete(`/notifications/${id}`),
    onSuccess: () => {
      toast.success("Notification deleted");
      queryClient.invalidateQueries({ queryKey: [`notifications`] });
    },
  });

  console.log("notifications", notifications);

  const renderNotificationIcon = (type) => {
    switch (type) {
      case "like":
        return <Heart className="w-6 h-6 text-blue-500" />;
      case "comment":
        return <MessageSquare className="text-green-500" />;
      case "connectionAccepted":
        return <UserPlus className="w-6 h-6 text-purple-500" />;
      case "connectionRejected":
        return <UserRoundX className="w-6 h-6 text-red-500" />;
    }
  };

  const renderNotificationContent = (notification) => {
    switch (notification.type) {
      case "like":
        return (
          <span>
            <strong>{notification.relatedUser.name}</strong> Loved your post
          </span>
        );
      case "comment":
        return (
          <span>
            <Link
              to={`/profile/${notification.relatedUser.userName}`}
              className="font-bold"
            >
              {notification.relatedUser.name}
            </Link>{" "}
            commented on your post
          </span>
        );
      case "connectionAccepted":
        return (
          <span>
            <Link
              to={`/profile/${notification.relatedUser.userName}`}
              className="font-bold"
            >
              {notification.relatedUser.name}
            </Link>{" "}
            accepted your connection request
          </span>
        );
      case "connectionRejected":
        return (
          <span>
            <Link
              to={`/profile/${notification.relatedUser.userName}`}
              className="font-bold"
            >
              {notification.relatedUser.name}
            </Link>{" "}
            rejected your connection request
          </span>
        );
    }
  };

  const renderRelatedPost = (relatedPost) => {
    if (!relatedPost) return null;

    return (
      <Link
        to={`/post/${relatedPost._id}`}
        className="mt-2 p-2 bg-gray-50 rounded-md flex items-center space-x-2 hover:bg-gray-100 transition-colors"
      >
        {relatedPost.image && (
          <img
            src={relatedPost.image}
            alt="post preview"
            className="w-10 h-10 object-cover rounded"
          />
        )}
        <div className="flex-1 overflow-hidden">
          <p className="text-sm text-gray-600 truncate">
            {relatedPost.content}
          </p>
        </div>
        <ExternalLink size={16} className="text-gray-500" />
      </Link>
    );
  };
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="col-span-1 lg:col-span-1">
        <Sidebar user={authUser} />
      </div>
      <div className="col-span-1 lg:col-span-3">
        <div className=" bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold mb-6">Notifications</h1>
            <button
              className={`p-1 bg-blue-100 text-blue-500 hover:bg-blue-200 rounded-full transition-colors`}
              aria-label="Mark all notifications as read"
              onClick={() => markAllNotificationsAsRead()}
            >
              <Eye size={16} />
            </button>
          </div>
          {isLoading ? (
            <p>Loading...</p>
          ) : notifications.data.length > 0 ? (
            <ul>
              {notifications.data.map((notification) => (
                <li
                  key={notification._id}
                  className={`bg-white border rounded-lg p-4 my-4 transition-all hover:shadow-md ${
                    !notification.read ? "border-blue-500" : "border-gray-200"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <Link
                        to={`/profile/${notification.relatedUser.userName}`}
                      >
                        <img
                          src={
                            notification.relatedUser.profilePicure ||
                            "/avatar.png"
                          }
                          alt={notification.relatedUser.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      </Link>
                      <div>
                        <div className="flex items-center gap-2">
                          <div className="p-1 bg-gray-100 rounded-full">
                            {renderNotificationIcon(notification.type)}
                          </div>
                          <p className="text-sm">
                            {renderNotificationContent(notification)}
                          </p>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDistanceToNow(
                            new Date(notification.createdAt),
                            {
                              addSuffix: true,
                            }
                          )}
                        </p>
                        {renderRelatedPost(notification.relatedPost)}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {!notification.read && (
                        <button
                          className={`p-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transtion-colors`}
                          aria-label="Mark as read"
                          onClick={() =>
                            markNotificationAsRead(notification._id)
                          }
                        >
                          <Eye size={16} />
                        </button>
                      )}
                      <button
                        className="p-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transtion-colors"
                        aria-label="Delete Notification"
                        onClick={() => deleteNotification(notification._id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No notifications yet</p>
          )}
        </div>
      </div>
    </div>
  );
};
export default NotificationsPage;
