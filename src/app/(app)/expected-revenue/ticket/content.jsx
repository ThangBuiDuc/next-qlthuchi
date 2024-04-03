"use client";
import { useState } from "react";
import { useMemo } from "react";
import Select from "react-select";
import Class from "./_class/class";
import Student from "./_student/student";
import { createContext } from "react";

export const listContext = createContext();

const options = [
  {
    value: 1,
    label: "Lớp học",
  },
  {
    value: 2,
    label: "Học sinh",
  },
];

const Content = ({ listSearch, present }) => {
  const [selected, setSelected] = useState(null);
  const selectPresent = useMemo(
    () => present.result[0].batchs.find((item) => item.is_active === true),
    []
  );

  return (
    <listContext.Provider value={{ listSearch, selectPresent }}>
      <div className="flex flex-col p-[20px] gap-[15px]">
        <div className="flex gap-1 items-center w-full justify-center">
          <h5>Học kỳ: </h5>
          <h5>{selectPresent.batch} - </h5>
          <h5>Năm học: {present.result[0].school_year}</h5>
        </div>
        {/* <Student /> */}
        <div className="flex gap-1 items-center w-full">
          <h6>Nhập vé ăn theo: </h6>
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
        {selected?.value === 1 && <Class />}
        {selected?.value === 2 && <Student />}
      </div>
    </listContext.Provider>
  );
};

export default Content;
