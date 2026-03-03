import React, { useState, useEffect, useCallback, useMemo } from "react";
import { getAllMedia } from "./service/media.service";
import Scrollbar from "react-scrollbars-custom";
import { useSelector } from "react-redux";
import { Tabs } from "antd";
import { v4 as uuidv4 } from "uuid";
import Manual from "./mediaInfo/";
import Upload from "./upload/";

const { TabPane } = Tabs;

const Index = () => {
  const { selectMediaData, isActive } = useSelector(
    ({ mediaReducer }) => mediaReducer,
  );

  const [viewPointWidth, setViewPointWidth] = useState(0);
  const [viewPointHeight, setViewPointHeight] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);

  const tabJson = useMemo(
    () => [
      {
        id: uuidv4(),
        key: 1,
        tabName: "Media Info",
        content: <Manual />,
      },
      {
        id: uuidv4(),
        key: 2,
        tabName: "Upload",
        content: <Upload />,
      },
    ],
    [],
  );

  const updateWindowDimensions = useCallback(() => {
    setViewPointWidth(window.innerWidth);
    setViewPointHeight(window.innerHeight);
  }, []);

  const handleOnScroll = useCallback(() => {
    let scrollTop =
      (document.documentElement && document.documentElement.scrollTop) ||
      document.body.scrollTop;

    console.log("scrollTop : " + scrollTop);
  }, []);

  const getAll = async () => {
    try {
      setIsLoading(true);
      let response = await getAllMedia();
      console.log("get_all_media ==>", response?.data?.data);
      setDataSource(response?.data?.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    updateWindowDimensions();
    window.addEventListener("resize", updateWindowDimensions);
    window.addEventListener("scroll", handleOnScroll);

    getAll();

    return () => {
      window.removeEventListener("resize", updateWindowDimensions);
      window.removeEventListener("scroll", handleOnScroll);
    };
  }, [updateWindowDimensions, handleOnScroll]);

  return (
    <div className=" w-full h-full">
      <div className="p-6 border-b border-border-primary flex flex-row align-center justify-between">
        <Scrollbar
          style={{ height: viewPointHeight - 80 }}
          thumbMinSize={30}
          universal
          autoHide
        >
          <Tabs>
            {tabJson.map((tab) => (
              <TabPane tab={tab.tabName} key={tab.key}>
                {tab.content}
              </TabPane>
            ))}
          </Tabs>
        </Scrollbar>
      </div>
    </div>
  );
};

export default Index;
