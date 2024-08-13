"use client";

import Student from "./student";
import { useMemo, useState } from "react";
import { createContext } from "react";
import Select from "react-select";
import ListStudent from "./_list-student/list-student";

export const listContext = createContext();

const options = [
  { label: "Một học sinh", value: 1 },
  { label: "Nhiều học sinh", value: 2 },
];

const Content = ({ listSearch, present, config, revenueGroup }) => {
  const selectPresent = useMemo(
    () => present.result[0].batchs.find((item) => item.is_active === true),
    []
  );
  const [selected, setSelected] = useState();

  return (
    <>
      {/* <ToastContainer /> */}
      <listContext.Provider
        value={{ listSearch, selectPresent, config, revenueGroup }}
      >
        <div className="flex flex-col p-[20px] gap-[15px]">
          <div className="flex gap-1 items-center w-full justify-center">
            <h5>Học kỳ: </h5>
            <h5>{selectPresent.batch} - </h5>
            <h5>Năm học: {present.result[0].school_year}</h5>
          </div>
          <div className="flex gap-1 items-center ">
            <h6>Bảng kê theo: </h6>
            <Select
              noOptionsMessage={() => "Không tìm thấy kết quả phù hợp!"}
              placeholder="Vui lòng chọn!"
              options={options}
              value={selected}
              onChange={setSelected}
              className="text-black w-52"
              classNames={{
                menu: () => "!z-[11]",
              }}
            />
          </div>
          {/* <Student /> */}
          {selected?.value === 1 && <Student />}
          {selected?.value === 2 && <ListStudent />}
        </div>
      </listContext.Provider>
    </>
  );
};

export default Content;
