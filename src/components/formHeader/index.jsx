import React from "react";

const FormHeader = (props) => {
  return (
    <div className="font-manrope text-lg font-extrabold  text-font-primary">
      {props.title}
    </div>
  );
};

export default FormHeader;
