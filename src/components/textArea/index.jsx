import React from "react";

const TextArea = ({
  data,
  label,
  required = false,
  value,
  onChange,
  onClear,
  placeholder = "",
  rows = 3,
}) => {
  return (
    <div className="w-full">
      {/* Label */}
      <div className="flex flex-row justify-between">
        {data?.label && (
          <div className="flex flex-row ">
            <label className=" font-manrope  text-md font-semibold  mb-2">
              {data?.label}{" "}
              {data?.isShowRequired
                ? data?.isShowRequired && (
                    <span className="text-red-500">*</span>
                  )
                : ""}
            </label>
          </div>
        )}
      </div>

      {/* Textarea */}
      <textarea
        rows={rows}
        value={data?.value}
        onChange={onChange}
        {...data?.elementConfig}
        placeholder={data?.placeholder}
        className="
          w-full
          rounded-xl
          px-4
          py-3
          text-sm
          text-black
          bg-white
          border border-black/20
          placeholder:text-gray-400
          focus:outline-none
          focus:ring-2
          focus:ring-black
          focus:border-black
         transition-all
          resize-y
        "
      />
    </div>
  );
};

export default TextArea;
