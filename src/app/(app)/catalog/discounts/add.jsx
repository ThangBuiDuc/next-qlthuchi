"use client";
import axios from "axios";
import TextInput from "@/app/_component/textInput";
import { useReducer, useState, useEffect, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Select from "react-select";
import { useAuth } from "@clerk/nextjs";
import moment from "moment";
import "moment/locale/vi";
import { insertDiscount } from "@/utils/funtionApi";

import "react-datepicker/dist/react-datepicker.css";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function reducer(state, action) {
  switch (action.type) {
    case "change_code": {
      return {
        ...state,
        code: action.payload.value,
      };
    }
    case "change_description": {
      return {
        ...state,
        description: action.payload.value,
      };
    }
    case "change_ratio": {
      return {
        ...state,
        ratio: action.payload.value,
      };
    }
    case "reset": {
      return action.payload.value;
    }
  }
}

const Add = ({ discountTypeData, revenueGroupData }) => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  const [discountType, setDiscountType] = useState();
  const [revenueGroup, setRevenueGroup] = useState();
  const [infor, dispatchInfor] = useReducer(reducer, {
    code: "",
    description: "",
    ratio: "",
  });

  const mutation = useMutation({
    mutationFn: ({ token, arg }) => insertDiscount(token, arg),
    onSuccess: () => {
      queryClient.invalidateQueries(["get_discount"]);
      dispatchInfor({
        type: "reset",
        payload: {
          value: {
            code: "",
            description: "",
            ratio: "",
          },
        },
      });
      toast.success("Tạo mã giảm giá thành công!", {
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
    onError: (err) => {
      console.log(err);
      if (err.response?.data?.code === "constraint-violation") {
        toast.error("Mã giảm giá không được trùng lặp, vui lòng tạo lại!", {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          theme: "light",
        });
      } else {
        toast.error("Tạo mã giảm giá không thành công!", {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          theme: "light",
        });
      }
    },
  });

  // console.log("lỗi:",mutation.error?.response?.data?.error)

  const handleOnSubmit = useCallback(async () => {
    let arg = {
      code: infor.code,
      description: infor.description,
      ratio: infor.ratio / 100,
      discount_type_id: discountType?.value,
      revenue_group_id: revenueGroup?.value,
    };
    let token = await getToken({
      template: process.env.NEXT_PUBLIC_TEMPLATE_USER,
    });

    mutation.mutate({ token, arg });
    console.log(arg);
  }, [infor, discountType, revenueGroup]);

  return (
    <>
      <input type="checkbox" id={`modal_add`} className="modal-toggle" />
      <div className="modal" role="dialog">
        <div
          className="modal-box flex flex-col gap-3 max-w-full w-9/12"
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
          >
            <div className="grid grid-cols-2 gap-[20px]">
              <Select
                placeholder="Loại giảm giá"
                className="text-black text-sm"
                classNames={{
                  control: () => "!rounded-[5px]",
                  input: () => "!pr-2.5 !pb-2.5 !pt-4 !m-0",
                  valueContainer: () => "!p-[0_8px]",
                  menu: () => "!z-[11]",
                }}
                options={discountTypeData.result.map((item) => ({
                  value: item.id,
                  label: item.name,
                }))}
                value={discountType}
                onChange={setDiscountType}
              />
              <TextInput
                label={"Mã giảm giá (Không được trùng lặp)"}
                value={infor.code}
                dispatch={dispatchInfor}
                action={"change_code"}
                id={"add_code"}
                className={"w-[70%]"}
              />
              <TextInput
                label={"Mô tả"}
                value={infor.description}
                dispatch={dispatchInfor}
                action={"change_description"}
                id={"add_description"}
                className={"w-[70%]"}
              />
              <TextInput
                label={"Tỉ lệ giảm (%) (VD: 20)"}
                value={infor.ratio}
                dispatch={dispatchInfor}
                action={"change_ratio"}
                id={"add_description"}
                className={"w-[70%]"}
                type={"number"}
              />
              <Select
                placeholder="Nhóm áp dụng"
                className="text-black text-sm"
                classNames={{
                  control: () => "!rounded-[5px]",
                  input: () => "!pr-2.5 !pb-2.5 !pt-4 !m-0",
                  valueContainer: () => "!p-[0_8px]",
                  menu: () => "!z-[11]",
                }}
                options={revenueGroupData.result.map((item) => ({
                  value: item.id,
                  label: item.name,
                }))}
                value={revenueGroup}
                onChange={setRevenueGroup}
              />
            </div>
            {infor.code &&
            infor.description &&
            infor.ratio &&
            discountType?.value &&
            revenueGroup?.value ? (
              <button
                className="btn w-fit items-center bg-white text-black border-bordercl hover:bg-[#134a9abf] hover:text-white hover:border-bordercl self-center"
                onClick={(e) => {
                  e.preventDefault();
                  handleOnSubmit();
                }}
              >
                {mutation.isLoading ? (
                  <span className="loading loading-spinner loading-sm bg-primary"></span>
                ) : (
                  "Thêm mới"
                )}
              </button>
            ) : (
              <></>
            )}
          </form>
        </div>
      </div>
    </>
  );
};

export default Add;
