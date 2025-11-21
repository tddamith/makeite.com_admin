import React, { useEffect, useState } from "react";

import DropBox from "../dropBox";
import { getAllCategory } from "../../containers/createNewItem/createNewTemplate/service/category.service";
import Tag from "../tag";

const CategorySelectBox = ({ data, onChangeCategory }) => {
  const [categoryList, setCategoryList] = useState("");
  const [selectData, setSelectData] = useState("");

  const [formData, setFormData] = useState({
    category: {
      key: "category",
      label: data?.label,
      size: "min-w-[199px]",
      placeholder: data?.placeholder,
      mainLayerStyles: " flex-col align-content-center h-full w-full",
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
      if (data?.category_id) {
        const selected = categoryList?.find((w) => w.id === data?.category_id);
        console.log(selected);
        if (selected) {
          setSelectData(selected);
          const updateForm = { ...formData };
          updateForm.category.value = selected.value;
          setFormData(updateForm);
          onChangeCategory(selected.id);
        }
      }

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

  // --- When editing, set initial selected widget ---
  useEffect(() => {
    console.log(data?.category_id);
  }, [data.category_id]);

  return (
    <>
      <div className="flex flex-col w-full">
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

        <div className="flex flex-row flex-wrap mt-2 ">
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
                resetForm.category.value = "";
                setFormData(resetForm);
                onChangeCategory("");
              }}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default CategorySelectBox;
