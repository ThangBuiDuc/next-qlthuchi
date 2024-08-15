"use client";
import React, { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createInsuaranceRule } from "@/utils/funtionApi";
import Select from "react-select";
import { Button } from "@nextui-org/button";

const DateInput = ({ day, setDay, month, setMonth }) => {
  const handleDayChange = (e) => setDay(e.target.value);
  const handleMonthChange = (e) => setMonth(e.target.value);

  useEffect(() => {
    let maxDay = 31;
    let maxMonth = 12;

    if ([4, 6, 9, 11].includes(Number(month))) {
      maxDay = 30;
    } else if (Number(month) === 2) {
      maxDay = 29;
    }

    if (Number(month) > maxMonth) setMonth(maxMonth);
    if (Number(day) > maxDay) setDay(maxDay);
  }, [day, month]);

  return (
    <div className="flex gap-3">
      <input
        type="number"
        value={day}
        onChange={handleDayChange}
        className="w-16 rounded-md py-1 px-2 ring-1 ring-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Ngày"
      />
      <span>/</span>
      <input
        type="number"
        value={month}
        onChange={handleMonthChange}
        className="w-16 rounded-md py-1 px-2 ring-1 ring-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Tháng"
      />
    </div>
  );
};

const AddModal = ({ class_levels }) => {
  const { getToken } = useAuth();
  const [mutating, setMutating] = useState(false);
  const queryClient = useQueryClient();

  const [classLevel, setClassLevel] = useState(null);
  const [startDay, setStartDay] = useState("");
  const [startMonth, setStartMonth] = useState("");
  const [endDay, setEndDay] = useState("");
  const [endMonth, setEndMonth] = useState("");
  const [months, setMonths] = useState("");

  const mutation = useMutation({
    mutationFn: ({ token, objects }) => createInsuaranceRule(token, objects),
    onSuccess: () => {
      setMutating(false);
      queryClient.invalidateQueries(["get_rules"]);
      toast.success("Tạo luật BHYT thành công!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        theme: "light",
      });
      const modalCheckbox = document.getElementById(`modal_add`);
      if (modalCheckbox) {
        modalCheckbox.checked = false;
      }
    },
    onError: () => {
      setMutating(false);
      toast.error("Tạo luật BHYT không thành công!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        theme: "light",
      });
    },
  });

  const handleInsert = async () => {
    const objects = {
      class_level: classLevel?.value,
      start_day: startDay,
      end_day: endDay,
      start_month: startMonth,
      end_month: endMonth,
      months,
    };
    setMutating(true);
    const token = await getToken({
      template: process.env.NEXT_PUBLIC_TEMPLATE_USER,
    });
    mutation.mutate({ token, objects });
  };

  return (
    <>
      <input type="checkbox" id={`modal_add`} className="modal-toggle" />
      <div className="modal" role="dialog">
        <div
          className="modal-box flex flex-col gap-3 max-w-full w-1/5"
          style={{ overflowY: "unset" }}
        >
          <label
            htmlFor={`modal_add`}
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 cursor-pointer"
          >
            ✕
          </label>
          <form
            // onSubmit={handleOnSubmit}
            className="flex flex-col gap-[20px] mt-[20px]"
            style={{ overflowY: "unset" }}
            autoComplete="off"
          >
            <div className="gap-[20px]">
              <h2 className="text-xl font-semibold mb-4">Thêm mới luật BHYT</h2>
              <div className="flex gap-2 flex-col space-y-4">
                <Select
                  placeholder="Chọn khối"
                  className="text-black"
                  classNames={{
                    control: () => "rounded-md",
                    input: () => "py-2 px-3",
                    valueContainer: () => "p-1",
                    menu: () => "z-10",
                  }}
                  options={
                    class_levels
                      ? class_levels.map((item) => ({
                          value: item.code,
                          label: item.name,
                        }))
                      : []
                  }
                  value={classLevel}
                  onChange={setClassLevel}
                />
                <div>
                  <p className="font-medium mb-2">Ngày sinh từ</p>
                  <DateInput
                    day={startDay}
                    setDay={setStartDay}
                    month={startMonth}
                    setMonth={setStartMonth}
                  />
                </div>
                <div>
                  <p className="font-medium mb-2">Đến</p>
                  <DateInput
                    day={endDay}
                    setDay={setEndDay}
                    month={endMonth}
                    setMonth={setEndMonth}
                  />
                </div>
                <input
                  type="number"
                  value={months}
                  onChange={(e) => setMonths(e.target.value)}
                  className="w-24 rounded-md py-1 px-2 ring-1 ring-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Số tháng"
                />
              </div>
              <div className="mt-[20px]">
                {classLevel?.value &&
                startDay &&
                endDay &&
                startMonth &&
                endMonth &&
                months ? (
                  <Button
                    color="primary"
                    size="sm"
                    onClick={(e) => {
                      e.preventDefault();
                      handleInsert();
                    }}
                  >
                    {mutating ? (
                      <span className="loading loading-spinner loading-sm bg-primary"></span>
                    ) : (
                      "Lưu"
                    )}
                  </Button>
                ) : (
                  <></>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddModal;
