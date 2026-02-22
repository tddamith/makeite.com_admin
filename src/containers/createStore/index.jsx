import React, { useState } from "react";
import FormHeader from "../../components/formHeader";
import InputBox from "../../components/inputBox";
import TextArea from "../../components/textArea";
import CategorySelectBox from "../../components/categorySelectBox";
import ImageUploaderPreview from "../../components/imageUploaderPreview";
import ImgUploader from "../../components/imgUploader";
import { CheckValidity } from "../../utils/formValidity";
import TemplateTypeSwitch from "../../components/switchButton";
import Button from "../../components/button";

const CreateStore = () => {
  const [image, setImage] = useState("");
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [formData, setFormData] = useState({
    itemName: {
      key: "itemName",
      label: "Item Name",
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
    itemCode: {
      key: "itemCode",
      label: "Item Code",
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
    description: {
      key: "description",
      label: "Description",
      size: "md",
      isShowRequired: false,
      placeholder: "-",
      elementConfig: {
        type: "text",
      },
      touched: false,
      validation: {
        required: true,
      },
      isValid: false,
      invalidReason: "",
      value: "",
    },
    quantity: {
      key: "quantity",
      label: "Quantity",
      size: "md",
      isShowRequired: false,
      elementConfig: {
        type: "number",
        placeholder: "0",
      },
      touched: false,
      validation: {
        required: true,
      },
      isValid: false,
      invalidReason: "",
      value: "",
    },
    price: {
      key: "price",
      label: "Price",
      size: "md",
      isShowRequired: false,
      elementConfig: {
        type: "number",
        placeholder: "-",
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

  const onChangeImage = (image) => {
    console.log(image);
    try {
      if (image) {
        let file = {
          url: image.file_url,
          file_name: image.file_name,
        };

        setImage(image);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  //  const onClickRemoveImage = async (key) => {
  //    setIsLoading(true);
  //    try {
  //      const res = await deleteImage(key);
  //      console.log("remove image", res);

  //      setImage("");
  //      if (res?.data) {
  //        notification.success({
  //          message: "Success",
  //          description: "Image Delete successfully",
  //          placement: "topRight",
  //          duration: 4,
  //        });
  //      }

  //      setIsLoading(false);
  //    } catch (error) {
  //      console.log("Error in deleting image", error);
  //      notification.error({
  //        message: "Error",
  //        description: "Image Delete failed",
  //        placement: "topRight",
  //        duration: 4,
  //      });
  //      setIsLoading(false);
  //    }
  //  };

  const handleChange = async (event, inputIdentity) => {
    const updateForm = {
      ...formData,
    };

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
      console.log("required_validation", validityRes);

      let formIsValid = false;
      for (let inputIdentifier in updateForm) {
        formIsValid = updateForm[inputIdentifier].valid && formIsValid;
      }
      console.log("formIsValid", formIsValid);
      setFormData(updateForm);
    }
  };

  const updateForm = { ...formData };

  return (
    <>
      <div className="flex flex-col">
        <div className="p-6 border-b border-border-primary flex flex-row align-center justify-between">
          <FormHeader title="Create New Store" />
        </div>

        <div className="flex flex-col p-8 w-[550px] mt-4 border border-disable_3 rounded-md gap-3 justify-center container">
          <InputBox
            data={updateForm.itemName}
            onChange={async (e) => {
              e.preventDefault();
              await handleChange(e.target.value, updateForm.itemName.key);
            }}
          />
          <InputBox
            data={updateForm.itemCode}
            onChange={async (e) => {
              e.preventDefault();
              await handleChange(e.target.value, updateForm.itemCode.key);
            }}
          />
          <CategorySelectBox
            data={{ label: "Category", placeholder: "Ex: Wedding" }}
            onChangeCategory={categorySelect}
          />

          <TextArea
            data={updateForm.description}
            onChange={async (e) => {
              e.preventDefault();
              await handleChange(e.target.value, updateForm.description.key);
              // if (selectedElement) {
              //   updateElement(selectedElement.id, {
              //     text: e.target.value,
              //   });
              // }
            }}
          />
          <InputBox
            data={updateForm.quantity}
            onChange={async (e) => {
              e.preventDefault();
              await handleChange(e.target.value, updateForm.quantity.key);
            }}
          />
          <InputBox
            data={updateForm.price}
            onChange={async (e) => {
              e.preventDefault();
              await handleChange(e.target.value, updateForm.price.key);
            }}
          />
          <>
            {image ? (
              <>
                <h2 className="text-md font-medium text-font-default font-manrope  mb-2px">
                  Item Image
                </h2>

                <ImageUploaderPreview
                  data={{
                    size: "w-auto h-[127px] rounded-16px mt-3 object-cover",
                    isActive: !isLoading ? "bg-bg_4 text-font-hover" : "",
                    imgUrl: image?.file_url,
                    name:
                      image?.filename?.length > 20
                        ? `${image?.filename.substring(
                            0,
                            5,
                          )}...${image?.filename.substring(
                            image?.filename.lastIndexOf(".") - 5,
                          )}`
                        : image?.filename,
                    fileSize: (image?.size / 1000000).toFixed(2) + "MB",
                    isLoading: isLoading,
                  }}
                  // onClickRemove={() => {
                  //   setIsLoading(true);
                  //   if (template?.template_id) {
                  //     setImage("");
                  //   } else {
                  //     onClickRemoveImage(image?.data?.file_name, "image");
                  //   }
                  //   setIsLoading(false);
                  // }}
                />
              </>
            ) : (
              <ImgUploader
                data={{
                  id: "img-upload",
                  label: "Item Image",
                  accept: "image/png, image/jpeg, image/gif",
                  description: "PNG, JPG, GIF up to 10MB",
                  isLoading: isLoading,
                  imgUrl: "",
                  progress: progress,
                }}
                onChange={onChangeImage}
              />
            )}
          </>
          <TemplateTypeSwitch
            name="Status"
            value={isActive}
            onChange={() => setIsActive(!isActive)}
          />
          <Button
            content="Save"
            // className={
            //   updateForm.itemName.value !== "" ||
            //   updateForm.itemCode.value !== "" ||
            //   updateForm.category.value !== "" ||
            //   updateForm.description.value !== "" ||
            //   updateForm.price.value !== "" ||
            //   image?.url
            //     ? "text-white bg-black"
            //     : "bg-border-deafult text-disable hover:bg-border-deafult hover:text-disable cursor-default"
            // }
            // isActive={
            //   updateForm.templateName.value !== "" ||
            //   updateForm.itemCode.value !== "" ||
            //   updateForm.category.value !== "" ||
            //   updateForm.description.value !== "" ||
            //   updateForm.price.value !== "" ||
            //   image?.url
            //     ? "text-white bg-black"
            //     : "bg-border-deafult text-disable hover:bg-border-deafult hover:text-disable cursor-default"
            // }
            isLoading={isLoading}
            onClick={async (e) => {
              setIsLoading(true);
              e.preventDefault();
              // await onClickSave(e);
            }}
          />
        </div>
      </div>
    </>
  );
};

export default CreateStore;
