"use client";
import { BiEdit, BiMessageAltAdd } from "react-icons/bi";
import { AiOutlineLine } from "react-icons/ai";
import { motion } from "framer-motion";
import useMeasure from "react-use-measure";
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
    case "change_class": {
      return {
        ...state,
        class: action.payload.value,
      };
    }

    case "change_classCode": {
      return {
        ...state,
        classCode: action.payload.value,
      };
    }

    case "change_first_name": {
      return {
        ...state,
        firtsName: action.payload.value,
      };
    }

    case "change_last_name": {
      return {
        ...state,
        lastName: action.payload.value,
      };
    }

    case "change_dob": {
      return {
        ...state,
        dob: action.payload.value,
      };
    }

    case "change_gender": {
      return {
        ...state,
        gender: action.payload.value,
      };
    }

    case "change_address": {
      return {
        ...state,
        address: action.payload.value,
      };
    }

    case "change_email": {
      return {
        ...state,
        email: action.payload.value,
      };
    }

    case "change_phoneNumber": {
      return {
        ...state,
        phoneNumber: action.payload.value,
      };
    }

    case "change_joinDate": {
      return {
        ...state,
        joinDate: action.payload.value,
      };
    }

    case "change_parent_first_name": {
      return {
        ...state,
        parents: parents.map((item, index) =>
          index === action.payload.parentIndex
            ? { ...item, first_name: action.payload.value }
            : item
        ),
      };
    }

    case "change_parent_last_name": {
      return {
        ...state,
        parents: parents.map((item, index) =>
          index === action.payload.parentIndex
            ? { ...item, last_name: action.payload.value }
            : item
        ),
      };
    }

    case "change_parent_relation": {
      return {
        ...state,
        parents: parents.map((item, index) =>
          index === action.payload.parentIndex
            ? { ...item, relation: action.payload.value }
            : item
        ),
      };
    }

    case "change_parent_phoneNumber": {
      return {
        ...state,
        parents: parents.map((item, index) =>
          index === action.payload.parentIndex
            ? { ...item, phoneNumber: action.payload.value }
            : item
        ),
      };
    }
  }
}

const Update = ({ data, setData }) => {
  const [infor, dispatchInfor] = useReducer(reducer, {
    code: "1",
    firtsName: "",
    lastName: "",
    gender: null,
    email: "",
    joinDate: new Date(),
    class: "",
    classCode: "",
    dob: new Date(),
    address: "",
    phoneNumber: "",
  });
  const [ref, { height }] = useMeasure();

  return (
    <>
      <div
        key={data.code}
        className="flex border-t-2 border-bordercl  justify-between items-center pt-[5px]"
      >
        <div className="w-[25%]">
          <h3 className=" tooltip" data-tip="Mã lớp">
            {data.class}
          </h3>
        </div>
        <div className="w-[25%]">
          <h3 className=" tooltip" data-tip="Mã học sinh">
            {data.code}
          </h3>
        </div>

        <div className="w-[30%]">
          <h3 className=" tooltip" data-tip="Họ và tên">
            {`${data.first_name} ${data.last_name}`}
          </h3>
        </div>

        <div className="flex justify-end gap-[10px] w-[20%]">
          <BiEdit
            size={30}
            className="text-black cursor-pointer"
            onClick={() =>
              setData((pre) =>
                pre.map((el) =>
                  el.code === data.code
                    ? { ...el, isEdit: true }
                    : { ...el, isEdit: false }
                )
              )
            }
          />
        </div>
      </div>
      <motion.div
        initial={false}
        animate={{ height: data.isEdit ? height : 0 }}
        className="overflow-hidden"
      >
        <div ref={ref} className="flex flex-col gap-[20px] p-[20px]">
          <h3 className="col-span-2">Thông tin chi tiết</h3>
          <div className="grid grid-cols-2 grid-rows-2 gap-[25px]">
            <TextInput
              label={"Mã học sinh"}
              disable={true}
              value={infor.code}
              dispatch={dispatchInfor}
              isRequire={true}
              id={`change_code_${data.code}`}
              action={"change_code"}
            />
            <div className="flex w-full gap-[10px]">
              <TextInput
                label={"Lớp"}
                value={infor.class}
                dispatch={dispatchInfor}
                action={"change_class"}
                className={"w-[20%]"}
                id={`change_class_${data.code}`}
                type={"number"}
              />

              <TextInput
                label={"Mã lớp"}
                value={infor.classCode}
                dispatch={dispatchInfor}
                action={"change_classCode"}
                id={`change_classCode_${data.code}`}
                className={"w-[80%]"}
              />
            </div>
            <div className="flex w-full gap-[10px]">
              <TextInput
                label={"Họ đệm"}
                value={infor.firtsName}
                dispatch={dispatchInfor}
                action={"change_first_name"}
                id={`change_first_name_${data.code}`}
                className={"w-[70%]"}
              />

              <TextInput
                label={"Tên"}
                value={infor.lastName}
                dispatch={dispatchInfor}
                action={"change_last_name"}
                id={`change_last_name_${data.code}`}
                className={"w-[30%]"}
              />
            </div>
            <div className="relative w-full">
              <DatePicker
                autoComplete="off"
                popperClassName="!z-[11]"
                className=" px-2.5 pb-2.5 pt-4 w-full text-sm text-black rounded-[5px] border-[1px] border-gray-300"
                id={`change_dob_${data.code}`}
                selected={infor.dob}
                onChange={(date) =>
                  dispatchInfor({ type: "change_dob", payload: date })
                }
              />
              <label
                htmlFor={`change_dob_${data.code}`}
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
              id={`change_address_${data.code}`}
            />

            <TextInput
              label={"Email"}
              type={"email"}
              value={infor.email}
              dispatch={dispatchInfor}
              action={"change_email"}
              id={`change_email_${data.code}`}
            />

            <TextInput
              label={"Số điện thoại"}
              value={infor.phoneNumber}
              dispatch={dispatchInfor}
              action={"change_phoneNumber"}
              id={`change_phoneNumber_${data.code}`}
            />

            <div className="relative w-full">
              <DatePicker
                autoComplete="off"
                popperClassName="!z-[11]"
                className=" px-2.5 pb-2.5 pt-4 w-full text-sm text-black rounded-[5px] border-[1px] border-gray-300 focus:outline-none "
                id={`change_joindate_${data.code}`}
                selected={infor.joinDate}
                onChange={(date) =>
                  dispatchInfor({ type: "change_joinDate", payload: date })
                }
              />
              <label
                htmlFor={`change_joindate_${data.code}`}
                className="cursor-pointer absolute text-sm text-gray-500  duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white  px-2  left-1"
              >
                Ngày nhập học
              </label>
            </div>
          </div>
          <div className="flex flex-col gap-[15px]">
            <h3>Người thân</h3>
            {/* {Array.isArray(data.parents) && data.parents.length === 0 && (
              <BiMessageAltAdd
                size={40}
                className="self-center text-black cursor-pointer"
                onClick={() => {
                  setData((pre) =>
                    pre.map((item) =>
                      item.code === data.code
                        ? {
                            ...item,
                            parents: [
                              {
                                first_name: "",
                                last_name: "",
                                relation: "",
                                phoneNumber: "",
                              },
                            ],
                          }
                        : item
                    )
                  );
                }}
              />
            )} */}
            {Array.isArray(data.parents) && data.parents.length > 0 && (
              <>
                {data.parents.map((item, index) => {
                  return (
                    <div
                      key={`${data.code}${index}`}
                      className="grid grid-cols-2 gap-[10px]"
                    >
                      {index > 0 && (
                        <div className="flex col-span-2 justify-center">
                          <AiOutlineLine size={20} className="text-black  " />
                        </div>
                      )}
                      <div className="flex gap-[5px]">
                        <TextInput
                          label={"Họ đệm"}
                          value={item.first_name}
                          dispatch={dispatchInfor}
                          action={"change_parent_first_name"}
                          id={`change_parent_first_name_${data.code}${index}`}
                          parentIndex={index}
                        />
                        <TextInput
                          label={"Tên"}
                          value={item.lastName}
                          dispatch={dispatchInfor}
                          action={"change_parent_last_name"}
                          id={`change_parent_last_name_${data.code}${index}`}
                          parentIndex={index}
                        />
                      </div>
                      <div className="flex gap-[5px]">
                        <TextInput
                          label={"Quan hệ"}
                          value={item.relation}
                          dispatch={dispatchInfor}
                          action={"change_parent_relation"}
                          id={`change_parent_relation_${data.code}${index}`}
                          parentIndex={index}
                        />
                        <TextInput
                          label={"Số điện thoại"}
                          value={item.phoneNumber}
                          dispatch={dispatchInfor}
                          action={"change_parent_phoneNumber"}
                          id={`change_parent_phoneNumber_${data.code}${index}`}
                          parentIndex={index}
                        />
                      </div>
                    </div>
                  );
                })}
              </>
            )}
            <BiMessageAltAdd
              size={40}
              className="self-center text-black cursor-pointer"
              onClick={() => {
                setData((pre) =>
                  pre.map((item) =>
                    item.code === data.code
                      ? {
                          ...item,
                          parents: [
                            ...item.parents,
                            {
                              first_name: "",
                              last_name: "",
                              relation: "",
                              phoneNumber: "",
                            },
                          ],
                        }
                      : item
                  )
                );
              }}
            />
          </div>
          <button className="btn w-fit items-center bg-white text-black border-bordercl hover:bg-[#134a9abf] hover:text-white hover:border-bordercl self-center">
            Cập nhật
          </button>
        </div>
      </motion.div>
    </>
  );
};

export default Update;
