import React from "react";

const LogOutButton = ({ onClick }) => {
  return (
    <div
      className="font-manrope font-bold text-md text-primary underline cursor-pointer "
      onClick={onClick}
    >
      Log Out
    </div>
  );
};

export default LogOutButton;
