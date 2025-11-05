import React, { useEffect, useState } from "react";

import DropBox from "../dropBox";
import { getAllCategory } from "../../containers/createNewItem/createNewTemplate/service/category.service";

const CategorySelectBox = ({ data, onChangeCategory }) => {
  const [categoryList, setCategoryList] = useState("");

  const [formData, setFormData] = useState({
    category: {
      key: "category",
      label: "Category",
      size: "lg",
      placeholder: "Ex : Wedding",
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

  const fetchCategories = async () => {
    const updateForm = { ...formData };
    updateForm.category.loading = true;
    updateForm["category"].elementConfig.options = [];
    const response = await getAllCategory();
    if (response?.data?.categories.length > 0) {
      let categoryList = await syncCategory(response.data?.categories);
      updateForm["category"].elementConfig.options = categoryList;
      updateForm.category.loading = false;
      //  dispatch(setCategoryList(response.data));

      setFormData(updateForm);
    }
    console.log("Category List:", categoryList);
  };

  const syncCategory = async (res) => {
    let categoryList = [];
    for (let category of res) {
      categoryList.push({
        id: category.category_id,
        key: category.category_name,
        value: category.category_id,
        displayValue: category.category_name,
      });
    }
    return categoryList;
  };

  useEffect(() => {
    if (formData.category.elementConfig.options.length === 0) {
      fetchCategories();
    }
  }, [formData]);

  const updateform = { ...formData };

  return (
    <>
      <DropBox
        data={updateform.category}
        onChange={(e) => {
          const updateForm = { ...formData };
          updateForm["category"].value = e;
          setFormData(updateForm);
          console.log("Category Select Box:", e);
          onChangeCategory(e);
        }}
      />
    </>
  );
};

export default CategorySelectBox;
