import React, { useState } from "react";

const InputBox = ({ onChange, data }) => {
  const [cursor, setCursor] = useState();

  const handleChange = (e) => {
    setCursor(e.target.selectionStart);
    onChange && onChange(e);
  };

  let inputElement = null;
  inputElement = (
    <>
      <form autoComplete="off">
        <input
          className={` w-full p-1 rounded-x_sm border-x_sm border-boder-secondary bg-white ${
            data?.size
          } 
            ${
              data?.validation?.required && data?.touched && !data.value
                ? "validation-on"
                : ""
            } `}
          disabled={data?.disabled}
          value={data?.value}
          {...data?.elementConfig}
          onChange={onChange && handleChange}
        />
      </form>
    </>
  );

  return (
    <div className={`w-full ${data?.mainLayerStyles}`}>
      {data?.label && (
        <div className="flex flex-row ">
          <label className=" font-manrope font-medium text-md text-font-default mb-2">
            {data?.label} {data?.isShowRequired ? <b>*</b> : ""}
          </label>
        </div>
      )}
      <div className="w-full">{inputElement}</div>
    </div>
  );
};

export default InputBox;
