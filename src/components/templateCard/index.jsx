import React, { useState } from "react";
import Button from "../button";
import Tag from "../tag";

const TemplateCard = ({ data, onClick }) => {
  const [isLoading, setIsLoading] = useState(false);
  return (
    <div
      className="relative overflow-hidden  group rounded-sm  hover:outline p-2 hover:outline-4 hover:outline-primary  cursor-pointer transition hover:scale-102 "
      onClick={onClick}
    >
      <img
        src={data.image}
        alt="Template"
        className="w-full h-full rounded-sm object-cover cursor-pointer transition 
          duration-300
          hover:blur-md
           "
      />

      <div
        className="
          absolute inset-0 
          bg-white/20 
          opacity-0
          group-hover:opacity-100
          transition
          duration-300
          flex
          flex-col
          justify-between
          items-center
          text-white
          backdrop-blur-sm
          p-3
        "
      >
        <div className="flex flex-col gap-7 ">
          <div className="flex ml-52">
            <Tag
              data={{
                name: data?.tag,
              }}
            />
          </div>

          <div className="flex flex-col gap-2 font-manrope font-bold text-center ">
            <div className="text-md  text-font-default">
              {data?.name || "Template Name"}
            </div>
            <div className="text-sm text-font-secondary">
              {data?.category + ">" + data.subCategory}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 w-full">
          <Button
            content="DELETE"
            className={"text-white bg-black "}
            isActive={"text-white bg-black"}
            isLoading={isLoading}
            // onClick={async (e) => {
            //   e.preventDefault();

            // }}
          />
          <Button
            content="EDIT"
            className={"text-black bg-transparent border-black border-[1px]"}
            isActive={"text-white bg-transparent border-black border-[1px] "}
            isLoading={isLoading}
            // onClick={async (e) => {
            //   e.preventDefault();

            // }}
          />
        </div>
      </div>
    </div>
  );
};

export default TemplateCard;
