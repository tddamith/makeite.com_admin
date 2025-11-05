import React, { useState } from "react";
import InputBox from "../../../components/inputBox";
import CategorySelectBox from "../../../components/categorySelectBox";
import SubCategorySelectBox from "../../../components/subCategorySelectBox";
import Uploader from "../../../components/uploader";
import TemplateTypeSwitch from "../../../components/switchButton";
import { Menu } from "antd";
import MenuButtonCard from "../../../components/menuButton";
import Button from "../../../components/button";
import { CheckValidity } from "../../../utils/formValidity";
import { createNewTemplate } from "./service/template.service";
import { Store } from "react-notifications-component";
import ImgUploader from "../../../components/imgUploader";

const CreateNewTemplate = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [isPaid, setIsPaid] = useState(false);
  const [image, setImage] = useState("");
  const [zip, setZip] = useState("");
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

  const onChangeImage = (image) => {
    try {
      if (image) {
        let file = {
          url: image.file_url,
          file_name: image.file_name,
        };

        setImage(file);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const onChangeZip = (zip) => {
    try {
      if (zip) {
        let file = {
          url: zip.file_url,
          file_name: zip.file_name,
        };

        setZip(file);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleChange = async (event, inputIdentity) => {
    const updateForm = {
      ...formData,
    };

    updateForm[inputIdentity].value = event;
    let validityRes = await CheckValidity(
      inputIdentity,
      updateForm[inputIdentity].value,
      updateForm[inputIdentity].validation
    );

    if (validityRes) {
      updateForm[inputIdentity].isValid = validityRes.isValid;
      updateForm[inputIdentity].invalidReason = validityRes.reason;
      updateForm[inputIdentity].value = event;
      updateForm[inputIdentity].touched = true;
      console.log("required_validation", validityRes);

      let formIsValid = false;
      for (let inputIdentifier in updateForm) {
        formIsValid = updateForm[inputIdentifier].valid && formIsValid;
      }
      console.log("formIsValid", formIsValid);
      setFormData(updateForm);
    }
  };

  const clearAll = () => {
    const updateForm = {
      ...formData,
    };
    for (let key in updateForm) {
      console.log(updateForm[key]);
      updateForm[key].value = "";
      updateForm[key].isValid = false;
      updateForm[key].touched = false;
    }
    // categorySelect([]);
    setFormData(updateForm);
  };

  const onClickSave = async () => {
    setIsLoading(true);
    setIsButtonDisabled(true);

    const updateForm = {
      ...formData,
    };

    try {
      const response = await createNewTemplate({
        template_name: updateForm.templateName.value,
        category: updateForm.category.value,
        subCategory: updateForm.subCategory.value,

        type: isPaid ? "paid" : "free",
      });
      console.log("response", response);
      setIsLoading(false);
      if (response?.data) {
        // dispatch(addList(response?.data));
        Store.addNotification({
          title: "Success!",
          message: "Template Create Successfully!",
          type: "success",
          insert: "top",
          container: "top-right",
          dismiss: { duration: 3000, onScreen: true },
        });
        setIsLoading(false);
        setIsButtonDisabled(false);

        clearAll();
      }
      setIsLoading(false);
    } catch (error) {
      console.log("Error ===", error);
      Store.addNotification({
        title: "Error!",
        message: "Template Create Failed!",
        type: "danger",
        insert: "top",
        container: "top-right",
        dismiss: { duration: 3000, onScreen: true },
      });
      setIsLoading(false);
      setIsButtonDisabled(false);
    }
  };

  const updateForm = { ...formData };
  return (
    <>
      <div className="flex flex-col w-[405px] h-full border-border-deafult border-x_sm rounded-md p-24px gap-4">
        <div className="font-manrope font-bold text-lg text-font-default mb-5">
          Create Template
        </div>
        <InputBox
          data={updateForm.templateName}
          onChange={async (e) => {
            e.preventDefault();
            await handleChange(e.target.value, updateForm.templateName.key);
          }}
        />
        <CategorySelectBox onChangeCategory={categorySelect} />
        <SubCategorySelectBox
          onChangeSubCategory={subCategorySelect}
          data={{
            category_id: updateForm.category.value,
          }}
        />
        <Uploader
          data={{
            id: "zip-upload",
            label: "Upload template",
            accept: ".zip",
            description: "zip up to 20MB",
            template_name: updateForm.templateName.value,
            category: updateForm.category.value,
            subCategory: updateForm.subCategory.value,
            type: isPaid ? "paid" : "free",
          }}
          onChange={onChangeZip}
        />

        <ImgUploader
          data={{
            id: "img-upload",
            label: "Template cover image",
            accept: "image/png, image/jpeg, image/gif",
            description: "PNG, JPG, GIF up to 10MB",
          }}
          onChage={onChangeImage}
        />

        <TemplateTypeSwitch
          value={isPaid}
          onChange={() => setIsPaid(!isPaid)}
        />

        <Button
          content="Done"
          type={
            updateForm.templateName.value === "" ||
            updateForm.category.value === "" ||
            updateForm.subCategory.value === ""
              ? "bg-border-deafult text-disable"
              : "text-white bg-bg_1 "
          }
          isLoading={isLoading}
          onClick={async (e) => {
            e.preventDefault();
            await onClickSave(e);
          }}
        />
      </div>
    </>
  );
};

export default CreateNewTemplate;
