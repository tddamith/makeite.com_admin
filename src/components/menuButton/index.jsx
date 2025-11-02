import React from "react";

const MenuButtonCard = (props) => {
  return (
    <div
      className="flex flex-row items-center h-[42px] rounded-sm font-manrope cursor-pointer text-disable text-md gap-2 font-bold p-2 hover:text-primary hover:bg-hover active:text-primary active:bg-hover "
      type={props.type}
      onClick={props.onClick}
    >
      <div className="">{props.icon}</div>
      <div className="cursor-pointer">{props.content}</div>
    </div>
  );
};

export default MenuButtonCard;
