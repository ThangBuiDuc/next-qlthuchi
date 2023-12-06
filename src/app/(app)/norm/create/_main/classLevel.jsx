"use client";

import Select from "react-select";
import { listContext } from "../content";
import { useCallback, useContext, useEffect, useState } from "react";
import CurrencyInput from "react-currency-input-field";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { createRevenueNorm } from "@/utils/funtionApi";
import { useAuth, useUser } from "@clerk/nextjs";
import "react-toastify/dist/ReactToastify.css";
import { IoIosInformationCircleOutline } from "react-icons/io";
import moment from "moment";
import "moment/locale/vi";
const Item = ({ norm, setNorm }) => {
  const { listRevenue, calculationUnit } = useContext(listContext);

  useEffect(() => {
    if (norm.gruop) setNorm((pre) => ({ ...pre, type: null }));
  }, [norm.gruop]);
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-4 auto-rows-auto gap-2">
        <Select
          noOptionsMessage={() => "Không tìm thấy kết quả phù hợp!"}
          placeholder="Nhóm khoản thu"
          options={listRevenue.revenue_group
            .sort((a, b) => a.id - b.id)
            .map((item) => ({
              value: item.id,
              label: item.name,
            }))}
          value={norm.gruop}
          onChange={(e) => {
            if (norm.gruop?.value !== e.value)
              setNorm((pre) => ({ ...pre, gruop: e }));
          }}
          className="text-black text-sm"
          classNames={{
            control: () => "!rounded-[5px]",
            input: () => "!pr-2.5 !pb-2.5 !pt-4 !m-0",
            valueContainer: () => "!p-[0_8px]",
            menu: () => "!z-[11]",
          }}
        />
        {norm.gruop && (
          <Select
            noOptionsMessage={() => "Không tìm thấy kết quả phù hợp!"}
            placeholder="Loại khoản thu"
            options={listRevenue.revenue_group
              .find((item) => item.id === norm.gruop.value)
              .revenue_types.sort((a, b) => a.id - b.id)
              .map((item) => ({
                value: item.id,
                label: item.name,
              }))}
            value={norm.type}
            onChange={(e) => setNorm((pre) => ({ ...pre, type: e }))}
            className="text-black text-sm"
            classNames={{
              control: () => "!rounded-[5px]",
              input: () => "!pr-2.5 !pb-2.5 !pt-4 !m-0",
              valueContainer: () => "!p-[0_8px]",
              menu: () => "!z-[11]",
            }}
          />
        )}
        {norm.type && (
          <Select
            noOptionsMessage={() => "Không tìm thấy kết quả phù hợp!"}
            placeholder="Khoản thu"
            options={listRevenue.revenue_group
              .find((item) => item.id === norm.gruop.value)
              .revenue_types.find((item) => item.id === norm.type.value)
              .revenues.map((item) => ({
                ...item,
                value: item.id,
                label: item.name,
              }))}
            value={norm.revenue}
            onChange={(e) => setNorm((pre) => ({ ...pre, revenue: e }))}
            className="text-black text-sm"
            classNames={{
              control: () => "!rounded-[5px]",
              input: () => "!pr-2.5 !pb-2.5 !pt-4 !m-0",
              valueContainer: () => "!p-[0_8px]",
              menu: () => "!z-[11]",
            }}
          />
        )}
        {norm.revenue && (
          <>
            <Select
              noOptionsMessage={() => "Không tìm thấy kết quả phù hợp!"}
              placeholder="Đơn vị tính"
              options={calculationUnit.calculation_units.map((item) => ({
                value: item.id,
                label: item.name,
              }))}
              value={norm.calculation_unit}
              onChange={(e) =>
                setNorm((pre) => ({ ...pre, calculation_unit: e }))
              }
              className="text-black text-sm"
              classNames={{
                control: () => "!rounded-[5px]",
                input: () => "!pr-2.5 !pb-2.5 !pt-4 !m-0",
                valueContainer: () => "!p-[0_8px]",
                menu: () => "!z-[11]",
              }}
            />

            <div className={`w-full relative `}>
              <input
                autoComplete="off"
                type={"number"}
                id={`quantity_${norm.id}`}
                className={`block px-2.5 pb-2.5 pt-4 w-full text-sm text-black bg-transparent rounded-[5px] border-[1px] border-gray-300 appearance-none dark:text-white dark:border-gray-600  focus:outline-none focus:ring-0  peer`}
                placeholder="Số lượng"
                value={norm.quantity}
                onWheel={(e) => e.target.blur()}
                onKeyDown={(evt) => evt.key === "e" && evt.preventDefault()}
                onChange={(e) => {
                  setNorm((pre) => ({
                    ...pre,
                    quantity: parseInt(e.target.value).toString(),
                    total: parseInt(e.target.value) * parseInt(pre.price),
                  }));
                }}
              />
              <label
                htmlFor={`quantity_${norm.id}`}
                className={`cursor-text absolute text-sm text-gray-500  duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white peer-focus:bg-white px-2 peer-focus:px-2 peer-focus:text-[#898989]   peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1`}
              >
                Số lượng
              </label>
            </div>
            <div className={`w-full relative `}>
              <CurrencyInput
                autoComplete="off"
                id={`price_${norm.id}`}
                intlConfig={{ locale: "vi-VN", currency: "VND" }}
                className={`block px-2.5 pb-2.5 pt-4 w-full text-sm text-black bg-transparent rounded-[5px] border-[1px] border-gray-300 appearance-none dark:text-white dark:border-gray-600  focus:outline-none focus:ring-0  peer`}
                placeholder="Đơn giá"
                value={norm.price ? norm.price : 0}
                decimalsLimit={2}
                onValueChange={(value) => {
                  setNorm((pre) => ({
                    ...pre,
                    price: parseInt(value),
                    total: parseInt(value) * parseInt(pre.quantity),
                  }));
                }}
              />
              <label
                htmlFor={`price_${norm.id}`}
                className={`cursor-text absolute text-sm text-gray-500  duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white peer-focus:bg-white px-2 peer-focus:px-2 peer-focus:text-[#898989]   peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1`}
              >
                Đơn giá
              </label>
            </div>
            <div className={`w-full relative `}>
              <CurrencyInput
                autoComplete="off"
                disabled
                id={`total_${norm.id}`}
                intlConfig={{ locale: "vi-VN", currency: "VND" }}
                className={`block px-2.5 pb-2.5 pt-4 w-full text-sm text-black bg-transparent rounded-[5px] border-[1px] border-gray-300 appearance-none dark:text-white dark:border-gray-600  focus:outline-none focus:ring-0  peer`}
                placeholder="Đơn giá"
                value={typeof norm.total === "number" ? norm.total : "NaN"}
                decimalsLimit={2}
                onValueChange={(value) =>
                  setNorm((pre) => ({ ...pre, total: value }))
                }
              />
              <label
                htmlFor={`total_${norm.id}`}
                className={`!cursor-not-allowe absolute text-sm text-gray-500  duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white peer-focus:bg-white px-2 peer-focus:px-2 peer-focus:text-[#898989]   peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1`}
              >
                Tổng tiền
              </label>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const ClassLevel = () => {
  const { listSearch, selectPresent } = useContext(listContext);
  const [selected, setSelected] = useState();
  const [norm, setNorm] = useState({
    gruop: null,
    type: null,
    revenue: null,
    calculation_unit: null,
    price: 100000,
    quantity: 1,
    total: 100000,
  });
  const [mutating, setMutating] = useState(false);
  const { getToken } = useAuth();
  const { user } = useUser();

  useEffect(() => {
    if (selected)
      setNorm({
        gruop: null,
        type: null,
        revenue: null,
        calculation_unit: null,
        price: 100000,
        quantity: 1,
        total: 100000,
      });
  }, [selected]);

  const mutation = useMutation({
    mutationFn: ({ token, objects, log }) =>
      createRevenueNorm(token, objects, log),
    onSuccess: () => {
      toast.success("Tạo mới định mức thu cho khối lớp thành công!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        theme: "light",
      });
      setNorm({
        gruop: null,
        type: null,
        revenue: null,
        calculation_unit: null,
        price: 100000,
        quantity: 1,
        total: 100000,
      });
      setMutating(false);
    },
    onError: () => {
      toast.error("Tạo mới định mức thu cho khối lớp không thành công!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        theme: "light",
      }),
        setMutating(false);
    },
  });

  const handleOnclick = useCallback(async () => {
    setMutating(true);
    let time = moment().format();
    let objects = {
      revenue_code: norm.revenue.code,
      batch_id: selectPresent.value,
      calculation_unit_id: norm.calculation_unit.value,
      class_level_id: selected.value,
      amount: norm.quantity,
      unit_price: norm.price,
      created_by: user.id,
      start_at: time,
    };

    let log = {
      clerk_user_id: user.id,
      type: "create",
      table: "revenue_norms",
      data: {
        revenue_code: norm.revenue.code,
        batch_id: selectPresent.value,
        calculation_unit_id: norm.calculation_unit.value,
        class_level_id: selected.value,
        amount: norm.quantity,
        unit_price: norm.price,
        created_by: user.id,
        start_at: time,
      },
    };

    let token = await getToken({
      template: process.env.NEXT_PUBLIC_TEMPLATE_ACCOUNTANT,
    });

    mutation.mutate({ token, objects, log });
  }, [norm, selected]);
  return (
    <>
      <div className="flex gap-1 items-center w-full">
        <h5>Cấp học: </h5>
        <Select
          noOptionsMessage={() => "Không tìm thấy kết quả phù hợp!"}
          placeholder="Vui lòng chọn!"
          options={listSearch.class_level
            .sort((a, b) => a.code - b.code)
            .map((item) => ({
              ...item,
              value: item.id,
              label: item.name,
            }))}
          value={selected}
          onChange={(e) => e.value !== selected?.value && setSelected(e)}
          className="text-black w-[30%]"
        />
      </div>
      <h5 className="text-center">Định mức thu</h5>
      {selected && (
        <>
          {norm && (
            <>
              <Item norm={norm} setNorm={setNorm} />
            </>
          )}
          <div className="flex justify-center gap-2">
            {mutating ? (
              <span className="loading loading-spinner loading-sm bg-primary"></span>
            ) : (
              <>
                {norm.gruop &&
                norm.type &&
                norm.revenue &&
                norm.calculation_unit &&
                norm.price &&
                norm.quantity &&
                norm.total ? (
                  <>
                    <button
                      className="btn w-fit"
                      onClick={() => handleOnclick()}
                    >
                      Hoàn thành
                    </button>
                    <div
                      className="tooltip flex items-center justify-center"
                      data-tip="Định mức thu trùng lặp sẽ lấy định mức thu thêm vào mới nhất!"
                    >
                      <IoIosInformationCircleOutline
                        size={20}
                        className="text-red-500"
                      />
                    </div>
                  </>
                ) : (
                  <></>
                )}
              </>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default ClassLevel;
