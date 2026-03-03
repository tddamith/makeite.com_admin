import React, { useState } from "react";
import FormHeader from "../../components/formHeader";
import ToggleButton from "../../components/toggleButton";
import MediaInfo from "./mediaInfo";
import View from "./view";
import Upload from "./upload";

const Index = (props) => {
  const [selectedOption, setSelectedOption] = useState("Upload new");

  const handleToggle = (selected) => {
    setSelectedOption(selected);
  };

  return (
    // use tailwind for this page, no need to use scss
    <div className=" w-full h-full">
      <div className="p-6 border-b border-border-primary flex flex-row align-center justify-between">
        <FormHeader title="Media" />
        <div className="flex justify-center w-full">
          <ToggleButton
            options={["Upload new", "View all"]}
            defaultActive={0}
            activeColor="bg-black text-white shadow"
            inactiveColor="text-black"
            onChange={handleToggle}
          />
        </div>
      </div>

      {selectedOption === "Upload new" ? (
        <div className="mt-8 justify-center flex mx-40">
          <Upload />
        </div>
      ) : (
        <View />
        // <div className="text-gray-400">No Details Available.</div>
      )}
    </div>
  );
};

export default Index;
