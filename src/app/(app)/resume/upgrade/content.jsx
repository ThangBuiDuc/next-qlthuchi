"use client";

import { useState, useMemo } from "react";
import Select from "react-select";
import Main from "./_main/main";
import { createContext } from "react";
import "react-toastify/dist/ReactToastify.css";

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
];

const Content = ({ listSearchSchoolYear, present, permission, upgrade }) => {
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
          listSearchSchoolYear,
          selectPresent,
          permission,
          upgrade,
        }}
      >
        <div className="flex flex-col gap-[15px] h-full">
          <div className="flex gap-1 items-center w-full justify-center">
            <h5>Học kỳ: </h5>
            {/* <Select
              noOptionsMessage={() => "Không tìm thấy kết quả phù hợp!"}
              placeholder="Học kỳ"
              options={present.result[0].batchs.map((item) => ({
                ...item,
                value: item.id,
                label: item.batch,
              }))}
              value={selectPresent}
              onChange={setSelectPresent}
              className="text-black"
            /> */}
            <h5>{selectPresent.batch} - </h5>
            <h5>Năm học: {present.result[0].school_year}</h5>
          </div>
          {upgrade.result[0].previous_school_year_id ? (
            selectPresent && (
              <>
                <div className="flex justify-between">
                  <div className="flex gap-1 items-center ">
                    <h6>Tiến hành lên lớp theo: </h6>
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
                </div>
                <Main firstSelected={selected} />
              </>
            )
          ) : (
            <h6 className="text-center">
              Hiện tại chưa có thông tin của năm học trước!
            </h6>
          )}
        </div>
      </listContext.Provider>
    </>
  );
};

export default Content;
