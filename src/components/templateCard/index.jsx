import React, { useState } from "react";
import Button from "../button";
import Tag from "../tag";
import { Popconfirm } from "antd";
import Spinner from "../spinner";

const TemplateCard = ({
  data,
  onClickEdit,
  onClickCancel,
  onClickDelete,
  isLoading,
}) => {
  const [showOverlay, setShowOverlay] = useState(false);

  // const onClickCancel = (e) => {
  //   console.log(e);
  //   // message.error("");
  // };

  return (
    <div
      className="relative overflow-hidden rounded-sm p-2 transition hover:scale-102"
      onMouseEnter={() => setShowOverlay(true)}
      onMouseLeave={() => setShowOverlay(false)}
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
        className={`
      absolute inset-0 
      bg-white/20 
      transition duration-300
      backdrop-blur-sm
      flex flex-col justify-between items-center p-3
      ${showOverlay ? "opacity-100" : "opacity-0 pointer-events-none"}
    `}
      >
        {!isLoading && (
          <>
            <div className="flex flex-col gap-7  ">
              <div className="flex ml-52">
                <Tag
                  data={{
                    style: "px-[11px] py-[5px] bg-hover",
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
                onClick={onClickDelete}
              />

              {/* <Popconfirm
            placement="topLeft"
            title="Delete the image"
            description="Are you sure to delete this Image?"
            onConfirm={async (e) => {
              e.preventDefault();
              onClickEdit();
            }}
            onCancel={onClickCancel}
            okText="Yes"
            cancelText="No"
            // getPopupContainer={(trigger) =>
            //   trigger.parentElement || document.body
            // }
          >
            <Button
              content="EDIT"
              className={"text-black bg-transparent border-black border-[1px]"}
              isActive={"text-white bg-transparent border-black border-[1px] "}
              isLoading={isLoading}
              // onClick={async (e) => {
              //   e.preventDefault();
              //   onClickEdit();
              // }}
            />
          </Popconfirm> */}

              <Popconfirm
                placement="topRight"
                title="Preview Template"
                description="Do You want clear previous Preview Template?"
                onConfirm={onClickEdit}
                onCancel={onClickCancel}
                okText="Yes"
                cancelText="No"
                getPopupContainer={() => document.body}
              >
                <div onClick={(e) => e.stopPropagation()}>
                  <Button
                    content="EDIT"
                    className="text-black bg-transparent border-black border-[1px]"
                    isLoading={false}
                    onClick={() => {}} // override with empty
                  />
                </div>
              </Popconfirm>
            </div>
          </>
        )}
        {isLoading && (
          <div className="flex items-center justify-center allin-center h-full">
            {/* <svg
              className="size-5 animate-spin text-primary"
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
            </svg> */}

            <Spinner />
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplateCard;
