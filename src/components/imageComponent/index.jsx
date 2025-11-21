import React, { useEffect, useState } from "react";
import { Popconfirm, Progress } from "antd";
import { AddIcon } from "../../config/icon";

const ImageComponent = ({ data, onClickRemove }) => {
  const [imageURL, setImageURL] = useState("");
  let inputElement = null;

  useEffect(() => {
    setImageURL("");
  }, []);

  //remove Image
  // const onClickRemove = async (key) => {
  //   // try {
  //   //   const RemoveImage = await deleteImage({ file_name: file_name });
  //   //   console.log("remove image", RemoveImage);
  //   //   if (RemoveImage.data.status) {
  //   //     console.log("Image Deleted");
  //   //     setImageURL("");
  //   //     message.success("Image Deleted");
  //   //   } else {
  //   //     console.log("Deleted Fail");
  //   //   }
  //   // } catch (error) {
  //   //   console.log("Error in deleting image", error);
  //   //   message.error("Error in deleting image");
  //   // }
  //   setImageURL("");
  // };

  const onClickCancel = (e) => {
    console.log(e);
    // message.error("");
  };

  inputElement = (
    <>
      {/* <div
        className={`w-auto h-auto  ${data.size} ${
          !data?.imgUrl ? "default" : ""
        }`}
      >
        {!data.nonRemove && (
          <Popconfirm
            placement="topLeft"
            title="Delete the image"
            description="Are you sure to delete this Image?"
            onConfirm={onClickRemove}
            onCancel={onClickCancel}
            okText="Yes"
            cancelText="No"
          >
            <span className="flex w-6 h-6 justify-center items-center rounded-[50px] border-2 border-border-primary font-bold text-sm text-white bg-black/40 cursor-pointer absolute z-[40] ml-1 mt-1">
              {" "}
              {AddIcon("cross")}
            </span>{" "}
          </Popconfirm>
        )}

        <img
          className={`w-full h-full relative overflow-hidden object-cover `}
          src={data?.imgUrl}
          alt="Image Preview"
        />
      </div> */}

      <div className="flex flex-row w-full p-4 justify-between items-center">
        <div className="flex flex-row gap-4">
          <div className="flex w-[48px] h-[48px] rounded-xl bg-secondary text-sm_md text-primary items-center justify-center">
            {AddIcon("folder")}
          </div>
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
            className={`flex w-9 h-9 justify-center items-center rounded-[10px] font-bold text-md text-black  cursor-pointer hover:bg-bg_5  active:bg-bg_5`}
            //   isActive={data?.isLoading ? "bg-bg_5" : "bg-bg_4 text-font-hover"}
          >
            {" "}
            {AddIcon("bin")}
          </span>{" "}
        </Popconfirm>
      </div>
    </>
  );
  return <>{inputElement}</>;
};

export default ImageComponent;
