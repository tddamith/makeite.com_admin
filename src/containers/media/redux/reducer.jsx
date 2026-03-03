import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  activeKey: null,
  isActive: false,
  selectMediaData: [],
};

const MediaReducer = createSlice({
  name: "MediaReducer",
  initialState: initialState,
  reducers: {
    viewMediaInfo: (state, { payload }) => {
      return {
        ...state,
        selectMediaData: payload,
        isActive: true,
      };
    },

    clearMediaInfo: (state) => {
      return {
        ...state,
        selectMediaData: [],
        isActive: false,
      };
    },
  },
});
export default MediaReducer;
