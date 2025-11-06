import { BrowserRouter as Router } from "react-router-dom/cjs/react-router-dom.min";
import "./App.css";

import AppRouter from "./routes/AppRouter";
import { ReactNotifications } from "react-notifications-component";
import "react-notifications-component/dist/theme.css";
const createHistory = require("history");

function App() {
  return (
    <>
      <Router history={createHistory}>
        <ReactNotifications />
        <AppRouter />
      </Router>
    </>
  );
}

export default App;
