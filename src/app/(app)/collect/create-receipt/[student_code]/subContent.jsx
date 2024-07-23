"use client";
import Select from "react-select";
import {
  useContext,
  useState,
  useRef,
  useLayoutEffect,
  Fragment,
  useMemo,
  useEffect,
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
import { BiSolidCategory } from "react-icons/bi";
// import { Scrollbars } from "react-custom-scrollbars-2";
import { getText } from "number-to-text-vietnamese";
import { useReactToPrint } from "react-to-print";
import localFont from "next/font/local";
import { set } from "lodash";

export const priority = [
  { index: 1, code: "VATT12", name: "Vé ăn tháng 12" },
  { index: 2, code: "VATT11", name: "Vé ăn tháng 11" },
  { index: 3, code: "VATT10", name: "Vé ăn tháng 10" },
  { index: 4, code: "VATT9", name: "Vé ăn tháng 9" },
  { index: 5, code: "VATT8", name: "Vé ăn tháng 8" },
  { index: 6, code: "VATT7", name: "Vé ăn tháng 7" },
  { index: 7, code: "VATT6", name: "Vé ăn tháng 6" },
  { index: 8, code: "VATT5", name: "Vé ăn tháng 5" },
  { index: 9, code: "VATT4", name: "Vé ăn tháng 4" },
  { index: 10, code: "VATT3", name: "Vé ăn tháng 3" },
  { index: 11, code: "VATT2", name: "Vé ăn tháng 2" },
  { index: 12, code: "VATT1", name: "Vé ăn tháng 1" },
  { index: 13, code: "TN", name: "Học phí ôn thi tốt nghiệp" },
  { index: 14, code: "THK", name: "Phí thu hộ khác" },
  { index: 15, code: "XD", name: "Vé gửi xe đạp" },
  { index: 16, code: "S/VG", name: "Sách, vở ghi" },
  { index: 17, code: "DP", name: "Đồng phục" },
  { index: 18, code: "KSK/HS", name: "Phí khám sức khoẻ, làm thẻ học sinh" },
  { index: 19, code: "HTTN", name: "Phí hoạt động học tập trải nghiệm, THTT" },
  { index: 20, code: "QLHSNG", name: "Phí quản lý học sinh ngoài giờ" },
  { index: 21, code: "DDHS", name: "Phí đưa đón học sinh" },
  { index: 22, code: "TL", name: "Phí thi lại" },
  { index: 23, code: "CSVC", name: "Cơ sở vật chất" },
  { index: 24, code: "NN", name: "Phí ngoại ngữ" },
  { index: 25, code: "VN", name: "Phí văn nghệ" },
  { index: 26, code: "BHYT", name: "Bảo hiểm y tế" },
  { index: 27, code: "HLHP", name: "Phí học liệu, học phẩm" },
  { index: 28, code: "DTDV", name: "Phí dự tuyển đầu vào" },
  { index: 29, code: "BT", name: "Phí bán trú" },
  { index: 30, code: "HP", name: "Học phí" },
];

function mergeSort(arr, priority) {
  if (arr.length <= 1) {
    return arr;
  }

  const middle = Math.floor(arr.length / 2);
  const left = arr.slice(0, middle);
  const right = arr.slice(middle);

  return merge(mergeSort(left, priority), mergeSort(right, priority), priority);
}

function merge(left, right, priority) {
  let result = [];
  let leftIndex = 0;
  let rightIndex = 0;

  while (leftIndex < left.length && rightIndex < right.length) {
    const priorityA =
      priority.find((p) => p.code === left[leftIndex].code)?.index || Infinity;
    const priorityB =
      priority.find((p) => p.code === right[rightIndex].code)?.index ||
      Infinity;

    if (priorityA < priorityB) {
      result.push(left[leftIndex]);
      leftIndex++;
    } else {
      result.push(right[rightIndex]);
      rightIndex++;
    }
  }

  return result.concat(left.slice(leftIndex)).concat(right.slice(rightIndex));
}

const times = localFont({ src: "../../../../times.ttf" });

function createCode(lastCount) {
  return `${moment().year().toString().slice(-2)}${(
    "0000" +
    (lastCount + 1)
  ).slice(-4)}`;
}

function numberWithCommas(x, config) {
  return x
    .toString()
    .replace(
      /\B(?=(\d{3})+(?!\d))/g,
      config.result[0].config.numberComma.value
    );
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
  const { selectPresent, preReceipt, student, config, receipt } =
    useContext(listContext);
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  const { user } = useUser();

  const [formality, setFormality] = useState({
    label: preReceipt.formality[1].name,
    value: preReceipt.formality[1].id,
  });

  console.log(receipt);
  // const middleIndex = Math.round(data.length / 2);
  // const firstPart = data.slice(0, middleIndex);
  // const secondPart = data.slice(middleIndex);

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
            receipt.count_receipt.find(
              (item) => item.formality_id === formality.value
            ).count
          )}`) ||
        (formality.value === 1 &&
          `BK${createCode(
            receipt.count_receipt.find(
              (item) => item.formality_id === formality.value
            ).count
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
                receipt.count_receipt.find(
                  (item) => item.formality_id === formality.value
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
              <div className="pl-1 w-[50%]">
                <p className="font-semibold text-[14px]">
                  Ngày sinh:{" "}
                  {student.date_of_birth.split("-").reverse().join("/")}
                </p>

                <p className="font-semibold text-[14px]">
                  Lớp: {student.class_name}
                </p>
              </div>
            </div>
            <div className="col-span-2">
              {data.map((item, index) => (
                <p
                  key={item.name}
                  className="pl-1 pr-1 flex justify-between text-[14px]"
                >
                  {index + 1}. {item.name}:{" "}
                  <span>{numberWithCommas(item.nowMoney, config)} ₫</span>
                </p>
              ))}
            </div>
            {/* <div className="col-span-2 grid grid-cols-2 auto-rows-auto divide-x divide-black">
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
            </div> */}
            <div className="flex flex-col col-span-2 p-2 gap-2">
              <p className=" flex justify-end gap-1 font-semibold  text-[14px]">
                Tổng các khoản thu ={" "}
                {numberWithCommas(
                  data.reduce((total, item) => total + item.nowMoney, 0),
                  config
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
            <style type="text/css" media="print">
              {"@page {size: A4; margin: 10px;}"}
            </style>
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
                  receipt.count_receipt.find(
                    (item) => item.formality_id === formality.value
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
              <div className="col-span-2">
                {data.map((item, index) => (
                  <p
                    key={item.name}
                    className="pl-1 pr-1 flex justify-between text-[14px]"
                  >
                    {index + 1}. {item.name}:{" "}
                    <span>{numberWithCommas(item.nowMoney, config)} ₫</span>
                  </p>
                ))}
              </div>
              {/* <div className="col-span-2 grid grid-cols-2 auto-rows-auto divide-x divide-black">
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
              </div> */}
              <div className="flex flex-col col-span-2 p-2 gap-2">
                <p className=" flex justify-end gap-1 font-semibold  text-[14px]">
                  Tổng các khoản thu ={" "}
                  {numberWithCommas(
                    data.reduce((total, item) => total + item.nowMoney, 0),
                    config
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
  const { selectPresent, student, config } = useContext(listContext);
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

  // console.log(data)
  // console.log(priority)

  const amount_collected_ref = useRef();
  return (
    <tr className="hover">
      <td className={`${typeof i === "number" ? "text-right" : ""}`}>
        {typeof i === "number" ? `${index + 1}.${i + 1}` : index + 1}
      </td>
      <td>{data.revenue.name}</td>
      <td>{revenue_type.name}</td>
      <td>{numberWithCommas(data.previous_batch_money, config)} ₫</td>
      <td>{numberWithCommas(data.discount, config)} ₫</td>
      <td>{numberWithCommas(data.actual_amount_collected, config)} ₫</td>
      {/* <td className="text-center">{data.fullyear ? "✓" : "✗"}</td> */}
      <td>{numberWithCommas(data.amount_edited, config)} ₫</td>
      <td>{numberWithCommas(data.amount_spend, config)} ₫</td>
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
            groupSeparator={config.result[0].config.numberComma.value}
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
            {numberWithCommas(data.amount_collected, config)} ₫
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
                          <tr>
                            <td colSpan={6}>Chưa có dữ liệu</td>
                          </tr>
                        ) : (
                          historyData.data.data.result.map((item, index) => (
                            <tr key={item.code} className="hover">
                              <td>{index + 1}</td>
                              <td>{item.code}</td>
                              <td>
                                {numberWithCommas(
                                  item.receipt_details[0].amount_collected,
                                  config
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
            data.nowMoney,
          config
        )}{" "}
        ₫
      </td>
      <td></td>
    </tr>
  );
};

const SubContent = ({ student, selectPresent }) => {
  const [totalValue, setTotalValue] = useState(0);
  // console.log(totalValue)
  const [isCheckedAll, setIsCheckedAll] = useState(false);

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

  // console.log(data);

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

  const selectAll = () => {
    setIsCheckedAll(!isCheckedAll);
    setData((pre) =>
      pre.map((item) =>
        item.expected_revenues.length === 0
          ? item
          : {
              ...item,
              expected_revenues: item.expected_revenues.map((el) => ({
                ...el,
                isChecked: !isCheckedAll,
              })),
            }
      )
    );
  };

  useEffect(() => {
    if (expectedRevenue.data && data) {
      const allChecked = data.every((item) =>
        item.expected_revenues.length === 0
          ? true
          : item.expected_revenues.every((revenue) => revenue.isChecked)
      );
      setIsCheckedAll(allChecked);
    }
  }, [data]);

  // if (expectedRevenue.isFetching && expectedRevenue.isLoading) {
  //   return (
  //     <div className="w-full flex flex-col justify-center items-center">
  //       <span className="loading loading-spinner loading-lg"></span>
  //     </div>
  //   );
  // }

  const allocateFunds = () => {
    if (!totalValue || totalValue <= 0) return;

    // Tạo bản sao của dữ liệu để cập nhật
    const updatedData = data.map((item) => ({
      ...item,
      expected_revenues: item.expected_revenues.map((revenue) => ({
        ...revenue,
        nowMoney: 0, // Đặt nowMoney về 0 cho mỗi revenue
      })),
    }));

    // Lấy tất cả các mục được chọn và sắp xếp theo thứ tự ưu tiên từ index nhỏ đến lớn
    const checkedItems = mergeSort(
      updatedData
        .flatMap((item) => item.expected_revenues)
        .filter((revenue) => revenue.isChecked),
      priority
    );

    let remainingAmount = totalValue;

    // Phân bổ số tiền dựa trên số tiền còn lại và các mục đã chọn
    for (let i = 0; i < checkedItems.length; i++) {
      const revenue = checkedItems[i];
      const allocatedAmount = Math.min(
        revenue.next_batch_money,
        remainingAmount
      );
      revenue.nowMoney = allocatedAmount;
      remainingAmount -= allocatedAmount;
      if (remainingAmount <= 0) break;
    }

    // Nếu còn thừa tiền sau khi đã phân bổ hết, gộp vào mục cuối cùng
    if (remainingAmount > 0) {
      const lastItem = checkedItems[checkedItems.length - 1];
      lastItem.nowMoney += remainingAmount;
    }

    // Cập nhật lại dữ liệu với số tiền đã phân bổ
    setData(updatedData);

    // Console.log các phần tử đã sắp xếp và phân bổ
    console.log("Sorted and allocated items:", checkedItems);
  };

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
              {data ? <th>Tích chọn nộp</th> : <th>Tích chọn nộp</th>}
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
            <tr>
              <th colSpan={7}></th>
              <th></th>
              <th>
                <>
                  <input
                    type="checkbox"
                    className="checkbox checkbox-xs"
                    checked={isCheckedAll}
                    onChange={() => selectAll()}
                  />
                </>
              </th>
              <th>
                <CurrencyInput
                  autoComplete="off"
                  intlConfig={{ locale: "vi-VN", currency: "VND" }}
                  className={`input input-xs`}
                  value={totalValue}
                  onValueChange={(value) => setTotalValue(value)}
                  decimalsLimit={2}
                />
              </th>
              <th colSpan={3}>
                <button
                  onClick={allocateFunds}
                  className="cursor-pointer bg-white relative inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-[#F5F5F5] hover:text-[#06B6D4] h-9 px-3 "
                >
                  <BiSolidCategory /> Phân bổ
                </button>
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
