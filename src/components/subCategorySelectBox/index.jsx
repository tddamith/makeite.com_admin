import React, { useState, useEffect } from "react";

import DropBox from "../dropBox";
import { getAllSubCategoryByCategoryId } from "../../containers/createNewItem/createNewTemplate/service/category.service";
import Tag from "../tag";

const SubCategorySelectBox = ({ data, onChangeSubCategory }) => {
  const [selectData, setSelectData] = useState("");
  const [formData, setFormData] = useState({
    subCategory: {
      key: "subCategory",
      label: "Sub Category",
      size: "lg",
      placeholder: "Ex: Wedding Invites",
      mainLayerStyles: " flex-col align-content-center mb-3 w-full ",
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

  const fetchCategories = async (category_id) => {
    const updateForm = { ...formData };
    updateForm.subCategory.loading = true;
    updateForm["subCategory"].elementConfig.options = [];
    const response = await getAllSubCategoryByCategoryId(category_id);
    if (response?.data?.sub_categories) {
      let categoryList = await syncCategory(response?.data?.sub_categories);
      updateForm["subCategory"].elementConfig.options = categoryList;
      updateForm.subCategory.loading = false;
      // dispatch(setCategoryList(response.data));

      if (data?.sub_category_id) {
        const selected = categoryList?.find(
          (w) => w.id === data.sub_category_id
        );
        console.log(selected);
        if (selected) {
          setSelectData(selected);
          const updateForm = { ...formData };
          updateForm.subCategory.value = selected.value;
          setFormData(updateForm);
          onChangeSubCategory(selected.id);
        }
      }

      setFormData(updateForm);
    }
  };

  const syncCategory = async (res) => {
    let categoryList = [];
    for (let subCategory of res) {
      categoryList.push({
        id: subCategory.sub_category_id,
        key: subCategory.sub_category_name,
        value: subCategory.sub_category_id,
        displayValue: subCategory.sub_category_name,
      });
    }
    return categoryList;
  };

  useEffect(() => {
    if (data.category_id) {
      fetchCategories(data.category_id);
    }
  }, [data.category_id]);

  // --- When editing, set initial selected widget ---
  useEffect(() => {
    console.log(data?.sub_category_id);
  }, [data.sub_category_id]);

  const updateform = { ...formData };

  return (
    <>
      <div className="flex flex-col w-full">
        <DropBox
          data={updateform.subCategory}
          onChange={(e) => {
            const updateForm = { ...formData };
            updateForm["subCategory"].value = e;
            setFormData(updateForm);
            console.log("Sub Category Select Box:", e);
            onChangeSubCategory(e);
          }}
        />
        <div className="flex flex-row flex-wrap ">
          {selectData && (
            <Tag
              key={selectData.id}
              data={{
                name: selectData?.displayValue,
                tagIcon: "cross",
                style: "bg-disable_2 px-3",
              }}
              onClick={() => {
                setSelectData("");
                const resetForm = { ...formData };
                resetForm.subCategory.value = "";
                setFormData(resetForm);
                onChangeSubCategory("");
              }}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default SubCategorySelectBox;
