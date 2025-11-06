import { data } from "autoprefixer";
import React, { useState } from "react";
import { withRouter } from "react-router-dom/cjs/react-router-dom";
import {
  createNewTemplate,
  jobProgress,
  zipUpload,
} from "../../containers/createNewItem/createNewTemplate/service/template.service";

import { notification, Progress } from "antd";
import { Store } from "react-notifications-component";

const Uploader = ({ data, onChange }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const onChangeZip = async (e) => {
    try {
      setIsLoading(true);
      e.preventDefault();

      const files = e.dataTransfer ? e.dataTransfer.files : e.target.files;

      if (!files || files.length === 0) {
        console.warn("No files selected.");
        setIsLoading(false);
        return;
      }

      const selectedFile = files[0];
      const MAX_FILE_SIZE = (data.fileSize || 20) * 1024 * 1024; // default 20MB

      if (
        data?.accept &&
        !selectedFile.type.match(/zip|compressed|x-zip-compressed|octet-stream/)
      ) {
        alert("Please upload a valid ZIP file.");
        setIsLoading(false);
        return;
      }

      if (selectedFile.size > MAX_FILE_SIZE) {
        alert(`File size exceeds the ${data.fileSize || 20}MB limit.`);
        setIsLoading(false);
        return;
      }

      const reader = new FileReader();
      reader.onload = async () => {
        try {
          // const response = await createNewTemplate({
          //   template_name: data.template_name,
          //   category_id: data.category,
          //   sub_category_id: data.subCategory,
          //   base64_data: reader?.result,
          //   filename: selectedFile.name,
          //   type: data.type,
          // });
          // console.log("response", response);

          // if (response?.data?.data) {
          //   const jobId = response?.data?.data?.job_id;
          //   if (!jobId) return;

          //   const interval = setInterval(async () => {
          //     const progressResponse = await jobProgress(jobId);
          //     console.log(progressResponse);
          //     setProgress(0);
          //     const percentage = progressResponse.data?.progress || 0;

          //     setProgress(percentage);

          //     if (percentage >= 100) {
          //       clearInterval(interval);
          //       setIsLoading(false);
          //       onChange && onChange(response?.data?.data);
          //       Store.addNotification({
          //         title: "Success",
          //         message: "ZIP file uploaded and template create successfully",
          //         type: "success",
          //         container: "top-right",
          //         dismiss: { duration: 2000, onScreen: true },
          //       });
          //     }
          //   }, 1000);

          //   console.log("Success");
          // } else {
          //   throw new Error("Upload failed");
          // }
          onChange &&
            onChange({
              base64_data: reader?.result,
              filename: selectedFile.name,
            });
          console.log({
            base64_data: reader?.result,
            filename: selectedFile.name,
          });
          console.log({ reader });

          setIsLoading(false);
        } catch (error) {
          console.error("Upload error:", error);
          Store.addNotification({
            title: "Error",
            message: "ZIP upload failed",
            type: "danger",
            container: "top-right",
            dismiss: { duration: 2000, onScreen: true },
          });
          notification.error({
            message: "Error",
            description: error,
          });
          console.log(error);
        }
      };

      reader.readAsDataURL(selectedFile); // base64 encode
    } catch (error) {
      console.error("Error uploading ZIP:", error);
      setIsLoading(false);
    }
  };

  return (
    <>
      <h2 className="text-md font-medium text-font-default font-manrope mb-2px">
        {data?.label}
      </h2>

      <div
        className="flex flex-col justify-center align-center rounded-x_sm border-dashed border-border-deafult border-x_sm p-42px font-manrope"
        onDrop={onChangeZip}
        onDragOver={(e) => e.preventDefault()}
      >
        {!isLoading && (
          <label className="flex flex-col items-center justify-center cursor-pointer text-font-default">
            <p className="text-sm">
              <span className="text-primary hover:underline font-medium">
                Upload a ZIP file
              </span>{" "}
              or drag and drop
            </p>
            <p className="text-sm mt-1 text-font-default">
              {data?.description || "Only .zip files are allowed"}
            </p>

            <input
              id={data?.id}
              type="file"
              className="hidden"
              accept=".zip,application/zip,application/x-zip-compressed"
              onChange={onChangeZip}
            />
          </label>
        )}
        {/* 
        {isLoading && (
          <>
            <div
              className="flex flex-col justify-center items-center mt-3"
              style={{ width: "auto" }}
            >
              <Progress
                percent={progress}
                showInfo={false}
                strokeColor="#BE17FA"
                trailColor="#e7a9fd"
              />
              <span className="mt-2">{progress}%</span>
            </div>
          </>
        )} */}
        {isLoading && (
          <div className="flex items-center justify-center">
            <svg
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
            </svg>
            <span className="ml-2 text-sm text-gray-500">Loading...</span>
          </div>
        )}
      </div>
    </>
  );
};

export default withRouter(Uploader);
