// eslint-disable-next-line no-unused-vars
import React from "react";
import { Bell, Home, UserPlusIcon } from "lucide-react";
import { Link } from "react-router-dom";

const Sidebar = ({ user }) => {
  return (
    <div className="bg-secondary rounded-lg shadow">
      <div className="p-4 text-center">
        <div
          className="h-16 rounded-t-lg bg-cover bg-center"
          style={{
            backgroundImage: `url("${user.bannerImg || "/banner.png"}")`,
          }}
        />
        <Link to={`/profile/${user?.data?.userName}`}>
          <img
            src={user?.data?.profilePicure || "/avatar.png"}
            alt={user?.data?.name}
            className="w-20 h-20 rounded-full mx-auto mt-[-40px]"
          />
          <h2 className="text-xl font-semibold mt-2">{user?.data?.name}</h2>
        </Link>
        <p className="text-info">{user?.data?.headLine}</p>
        <p className="text-info">
          {user?.data?.connections?.length} Connections
        </p>
      </div>
      <div className="border-t border-base-100 p-4">
        <nav>
          <ul className="space-y-2">
            <li>
              <Link
                to={"/"}
                className="flex items-center py-2 px-4 rounded-md hover:bg-primary hover:text-white transition-colors "
              >
                <Home className="mr-2" size={20} />
                Home
              </Link>
            </li>
            <li>
              <Link
                to={"/network"}
                className="flex items-center py-2 px-4 rounded-md hover:bg-primary hover:text-white transition-colors"
              >
                <UserPlusIcon className="mr-2" size={20} />
                Connections
              </Link>
            </li>
            <li>
              <Link
                to={"/notifications"}
                className="flex items-center py-2 px-4 rounded-md hover:bg-primary hover:text-white transition-colors"
              >
                <Bell className="mr-2" size={20} />
                Notifications
              </Link>
            </li>
          </ul>
        </nav>
        <div className="border-t border-base-100 p-4">
          <Link
            to={`/profile/${user?.data?.userName}`}
            className="text-sm font-semibold"
          >
            View Profile
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
