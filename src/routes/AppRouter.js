import React from "react";
import { Switch } from "react-router-dom";
import Admin from "../containers/admin";
import PublicRoute from "./PublicRoute";

function AppRouter() {
  return (
    <Switch>
      <PublicRoute component={Admin} path="/" exact />
      <PublicRoute component={Admin} path="/templates" exact />
    </Switch>
  );
}

export default AppRouter;
