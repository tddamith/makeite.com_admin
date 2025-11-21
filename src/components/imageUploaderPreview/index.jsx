import { Popconfirm, Progress } from "antd";
import React, { useEffect, useState } from "react";
import { AddIcon } from "../../config/icon";

const ImageUploaderPreview = ({ data, onClickRemove }) => {
  const [imageURL, setImageURL] = useState("");

  let inputElement = null;

  useEffect(() => {
    setImageURL("");
  }, []);

  const onClickCancel = (e) => {
    console.log(e);
    // message.error("");
  };
  return (
    <div className="flex flex-row w-full  justify-between items-center">
      <div className="flex flex-row gap-4">
        {data?.imgUrl && (
          <img
            className={`w-[48px] h-[48px] relative overflow-hidden object-cover rounded-md`}
            src={data?.imgUrl}
            alt="Image Preview"
          />
        )}
        {(!data?.imgUrl || data?.imgUrl === "") && (
          <div className="flex w-[48px] h-[48px] rounded-xl bg-secondary text-sm_md text-primary items-center justify-center">
            {AddIcon("folder")}
          </div>
        )}
        <div className="flex flex-col font-manrope justify-center">
          <div className="font-normal text-md">{data?.name}</div>
          <div className="font-normal text-[10px] text-font-secondary mb-[-5px]">
            {data?.fileSize}
          </div>
          {data?.isLoading && data?.progress > 0 && (
            <Progress
              percent={data?.progress}
              showInfo={false}
              strokeColor="#BE17FA"
              trailColor="#e7a9fd"
            />
          )}
        </div>
      </div>

      <Popconfirm
        placement="topLeft"
        title="Delete the image"
        description="Are you sure to delete this Image?"
        onConfirm={onClickRemove}
        onCancel={onClickCancel}
        okText="Yes"
        cancelText="No"
      >
        <span
          className={`flex w-9 h-9 justify-center items-center rounded-[10px] font-bold text-md text-black  cursor-pointer hover:bg-bg_4 hover:text-font-hover active:bg-bg_5 active:text-font-hover focus:bg-bg_5 focus:text-font-hover`}
          //   isActive={data?.isLoading ? "bg-bg_5" : "bg-bg_4 text-font-hover"}
        >
          {" "}
          {AddIcon("bin")}
        </span>{" "}
      </Popconfirm>
    </div>
  );
};

export default ImageUploaderPreview;
