import React, { useEffect } from "react";
import LeftMenuCard from "../templates/LeftMenuCard";
import Template from "../templatePage";
import { useDispatch, useSelector } from "react-redux";
import { TemplateEditModal } from "../modal";
import { validateToken } from "../signIn/service/auth.service";
import { getTokenRefresh, login } from "../../utils/auth";

const Admin = (props) => {
  const { location } = props;
  const { isOpenTemplateEditModal } = useSelector(
    ({ templateReducer }) => templateReducer
  );

  useEffect(() => {
    // validate token
    const validateUserToken = async () => {
      try {
        const refresh_token = getTokenRefresh();
        const body = {
          refresh_token,
        };
        const response = await validateToken(body);
        if (response.data?.status) {
          login(response?.data?.token, response?.data?.refresh_token);
          console.log("Token is valid");
        } else {
          console.log("Token is invalid, redirecting to sign-in");
        }
      } catch (error) {
        console.error("Error validating token:", error);
      }
    };
  }, []);

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
