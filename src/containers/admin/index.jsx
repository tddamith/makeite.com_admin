import React from "react";
import LeftMenuCard from "../templates/LeftMenuCard";
import Template from "../templatePage";
import SignIn from "../signIn";

const Admin = (props) => {
  const { location } = props;
  return (
    <>
      <div className="w-full">
        <LeftMenuCard />

        <div className="ml-[250px] ">
          {location.pathname === "/templates" && (
            <>
              <Template />
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Admin;
