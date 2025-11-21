import React, { useState } from "react";

const TemplateTypeSwitch = ({ value, onChange }) => {
  const [isPaid, setIsPaid] = useState(value);

  return (
    <div className="flex items-center justify-between w-full rounded-lg p-3 font-manrope ">
      <div>
        <h3 className="text-md font-medium text-gray-900">Template type</h3>
        <p className={`text-md  text-disable `}>{value ? "Paid " : "Free"}</p>
      </div>

      {/* Switch Button */}
      <button
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300   ${
          value ? "bg-bg_1" : "bg-disable_3"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
            value ? "translate-x-6 " : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
};

export default TemplateTypeSwitch;
