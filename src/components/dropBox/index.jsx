import React from "react";
import { Select } from "antd";
import { AddIcon } from "../../config/icon";

const Option = Select;

const DropBox = ({ data, onChange }) => {
  let inputElement = null;

  inputElement = (
    <>
      <Select
        className={`font-manrope p-[-50px] text-md text-disable ${data?.size} `}
        placeholder={data?.placeholder}
        loading={data?.loading}
        defaultValue={data?.defaultValue}
        onChange={onChange}
        disabled={data?.disabled}
      >
        {data &&
          data?.elementConfig &&
          data?.elementConfig.options.map((option) => (
            <Option key={option?.value} value={option.value}>
              {option?.displayValue}
            </Option>
          ))}
      </Select>
    </>
  );

  return (
    <div
      className={` flex flex-col relative overflow-hidden font-manrope text-md font-medium ${data?.mainLayerStyles}`}
    >
      {data?.label && (
        <div className={`mb-2 text-font-default`}>
          {data?.label}
          {data?.iconName && (
            <span className={"text-font-default ml-2 text-[12px] "}>
              {AddIcon(data?.iconName)}
            </span>
          )}
          {data?.isRequired && <b>*</b>}
        </div>
      )}
      <>{inputElement}</>
    </div>
  );
};

export default DropBox;
