"use client";
import { useReducer, useState, useEffect, useCallback } from "react";
import TextInput from "@/app/_component/textInput";
import Select from "react-select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { updateDiscount } from "@/utils/funtionApi";
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
      }
    }
    case "change_ratio": {
      return {
        ...state,
        ratio: action.payload.value,
      }
    }
    case "reset": {
      return action.payload.value;
    }
  }
}

const Edit = ({ data, revenueGroupData, discountTypeData }) => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();




  const [discountType,setDiscountType] = useState(
    data.discount_type ? {
      value: data.discount_type.id,
      label: data.discount_type.name
    } : null
  );
  const [revenueGroup,setRevenueGroup] = useState(
    data.revenue_group ? {
      value: data.revenue_group.id,
      label: data.revenue_group.name
    } : null
  );
  const [infor, dispatchInfor] = useReducer(reducer, {
    code: data.code,
    description: data.description,
    ratio: data.ratio * 100,
  });

  const mutation = useMutation({
    mutationFn: ({id, token, changes }) => updateDiscount(id, token, changes),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["get_discount"],
      });
      toast.success("Cập nhật mã giảm giá thành công!", {
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
      toast.error("Cập nhật mã giảm giá không thành công!", {
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
      code: infor.code,
      description: infor.description,
      ratio: infor.ratio / 100,
      discount_type_id: discountType?.value,
      revenue_group_id: revenueGroup?.value
    };

    console.log(id)

    let token = await getToken({
      template: process.env.NEXT_PUBLIC_TEMPLATE_ADMIN,
    });

    console.log(token)
    mutation.mutate({id, token, changes });
  }, [discountType,revenueGroup,infor.code,infor.description,infor.ratio]);

  // console.log("data:",data)

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
            className="flex flex-col gap-[20px] mb-[10px]"
            style={{ overflowY: "unset" }}
          >
            <h4 className="self-center">Cập nhật mã giảm giá</h4>
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
                label={"Mã giảm giá"}
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
                className={"w-fit"}
              />
              <TextInput
                label={"Tỉ lệ giảm"}
                value={infor.ratio}
                dispatch={dispatchInfor}
                action={"change_ratio"}
                id={"add_description"}
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
                value={revenueGroup}
                onChange={setRevenueGroup}
              />
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

export default Edit;
