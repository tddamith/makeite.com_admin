import React, { useState, useEffect, useCallback } from "react";
import Scrollbar from "react-scrollbars-custom";
import { useDispatch } from "react-redux";
import FormHeader from "../../../components/formHeader";
import { getAllMedia } from "../service/media.service";

const Index = (props) => {
  const dispatch = useDispatch();

  const [viewPointWidth, setViewPointWidth] = useState(0);
  const [viewPointHeight, setViewPointHeight] = useState(0);
  const [isActiveShadow, setIsActiveShadow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);

  // scrollbars start
  useEffect(() => {
    updateWindowDimensions();
    window.addEventListener("resize", updateWindowDimensions);
    window.addEventListener("scroll", handleOnScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    return () => {
      window.removeEventListener("scroll", handleOnScroll);
      window.removeEventListener("resize", updateWindowDimensions);
    };
  }, []);

  const updateWindowDimensions = () => {
    setViewPointWidth(window.innerWidth);
    setViewPointHeight(window.innerHeight);
  };

  const handleOnScroll = () => {
    let scrollTop =
      (document.documentElement && document.documentElement.scrollTop) ||
      document.body.scrollTop;
    let scrollHeight =
      (document.documentElement && document.documentElement.scrollHeight) ||
      document.body.scrollHeight;
    let clientHeight =
      document.documentElement.clientHeight || window.innerHeight;
  };
  // scrollbars end

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
    getAll();
  }, []);

  return (
    // use tailwind for this page, no need to use scss
    <div className=" w-full h-full">
      <div className="p-6 border-b border-border-primary flex flex-row align-center justify-between">
        <FormHeader title="Media" />
      </div>

      <div className="">
        <Scrollbar
          onScroll={handleOnScroll}
          renderView={(props) => (
            <div
              {...props}
              style={{
                ...props.style,
                overflowX: "hidden",
                margin: "20px",
              }}
            />
          )}
          style={{
            height: viewPointHeight - 350,
            padding: "15px",
          }}
        >
          <div className="border-b border-gray-200">
            <div className="p-4">
              <div className="flex flex-wrap">
                {dataSource?.map((item, index) => (
                  <div
                    key={index}
                    className="w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 p-2"
                  >
                    <div
                      className="flex flex-col h-[100px] overflow-hidden rounded-xl border border-gray-200 p-3 cursor-pointer hover:border-gray-300 transition"
                      onClick={() => props.onClickSelectMedia(item)}
                    >
                      <div className="h-[80px] mb-1 flex items-center justify-center">
                        <img
                          src={`https://cco-media-v4.s3.ap-southeast-1.amazonaws.com/${item.Key}`}
                          alt="media"
                          className="w-full h-full object-contain"
                        />
                      </div>

                      <div className="text-[10px] mt-2 truncate">
                        {item.Key}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Scrollbar>
      </div>
    </div>
  );
};

export default Index;
