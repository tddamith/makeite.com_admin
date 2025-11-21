import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import TemplateReducer from "../../containers/modal/TemplateEditModal/redux/reducer";

const rootReducer = combineReducers({
  // categoryReducer: persistReducer(
  //   { key: "categoryReducer", storage: sessionStorage },
  //   CategoryReducer.reducer
  // ),
  templateReducer: persistReducer(
    { key: "templateReducer", storage: sessionStorage },
    TemplateReducer.reducer
  ),
});

export default rootReducer;
