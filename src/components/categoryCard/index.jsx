import React from "react";
import Tag from "../tag";
import TextButton from "../textButton";

const CategoryCard = ({ data, onClickEdit, onClickDelete }) => {
  return (
    <div
      className={`flex flex-row gap-5 justify-between items-center p-5 text-sm font-semibold font-manrope border-b-disable_3  hover:text-primary hover:bg-secondary active:text-primary active:bg-secondary cursor-pointer  ${data?.isSelect}`}
    >
      <div className="container flex flex-row justify-between gap-5 items-center">
        {data?.image && (
          <div className="">
            <img src={data?.image} alt="Category image" />
          </div>
        )}
        <div className="flex flex-col gap-1 justify-center font-manrope text-sm ">
          <div className="">{data?.Category}</div>
          <div className="">{data?.code}</div>
        </div>
        <div className="flex flex-col gap-1 justify-center font-manrope text-sm ">
          <div className="">{data?.subCategory}</div>
        </div>

        <div className="">
          <Tag
            data={{
              name: data?.status,
              style: {
                backgroundColor:
                  data?.status === "Active" ? "#E6F4EA" : "#FDEDED",
              },
            }}
          />
        </div>
        <div className="">
          <TextButton data={{ name: "Edit" }} onClick={onClickEdit} />
        </div>
        <div className="">
          <TextButton data={{ name: "Delete" }} onClick={onClickDelete} />
        </div>
      </div>
    </div>
  );
};

export default CategoryCard;
