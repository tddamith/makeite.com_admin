import React from "react";
import { Switch } from "react-router-dom";
import Admin from "../containers/admin";
import SignInComponent from "../containers/signIn";
import PublicRoute from "./PublicRoute";
import DesignGuidComponent from "../designGuide";

function AppRouter() {
  return (
    <Switch>
      <PublicRoute component={Admin} path="/" exact />
      <PublicRoute component={Admin} path="/templates" exact />
      <PublicRoute component={SignInComponent} path="/sign-in" exact />
      <PublicRoute component={DesignGuidComponent} path="/design-guide" exact />
    </Switch>
  );
}

export default AppRouter;
