"use client";
import axios from "axios";
import React, { useState, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  createInsuaranceUnitPrice,
  getInsuranceRules,
} from "@/utils/funtionApi";
import { useQuery } from "@tanstack/react-query";
import Item from "./item";
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell} from "@nextui-org/react";

const Skeleton = () => {
  return (
    <>
      {[...Array(3)].map((_, i) => (
        <tr key={i}>
          {[...Array(5)].map((_, ii) => (
            <td key={ii}>
              <>
                <div className="skeleton h-4 w-full"></div>
              </>
            </td>
          ))}
        </tr>
      ))}
    </>
  );
};

const Content = ({ permission, rules, price }) => {
  const ruleData = useQuery({
    queryKey: ["get_rules"],
    queryFn: async () => await getInsuranceRules(),
    initialData: () => ({ data: rules }),
  });

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
            type="text"
            name="unit_price"
            className="block w-56 rounded-md py-1.5 px-2 ring-1 ring-inset ring-gray-400 focus:text-gray-800"
            disabled={disabled}
            value={unitPrice || ""}
            ref={inputRef}
            onChange={(e) => {
              setUnitPrice(e.target.value);
            }}
          />
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
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="table table-pin-rows ">
          <thead className="">
            <tr>
              {/* <th rowSpan="2"></th> */}
              <th
                rowSpan="2"
                className="border-separate border border-slate-400"
              >
                Khối lớp
              </th>
              <th
                colSpan="2"
                className="border-separate border border-slate-400"
              >
                Ngày sinh
              </th>
              <th
                rowSpan="2"
                className="border-separate border border-slate-400"
              >
                Số tháng
              </th>
              <th rowSpan="2"></th>
              <th rowSpan="2"></th>
            </tr>
            <tr>
              <th className="border-separate border border-slate-400">Từ</th>
              <th className="border-separate border border-slate-400">Đến</th>
            </tr>
          </thead>
          <tbody>
            {ruleData.isFetching || ruleData.isLoading ? (
              <Skeleton />
            ) : ruleData?.data?.data?.length === 0 ? (
              <p>Không có kết quả!</p>
            ) : ruleData ? (
              ruleData?.data?.data.result.map((item, index) => (
                <Item key={item.id} data={item} index={index} />
              ))
            ) : (
              <></>
            )}
          </tbody>
        </table>
      </div>
      <Table isStriped aria-label="Example static collection table">
        <TableHeader>
          <TableColumn>NAME</TableColumn>
          <TableColumn>ROLE</TableColumn>
          <TableColumn>STATUS</TableColumn>
        </TableHeader>
        <TableBody>
          <TableRow key="1">
            <TableCell>Tony Reichert</TableCell>
            <TableCell>CEO</TableCell>
            <TableCell>Active</TableCell>
          </TableRow>
          <TableRow key="2">
            <TableCell>Zoey Lang</TableCell>
            <TableCell>Technical Lead</TableCell>
            <TableCell>Paused</TableCell>
          </TableRow>
          <TableRow key="3">
            <TableCell>Jane Fisher</TableCell>
            <TableCell>Senior Developer</TableCell>
            <TableCell>Active</TableCell>
          </TableRow>
          <TableRow key="4">
            <TableCell>William Howard</TableCell>
            <TableCell>Community Manager</TableCell>
            <TableCell>Vacation</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default Content;
