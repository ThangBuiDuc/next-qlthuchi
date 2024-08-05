"use client";
import React, { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { Button } from "@nextui-org/button";
import { toast } from "react-toastify";
import { updateInsuranceRule } from "@/utils/funtionApi";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";

const DateInput = ({ day, setDay, month, setMonth, label }) => {
    const handleDayChange = (e) => {
      const newDay = e.target.value;
      setDay(newDay);
    };
  
    const handleMonthChange = (e) => {
      const newMonth = e.target.value;
      setMonth(newMonth);
    };
  
    useEffect(() => {
      let maxDay = 31;
      let maxMonth = 12;
  
      if (month == 4 || month == 6 || month == 9 || month == 11) {
        maxDay = 30;
      } else if (month == 2) {
        maxDay = 29;
      }
  
      if (month > maxMonth) {
        setMonth(maxMonth);
      }
  
      if (day > maxDay) {
        setDay(maxDay);
      }
    }, [day, month]);
  
    return (
      <label className="flex flex-col gap-1">
        <span>{label}</span>
        <div className="flex w-fit gap-2">
          <input
            type="number"
            value={day}
            onChange={handleDayChange}
            className="block w-20 rounded-md py-1.5 px-2 ring-1 ring-inset ring-gray-400 focus:text-gray-800"
            placeholder="Ngày"
          />
          <span>/</span>
          <input
            type="number"
            value={month}
            onChange={handleMonthChange}
            placeholder="Tháng"
            className="block w-20 rounded-md py-1.5 px-2 ring-1 ring-inset ring-gray-400 focus:text-gray-800"
          />
        </div>
      </label>
    );
  };

const EditModal = ({ isOpen, onClose, ruleToEdit, class_levels }) => {
  if (!isOpen) return null;

  const { getToken } = useAuth();
  const [mutating, setMutating] = useState(false);
  const queryClient = useQueryClient();

  const [classLevel, setClassLevel] = useState();
  const [startDay, setStartDay] = useState("");
  const [startMonth, setStartMonth] = useState("");
  const [endDay, setEndDay] = useState("");
  const [endMonth, setEndMonth] = useState("");
  const [months, setMonths] = useState("");

  useEffect(() => {
    if (ruleToEdit) {
      setClassLevel({
        value: ruleToEdit.class_level,
        label: `Khối ${ruleToEdit.class_level}`,
      });
      setStartDay(ruleToEdit.start_day);
      setStartMonth(ruleToEdit.start_month);
      setEndDay(ruleToEdit.end_day);
      setEndMonth(ruleToEdit.end_month);
      setMonths(ruleToEdit.months);
    }
  }, [ruleToEdit]);

  const mutation = useMutation({
    mutationFn: ({ token, id, objects }) =>
      updateInsuranceRule(token, id, objects),
    onSuccess: () => {
      setMutating(false);
      queryClient.invalidateQueries(["get_rules"]);
      onClose(); // Close the modal on successful update
      toast.success("Chỉnh sửa luật BHYT thành công!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        theme: "light",
      });
    },
    onError: () => {
      setMutating(false);
      toast.error("Chỉnh sửa luật BHYT không thành công!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        theme: "light",
      });
    },
  });

  const handleUpdate = async () => {
    setMutating(true);
    const token = await getToken({
      template: process.env.NEXT_PUBLIC_TEMPLATE_USER,
    });
    const updatedData = {
      class_level: classLevel.value,
      start_day: startDay,
      end_day: endDay,
      start_month: startMonth,
      end_month: endMonth,
      months: months,
    };
    mutation.mutate({ token, id: ruleToEdit?.id, objects : updatedData });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/4">
        <h2 className="text-xl font-semibold mb-4">Chỉnh sửa luật BHYT</h2>
        <div className="flex flex-col gap-4">
          <label className="flex flex-col gap-1">
            <span>Chọn khối</span>
            <Select
              placeholder="Chọn khối"
              className="text-black text-sm"
              classNames={{
                control: () => "!rounded-[5px]",
                input: () => "!pr-2.5 !pb-2.5 !pt-4 !m-0",
                valueContainer: () => "!p-[0_8px]",
                menu: () => "!z-[11]",
              }}
              options={
                class_levels
                  ? class_levels.map((item) => ({
                      value: item.code,
                      label: item.name,
                    }))
                  : null
              }
              value={classLevel}
              onChange={setClassLevel}
            />
          </label>
          <DateInput
            day={startDay}
            setDay={setStartDay}
            month={startMonth}
            setMonth={setStartMonth}
            label="Ngày sinh từ / Tháng"
          />
          <DateInput
            day={endDay}
            setDay={setEndDay}
            month={endMonth}
            setMonth={setEndMonth}
            label="Đến ngày / Tháng"
          />
          <label className="flex flex-col gap-1">
            <span>Số tháng</span>
            <input
              type="number"
              value={months}
              onChange={(e) => setMonths(e.target.value)}
              className="block w-20 rounded-md py-1.5 px-2 ring-1 ring-inset ring-gray-400 focus:text-gray-800"
              placeholder="Số tháng"
            />
          </label>
        </div>
        <div className="flex justify-end gap-4 mt-4">
          <Button
            color="primary"
            onClick={handleUpdate}
            disabled={
              !classLevel?.value ||
              !startDay ||
              !startMonth ||
              !endDay ||
              !endMonth ||
              !months
            }
          >
            {mutating ? (
              <span className="loading loading-spinner loading-sm bg-primary"></span>
            ) : (
              "Lưu"
            )}
          </Button>
          <Button color="default" onClick={onClose}>
            Huỷ
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditModal;
