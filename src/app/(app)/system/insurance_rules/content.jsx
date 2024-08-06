"use client";
import axios from "axios";
import React, { useState, useRef, useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  createInsuaranceUnitPrice,
  getInsuranceRules,
} from "@/utils/funtionApi";
import { useQuery } from "@tanstack/react-query";
import Rules from "./rules";

const Content = ({ permission, rules, price, class_levels }) => {
  const [mutating, setMutating] = useState(false);
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  const [unitPrice, setUnitPrice] = useState(price);
  const [disabled, setDisabled] = useState(true);
  const inputRef = useRef(null);

  const enableInput = () => {
    setDisabled(false);
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 0);
  };

  const handleCancel = () => {
    setDisabled(true);
    setUnitPrice(price);
  };

  const mutation = useMutation({
    mutationFn: ({ token, unit_price }) =>
      createInsuaranceUnitPrice(token, unit_price),
    onSuccess: () => {
      setMutating(false);
      setDisabled(true);
      queryClient.invalidateQueries([""]);
      toast.success("Tạo đơn giá thành công!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        theme: "light",
      });
    },

    onError: () => {
      setMutating(false);
      toast.error("Tạo đơn giá không thành công!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        theme: "light",
      });
    },
  });

  const handleSave = async () => {
    setMutating(true);
    const token = await getToken({
      template: process.env.NEXT_PUBLIC_TEMPLATE_USER,
    });
    mutation.mutate({ token, unit_price: unitPrice });
  };

  // console.log(unitPrice)
  // console.log(ruleData);

  return (
    <div className="flex flex-col gap-10 px-10 py-5">
      <div>
        <label
          htmlFor="unit_price"
          className="block text-gray-800 font-semibold text-sm"
        >
          Đơn giá
        </label>
        <div className="flex mt-2 gap-5">
          <input
            type="number"
            name="unit_price"
            className="block w-56 rounded-md py-1.5 px-2 ring-1 ring-inset ring-gray-400 focus:text-gray-800"
            disabled={disabled}
            value={unitPrice || ""}
            ref={inputRef}
            onChange={(e) => {
              setUnitPrice(e.target.value);
            }}
          />
          {permission === process.env.NEXT_PUBLIC_PERMISSION_READ_EDIT && (
            <>
              {disabled ? (
                <button
                  onClick={enableInput}
                  className="px-4 py-2 bg-gray-800 text-white rounded"
                >
                  Sửa
                </button>
              ) : (
                <>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-gray-800 text-white rounded"
                  >
                    Lưu
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 bg-gray-800 text-white rounded"
                  >
                    Huỷ
                  </button>
                </>
              )}
            </>
          )}
        </div>
      </div>
      <Rules rules={rules} class_levels={class_levels} permission = {permission}/>
    </div>
  );
};

export default Content;
