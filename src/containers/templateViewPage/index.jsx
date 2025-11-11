import React, { useEffect, useState } from "react";
import TemplateViewCard from "../../components/templateViewCard";
import { getAllTemplates } from "../createNewItem/createNewTemplate/service/template.service";

const TemplateViewPage = () => {
  const [tempList, setTempList] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const getTemplateDetails = await getAllTemplates();
        console.log("Get All Templates", getTemplateDetails);

        if (getTemplateDetails?.data?.templates) {
          setTempList(getTemplateDetails?.data?.templates);
        } else {
          console.log("Data Not found");
        }
      } catch (error) {
        console.log("Error fetching Template", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex flex-col ">
      <div className="bg-bg_2 flex flex-row gap-40 font-manrope font-medium text-md text-font-default  p-6">
        <div className="ml-[200px]">Template name</div>
        <div className="">Category</div>
        <div className="">Type</div>
        <div className="">Status</div>
      </div>

      {Array.isArray(tempList) && tempList.length > 0
        ? tempList.map((template) => (
            <TemplateViewCard
              data={{
                img: template?.cover_image?.url,
                tempName: template?.template_name,
                id: template?.template_id,
                category: template?.category_name,
                subCategory: template?.sub_category_name,
                tag1: template?.type,
                tag2: template?.status,
              }}
            />
          ))
        : ""}
    </div>
  );
};

export default TemplateViewPage;
