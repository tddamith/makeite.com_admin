import { BrowserRouter as Router } from "react-router-dom/cjs/react-router-dom.min";
import "./App.css";
import store from "./store";
import AppRouter from "./routes/AppRouter";
import { Provider } from "react-redux";
const createHistory = require("history");

function App() {
  return (
    <>
      <Provider store={store}>
        <Router history={createHistory}>
          <AppRouter />
        </Router>
      </Provider>
    </>
  );
}

export default App;
