import React, { useState } from "react";
import ArrowButton from "../../../components/arrowButton";
import Content from "./content";
import { Tabs } from "antd";
import TabPane from "antd/es/tabs/TabPane";
import { useDispatch, useSelector } from "react-redux";
import { closeTemplateEditModal } from "./redux/actions";
import TabComponent from "../../../components/TabComponent";

const TemplateEdit = () => {
  const [activeTab, setActiveTab] = useState(1);

  const dispatch = useDispatch();
  const { isOpenTemplateEditModal, templateData } = useSelector(
    ({ templateReducer }) => templateReducer
  );

  const tabJson = [
    {
      id: 1,
      key: 1,
      label: "Index.html",
      // children: <AllOrders />,
    },
    {
      id: 2,
      key: 2,
      label: "manifest.json",
      // children: <ShippingOrders />,
    },
    {
      id: 3,
      key: 3,
      label: "Content",
      children: <Content />,
    },
  ];
  const onChangeTab = (key) => {
    setActiveTab(Number(key));
    console.log({ key });
  };

  return (
    <>
      <div
        className={`flex flex-row fixed z-[999] animate_animated p-8 bg-white overflow-hidden shadow-md  w-full h-full  ${
          isOpenTemplateEditModal
            ? "block animate__fadeInUp "
            : "none animate__fadeOutDown"
        }`}
      >
        <div className="w-full flex flex-col h-full columns-24">
          <>
            <div className="flex flex-row items-center gap-3 mb-8">
              <ArrowButton onClick={() => dispatch(closeTemplateEditModal())} />
              <div className="font-manrope text-black text-sm font-extrabold items-center">
                Back
              </div>
            </div>
            {/* <Tabs onChange={onChangeTab}>
              {((tabJson && tabJson) || []).map((i, t) => (
                <TabPane tab={i.label} key={i.key}>
                  {i.key === 1 && (
                    <>
                      <div className="w-full"></div>
                    </>
                  )}
                  {i.key === 2 && (
                    <>
                      <div className="w-full"></div>
                    </>
                  )}
                  {i.key === 3 && (
                    <>
                      <div className="flex mt-5 ">
                        <Content />
                      </div>
                    </>
                  )}
                </TabPane>
              ))}
            </Tabs> */}
            <TabComponent items={tabJson} onChange={onChangeTab} />
          </>
        </div>
        <div className="flex w-full h-full justify-center columns-12  ">
          {activeTab === 3 && (
            <img
              src={
                templateData ? (
                  templateData?.cover_image?.url
                ) : (
                  <div className="flex flex-col justify-center items-center">
                    <img src={require("../../../assets/img/icon1.png")} />
                    <div className="text-lg font-bold">
                      Template Image Not Found{" "}
                    </div>
                  </div>
                )
              }
              alt="Template preview"
            />
          )}
        </div>
      </div>
    </>
  );
};

export default TemplateEdit;
