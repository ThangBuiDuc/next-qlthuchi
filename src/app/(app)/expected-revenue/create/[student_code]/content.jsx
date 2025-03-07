"use client";

import { useMemo } from "react";
import SubContent from "./subContent";

import { createContext } from "react";

export const listContext = createContext();

const Content = ({ present, student, permission }) => {
  const selectPresent = useMemo(
    () => present.result[0].batchs.find((item) => item.is_active === true),
    []
  );

  return (
    <>
      {/* <ToastContainer /> */}
      <listContext.Provider value={{ selectPresent, student, permission }}>
        <div className="flex flex-col  gap-[15px]">
          <div className="flex flex-col gap-[10px]">
            <div className="flex gap-1 justify-center items-center w-full">
              <h4 className="text-center">Lập dự kiến thu học sinh</h4>
            </div>
            <div className="flex gap-1 items-center w-full justify-center">
              <h6>Học kỳ: </h6>
              <h6>{selectPresent.batch} - </h6>
              <h6>Năm học: {present.result[0].school_year}</h6>
            </div>
          </div>
          <div>
            <p className="font-semibold ">Mã học sinh: {student.code}</p>
            <p className="font-semibold ">
              Học sinh: {`${student.first_name} ${student.last_name}`}
            </p>
          </div>
          <SubContent
            student={student}
            selectPresent={selectPresent}
            permission={permission}
          />
        </div>
      </listContext.Provider>
    </>
  );
};

export default Content;
