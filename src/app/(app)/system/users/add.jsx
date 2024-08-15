"use client";
import axios from "axios";
import TextInput from "@/app/_component/textInput";
import { useReducer, useState, useEffect, useCallback } from "react";
import { createUser } from "@/utils/funtionApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import DatePicker from "react-datepicker";
import Select from "react-select";
import "moment/locale/vi";

import { getWards } from "@/utils/funtionApi";

import "react-datepicker/dist/react-datepicker.css";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// const gender = [
//   {
//     value: 1,
//     label: "Nam",
//   },
//   {
//     value: 2,
//     label: "Nữ",
//   },
// ];

function reducer(state, action) {
  switch (action.type) {
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
    case "change_address": {
      return {
        ...state,
        address: action.payload.value,
      };
    }
    case "change_phoneNumber": {
      return {
        ...state,
        phoneNumber: action.payload.value,
      };
    }
    case "change_email": {
      return {
        ...state,
        email: action.payload.value,
      };
    }
    case "change_gender": {
      return {
        ...state,
        gender: action.payload.value,
      };
    }
    case "change_userName": {
      return {
        ...state,
        userName: action.payload.value,
      };
    }
    case "change_password": {
      return {
        ...state,
        password: action.payload.value,
      };
    }
    case "reset": {
      return action.payload.value;
    }
  }
}

const Add = ({ provinces, districts, gender }) => {
  const [mutating, setMutating] = useState(false);
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  const [infor, dispatchInfor] = useReducer(reducer, {
    userName: "",
    password: "",
    firtsName: "",
    lastName: "",
    address: "",
    phoneNumber: "",
    email: "",
    gender: null,
    dob: new Date(),
    userName: "",
    password: "",
  });

  const [province, setProvince] = useState();
  // console.log(province);

  const [district, setDistrict] = useState();
  // console.log(district);

  const [ward, setWard] = useState();

  useEffect(() => {
    province && setDistrict(null);
  }, [province]);

  const [wards, setWards] = useState();

  useEffect(() => {
    const callApi = async () => {
      setWards((await getWards(district.value)).data);
    };
    if (district) callApi();
  }, [district]);

  // console.log(wards);

  const mutation = useMutation({
    mutationFn: ({ token, arg }) => createUser(token, arg),
    onSuccess: () => {
      setMutating(false);
      queryClient.invalidateQueries(["get_user"]);
      dispatchInfor({
        type: "reset",
        payload: {
          value: {
            userName: "",
            password: "",
            firtsName: "",
            lastName: "",
            address: "",
            phoneNumber: "",
            email: "",
            gender: null,
            dob: null,
            userName: "",
            password: "",
          },
        },
      });
      toast.success("Tạo người dùng thành công!", {
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
      toast.error("Tạo người dùng không thành công!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        theme: "light",
      });
    },
  });

  const handleOnSubmit = useCallback(async () => {
    setMutating(true);
    const res = await axios({
      url: "/api/clerk",
      method: "post",
      data: {
        userName: infor.userName,
        password: infor.password,
        email: infor.email,
      },
    });
    if (res.status === 200) {
      let arg = {
        clerk_user_id: res.data.id,
        first_name: infor.firtsName,
        last_name: infor.lastName,
        date_of_birth: infor.dob,
        address: infor.address,
        ward_code: ward?.value,
        district_code: district?.value,
        province_code: province?.value,
        phone_number: infor.phoneNumber,
        gender_id: infor.gender.value,
        email: infor.email,
      };

      // console.log(arg);

      let token = await getToken({
        template: process.env.NEXT_PUBLIC_TEMPLATE_USER,
      });

      mutation.mutate({ token, arg });
    } else {
      setMutating(false);
    }
  }, [infor, district, province, ward, wards]);

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
            autoComplete="off"
          >
            <div className="grid grid-cols-3 gap-[20px]">
              <TextInput
                label={"Họ đệm"}
                value={infor.firtsName}
                dispatch={dispatchInfor}
                action={"change_first_name"}
                id={"add_first_name"}
                className={"w-[70%]"}
                isRequire={true}
              />
              <TextInput
                label={"Tên"}
                value={infor.lastName}
                dispatch={dispatchInfor}
                action={"change_last_name"}
                id={"add_last_name"}
                className={"w-[30%]"}
                isRequire={true}
              />
              <div className={`  w-full flex flex-col gap-1 `}>
                <p className="text-xs">
                  Giới tính {"("}
                  <span className="text-red-600">*</span>
                  {")"}:
                </p>
                <Select
                  placeholder="Giới tính"
                  className="text-black text-sm"
                  classNames={{
                    control: () => "!rounded-[5px]",
                    input: () => "!pr-2.5 !pb-2.5 !pt-4 !m-0",
                    valueContainer: () => "!p-[0_8px]",
                    menu: () => "!z-[11]",
                  }}
                  options={gender}
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
                label={"Tên đăng nhập"}
                value={infor.userName}
                dispatch={dispatchInfor}
                action={"change_userName"}
                id={"add_userName"}
                className={"w-[70%]"}
                isRequire={true}
                autoComplete={"off"}
              /> */}
              <TextInput
                label={"Email"}
                value={infor.email}
                dispatch={dispatchInfor}
                action={"change_email"}
                id={"add_email"}
                isRequire={true}
              />
              <TextInput
                label={"Mật khẩu"}
                type={"password"}
                value={infor.password}
                dispatch={dispatchInfor}
                action={"change_password"}
                id={"add_password"}
                className={"w-[70%]"}
                isRequire={true}
                autoComplete={"new-password"}
              />

              <div className={`  w-full flex flex-col gap-1 `}>
                <p className="text-xs">Ngày sinh:</p>
                <DatePicker
                  autoComplete="off"
                  popperClassName="!z-[11]"
                  className=" px-2.5 pb-2.5 pt-4 w-full text-sm text-black rounded-[5px] border-[1px] border-gray-300"
                  id="add_change_dob"
                  selected={infor.dob}
                  peekNextMonth
                  showMonthDropdown
                  showYearDropdown
                  scrollableYearDropdown
                  yearDropdownItemNumber={15}
                  onChange={(date) =>
                    dispatchInfor({
                      type: "change_dob",
                      payload: {
                        value: date,
                      },
                    })
                  }
                />
              </div>

              <TextInput
                label={"Số điện thoại"}
                value={infor.phoneNumber}
                dispatch={dispatchInfor}
                action={"change_phoneNumber"}
                id={"add_phoneNumber"}
                className={"w-[70%]"}
                isRequire={true}
              />

              <TextInput
                label={"Địa chỉ"}
                value={infor.address}
                dispatch={dispatchInfor}
                action={"change_address"}
                id={"add_address"}
              />

              <div className={`  w-full flex flex-col gap-1 `}>
                <p className="text-xs">Tỉnh / Thành phố:</p>
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
              </div>

              <div className={`  w-full flex flex-col gap-1 `}>
                <p className="text-xs">Quận / Huyện:</p>
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
                          .filter(
                            (item) => item.province_code === province.value
                          )
                          .map((item) => ({
                            value: item.code,
                            label: item.name,
                          }))
                      : null
                  }
                  value={district}
                  onChange={setDistrict}
                />
              </div>

              <div className={`  w-full flex flex-col gap-1 `}>
                <p className="text-xs">Phường / Xã:</p>
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
                    label: item.name,
                  }))}
                  value={ward}
                  onChange={setWard}
                />
              </div>
            </div>
            {infor.firtsName &&
            infor.lastName &&
            infor.password &&
            infor.email &&
            infor.phoneNumber &&
            infor.gender ? (
              <button
                className="btn w-fit items-center bg-white text-black border-bordercl hover:bg-[#134a9abf] hover:text-white hover:border-bordercl self-center"
                onClick={(e) => {
                  e.preventDefault();
                  handleOnSubmit();
                }}
              >
                {mutating ? (
                  <span className="loading loading-spinner loading-sm bg-primary"></span>
                ) : (
                  "Thêm mới"
                )}
              </button>
            ) : (
              <></>
            )}
            {/* <button
              className="btn w-fit items-center bg-white text-black border-bordercl hover:bg-[#134a9abf] hover:text-white hover:border-bordercl self-center"
              onClick={(e) => {
                e.preventDefault();
                handleOnSubmit();
              }}
            >
              {mutating ? (
                <span className="loading loading-spinner loading-sm bg-primary"></span>
              ) : (
                "Thêm mới"
              )}
            </button> */}
          </form>
        </div>
      </div>
    </>
  );
};

export default Add;
