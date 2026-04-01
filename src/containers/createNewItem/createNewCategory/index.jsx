import React, { useState } from "react";
import InputBox from "../../../components/inputBox";
import CategorySelectBox from "../../../components/categorySelectBox";
import SubCategorySelectBox from "../../../components/subCategorySelectBox";
import { Progress } from "antd";
import { App as AntdApp } from "antd";
import Button from "../../../components/button";
import { CheckValidity } from "../../../utils/formValidity";

import { useDispatch, useSelector } from "react-redux";

const CreateNewCategory = () => {
  const { notification } = AntdApp.useApp();
  const [isLoading, setIsLoading] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const dispatch = useDispatch();
  const { isOpenGenerateFileModal, fileData } = useSelector(
    ({ templateReducer }) => templateReducer,
  );

  const [formData, setFormData] = useState({
    categoryName: {
      key: "categoryName",
      label: "Category Name",
      size: "md",
      isShowRequired: false,
      elementConfig: {
        type: "text",
        placeholder: "Ex :Wedding",
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
      label: "Sub Category Name",
      size: "md",
      btnName: "Add",
      isShowRequired: false,
      elementConfig: {
        type: "text",
        placeholder: "Ex :Wedding",
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

  const handleChange = async (event, inputIdentity) => {
    const updateForm = {
      ...formData,
    };

    updateForm[inputIdentity].value = event;
    let validityRes = await CheckValidity(
      inputIdentity,
      updateForm[inputIdentity].value,
      updateForm[inputIdentity].validation,
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

  // const onClickSave = async () => {
  //   setIsLoading(true);
  //   setIsButtonDisabled(true);

  //   const updateForm = {
  //     ...formData,
  //   };

  //   try {

  //     const response = await createNewTemplate({
  //       template_name: updateForm.templateName.value,
  //       category_id: updateForm.category.value,
  //       sub_category_id: updateForm.subCategory.value,
  //     });
  //     console.log("response", response);

  //     if (response?.data?.data) {
  //       const jobId = response?.data?.data?.job_id;
  //       if (!jobId) return;

  //       notification.success({
  //         message: "Success",
  //         description: "Template Create Successfully!",
  //         placement: "topRight",
  //         duration: 4,
  //       });

  //       setIsLoading(false);
  //       setIsButtonDisabled(false);

  //       clearAll();
  //     }

  //     console.log("Success");
  //   } catch (error) {
  //     console.log("Error ===", error);
  //     notification.error({
  //       message: "Error",
  //       description: "Template Create Failed!",
  //       placement: "topRight",
  //       duration: 4,
  //     });
  //     setIsLoading(false);
  //     setIsButtonDisabled(false);
  //   }
  // };

  const updateForm = { ...formData };
  return (
    <>
      <div className="flex flex-col w-[405px] h-full border-border-deafult border-x_sm rounded-md p-24px gap-4">
        <div className="font-manrope font-bold text-lg text-font-default mb-5">
          Create Category
        </div>
        <InputBox
          data={updateForm.categoryName}
          onChange={async (e) => {
            e.preventDefault();
            await handleChange(e.target.value, updateForm.categoryName.key);
          }}
        />

        <InputBox
          data={updateForm.subCategory}
          onChange={async (e) => {
            e.preventDefault();
            await handleChange(e.target.value, updateForm.subCategory.key);
          }}
          onClickAdd={""}
        />

        <Button
          content="Done"
          className={
            updateForm.categoryName.value !== "" ||
            updateForm.subCategory.value !== ""
              ? "text-white bg-black"
              : "bg-border-deafult text-disable hover:bg-border-deafult hover:text-disable cursor-default"
          }
          isActive={
            updateForm.categoryName.value !== "" ||
            updateForm.subCategory.value !== ""
              ? "text-white bg-black"
              : "bg-border-deafult text-disable hover:bg-border-deafult hover:text-disable cursor-default"
          }
          isLoading={isLoading}
          onClick={async (e) => {
            setIsLoading(true);
            e.preventDefault();
            // await onClickSave(e);
          }}
        />
      </div>
    </>
  );
};

export default CreateNewCategory;
