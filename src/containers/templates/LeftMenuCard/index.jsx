import React, { useState } from "react";
import MenuButtonCard from "../../../components/menuButton";

import { AddIcon } from "../../../config/icon";

import Logo from "../../../components/logo";
import VersionLabel from "../../../components/versionLabel";
import { withRouter } from "react-router-dom/cjs/react-router-dom";
import LogOutButton from "../../../components/logOutButton";
import { userLogOut } from "../../../utils/auth";

const Index = (props) => {
  const [menuName, setMenuName] = useState("");
  const { location } = props;

  return (
    <>
      <div className="flex flex-col w-[250px] h-full border-border-primary border-r-x_sm px-[24px] py-8 fixed justify-between">
        <div>
          <Logo />
          <div className="flex flex-col gap-4 mt-8 ml-[-10px]">
            <MenuButtonCard
              icon={AddIcon("home")}
              content={"Dashboard"}
              type={menuName === "dashboard"}
              onClick={() => setMenuName("Dashboard")}
            />
            <MenuButtonCard
              icon={AddIcon("fourCircles")}
              content={"Category"}
              onClick={() => setMenuName("Category")}
            />
            <MenuButtonCard
              icon={AddIcon("layout")}
              content={"Template"}
              isActive={location.pathname.includes("/templates")}
              onClick={() => {
                props.history.push("/templates");
                setMenuName("Template");
              }}
            />
            <MenuButtonCard
              icon={AddIcon("palette")}
              content={"Banner"}
              onClick={() => setMenuName("Banner")}
            />
            {/* <MenuButtonCard
              icon={AddIcon("store")}
              content={"Store"}
              isActive={location.pathname === "/store"}
              onClick={() => {
                props.history.push("/store");
                setMenuName("Store");
              }}
            /> */}
            <MenuButtonCard
              icon={AddIcon("store")}
              content="Store"
              isActive={
                location.pathname.includes("/store") || menuName === "Store"
              }
              onclick={() => {
                setMenuName("Store");
              }}
            >
              <div
                className={`cursor-pointer p-3 pl-6 mt-3 ml-4 font-manrope rounded-sm text-md text-disable font-bold hover:text-primary hover:bg-hover active:text-primary active:bg-hover ${
                  location.pathname === "/store/create-store"
                    ? "text-primary bg-hover"
                    : ""
                }`}
                onClick={() => {
                  props.history.push("/store/create-store");
                  setMenuName("create-store");
                }}
              >
                Create New Store
              </div>

              <div
                className={`cursor-pointer p-3 pl-6 ml-4 font-manrope rounded-sm text-md text-disable font-bold hover:text-primary hover:bg-hover active:text-primary active:bg-hover ${
                  location.pathname === "/store/view-store"
                    ? "text-primary bg-hover"
                    : ""
                }`}
                onClick={() => {
                  props.history.push("/store/view-store");
                  setMenuName("view-store");
                }}
                isActive={location.pathname === "/store/view-store"}
              >
                View All Stores
              </div>
            </MenuButtonCard>
          </div>
        </div>
        <div className=" flex flex-row justify-between">
          <VersionLabel />
          <LogOutButton
            onClick={async () => {
              const res = await userLogOut();
              if (res) {
                props.history.push("/sign-in");
              }
            }}
          />
        </div>
      </div>
    </>
  );
};

export default withRouter(Index);
