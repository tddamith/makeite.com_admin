import React, { useState } from "react";
import MenuButtonCard from "../../../components/menuButton";

import { AddIcon } from "../../../config/icon";

import Logo from "../../../components/logo";
import VersionLabel from "../../../components/versionLabel";
import { withRouter } from "react-router-dom/cjs/react-router-dom";

const Index = (props) => {
  const [menuName, setMenuName] = useState("");

  return (
    <>
      <div className="flex flex-col w-[250px] h-full border-boder-primary border-r-x_sm px-[24px] py-8 fixed justify-between">
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
          </div>
        </div>
        <div className="">
          <VersionLabel />
        </div>
      </div>
    </>
  );
};

export default withRouter(Index);
