import { data } from "autoprefixer";
import React from "react";
import { withRouter } from "react-router-dom/cjs/react-router-dom";

const Uploader = ({ data }) => {
  return (
    <>
      <h2 className="text-md font-medium text-font-default font-manrope  mb-2px">
        {data?.label}
      </h2>

      <div className="flex flex-col justify-center align-center rounded-x_sm border-dashed border-boder-deafult border-x_sm p-42px font-manrope">
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
          />
        </label>
      </div>
    </>
  );
};

export default withRouter(Uploader);
