"use client";
import { useState } from "react";
import { useMemo } from "react";
import Select from "react-select";
import { createContext } from "react";
import SubContent from "./subContent";

export const listContext = createContext();

// const options = [
//   {
//     value: 1,
//     label: "Lớp học",
//   },
//   {
//     value: 2,
//     label: "Học sinh",
//   },
// ];

const Content = ({
  listSearch,
  present,
  listRevenue,
  calculationUnit,
  permission,
  config,
}) => {
  const [selected, setSelected] = useState(null);
  const selectPresent = useMemo(
    () => present.result[0].batchs.find((item) => item.is_active === true),
    []
  );

  return (
    <listContext.Provider
      value={{
        listSearch,
        selectPresent,
        listRevenue,
        calculationUnit,
        permission,
        config,
        school_year: present.result[0].school_year,
      }}
    >
      <div className="flex flex-col p-[20px] gap-[15px]">
        <div className="flex gap-1 items-center w-full justify-center">
          <h5>Học kỳ: </h5>
          <h5>{selectPresent.batch} - </h5>
          <h5>Năm học: {present.result[0].school_year}</h5>
        </div>
        {/* <Student /> */}
        <div className="flex gap-1 items-center w-full">
          <h6>Lớp học: </h6>
          <Select
            noOptionsMessage={() => "Không tìm thấy kết quả phù hợp!"}
            placeholder="Vui lòng chọn!"
            options={listSearch.classes
              .sort(
                (a, b) =>
                  a.class_level_code - b.class_level_code ||
                  a.code.localeCompare(b.code)
              )
              .map((item) => ({
                ...item,
                value: item.id,
                label: item.name,
              }))}
            value={selected}
            onChange={(e) => e.value !== selected?.value && setSelected(e)}
            className="text-black w-[30%]"
            classNames={{
              menu: () => "!z-[11]",
            }}
          />
        </div>
        {selected && <SubContent selected={selected} />}
      </div>
    </listContext.Provider>
  );
};

export default Content;
