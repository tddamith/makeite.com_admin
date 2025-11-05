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
          className={` w-full p-1 rounded-x_sm border-x_sm border-border-secondary bg-white text-md text-black font-manrope ${
            data?.size
          } 
            ${
              data?.validation?.required && data?.touched && !data.value
                ? "border-red-600 border-2 "
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
      {/*---- error goes here -----*/}
      {data && data.validation && data.validation.required && data.touched && (
        <>
          {/*---- filed is required -----*/}
          {data.validation.required && !data.value && (
            <div className="font-manrope text-sm text-red-600 mt-1 animate__animated animate__fadeIn">
              You can't keep this as empty
            </div>
          )}

          {/*----  invalid data-----*/}
          {data.value && data.invalidReason && (
            <div className="font-manrope text-sm text-red-600 mt-1 animate__animated animate__fadeIn">
              {data.invalidReason}
            </div>
          )}

          {/*----  invalid data-----*/}
          {data.touched && !data.isValid && (
            <div className="font-manrope text-sm text-red-600 mt-1">
              {data.invalidReason}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default InputBox;
