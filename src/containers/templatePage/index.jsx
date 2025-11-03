import React, { useState } from "react";
import { Form } from "react-router-dom";
import FormHeader from "../../components/formHeader";
import ToggleButton from "../../components/toggleButton";
import InputBox from "../../components/inputBox";
import CreateNewTemplate from "../createNewItem/createNewTemplate";

const Template = () => {
  const [selectedOption, setSelectedOption] = useState("Create new");

  const handleToggle = (selected) => {
    setSelectedOption(selected);
  };

  return (
    <div className="flex flex-col">
      <div className="p-6 border-b border-boder-secondary flex flex-row align-center justify-between">
        <FormHeader title="Templates" />

        <div className="flex justify-center w-full">
          <ToggleButton
            options={["Create new", "View all"]}
            defaultActive={0}
            activeColor="bg-black text-white shadow"
            inactiveColor="text-black"
            onChange={handleToggle}
          />
        </div>
      </div>

      <div className="mt-8 justify-center flex ml-16">
        {selectedOption === "Create new" ? (
          <CreateNewTemplate />
        ) : (
          <div className="text-gray-400">No Details Available.</div>
        )}
      </div>
    </div>
  );
};

export default Template;
