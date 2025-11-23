import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  isOpenTemplateEditModal: false,
  templateData: "",
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
      };
    },
    setTemplateData: (state, { payload }) => {
      return {
        ...state,
        templateData: payload,
      };
    },
  },
});
export default TemplateReducer;
