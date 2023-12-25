"use client";
import { createContext, useState, useMemo } from "react";
import Select from "react-select";
import Other from "./_other/other";
import { getPreBill } from "@/utils/funtionApi";
// import Main from "./_filter/main";
import { useQuery } from "@tanstack/react-query";

const options = [
  {
    value: 1,
    label: "Thu khác",
  },
  {
    value: 2,
    label: "Thu qua bảng kê",
  },
];

export const listContext = createContext();

const Content = ({ listSearch, InitialPreBill, present }) => {
  const selectPresent = useMemo(
    () => present.result[0].batchs.find((item) => item.is_active === true),
    []
  );

  const preBill = useQuery({
    queryFn: () => getPreBill(),
    queryKey: ["get_pre_bill"],
    staleTime: Infinity,
    initialData: () => InitialPreBill,
  });
  const [selected, setSelected] = useState();
  return (
    <>
      {/* <ToastContainer /> */}
      <listContext.Provider
        value={{
          listSearch,
          preBill: preBill.data,
          selectPresent,
        }}
      >
        <div className="flex flex-col  gap-3">
          <div className="flex gap-1 justify-center items-center w-full">
            <h4 className="text-center">Lập phiếu thu tiền mặt</h4>
          </div>
          <div className="flex gap-1 items-center w-full justify-center">
            <h6>Học kỳ: </h6>
            <h6>{selectPresent.batch} - </h6>
            <h6>Năm học: {present.result[0].school_year}</h6>
          </div>
          <Select
            noOptionsMessage={() => "Không tìm thấy kết quả phù hợp!"}
            placeholder="Hình thức thu!"
            options={options}
            value={selected}
            onChange={setSelected}
            className="text-black w-52"
          />
          {selected?.value === 1 && <Other />}
        </div>
      </listContext.Provider>
    </>
  );
};

export default Content;
