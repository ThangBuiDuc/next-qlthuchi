"use client";

import { useMemo, useState } from "react";
import Select from "react-select";
import Main from "./_main/main";
import { createContext } from "react";

export const listContext = createContext();

const options = [
  {
    value: 0,
    label: "Cấp học",
  },
  {
    value: 1,
    label: "Khối lớp",
  },
  {
    value: 2,
    label: "Lớp học",
  },
  {
    value: 3,
    label: "Học sinh",
  },
];

const Content = ({
  listSearch,
  present,
  listRevenue,
  calculationUnit,
  permission,
}) => {
  const [selected, setSelected] = useState();
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
          permission,
        }}
      >
        <div className="flex flex-col p-[20px] gap-[15px]">
          <div className="flex gap-1 items-center w-full justify-center">
            <h5>Học kỳ: </h5>
            <h5>{selectPresent.batch} - </h5>
            <h5>Năm học: {present.result[0].school_year}</h5>
          </div>
          {selectPresent && (
            <>
              <div className="flex gap-1 items-center w-full">
                <h6>Quản lý định mức thu theo: </h6>
                <Select
                  noOptionsMessage={() => "Không tìm thấy kết quả phù hợp!"}
                  placeholder="Vui lòng chọn!"
                  options={options}
                  value={selected}
                  onChange={setSelected}
                  className="text-black w-[30%]"
                />
              </div>
              <Main firstSelected={selected} />
            </>
          )}
        </div>
      </listContext.Provider>
    </>
  );
};

export default Content;
