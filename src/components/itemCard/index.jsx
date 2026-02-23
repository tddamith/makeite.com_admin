import React from "react";
import Tag from "../tag";

const ItemCard = ({ data, onClick }) => {
  return (
    <div
      className={`flex flex-row gap-5 justify-between items-center p-2 text-sm font-semibold font-manrope border-b-disable_3  hover:text-primary hover:bg-secondary active:text-primary active:bg-secondary cursor-pointer  ${data?.isSelect}`}
      onClick={onClick}
    >
      <div className="container flex flex-row justify-between gap-5 items-center">
        {data?.image && (
          <div className="">
            <img src={data?.image} alt="item image" />
          </div>
        )}
        <div className="flex flex-col gap-1 justify-center font-manrope text-sm ">
          <div className="">{data?.item}</div>
          <div className="">{data?.code}</div>
        </div>
        <div className="flex flex-col gap-1 justify-center font-manrope text-sm ">
          <div className="">{data?.category}</div>
          <div className="">{data?.subCategory}</div>
        </div>
        <div className="">{data?.quantity}</div>
        <div className="">{data?.price}</div>
        <div className="">
          <Tag
            data={{
              name: data?.status,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
