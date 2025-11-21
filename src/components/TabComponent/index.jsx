import React, { useState } from "react";
import "./styles.css";
import { Tabs } from "antd";

const { TabPane } = Tabs;

const TabComponent = ({ items, onChange }) => {
  const [tabList, setTabList] = useState([]);
  let elementContent = null;

  elementContent = (
    <>
      <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
    </>
  );
  return <div className={"tab-component-wrapper"}>{elementContent}</div>;
};

export default TabComponent;
