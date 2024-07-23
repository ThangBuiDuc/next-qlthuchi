"use client";

import { useState, useMemo } from "react";
import Select from "react-select";
import Main from "./_main/main";
import { useMutation } from "@tanstack/react-query";
import { createContext } from "react";
import { toast } from "react-toastify";
import { createInsuranceRevenueNorm } from "@/utils/funtionApi";
import moment from "moment";
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
  config,
}) => {
  const [selected, setSelected] = useState();
  const selectPresent = useMemo(
    () => present.result[0].batchs.find((item) => item.is_active === true),
    []
  );
  const [mutating, setMutating] = useState(false);

  const mutation = useMutation({
    mutationFn: async () =>
      createInsuranceRevenueNorm({
        time: moment().format(),
        batch_id: selectPresent.id,
        class_level: listSearch.class_level.map((item) => item.code),
      }),
    onSuccess: () => {
      setMutating(false);
      toast.success("Tạo định mức thu BHYT thành công!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        theme: "light",
      });
    },
    onError: () => {
      setMutating(false);
      toast.error("Tạo định mức thu BHYT không thành công!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        theme: "light",
      });
    },
  });

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
          config,
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
          {selectPresent && (
            <>
              <div className="flex justify-between">
                <div className="flex gap-1 items-center ">
                  <h6>Lập định mức thu theo: </h6>
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
                {permission ===
                  process.env.NEXT_PUBLIC_PERMISSION_READ_EDIT && (
                  <div className="flex">
                    {mutating ? (
                      <span className="loading loading-spinner loading-sm bg-primary"></span>
                    ) : (
                      <button
                        className="btn w-f tooltip tooltip-left"
                        data-tip="Lập định mức thu BHYT"
                        onClick={() => {
                          setMutating(true);
                          mutation.mutate();
                        }}
                      >
                        BHYT
                      </button>
                    )}
                  </div>
                )}
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
