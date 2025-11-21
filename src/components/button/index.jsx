import React from "react";

const Button = (props) => {
  return (
    <div
      className={`flex flex-row items-center justify-center w-full h-[42px] rounded-sm font-manrope cursor-pointer  text-md gap-2 font-bold p-3 hover:text-white hover:bg-bg_1   ${props.className} ${props.isActive} `}
      type={props.type}
      onClick={props.onClick}
    >
      {!props.isLoading && (
        <>
          <>{props.icon}</>
          <div className="cursor-pointer ">{props.content}</div>{" "}
        </>
      )}
      {props.isLoading && (
        <div className="flex items-center justify-center">
          <svg
            className="size-5 animate-spin text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 30 30"
          >
            <circle
              className="opacity-25"
              cx="15"
              cy="15"
              r="13"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75 mt-[-55px]"
              fill="currentColor"
              d="M2 10a8 9 0 017-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>
          <span className="ml-2 text-sm text-gray-500">Loading...</span>
        </div>
      )}
    </div>
  );
};

export default Button;
