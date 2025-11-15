import React from "react";

const LogOutButton = (data) => {
  return (
    <div
      className="font-manrope font-bold text-md text-primary underline cursor-pointer "
      onClick={data?.onClick}
    >
      Log Out
    </div>
  );
};

export default LogOutButton;
