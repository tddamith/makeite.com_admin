import { BrowserRouter as Router } from "react-router-dom/cjs/react-router-dom.min";
import "./App.css";

import AppRouter from "./routes/AppRouter";
const createHistory = require("history");

function App() {
  return (
    <>
      <Router history={createHistory}>
        <AppRouter />
      </Router>
    </>
  );
}

export default App;
