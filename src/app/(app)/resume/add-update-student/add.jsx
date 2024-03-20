"use client";
import TextInput from "@/app/_component/textInput";
import { useCallback, useEffect, useReducer, useState } from "react";

import DatePicker from "react-datepicker";
import Select from "react-select";
import { registerLocale } from "react-datepicker";
import vi from "date-fns/locale/vi";
import moment from "moment";
import "moment/locale/vi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

registerLocale("vi", vi);

import "react-datepicker/dist/react-datepicker.css";
import { createStudent } from "@/utils/funtionApi";
import { useAuth } from "@clerk/nextjs";

function areAllTrue(obj, excludeKey) {
  for (let key in obj) {
    if (key !== excludeKey && !obj[key]) {
      return false;
    }
  }
  return true;
}

function createId(lastCount, code) {
  return `${code}${moment().year().toString().slice(-2)}${(
    "0000" +
    (lastCount + 1)
  ).slice(-4)}`;
}

function reducer(state, action) {
  switch (action.type) {
    case "change_code": {
      return {
        ...state,
        code: action.payload.value,
      };
    }

    case "change_bgd_code": {
      return {
        ...state,
        bgd_code: action.payload.value,
      };
    }

    case "change_class": {
      return {
        ...state,
        class: action.payload.value,
      };
    }

    // case "change_class": {
    //   return {
    //     ...state,
    //     class: action.payload.value,
    //   };
    // }

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

    case "change_status": {
      return {
        ...state,
        status: action.payload.value,
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

    case "reset": {
      return action.payload.value;
    }
  }
}

const Add = ({ catalogStudent, countStudent, present }) => {
  const [mutating, setMutating] = useState(false);
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  const [infor, dispatchInfor] = useReducer(reducer, {
    code: createId(
      countStudent.result.find(
        (el) =>
          el.school_level_code === catalogStudent.classes[0].school_level_code
      ).count,
      catalogStudent.classes[0].school_level_code
    ),
    bgd_code: null,
    gender: null,
    class: {
      ...catalogStudent.classes[0],
      value: catalogStudent.classes[0].name,
      label: catalogStudent.classes[0].name,
    },
    status: null,
    firtsName: "",
    lastName: "",
    joinDate: null,
    dob: null,
    address: "",
  });

  useEffect(() => {
    if (infor.code)
      dispatchInfor({
        type: "change_code",
        payload: {
          value: createId(
            countStudent.result.find(
              (el) =>
                el.school_level_code ===
                catalogStudent.classes[0].school_level_code
            ).count,
            catalogStudent.classes[0].school_level_code
          ),
        },
      });
  }, [countStudent]);
  const mutation = useMutation({
    mutationFn: ({ token, objects }) => createStudent(token, objects),
    onSuccess: () => {
      setMutating(false);
      document.getElementById("modal_add").close();
      queryClient.invalidateQueries(["count_student"]);
      dispatchInfor({
        type: "reset",
        payload: {
          value: {
            code: createId(
              countStudent.result.find(
                (el) =>
                  el.school_level_code ===
                  catalogStudent.classes[0].school_level_code
              ).count,
              catalogStudent.classes[0].school_level_code
            ),
            gender: null,
            class: {
              ...catalogStudent.classes[0],
              value: catalogStudent.classes[0].name,
              label: catalogStudent.classes[0].name,
            },
            status: null,
            firtsName: "",
            lastName: "",
            joinDate: null,
            dob: null,
            address: "",
          },
        },
      });
      toast.success("Tạo mới học sinh thành công!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        theme: "light",
      });
    },
    onError: () => {
      setMutating(false);
      document.getElementById("modal_add").close();
      toast.error("Tạo mới học sinh không thành công!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        theme: "light",
      });
    },
  });

  const handleOnSubmit = useCallback(
    async (e) => {
      setMutating(true);
      e.preventDefault();
      let objects = {
        code: infor.code,
        bgd_code: infor.bgd_code,
        first_name: infor.firtsName,
        last_name: infor.lastName,
        date_of_birth: moment(infor.dob).format("MM/DD/YYYY"),
        gender_id: infor.gender.value,
        address: infor.address,
        join_date: moment(infor.joinDate).format("MM/DD/YYYY"),
        status_id: infor.status.value,
        schoolyear_students: {
          data: {
            class_code: infor.class.value,
            school_year_id: present.result[0].id,
          },
        },
      };
      let token = await getToken({
        template: process.env.NEXT_PUBLIC_TEMPLATE_USER,
      });

      mutation.mutate({ token, objects });
    },
    [infor]
  );

  useEffect(() => {
    let count = countStudent.result.find(
      (el) => el.school_level_code === infor.class.school_level_code
    );
    dispatchInfor({
      type: "change_code",
      payload: {
        value: createId(count.count, count.school_level_code),
      },
    });
  }, [infor.class]);

  return (
    <dialog id="modal_add" className="modal !z-[20]">
      <div className="modal-box w-11/12 max-w-5xl bg-white ">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <form onSubmit={handleOnSubmit} className="flex flex-col gap-[20px]">
          <div className="grid grid-cols-2 grid-rows-2 gap-[25px] mt-[20px]">
            <TextInput
              label={"Mã học sinh"}
              disable={true}
              value={infor.code}
              isRequire={true}
              id={"add_code"}
              action={"change_code"}
              dispatch={dispatchInfor}
            />
            <TextInput
              label={"Mã bộ giáo dục học sinh"}
              disable={false}
              value={infor.bgd_code}
              isRequire={true}
              id={"add_bgd_code"}
              action={"change_bgd_code"}
              dispatch={dispatchInfor}
            />
            <div className="flex flex-col gap-1">
              <p className="text-xs">Lớp học:</p>
              <Select
                placeholder="Lớp"
                className="text-black text-sm"
                classNames={{
                  control: () => "!rounded-[5px]",
                  input: () => "!pr-2.5 !pb-2.5 !pt-4 !m-0",
                  valueContainer: () => "!p-[0_8px]",
                  menu: () => "!z-[11]",
                }}
                options={catalogStudent.classes
                  .sort((a, b) => a.class_level_code - b.class_level_code)
                  .map((item) => ({
                    ...item,
                    value: item.name,
                    label: item.name,
                  }))}
                value={infor.class}
                onChange={(e) =>
                  dispatchInfor({ type: "change_class", payload: { value: e } })
                }
              />
            </div>
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
            <div className=" w-full flex flex-col gap-1">
              <p className="text-xs">Ngày sinh:</p>
              <DatePicker
                placeholderText="Nhập ngày sinh"
                locale={"vi"}
                autoComplete="off"
                popperClassName="!z-[11]"
                className=" px-2.5 pb-2.5 pt-4 w-full text-sm text-black rounded-[5px] border-[1px] border-gray-300"
                id="add_change_dob"
                peekNextMonth
                showMonthDropdown
                showYearDropdown
                scrollableYearDropdown
                yearDropdownItemNumber={15}
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
              {/* <label
                htmlFor={"add_change_dob"}
                className="cursor-pointer absolute text-sm text-gray-500  duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white  px-2 peer-focus:px-2 peer-focus:text-[#898989]  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
              >
                Ngày sinh
              </label> */}
            </div>

            <div className=" flex flex-col gap-1">
              <p className="text-xs">Giới tính:</p>
              <Select
                placeholder="Giới tính"
                className="text-black text-sm"
                classNames={{
                  control: () => "!rounded-[5px]",
                  input: () => "!pr-2.5 !pb-2.5 !pt-4 !m-0",
                  valueContainer: () => "!p-[0_8px]",
                  menu: () => "!z-[11]",
                }}
                options={catalogStudent.gender.map((item) => ({
                  value: item.id,
                  label: item.description,
                }))}
                value={infor.gender}
                onChange={(e) =>
                  dispatchInfor({
                    type: "change_gender",
                    payload: { value: e },
                  })
                }
              />
            </div>

            {/* <TextInput
              label={"Email"}
              type={"email"}
              value={infor.email}
              dispatch={dispatchInfor}
              action={"change_email"}
              id="add_email"
            /> */}

            {/* <TextInput
              label={"Số điện thoại"}
              value={infor.phoneNumber}
              dispatch={dispatchInfor}
              action={"change_phoneNumber"}
              id="add_phoneNumber"
            /> */}

            <div className="flex flex-col gap-1">
              <p className="text-xs">Ngày nhập học:</p>
              <DatePicker
                locale={"vi"}
                placeholderText="Nhập ngày nhập học"
                showMonthDropdown
                showYearDropdown
                scrollableYearDropdown
                yearDropdownItemNumber={15}
                autoComplete="off"
                popperClassName="!z-[11]"
                className=" px-2.5 pb-2.5 pt-4 w-full text-sm text-black rounded-[5px] border-[1px] border-gray-300 focus:outline-none "
                id="add_change_joinDate"
                selected={infor.joinDate}
                onChange={(date) =>
                  dispatchInfor({
                    type: "change_joinDate",
                    payload: {
                      value: date,
                    },
                  })
                }
              />
              {/* <label
                htmlFor={"add_change_joinDate"}
                className="cursor-pointer absolute text-sm text-gray-500  duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white  px-2  left-1"
              >
                Ngày nhập học
              </label> */}
            </div>
            <div className=" w-full flex flex-col gap-1">
              <p className="text-xs">Trạng thái:</p>
              <Select
                placeholder="Trạng thái"
                className="text-black text-sm"
                classNames={{
                  control: () => "!rounded-[5px]",
                  input: () => "!pr-2.5 !pb-2.5 !pt-4 !m-0",
                  valueContainer: () => "!p-[0_8px]",
                  menu: () => "!z-[11]",
                }}
                options={catalogStudent.status.map((item) => ({
                  value: item.id,
                  label: item.name,
                }))}
                value={infor.status}
                onChange={(e) =>
                  dispatchInfor({
                    type: "change_status",
                    payload: { value: e },
                  })
                }
              />
            </div>
            <TextInput
              className={"col-span-2"}
              label={"Địa chỉ"}
              value={infor.address}
              dispatch={dispatchInfor}
              action={"change_address"}
              id={"add_address"}
            />
          </div>
          {mutating ? (
            <span className="loading loading-spinner loading-sm bg-primary self-center"></span>
          ) : (
            areAllTrue(infor, "bgd_code") && (
              <button className="btn w-fit items-center bg-white text-black border-bordercl hover:bg-[#134a9abf] hover:text-white hover:border-bordercl self-center">
                Thêm mới
              </button>
            )
          )}
        </form>
      </div>
    </dialog>
  );
};

export default Add;
