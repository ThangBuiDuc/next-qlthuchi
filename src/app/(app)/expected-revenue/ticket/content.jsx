"use client";
import React from "react";
import { useMemo } from "react";

const Content = ({ listSearch, present }) => {
  const selectPresent = useMemo(
    () => present.result[0].batchs.find((item) => item.is_active === true),
    []
  );
  return (
    <div className="flex flex-col p-[20px] gap-[15px]">
      <div className="flex gap-1 items-center w-full justify-center">
        <h5>Học kỳ: </h5>
        <h5>{selectPresent.batch} - </h5>
        <h5>Năm học: {present.result[0].school_year}</h5>
      </div>
      {/* <Student /> */}
    </div>
  );
};

export default Content;
