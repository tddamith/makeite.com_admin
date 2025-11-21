import React, { useState } from "react";
import ImageUploaderPreview from "../components/imageUploaderPreview";
import { AddIcon } from "../config/icon";
import Button from "../components/button";
import InputBox from "../components/inputBox";
import ToggleButton from "../components/toggleButton";
import TemplateTypeSwitch from "../components/switchButton";
import CategorySelectBox from "../components/categorySelectBox";
import Uploader from "../components/uploader";
import Tag from "../components/tag";
import ImageComponent from "../components/imageComponent";
import BackButton from "../components/arrowButton";
import ArrowButton from "../components/arrowButton";

const DesignGuide = () => {
  const [selectedOption, setSelectedOption] = useState("Create new");
  const [isPaid, setIsPaid] = useState(false);
  const [progress, setProgress] = useState(50);

  const handleToggle = (selected) => {
    setSelectedOption(selected);
  };

  const categorySelect = (value) => {
    console.log({ value });
  };
  return (
    <div className="flex flex-col gap-3 mt-3 p-4">
      <label className="font-manrope text-md underline">Button Active</label>
      <div className="flex flex-col w-96 gap-4">
        <Button
          content="Done"
          className={"text-white bg-black"}
          isActive={"text-white bg-black"}
        />

        <label className="font-manrope text-md underline">Button Disable</label>
        <Button
          content="Done"
          className={
            "bg-border-deafult text-disable hover:bg-border-deafult hover:text-disable cursor-default"
          }
          isActive={
            "bg-border-deafult text-disable hover:bg-border-deafult hover:text-disable cursor-default"
          }
        />
        <label className="font-manrope text-md underline">Toggle Button</label>
        <ToggleButton
          options={["Create new", "View all"]}
          defaultActive={0}
          activeColor="bg-black text-white shadow"
          inactiveColor="text-black"
          onChange={handleToggle}
        />

        <label className="font-manrope text-md underline">Input Box</label>
        <InputBox data={""} onChange={""} />

        <label className="font-manrope text-md underline">Switch Button</label>
        <TemplateTypeSwitch
          value={isPaid}
          onChange={() => setIsPaid(!isPaid)}
        />

        <label className="font-manrope text-md underline">Select Box</label>
        <CategorySelectBox
          data={{ label: "Category", placeholder: "Ex: Wedding" }}
          onChangeCategory={categorySelect}
        />

        <label className="font-manrope text-md underline">Uploader</label>
        <Uploader
          data={{
            id: "zip-upload",
            label: "Upload template",
            accept: ".zip",
            description: "zip up to 20MB",
            template_name: "",
            category: "",
            subCategory: "updateForm.subCategory.value",
            type: isPaid ? "paid" : "free",
          }}
          // onChange={onChangeZip}
        />

        <label className="font-manrope text-md underline">Preview</label>
        <ImageUploaderPreview
          data={{
            size: "w-auto h-[127px] rounded-16px mt-3 object-cover",
            isActive: "bg-bg_4 text-font-hover",
            imgUrl: require("../assets/img/img1.png"),
            name: "Image Name",
            fileSize: "400KB",
            isLoading: true,
            // progress: progress,
          }}
          onClickRemove={() => {}}
        />
        <ImageComponent
          data={{
            size: "w-auto h-[127px] rounded-16px mt-3 object-cover",
            isActive: "bg-bg_4 text-font-hover",
            imgUrl: require("../assets/img/img1.png"),
            name: "Image Name",
            fileSize: "400KB",
            isLoading: true,
            progress: progress,
          }}
          onClickRemove={() => {}}
        />
      </div>

      <label className="font-manrope text-md underline  ">Tag</label>
      <div className="flex flex-row gap-3">
        <Tag
          data={{
            style: "px-[11px] py-[5px] bg-hover",
            name: "free",
          }}
        />
        <Tag
          data={{
            tagIcon: "cross",
            style: "bg-disable_2 px-[8px] ",
            name: "free",
          }}
        />
      </div>

      <label className="font-manrope text-md underline">Icons</label>
      <div className="flex flex-row gap-3 items-center">
        <div
          className={`flex w-9 h-9 justify-center items-center rounded-[10px] font-bold text-md text-black  cursor-pointer bg-bg_5  active:bg-bg_s`}
          isActive={"bg-bg_5 "}
        >
          {" "}
          {AddIcon("bin")}
        </div>
        <div
          className={`flex w-9 h-9 justify-center items-center rounded-[10px] font-bold text-md  cursor-pointer bg-bg_4  text-font-hover  active:bg-bg_s`}
          isActive={"bg-bg_5 "}
        >
          {" "}
          {AddIcon("bin")}
        </div>
        <div>{AddIcon("cross")}</div>

        <ArrowButton />
      </div>

      <label className="font-manrope text-md underline"></label>
    </div>
  );
};

export default DesignGuide;
