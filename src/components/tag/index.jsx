import React from "react";

const Tag = ({ data }) => {
  return (
    <div className="flex font-manrope p-3 rounded-sm bg-hover h-8 text-font-default items-center justify-center font-medium">
      <div className="text-md">{data.name}</div>
    </div>
  );
};

export default Tag;
