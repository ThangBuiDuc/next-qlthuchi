"use client";

import Student from "./student";
import { useMemo } from "react";
import { createContext } from "react";

export const listContext = createContext();

const Content = ({ listSearch, present, config }) => {
  const selectPresent = useMemo(
    () => present.result[0].batchs.find((item) => item.is_active === true),
    []
  );

  return (
    <>
      {/* <ToastContainer /> */}
      <listContext.Provider value={{ listSearch, selectPresent, config }}>
        <div className="flex flex-col p-[20px] gap-[15px]">
          <div className="flex gap-1 items-center w-full justify-center">
            <h5>Học kỳ: </h5>
            <h5>{selectPresent.batch} - </h5>
            <h5>Năm học: {present.result[0].school_year}</h5>
          </div>
          <Student />
        </div>
      </listContext.Provider>
    </>
  );
};

export default Content;
