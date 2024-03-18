"use client";
import Select from "react-select";
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
  createReceipt,
  getExpectedRevenue,
  getHistoryReceipt,
} from "@/utils/funtionApi";
import { useAuth, useUser } from "@clerk/nextjs";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";
import "moment/locale/vi";
import { TbReload } from "react-icons/tb";
// import { Scrollbars } from "react-custom-scrollbars-2";
import { getText } from "number-to-text-vietnamese";
import { useReactToPrint } from "react-to-print";
import localFont from "next/font/local";

const times = localFont({ src: "../../../../times.ttf" });

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
  const { selectPresent, preReceipt, student } = useContext(listContext);
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  const { user } = useUser();

  const [formality, setFormality] = useState({
    label: preReceipt.formality[1].name,
    value: preReceipt.formality[1].id,
  });
  const middleIndex = Math.round(data.length / 2);
  const firstPart = data.slice(0, middleIndex);
  const secondPart = data.slice(middleIndex);

  const [mutating, setMutating] = useState(false);
  const handlePrint = useReactToPrint({
    content: () => ref.current,
  });

  const mutation = useMutation({
    mutationFn: async (objects) =>
      createReceipt(
        await getToken({
          template: process.env.NEXT_PUBLIC_TEMPLATE_USER,
        }),
        objects
      ),
    onSuccess: () => {
      setMutating(false);
      modalRef.current.close();
      toast.success("Lập biên lai thu thành công!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        theme: "light",
      });
      queryClient.invalidateQueries({ queryKey: ["get_pre_receipt"] });
      queryClient.invalidateQueries({
        queryKey: ["get_expected_revenue", student.code],
      });
      data
        .reduce((total, curr) => [...total, ...curr.expected_revenues], [])
        .forEach((element) => {
          queryClient.invalidateQueries({
            queryKey: [
              "get_history_receipt",
              {
                where: {
                  batch_id: { _eq: selectPresent.id },
                  student_code: { _eq: student.code },
                  receipt_details: { expected_revenue_id: { _eq: element.id } },
                },
                where1: {
                  expected_revenue_id: { _eq: element.id },
                },
              },
            ],
          });
        });

      handlePrint();
    },
    onError: () => {
      setMutating(false);
      modalRef.current.close();
      toast.error("Lập biên lai thu không thành công!", {
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
      amount_collected: data.reduce((total, item) => total + item.nowMoney, 0),
      batch_id: selectPresent.id,
      code:
        (formality.value === 2 &&
          `BM${createCode(
            preReceipt.count_receipt.find((item) => item.id === formality.value)
              .count
          )}`) ||
        (formality.value === 1 &&
          `BK${createCode(
            preReceipt.count_receipt.find((item) => item.id === formality.value)
              .count
          )}`),
      created_by: user.id,
      formality_id: formality.value,
      start_at: time,
      student_code: student.code,
      schoolyear_student_id: student.schoolyear_student_id,
      receipt_details: {
        data: data
          .reduce((total, curr) => [...total, ...curr.expected_revenues], [])
          .map((item) => ({
            amount_collected: item.nowMoney,
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
      <h6 className="col-span-3 text-center">Lập biên lai thu</h6>
      <Select
        noOptionsMessage={() => "Không tìm thấy kết quả phù hợp!"}
        placeholder="Hình thức thu tiền"
        options={preReceipt.formality.map((item) => ({
          label: item.name,
          value: item.id,
        }))}
        value={formality}
        onChange={(e) => {
          if (formality.value !== e.value) setFormality(e);
        }}
        className="text-black text-sm"
        classNames={{
          control: () => "!rounded-[5px]",
          input: () => "!pr-2.5 !pb-2.5 !pt-4 !m-0",
          valueContainer: () => "!p-[0_8px]",
          menu: () => "!z-[11]",
        }}
      />
      <>
        {/* <div className="border border-black p-1"> */}
        <div className="flex flex-col relative justify-center items-center gap-1 mb-5">
          <h5 className="text-center text-[16px]">
            {(formality.value === 2 && "BIÊN LAI THU TIỀN MẶT") ||
              (formality.value === 1 && "BIÊN LAI THU CHUYỂN KHOẢN")}
          </h5>
          <div
            className={`flex ${
              formality.value === 1 ? "justify-between" : "justify-center"
            } gap-4 w-full`}
          >
            <p className=" text-[14px]">
              Số BL:{" "}
              {`${
                (formality.value === 2 && "BM") ||
                (formality.value === 1 && "BK")
              }${createCode(
                preReceipt.count_receipt.find(
                  (item) => item.id === formality.value
                ).count
              )}`}
            </p>
            {formality.value === 1 && (
              <p className=" text-[14px]">
                Ngân hàng thu: {preReceipt.schools[0].bank_name}
              </p>
            )}
          </div>
          <p className=" text-[12px]">
            Ngày {moment().date()} tháng {moment().month() + 1} năm{" "}
            {moment().year()}
          </p>
          <div className="grid grid-cols-2 auto-rows-auto border border-black w-full divide-y divide-black">
            <div className="flex divide-x divide-black col-span-2">
              <div className="pl-1   w-[50%]">
                <p className="font-semibold text-[14px]">
                  Họ và tên học sinh:{" "}
                  {`${student.first_name} ${student.last_name}`}
                </p>
                <p className="font-semibold text-[14px]">
                  Mã học sinh: {student.code}
                </p>
              </div>
              <div className="pl-1   w-[50%]">
                <p className="font-semibold text-[14px]">
                  Ngày sinh:{" "}
                  {student.date_of_birth.split("-").reverse().join("/")}
                </p>

                <p className="font-semibold text-[14px]">
                  Lớp: {student.class_name}
                </p>
              </div>
            </div>
            <div className="col-span-2 grid grid-cols-2 auto-rows-auto divide-x divide-black">
              <div className="flex flex-col divide-y divide-black">
                {firstPart.map((item, index) => (
                  <p
                    key={item.name}
                    className="pl-1 pr-1 flex justify-between text-[14px]"
                  >
                    {index + 1}. {item.name}:{" "}
                    <span>{numberWithCommas(item.nowMoney)} ₫</span>
                  </p>
                ))}
              </div>
              <div className="flex flex-col divide-y divide-black">
                {secondPart.map((item, index) => (
                  <p
                    key={item.name}
                    className="pl-1 pr-1 flex justify-between  text-[14px]"
                  >
                    {middleIndex + index + 1}. {item.name}:{" "}
                    <span>{numberWithCommas(item.nowMoney)} ₫</span>
                  </p>
                ))}
              </div>
            </div>
            <div className="flex flex-col col-span-2 p-2 gap-2">
              <p className=" flex justify-end gap-1 font-semibold  text-[14px]">
                Tổng các khoản thu ={" "}
                {numberWithCommas(
                  data.reduce((total, item) => total + item.nowMoney, 0)
                )}{" "}
                <span>₫</span>
              </p>
              <p className="text-center font-semibold  text-[14px]">
                Bằng chữ:{" "}
                <span className="italic first-letter:uppercase">
                  {getText(
                    data.reduce((total, item) => total + item.nowMoney, 0)
                  )
                    .charAt(0)
                    .toUpperCase() +
                    getText(
                      data.reduce((total, item) => total + item.nowMoney, 0)
                    ).slice(1)}{" "}
                  đồng
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* PRINT DIV */}
        <div className="hidden">
          <div
            ref={ref}
            className={`flex flex-col relative justify-center items-center gap-1 mb-5 ${times.className}`}
          >
            <h5 className="text-center text-[16px]">
              {(formality.value === 2 && "BIÊN LAI THU TIỀN MẶT") ||
                (formality.value === 1 && "BIÊN LAI THU CHUYỂN KHOẢN")}
            </h5>
            <div
              className={`flex ${
                formality.value === 1 ? "justify-between" : "justify-center"
              } gap-4 w-full`}
            >
              <p className=" text-[14px]">
                Số BL:{" "}
                {`${
                  (formality.value === 2 && "BM") ||
                  (formality.value === 1 && "BK")
                }${createCode(
                  preReceipt.count_receipt.find(
                    (item) => item.id === formality.value
                  ).count
                )}`}
              </p>
              {formality.value === 1 && (
                <p className=" text-[14px]">
                  Ngân hàng thu: {preReceipt.schools[0].bank_name}
                </p>
              )}
            </div>
            <p className=" text-[12px]">
              Ngày {moment().date()} tháng {moment().month() + 1} năm{" "}
              {moment().year()}
            </p>
            <div className="grid grid-cols-2 auto-rows-auto border border-black w-full divide-y divide-black">
              <div className="flex divide-x divide-black col-span-2">
                <div className="pl-1   w-[50%]">
                  <p className="font-semibold text-[14px]">
                    Họ và tên học sinh:{" "}
                    {`${student.first_name} ${student.last_name}`}
                  </p>
                  <p className="font-semibold text-[14px]">
                    Mã học sinh: {student.code}
                  </p>
                </div>
                <div className="pl-1   w-[50%]">
                  <p className="font-semibold text-[14px]">
                    Ngày sinh:{" "}
                    {student.date_of_birth.split("-").reverse().join("/")}
                  </p>

                  <p className="font-semibold text-[14px]">
                    Lớp: {student.class_name}
                  </p>
                </div>
              </div>
              <div className="col-span-2 grid grid-cols-2 auto-rows-auto divide-x divide-black">
                <div className="flex flex-col divide-y divide-black">
                  {firstPart.map((item, index) => (
                    <p
                      key={item.name}
                      className="pl-1 pr-1 flex justify-between text-[14px]"
                    >
                      {index + 1}. {item.name}:{" "}
                      <span>{numberWithCommas(item.nowMoney)} ₫</span>
                    </p>
                  ))}
                </div>
                <div className="flex flex-col divide-y divide-black">
                  {secondPart.map((item, index) => (
                    <p
                      key={item.name}
                      className="pl-1 pr-1 flex justify-between  text-[14px]"
                    >
                      {middleIndex + index + 1}. {item.name}:{" "}
                      <span>{numberWithCommas(item.nowMoney)} ₫</span>
                    </p>
                  ))}
                </div>
              </div>
              <div className="flex flex-col col-span-2 p-2 gap-2">
                <p className=" flex justify-end gap-1 font-semibold  text-[14px]">
                  Tổng các khoản thu ={" "}
                  {numberWithCommas(
                    data.reduce((total, item) => total + item.nowMoney, 0)
                  )}{" "}
                  <span>₫</span>
                </p>
                <p className="text-center font-semibold  text-[14px]">
                  Bằng chữ:{" "}
                  <span className="italic first-letter:uppercase">
                    {getText(
                      data.reduce((total, item) => total + item.nowMoney, 0)
                    )
                      .charAt(0)
                      .toUpperCase() +
                      getText(
                        data.reduce((total, item) => total + item.nowMoney, 0)
                      ).slice(1)}{" "}
                    đồng
                  </span>
                </p>
              </div>
            </div>
            <div
              className={`grid ${
                (formality.value === 2 && "grid-cols-3") ||
                (formality.value === 1 && "grid-cols-2")
              } auto-rows-auto w-full`}
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
      <td>{numberWithCommas(data.discount)} ₫</td>
      <td>{numberWithCommas(data.actual_amount_collected)} ₫</td>
      {/* <td className="text-center">{data.fullyear ? "✓" : "✗"}</td> */}
      <td>{numberWithCommas(data.amount_edited)} ₫</td>
      <td>{numberWithCommas(data.amount_spend)} ₫</td>
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
                                    ? item.next_batch_money
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
            value={Math.abs(data.nowMoney)}
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
      <td onClick={() => amount_collected_ref.current.showModal()}>
        <>
          <div className="tooltip tooltip-left" data-tip="Xem lịch sử">
            {numberWithCommas(data.amount_collected)} ₫
            <dialog ref={amount_collected_ref} className="modal">
              <div className="modal-box !max-w-2xl">
                <form method="dialog">
                  {/* if there is a button in form, it will close the modal */}
                  <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                    ✕
                  </button>
                </form>
                <div className="flex flex-col gap-4">
                  <h6>
                    Danh sách biên lai đã nộp tương ứng khoản thu:{" "}
                    {data.revenue.name}
                  </h6>
                  <div className="overflow-x-auto">
                    <table className="table">
                      {/* head */}
                      <thead>
                        <tr>
                          <th>TT</th>
                          <th>Mã biên lai</th>
                          <th>Số tiền đã nộp</th>
                          <th>Ngày nộp</th>
                          <th>Hình thức</th>
                          <th>Người lập</th>
                          <th>Đã huỷ</th>
                        </tr>
                      </thead>
                      <tbody>
                        {historyData.isFetching && historyData.isLoading ? (
                          [...Array(4).keys()].map((item) => (
                            <tr key={item}>
                              {[...Array(6).keys()].map((el) => (
                                <td key={el}>
                                  <>
                                    <div className="skeleton h-4 w-full"></div>
                                  </>
                                </td>
                              ))}
                            </tr>
                          ))
                        ) : historyData.data.data.result.length === 0 ? (
                          <tr colSpan={6}>Chưa có dữ liệu</tr>
                        ) : (
                          historyData.data.data.result.map((item, index) => (
                            <tr key={item.code} className="hover">
                              <td>{index + 1}</td>
                              <td>{item.code}</td>
                              <td>
                                {numberWithCommas(
                                  item.receipt_details[0].amount_collected
                                )}{" "}
                                ₫
                              </td>
                              <td>
                                {moment(item.start_at).format(
                                  "DD/MM/yyyy HH:mm:ss"
                                )}
                              </td>
                              <td>{item.formality.name}</td>
                              <td>{`${item.user.first_name} ${item.user.last_name}`}</td>
                              <td>{item.canceled && "✓"}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </dialog>
          </div>
        </>
      </td>
      <td>
        {numberWithCommas(
          data.previous_batch_money +
            data.actual_amount_collected +
            data.amount_edited -
            data.amount_collected -
            data.nowMoney
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
      _gt: 0,
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
              <th>Ưu đãi, miễn giảm</th>
              <th>Số phải nộp kỳ này</th>
              {/* <th>Nộp cả năm</th> */}
              <th>Đã điều chỉnh</th>
              <th>Đã hoàn trả</th>
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
                                (el) =>
                                  el.isChecked
                                    ? { ...el, isChecked: false, nowMoney: 0 }
                                    : {
                                        ...el,
                                        isChecked: true,
                                        nowMoney:
                                          el.previous_batch_money +
                                          el.actual_amount_collected +
                                          el.amount_edited -
                                          el.amount_collected -
                                          el.nowMoney,
                                      }
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
                      Tích chọn nộp
                    </div>
                  </>
                </th>
              ) : (
                <th>Tích chọn nộp</th>
              )}
              <th>Số tiền nộp lần này</th>
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
            ) : data?.every((item) => item.expected_revenues.length === 0) ? (
              <tr>
                <td colSpan={12} className="text-center">
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
                Lập biên lai
              </button>
              <dialog ref={ref} className="modal">
                <div
                  className="modal-box h-fit !max-h-[500px] overflow-y-auto !max-w-4xl"
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
