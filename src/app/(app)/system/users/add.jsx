"use client";
import TextInput from "@/app/component/textInput";
import { useReducer, useState, useEffect } from "react";

import DatePicker from "react-datepicker";
import Select from "react-select";
import moment from "moment";
import "moment/locale/vi";

import { getWards } from "@/utils/funtionApi";

import "react-datepicker/dist/react-datepicker.css";

function reducer(state, action) {
  switch (action.type) {
    case "change_first_name": {
      return {
        ...state,
        code: action.payload.value,
      };
    }
    case "change_last_name": {
      return {
        ...state,
        code: action.payload.value,
      };
    }
    case "change_dob": {
      return {
        ...state,
        dob: action.payload.value,
      };
    }
    case "change_address": {
      return {
        ...state,
        address: action.payload.value,
      };
    }
  }
}

const Add = ({ provinces, districts, jwt }) => {
  const [infor, dispatchInfor] = useReducer(reducer, {
    firtsName: "",
    lastName: "",
    address: "",
    province: null,
    district: null,
    ward: null,
    dob: new Date(),
  });

  const [province, setProvince] = useState();
  console.log(province);

  const [district, setDistrict] = useState();
  console.log(district);

  const [ward, setWard] = useState();

  useEffect(() => {
    province && setDistrict(null);
  }, [province]);

  const [wards, setWards] = useState();

  useEffect(() => {
    const callApi = async () => {
      setWards((await getWards(jwt, district.value)).data);
    };
    if (district) callApi();
  }, [district]);

  console.log(wards);

  return (
    <dialog id="modal_add" className="modal">
      <div className="modal-box w-11/12 max-w-5xl bg-white scroll-auto">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <form className="flex flex-col gap-[20px]">
          <div className="grid grid-cols-2 grid-rows-2 gap-[25px] mt-[20px]">
            <div className="flex w-full gap-[10px]">
              <TextInput
                label={"Họ đệm"}
                value={infor.firtsName}
                dispatch={dispatchInfor}
                action={"change_first_name"}
                id={"add_first_name"}
                className={"w-[70%]"}
              />
              <TextInput
                label={"Tên"}
                value={infor.lastName}
                dispatch={dispatchInfor}
                action={"change_last_name"}
                id={"add_last_name"}
                className={"w-[30%]"}
              />
            </div>
            <div className="relative w-full">
              <DatePicker
                autoComplete="off"
                popperClassName="!z-[11]"
                className=" px-2.5 pb-2.5 pt-4 w-full text-sm text-black rounded-[5px] border-[1px] border-gray-300"
                id="add_change_dob"
                selected={infor.dob}
                onChange={(date) =>
                  dispatchInfor({
                    type: "change_dob",
                    payload: {
                      value: date,
                    },
                  })
                }
              />
              <label
                htmlFor={"add_change_dob"}
                className="cursor-pointer absolute text-sm text-gray-500  duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white  px-2 peer-focus:px-2 peer-focus:text-[#898989]  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
              >
                Ngày sinh
              </label>
            </div>
            <TextInput
              label={"Địa chỉ"}
              value={infor.address}
              dispatch={dispatchInfor}
              action={"change_address"}
              id={"add_address"}
            />

            <Select
              placeholder="Tỉnh / Thành phố"
              className="text-black text-sm"
              classNames={{
                control: () => "!rounded-[5px]",
                input: () => "!pr-2.5 !pb-2.5 !pt-4 !m-0",
                valueContainer: () => "!p-[0_8px]",
                menu: () => "!z-[11]",
              }}
              options={provinces.result.map((item) => ({
                value: item.code,
                label: item.name,
              }))}
              value={province}
              onChange={setProvince}
            />

            <Select
              isDisabled={province ? false : true}
              placeholder="Quận / Huyện"
              className="text-black text-sm"
              classNames={{
                control: () => "!rounded-[5px]",
                input: () => "!pr-2.5 !pb-2.5 !pt-4 !m-0",
                valueContainer: () => "!p-[0_8px]",
                menu: () => "!z-[11]",
              }}
              options={
                province
                  ? districts.result
                      .filter((item) => item.province_code === province.value)
                      .map((item) => ({
                        value: item.code,
                        label: item.name,
                      }))
                  : null
              }
              value={district}
              onChange={setDistrict}
            />

            <Select
              isDisabled={district ? false : true}
              placeholder="Phường / Xã"
              className="text-black text-sm"
              classNames={{
                control: () => "!rounded-[5px]",
                input: () => "!pr-2.5 !pb-2.5 !pt-4 !m-0",
                valueContainer: () => "!p-[0_8px]",
                menu: () => "!z-[11]",
              }}
              options={wards?.result.map((item) => ({
                value: item.code,
                label: item.name
              }))}
              value={ward}
              onChange={setWard}
            />
          </div>

          <button className="btn w-fit items-center bg-white text-black border-bordercl hover:bg-[#134a9abf] hover:text-white hover:border-bordercl self-center">
            Thêm mới
          </button>
        </form>
      </div>
    </dialog>
  );
};

export default Add;
