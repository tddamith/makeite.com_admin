import React, { useState } from "react";
import InputBox from "../../../components/inputBox";
import CategorySelectBox from "../../../components/categorySelectBox";
import SubCategorySelectBox from "../../../components/subCategorySelectBox";
import Uploader from "../../../components/uploader";
import TemplateTypeSwitch from "../../../components/switchButton";
import { Menu } from "antd";
import MenuButtonCard from "../../../components/menuButton";
import Button from "../../../components/button";

const CreateNewTemplate = () => {
  const [formData, setFormData] = useState({
    templateName: {
      key: "templateName",
      label: "Template Name",
      size: "md",
      isShowRequired: false,
      elementConfig: {
        type: "text",
        placeholder: "Ex : Hot Wedding",
      },
      touched: false,
      validation: {
        required: true,
      },
      isValid: false,
      invalidReason: "",
      value: "",
    },
    category: {
      key: "category",
      label: "Category",
      size: "lg",
      placeholder: "Ex : Wedding",
      mainLayerStyles: " flex-column " + " align-content-center " + "mb-3",
      iconName: "",
      isRequired: false,
      loading: false,
      elementConfig: {
        options: [],
      },
      touched: false,
      validation: {
        required: true,
      },
      isValid: false,
      invalidReason: "",
      value: "",
    },
    subCategory: {
      key: "subCategory",
      label: "Sub Category",
      size: "lg",
      placeholder: "ex : makeite@example.com",
      mainLayerStyles: " flex-column " + " align-content-center " + "mb-3",
      iconName: "",
      isRequired: false,
      loading: false,
      elementConfig: {
        options: [],
      },
      touched: false,
      validation: {
        required: true,
      },
      isValid: false,
      invalidReason: "",
      value: "",
    },
  });

  const categorySelect = (value) => {
    console.log({ value });
    const updateForm = { ...formData };
    updateForm["category"].value = value;
    setFormData(updateForm);
  };

  const subCategorySelect = (value) => {
    console.log({ value });
    const updateForm = { ...formData };
    updateForm["subCategory"].value = value;
    setFormData(updateForm);
  };

  const updateForm = { ...formData };
  return (
    <>
      <div className="flex flex-col w-[405px] h-full border-boder-deafult border-x_sm rounded-md p-24px gap-4">
        <div className="font-manrope font-bold text-lg text-font-default mb-5">
          Create Template
        </div>
        <InputBox
          data={updateForm.templateName}
          onChange={async (e) => {
            // e.preventDefault();
            // await handleChange(e.target.value, updateForm.templateName.key);
          }}
        />
        <CategorySelectBox onChangeCategory={categorySelect} data={{}} />
        <SubCategorySelectBox onChangeCategory={subCategorySelect} data={{}} />
        <Uploader
          data={{
            id: "zip-upload",
            label: "Upload template",
            accept: ".zip",
            description: "zip up to 20MB",
          }}
        />

        <Uploader
          data={{
            id: "img-upload",
            label: "Template cover image",
            accept: "image/png, image/jpeg, image/gif",
            description: "PNG, JPG, GIF up to 10MB",
          }}
        />

        <TemplateTypeSwitch />

        <Button content="Done" onClick="" />
      </div>
    </>
  );
};

export default CreateNewTemplate;
