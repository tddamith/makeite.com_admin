import React, { useState } from "react";
import FormHeader from "../../../components/formHeader";
import ItemCard from "../../../components/itemCard";

const ViewStore = () => {
  return (
    <>
      <div className="flex flex-col ">
        <div className="p-6 border-b border-border-primary flex flex-row align-center justify-between">
          <FormHeader title="View All Store" />
        </div>

        <div className="flex flex-row p-5 font-manrope font-bold bg-disable_2 text-md text-disable justify-between  ">
          <div className="container flex flex-row justify-between">
            <div className="">Item</div>
            <div className="">Category</div>
            <div className="">Quantity</div>
            <div className="">Price</div>
            <div className="">Status</div>
          </div>
        </div>
        <div className="flex flex-col mt-4  ">
          <ItemCard
            data={{
              // isSelect={""}
              // image={""}
              item: "Flower",
              code: "f101",
              category: "Wedding",
              subCategory: "wish",
              quantity: "1",
              price: "Rs.3000.00",
              status: "Active",
            }}
            // onClick={() => {}}
          />
        </div>
      </div>
    </>
  );
};

export default ViewStore;
