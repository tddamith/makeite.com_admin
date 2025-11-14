import React, { useState } from "react";
import InputBox from "../../../components/inputBox";
import CategorySelectBox from "../../../components/categorySelectBox";
import SubCategorySelectBox from "../../../components/subCategorySelectBox";
import Uploader from "../../../components/uploader";
import TemplateTypeSwitch from "../../../components/switchButton";
import { Menu, notification, Progress } from "antd";
import MenuButtonCard from "../../../components/menuButton";
import Button from "../../../components/button";
import { CheckValidity } from "../../../utils/formValidity";
import {
  createNewTemplate,
  deleteImage,
  jobProgress,
  updateTemplateById,
} from "./service/template.service";

import ImgUploader from "../../../components/imgUploader";

import { Store } from "react-notifications-component";
import ImageComponent from "../../../components/imageComponent";

const CreateNewTemplate = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [isPaid, setIsPaid] = useState(false);
  const [image, setImage] = useState("");
  const [template, setTemplate] = useState("");
  const [progress, setProgress] = useState(0);
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
        setTemplate(zip);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const onClickRemoveImage = async (key) => {
    setIsLoading(true);
    try {
      const res = await deleteImage(key);
      console.log("remove image", res);

      setImage("");
      if (res?.data) {
        Store.addNotification({
          title: "Success",
          message: "Image Delete successfully",
          type: "success",
          container: "top-right",
          dismiss: {
            duration: 2000,
            onScreen: true,
          },
        });
      }

      setIsLoading(false);
    } catch (error) {
      console.log("Error in deleting image", error);
      Store.addNotification({
        title: "Error",
        message: "Image Delete failed",
        type: "danger",
        container: "top-right",
        dismiss: {
          duration: 2000,
          onScreen: true,
        },
      });
      setIsLoading(false);
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
    setImage("");
    setTemplate("");
    setIsPaid(false);

    setFormData(updateForm);
  };

  const onClickSave = async () => {
    setIsLoading(true);
    setIsButtonDisabled(true);

    const updateForm = {
      ...formData,
    };

    try {
      // const response = await updateTemplateById(
      //   {
      //     cover_image: image,
      //     type: isPaid ? "paid" : "free",
      //   },
      //   template?.template_id
      // );

      const response = await createNewTemplate({
        template_name: updateForm.templateName.value,
        category_id: updateForm.category.value,
        sub_category_id: updateForm.subCategory.value,
        base64_data: template?.base64_data,
        filename: template?.filename,
        cover_image: image,
        type: isPaid ? "paid" : "free",
      });
      console.log("response", response);

      if (response?.data?.data) {
        const jobId = response?.data?.data?.job_id;
        if (!jobId) return;

        const interval = setInterval(async () => {
          const progressResponse = await jobProgress(jobId);
          console.log(progressResponse);
          setProgress(0);
          const percentage = progressResponse.data?.progress || 0;

          setProgress(percentage);

          if (percentage >= 100) {
            clearInterval(interval);
            setIsLoading(false);

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
        }, 1000);

        console.log("Success");
      } else {
        setIsLoading(false);
        Store.addNotification({
          title: "Error!",
          message: "Template Create Failed!",
          type: "danger",
          insert: "top",
          container: "top-right",
          dismiss: { duration: 3000, onScreen: true },
        });
      }
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
        <CategorySelectBox
          data={{ label: "Category", placeholder: "Ex: Wedding" }}
          onChangeCategory={categorySelect}
        />
        <SubCategorySelectBox
          onChangeSubCategory={subCategorySelect}
          data={{
            category_id: updateForm.category.value,
          }}
        />
        {template ? (
          <>
            <h2 className="text-md font-medium text-font-default font-manrope  mb-2px">
              Upload template
            </h2>
            <ImageComponent
              data={{
                size: "w-[127px] h-[127px] rounded-16px mt-3 object-cover mx-auto",
                imgUrl: require("../../../assets/img/zipIcon.png"),
              }}
              onClickRemove={() => {
                setIsLoading(true);
                setTemplate("");
                setIsLoading(false);
              }}
            />
          </>
        ) : (
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
        )}

        <>
          {image ? (
            <>
              <h2 className="text-md font-medium text-font-default font-manrope  mb-2px">
                Template cover image
              </h2>
              <ImageComponent
                data={{
                  size: "w-auto h-[127px] rounded-16px mt-3 object-cover",
                  imgUrl: image?.url,
                }}
                onClickRemove={() => {
                  setIsLoading(true);
                  if (template?.template_id) {
                    setImage("");
                  } else {
                    onClickRemoveImage(image?.data?.file_name, "image");
                  }
                  setIsLoading(false);
                }}
              />
            </>
          ) : (
            <ImgUploader
              data={{
                id: "img-upload",
                label: "Template cover image",
                accept: "image/png, image/jpeg, image/gif",
                description: "PNG, JPG, GIF up to 10MB",
              }}
              onChange={onChangeImage}
            />
          )}
        </>

        <TemplateTypeSwitch
          value={isPaid}
          onChange={() => setIsPaid(!isPaid)}
        />

        <Button
          content="Done"
          className={
            updateForm.templateName.value !== "" ||
            updateForm.category.value !== "" ||
            updateForm.subCategory.value !== "" ||
            image?.url ||
            template?.base64_data
              ? "text-white bg-black"
              : "bg-border-default text-disable"
          }
          isActive={
            updateForm.templateName.value !== "" ||
            updateForm.category.value !== "" ||
            updateForm.subCategory.value !== "" ||
            image?.url ||
            template?.base64_data
              ? "text-white bg-black"
              : "bg-border-default text-disable"
          }
          isLoading={isLoading}
          onClick={async (e) => {
            setIsLoading(true);
            e.preventDefault();
            await onClickSave(e);
          }}
        />
        {isLoading && progress > 0 && (
          <div className="top-0 h-full w-full left-0 bottom-0 right-0 fixed bg-black/35 z-50 ">
            <div
              className="flex flex-col justify-center items-center ml-[-20px] top-[40%] left-[49.3%] fixed rounded-md bg-white p-11"
              style={{ width: "405px", height: "auto" }}
            >
              <Progress
                percent={progress}
                showInfo={false}
                strokeColor="#BE17FA"
                trailColor="#e7a9fd"
              />
              <span className="mt-2 font-manrope font-semibold text-black">
                {progress}%
              </span>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CreateNewTemplate;
