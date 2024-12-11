// eslint-disable-next-line no-unused-vars
import React from "react";

const ConnectionCard = ({ connection, isConnection }) => {
  return (
    <div className="card glass w-96 shadow-xl sm:mx-auto ">
      <figure>
        <img
          src={connection.profilePicure || "/avatar.png"}
          alt={connection.name}
          className="w-25 h-25 rounded-full"
        />
      </figure>
      <div className="card-body items-center text-center">
        <h2 className="card-title">{connection.name}</h2>
        <p className="text-info text-xs">{connection.headLine}</p>
        <div className="card-actions justify-end">
          <button className="btn btn-primary">
            {isConnection ? "Connected" : "Connect"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConnectionCard;
