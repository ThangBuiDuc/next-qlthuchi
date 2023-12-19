"use client";
import axios from "axios";
import TextInput from "@/app/_component/textInput";
import { useReducer, useState, useEffect, useCallback } from "react";
import { createUser } from "@/utils/funtionApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import DatePicker from "react-datepicker";
import Select from "react-select";
import moment from "moment";
import "moment/locale/vi";

import { getWards } from "@/utils/funtionApi";

import "react-datepicker/dist/react-datepicker.css";

const gender = [
  {
    value: 1,
    label: "Nam",
  },
  {
    value: 2,
    label: "Nữ",
  },
];

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

const Add = ({ provinces, districts, jwt }) => {
  const queryClient = useQueryClient();
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
    mutationFn: ({ jwt, arg }) => createUser(jwt, arg),
    onSuccess: () => {
      queryClient.invalidateQueries(["count_user"]);
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
      Swal.fire({ title: "Tạo người dùng thành công!", icon: "success" });
    },

    onError: () => {
      Swal.fire({ title: "Tạo người dùng thất bại!", icon: "error" });
    },
  });

  const handleOnSubmit = useCallback(() => {
    Swal.fire({
      title: "Bạn có chắc chắn muốn tạo người dùng không?",
      icon: "question",
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: "Huỷ",
      confirmButtonText: "Xác nhận",
      showLoaderOnConfirm: true,
      allowEnterKey: false,
      allowEscapeKey: false,
      allowOutsideClick: () => !Swal.isLoading,
      preConfirm: async () => {
        const res = await axios({
          url: "/api/clerk",
          method: "post",
          data: {
            userName: infor.userName,
            password: infor.password,
            email: infor.email,
          },
        });
        // console.log(res.data);
        // return res;
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

          mutation.mutate({ jwt, arg });
        }
      },
    });
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
            onSubmit={handleOnSubmit}
            className="flex flex-col gap-[20px] mt-[20px]"
            style={{ overflowY: "unset" }}
          >
            <div className="grid grid-cols-3 gap-[20px]">
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
              <TextInput
                label={"Tên đăng nhập"}
                value={infor.userName}
                dispatch={dispatchInfor}
                action={"change_userName"}
                id={"add_userName"}
                className={"w-[70%]"}
              />
              <TextInput
                label={"Mật khẩu"}
                value={infor.password}
                dispatch={dispatchInfor}
                action={"change_password"}
                id={"add_password"}
                className={"w-[70%]"}
              />

              <div className="relative w-full">
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
                <label
                  htmlFor={"add_change_dob"}
                  className="cursor-pointer absolute text-sm text-gray-500  duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white  px-2 peer-focus:px-2 peer-focus:text-[#898989]  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
                >
                  Ngày sinh
                </label>
              </div>
              <TextInput
                label={"Số điện thoại"}
                value={infor.phoneNumber}
                dispatch={dispatchInfor}
                action={"change_phoneNumber"}
                id={"add_phoneNumber"}
                className={"w-[70%]"}
              />

              <TextInput
                label={"Email"}
                value={infor.email}
                dispatch={dispatchInfor}
                action={"change_email"}
                id={"add_email"}
              />
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
                  label: item.name,
                }))}
                value={ward}
                onChange={setWard}
              />
            </div>
            <button
              className="btn w-fit items-center bg-white text-black border-bordercl hover:bg-[#134a9abf] hover:text-white hover:border-bordercl self-center"
              // onClick={(e) => {
              //   e.preventDefault();
              //   handleOnSubmit();
              // }}
            >
              Thêm mới
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Add;
