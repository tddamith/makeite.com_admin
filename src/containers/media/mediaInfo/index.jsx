import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import Button from "../../../components/button";
import { AddIcon } from "../../../config/icon";

const Index = () => {
  const selectMediaData = useSelector(
    (state) => state.mediaReducer.selectMediaData,
  );
  const isActive = useSelector((state) => state.mediaReducer.isActive);

  const [viewPointWidth, setViewPointWidth] = useState(0);
  const [viewPointHeight, setViewPointHeight] = useState(0);
  const [isActiveShadow, setIsActiveShadow] = useState(false);

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

  useEffect(() => {
    updateWindowDimensions();
    window.addEventListener("resize", updateWindowDimensions);
    window.addEventListener("scroll", handleOnScroll);

    return () => {
      window.removeEventListener("resize", updateWindowDimensions);
      window.removeEventListener("scroll", handleOnScroll);
    };
  }, [updateWindowDimensions, handleOnScroll]);

  if (!isActive) return null;

  const mediaUrl =
    "https://dev-v26.s3.eu-north-1.amazonaws.com" + selectMediaData?.Key;

  return (
    <div className="mt-3 w-full flex flex-col gap-3">
      {/* Image Preview */}
      <div className="border border-gray-200 w-full">
        <img
          src={mediaUrl}
          alt="media"
          className="w-full h-auto object-contain"
        />
      </div>

      {/* Media Name */}
      <div className="text-sm text-gray-700">
        <label className="font-semibold block">Media name</label>
        <p className="break-all">{selectMediaData?.Key}</p>
      </div>

      {/* URL */}
      <div className="text-sm">
        <label className="font-semibold block">URL</label>
        <div className="flex items-center justify-between bg-gray-50 p-2 rounded">
          <span className="truncate text-xs">{mediaUrl}</span>
          <button
            onClick={() => navigator.clipboard.writeText(mediaUrl)}
            className="ml-2 text-purple-600 hover:text-purple-800"
          >
            {AddIcon("copy")}
          </button>
        </div>
      </div>

      {/* Size */}
      <div className="text-sm">
        <label className="font-semibold block">Size</label>
        <p>{selectMediaData?.Size}</p>
      </div>

      {/* Delete Button */}
      <div className="mt-5">
        <Button content="Delete" size="md" type="btn-delete full-width-100" />
      </div>
    </div>
  );
};

export default Index;
