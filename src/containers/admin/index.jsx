import React from "react";
import LeftMenuCard from "../templates/LeftMenuCard";
import Template from "../templatePage";
import { useDispatch, useSelector } from "react-redux";
import { TemplateEditModal } from "../modal";

const Admin = (props) => {
  const { location } = props;
  const { isOpenTemplateEditModal } = useSelector(
    ({ templateReducer }) => templateReducer
  );

  return (
    <>
      {isOpenTemplateEditModal && <TemplateEditModal />}
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
