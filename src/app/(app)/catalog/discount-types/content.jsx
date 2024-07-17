"use client";
import { useState, Fragment } from "react";
import { GoPersonAdd } from "react-icons/go";
import Add from "./add";
import Edit from "./edit";
import { useQuery } from "@tanstack/react-query";
import { GoGear } from "react-icons/go";
import { getDiscountType } from "@/utils/funtionApi";

const Skeleton = () => {
  return (
    <>
      {[...Array(6)].map((_, i) => (
        <tr key={i}>
          {[...Array(4)].map((_, ii) => (
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

function Item({ data, index, permission }) {
  return (
    <tr className="hover" key={index}>
      <td>{index + 1}</td>
      <td>{data.code}</td>
      <td>{data.name}</td>
      {permission === process.env.NEXT_PUBLIC_PERMISSION_READ_EDIT && (
        <td>
          <>
            <label
              htmlFor={`modal_fix_${data.id}`}
              className="btn w-fit items-center bg-white text-black border-bordercl hover:bg-[#134a9abf] hover:text-white hover:border-bordercl"
            >
              <GoGear size={20} />
            </label>

            <Edit data={data} />
          </>
        </td>
      )}
    </tr>
  );
}

export default function Content({ discountTypeData, permission }) {
  const data = useQuery({
    queryKey: ["get_discount_type"],
    queryFn: async () => await getDiscountType(),
    initialData: () => ({ data: discountTypeData }),
  });
  return (
    <div className="flex flex-col gap-[30px]">
      {permission === process.env.NEXT_PUBLIC_PERMISSION_READ_EDIT && (
        <>
          <label
            htmlFor={`modal_add`}
            className="btn w-fit items-center bg-white text-black border-bordercl hover:bg-[#134a9abf] hover:text-white hover:border-bordercl"
          >
            <GoPersonAdd size={20} />
            Thêm mới
          </label>
          <Add data={discountTypeData} />
        </>
      )}
      <div className="overflow-x-auto">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th>STT</th>
              <th>Mã loại giảm giá</th>
              <th>Tên loại giảm giá</th>
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
                  <Item data={item} index={index} permission={permission} />
                </Fragment>
              ))
            ) : (
              <></>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
