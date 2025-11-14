import React, { useEffect, useState } from "react";
import TemplateViewCard from "../../components/templateViewCard";
import {
  getAllTemplates,
  getTemplateByPage,
} from "../createNewItem/createNewTemplate/service/template.service";
import InputBox from "../../components/inputBox";
import CategorySelectBox from "../../components/categorySelectBox";
import Button from "../../components/button";
import { CheckValidity } from "../../utils/formValidity";
import DropBox from "../../components/dropBox";
import PaginationBar from "../../components/pagination";
import TemplateCard from "../../components/templateCard";

const TemplateViewPage = () => {
  const [tempList, setTempList] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [pageNo, setPageNo] = useState("");
  const [pageSize, setPageSize] = useState(5);
  const [pageCount, setPageCount] = useState(20);
  const [count, setCount] = useState("");
  const [templateList, setTemplateList] = useState("");

  const [filteredList, setFilteredList] = useState([]);
  const [formData, setFormData] = useState({
    templateId: {
      key: "templateId",
      label: "",
      size: "sm",
      isShowRequired: false,
      elementConfig: {
        type: "text",
        placeholder: "Search by template ID",
      },
      touched: false,
      validation: {
        required: false,
      },
      isValid: false,
      invalidReason: "",
      value: "",
    },
    templateName: {
      key: "templateName",
      label: "",
      size: "md",
      isShowRequired: false,
      elementConfig: {
        type: "text",
        placeholder: "Search by template name",
      },
      touched: false,
      validation: {
        required: false,
      },
      isValid: false,
      invalidReason: "",
      value: "",
    },
    category: {
      key: "category",
      label: " ",
      size: "lg",
      placeholder: "Search by category",
      mainLayerStyles: " flex-column " + " align-content-center ",
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
    status: {
      key: "status",
      label: "",
      size: "lg",
      placeholder: "Search by status",
      mainLayerStyles: " flex-column  align-content-center w-full",
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
    setIsLoading(true);
    const updateForm = {
      ...formData,
    };
    for (let key in updateForm) {
      console.log(updateForm[key]);
      updateForm[key].value = "";
      updateForm[key].isValid = false;
      updateForm[key].touched = false;
    }
    categorySelect([]);

    setFormData(updateForm);
    setIsLoading(false);
    setFilteredList(tempList);
  };

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const getTemplateDetails = await getAllTemplates();
  //       console.log("Get All Templates", getTemplateDetails);

  //       if (getTemplateDetails?.data?.templates) {
  //         setTempList(getTemplateDetails?.data?.templates);

  //       } else {
  //         console.log("Data Not found");
  //       }
  //     } catch (error) {
  //       console.log("Error fetching Template", error);
  //     }
  //   };
  //   fetchData();
  // }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const getTemplateDetails = await getAllTemplates();
        console.log("Get All Templates", getTemplateDetails);

        if (getTemplateDetails?.data?.templates?.length) {
          setTempList(getTemplateDetails?.data?.templates);
          setFilteredList(getTemplateDetails?.data?.templates);

          // Extract unique statuses from all templates
          const statuses = [
            ...new Set(getTemplateDetails.data.templates.map((t) => t.status)),
          ].filter(Boolean); // remove undefined/null

          const statusList = await syncStatus(statuses);

          const newFormData = { ...formData };
          newFormData.status.elementConfig.options = statusList;
          newFormData.status.loading = false;
          setFormData(newFormData);

          console.log("Status list:", statusList);
        } else {
          console.log("Data Not found");
        }
      } catch (error) {
        console.log("Error fetching Template", error);
      }
    };
    fetchData();
  }, []);

  const syncStatus = async (res) => {
    let statusList = [];
    for (let status of res) {
      statusList.push({
        id: status,
        key: status,
        value: status,
        displayValue: status,
      });
    }
    return statusList;
  };

  const fetchData = async () => {
    try {
      const response = await getTemplateByPage(20, 1);
      console.log("Get template In page: ", response);

      if (response?.data) {
        setTemplateList(response?.data?.templates);
        setPageCount(response?.data?.count);
        setPageNo(1);
        setCount(response?.data?.total_count);
      } else {
        setTemplateList([]);
        console.log("Data Not Found");
      }
    } catch (error) {
      console.log("Error fetching template", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onChangePage = async (pageNumber, size) => {
    console.log("onChangePage", pageNumber, size);
    try {
      if (pageNumber !== pageNo || size !== pageSize) {
        let response = await getTemplateByPage(size, pageNumber);
        console.log("response template::", response?.data);
        if (response?.data?.templates?.length > 0) {
          setTemplateList(response?.data?.templates);
          setPageNo(pageNumber);
          setPageSize(size);
          setPageCount(response?.data?.count);
          setCount(response?.data?.total_count);
          window.scrollTo(0, 0);
        }
      }
    } catch (error) {
      console.log("Error fetching template by page", error);
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    const id = formData.templateId.value;
    const name = formData.templateName.value;
    const category = formData.category.value;
    const status = formData.status.value;

    const filtered = tempList.filter((item) => {
      const matchId =
        !id ||
        item.templateId?.toString().toLowerCase().includes(id.toLowerCase());

      const matchName =
        !name || item.templateName?.toLowerCase().includes(name.toLowerCase());

      const matchCategory =
        !category || item.category?.toLowerCase() === category.toLowerCase();

      const matchStatus =
        !status || item.status?.toLowerCase() === status.toLowerCase();

      return matchId && matchName && matchCategory && matchStatus;
    });

    setFilteredList(filtered);
    console.log("Filtered Templates:", filtered);
  };

  const updateForm = { ...formData };

  return (
    <>
      {/* <div className="bg-bg_2 flex flex-row gap-36 font-manrope font-medium text-md text-font-default  p-6">
        <div className="ml-[190px]">Template name</div>
        <div className="">Category</div>
        <div className="">Type</div>
        <div className="">Status</div>
      </div>

      {Array.isArray(tempList) && tempList.length > 0
        ? tempList.map((template) => (
            <TemplateViewCard
              data={{
                img: template?.cover_image?.url,
                tempName: template?.template_name,
                id: template?.template_id,
                category: template?.category_name,
                subCategory: template?.sub_category_name,
                tag1: template?.type,
                tag2: template?.status,
              }}
            />
          ))
        : ""} */}

      <div className="flex flex-row gap-3 items-center justify-between p-4 border-border-primary border-b-x_sm bg-white">
        <div className="flex flex-row gap-4 ">
          <InputBox
            data={updateForm.templateId}
            onChange={async (e) => {
              e.preventDefault();
              await handleChange(e.target.value, updateForm.templateId.key);
            }}
          />
          <InputBox
            data={updateForm.templateName}
            onChange={async (e) => {
              e.preventDefault();
              await handleChange(e.target.value, updateForm.templateName.key);
            }}
          />

          <CategorySelectBox
            data={{ placeholder: "Search by category" }}
            onChangeCategory={categorySelect}
          />
          <DropBox
            data={updateForm.status}
            onChange={(e) => {
              const updateForm = { ...formData };
              updateForm["status"].value = e;
              setFormData(updateForm);
              console.log("status Select Box:", e);
            }}
          />
        </div>
        <div className="flex flex-row gap-4 ">
          <Button
            content="clear"
            className={
              updateForm.templateId.value === "" ||
              updateForm.templateName === "" ||
              updateForm.category.value === "" ||
              updateForm.status.value === ""
                ? "text-black bg-white border-black"
                : ""
            }
            isActive={"text-white bg-black"}
            isLoading={isLoading}
            onClick={async (e) => {
              e.preventDefault();
              clearAll();
            }}
          />
          <Button
            content="Search"
            className="text-white bg-black border-black hover:bg-secondary "
            isActive="text-white bg-secondary border-black"
            isLoading={isLoading}
            onClick={async (e) => {
              e.preventDefault();
              handleSearch();
            }}
          />
        </div>
      </div>

      {tempList.length > 0 ? (
        <>
          <div
            className="flex flex-row justify-between items-center p-3"
            style={{ marginBottom: "20px", paddingTop: "20px" }}
          >
            <div>{count} Templates Found</div>
            <PaginationBar
              data={{
                paginationCount: pageCount,
                pageNo: pageNo,
                pageSize: pageSize,
              }}
              onChange={onChangePage}
            />
          </div>

          <div className="container">
            <div className="grid grid-cols-5 gap-5 mt-10">
              {(filteredList.length ? filteredList : tempList).map(
                (template, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center overflow-hidden hover:scale-105 transition-transform duration-200"
                  >
                    <TemplateCard
                      data={{
                        image: template?.cover_image?.url,
                      }}
                      onClick={() => console.log("Clicked:", template)}
                    />
                  </div>
                )
              )}
            </div>
          </div>
        </>
      ) : (
        <>
          <div
            className="flex flex-row justify-start items-center p-3"
            style={{ marginBottom: "20px", paddingTop: "20px" }}
          >
            <div>0 Templates Found</div>
          </div>
          <div className="container">
            <div className="flex flex-col w-full h-full justify-center  items-center mt-28">
              <img
                src={require("../../assets/img/icon.png")}
                alt="icon"
                className="w-[158px] h-[158px] "
              />
              <div className="flex flex-col justify-center gap-[10px] p-1 font-manrope font-normal">
                <div className="text-x_lg text-font-default">
                  Template not found
                </div>
                <div className="text-sm text-font-secondary">
                  It looks like there aren't any templates here yet.
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default TemplateViewPage;
