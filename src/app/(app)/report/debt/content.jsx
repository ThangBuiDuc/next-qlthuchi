"use client";
import { useState } from "react";
import { useMemo } from "react";
import SubContent from "./subContent";

const Content = ({ present }) => {
  const selectPresent = useMemo(
    () => present.result[0].batchs.find((item) => item.is_active === true),
    []
  );

  return (
    <div className="flex flex-col gap-5 justify-center">
      <h5 className="text-center">Tổng hợp công nợ theo nhiều học sinh</h5>
      <div className={`justify-center items-center flex gap-1 `}>
        <h6>
          Học kỳ {selectPresent.batch} - Năm học {present.result[0].school_year}
        </h6>
      </div>
      <SubContent present={selectPresent} />
      {/* {selected && <SubContent selected={selected} />} */}
    </div>
  );
};

export default Content;
