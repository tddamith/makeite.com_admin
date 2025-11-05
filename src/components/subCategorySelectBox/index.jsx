import React, { useState, useEffect } from "react";

import DropBox from "../dropBox";
import { getAllSubCategoryByCategoryId } from "../../containers/createNewItem/createNewTemplate/service/category.service";

const SubCategorySelectBox = ({ data, onChangeSubCategory }) => {
  const [formData, setFormData] = useState({
    subCategory: {
      key: "subCategory",
      label: "Sub Category",
      size: "lg",
      placeholder: "ex : makeite@example.com",
      mainLayerStyles: " flex-col align-content-center mb-3",
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

  const updateform = { ...formData };

  return (
    <>
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
    </>
  );
};

export default SubCategorySelectBox;
