"use client";
// import Select from "react-select";
import {
  useContext,
  useState,
  useRef,
  useLayoutEffect,
  Fragment,
  useMemo,
} from "react";
import { listContext } from "../content";
import CurrencyInput from "react-currency-input-field";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  createRefund,
  getExpectedRevenue,
  getHistoryReceipt,
} from "@/utils/funtionApi";
import { useAuth, useUser } from "@clerk/nextjs";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";
import "moment/locale/vi";
import { TbReload } from "react-icons/tb";
// import { getText } from "number-to-text-vietnamese";
import { useReactToPrint } from "react-to-print";

function createCode(lastCount) {
  return `${moment().year().toString().slice(-2)}${(
    "0000" +
    (lastCount + 1)
  ).slice(-4)}`;
}

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

const Skeleton = () => {
  return (
    <>
      {[...Array(4).keys()].map((item) => (
        <tr key={item}>
          {[...Array(13).keys()].map((el) => (
            <td key={el}>
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

const Modal = ({ data, modalRef }) => {
  const ref = useRef();
  const { selectPresent, student } = useContext(listContext);
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  const { user } = useUser();
  const showData = {
    part1: data.filter((item) => item.revenue_type.id === 1),
    part2: data.filter((item) => item.revenue_type.id === 2),
    totalPart1: data
      .filter((item) => item.revenue_type.id === 1)
      .reduce((total, curr) => total + curr.nowMoney, 0),
    totalPart2: data
      .filter((item) => item.revenue_type.id === 2)
      .reduce((total, curr) => total + curr.nowMoney, 0),
    total:
      data
        .filter((item) => item.revenue_type.id === 1)
        .reduce((total, curr) => total + curr.nowMoney, 0) +
      data
        .filter((item) => item.revenue_type.id === 2)
        .reduce((total, curr) => total + curr.nowMoney, 0),
  };

  const [mutating, setMutating] = useState(false);
  const handlePrint = useReactToPrint({
    content: () => ref.current,
  });

  const mutation = useMutation({
    mutationFn: async (objects) =>
      createRefund(
        await getToken({
          template: process.env.NEXT_PUBLIC_TEMPLATE_USER,
        }),
        objects
      ),
    onSuccess: () => {
      setMutating(false);
      modalRef.current.close();
      toast.success("Lập biên lai hoàn trả thành công!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        theme: "light",
      });
      queryClient.invalidateQueries({
        queryKey: ["get_expected_revenue", student.code],
      });

      handlePrint();
    },
    onError: () => {
      setMutating(false);
      modalRef.current.close();
      toast.error("Lập biên lai hoàn trả không thành công!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        theme: "light",
      });
    },
  });

  const handleOnClick = () => {
    setMutating(true);
    const time = moment().format();
    const objects = {
      amount_spend: data.reduce((total, item) => total + item.nowMoney, 0),
      batch_id: selectPresent.id,
      created_by: user.id,
      start_at: time,
      student_code: student.code,
      schoolyear_student_id: student.schoolyear_student_id,
      refund_details: {
        data: data
          .reduce((total, curr) => [...total, ...curr.expected_revenues], [])
          .map((item) => ({
            amount_spend: item.nowMoney,
            batch_id: selectPresent.id,
            created_by: user.id,
            expected_revenue_id: item.id,
            start_at: time,
          })),
      },
    };
    mutation.mutate(objects);
  };

  return (
    <div className="flex flex-col p-2 gap-2">
      <h6 className="col-span-3 text-center">Lập biên lai hoàn trả</h6>
      <>
        <div className="flex flex-col relative justify-center items-center gap-1 mb-5">
          <h5 className="text-center uppercase text-[16px]">
            Bảng kê hoàn trả tiền thừa
          </h5>
          <p className="text-center  text-[14px]">{`(Theo 1 học sinh)`}</p>
          <div className="flex justify-center gap-4 text-[12px]">
            <p>Mã học sinh: {student.code}</p>
            <p>
              Họ và tên học sinh: {`${student.first_name} ${student.last_name}`}
            </p>
            <p>
              Ngày sinh: {student.date_of_birth.split("-").reverse().join("/")}
            </p>
            <p>Lớp: {student.class_name}</p>
          </div>
          <p className="text-[14px]">
            Tại Ngày {moment().date()} tháng {moment().month() + 1} năm{" "}
            {moment().year()}
          </p>
          <div className="grid grid-cols-1 w-full border border-black divide-y divide-black">
            <div className="flex   divide-x border-black divide-black">
              <p className=" font-semibold text-[14px] w-[5%] flex justify-center items-center h-full  ">
                TT
              </p>
              <p className=" font-semibold text-[14px] w-[35%] flex justify-center items-center h-full ">
                Nội dung
              </p>
              <p className=" font-semibold text-[12px] w-[20%] flex justify-center items-center h-full ">
                Loại khoản thu
              </p>
              <p className=" font-semibold text-[14px] w-[20%] flex justify-center items-center  text-center">{`Số tiền hoàn trả (đồng)`}</p>
              <p className=" font-semibold text-[14px] w-[20%] flex justify-center items-center h-full ">
                Ký nhận
              </p>
            </div>
            <div className="grid grid-cols-1 w-full divide-y divide-black divide-dotted">
              {showData.part1.map((item, index) => (
                <div
                  key={item.id}
                  className="flex  divide-x border-black divide-black"
                >
                  <p className=" text-[14px] w-[5%] flex justify-center items-center h-full  ">
                    {++index}
                  </p>
                  <p className=" text-[14px] w-[35%] flex justify-start items-center h-full pl-1">
                    {item.name}
                  </p>
                  <p className=" text-[14px] w-[20%] flex justify-center items-center h-full ">
                    {item.revenue_type.name}
                  </p>
                  <p className=" text-[14px] w-[20%] flex justify-end items-center  text-center pr-1">
                    {numberWithCommas(item.nowMoney)}
                  </p>
                  <p className=" text-[14px] w-[20%] flex justify-center items-center h-full "></p>
                </div>
              ))}
              <div className="flex   divide-x border-black divide-black">
                <p className=" font-semibold  text-[14px] w-[5%] flex justify-center items-center h-full  ">
                  I
                </p>
                <p className=" font-semibold text-[14px] w-[35%] flex justify-start items-center h-full pl-1">
                  Tổng tiền phí, học phí hoàn trả
                </p>
                <p className=" text-[12px] w-[20%] flex justify-center items-center h-full "></p>
                <p className=" text-[14px] w-[20%] flex justify-end items-center  text-center pr-1">
                  {showData.totalPart1
                    ? numberWithCommas(showData.totalPart1)
                    : showData.totalPart1}
                </p>
                <p className=" text-[14px] w-[20%] flex justify-center items-center h-full "></p>
              </div>
              {showData.part2.map((item, index) => (
                <div
                  key={item.id}
                  className="flex   divide-x border-black divide-black"
                >
                  <p className=" text-[14px] w-[5%] flex justify-center items-center h-full  ">
                    {++index}
                  </p>
                  <p className=" text-[14px] w-[35%] flex justify-center items-center h-full pl-1">
                    {item.name}
                  </p>
                  <p className=" text-[14px] w-[20%] flex justify-center items-center h-full ">
                    {item.revenue_type.name}
                  </p>
                  <p className=" text-[14px] w-[20%] flex justify-center items-center  text-center pr-1">
                    {numberWithCommas(item.nowMoney)}
                  </p>
                  <p className=" text-[14px] w-[20%] flex justify-center items-center h-full "></p>
                </div>
              ))}
              <div className="flex   divide-x border-black divide-black">
                <p className=" font-semibold  text-[14px] w-[5%] flex justify-center items-center h-full  ">
                  II
                </p>
                <p className=" font-semibold  text-[14px] w-[35%] flex justify-start items-center h-full pl-1">
                  Tổng tiền thu hộ hoàn trả
                </p>
                <p className=" text-[14px] w-[20%] flex justify-center items-center h-full "></p>
                <p className=" text-[14px] w-[20%] flex justify-end items-center  text-center pr-1">
                  {showData.totalPart2
                    ? numberWithCommas(showData.totalPart2)
                    : showData.totalPart2}
                </p>
                <p className=" font-semibold text-[14px] w-[20%] flex justify-center items-center h-full "></p>
              </div>
              <div className="flex   divide-x divide-black">
                <p className=" font-semibold  text-[14px] w-[5%] flex justify-center items-center h-full  ">
                  III
                </p>
                <p className=" font-semibold text-[14px] w-[35%] flex justify-start items-center h-full pl-1">
                  Tổng tiền hoàn trả (=I+II)
                </p>
                <p className=" text-[14px] w-[20%] flex justify-center items-center h-full "></p>
                <p className=" text-[14px] w-[20%] flex justify-end items-center  text-center pr-1">
                  {showData.total
                    ? numberWithCommas(showData.total)
                    : showData.total}
                </p>
                <p className=" font-semibold text-[14px] w-[20%] flex justify-center items-center h-full "></p>
              </div>
            </div>
          </div>
          {/* <div
            className={`grid ${
              (formality.value === 2 && "grid-cols-3") ||
              (formality.value === 1 && "grid-cols-2")
            } auto-rows-auto w-full hidden`}
          >
            <p className="text-center font-semibold ">Người lập</p>
            {formality.value === 2 && (
              <>
                <p className="text-center font-semibold">Người nộp tiền</p>
                <p className="text-center font-semibold">Người thu tiền</p>
              </>
            )}
            {formality.value === 1 && (
              <>
                <p className="text-center font-semibold">Ngân hàng thu</p>
              </>
            )}
          </div> */}
        </div>

        {/* PRINT DIV */}
        <div className="hidden">
          <div
            ref={ref}
            className="flex flex-col relative justify-center items-center gap-1 mb-5"
          >
            <h5 className="text-center uppercase text-[16px]">
              Bảng kê hoàn trả tiền thừa
            </h5>
            <p className="text-center  text-[14px]">{`(Theo 1 học sinh)`}</p>
            <div className="flex justify-center gap-4 text-[12px]">
              <p>Mã học sinh: {student.code}</p>
              <p>
                Họ và tên học sinh:{" "}
                {`${student.first_name} ${student.last_name}`}
              </p>
              <p>
                Ngày sinh:{" "}
                {student.date_of_birth.split("-").reverse().join("/")}
              </p>
              <p>Lớp: {student.class_name}</p>
            </div>
            <p className="text-[14px]">
              Tại Ngày {moment().date()} tháng {moment().month() + 1} năm{" "}
              {moment().year()}
            </p>
            <div className="grid grid-cols-1 w-full border border-black divide-y divide-black">
              <div className="flex   divide-x border-black divide-black">
                <p className=" font-semibold text-[14px] w-[5%] flex justify-center items-center h-full  ">
                  TT
                </p>
                <p className=" font-semibold text-[14px] w-[35%] flex justify-center items-center h-full ">
                  Nội dung
                </p>
                <p className=" font-semibold text-[12px] w-[20%] flex justify-center items-center h-full ">
                  Loại khoản thu
                </p>
                <p className=" font-semibold text-[14px] w-[20%] flex justify-center items-center  text-center">{`Số tiền hoàn trả (đồng)`}</p>
                <p className=" font-semibold text-[14px] w-[20%] flex justify-center items-center h-full ">
                  Ký nhận
                </p>
              </div>
              <div className="grid grid-cols-1 w-full divide-y divide-black divide-dotted">
                {showData.part1.map((item, index) => (
                  <div
                    key={item.id}
                    className="flex  divide-x border-black divide-black"
                  >
                    <p className=" text-[14px] w-[5%] flex justify-center items-center h-full  ">
                      {++index}
                    </p>
                    <p className=" text-[14px] w-[35%] flex justify-start items-center h-full pl-1">
                      {item.name}
                    </p>
                    <p className=" text-[14px] w-[20%] flex justify-center items-center h-full ">
                      {item.revenue_type.name}
                    </p>
                    <p className=" text-[14px] w-[20%] flex justify-end items-center  text-center pr-1">
                      {numberWithCommas(item.nowMoney)}
                    </p>
                    <p className=" text-[14px] w-[20%] flex justify-center items-center h-full "></p>
                  </div>
                ))}
                <div className="flex   divide-x border-black divide-black">
                  <p className=" font-semibold  text-[14px] w-[5%] flex justify-center items-center h-full  ">
                    I
                  </p>
                  <p className=" font-semibold text-[14px] w-[35%] flex justify-start items-center h-full pl-1">
                    Tổng tiền phí, học phí hoàn trả
                  </p>
                  <p className=" text-[12px] w-[20%] flex justify-center items-center h-full "></p>
                  <p className=" text-[14px] w-[20%] flex justify-end items-center  text-center pr-1">
                    {showData.totalPart1
                      ? numberWithCommas(showData.totalPart1)
                      : showData.totalPart1}
                  </p>
                  <p className=" text-[14px] w-[20%] flex justify-center items-center h-full "></p>
                </div>
                {showData.part2.map((item, index) => (
                  <div
                    key={item.id}
                    className="flex   divide-x border-black divide-black"
                  >
                    <p className=" text-[14px] w-[5%] flex justify-center items-center h-full  ">
                      {++index}
                    </p>
                    <p className=" text-[14px] w-[35%] flex justify-center items-center h-full pl-1">
                      {item.name}
                    </p>
                    <p className=" text-[14px] w-[20%] flex justify-center items-center h-full ">
                      {item.revenue_type.name}
                    </p>
                    <p className=" text-[14px] w-[20%] flex justify-center items-center  text-center pr-1">
                      {numberWithCommas(item.nowMoney)}
                    </p>
                    <p className=" text-[14px] w-[20%] flex justify-center items-center h-full "></p>
                  </div>
                ))}
                <div className="flex   divide-x border-black divide-black">
                  <p className=" font-semibold  text-[14px] w-[5%] flex justify-center items-center h-full  ">
                    II
                  </p>
                  <p className=" font-semibold  text-[14px] w-[35%] flex justify-start items-center h-full pl-1">
                    Tổng tiền thu hộ hoàn trả
                  </p>
                  <p className=" text-[14px] w-[20%] flex justify-center items-center h-full "></p>
                  <p className=" text-[14px] w-[20%] flex justify-end items-center  text-center pr-1">
                    {showData.totalPart2
                      ? numberWithCommas(showData.totalPart2)
                      : showData.totalPart2}
                  </p>
                  <p className=" font-semibold text-[14px] w-[20%] flex justify-center items-center h-full "></p>
                </div>
                <div className="flex   divide-x divide-black">
                  <p className=" font-semibold  text-[14px] w-[5%] flex justify-center items-center h-full  ">
                    III
                  </p>
                  <p className=" font-semibold text-[14px] w-[35%] flex justify-start items-center h-full pl-1">
                    Tổng tiền hoàn trả (=I+II)
                  </p>
                  <p className=" text-[14px] w-[20%] flex justify-center items-center h-full "></p>
                  <p className=" text-[14px] w-[20%] flex justify-end items-center  text-center pr-1">
                    {showData.total
                      ? numberWithCommas(showData.total)
                      : showData.total}
                  </p>
                  <p className=" font-semibold text-[14px] w-[20%] flex justify-center items-center h-full "></p>
                </div>
              </div>
            </div>
            <p className="italic text-right">
              Hải Phòng, ngày {moment().date()} tháng {moment().month() + 1} năm{" "}
              {moment().year()}
            </p>
            <div className="flex justify-center w-full">
              <p className="font-semibold">Thủ trưởng</p>
              <p className="font-semibold">Kế toán trưởng</p>
              <p className="font-semibold">Người lập</p>
            </div>
          </div>
        </div>

        {/* </div> */}
        {mutating ? (
          <span className="loading loading-spinner loading-md self-center"></span>
        ) : (
          <button
            className="btn w-fit self-center"
            onClick={() => handleOnClick()}
          >
            Lưu và in
          </button>
        )}
      </>
    </div>
  );
};

const Item = ({ data, index, setData, revenue_type, i, group_id }) => {
  const { selectPresent, student } = useContext(listContext);
  const { getToken } = useAuth();
  const where = useMemo(
    () => ({
      where: {
        batch_id: { _eq: selectPresent.id },
        student_code: { _eq: student.code },
        receipt_details: { expected_revenue_id: { _eq: data.id } },
      },
      where1: {
        expected_revenue_id: { _eq: data.id },
      },
    }),
    []
  );
  const historyData = useQuery({
    queryFn: async () =>
      getHistoryReceipt(
        await getToken({
          template: process.env.NEXT_PUBLIC_TEMPLATE_USER,
        }),
        where.where,
        where.where1
      ),
    queryKey: ["get_history_receipt", where],
  });

  const amount_collected_ref = useRef();
  return (
    <tr className="hover">
      <td className={`${typeof i === "number" ? "text-right" : ""}`}>
        {typeof i === "number" ? `${index + 1}.${i + 1}` : index + 1}
      </td>
      <td>{data.revenue.name}</td>
      <td>{revenue_type.name}</td>
      <td>{numberWithCommas(data.previous_batch_money)} ₫</td>
      {/* <td>{numberWithCommas(data.discount)} ₫</td> */}
      <td>{numberWithCommas(data.actual_amount_collected)} ₫</td>
      {/* <td className="text-center">{data.fullyear ? "✓" : "✗"}</td> */}
      <td>{numberWithCommas(data.amount_edited)} ₫</td>

      <td>
        <>
          <input
            type="checkbox"
            className="checkbox checkbox-xs"
            checked={data.isChecked}
            onChange={(e) =>
              setData((pre) =>
                pre.map((el) =>
                  el.id === group_id
                    ? {
                        ...el,
                        expected_revenues: el.expected_revenues.map((item) =>
                          item.id === data.id
                            ? {
                                ...item,
                                isChecked: e.target.checked,
                                nowMoney:
                                  e.target.checked === true
                                    ? Math.abs(item.next_batch_money)
                                    : 0,
                              }
                            : item
                        ),
                      }
                    : el
                )
              )
            }
          />
        </>
      </td>
      <td>
        <>
          <CurrencyInput
            autoComplete="off"
            intlConfig={{ locale: "vi-VN", currency: "VND" }}
            className={`input input-xs`}
            value={data.nowMoney}
            onValueChange={(value) =>
              setData((pre) =>
                pre.map((el) =>
                  el.id === group_id
                    ? {
                        ...el,
                        expected_revenues: el.expected_revenues.map((item) =>
                          item.id === data.id
                            ? {
                                ...item,
                                nowMoney: parseInt(value),
                              }
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
      {/* <td>
        <>
          <CurrencyInput
            autoComplete="off"
            intlConfig={{ locale: "vi-VN", currency: "VND" }}
            className={`input input-xs`}
            value={data.nowMoney}
            onValueChange={(value) =>
              setData((pre) =>
                pre.map((el) =>
                  el.id === group_id
                    ? {
                        ...el,
                        expected_revenues: el.expected_revenues.map((item) =>
                          item.id === data.id
                            ? {
                                ...item,
                                nowMoney: parseInt(value),
                              }
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
      </td> */}

      <td>
        {numberWithCommas(
          data.previous_batch_money +
            data.actual_amount_collected +
            data.amount_spend +
            data.amount_edited +
            data.nowMoney -
            data.amount_collected
        )}{" "}
        ₫
      </td>
      <td></td>
    </tr>
  );
};

const SubContent = ({ student, selectPresent }) => {
  const { preReceiptIsRefetch, permission } = useContext(listContext);
  const ref = useRef();
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
    next_batch_money: {
      _lt: 0,
    },
  };

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
      setData(
        expectedRevenue.data?.data?.result.map((item) =>
          item.expected_revenues.length === 0
            ? item
            : {
                ...item,
                expected_revenues: item.expected_revenues.map((el) => ({
                  ...el,
                  isChecked: false,
                  nowMoney: 0,
                })),
              }
        )
      );
    }
  }, [expectedRevenue.data]);

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

  return (
    <div className="flex flex-col gap-4">
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
              <th>Đã điều chỉnh</th>
              {/* <th>Đã hoàn trả</th> */}
              {data ? (
                <th
                  className="cursor-pointer"
                  onClick={() =>
                    setData((pre) =>
                      pre.map((item) =>
                        item.expected_revenues.length === 0
                          ? item
                          : {
                              ...item,
                              expected_revenues: item.expected_revenues.map(
                                (el) => ({
                                  ...el,
                                  isChecked: true,
                                  nowMoney: Math.abs(el.next_batch_money),
                                })
                              ),
                            }
                      )
                    )
                  }
                >
                  <>
                    <div
                      data-tip={"Chọn tất cả"}
                      className="tooltip tooltip-left"
                    >
                      Tích chọn hoàn trả
                    </div>
                  </>
                </th>
              ) : (
                <th>Tích chọn hoàn trả</th>
              )}
              <th>Số tiền hoàn trả</th>
              <th>Số đã nộp trong kỳ</th>
              <th>Công nợ cuối kỳ</th>
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
            ) : data
                ?.filter((item) => item.id !== 12)
                ?.every((item) => item.expected_revenues.length === 0) ? (
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
                .filter((item) => item.expected_revenues.length > 0)
                .filter((item) => item.id !== 12)
                .map((item, index) => {
                  // if (item.expected_revenues.length === 0) {
                  //   return (
                  //     <tr className="hover">
                  //       <td>{index + 1}</td>
                  //       <td>{item.name}</td>
                  //       <td>{item.revenue_type.name}</td>
                  //       <td className="text-center text-red-300" colSpan={10}>
                  //         Chưa có dự kiến thu
                  //       </td>
                  //     </tr>
                  //   );
                  // }
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
                      <Fragment key={item.id}>
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
                              key={el.id}
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
                      </Fragment>
                    );
                  }
                })
            )}
          </tbody>
        </table>
      </div>
      {/* </Scrollbars> */}
      {permission === process.env.NEXT_PUBLIC_PERMISSION_READ_EDIT ? (
        expectedRevenue.isRefetching ? (
          <></>
        ) : preReceiptIsRefetch ? (
          <span className="loading loading-spinner loading-md self-center"></span>
        ) : (
          data
            ?.filter((item) => item.expected_revenues.length > 0)
            .reduce((total, curr) => [...total, ...curr.expected_revenues], [])
            .some((item) => item.isChecked && item.nowMoney) && (
            <>
              <button
                className="btn w-fit self-center"
                onClick={() => ref.current.showModal()}
              >
                Lập biên lai hoàn trả
              </button>
              <dialog ref={ref} className="modal">
                <div
                  className="modal-box !min-h-[500px] !max-h-[500px] overflow-y-auto !max-w-4xl"
                  // style={{ overflowY: "unset" }}
                >
                  <form method="dialog">
                    {/* if there is a button in form, it will close the modal */}
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                      ✕
                    </button>
                  </form>
                  <Modal
                    modalRef={ref}
                    data={data
                      ?.filter(
                        (item) =>
                          item.expected_revenues.length > 0 &&
                          item.expected_revenues.some((el) => el.isChecked)
                      )
                      .map((item) => ({
                        ...item,
                        nowMoney: item.expected_revenues
                          .filter((item) => item.nowMoney)
                          .reduce((total, curr) => total + curr.nowMoney, 0),
                      }))}
                  />
                </div>
              </dialog>
            </>
          )
        )
      ) : (
        <></>
      )}
    </div>
  );
};

export default SubContent;
