"use Client";
import React, { useState, useEffect, useCallback } from "react";
import TextInput from "@/app/_component/textInput";
import { createDiscountType } from "@/utils/funtionApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Add({ data }) {
  console.log(data);
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  const [code, setCode] = useState();
  const [name, setName] = useState();
  const mutation = useMutation({
    mutationFn: ({ token, objects }) => createDiscountType(token, objects),
    onSuccess: () => {
      queryClient.invalidateQueries(["get_discount_type"]);
      setCode("");
      setName("");
      toast.success("Tạo loại mã giảm giá thành công!", {
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
      toast.error("Tạo loại mã giảm giá không thành công!", {
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
      e.preventDefault();
      const isCodeExist = data.result.some((item) => item.code === code);

      if (isCodeExist) {
        toast.error("Mã loại giảm giá đã tồn tại!", {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          theme: "light",
        });
        return;
      } 

      let objects = {
        code: code,
        name: name,
      };
      let token = await getToken({
        template: process.env.NEXT_PUBLIC_TEMPLATE_USER,
      });

      mutation.mutate({ token, objects });
      // console.log(objects);
    },
    [code, name, data, getToken, mutation]
  );

  return (
    <>
      <input type="checkbox" id={`modal_add`} className="modal-toggle" />
      <div className="modal" role="dialog">
        <div
          className="modal-box flex flex-col gap-3 max-w-full w-1/2"
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
            className="flex flex-col gap-[20px] mt-[20px] p-5"
            style={{ overflowY: "unset" }}
          >
            <p>Thêm mới loại giảm giá</p>
            <TextInput
              label={"Mã loại giảm giá (Không được trùng lặp)"}
              value={code}
              action={(value) => setCode(value)}
              id={"add_code"}
              className={"w-[70%]"}
              required
            />
            <TextInput
              label={"Tên loại giảm giá"}
              value={name}
              action={(value) => setName(value)}
              id={"add_name"}
              className={"w-[70%]"}
              required
            />
            {code && name ? (
              <button
                className="btn w-fit items-center bg-white text-black border-bordercl hover:bg-[#134a9abf] hover:text-white hover:border-bordercl self-center"
                // onClick={(e) => {
                //   e.preventDefault();
                //   handleOnSubmit();
                // }}
                type="submit"
              >
                {mutation.isLoading ? (
                  <span className="loading loading-spinner loading-sm bg-primary"></span>
                ) : (
                  "Thêm mới"
                )}
              </button>
            ) : (
              <></>
            )}
          </form>
        </div>
      </div>
    </>
  );
}
