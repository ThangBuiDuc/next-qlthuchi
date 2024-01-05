"use client";
import { useState, useContext, useCallback } from "react";
import { listContext } from "../content";
import CurrencyInput from "react-currency-input-field";
import moment from "moment";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth, useUser } from "@clerk/nextjs";
import { createBillReceipt } from "@/utils/funtionApi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getText } from "number-to-text-vietnamese";
function createCode(lastCount) {
  return `${moment().year().toString().slice(-2)}${(
    "0000" +
    (lastCount + 1)
  ).slice(-4)}`;
}

const Other = ({ selected }) => {
  const { preBill, selectPresent } = useContext(listContext);
  const [billReceipt, setBillReceipt] = useState({
    payer: "",
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
      createBillReceipt(
        await getToken({
          template: process.env.NEXT_PUBLIC_TEMPLATE_ACCOUNTANT,
        }),
        objects
      ),
    onSuccess: () => {
      setMutating(false);
      setBillReceipt({
        payer: "",
        location: "",
        nowMoney: null,
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
      name: billReceipt.bill_name,
      location: billReceipt.location,
      description: billReceipt.description.trim(),
      start_at: moment().format(),
      bill_formality_id: selected.value,
      payer: billReceipt.payer,
    };
    setMutating(true);
    mutation.mutate(objects);
  }, [billReceipt]);

  return (
    <>
      <div className="grid grid-cols-2 items-center gap-2">
        <p className="col-span-2">
          Phiếu thu số:{" "}
          <span className="font-semibold">{`PT${createCode(
            preBill.count_bill[0].bill_receipt
          )}`}</span>
        </p>
        <div className="flex gap-2 items-center">
          <p>Họ tên người nộp tiền:</p>
          <input
            type="text"
            className="input input-bordered min-w-[300px]"
            value={billReceipt.payer}
            onChange={(e) =>
              setBillReceipt((pre) => ({ ...pre, payer: e.target.value }))
            }
          />
        </div>
        <div className="flex gap-2 items-center">
          <p>Địa chỉ:</p>
          <input
            type="text"
            className="input input-bordered min-w-[300px]"
            value={billReceipt.location}
            onChange={(e) =>
              setBillReceipt((pre) => ({ ...pre, location: e.target.value }))
            }
          />
        </div>
        <div className="flex gap-2 items-center">
          <p>Số tiền:</p>
          <CurrencyInput
            className="input input-bordered min-w-[300px]"
            intlConfig={{ locale: "vi-VN", currency: "VND" }}
            value={billReceipt.nowMoney}
            onValueChange={(e) =>
              setBillReceipt((pre) => ({
                ...pre,
                nowMoney: parseInt(e),
              }))
            }
          />
        </div>
        <div className="flex gap-2 items-center">
          <p>Lý do nộp:</p>
          <input
            type="text"
            className="input input-bordered min-w-[300px]"
            value={billReceipt.bill_name}
            onChange={(e) =>
              setBillReceipt((pre) => ({ ...pre, bill_name: e.target.value }))
            }
          />
        </div>

        <p className="italic col-span-2">
          Bằng chữ:{" "}
          <span className="font-semibold">
            {billReceipt.nowMoney
              ? getText(billReceipt.nowMoney).charAt(0).toUpperCase() +
                getText(billReceipt.nowMoney).slice(1) +
                " đồng"
              : ""}
          </span>
        </p>
        <div className="flex gap-2 items-center">
          <p>Kèm theo:</p>
          <input
            type="text"
            className="input input-bordered min-w-[300px]"
            value={billReceipt.description}
            onChange={(e) =>
              setBillReceipt((pre) => ({ ...pre, description: e.target.value }))
            }
          />
        </div>
      </div>
      {billReceipt.payer.trim() &&
      billReceipt.location.trim() &&
      billReceipt.bill_name.trim() &&
      billReceipt.nowMoney ? (
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
      )}
    </>
  );
};

export default Other;
