import React, { useState, useRef } from "react";
import { notification } from "antd";
import InputBox from "../../../components/inputBox";
import Button from "../../../components/button";
import {
  deleteImage,
  imageUpload,
} from "../../createNewItem/createNewTemplate/service/template.service";
import ImgUploader from "../../../components/imgUploader";
import ImageUploaderPreview from "../../../components/imageUploaderPreview";

const Upload = () => {
  const fileInputRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [base64, setBase64] = useState(null);
  const [image, setImage] = useState("");
  const [progress, setProgress] = useState(0);

  const [dataForm, setDataForm] = useState({
    logoURL: {
      value: "",
      validation: { required: true },
      valid: false,
      touched: false,
      label: "",
      elementType: "input",
      elementConfig: {
        type: "text",
        placeholder: "Ex : https://picsum.photos/200",
      },
    },
    title: {
      value: "",
      validation: { required: true },
      valid: false,
      touched: false,
      label: "Image title",
      elementType: "input",
      elementConfig: {
        type: "text",
        placeholder: "Ex : Hotel name",
      },
    },
  });

  const [mediaType, setMediaType] = useState([
    { type: "offer", isActive: true },
    { type: "bank", isActive: false },
    { type: "client", isActive: false },
  ]);

  // ================= Validation =================
  const checkValidity = (value, rules) => {
    if (rules?.required) {
      return value && value.trim() !== "";
    }
    return true;
  };

  const inputHandleChange = (event, key) => {
    const value = event.target.value;

    setDataForm((prev) => {
      const updated = { ...prev };
      updated[key] = {
        ...updated[key],
        value,
        valid: checkValidity(value, updated[key].validation),
        touched: true,
      };
      return updated;
    });
  };

  // ================= File Handling =================
  const toBase64 = async (file) => {
    const result = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(file);
    });

    setBase64(result);
  };

  const onClickRemoveImage = async (key) => {
    setIsLoading(true);
    try {
      const res = await deleteImage(key);
      console.log("remove image", res);

      setImage("");
      if (res?.data) {
        notification.success({
          message: "Success",
          description: "Image Delete successfully",
          placement: "topRight",
          duration: 4,
        });
      }

      setIsLoading(false);
    } catch (error) {
      console.log("Error in deleting image", error);
      notification.error({
        message: "Error",
        description: "Image Delete failed",
        placement: "topRight",
        duration: 4,
      });
      setIsLoading(false);
    }
  };

  const onChangeImage = (image) => {
    console.log(image);
    try {
      if (image) {
        let file = {
          url: image.file_url,
          file_name: image.file_name,
        };

        setImage(image);
        setDataForm((prev) => ({
          ...prev,
          logoURL: {
            ...prev.logoURL,
            value: image.file_url,
          },
        }));
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  // ================= UI =================
  return (
    <div className="w-full">
      {/* Upload Button */}
      <ImgUploader
        data={{
          id: "img-upload",
          label: "Image Uploader",
          accept: "image/png, image/jpeg, image/gif",
          description: "PNG, JPG, GIF up to 10MB",
          isLoading: isLoading,
          imgUrl: image?.url,
          progress: progress,
        }}
        onChange={onChangeImage}
      />
      {/* Uploaded Preview */}
      {!isImageUploading && dataForm.logoURL.value && (
        <div className="mt-5 flex flex-col gap-3">
          <ImageUploaderPreview
            data={{
              size: "w-auto h-[127px] rounded-16px mt-3 object-cover",
              isActive: !isLoading ? "bg-bg_4 text-font-hover" : "",
              imgUrl: image?.file_url,
              name:
                image?.filename?.length > 20
                  ? `${image?.filename.substring(
                      0,
                      5,
                    )}...${image?.filename.substring(
                      image?.filename.lastIndexOf(".") - 5,
                    )}`
                  : image?.filename,
              fileSize: (image?.size / 1000000).toFixed(2) + "MB",
              isLoading: isLoading,
            }}
            onClickRemove={() => {
              setIsLoading(true);

              onClickRemoveImage(image?.data?.file_name, "image");

              setIsLoading(false);
            }}
          />

          <div className="text-sm">
            <label className="font-semibold block">URL</label>
            <div className="bg-gray-50 p-2 rounded text-xs break-all">
              {dataForm.logoURL.value}
            </div>
          </div>
        </div>
      )}
      {/* Submit Button */}
      <div className="mt-6">
        <Button
          isLoading={isLoading || isImageUploading}
          content="Done"
          className={
            image?.url
              ? "text-white bg-black"
              : "bg-border-deafult text-disable hover:bg-border-deafult hover:text-disable cursor-default"
          }
          isActive={
            image?.url
              ? "text-white bg-black"
              : "bg-border-deafult text-disable hover:bg-border-deafult hover:text-disable cursor-default"
          }
        />
      </div>
    </div>
  );
};

export default Upload;
