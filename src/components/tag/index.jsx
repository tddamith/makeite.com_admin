import React from "react";
import { AddIcon } from "../../config/icon";

const Tag = ({ data, onClick }) => {
  return (
    <div
      className={`flex flex-row font-manrope px-[11px] text-md py-[5px] rounded-sm text-font-default items-center justify-center  font-medium ${data.style}`}
    >
      {data.name}
      {data.tagIcon && (
        <div className="text-md cursor-pointer ml-2" onClick={onClick}>
          {AddIcon(data.tagIcon)}
        </div>
      )}
    </div>
  );
};

export default Tag;
