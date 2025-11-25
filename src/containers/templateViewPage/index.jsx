import React, { useEffect, useState } from "react";
import TemplateViewCard from "../../components/templateViewCard";
import {
  getAllTemplates,
  getAllTemplatesStatus,
  getTemplateByPage,
} from "../createNewItem/createNewTemplate/service/template.service";
import InputBox from "../../components/inputBox";
import CategorySelectBox from "../../components/categorySelectBox";
import Button from "../../components/button";
import { CheckValidity } from "../../utils/formValidity";
import DropBox from "../../components/dropBox";
import PaginationBar from "../../components/pagination";
import TemplateCard from "../../components/templateCard";
import { useDispatch, useSelector } from "react-redux";
import {
  doneRefresh,
  openTemplateEditModal,
} from "../modal/TemplateEditModal/redux/actions";
import { App as AntdApp } from "antd";

const TemplateViewPage = () => {
  const { notification } = AntdApp.useApp();
  const [tempList, setTempList] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [pageNo, setPageNo] = useState("");
  const [pageSize, setPageSize] = useState(5);
  const [pageCount, setPageCount] = useState(20);
  const [count, setCount] = useState("");

  const [filteredList, setFilteredList] = useState([]);
  const { isRefresh } = useSelector(({ templateReducer }) => templateReducer);

  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    templateId: {
      key: "templateId",
      label: "",
      size: "min-w-[150px]",
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
      size: "min-w-[150px]",
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
      size: "min-w-[150px]",
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
      size: "min-w-[133px]",
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
    setFilteredList([]);
  };

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const getTemplateStatusDetails = await getAllTemplates();
  //       console.log("Get All Templates", getTemplateStatusDetails);

  //       if (getTemplateStatusDetails?.data?.templates) {
  //         setTempList(getTemplateStatusDetails?.data?.templates);

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
    const fetchStatus = async () => {
      try {
        const getTemplateStatusDetails = await getAllTemplatesStatus();
        console.log("Get All Templates Status", getTemplateStatusDetails);

        if (getTemplateStatusDetails?.data?.data) {
          // Extract unique statuses from all templates
          const statuses = [
            ...new Set(getTemplateStatusDetails.data.data.map((t) => t.status)),
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
    fetchStatus();
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
        setTempList(response?.data?.templates);
        setPageCount(response?.data?.count);
        setPageNo(1);
        setCount(response?.data?.total_count);
        dispatch(doneRefresh());
      } else {
        setTempList([]);
        console.log("Data Not Found");
      }
    } catch (error) {
      console.log("Error fetching template", error);
    }
  };

  useEffect(() => {
    if (isRefresh) {
      fetchData();
    }
  }, [isRefresh]);

  const onChangePage = async (pageNumber, size) => {
    console.log("onChangePage", pageNumber, size);
    try {
      if (pageNumber !== pageNo || size !== pageSize) {
        let response = await getTemplateByPage(size, pageNumber);
        console.log("response template::", response?.data);
        if (response?.data?.templates?.length > 0) {
          setTempList(response?.data?.templates);
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

  // const handleSearch = () => {
  //   const id = formData.templateId.value;
  //   const name = formData.templateName.value;
  //   const category = formData.category.value;
  //   const status = formData.status.value;

  //   const filtered = tempList.filter((item) => {
  //     if (status.toLowerCase() === item.status.toLowerCase()) {
  //       return item;
  //     }
  //     if (id === item.template_id) {
  //       return item;
  //     }
  //     if (name.toLowerCase() === item.template_name.toLowerCase()) {
  //       return item;
  //     }
  //     if (category === item.category_id) {
  //       return item;
  //     }
  //   });

  //   setFilteredList(filtered);
  //   console.log("Filtered Templates:", filtered);
  // };

  const handleSearch = () => {
    const id = formData.templateId.value.trim();
    const name = formData.templateName.value.trim().toLowerCase();
    const category = formData.category.value;
    const status = formData.status.value.toLowerCase();

    const filtered = tempList.filter((item) => {
      const matchId = id ? item.template_id === id : true;
      const matchName = name
        ? item.template_name.toLowerCase().includes(name)
        : true;
      const matchCategory = category ? item.category_id === category : true;
      const matchStatus = status ? item.status.toLowerCase() === status : true;

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

      <div className="flex flex-row gap-52 items-center justify-between p-5 border-border-primary border-b-x_sm bg-white">
        <div className="flex flex-row gap-4 w-full">
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
              updateForm.templateId.value !== "" ||
              updateForm.templateName !== "" ||
              updateForm.category.value !== "" ||
              updateForm.status.value !== ""
                ? "text-black bg-white border-black border-[1px]"
                : "text-black bg-white border-black"
            }
            isActive={"text-black bg-white border-black"}
            isLoading={isLoading}
            onClick={async (e) => {
              e.preventDefault();
              clearAll();
            }}
          />
          <Button
            content="Search"
            className={
              updateForm.templateId.value !== "" ||
              updateForm.templateName !== "" ||
              updateForm.category.value !== "" ||
              updateForm.status.value !== ""
                ? "text-white bg-black border-black border-[1px]"
                : "text-white bg-black border-black"
            }
            isActive="text-white bg-black border-black"
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
            <div
              className="grid 
          grid-cols-1 
          sm:grid-cols-2 
          md:grid-cols-3 
          lg:grid-cols-4 
          xl:grid-cols-5 gap-7 mt-10"
            >
              {(filteredList.length > 0 ? filteredList : tempList).map(
                (template, index) => (
                  <TemplateCard
                    data={{
                      image: template?.cover_image?.url,
                      tag: template?.type,
                      name: template?.template_name,
                      category: template?.category_name,
                      subCategory: template?.sub_category_name,
                    }}
                    onClick={() => console.log("Clicked:", template)}
                    onClickEdit={() =>
                      dispatch(openTemplateEditModal(template))
                    }
                  />
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
