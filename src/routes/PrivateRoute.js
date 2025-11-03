import React from "react";
import { Redirect, Route } from "react-router-dom";
// import {isLogin} from "../utils/auth";

const PrivateRoute = ({ component: Component, ...rest }) => {
  console.log("Private Route event fire....", isLogin());
  return (
    <Route
      {...rest}
      render={(props) =>
        isLogin() ? <Component {...props} /> : <Redirect to="/" />
      }
    />
  );
};

export default PrivateRoute;
