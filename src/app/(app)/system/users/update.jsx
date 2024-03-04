"use client";
import { useReducer, useState, useEffect, useCallback } from "react";
import Moment from "react-moment";
import { memo } from "react";
import { GoGear } from "react-icons/go";
import TextInput from "@/app/_component/textInput";
import Select from "react-select";
import DatePicker from "react-datepicker";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { updateUser } from "@/utils/funtionApi";
import { getWards } from "@/utils/funtionApi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";




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
    case "reset": {
      return action.payload.value;
    }
  }
}

const Edit = ({ data, provinces, districts }) => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
 
  const [infor, dispatchInfor] = useReducer(reducer, {
    firtsName: "",
    lastName: "",
    address: "",
    phoneNumber: "",
    email: "",
    gender: null,
    dob: new Date(),
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


  const mutation = useMutation({
    mutationFn: ({ token, objects }) => updateUser(token, objects),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["get_user"],
      });
      toast.success("Cập nhật thông tin người dùng thành công!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        theme: "light",
      });
      const modalCheckbox = document.getElementById(`modal_add_${data.id}`);
      if (modalCheckbox) {
        modalCheckbox.checked = false;
      }
    },
    onError: () => {
      toast.error("Cập nhật thông tin người dùng không thành công!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        theme: "light",
      });
    },
  });

  // const handleOnSubmit = useCallback(async () => {
  //   let objects = {
  //     user_id: data.id,
  //     role_id: roleId?.value,
  //   };

  //   let token = await getToken({
  //     template: process.env.NEXT_PUBLIC_TEMPLATE_ADMIN,
  //   });

  //   mutation.mutate({ token, objects });
  // }, [roleId]);

  return (
    <>
      <input
        type="checkbox"
        id={`modal_fix_${data.id}`}
        className="modal-toggle"
      />
      <div className="modal" role="dialog">
        <div
          className="modal-box flex flex-col gap-3 max-w-full w-6/12"
          style={{ overflowY: "unset" }}
        >
          <label
            htmlFor={`modal_fix_${data.id}`}
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 cursor-pointer"
          >
            ✕
          </label>
          <form
            // onSubmit={handleOnSubmit}
            className="flex flex-col gap-[20px] mt-[20px]"
            style={{ overflowY: "unset" }}
          >
            <p>Cập nhật thông tin cho người dùng</p>
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
                noOptionsMessage={() => 'Đang tải ...'}
              />


            </div>
            <button
              className="btn w-fit items-center bg-white text-black border-bordercl hover:bg-[#134a9abf] hover:text-white hover:border-bordercl self-center mt-[30px]"
              onClick={(e) => {
                e.preventDefault();
                // handleOnSubmit();
              }}
            >
              {mutation.isLoading ? (
                <span className="loading loading-spinner loading-sm bg-primary"></span>
              ) : (
                "Cập nhật"
              )}
            </button> 
          </form>
        </div>
      </div>
    </>
  );
};




const Update = ({ data, provinces, districts }) => {
  console.log(data);
  return (
    <tr>
      <td>{data.id}</td>
      <td>
        {data.first_name} {data.last_name}
      </td>
      <td>{data.gender.description}</td>
      <td>
        <Moment format="DD/MM/YYYY">{data.date_of_birth}</Moment>
      </td>
      <td>{data.address}</td>
      <td>{data.ward?.name}</td>
      <td>{data.district?.name}</td>
      <td>{data.provice?.name}</td>
      <td>{data.email}</td>
      <td>{data.phone_number}</td>
      <td>
        <label
          htmlFor={`modal_fix_${data.id}`}
          className="btn w-fit items-center bg-white text-black border-bordercl hover:bg-[#134a9abf] hover:text-white hover:border-bordercl"
        >
          <GoGear size={25} />
        </label>
      </td>
      <td><><Edit data={data} provinces={provinces} districts={districts} /></></td>
    </tr>
  );
};

export default memo(Update);
