import React, { useEffect, useState } from "react";
import Button from "../button";

const InputBox = ({ onChange, data, isLoading, onClickAdd }) => {
  const [passwordShown, setPasswordShown] = useState(false);
  const [passwordLength, setPasswordLength] = useState(false);
  const [hasNumber, setHasNumber] = useState(false);
  const [upperCase, setUpperCase] = useState(false);
  const [lowerCase, setLowerCase] = useState(false);
  const password = data.value;
  const [cursor, setCursor] = useState();

  useEffect(() => {
    const numbers = /[0-9]/g;
    const upperCase = /[A-Z]/g;
    const lowerCase = /[a-z]/g;
    setPasswordLength(String(password).length >= 8 ? true : false);
    setHasNumber(numbers.test(password) ? true : false);
    setUpperCase(upperCase.test(password) ? true : false);
    setLowerCase(lowerCase.test(password) ? true : false);
  }, [password]);

  const handleChange = (e) => {
    setCursor(e.target.selectionStart);
    onChange && onChange(e);
  };

  let inputElement = null;
  inputElement = (
    <>
      <form autoComplete="off">
        <input
          className={`w-full px-4 py-2 rounded-x_sm border-x_sm border-border-secondary bg-white text-md text-black font-manrope hover:outline-1 hover:outline-font-primary focus:outline-1 focus:outline-font-primary ${
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
          {...(data.isPassword && {
            ...(data.elementConfig.type = passwordShown ? "text" : "password"),
          })}
          onChange={onChange && handleChange}
        />
      </form>
      {data.btnName && (
        <div className="absolute mt-[-38px] ml-[12.6%] ">
          <Button
            className="flex flex-col bg-white text-font-primary px-4 py-[5px] border border-disable_3"
            content={data.btnName}
            isLoading={isLoading}
            onClick={onClickAdd}
          />
        </div>
      )}
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
      <div className="w-full ">{inputElement}</div>
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
