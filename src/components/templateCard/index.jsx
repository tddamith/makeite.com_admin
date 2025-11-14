import React from "react";

const TemplateCard = ({ data, onClick }) => {
  return (
    <div className="flex flex-row w-full h-full rounded-sm" onClick={onClick}>
      <img
        src={data.image}
        alt="Template"
        className="w-[207px] h-[302px] rounded-sm object-cover cursor-pointer"
      />
    </div>
  );
};

export default TemplateCard;
