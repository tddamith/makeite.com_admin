import React from "react";
import { Pagination } from "antd";

const PaginationBar = ({ data, onChange, onclick }) => {
  let inputElement = null;
  inputElement = (
    <>
      <div className={"d-flex flex-row"}>
        <Pagination
          defaultCurrent={data.pageNo}
          total={data.paginationCount}
          pageSize={data.pageSize || 5}
          onChange={onChange}
          showSizeChanger
          onclick={onclick}
        />
      </div>
    </>
  );
  return <>{inputElement}</>;
};

export default PaginationBar;
