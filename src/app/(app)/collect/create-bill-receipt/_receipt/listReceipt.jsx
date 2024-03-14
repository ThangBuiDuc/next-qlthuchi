"use client";
import {
  // meilisearchReceiptGet,
  // updateReceipt,
  meilisearchGetToken,
  createBillReceipt,
  meilisearchReportReceiptOneGet,
} from "@/utils/funtionApi";
import { listContext } from "../content";
// import { useState, useContext, useRef, useMemo } from "react";
import moment from "moment-timezone";
import { getText } from "number-to-text-vietnamese";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { TbReload } from "react-icons/tb";
import { useEffect, useContext, useCallback, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import localFont from "next/font/local";

const times = localFont({ src: "../../../../times.ttf" });
function createCode(lastCount) {
  return `${moment().year().toString().slice(-2)}${(
    "0000" +
    (lastCount + 1)
  ).slice(-4)}`;
}
// import { IoMdPrint } from "react-icons/io";
// import { IoTrashBinOutline } from "react-icons/io5";
// import { useReactToPrint } from "react-to-print";
// import { getText } from "number-to-text-vietnamese";
// import { useMutation } from "@tanstack/react-query";
import { useAuth, useUser } from "@clerk/nextjs";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

const PrintComponent = ({ printRef, billReceipt, preBill }) => {
  return (
    <div className="hidden">
      <div className={`flex flex-col ${times.className}`} ref={printRef}>
        <style type="text/css" media="print">
          {"@page { size: A5 landscape; margin: 10px;}"}
        </style>
        <p className="text-[13px]">
          TRƯỜNG TIỂU HỌC VÀ TRUNG HỌC CƠ SỞ HỮU NGHỊ QUỐC TẾ
        </p>
        <p className="text-[13px]">
          Địa chỉ Số 50, đường Quán Nam, phường Kênh Dương, quận Lê Chân, thành
          phố Hải Phòng
        </p>
        <p className="uppercase font-semibold text-[27px] text-center">
          phiếu thu
        </p>
        <p className=" text-[18px] text-center">
          Ngày {moment().date()} Tháng {moment().month() + 1} Năm{" "}
          {moment().year()}
        </p>
        <p className=" text-[18px] text-end">
          Số: {`PT${createCode(preBill.count_bill[0].bill_receipt)}`}
        </p>
        <p className=" text-[18px]">
          Họ tên người nộp tiền: {billReceipt.payer}
        </p>
        <p className=" text-[18px]">Địa chỉ: {billReceipt.location}</p>
        <p className=" text-[18px]">Lý do nộp: {billReceipt.bill_name}</p>
        <p className=" text-[18px]">
          Số tiền:{" "}
          {billReceipt.nowMoney ? numberWithCommas(billReceipt.nowMoney) : ""}{" "}
          đồng
        </p>
        <p className=" text-[18px]">
          Bằng chữ:{" "}
          {billReceipt.nowMoney
            ? getText(billReceipt.nowMoney).charAt(0).toUpperCase() +
              getText(billReceipt.nowMoney).slice(1) +
              " đồng"
            : ""}{" "}
        </p>
        <p className=" text-[18px]">Kèm theo: {billReceipt.description}</p>
        <p className=" text-[18px] text-end">
          Ngày {moment().date()} Tháng {moment().month() + 1} Năm{" "}
          {moment().year()}
        </p>
        <p className="flex justify-around text-[18px] font-semibold">
          <span>Thủ trưởng</span>
          <span>Kế toán trưởng</span>
          <span>Người nộp tiền</span>
          <span>Người lập phiếu</span>
          <span>Thủ quỹ</span>
        </p>
        <p className=" text-[18px] mt-[120px]">
          {`Đã nhận đủ số tiền (viết bằng chữ): 
        ${
          billReceipt.nowMoney
            ? getText(billReceipt.nowMoney).charAt(0).toUpperCase() +
              getText(billReceipt.nowMoney).slice(1) +
              " đồng"
            : ""
        }`}
        </p>
      </div>
    </div>
  );
};

const SecondPrintComponent = ({ data, secondPrintRef }) => {
  return (
    <div className="hidden">
      <div className={`flex flex-col ${times.className}`} ref={secondPrintRef}>
        <style type="text/css" media="print">
          {"@page { size: A4 landscape; margin: 10px;}"}
        </style>
      </div>
    </div>
  );
};

// function sumDuplicated(arr) {
//   return arr.reduce((acc, curr) => {
//     const objInAcc = acc.find(
//       (o) =>
//         o.expected_revenue.revenue.revenue_group.id ===
//         curr.expected_revenue.revenue.revenue_group.id
//     );
//     if (objInAcc)
//       return [
//         ...acc.map((item) =>
//           item.expected_revenue.revenue.revenue_group.id ===
//           curr.expected_revenue.revenue.revenue_group.id
//             ? {
//                 ...item,
//                 amount_collected: item.amount_collected + curr.amount_collected,
//               }
//             : item
//         ),
//       ];
//     else return [...acc, curr];
//   }, []);
// }

const RowTable = ({ data }) => {
  return (
    <tr className="hover">
      <td>{data.receipt_code}</td>
      <td>{data.code}</td>
      <td>{`${data.student.first_name} ${data.student.last_name}`}</td>
      <td>{numberWithCommas(data.amount_collected)}</td>
      <td>{moment.unix(data.start_at).format("DD/MM/yyyy HH:mm:ss")}</td>
      <td>{data.canceled && "✓"}</td>
      <td></td>
    </tr>
  );
};

const ListReceipt = ({
  billReceipt,
  condition,
  setBillReceipt,
  mutating,
  setMutating,
  selected,
}) => {
  const queryClient = useQueryClient();
  const { selectPresent, preBill, permission } = useContext(listContext);
  const { getToken } = useAuth();
  const { user } = useUser();
  const printRef = useRef();
  const secondPrintRef = useRef();

  const handleSecondPrint = useReactToPrint({
    content: () => secondPrintRef.current,
  });

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    onAfterPrint: () => handleSecondPrint(),
  });

  const { data, isFetching, isLoading, isRefetching } = useQuery({
    queryKey: [`searchReceipt`, condition],
    queryFn: async () =>
      meilisearchReportReceiptOneGet(await meilisearchGetToken(), condition),
  });

  useEffect(() => {
    if (data?.results) {
      setBillReceipt((pre) => ({
        ...pre,
        nowMoney: data.results.reduce(
          (total, curr) => total + curr.amount_collected,
          0
        ),
      }));
    }
  }, [data]);

  const mutation = useMutation({
    mutationFn: async (objects) =>
      createBillReceipt(
        await getToken({
          template: process.env.NEXT_PUBLIC_TEMPLATE_USER,
        }),
        objects
      ),
    onSuccess: () => {
      handlePrint();
      setMutating(false);
      setBillReceipt({
        payer: "",
        location: "",
        bill_name: "",
        description: "",
      });
      queryClient.invalidateQueries(["get_pre_bill"]);
      toast.success("Lập phiếu thu thành công!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        theme: "light",
      });
    },
    onError: () => {
      setMutating(false);
      toast.error("Lập phiếu thu không thành công!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        theme: "light",
      });
    },
  });
  const handleOnClick = useCallback(() => {
    const objects = {
      amount_collected: parseInt(billReceipt.nowMoney),
      batch_id: selectPresent.id,
      code: `PT${createCode(preBill.count_bill[0].bill_receipt)}`,
      created_by: user.id,
      location: billReceipt.location,
      name: billReceipt.bill_name,
      description: billReceipt.description.trim(),
      start_at: moment().format(),
      bill_formality_id: selected.value,
      payer: billReceipt.payer,
      bill_receipt_details: {
        data: data.results.map((item) => ({
          receipt_code: item.receipt_code,
          batch_id: selectPresent.id,
          amount_collected: item.amount_collected,
          created_by: user.id,
          start_at: moment().format(),
        })),
      },
    };
    setMutating(true);
    mutation.mutate(objects);
  }, [billReceipt, data]);

  return isFetching && isLoading ? (
    <span className="loading loading-spinner loading-lg self-center"></span>
  ) : (
    <>
      <div className="overflow-x-auto">
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              {/* <th></th> */}
              <th>Mã biên lai</th>
              <th>Mã học sinh</th>
              <th>Họ và tên học sinh</th>
              <th>Số tiền thu</th>
              <th>Ngày thu</th>
              <th>Đã huỷ</th>
              <th>
                <>
                  <div
                    className="tooltip items-center flex cursor-pointer w-fit tooltip-left"
                    data-tip="Tải lại danh sách tìm kiếm"
                    onClick={() =>
                      queryClient.invalidateQueries([
                        `searchReceipt`,
                        condition,
                      ])
                    }
                  >
                    <TbReload size={30} />
                  </div>
                </>
              </th>
            </tr>
          </thead>
          <tbody>
            {data.results.length === 0 ? (
              <tr>
                <td colSpan={6} className=" text-center">
                  Không tìm thấy kết quả
                </td>
              </tr>
            ) : (
              data.results
                .sort((a, b) => a.start_at - b.start_at)
                .map((item) => (
                  <RowTable
                    key={item.receipt_code}
                    data={item}
                    isRefetching={isRefetching}
                  />
                ))
            )}
          </tbody>
        </table>
      </div>
      {permission === process.env.NEXT_PUBLIC_PERMISSION_READ_EDIT ? (
        billReceipt.payer.trim() &&
        billReceipt.location.trim() &&
        billReceipt.bill_name.trim() &&
        billReceipt.nowMoney &&
        data.results.length ? (
          mutating || isFetching ? (
            <span className="loading loading-spinner loading-sm bg-primary self-center"></span>
          ) : (
            <button
              className="btn w-fit self-center"
              onClick={() => handleOnClick()}
            >
              Hoàn thành
            </button>
          )
        ) : (
          <></>
        )
      ) : (
        <></>
      )}
      {/* <button
        className="btn w-fit self-center"
        onClick={() => handleSecondPrint()}
      >
        Hoàn thành
      </button> */}
      <PrintComponent
        printRef={printRef}
        billReceipt={billReceipt}
        preBill={preBill}
      />
      <SecondPrintComponent
        data={data.results}
        secondPrintRef={secondPrintRef}
      />
    </>
  );
};

export default ListReceipt;
