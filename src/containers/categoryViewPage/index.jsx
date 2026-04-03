import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import { App as AntdApp } from "antd";
import Spinner from "../../components/spinner";
import TextButton from "../../components/textButton";
import CategoryCard from "../../components/categoryCard";
import CreateNewCategory from "../createNewItem/createNewCategory";
import FormHeader from "../../components/formHeader";

const CategoryViewPage = () => {
  const { notification } = AntdApp.useApp();
  const [tempList, setTempList] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [pageNo, setPageNo] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [pageCount, setPageCount] = useState(20);
  const [count, setCount] = useState("");

  const [filteredList, setFilteredList] = useState([]);
  const { isRefresh } = useSelector(({ templateReducer }) => templateReducer);

  const dispatch = useDispatch();

  return (
    <>
      {isLoading && (
        <>
          <div
            className="flex fixed flex-col justify-center items-center w-full h-full z-[1001] inset-0 
      bg-white/30 
      transition duration-300
      backdrop-blur-sm"
          >
            <Spinner className="w-24 h-24  text-purple-400 animate-spin" />
            <div className="font-manrope text-black text-md font-semibold mt-5">
              Please wait. your request is being processed...
            </div>
          </div>
        </>
      )}
      {/* left side */}
      <div className="grid grid-cols-12 w-full h-full">
        <div className="col-span-9 border-r border-disable_2 flex flex-col p-1 h-[100%]">
          {/* {tempList.length > 0 ? ( */}
          <>
            <div className=" bg-disable_2 text-md text-disable   ">
              <div className="container grid grid-cols-4 items-center py-5 font-manrope font-bold  ">
                <div className="">Category</div>
                <div className="">Sub Category</div>
                <div className="">Status</div>
              </div>
            </div>

            <div className="flex flex-col mt-4  ">
              <CategoryCard
                data={{
                  // isSelect={""}
                  category: "Flower",
                  code: "f101",
                  subCategory: "wish",
                  status: "Active",
                }}
                onClickEdit={() => {}}
                onClickDelete={() => {}}
              />
            </div>
          </>
          {/* ) : (
        <>
          <div
            className="flex flex-row justify-start items-center p-3"
            style={{ marginBottom: "20px", paddingTop: "20px" }}
          >
            <div>0 Category Found</div>
          </div>
          <div className="container">
            <div className="flex flex-col w-full h-full justify-center  items-center mt-28">
              <img
                src={require("../../assets/img/icon.png")}
                alt="icon"
                className="w-[158px] h-[158px] "
              />
              <div className="flex flex-col justify-center gap-[10px] p-1 font-manrope font-normal">
                <div className="text-x_lg text-font-default">
                  Category not found
                </div>
                <div className="text-sm text-font-secondary">
                  It looks like there aren't any categories here yet.
                </div>
              </div>
            </div>
          </div>
        </>
      )} */}
        </div>
        {/* right side */}
        <div className="col-span-3 p-5">
          <CreateNewCategory />
        </div>
      </div>
    </>
  );
};

export default CategoryViewPage;
