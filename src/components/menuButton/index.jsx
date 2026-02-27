import React, { useEffect } from "react";
import { useState } from "react";
import { withRouter } from "react-router-dom/cjs/react-router-dom";

const MenuButtonCard = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    if (props.children) {
      setIsOpen(!isOpen);
    } else {
      setIsOpen(false);
    }

    if (props.onClick) {
      setIsOpen(false);
      props.onClick();
    }
  };

  useEffect(() => {
    if (!props.isActive) {
      setIsOpen(false);
    }
  }, [props.isActive]);

  return (
    <>
      <div className="flex flex-col w-full">
        <div
          className={`flex flex-row items-center h-[42px] rounded-sm font-manrope cursor-pointer text-disable text-md gap-2 font-bold p-2 hover:text-primary hover:bg-hover active:text-primary active:bg-hover ${
            props.isActive
              ? "text-primary bg-hover"
              : isOpen
                ? "text-primary/80 bg-hover rounded-t-sm"
                : "text-disable bg-transparent"
          } `}
          type={props.type}
          // onClick={props.onClick}
          onClick={handleClick}
        >
          <div className="">{props.icon}</div>
          <div className="cursor-pointer">{props.content}</div>
        </div>
        {/* Sub Menu */}
        {isOpen && (
          <>
            {props.children && (
              <div className="flex flex-col mt-[-10px] gap-1 text-primary/80 bg-hover/50 rounded-b-sm ">
                {props.children}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default withRouter(MenuButtonCard);
