import { data } from "autoprefixer";
import React, { useState } from "react";
import { withRouter } from "react-router-dom/cjs/react-router-dom";
import { imageUpload } from "../../containers/createNewItem/createNewTemplate/service/template.service";
import { Store } from "react-notifications-component";
import { notification } from "antd";

const ImgUploader = ({ data, onChange }) => {
  const [isLoading, setIsLoading] = useState(false);

  const onChangeImage = async (e) => {
    try {
      setIsLoading(true);
      console.log("Image Upload Event:", e);
      e.preventDefault();
      // Get files from either drag-and-drop or file input
      let files = e.dataTransfer ? e.dataTransfer.files : e.target.files;

      // Check if files exist and have length
      if (!files || files.length === 0) {
        console.warn("No files selected.");
        return;
      }

      // Get the first file from the FileList
      const selectedFile = files[0];

      const MAX_FILE_SIZE = data.fileSize * 1024 * 1024;
      const MAX_WIDTH = data.width + 200;
      const MAX_HEIGHT = data.height + 200;

      if (data.fileSize && selectedFile?.size > MAX_FILE_SIZE) {
        alert("File size exceeds the 10MB limit.");
        return;
      }

      const reader = new FileReader();

      reader.onload = async () => {
        console.log("base64", reader.result);
        const img = new Image();
        img.onload = async () => {
          console.log("Image width:", img.width, "height:", img.height);

          // if (
          //   data.width &&
          //   data.height &&
          //   (img.width > MAX_WIDTH || img.height > MAX_HEIGHT)
          // ) {
          //   alert(
          //     `Image resolution exceeds ${MAX_WIDTH - 200}x${
          //       MAX_HEIGHT - 200
          //     }px`
          //   );
          //   return;
          // }
          const response = await imageUpload({
            name: selectedFile.name,
            filename: selectedFile.name,
            type: selectedFile.type,
            size: selectedFile.size,
            base64_data: reader.result,
            file: selectedFile,
            lastModified: selectedFile.lastModified,
            lastModifiedDate: selectedFile.lastModifiedDate,
          });
          console.log("Image Upload Response:", response);
          if (response?.data) {
            onChange(response?.data);
            Store.addNotification({
              title: "Success",
              message: "Image Upload successfully",
              type: "success",
              container: "top-right",
              dismiss: {
                duration: 2000,
                onScreen: true,
              },
            });
            // notification.success({
            //   message: "success",
            //   description: "Image uploaded  successfully",
            // });
          } else {
            Store.addNotification({
              title: "Error",
              message: "Image Upload failed",
              type: "danger",
              container: "top-right",
              dismiss: {
                duration: 2000,
                onScreen: true,
              },
            });
            notification.success({
              message: "success",
              description: "Image Upload failed",
            });
          }
          setIsLoading(false);
        };

        img.onerror = () => {
          alert("Invalid image file.");
        };

        img.src = reader.result;
      };
      reader.readAsDataURL(files[0]);
    } catch (error) {
      setIsLoading(false);
      console.error("Error uploading image:", error);
    }
  };

  return (
    <>
      <h2 className="text-md font-medium text-font-default font-manrope  mb-2px">
        {data?.label}
      </h2>

      <div
        className="flex flex-col justify-center align-center rounded-x_sm border-dashed border-border-deafult border-x_sm p-42px font-manrope"
        onDrop={onChangeImage}
        onDragOver={(e) => e.preventDefault()}
      >
        <label
          //   htmlFor="file-upload"
          className="flex flex-col items-center justify-center cursor-pointer text-font-default"
        >
          <p className="text-sm">
            <span className="text-primary hover:underline font-medium">
              Upload a file
            </span>{" "}
            or drag and drop
          </p>
          <p className="text-sm mt-1 text-font-default">{data?.description}</p>
          <input
            id={data?.id}
            type="file"
            className="hidden"
            accept={data?.accept} /*img/zip/pdf*/
            onChange={onChangeImage}
          />
        </label>
      </div>
    </>
  );
};

export default withRouter(ImgUploader);
