"use client";
import axios from "axios";
import TextInput from "@/app/_component/textInput";
import { useReducer, useState, useEffect, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import DatePicker from "react-datepicker";
import Select from "react-select";
import moment from "moment";
import "moment/locale/vi";

import "react-datepicker/dist/react-datepicker.css";

const Add = ({ discountTypeData, revenueGroupData }) => {
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
                // value={}
                // onChange={}
              />
              <TextInput
                label={"Mã giảm giá"}
                // value={}
                // dispatch={}
                // action={}
                // id={}
                className={"w-[70%]"}
              />
              <TextInput
                label={"Mô tả"}
                // value={}
                // dispatch={}
                // action={}
                // id={}
                className={"w-[70%]"}
              />
              <TextInput
                label={"Tỉ lệ giảm"}
                // value={}
                // dispatch={}
                // action={}
                // id={}
                className={"w-[70%]"}
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
                // value={}
                // onChange={}
              />
            </div>
            <button className="btn w-fit items-center bg-white text-black border-bordercl hover:bg-[#134a9abf] hover:text-white hover:border-bordercl self-center">
              Thêm mới
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Add;
