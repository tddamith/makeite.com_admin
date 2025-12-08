import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  isOpenTemplateEditModal: false,
  templateData: "",
  isUpdate: false,
  isRefresh: false,
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
  },
});
export default TemplateReducer;
