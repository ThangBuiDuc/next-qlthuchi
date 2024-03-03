"use client";
import { useState, Fragment } from "react";
import { GoPersonAdd } from "react-icons/go";
import Add from "./add";
import Edit from "./edit";
import { getDiscounts } from "@/utils/funtionApi";
import { useQuery } from "@tanstack/react-query";
import { GoGear } from "react-icons/go";
// import { motion } from "framer-motion";

const Skeleton = () => {
  return (
    <>
      {[...Array(6)].map((_, i) => (
        <tr key={i}>
          {[...Array(8)].map((_, ii) => (
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

function Item({ data, index, discountTypeData, revenueGroupData }) {
  return (
    <tr className="hover" key={index}>
      <td>{index + 1}</td>
      <td>{data.discount_type.name}</td>
      <td>{data.code}</td>
      <td>{data.description}</td>
      <td>{data.ratio * 100} %</td>
      <td>{data.revenue_group.name}</td>
      <td>
        <label
          htmlFor={`modal_fix_${data.id}`}
          className="btn w-fit items-center bg-white text-black border-bordercl hover:bg-[#134a9abf] hover:text-white hover:border-bordercl"
        >
          <GoGear size={20} />
        </label>
      </td>
      <td>
        <>
          <Edit
            data={data}
            discountTypeData={discountTypeData}
            revenueGroupData={revenueGroupData}
          />
        </>
      </td>
    </tr>
  );
}

const Content = ({ discountsData, discountTypeData, revenueGroupData }) => {
  console.log(discountsData);

  const data = useQuery({
    queryKey: ["get_discount"],
    queryFn: async () => await getDiscounts(),
    initialData: () => ({ data: discountsData }),
  });

  return (
    <div className="flex flex-col gap-[30px]">
      <label
        htmlFor={`modal_add`}
        className="btn w-fit items-center bg-white text-black border-bordercl hover:bg-[#134a9abf] hover:text-white hover:border-bordercl"
      >
        <GoPersonAdd size={20} />
        Thêm mới
      </label>
      <Add
        discountTypeData={discountTypeData}
        revenueGroupData={revenueGroupData}
      />
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
              <th></th>
            </tr>
          </thead>
          <tbody>
            {data.isFetching || data.isLoading ? (
              <Skeleton />
            ) : data?.data?.data?.length === 0 ? (
              <p>Không có kết quả!</p>
            ) : data ? (
              data?.data?.data.result.map((item, index) => (
                <Fragment key={index}>
                  <Item
                    data={item}
                    index={index}
                    discountTypeData={discountTypeData}
                    revenueGroupData={revenueGroupData}
                  />
                </Fragment>
              ))
            ) : (
              <></>
            )}
            {/* {discountsData.result.map((item, index) => (
              <Fragment key={item.id}>
                <Item data={item} index={index} />
              </Fragment>
            ))} */}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Content;
