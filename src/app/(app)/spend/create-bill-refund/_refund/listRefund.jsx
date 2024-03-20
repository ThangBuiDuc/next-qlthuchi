"use client";
import {
  // meilisearchRefundGet,
  // updateReceipt,
  meilisearchGetToken,
  createBillRefund,
  meilisearchReportRefundOneGet,
} from "@/utils/funtionApi";
import { listContext } from "../content";
// import { useState, useContext, useRef, useMemo } from "react";
import moment from "moment";
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

const PrintComponent = ({ printRef, billRefund, preBill }) => {
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
          phiếu chi
        </p>
        <p className=" text-[18px] text-center">
          Ngày {moment().date()} Tháng {moment().month() + 1} Năm{" "}
          {moment().year()}
        </p>
        <p className=" text-[18px] text-end">
          Số: {`PT${createCode(preBill.count_bill[0].bill_refund)}`}
        </p>
        <p className=" text-[18px]">
          Họ tên người nộp tiền: {billRefund.receiver}
        </p>
        <p className=" text-[18px]">Địa chỉ: {billRefund.location}</p>
        <p className=" text-[18px]">Lý do chi: {billRefund.bill_name}</p>
        <p className=" text-[18px]">
          Số tiền:{" "}
          {billRefund.nowMoney ? numberWithCommas(billRefund.nowMoney) : ""}{" "}
          đồng
        </p>
        <p className=" text-[18px]">
          Bằng chữ:{" "}
          {billRefund.nowMoney
            ? getText(billRefund.nowMoney).charAt(0).toUpperCase() +
              getText(billRefund.nowMoney).slice(1) +
              " đồng"
            : ""}{" "}
        </p>
        <p className=" text-[18px]">Kèm theo: {billRefund.description}</p>
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
          billRefund.nowMoney
            ? getText(billRefund.nowMoney).charAt(0).toUpperCase() +
              getText(billRefund.nowMoney).slice(1) +
              " đồng"
            : ""
        }`}
        </p>
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
//                 amount_spend: item.amount_spend + curr.amount_spend,
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
      <td>{data.id}</td>
      <td>{data.student.code}</td>
      <td>{`${data.student.first_name} ${data.student.last_name}`}</td>
      <td>
        {numberWithCommas(
          data.refund_details.reduce(
            (total, curr) => total + curr.amount_spend,
            0
          )
        )}
      </td>
      <td>{moment(data.start_at).format("DD/MM/yyyy HH:mm:ss")}</td>
      <td>{data.canceled && "✓"}</td>
      <td></td>
    </tr>
  );
};

const ListRefund = ({
  billRefund,
  condition,
  setBillRefund,
  mutating,
  setMutating,
  selected,
}) => {
  const queryClient = useQueryClient();
  const { selectPresent, preBill, permission } = useContext(listContext);
  const { getToken } = useAuth();
  const { user } = useUser();
  const printRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    // onAfterPrint: () => handleSecondPrint(),
  });

  const { data, isFetching, isLoading, isRefetching } = useQuery({
    queryKey: [`searchRefund`, condition],
    queryFn: async () =>
      meilisearchReportRefundOneGet(await meilisearchGetToken(), condition),
  });

  useEffect(() => {
    if (data?.results) {
      setBillRefund((pre) => ({
        ...pre,
        nowMoney: data.results.reduce(
          (total, curr) =>
            total +
            curr.refund_details.reduce(
              (total, current) => total + current.amount_spend,
              0
            ),
          0
        ),
      }));
    }
  }, [data]);

  const mutation = useMutation({
    mutationFn: async (objects) =>
      createBillRefund(
        await getToken({
          template: process.env.NEXT_PUBLIC_TEMPLATE_USER,
        }),
        objects
      ),
    onSuccess: () => {
      handlePrint();
      setMutating(false);
      setBillRefund({
        receiver: "",
        location: "",
        bill_name: "",
        description: "",
      });
      queryClient.invalidateQueries(["get_pre_bill"]);
      toast.success("Lập phiếu chi thành công!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        theme: "light",
      });
    },
    onError: () => {
      setMutating(false);
      toast.error("Lập phiếu chi không thành công!", {
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
      amount_spend: parseInt(billRefund.nowMoney),
      batch_id: selectPresent.id,
      code: `PC${createCode(preBill.count_bill[0].bill_refund)}`,
      created_by: user.id,
      name: billRefund.bill_name,
      description: billRefund.description.trim(),
      location: billRefund.location.trim(),
      start_at: moment().format(),
      bill_formality_id: selected.value,
      receiver: billRefund.receiver,
      bill_refund_details: {
        data: data.results.map((item) => ({
          refund_id: item.id,
          batch_id: selectPresent.id,
          amount_spend: item.refund_details.reduce(
            (total, current) => total + current.amount_spend,
            0
          ),
          created_by: user.id,
          start_at: moment().format(),
        })),
      },
    };
    setMutating(true);
    mutation.mutate(objects);
  }, [billRefund, data]);

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
                      queryClient.invalidateQueries([`searchRefund`, condition])
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
              data.results.map((item) => (
                <RowTable
                  key={item.code}
                  data={item}
                  isRefetching={isRefetching}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
      {permission === process.env.NEXT_PUBLIC_PERMISSION_READ_EDIT ? (
        billRefund.receiver.trim() &&
        billRefund.location.trim() &&
        billRefund.bill_name.trim() &&
        billRefund.nowMoney &&
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
      <PrintComponent
        printRef={printRef}
        billRefund={billRefund}
        preBill={preBill}
      />
    </>
  );
};

export default ListRefund;
