"use client";
import { useState } from "react";
import { useMemo } from "react";
import Select from "react-select";
import { createContext } from "react";
import Expected from "./_expected_revenue/expected";
import Import from "./_import/import";

export const listContext = createContext();

const options = [
  {
    value: 1,
    label: "Lập dự kiến",
  },
  {
    value: 2,
    label: "Nhập vé ăn",
  },
];

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
          <h6>Hình thức: </h6>
          <Select
            noOptionsMessage={() => "Không tìm thấy kết quả phù hợp!"}
            placeholder="Vui lòng chọn!"
            options={options}
            value={selected}
            onChange={setSelected}
            className="text-black w-[30%]"
            classNames={{
              menu: () => "!z-[11]",
            }}
          />
        </div>
        {selected?.value === 1 && (
          <Expected
          // listRevenue={listRevenue}
          // listSearch={listSearch}
          // present={present}
          />
        )}
        {selected?.value === 2 && <Import />}
      </div>
    </listContext.Provider>
  );
};

export default Content;
