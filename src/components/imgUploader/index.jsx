import { data } from "autoprefixer";
import React, { useRef, useState } from "react";
import { withRouter } from "react-router-dom/cjs/react-router-dom";
import { imageUpload } from "../../containers/createNewItem/createNewTemplate/service/template.service";
import { notification } from "antd";
import ImageUploaderPreview from "../imageUploaderPreview";

const ImgUploader = ({ data, onChange, onClickRemove }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const progressRef = useRef(null);

  const startProgress = () => {
    setUploadProgress(0);

    progressRef.current = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 95) return prev; // stop early, last 5% only after upload success

        const next = prev + Math.random() * 10 + 5; // smooth increments
        return next > 95 ? 95 : Math.round(next);
      });
    }, 400);
  };

  const finishProgress = () => {
    clearInterval(progressRef.current);
    setUploadProgress(100);
  };

  const stopProgress = () => {
    clearInterval(progressRef.current);
    setUploadProgress(0);
  };

  const onChangeImage = async (e) => {
    try {
      setIsLoading(true);
      startProgress();

      console.log("Image Upload Event:", e);
      e.preventDefault();
      // Get files from either drag-and-drop or file input
      let files = e.dataTransfer ? e.dataTransfer.files : e.target.files;

      // Check if files exist and have length
      if (!files || files.length === 0) {
        console.warn("No files selected.");
        stopProgress();
        setIsLoading(false);
        return;
      }

      // Get the first file from the FileList
      const selectedFile = files[0];

      const MAX_FILE_SIZE = data.fileSize * 1024 * 1024;
      const MAX_WIDTH = data.width + 200;
      const MAX_HEIGHT = data.height + 200;
      if (data.fileSize && selectedFile.size > MAX_FILE_SIZE) {
        alert("File size exceeds limit.");
        stopProgress();
        setIsLoading(false);
        return;
      }

      const reader = new FileReader();

      reader.onload = async () => {
        console.log("base64", reader.result);
        const img = new Image();
        img.onload = async () => {
          try {
            console.log("image", selectedFile);

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
            finishProgress();

            setTimeout(() => {
              if (response?.data) {
                onChange({
                  ...response?.data,
                  filename: selectedFile?.name,
                  size: selectedFile?.size,
                });
                notification.success({
                  message: "Success",
                  description: "Image uploaded successfully",
                  placement: "topRight",
                });
              } else {
                notification.error({
                  message: "Error",
                  description: "Image upload failed",
                  placement: "topRight",
                });
              }

              setIsLoading(false);
              stopProgress();
            }, 600);
          } catch (err) {
            stopProgress();
            setIsLoading(false);
            notification.error({
              message: "Error",
              description: "Upload failed",
            });
          }
        };

        img.onerror = () => {
          stopProgress();
          setIsLoading(false);
          alert("Invalid image file.");
        };

        img.src = reader.result;
      };

      reader.readAsDataURL(selectedFile);
    } catch (err) {
      stopProgress();
      setIsLoading(false);
      console.error(err);
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
        {!isLoading && (
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
            <p className="text-sm mt-1 text-font-default">
              {data?.description}
            </p>
            <input
              id={data?.id}
              type="file"
              className="hidden"
              accept={data?.accept} /*img/zip/pdf*/
              onChange={onChangeImage}
            />
          </label>
        )}

        {isLoading && (
          <ImageUploaderPreview
            data={{
              size: "w-auto  rounded-16px  object-cover",
              isActive: !isLoading ? "bg-bg_4 text-font-hover" : "",
              imgUrl: data?.imgUrl,
              name: "Image Name",
              fileSize: "400KB",
              isLoading: isLoading,
              progress: uploadProgress,
            }}
            onClickRemove={onClickRemove}
          />
        )}
      </div>
    </>
  );
};

export default withRouter(ImgUploader);
