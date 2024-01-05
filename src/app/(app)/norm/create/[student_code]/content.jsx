"use client";

import { useMemo } from "react";
import { createContext } from "react";
import LeftPanel from "./leftPanel";
import RightPanel from "./rightPanel";

export const listContext = createContext();

const Content = ({
  listSearch,
  present,
  listRevenue,
  calculationUnit,
  student,
}) => {
  const selectPresent = useMemo(
    () => present.result[0].batchs.find((item) => item.is_active === true),
    []
  );

  return (
    <>
      {/* <ToastContainer /> */}
      <listContext.Provider
        value={{
          listSearch,
          listRevenue,
          calculationUnit,
          selectPresent,
          student,
        }}
      >
        <div className="flex flex-col gap-[15px] h-full">
          <div className="flex gap-1 items-center w-full justify-center">
            <h5>Học kỳ: </h5>
            <h5>{selectPresent.batch} - </h5>
            <h5>Năm học: {present.result[0].school_year}</h5>
          </div>
          <div className="flex flex-col gap-1  w-full">
            <h6>
              Lập định mức thu học sinh:{" "}
              {`${student.first_name} ${student.last_name}`}
            </h6>
            <h6>Mã học sinh: {student.code}</h6>
          </div>
          <div className="flex w-full divide-x divide-black h-full">
            <LeftPanel />
            <RightPanel />
          </div>
        </div>
      </listContext.Provider>
    </>
  );
};

export default Content;
