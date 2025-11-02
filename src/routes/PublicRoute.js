import React from "react";
import { Redirect, Route } from "react-router-dom";
//import { isLogin } from '../utils';

const PublicRoute = ({ component: Component, restricted, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        false ? <Redirect to="/" /> : <Component {...props} />
      }
    />
  );
};

export default PublicRoute;
