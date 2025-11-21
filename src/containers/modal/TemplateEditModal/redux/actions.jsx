import TemplateReducer from "./reducer";

export const openTemplateEditModal = (payload) => (dispatch) => {
  dispatch(TemplateReducer.actions.openTemplateEditModal(payload));
};

export const closeTemplateEditModal = () => (dispatch) => {
  dispatch(TemplateReducer.actions.closeTemplateEditModal());
};
