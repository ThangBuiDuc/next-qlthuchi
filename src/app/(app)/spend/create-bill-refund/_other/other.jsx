"use client";
import { useState, useContext, useCallback } from "react";
import { listContext } from "../content";
import CurrencyInput from "react-currency-input-field";
import moment from "moment";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth, useUser } from "@clerk/nextjs";
import { createBillRefund } from "@/utils/funtionApi";
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
          template: process.env.NEXT_PUBLIC_TEMPLATE_ACCOUNTANT,
        }),
        objects
      ),
    onSuccess: () => {
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
          <p>Lý do nộp:</p>
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
      {billRefund.receiver.trim() &&
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
      )}
    </>
  );
};

export default Other;
