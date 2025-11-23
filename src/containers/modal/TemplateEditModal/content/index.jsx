import React, { useEffect, useState } from "react";
import InputBox from "../../../../components/inputBox";
import CategorySelectBox from "../../../../components/categorySelectBox";
import SubCategorySelectBox from "../../../../components/subCategorySelectBox";
import Button from "../../../../components/button";
import {
  deleteImage,
  jobProgress,
  updateTemplateById,
} from "../../../createNewItem/createNewTemplate/service/template.service";
import { CheckValidity } from "../../../../utils/formValidity";
import ImageComponent from "../../../../components/imageComponent";
import Uploader from "../../../../components/uploader";
import TemplateTypeSwitch from "../../../../components/switchButton";
import ImageUploaderPreview from "../../../../components/imageUploaderPreview";
import ImgUploader from "../../../../components/imgUploader";
import { App as AntdApp } from "antd";
import { Progress } from "antd";
import Scrollbar from "react-scrollbars-custom";
import { closeTemplateEditModal, setTemplateData } from "../redux/actions";
import { useSelector, useDispatch } from "react-redux";

const Content = () => {
  const { notification } = AntdApp.useApp();
  const [isPaid, setIsPaid] = useState(false);
  const [image, setImage] = useState("");
  const [template, setTemplate] = useState("");
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [viewPointWidth, setViewPointWidth] = useState(0);
  const [viewPointHeight, setViewPointHeight] = useState(0);
  const { templateData, isUpdate } = useSelector(
    ({ templateReducer }) => templateReducer
  );
  const dispatch = useDispatch();
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
        console.log("image", image);
        let file = {
          url: image?.file_url,
          file_name: image?.file_name,
        };

        setImage(image);
        dispatch(
          setTemplateData({
            ...templateData,
            cover_image: file,
          })
        );
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const onChangeZip = (zip) => {
    try {
      if (zip) {
        console.log({ zip });
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
        // Store.addNotification({
        //   title: "Success",
        //   message: "Image Delete successfully",
        //   type: "success",
        //   container: "top-right",
        //   dismiss: {
        //     duration: 2000,
        //     onScreen: true,
        //   },
        // });
        notification.success({
          message: "success",
          description: "Image Delete successfully",
          placement: "topRight",
          duration: 4,
        });
      }

      setIsLoading(false);
    } catch (error) {
      console.log("Error in deleting image", error);
      //   Store.addNotification({
      //     title: "Error",
      //     message: "Image Delete failed",
      //     type: "danger",
      //     container: "top-right",
      //     dismiss: {
      //       duration: 2000,
      //       onScreen: true,
      //     },
      //   });
      notification.error({
        message: "error",
        description: "Image Delete failed",
        placement: "topRight",
        duration: 4,
      });
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (templateData?.template_id) {
      console.log("id", templateData?.template_id);
      const updateForm = {
        ...formData,
      };
      updateForm.templateName.value = templateData?.template_name;
      updateForm.category.value = templateData?.category_id;
      updateForm.subCategory.value = templateData?.sub_category_id;
      setFormData(updateForm);
      setIsPaid(templateData?.type === "paid" ? true : false);

      if (!isUpdate) {
        setImage(templateData?.cover_image);
        setTemplate(templateData?.file_url);
      }
    } else {
      for (let key in updateForm) {
        console.log(updateForm[key]);
        updateForm[key].value = "";
        updateForm[key].isValid = false;
        updateForm[key].touched = false;
      }
      setFormData(updateForm);
    }
  }, [templateData]);

  // scrollbars start
  useEffect(() => {
    updateWindowDimensions();
    window.addEventListener("resize", updateWindowDimensions);
    window.addEventListener("scroll", handleOnScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    return () => {
      window.removeEventListener("scroll", handleOnScroll);
      window.removeEventListener("resize", updateWindowDimensions);
    };
  }, []);

  const updateWindowDimensions = () => {
    setViewPointWidth(window.innerWidth);
    setViewPointHeight(window.innerHeight);
  };

  const handleOnScroll = () => {
    let scrollTop =
      (document.documentElement && document.documentElement.scrollTop) ||
      document.body.scrollTop;
    let scrollHeight =
      (document.documentElement && document.documentElement.scrollHeight) ||
      document.body.scrollHeight;
    let clientHeight =
      document.documentElement.clientHeight || window.innerHeight;
  };
  // scrollbars end

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

  const getShortName = (template) => {
    const fullName =
      template?.filename ||
      template?.replace(
        "https://wellnesswisodom.s3.ap-southeast-1.amazonaws.com/",
        ""
      );

    if (!fullName) return "";

    if (fullName.length <= 20) return fullName;

    const extStart = fullName.lastIndexOf(".") - 5;

    return `${fullName.substring(0, 5)}...${fullName.substring(extStart)}`;
  };

  const getShortImgName = (image) => {
    const fullName = image?.filename || image?.file_name;

    if (!fullName) return "";

    if (fullName.length <= 20) return fullName;

    const extStart = fullName.lastIndexOf(".") - 5;

    return `${fullName.substring(0, 5)}...${fullName.substring(extStart)}`;
  };

  const onClickPublish = async () => {
    setIsLoading(true);

    const updateForm = {
      ...formData,
    };
    console.log({ template });
    console.log({ image });

    try {
      const body = {
        template_name: updateForm.templateName.value,
        category_id: updateForm.category.value,
        sub_category_id: updateForm.subCategory.value,
        base64_data: template?.base64_data,
        filename: template?.filename,
        cover_image: {
          url: image.file_url,
          file_name: image.file_name,
        },
        type: isPaid ? "paid" : "free",
      };

      console.log("updatedata", body);

      const response = await updateTemplateById(
        body,
        templateData?.template_id
      );
      console.log("response", response);

      if (response?.data?.data) {
        const jobId = response?.data?.data?.job_id;
        if (!jobId) {
          notification.success({
            message: "Success",
            description: "Template Update Successfully!",
            placement: "topRight",
            duration: 4,
          });

          setIsLoading(false);

          clearAll();
        } else {
          const interval = setInterval(async () => {
            const progressResponse = await jobProgress(jobId);
            console.log(progressResponse);
            setProgress(0);
            const percentage = progressResponse.data?.progress || 0;

            setProgress(percentage);

            if (percentage >= 100) {
              clearInterval(interval);
              setIsLoading(false);

              notification.success({
                message: "Success",
                description: "Template Update Successfully!",
                placement: "topRight",
                duration: 4,
              });

              setIsLoading(false);

              clearAll();
            }
          }, 1000);
        }

        console.log("Success");
      } else {
        setIsLoading(false);

        notification.error({
          message: "Error",
          description: "Template Update Failed!",
          placement: "topRight",
          duration: 4,
        });
      }
    } catch (error) {
      console.log("Error ===", error);
      notification.error({
        message: "Error",
        description: "Template Update Failed!",
        placement: "topRight",
        duration: 4,
      });
      setIsLoading(false);
    }
  };

  const updateForm = { ...formData };
  return (
    <div className="flex flex-col justify-between w-full h-full mt-9">
      <div className="flex flex-col gap-6 w-full">
        <Scrollbar
          onScroll={handleOnScroll}
          renderView={(props) => (
            <div
              {...props}
              style={{
                ...props.style,
                overflowX: "hidden",
                margin: "20px",
              }}
            />
          )}
          // renderTrackVertical={(props) => (
          //   <div
          //     {...props}
          //     style={{
          //       ...props.style,
          //       width: "6px",
          //       right: "2px",
          //       bottom: "2px",
          //       top: "2px",
          //       borderRadius: "3px",
          //       backgroundColor: "#f0f0f0", // ← light track color
          //     }}
          //   />
          // )}
          // renderThumbVertical={(props) => (
          //   <div
          //     {...props}
          //     style={{
          //       ...props.style,
          //       borderRadius: "3px",
          //       backgroundColor: "#c6c6c6", // ← lighter thumb color
          //     }}
          //   />
          // )}
          // ScrollbarsCustom-Wrapper={(props) => (
          //   <div
          //     {...props}
          //     style={{
          //       ...props.style,
          //       marginLeft: "10px",
          //     }}
          //   />
          // )}
          style={{
            height: viewPointHeight - 350,
            padding: "15px",
          }}
        >
          <div className="flex flex-row gap-8 w-full justify-between ">
            <InputBox
              data={updateForm.templateName}
              onChange={async (e) => {
                e.preventDefault();
                await handleChange(e.target.value, updateForm.templateName.key);
              }}
            />
            <CategorySelectBox
              data={{
                label: "Category",
                placeholder: "Ex: Wedding",
                category_id: templateData?.category_id,
              }}
              onChangeCategory={categorySelect}
            />
          </div>
          <div className="flex flex-row gap-8 w-full justify-between mt-6">
            <SubCategorySelectBox
              onChangeSubCategory={subCategorySelect}
              data={{
                category_id: updateForm.category.value,
                sub_category_id: templateData?.sub_category_id,
              }}
            />
            <TemplateTypeSwitch
              value={isPaid}
              onChange={() => setIsPaid(!isPaid)}
            />
          </div>
          <div className="flex flex-col gap-8 w-[470px] mt-6">
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
                isLoading: isLoading,
                imgUrl: image?.url,
                progress: progress,
              }}
              onChange={onChangeZip}
            />

            {template && (
              <>
                <ImageComponent
                  data={{
                    size: "w-auto h-[127px] rounded-16px mt-3 object-cover",
                    isActive: "bg-bg_4 text-font-hover",
                    name: getShortName(template),
                    fileSize: template?.size
                      ? (template?.size / 1000000).toFixed(2) + "MB"
                      : "-",
                    isLoading: isLoading,
                    progress: progress,
                  }}
                  onClickRemove={() => {
                    setIsLoading(true);
                    setTemplate("");
                    setIsLoading(false);
                  }}
                />
              </>
            )}

            <ImgUploader
              data={{
                id: "img-upload",
                label: "Template cover image",
                accept: "image/png, image/jpeg, image/gif",
                description: "PNG, JPG, GIF up to 10MB",
                fileSize: 20,
                isLoading: isLoading,
                imgUrl: image?.url,
                progress: progress,
              }}
              onChange={onChangeImage}
            />

            {image && (
              <>
                <ImageUploaderPreview
                  data={{
                    size: "w-auto h-[127px] rounded-16px mt-3 object-cover",
                    isActive: !isLoading ? "bg-bg_4 text-font-hover" : "",
                    imgUrl: image?.file_url || image?.url,
                    name: getShortImgName(image),
                    fileSize: image?.size
                      ? (image?.size / 1000000).toFixed(2) + "MB"
                      : "-",
                    isLoading: isLoading,
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
            )}
          </div>
        </Scrollbar>
      </div>

      <div className="flex flex-row gap-8 mt-24 w-full justify-between">
        <Button
          content="Cancel"
          className={
            updateForm.templateName.value !== "" ||
            updateForm.category.value !== "" ||
            updateForm.subCategory.value !== "" ||
            image?.url ||
            template?.base64_data
              ? "text-black bg-white border-black border-x_sm mr-2 "
              : "text-black bg-white border-black border-x_sm mr-2"
          }
          isActive={"text-black bg-white border-black"}
          isLoading={isLoading}
          onClick={async (e) => {
            e.preventDefault();
            dispatch(closeTemplateEditModal());
          }}
        />
        <Button
          content="Publish"
          className={
            updateForm.templateName.value !== "" ||
            updateForm.category.value !== "" ||
            updateForm.subCategory.value !== "" ||
            image?.url ||
            template?.base64_data
              ? "text-white bg-black border-black border-[1px]"
              : "bg-border-deafult text-disable hover:bg-border-deafult hover:text-disable cursor-default"
          }
          isActive="text-white bg-black border-black"
          isLoading={isLoading}
          onClick={async (e) => {
            e.preventDefault();
            onClickPublish();
          }}
        />
      </div>
      {isLoading && progress > 0 && (
        <div className="top-0 h-full w-full left-0 bottom-0 right-0 fixed bg-black/35 z-[1000] ">
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
  );
};

export default Content;
