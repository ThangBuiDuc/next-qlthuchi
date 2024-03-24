"use client";
import { useState, useContext, useCallback, useRef } from "react";
import { listContext } from "../content";
import CurrencyInput from "react-currency-input-field";
import moment from "moment";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth, useUser } from "@clerk/nextjs";
import { createBillRefund } from "@/utils/funtionApi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
          Họ tên người nhận tiền: {billRefund.receiver}
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

// function createCode(lastCount) {
//   return `${moment().year().toString().slice(-2)}${(
//     "0000" +
//     (lastCount + 1)
//   ).slice(-4)}`;
// }

const Other = ({ selected }) => {
  const { preBill, selectPresent, permission } = useContext(listContext);
  const ref = useRef();

  const handlePrint = useReactToPrint({
    content: () => ref.current,
  });
  const [billRefund, setBillRefund] = useState({
    receiver: "",
    location: "",
    nowMoney: null,
    bill_name: "",
    description: "",
  });
  const [mutating, setMutating] = useState(false);
  const { getToken } = useAuth();
  const { user } = useUser();
  const queryClient = useQueryClient();

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
        nowMoney: null,
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
      location: billRefund.location,
      name: billRefund.bill_name,
      description: billRefund.description.trim(),
      start_at: moment().format(),
      bill_formality_id: selected.value,
      receiver: billRefund.receiver,
    };
    setMutating(true);
    mutation.mutate(objects);
  }, [billRefund]);

  return (
    <>
      <div className="grid grid-cols-2 items-center gap-2">
        <p className="col-span-2">
          Phiếu chi số:{" "}
          <span className="font-semibold">{`PC${createCode(
            preBill.count_bill[0].bill_refund
          )}`}</span>
        </p>
        <div className="flex gap-2 items-center">
          <p>Họ tên người nhận tiền:</p>
          <input
            type="text"
            className="input input-bordered min-w-[300px]"
            value={billRefund.receiver}
            onChange={(e) =>
              setBillRefund((pre) => ({ ...pre, receiver: e.target.value }))
            }
          />
        </div>
        <div className="flex gap-2 items-center">
          <p>Địa chỉ:</p>
          <input
            type="text"
            className="input input-bordered min-w-[300px]"
            value={billRefund.location}
            onChange={(e) =>
              setBillRefund((pre) => ({ ...pre, location: e.target.value }))
            }
          />
        </div>
        <div className="flex gap-2 items-center">
          <p>Số tiền:</p>
          <CurrencyInput
            className="input input-bordered min-w-[300px]"
            intlConfig={{ locale: "vi-VN", currency: "VND" }}
            value={billRefund.nowMoney}
            onValueChange={(e) =>
              setBillRefund((pre) => ({
                ...pre,
                nowMoney: parseInt(e),
              }))
            }
          />
        </div>
        <div className="flex gap-2 items-center">
          <p>Lý do chi:</p>
          <input
            type="text"
            className="input input-bordered min-w-[300px]"
            value={billRefund.bill_name}
            onChange={(e) =>
              setBillRefund((pre) => ({ ...pre, bill_name: e.target.value }))
            }
          />
        </div>

        <p className="italic col-span-2">
          Bằng chữ:{" "}
          <span className="font-semibold">
            {billRefund.nowMoney
              ? getText(billRefund.nowMoney).charAt(0).toUpperCase() +
                getText(billRefund.nowMoney).slice(1) +
                " đồng"
              : ""}
          </span>
        </p>
        <div className="flex gap-2 items-center">
          <p>Kèm theo:</p>
          <input
            type="text"
            className="input input-bordered min-w-[300px]"
            value={billRefund.description}
            onChange={(e) =>
              setBillRefund((pre) => ({ ...pre, description: e.target.value }))
            }
          />
        </div>
      </div>
      {permission === process.env.NEXT_PUBLIC_PERMISSION_READ_EDIT ? (
        billRefund.receiver.trim() &&
        billRefund.location.trim() &&
        billRefund.bill_name.trim() &&
        billRefund.nowMoney ? (
          mutating ? (
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
        printRef={ref}
        billRefund={billRefund}
        preBill={preBill}
      />
    </>
  );
};

export default Other;
