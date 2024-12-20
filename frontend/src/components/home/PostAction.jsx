// eslint-disable-next-line no-unused-vars
import React from "react";

const PostAction = ({ icon, text, onClick }) => {
  return (
    <button className="flex items-center hover:text-gray-800" onClick={onClick}>
      <span className="mr-1">{icon}</span>
      <span className="hidden sm:inline">{text}</span>
    </button>
  );
};

export default PostAction;
