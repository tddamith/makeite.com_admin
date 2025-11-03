import React from "react";

const Logo = () => {
  return (
    <div className="flex flex-col ">
      <img
        src={require("../../assets/img/makeite.png")}
        alt="Logo"
        className="w-32 h-full object-cover"
      />
      <div className="font-manrope font-bold text-sm text-font-primary mt-[10px]">
        Create Smart. Make It Easy
      </div>
    </div>
  );
};

export default Logo;
