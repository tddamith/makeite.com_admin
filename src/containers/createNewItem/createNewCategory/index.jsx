import React, { useState } from "react";
import InputBox from "../../../components/inputBox";
import { App as AntdApp } from "antd";
import Button from "../../../components/button";
import { CheckValidity } from "../../../utils/formValidity";

import { useDispatch } from "react-redux";
import { AddIcon } from "../../../config/icon";
import { createNewCategory } from "./service/category.service";

const CreateNewCategory = () => {
  const { notification } = AntdApp.useApp();
  const [isLoading, setIsLoading] = useState(false);
  const [subCategoryList, setSubCategoryList] = useState([]);

  const dispatch = useDispatch();

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
    const updateForm = { ...formData };

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

      let formIsValid = false;
      for (let inputIdentifier in updateForm) {
        formIsValid = updateForm[inputIdentifier].valid && formIsValid;
      }

      setFormData(updateForm);
    }
  };

  const clearAll = () => {
    const updateForm = { ...formData };
    for (let key in updateForm) {
      updateForm[key].value = "";
      updateForm[key].isValid = false;
      updateForm[key].touched = false;
    }
    setSubCategoryList([]);

    setFormData(updateForm);
  };

  const onClickSave = async () => {
    setIsLoading(true);

    const updateForm = { ...formData };

    try {
      const response = await createNewCategory({
        category_name: updateForm.categoryName.value,
        sub_category: subCategoryList,
      });
      console.log("response", response);

      if (response?.data?.status) {
        notification.success({
          message: "Success",
          description: "Category Create Successfully!",
          placement: "topRight",
          duration: 4,
        });

        clearAll();
      } else {
        notification.error({
          message: "Error",
          description: response?.data?.message || "Category Create Failed!",
          placement: "topRight",
          duration: 4,
        });
      }
    } catch (error) {
      console.log("Error ===", error);
      notification.error({
        message: "Error",
        description: "Template Create Failed!",
        placement: "topRight",
        duration: 4,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onClickAdd = async () => {
    const updateForm = { ...formData };
    if (updateForm.subCategory.value !== "") {
      let item = {
        sub_category_id: Math.random().toString(36).substring(2, 12),
        sub_category_name: updateForm.subCategory.value,
      };
      if (subCategoryList.length > 0) {
        const isExist = subCategoryList.some(
          (sub) =>
            sub.sub_category_name.toLowerCase() ===
            item.sub_category_name.toLowerCase(),
        );
        if (isExist) {
          notification.error({
            message: "Error",
            description: "Sub Category already exists!",
            placement: "topRight",
            duration: 4,
          });
          return;
        }
      }
      setSubCategoryList((prev) => [...prev, item]);
      updateForm.subCategory.value = "";
      updateForm.subCategory.isValid = false;
      updateForm.subCategory.touched = false;
      setFormData(updateForm);
    }
  };

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
          onClickAdd={onClickAdd}
        />
        <div className="flex flex-row gap-2 flex-wrap">
          {subCategoryList.map((item, index) => (
            <div
              key={index}
              className="flex flex-row gap-1 items-center bg-border-deafult text-font-default px-3 py-1 rounded-full"
            >
              <span>{item?.sub_category_name}</span>
              <span
                className="cursor-pointer"
                onClick={() => {
                  setSubCategoryList((prev) =>
                    prev.filter((subItem) => subItem !== item),
                  );
                }}
              >
                {AddIcon("cross")}
              </span>
            </div>
          ))}
        </div>

        <Button
          content="Done"
          className={
            updateForm.categoryName.value !== "" && subCategoryList.length > 0
              ? "text-white bg-black"
              : "bg-border-deafult text-disable hover:bg-border-deafult hover:text-disable cursor-default"
          }
          isActive={
            updateForm.categoryName.value !== "" && subCategoryList.length > 0
              ? "text-white bg-black"
              : "bg-border-deafult text-disable hover:bg-border-deafult hover:text-disable cursor-default"
          }
          disabled={
            updateForm.categoryName.value === "" &&
            updateForm.subCategory.value === ""
          }
          isLoading={isLoading}
          onClick={async () => {
            setIsLoading(true);
            await onClickSave();
          }}
        />
      </div>
    </>
  );
};

export default CreateNewCategory;
