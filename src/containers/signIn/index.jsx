import React, { useState } from "react";
import InputBox from "../../components/inputBox";
import Button from "../../components/button";
import { CheckValidity } from "../../utils/formValidity";
import bg from "../../assets/img/bg1.png";

import VersionLabel from "../../components/versionLabel";

const SignIn = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    userName: {
      key: "userName",
      label: "User Name",
      size: "md",
      isShowRequired: false,
      elementConfig: {
        type: "text",
        placeholder: "Ex : makeite@example.com",
      },
      touched: false,
      validation: {
        required: true,
      },
      isValid: false,
      invalidReason: "",
      value: "",
    },
    password: {
      key: "password",
      label: "Password",
      size: "md",
      isShowRequired: false,
      elementConfig: {
        type: "text",
        placeholder: "*************************",
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

    setFormData(updateForm);
  };
  const updateForm = { ...formData };

  return (
    <div className="flex flex-col w-full h-screen  my-0 mx-auto">
      <img
        src={bg}
        alt="background image"
        className="w-full h-full object-cover fixed top-0 left-0  z-10 "
      />
      {/* <img
        src={bgLine1}
        alt="background image"
        className="w-full h-auto object-cover absolute top-[150px] "
      /> */}

      <div className="flex flex-col z-30 my-8 mx-auto bg-white w-[425px] h-auto  rounded-md border-x_sm border-border-deafult font-manrope justify-center p-10 ">
        <img
          src={require("../../assets/img/logo.png")}
          alt="logo"
          className=" w-[250px] h-[88px] object-fill ml-11"
        />
        <div className="flex flex-col  mt-6 gap-5 ">
          <InputBox
            data={updateForm.userName}
            onChange={async (e) => {
              e.preventDefault();
              await handleChange(e.target.value, updateForm.userName.key);
            }}
          />
          <InputBox
            data={updateForm.password}
            onChange={async (e) => {
              e.preventDefault();
              await handleChange(e.target.value, updateForm.password.key);
            }}
          />
          <Button
            content="Sign In"
            className={
              updateForm.userName.value === "" ||
              updateForm.password.value === ""
                ? "text-white bg-black"
                : "bg-border-default text-disable"
            }
            isActive={
              updateForm.userName.value === "" ||
              updateForm.password.value === ""
                ? "text-white bg-black"
                : "bg-border-default text-disable"
            }
            isLoading={isLoading}
            //   onClick={async (e) => {
            //     setIsLoading(true);
            //     e.preventDefault();
            //     await onClickSave(e);
            //   }}
          />
        </div>
      </div>
      <div className="flex justify-center items-center">
        <VersionLabel style="text-center " />
      </div>
    </div>
  );
};

export default SignIn;
