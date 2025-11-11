import React from "react";
import Tag from "../tag";
import TextButton from "../textButton";
import { withRouter } from "react-router-dom/cjs/react-router-dom";

const TemplateViewCard = ({
  data,
  onClickDelete,
  onClickEdit,
  onClickView,
}) => {
  return (
    <div className="flex flex-row p-6 items-center justify-between border-b border-b-border-primary hover:bg-secondary  ">
      <div className="flex flex-row justify-center items-center">
        <img
          src={data.img}
          alt="image"
          className="w-[74px] h-[91px] object-cover"
        />
        <div className="flex flex-col gap-[6px] font-manrope text-md ml-32">
          <div className="text-font-default font-bold">{data.tempName}</div>
          <div className="text-font-secondary font-medium">#{data.id}</div>
        </div>

        <div className="flex flex-col gap-[6px] font-manrope text-md ml-9">
          <div className="text-font-default font-bold">{data.category}</div>
          <div className="text-font-secondary font-medium">
            {data.subCategory}
          </div>
        </div>
        <div className="flex flex-row gap-32 ml-32">
          <Tag
            data={{
              name: data.tag1,
            }}
          />
          <Tag
            data={{
              name: data.tag2,
            }}
          />
        </div>
      </div>
      <div className="flex flex-row gap-8">
        <TextButton
          data={{
            name: "Delete",
          }}
          onClick={onClickDelete}
        />
        <TextButton
          data={{
            name: "Edit",
          }}
          onClick={onClickEdit}
        />
        <TextButton
          data={{
            name: "View",
          }}
          onClick={onClickView}
        />
      </div>
    </div>
  );
};

export default withRouter(TemplateViewCard);
