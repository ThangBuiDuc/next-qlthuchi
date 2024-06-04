"use client";
import Select from "react-select";
import {
  useContext,
  useState,
  useRef,
  useLayoutEffect,
  useCallback,
} from "react";
import { listContext } from "../content";
import CurrencyInput from "react-currency-input-field";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  createExpectedRevenue,
  getExpectedRevenue,
  updateExpectedRevenue,
  createExpectedRevenueWithOutRevenue,
} from "@/utils/funtionApi";
import { useAuth, useUser } from "@clerk/nextjs";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";
import "moment/locale/vi";
import { TbReload } from "react-icons/tb";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { useReactToPrint } from "react-to-print";
import localFont from "next/font/local";
import Html2Pdf from "js-html2pdf";

const times = localFont({ src: "../../../../times.ttf" });

function splitArrayIntoTwo(arr) {
  const splitPoint = Math.floor(arr.length / 2);
  const part1 = arr.slice(0, splitPoint);
  const part2 = arr.slice(splitPoint);
  return [part1, part2];
}

const getDiffArray = (a, b) => {
  return b.reduce(
    (total, item) =>
      JSON.stringify(item) === JSON.stringify(a.find((el) => el.id === item.id))
        ? total
        : [...total, item],
    []
  );
};

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

const Skeleton = () => {
  return (
    <>
      {[...Array(4)].map((_, index) => (
        <tr key={index}>
          {[...Array(9)].map((_, i) => (
            <td key={i}>
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

const AddContent1 = ({ student, currentRef, existRevenue }) => {
  const queryClient = useQueryClient();
  const { selectPresent, listRevenue, calculationUnit } =
    useContext(listContext);
  const [norm, setNorm] = useState({
    group: null,
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

  const mutation = useMutation({
    mutationFn: ({ token, objects }) => createExpectedRevenue(token, objects),
    onSuccess: () => {
      currentRef.current.close();
      queryClient.invalidateQueries(["get_expected_revenue", student.code]);
      // document.getElementById(`modal_${hit.code}`).close();
      toast.success("Tạo mới dự kiến thu cho học sinh thành công!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        theme: "light",
      });
      setNorm({
        group: null,
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
      currentRef.current.close();
      toast.error("Tạo mới dự kiến thu cho học sinh không thành công!", {
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
    const time = moment().format();
    const objects = {
      revenue_code: norm.revenue.code,
      revenue_group_id: norm.group.value,
      batch_id: selectPresent.id,
      calculation_unit_id: norm.calculation_unit.value,
      student_code: student.code,
      amount: norm.quantity,
      unit_price: norm.price,
      created_by: user.id,
      start_at: time,
      prescribed_money: norm.price * norm.quantity,
      next_batch_money: norm.price * norm.quantity,
    };

    const token = await getToken({
      template: process.env.NEXT_PUBLIC_TEMPLATE_USER,
    });

    mutation.mutate({ token, objects });
    // } else {
    //   toast.error("Vui lòng nhập khoản thu!", {
    //     position: "top-center",
    //     autoClose: 2000,
    //     hideProgressBar: false,
    //     closeOnClick: true,
    //     theme: "light",
    //   });
    // }
  }, [norm]);

  return (
    <>
      <div className="grid grid-cols-2 gap-4 p-4 auto-rows-auto">
        <h6 className="col-span-2 text-center">Bổ sung khoản đã có</h6>
        <div className="flex flex-col gap-1">
          <p className="text-xs ">Loại khoản thu:</p>
          <Select
            noOptionsMessage={() => "Không tìm thấy kết quả phù hợp!"}
            placeholder="Loại khoản thu"
            options={listRevenue.revenue_types
              .sort((a, b) => a.id - b.id)
              .map((item) => ({
                value: item.id,
                label: item.name,
              }))}
            value={norm.type}
            onChange={(e) => {
              if (norm.type?.value !== e.value)
                setNorm((pre) => ({
                  ...pre,
                  type: e,
                  group: null,
                  revenue: null,
                  calculation_unit: null,
                  price: 100000,
                  quantity: 1,
                  total: 100000,
                }));
            }}
            className="text-black text-sm"
            classNames={{
              control: () => "!rounded-[5px]",
              input: () => "!pr-2.5 !pb-2.5 !pt-4 !m-0",
              valueContainer: () => "!p-[0_8px]",
              menu: () => "!z-[11]",
            }}
          />
        </div>
        {norm.type && (
          <div className="flex flex-col gap-1">
            <p className="text-xs ">Nhóm khoản thu:</p>
            <Select
              noOptionsMessage={() => "Không tìm thấy kết quả phù hợp!"}
              placeholder="Nhóm khoản thu"
              options={listRevenue.revenue_types
                .find((item) => item.id === norm.type.value)
                .revenue_groups.filter((item) =>
                  item.scope.some((el) => el === student.school_level_code)
                )
                .filter((item) => item.id !== 12)
                .filter((item) => item.revenues.length > 0)
                .sort((a, b) => a.id - b.id)
                .map((item) => ({
                  value: item.id,
                  label: item.name,
                }))}
              value={norm.group}
              onChange={(e) => {
                norm.group?.value !== e.value &&
                  setNorm((pre) => ({
                    ...pre,
                    group: e,
                    revenue: null,
                    calculation_unit: null,
                    price: 100000,
                    quantity: 1,
                    total: 100000,
                  }));
              }}
              className="text-black text-sm"
              classNames={{
                control: () => "!rounded-[5px]",
                input: () => "!pr-2.5 !pb-2.5 !pt-4 !m-0",
                valueContainer: () => "!p-[0_8px]",
                menu: () => "!z-[11]",
              }}
            />
          </div>
        )}
        {norm.group && (
          <div className="flex flex-col gap-1">
            <p className="text-xs ">Khoản thu:</p>
            <Select
              noOptionsMessage={() => "Không tìm thấy kết quả phù hợp!"}
              placeholder="Khoản thu"
              options={listRevenue.revenue_types
                .find((item) => item.id === norm.type.value)
                .revenue_groups.find((item) => item.id === norm.group.value)
                .revenues.filter((item) => !existRevenue.includes(item.id))
                .map((item) => {
                  return {
                    ...item,
                    value: item.id,
                    label: item.name,
                  };
                })}
              value={norm.revenue}
              onChange={(e) =>
                norm.revenue?.value !== e.value &&
                setNorm((pre) => ({
                  ...pre,
                  revenue: e,
                  calculation_unit: null,
                  price: 100000,
                  quantity: 1,
                  total: 100000,
                }))
              }
              className="text-black text-sm"
              classNames={{
                control: () => "!rounded-[5px]",
                input: () => "!pr-2.5 !pb-2.5 !pt-4 !m-0",
                valueContainer: () => "!p-[0_8px]",
                menu: () => "!z-[11]",
              }}
            />
          </div>
        )}
        {norm.revenue && (
          <>
            <div className="flex flex-col gap-1">
              <p className="text-xs ">Đơn vị tính:</p>
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
            </div>

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
            <div className={`w-full relative col-span-2`}>
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
      <div className="flex justify-center gap-2">
        {mutating ? (
          <span className="loading loading-spinner loading-sm bg-primary"></span>
        ) : (
          <>
            {norm.group &&
            norm.type &&
            norm.revenue &&
            norm.calculation_unit &&
            norm.price &&
            norm.quantity &&
            norm.total ? (
              <>
                <button className="btn w-fit" onClick={() => handleOnclick()}>
                  Hoàn thành
                </button>
                <div
                  className="tooltip flex items-center justify-center"
                  data-tip="Dự kiến thu trùng lặp sẽ lấy dự kiến thu thêm vào mới nhất!"
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
  );
};

const AddContent2 = ({ student, currentRef }) => {
  const queryClient = useQueryClient();
  const { selectPresent, listRevenue, calculationUnit } =
    useContext(listContext);
  const [norm, setNorm] = useState({
    group: "",
    type: null,
    revenue_code: "",
    revenue: "",
    calculation_unit: null,
    price: 100000,
    quantity: 1,
    total: 100000,
  });
  const [mutating, setMutating] = useState(false);
  const { getToken } = useAuth();
  const { user } = useUser();

  const mutation = useMutation({
    mutationFn: ({ token, objects }) =>
      createExpectedRevenueWithOutRevenue(token, objects),
    onSuccess: () => {
      currentRef.current.close();
      queryClient.invalidateQueries(["get_expected_revenue", student.code]);
      // document.getElementById(`modal_${hit.code}`).close();
      toast.success("Tạo mới dự kiến thu cho học sinh thành công!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        theme: "light",
      });
      setNorm({
        group: "",
        type: null,
        revenue_code: "",
        revenue: "",
        calculation_unit: null,
        price: 100000,
        quantity: 1,
        total: 100000,
      });
      setMutating(false);
    },
    onError: () => {
      currentRef.current.close();
      toast.error("Tạo mới dự kiến thu cho học sinh không thành công!", {
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
    const time = moment().format();
    const objects = {
      code: norm.revenue_code,
      name: norm.revenue,
      revenue_group_id: norm.group.value,
      addExpectedRevenueWithOutRevenue: {
        data: {
          batch_id: selectPresent.id,
          calculation_unit_id: norm.calculation_unit.value,
          student_code: student.code,
          amount: norm.quantity,
          unit_price: norm.price,
          created_by: user.id,
          start_at: time,
          prescribed_money: norm.price * norm.quantity,
          next_batch_money: norm.price * norm.quantity,
        },
      },
    };

    const token = await getToken({
      template: process.env.NEXT_PUBLIC_TEMPLATE_USER,
    });

    mutation.mutate({ token, objects });
    // } else {
    //   toast.error("Vui lòng nhập khoản thu!", {
    //     position: "top-center",
    //     autoClose: 2000,
    //     hideProgressBar: false,
    //     closeOnClick: true,
    //     theme: "light",
    //   });
    // }
  }, [norm]);

  return (
    <>
      <div className="grid grid-cols-2 gap-4 p-4 auto-rows-auto">
        <h6 className="col-span-2 text-center">Bổ sung khoản khác</h6>
        <div className="flex flex-col gap-1">
          <p className="text-xs ">Loại khoản thu:</p>
          <Select
            noOptionsMessage={() => "Không tìm thấy kết quả phù hợp!"}
            placeholder="Loại khoản thu"
            options={listRevenue.revenue_types
              .sort((a, b) => a.id - b.id)
              .map((item) => ({
                value: item.id,
                label: item.name,
              }))}
            value={norm.type}
            onChange={(e) => {
              if (norm.type?.value !== e.value)
                setNorm((pre) => ({
                  ...pre,
                  type: e,
                  group: null,
                  revenue: null,
                  calculation_unit: null,
                  price: 100000,
                  quantity: 1,
                  total: 100000,
                }));
            }}
            className="text-black text-sm"
            classNames={{
              control: () => "!rounded-[5px]",
              input: () => "!pr-2.5 !pb-2.5 !pt-4 !m-0",
              valueContainer: () => "!p-[0_8px]",
              menu: () => "!z-[11]",
            }}
          />
        </div>
        {norm.type && (
          <div className="flex flex-col gap-1">
            <p className="text-xs ">Nhóm khoản thu:</p>
            <Select
              noOptionsMessage={() => "Không tìm thấy kết quả phù hợp!"}
              placeholder="Nhóm khoản thu"
              options={listRevenue.revenue_types
                .find((item) => item.id === norm.type.value)

                .revenue_groups.filter((item) =>
                  item.scope.some((el) => el === student.school_level_code)
                )
                .filter((item) => item.position === 12 || item.position === 18)
                .filter((item) => item.revenues.length > 0)
                .sort((a, b) => a.position - b.position)
                .map((item) => ({
                  value: item.id,
                  label: item.name,
                }))}
              value={norm.group}
              onChange={(e) => {
                norm.group?.value !== e.value &&
                  setNorm((pre) => ({
                    ...pre,
                    group: e,
                    revenue: null,
                    calculation_unit: null,
                    price: 100000,
                    quantity: 1,
                    total: 100000,
                  }));
              }}
              className="text-black text-sm"
              classNames={{
                control: () => "!rounded-[5px]",
                input: () => "!pr-2.5 !pb-2.5 !pt-4 !m-0",
                valueContainer: () => "!p-[0_8px]",
                menu: () => "!z-[11]",
              }}
            />
          </div>
        )}
        {norm.group && (
          <div className={`w-full relative`}>
            <input
              type="text"
              className={`block px-2.5 pb-2.5 pt-4 w-full text-sm text-black bg-transparent rounded-[5px] border-[1px] border-gray-300 appearance-none dark:text-white dark:border-gray-600  focus:outline-none focus:ring-0  peer`}
              input-bordered
              id="revenue_code"
              placeholder="Mã khoản thu"
              value={norm.revenue_code}
              onChange={(e) =>
                setNorm((pre) => ({ ...pre, revenue_code: e.target.value }))
              }
            />
            <label
              htmlFor={`revenue_code`}
              className={`!cursor-not-allowe absolute text-sm text-gray-500  duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white peer-focus:bg-white px-2 peer-focus:px-2 peer-focus:text-[#898989]   peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1`}
            >
              Mã khoản thu
            </label>
          </div>
        )}
        {norm.revenue_code && (
          <div className={`w-full relative`}>
            <input
              type="text"
              className={`block px-2.5 pb-2.5 pt-4 w-full text-sm text-black bg-transparent rounded-[5px] border-[1px] border-gray-300 appearance-none dark:text-white dark:border-gray-600  focus:outline-none focus:ring-0  peer`}
              input-bordered
              id="revenue"
              placeholder="Khoản thu"
              value={norm.revenue}
              onChange={(e) =>
                setNorm((pre) => ({ ...pre, revenue: e.target.value }))
              }
            />
            <label
              htmlFor={`revenue`}
              className={`!cursor-not-allowe absolute text-sm text-gray-500  duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white peer-focus:bg-white px-2 peer-focus:px-2 peer-focus:text-[#898989]   peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1`}
            >
              Khoản thu
            </label>
          </div>
        )}

        {norm.revenue && (
          <>
            <div className="flex flex-col gap-1 col-span-2">
              <p className="text-xs ">Đơn vị tính:</p>
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
            </div>

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
            <div className={`w-full relative col-span-2`}>
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
      <div className="flex justify-center gap-2">
        {mutating ? (
          <span className="loading loading-spinner loading-sm bg-primary"></span>
        ) : (
          <>
            {Object.values(norm).every((item) => item) && (
              <>
                <button className="btn w-fit" onClick={() => handleOnclick()}>
                  Hoàn thành
                </button>
                <div
                  className="tooltip flex items-center justify-center"
                  data-tip="Dự kiến thu trùng lặp sẽ lấy dự kiến thu thêm vào mới nhất!"
                >
                  <IoIosInformationCircleOutline
                    size={20}
                    className="text-red-500"
                  />
                </div>
              </>
            )}
          </>
        )}
      </div>
    </>
  );
};

const Item = ({ data, index, setData, revenue_type, i, group_id }) => {
  return (
    <tr className="hover">
      <td className={`${typeof i === "number" ? "text-right" : ""}`}>
        {typeof i === "number" ? `${index + 1}.${i + 1}` : index + 1}
      </td>
      <td>{data.revenue.name}</td>
      <td>{revenue_type.name}</td>
      <td>{numberWithCommas(data.previous_batch_money)} ₫</td>
      <td>{numberWithCommas(data.actual_amount_collected)} ₫</td>
      {/* <td className="text-center">{data.fullyear ? "✓" : "✗"}</td> */}
      <td>
        <>
          <CurrencyInput
            disabled={data.note?.trim() ? false : true}
            autoComplete="off"
            intlConfig={{ locale: "vi-VN", currency: "VND" }}
            className={`input input-xs`}
            value={data.amount_edited}
            onValueChange={(value) =>
              setData((pre) =>
                pre.map((el) =>
                  el.id === group_id
                    ? {
                        ...el,
                        expected_revenues: el.expected_revenues.map((item) =>
                          item.id === data.id
                            ? { ...item, amount_edited: parseInt(value) }
                            : item
                        ),
                      }
                    : el
                )
              )
            }
            decimalsLimit={2}
          />
        </>
      </td>
      <td>{numberWithCommas(data.amount_collected)} ₫</td>
      <td>
        {numberWithCommas(
          data.previous_batch_money +
            data.actual_amount_collected +
            data.amount_edited -
            data.amount_collected +
            data.amount_spend
        )}{" "}
        ₫
      </td>
      <td>
        <>
          <input
            type="text"
            className="input input-xs"
            value={data.note ? data.note : ""}
            onChange={
              (e) =>
                setData((pre) =>
                  pre.map((el) =>
                    el.id === group_id
                      ? {
                          ...el,
                          expected_revenues: el.expected_revenues.map((item) =>
                            item.id === data.id
                              ? {
                                  ...item,
                                  note: e.target.value ? e.target.value : null,
                                }
                              : item
                          ),
                        }
                      : el
                  )
                )
              // setData((pre) =>
              //   pre.map((el) =>
              //     el.id === data.id
              //       ? { ...el, note: e.target.value ? e.target.value : null }
              //       : el
              //   )
              // )
            }
          />
        </>
      </td>
      <td></td>
    </tr>
  );
};

const ExportNotice = ({ student, selectPresent, data, school_year }) => {
  // console.log(student, selectPresent, data);
  const printRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    // print: async (printIframe) => {
    //   const document = printIframe.contentDocument;
    //   if (document) {
    //     const html = document.getElementsByClassName("App")[0];
    //     const options = {
    //       // margin: 0,
    //       // filename: "the-joys-of-buying-over-building.pdf",
    //       jdPDF: { format: "a5", orientation: "landscape" },
    //     };
    //     const exporter = new Html2Pdf(html, options);
    //     await exporter.getPdf(options);
    //   }
    // },
  });
  // console.log(data);
  const previous_batch_money = data
    ?.filter((item) => item.expected_revenues.length)
    .reduce(
      (total, curr) =>
        total +
        curr.expected_revenues.reduce((t, c) => t + c.previous_batch_money, 0),
      0
    );

  const actual_amount_collected = data
    ?.filter((item) => item.expected_revenues.length)
    .reduce(
      (total, curr) =>
        total +
        curr.expected_revenues.reduce(
          (t, c) => t + c.actual_amount_collected,
          0
        ),
      0
    );

  const amount_collected = data
    ?.filter((item) => item.expected_revenues.length)
    .reduce(
      (total, curr) =>
        total +
        curr.expected_revenues.reduce((t, c) => t + c.amount_collected, 0),
      0
    );

  const next_batch_money = data
    ?.filter((item) => item.expected_revenues.length)
    .reduce(
      (total, curr) =>
        total +
        curr.expected_revenues.reduce((t, c) => t + c.next_batch_money, 0),
      0
    );

  // console.log(data);

  const [firstPart, secondPart] = splitArrayIntoTwo(
    data.sort((a, b) => a.position - b.position)
  );

  // console.log(previous_batch_money);

  return (
    <>
      <button className="btn w-fit" onClick={() => handlePrint()}>
        Xuất giấy báo
      </button>
      {/* PRINT DIV */}
      <div className="hidden">
        <div
          ref={printRef}
          className={`flex flex-col relative justify-center items-center  mb-5 ${times.className} App`}
        >
          <style type="text/css" media="print">
            {"@page {size: landscape; margin: 10px;}"}
          </style>
          <div className="grid grid-cols-3">
            <p className="text-[8px]">
              TRƯỜNG TIỂU HỌC VÀ TRUNG HỌC CƠ SỞ HỮU NGHỊ QUỐC TẾ
            </p>
            <p className="uppercase font-semibold text-[20px] text-center">
              giấy báo đóng tiền
            </p>
          </div>
          <p className="text-[12px] text-center">
            Học kỳ {selectPresent.batch} năm học {school_year}
          </p>
          <div className="grid grid-cols-2 border-l border-r border-t w-full border-black p-1">
            <p className="text-[12px] font-semibold">
              Họ và tên học sinh: {student.first_name} {student.last_name}
            </p>
            <p className="text-[12px] font-semibold">
              Ngày sinh: {student.date_of_birth.split("-").reverse().join("/")}
            </p>
            <p className="text-[12px] font-semibold">
              Mã học sinh: {student.code}
            </p>
            <p className="text-[12px] font-semibold">
              Lớp: {student.class_code}
            </p>
          </div>
          <div className="p-1 w-full border-l border-r border-t border-black">
            <p className="text-[12px] font-semibold">
              I. Công nợ đầu kỳ: {previous_batch_money} đồng
            </p>
          </div>
          <div className="p-1 w-full border-l border-r border-t border-black">
            <p className="text-[12px] font-semibold">
              II. Số phải nộp kỳ này: {actual_amount_collected} đồng, chi tiết
            </p>
          </div>
          <div className="grid grid-cols-2 w-full border-b border-black">
            <div className="flex flex-col border-l border-r border-black">
              {firstPart.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between p-1 border-dotted border-t "
                >
                  <p className="text-[12px]">
                    {item.position}. {item.name}
                  </p>
                  <p className="text-[12px]">
                    {item.expected_revenues.reduce(
                      (total, curr) => total + curr.actual_amount_collected,
                      0
                    )}{" "}
                    đ
                  </p>
                </div>
              ))}
            </div>
            <div className="flex flex-col  border-r border-black">
              {secondPart.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between p-1 border-dotted border-t"
                >
                  <p className="text-[12px]">
                    {item.position}. {item.name}
                  </p>
                  <p className="text-[12px]">
                    {item.expected_revenues.reduce(
                      (total, curr) => total + curr.actual_amount_collected,
                      0
                    )}{" "}
                    đ
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="p-1 w-full border-l border-r border-black">
            <p className="text-[12px] font-semibold">
              III. Số đã nộp trong kỳ: {amount_collected} đồng
            </p>
          </div>
          <div className="p-1 w-full border border-black">
            <p className="text-[12px] font-semibold">
              IV. Công nợ còn phải nộp: {next_batch_money} đồng
            </p>
          </div>
          <div className="grid grid-cols-2 w-full">
            <p className="text-[12px] font-semibold text-center">Người lập</p>
          </div>
        </div>
      </div>
    </>
  );
};

const SubContent = ({ student, selectPresent, permission, school_year }) => {
  const addContent1 = useRef();
  const addContent2 = useRef();
  const { user } = useUser();
  const [mutating, setMutating] = useState(false);
  const [data, setData] = useState();
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  const where = {
    batch_id: {
      _eq: selectPresent.id,
    },
    student_code: {
      _eq: student.code,
    },
    is_deleted: {
      _eq: false,
    },
    end_at: {
      _is_null: true,
    },
  };

  const mutation = useMutation({
    mutationFn: async () => {
      const time = moment().format();
      const updates = getDiffArray(expectedRevenue.data.data.result, data)
        .reduce((total, curr) => [...total, ...curr.expected_revenues], [])
        .map((item) => ({
          _set: {
            note: item.note,
            amount_edited: item.amount_edited,
            updated_by: user.id,
            updated_at: time,
            start_at: time,
          },
          where: { id: { _eq: item.id } },
        }));
      return updateExpectedRevenue(
        await getToken({
          template: process.env.NEXT_PUBLIC_TEMPLATE_USER,
        }),
        updates
      );
    },
    onSuccess: () => {
      setMutating(false);
      queryClient.invalidateQueries({
        queryKey: ["get_expected_revenue", student.code],
      });
      toast.success("Điều chỉnh dự kiến thu thành công!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        theme: "light",
      });
    },
    onError: () => {
      setMutating(false);
      toast.error("Điều chỉnh dự kiến thu không thành công!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        theme: "light",
      });
    },
  });
  const expectedRevenue = useQuery({
    queryKey: ["get_expected_revenue", student.code],
    queryFn: async () =>
      getExpectedRevenue(
        await getToken({
          template: process.env.NEXT_PUBLIC_TEMPLATE_USER,
        }),
        where
      ),
  });

  useLayoutEffect(() => {
    if (expectedRevenue.data) {
      setData(expectedRevenue.data?.data?.result);
    }
  }, [expectedRevenue.data]);

  // console.log(data);

  // if (expectedRevenue.isFetching && expectedRevenue.isLoading) {
  //   return (
  //     <div className="w-full flex flex-col justify-center items-center">
  //       <span className="loading loading-spinner loading-lg"></span>
  //     </div>
  //   );
  // }

  if (expectedRevenue.isError) {
    throw new Error();
  }

  // console.log(
  //   expectedRevenue.data?.data?.result
  //     .filter((item) => item.expected_revenues.length > 0)
  //     .map((item) => item.expected_revenues.map((el) => el.revenue.code))
  //     .reduce((total, curr) => [...total, ...curr], [])
  // );

  return (
    <div className="flex flex-col gap-4">
      {permission === process.env.NEXT_PUBLIC_PERMISSION_READ_EDIT ? (
        expectedRevenue.isFetching && expectedRevenue.isLoading ? (
          <div className="skeleton h-8 w-24"></div>
        ) : (
          <>
            <div className="flex justify-between">
              <div className="dropdown dropdown-hover w-fit">
                <div tabIndex={0} role="button" className="btn w-fit m-1">
                  Bổ sung
                </div>
                <ul
                  tabIndex={0}
                  className="dropdown-content z-[20] menu p-2 shadow bg-base-100 rounded-box w-52"
                >
                  <li
                    onClick={(e) => {
                      e.preventDefault();
                      addContent1.current.showModal();
                    }}
                  >
                    <a>Khoản đã có</a>
                  </li>
                  <li
                    onClick={(e) => {
                      e.preventDefault();
                      addContent2.current.showModal();
                    }}
                  >
                    <a>Khác</a>
                  </li>
                </ul>
              </div>
              {data && (
                <ExportNotice
                  student={student}
                  selectPresent={selectPresent}
                  data={data}
                  school_year={school_year}
                />
              )}
            </div>
            <dialog
              ref={addContent1}
              id={`add_content1_${student.code}`}
              className="modal"
            >
              <div
                className="modal-box !max-h-none !max-w-2xl"
                style={{ overflowY: "unset" }}
              >
                <form method="dialog">
                  {/* if there is a button in form, it will close the modal */}
                  <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                    ✕
                  </button>
                </form>
                <AddContent1
                  student={student}
                  currentRef={addContent1}
                  existRevenue={expectedRevenue.data?.data?.result
                    .filter((item) => item.expected_revenues.length > 0)
                    .map((item) =>
                      item.expected_revenues.map((el) => el.revenue.id)
                    )
                    .reduce((total, curr) => [...total, ...curr], [])}
                />
              </div>
            </dialog>
            <dialog
              ref={addContent2}
              id={`add_content2_${student.code}`}
              className="modal"
            >
              <div
                className="modal-box !max-h-none !max-w-2xl"
                style={{ overflowY: "unset" }}
              >
                <form method="dialog">
                  {/* if there is a button in form, it will close the modal */}
                  <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                    ✕
                  </button>
                </form>
                <AddContent2 student={student} currentRef={addContent2} />
              </div>
            </dialog>
          </>
        )
      ) : (
        <></>
      )}
      {/* <Scrollbars universal autoHeight autoHeightMin={"450px"}> */}
      <div className="overflow-x-auto">
        <table className="table table-xs table-pin-rows">
          {/* head */}
          <thead>
            <tr>
              <th>TT</th>
              <th>Khoản thu</th>
              <th>Loại khoản thu</th>
              <th>Công nợ đầu kỳ</th>
              <th>Số phải nộp kỳ này</th>
              {/* <th>Nộp cả năm</th> */}
              <th>Điều chỉnh</th>
              <th>Số đã nộp trong kỳ</th>
              <th>Công nợ cuối kỳ</th>
              <th>Căn cứ điều chỉnh</th>
              <th>
                <div
                  className="tooltip tooltip-left cursor-pointer"
                  data-tip="Tải lại"
                  onClick={() => {
                    queryClient.invalidateQueries({
                      queryKey: ["get_expected_revenue", student.code],
                    });
                  }}
                >
                  <TbReload size={30} />
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {expectedRevenue.isRefetching ||
            (expectedRevenue.isFetching && expectedRevenue.isLoading) ? (
              <Skeleton />
            ) : data?.length === 0 ? (
              <tr>
                <td colSpan={11} className="text-center">
                  Không có kết quả!
                </td>
              </tr>
            ) : (
              data
                ?.sort((a, b) => {
                  if (a.position === null) return 1;
                  if (b.position === null) return -1;
                  return a.position - b.position;
                })
                .filter((item) =>
                  item.scope.some((el) => el === student.school_level_code)
                )
                .map((item, index) => {
                  if (item.expected_revenues.length === 0) {
                    return (
                      <tr key={item.id} className="hover">
                        <td>{index + 1}</td>
                        <td>{item.name}</td>
                        <td>{item.revenue_type.name}</td>
                        <td className="text-center text-red-300" colSpan={8}>
                          Chưa có dự kiến thu
                        </td>
                      </tr>
                    );
                  }
                  if (item.expected_revenues.length === 1) {
                    return (
                      <Item
                        key={item.id}
                        setData={setData}
                        group_id={item.id}
                        index={index}
                        data={item.expected_revenues[0]}
                        isRefetching={expectedRevenue.isRefetching}
                        student_code={student.code}
                        revenue_type={item.revenue_type}
                      />
                    );
                  }

                  if (item.expected_revenues.length > 1) {
                    return (
                      <>
                        <tr className="hover">
                          <td>{index + 1}</td>
                          <td>{item.name}</td>
                          <td>{item.revenue_type.name}</td>
                          {/* <td className="text-center text-red-300" colSpan={8}>
                          Chưa có dự kiến thu
                        </td> */}
                        </tr>
                        {item.expected_revenues.map((el, i) => {
                          return (
                            <Item
                              group_id={item.id}
                              key={`${item.id}${el.id}${i}`}
                              setData={setData}
                              index={index}
                              i={i}
                              data={el}
                              isRefetching={expectedRevenue.isRefetching}
                              student_code={student.code}
                              revenue_type={item.revenue_type}
                            />
                          );
                        })}
                      </>
                    );
                  }

                  // return (
                  //   <Item
                  //     key={item.id}
                  //     setData={setData}
                  //     index={index}
                  //     data={item}
                  //     isRefetching={expectedRevenue.isRefetching}
                  //     student_code={student.code}
                  //   />
                  // );
                })
            )}
          </tbody>
        </table>
      </div>
      {/* </Scrollbars> */}
      {permission === process.env.NEXT_PUBLIC_PERMISSION_READ_EDIT ? (
        Array.isArray(data) &&
        !(
          JSON.stringify(expectedRevenue.data.data.result) ===
          JSON.stringify(data)
        ) &&
        data.every((item) =>
          item.expected_revenues.every((el) => !isNaN(el.amount_edited))
        ) &&
        (mutating || expectedRevenue.isRefetching ? (
          <span className="loading loading-spinner loading-md self-center"></span>
        ) : (
          <button
            className="btn w-fit self-center"
            onClick={() => {
              setMutating(true);
              mutation.mutate();
            }}
          >
            Điều chỉnh
          </button>
        ))
      ) : (
        <></>
      )}
    </div>
  );
};

export default SubContent;
