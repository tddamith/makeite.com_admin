import React, { useState } from "react";

const TemplateTypeSwitch = () => {
  const [isPaid, setIsPaid] = useState(false);

  return (
    <div className="flex items-center justify-between  rounded-lg p-3 font-manrope ">
      <div>
        <h3 className="text-md font-medium text-gray-900">Template type</h3>
        <p className={`text-md  text-disable `}>{isPaid ? "Paid" : "Free"}</p>
      </div>

      {/* Switch Button */}
      <button
        onClick={() => setIsPaid(!isPaid)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 bg-disable_3 `}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
            isPaid ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
};

export default TemplateTypeSwitch;
