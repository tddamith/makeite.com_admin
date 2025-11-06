import React, { useEffect, useState } from "react";
import { Popconfirm } from "antd";
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
      <div
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
          alt=""
        />
      </div>
    </>
  );
  return <>{inputElement}</>;
};

export default ImageComponent;
