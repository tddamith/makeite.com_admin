import MediaReducer from "./reducer";

export const viewMediaInfo = (payload) => (dispatch) => {
  dispatch(MediaReducer.actions.viewMediaInfo(payload));
};

export const clearMediaInfo = () => (dispatch) => {
  dispatch(MediaReducer.actions.clearMediaInfo());
};
