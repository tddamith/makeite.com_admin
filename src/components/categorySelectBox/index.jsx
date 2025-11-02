import React, { useState } from "react";

import DropBox from "../dropBox";

const CategorySelectBox = ({ data, onChangeCategory }) => {
  const [formData, setFormData] = useState({
    category: {
      key: "category",
      label: "Category",
      size: "lg",
      placeholder: "Select category",
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

  //    const fetchCategories = async () => {
  //      const updateForm = { ...formData };
  //      updateForm.category.loading = true;
  //      updateForm["category"].elementConfig.options = [];
  //      const response = await getAllCategory();
  //      if (response?.data) {
  //        let categoryList = await syncCategory(response.data);
  //        updateForm["category"].elementConfig.options = categoryList;
  //        updateForm.category.loading = false;
  //        dispatch(setCategoryList(response.data));

  //        setFormData(updateForm);
  //      }
  //    };

  const syncCategory = async (res) => {
    let categoryList = [];
    for (let category of res) {
      categoryList.push({
        id: category.category_id,
        key: category.name,
        value: category.category_id,
        displayValue: category.name,
      });
    }
    return categoryList;
  };

  // useEffect(() => {
  //   if (formData.category.elementConfig.options.length === 0) {
  //     fetchCategories();
  //   }
  // }, []);

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
