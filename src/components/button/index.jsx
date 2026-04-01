import React from "react";

const Button = (props) => {
  return (
    <button
      className={`flex flex-row items-center justify-center w-full rounded-sm font-manrope gap-2 font-bold p-3  ${props.className} ${props.isActive} ${props.disabled ? "cursor-not-allowed hover:bg-border-deafult hover:text-disable" : "cursor-pointer text-md hover:text-white hover:bg-bg_1 "} `}
      type={props.type}
      disabled={props.disabled}
      onClick={props.onClick}
    >
      {!props.isLoading && (
        <>
          <>{props.icon}</>
          <>{props.content}</>{" "}
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
    </button>
  );
};

export default Button;
