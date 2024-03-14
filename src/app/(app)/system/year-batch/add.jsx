"use client";
import TextInput from "@/app/_component/textInput";
import moment from "moment";
import "moment/locale/vi";
import { useState, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { toast } from "react-toastify";
import Datetime from "react-datetime";
import { createSchoolYear } from "@/utils/funtionApi";

moment.updateLocale("vi", {
  months: [
    "Tháng 1",
    "Tháng 2",
    "Tháng 3",
    "Tháng 4",
    "Tháng 5",
    "Tháng 6",
    "Tháng 7",
    "Tháng 8",
    "Tháng 9",
    "Tháng 10",
    "Tháng 11",
    "Tháng 12",
  ],
  monthsShort: [
    "T1",
    "T2",
    "T3",
    "T4",
    "T5",
    "T6",
    "T7",
    "T8",
    "T9",
    "T10",
    "T11",
    "T12",
  ],
});

const Add = ({ school_year }) => {
  const queryClient = useQueryClient();
  const [mutating, setMutating] = useState(false);
  const { getToken } = useAuth();
  // console.log(school_year);
  const [schoolYear, setSchoolYear] = useState("");
  const [batch1, setBatch1] = useState({
    start_day: null,
    end_day: null,
    is_active: true,
  });
  const [batch2, setBatch2] = useState({
    start_day: null,
    end_day: null,
    is_active: false,
  });

  // console.log(batch1?.start_day?.format("MM-DD-YYYY"));

  const mutation = useMutation({
    mutationFn: ({ token, objects }) => createSchoolYear(token, objects),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["present"] });
      document.getElementById("modal_add").checked = false;
      setMutating(false);
      toast.success("Tạo mới năm học thành công!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        theme: "light",
      });
    },
    onError: () => {
      setMutating(false);
      toast.error("Tạo mới năm học không thành công!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        theme: "light",
      });
    },
  });

  const handleOnClick = useCallback(async () => {
    setMutating(true);
    const objects = {
      school_year: schoolYear,
      start_day: batch1.start_day.format("yyyy-MM-DD"),
      end_day: batch2.end_day.format("yyyy-MM-DD"),
      is_active: true,
      batchs: {
        data: [
          {
            batch: 1,
            start_day: batch1.start_day.format("yyyy-MM-DD"),
            end_day: batch1.end_day.format("yyyy-MM-DD"),
            is_active: batch1.is_active,
          },
          {
            batch: 2,
            start_day: batch2.start_day.format("yyyy-MM-DD"),
            end_day: batch2.end_day.format("yyyy-MM-DD"),
            is_active: batch2.is_active,
          },
        ],
      },
    };
    const token = await getToken({
      template: process.env.NEXT_PUBLIC_TEMPLATE_USER,
    });

    mutation.mutate({ token, objects });
  }, [batch1, batch2, schoolYear]);

  // useEffect(() => {
  //   setBatch2((pre) => ({ ...pre, is_active: false }));
  // }, [batch1.is_active]);

  // useEffect(() => {
  //   setBatch1((pre) => ({ ...pre, is_active: false }));
  // }, [batch2.is_active]);

  return (
    <>
      <input type="checkbox" id="modal_add" className="modal-toggle" />
      <div className="modal" role="dialog">
        <div
          style={{
            overflowY: "unset",
          }}
          className="modal-box w-11/12 max-w-5xl "
        >
          <div className="modal-action">
            <label
              htmlFor={`modal_add`}
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            >
              ✕
            </label>
          </div>
          <div className="grid grid-cols-2 place-items-center gap-4">
            <TextInput
              label={"Năm học"}
              className={"col-span-2 !w-[50%]"}
              value={schoolYear}
              action={setSchoolYear}
              placeholder={school_year}
            />
            <div className="flex flex-col gap-2">
              <h6 className="text-center">Học kỳ: 1</h6>
              <div className="flex justify-center gap-1">
                <p className="text-center self-center">Từ ngày:</p>
                <Datetime
                  value={batch1?.start_day}
                  closeOnSelect
                  timeFormat={false}
                  onChange={(value) => {
                    setBatch1((pre) => ({
                      ...pre,
                      start_day: value,
                    }));
                  }}
                  inputProps={{
                    placeholder: "Từ ngày",
                    className:
                      "px-2.5 pb-2.5 pt-4 w-full text-sm text-black rounded-[5px] border-[1px] border-gray-300",
                  }}
                />
              </div>
              <div className="flex justify-center gap-1">
                <p className="text-center self-center">Đến ngày:</p>
                <Datetime
                  value={batch1?.end_day}
                  closeOnSelect
                  timeFormat={false}
                  onChange={(value) => {
                    setBatch1((pre) => ({
                      ...pre,
                      end_day: value,
                    }));
                  }}
                  inputProps={{
                    placeholder: "Đến ngày",
                    className:
                      "px-2.5 pb-2.5 pt-4 w-full text-sm text-black rounded-[5px] border-[1px] border-gray-300",
                  }}
                />
              </div>
              <div className="flex gap-1 justify-center">
                <input
                  type="checkbox"
                  defaultChecked
                  className="checkbox checkbox-success"
                  checked={batch1.is_active}
                  onChange={() => {
                    setBatch1((pre) => ({ ...pre, is_active: true }));
                    setBatch2((pre) => ({ ...pre, is_active: false }));
                  }}
                />
                <p>Đang hoạt động</p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <h6 className="text-center">Học kỳ: 2</h6>
              <div className="flex justify-center gap-1">
                <p className="text-center self-center">Từ ngày:</p>
                <Datetime
                  value={batch2?.start_day}
                  closeOnSelect
                  timeFormat={false}
                  onChange={(value) => {
                    setBatch2((pre) => ({
                      ...pre,
                      start_day: value,
                    }));
                  }}
                  inputProps={{
                    placeholder: "Từ ngày",
                    className:
                      "px-2.5 pb-2.5 pt-4 w-full text-sm text-black rounded-[5px] border-[1px] border-gray-300",
                  }}
                />
              </div>
              <div className="flex justify-center gap-1">
                <p className="text-center self-center">Đến ngày:</p>
                <Datetime
                  value={batch2?.end_day}
                  closeOnSelect
                  timeFormat={false}
                  onChange={(value) => {
                    setBatch2((pre) => ({
                      ...pre,
                      end_day: value,
                    }));
                  }}
                  inputProps={{
                    placeholder: "Đến ngày",
                    className:
                      "px-2.5 pb-2.5 pt-4 w-full text-sm text-black rounded-[5px] border-[1px] border-gray-300",
                  }}
                />
              </div>
              <div className="flex gap-1 justify-center">
                <input
                  type="checkbox"
                  defaultChecked
                  className="checkbox checkbox-success"
                  checked={batch2.is_active}
                  onChange={() => {
                    setBatch2((pre) => ({ ...pre, is_active: true }));
                    setBatch1((pre) => ({ ...pre, is_active: false }));
                  }}
                />
                <p>Đang hoạt động</p>
              </div>
            </div>
            {mutating ? (
              <div className="w-full flex justify-center col-span-2">
                <span className="loading loading-spinner loading-sm bg-primary self-center"></span>
              </div>
            ) : schoolYear &&
              batch1.start_day &&
              batch1.end_day &&
              batch2.start_day &&
              batch2.end_day ? (
              <button
                className="btn w-fit self-center col-span-2"
                onClick={() => handleOnClick()}
              >
                Tạo mới
              </button>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Add;
