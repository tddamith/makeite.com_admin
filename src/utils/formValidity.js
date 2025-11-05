//import {GetTranslation} from "../language";
// import { validateUserPassword } from "./validators";
//import {formatCurrency} from "./commonHelpers";

export const CheckValidity = (fieldName, value, rules) => {
  let isValid = true;
  let reason = "";

  if (rules.required && typeof value === "string") {
    isValid = value.trim() !== "" && isValid;
  }

  if (rules.regex && rules.regex !== "") {
    isValid = new RegExp(rules.regex).test(String(value)) && isValid;
  }

  if (rules.email) {
    const re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    isValid = re.test(String(value).toLowerCase()) && isValid;
  }

  if (rules.url) {
    const re =
      /(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?\/[a-zA-Z0-9]{2,}|((https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?)|(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}(\.[a-zA-Z0-9]{2,})?/g;
    isValid = re.test(String(value).toLowerCase()) && isValid;
  }

  if (rules.number) {
    const re = /^[0-9\b]+$/;
    if (!re.test(value)) {
      isValid = false;
    }
  }

  if (rules.currency) {
    return value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  // if (rules.password) {
  //   let res = validateUserPassword(value);
  //   if (!res.status) {
  //     isValid = false;
  //     if (!res.hasCharCount) {
  //       reason = "password length";
  //     } else if (!res.hasLower) {
  //       reason = "password lower case";
  //     } else if (!res.hasUpper) {
  //       reason = "password upper case";
  //     } else if (!res.hasSpecial) {
  //       reason = "password special char";
  //     } else {
  //       reason = "password should have number";
  //     }
  //   }
  // }

  if (rules.minLength && rules.maxLength) {
    if (value.toString().length < rules.minLength) {
      isValid = false;
      reason = "err_min_length_validation" + ` ${rules.minLength}`;
    } else if (value.toString().length > rules.maxLength) {
      isValid = false;
      reason = "err_max_length_validation" + ` ${rules.maxLength}`;
    } else {
      isValid = true;
    }
  }

  // if (rules.minValue && rules.maxValue) {
  //   if (value && parseFloat(value) >= rules.minValue) {
  //     isValid = true;
  //     if (value && parseFloat(value) <= rules.maxValue) {
  //       isValid = true;
  //     } else {
  //       reason = "lbl_should_be_smaller_than" + ` ${rules.maxValue}`;
  //       isValid = false;
  //     }
  //   } else {
  //     if (fieldName === "amount" || fieldName === "initialDeposit")
  //       reason =
  //         "err_msg_amount_should_be_larger_than" +
  //         ` ${formatCurrency(rules.minValue.toString())}`;
  //     else reason = "lbl_should_be_larger_than" + ` ${rules.minValue}`;
  //     isValid = false;
  //   }
  // } else {
  //   if (rules.minValue) {
  //     if (value && parseFloat(value) >= rules.minValue) {
  //       isValid = true;
  //     } else {
  //       if (fieldName === "amount")
  //         reason =
  //           "err_msg_amount_should_be_larger_than" +
  //           ` ${formatCurrency(rules.minValue.toString())}`;
  //       else reason = "lbl_should_be_larger_than" + ` ${rules.minValue}`;
  //       isValid = false;
  //     }
  //   }

  //   if (rules.maxValue) {
  //     if (value && parseFloat(value) <= rules.maxValue) {
  //       isValid = true;
  //     } else {
  //       if (fieldName === "changeLimit")
  //         reason = "lbl_new_limit_larger_than_max_limit";
  //       else reason = "lbl_should_be_smaller_than" + ` ${rules.maxValue}`;
  //       isValid = false;
  //     }
  //   }
  // }

  return { isValid, reason };
};
