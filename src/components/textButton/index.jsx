import React from "react";

const TextButton = ({ data, onClick }) => {
  return (
    <div
      className={`cursor-pointer text-font-default underline hover:text-primary font-manrope font-bold text-md
    `}
      onClick={onClick}
    >
      {data.name}
    </div>
  );
};

export default TextButton;
