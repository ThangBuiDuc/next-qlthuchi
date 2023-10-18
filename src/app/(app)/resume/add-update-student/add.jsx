"use client";
import TextInput from "@/app/component/textInput";
import { useReducer } from "react";
import DatePicker from "react-datepicker";
import Select from "react-select";

import "react-datepicker/dist/react-datepicker.css";

const gender = [
  { value: 1, label: "Nam" },
  { value: 0, label: "Nữ" },
];

function reducer(state, action) {
  switch (action.type) {
    case "change_code": {
      return {
        ...state,
        code: action.payload,
      };
    }

    case "change_class": {
      return {
        ...state,
        class: action.payload,
      };
    }

    case "change_classCode": {
      return {
        ...state,
        classCode: action.payload,
      };
    }

    case "change_first_name": {
      return {
        ...state,
        firtsName: action.payload,
      };
    }

    case "change_last_name": {
      return {
        ...state,
        lastName: action.payload,
      };
    }

    case "change_dob": {
      return {
        ...state,
        dob: action.payload,
      };
    }

    case "change_gender": {
      return {
        ...state,
        gender: action.payload,
      };
    }

    case "change_address": {
      return {
        ...state,
        address: action.payload,
      };
    }

    case "change_email": {
      return {
        ...state,
        email: action.payload,
      };
    }

    case "change_phoneNumber": {
      return {
        ...state,
        phoneNumber: action.payload,
      };
    }

    case "change_joinDate": {
      return {
        ...state,
        joinDate: action.payload,
      };
    }
  }
}

const Add = () => {
  const [infor, dispatchInfor] = useReducer(reducer, {
    code: "",
    firtsName: "",
    lastName: "",
    gender: null,
    email: "",
    joinDate: new Date(),
    class: "",
    classCode: "",
    dob: new Date(),
    address: "",
    phoneNumber: ""
  });

  return (
    <dialog id="modal_add" className="modal">
      <div className="modal-box w-11/12 max-w-5xl bg-white">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <form className="flex flex-col gap-[20px]">
          <div className="grid grid-cols-2 grid-rows-2 gap-[25px] mt-[20px]">
            <TextInput
              label={"Mã học sinh"}
              value={infor.code}
              dispatch={dispatchInfor}
              isRequire={true}
              id={"code"}
              action={"change_code"}
            />
            <div className="flex w-full gap-[10px]">
              <TextInput
                label={"Lớp"}
                value={infor.class}
                dispatch={dispatchInfor}
                action={"change_class"}
                className={"w-[20%]"}
                id={"class"}
                type={"number"}
              />

              <TextInput
                label={"Mã lớp"}
                value={infor.classCode}
                dispatch={dispatchInfor}
                action={"change_classCode"}
                id={"classCode"}
                className={"w-[80%]"}
              />
            </div>
            <div className="flex w-full gap-[10px]">
              <TextInput
                label={"Họ đệm"}
                value={infor.firtsName}
                dispatch={dispatchInfor}
                action={"change_first_name"}
                id={"first_name"}
                className={"w-[70%]"}
              />

              <TextInput
                label={"Tên"}
                value={infor.lastName}
                dispatch={dispatchInfor}
                action={"change_last_name"}
                id={"last_name"}
                className={"w-[30%]"}
              />
            </div>
            <div className="relative w-full">
              <DatePicker
                autoComplete="off"
                popperClassName="!z-[11]"
                className=" px-2.5 pb-2.5 pt-4 w-full text-sm text-black rounded-[5px] border-[1px] border-gray-300"
                id="change_dob"
                selected={infor.dob}
                onChange={(date) =>
                  dispatchInfor({ type: "change_dob", payload: date })
                }
              />
              <label
                htmlFor={"change_dob"}
                className="cursor-pointer absolute text-sm text-gray-500  duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white  px-2 peer-focus:px-2 peer-focus:text-[#898989]  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
              >
                Ngày sinh
              </label>
            </div>

            <Select
              placeholder="Giới tính"
              className="text-black text-sm"
              classNames={{
                control: () => "!rounded-[5px]",
                input: () => "!px-2.5 !pb-2.5 !pt-4 !m-0",
                valueContainer: () => "!p-[0_8px]",
                menu: () => "!z-[11]",
              }}
              options={gender}
              value={infor.gender}
              onChange={(e) => {
                dispatchInfor({ type: "change_gender", payload: e });
              }}
            />

            <TextInput
              label={"Địa chỉ"}
              value={infor.address}
              dispatch={dispatchInfor}
              action={"change_address"}
              id={"address"}
            />

            <TextInput
              label={"Email"}
              type={"email"}
              value={infor.email}
              dispatch={dispatchInfor}
              action={"change_email"}
              id="email"
            />

            <TextInput
              label={"Số điện thoại"}
              value={infor.phoneNumber}
              dispatch={dispatchInfor}
              action={"change_phoneNumber"}
              id="phoneNumber"
            />

            <div className="relative w-full">
              <DatePicker
                autoComplete="off"
                popperClassName="!z-[11]"
                className=" px-2.5 pb-2.5 pt-4 w-full text-sm text-black rounded-[5px] border-[1px] border-gray-300 focus:outline-none "
                id="change_joinDate"
                selected={infor.joinDate}
                onChange={(date) =>
                  dispatchInfor({ type: "change_joinDate", payload: date })
                }
              />
              <label
                htmlFor={"change_joinDate"}
                className="cursor-pointer absolute text-sm text-gray-500  duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white  px-2  left-1"
              >
                Ngày nhập học
              </label>
            </div>
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
