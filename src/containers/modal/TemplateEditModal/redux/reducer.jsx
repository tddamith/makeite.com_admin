import { createSlice } from "@reduxjs/toolkit";
import { file } from "jszip";
const initialState = {
  isOpenTemplateEditModal: false,
  isOpenGenerateFileModal: false,
  templateData: "",
  isUpdate: false,
  isRefresh: false,
  fileData: "",
};

const TemplateReducer = createSlice({
  name: "TemplateReducer",
  initialState: initialState,
  reducers: {
    openTemplateEditModal: (state, { payload }) => {
      return {
        ...state,
        templateData: payload,
        isOpenTemplateEditModal: true,
      };
    },

    closeTemplateEditModal: (state) => {
      return {
        ...state,
        templateData: "",
        isOpenTemplateEditModal: false,
        isUpdate: false,
        isRefresh: true,
      };
    },
    setTemplateData: (state, { payload }) => {
      return {
        ...state,
        templateData: payload,
        isUpdate: true,
      };
    },
    doneRefresh: (state) => {
      return {
        ...state,
        isRefresh: false,
      };
    },
    openGenerateFileModal: (state, { payload }) => {
      return {
        ...state,
        fileData: payload,
        isOpenGenerateFileModal: true,
      };
    },

    closeGenerateFileModal: (state) => {
      return {
        ...state,
        fileData: "",
        isOpenGenerateFileModal: false,
      };
    },
  },
});
export default TemplateReducer;
