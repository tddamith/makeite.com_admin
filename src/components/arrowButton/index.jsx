import React from "react";
import { AddIcon } from "../../config/icon";

const ArrowButton = ({ onClick }) => {
  return (
    <div
      className="flex w-10 h-10 rounded-full border-x_sm border-disable_2 cursor-pointer items-center justify-center text-black text-md hover:border-primary hover:text-primary"
      onClick={onClick}
    >
      {AddIcon("arrow-left")}
    </div>
  );
};

export default ArrowButton;
