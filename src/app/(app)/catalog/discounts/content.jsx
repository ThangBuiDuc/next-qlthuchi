"use client";
import { useState, Fragment } from "react";
import { GoPersonAdd } from "react-icons/go";
import TextInput from "@/app/_component/textInput";
import Add from "./add";

// import { motion } from "framer-motion";

function Item({ data, index }) {
  return (
    <tr className="hover">
      <th>{index + 1}</th>
      <th>{data.discount_type.name}</th>
      <th>{data.code}</th>
      <th>{data.description}</th>
      <th>{data.ratio *100} %</th>
      <th>{data.revenue_group.name}</th>
    </tr>
  );
}

const Content = ({ discountsData, discountTypeData, revenueGroupData }) => {
  console.log(discountsData);

  return (
    <div className="flex flex-col gap-[30px]">
      <label
        htmlFor={`modal_add`}
        className="btn w-fit items-center bg-white text-black border-bordercl hover:bg-[#134a9abf] hover:text-white hover:border-bordercl"
      >
        <GoPersonAdd size={20} />
        Thêm mới
      </label>
      <Add discountTypeData = {discountTypeData} revenueGroupData = {revenueGroupData} />
      <div className="overflow-x-auto">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th>STT</th>
              <th>Loại giảm giá</th>
              <th>Mã giảm giá</th>
              <th>Mô tả</th>
              <th>Tỉ lệ giảm</th>
              <th>Nhóm áp dụng</th>
            </tr>
          </thead>
          <tbody>
            {discountsData.result.map((item, index) => (
              <Fragment key={item.id}>
                <Item data={item} index={index} />
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Content;
