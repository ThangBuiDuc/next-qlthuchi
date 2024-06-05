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
import moment from "moment";
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
    case "reset": {
      return action.payload.value;
    }
  }
}

const Edit = ({ data, provinces, districts, gender }) => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  const [infor, dispatchInfor] = useReducer(reducer, {
    firtsName: data.first_name,
    lastName: data.last_name,
    address: data.address,
    phoneNumber: data.phone_number,
    email: data.email,
    gender: data.gender?.id,
    dob: new Date(data.date_of_birth),
  });

  const [province, setProvince] = useState(
    data.province
      ? {
          value: data.province?.code,
          label: data.province?.name,
        }
      : null
  );
  // console.log(province);

  const [district, setDistrict] = useState(
    data.district
      ? {
          value: data.district?.code,
          label: data.district?.name,
        }
      : null
  );
  // console.log(district);

  const [ward, setWard] = useState(
    data.ward
      ? {
          value: data.ward?.code,
          label: data.ward?.name,
        }
      : null
  );

  // useEffect(() => {
  //   province && setDistrict(null);
  // }, [province]);

  // danh sách các xã
  const [wards, setWards] = useState();

  useEffect(() => {
    const callApi = async () => {
      setWards((await getWards(district.value)).data);
    };
    if (district) callApi();
  }, [district]);

  const mutation = useMutation({
    mutationFn: ({ id, token, changes }) => updateUser(id, token, changes),
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
      const modalCheckbox = document.getElementById(`modal_fix_${data.id}`);
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

  const handleOnSubmit = useCallback(async () => {
    let id = data.id;
    let changes = {
      first_name: infor.firtsName,
      last_name: infor.lastName,
      date_of_birth: moment(infor.dob).format("YYYY-MM-DD"),
      address: infor.address,
      ward_code: ward?.value,
      district_code: district?.value,
      province_code: province?.value,
      phone_number: infor.phoneNumber,
      gender_id: infor.gender?.value,
      email: infor.email,
    };

    let token = await getToken({
      template: process.env.NEXT_PUBLIC_TEMPLATE_USER,
    });

    mutation.mutate({ id, token, changes });
  }, [infor, district, province, ward, wards]);

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
            className="flex flex-col gap-[20px] mt-[20px] "
            style={{ overflowY: "unset" }}
          >
            <p className="self-center">Cập nhật thông tin cho người dùng</p>
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

              <div className={`  w-full flex flex-col gap-1 `}>
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
                  onChange={(e) => {
                    if (e.value !== province?.value) {
                      setProvince(e);
                      setDistrict(null);
                      setWard(null);
                    }
                  }}
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
                  onChange={(e) => {
                    if (e.value !== district?.value) {
                      setDistrict(e);
                      setWard(null);
                    }
                  }}
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
                  noOptionsMessage={() => "Đang tải ..."}
                />
              </div>
            </div>
            <button
              className="btn w-fit items-center bg-white text-black border-bordercl hover:bg-[#134a9abf] hover:text-white hover:border-bordercl self-center mt-[30px]"
              onClick={(e) => {
                e.preventDefault();
                handleOnSubmit();
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

const Update = ({ data, provinces, districts, permission, gender }) => {
  // console.log(data);
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
      <td>{data.province?.name}</td>
      <td>{data.email}</td>
      <td>{data.phone_number}</td>
      {permission === process.env.NEXT_PUBLIC_PERMISSION_READ_EDIT && (
        <>
          <td>
            <label
              htmlFor={`modal_fix_${data.id}`}
              className="btn w-fit items-center bg-white text-black border-bordercl hover:bg-[#134a9abf] hover:text-white hover:border-bordercl"
            >
              <GoGear size={25} />
            </label>
          </td>
          <td>
            <>
              <Edit
                data={data}
                provinces={provinces}
                districts={districts}
                gender={gender}
              />
            </>
          </td>
        </>
      )}
    </tr>
  );
};

export default memo(Update);
