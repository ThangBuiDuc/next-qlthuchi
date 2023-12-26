"use client";
import { useState, useContext, useCallback } from "react";
import { listContext } from "../content";
import { IoIosAddCircleOutline } from "react-icons/io";
import { v4 as uuidv4 } from "uuid";
import CurrencyInput from "react-currency-input-field";
import { CiCircleMinus } from "react-icons/ci";
import moment from "moment";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth, useUser } from "@clerk/nextjs";
import { createBillRefund } from "@/utils/funtionApi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function createCode(lastCount) {
  return `${moment().year().toString().slice(-2)}${(
    "0000" +
    (lastCount + 1)
  ).slice(-4)}`;
}

const Other = () => {
  const { preBill, selectPresent } = useContext(listContext);
  const [listRevenue, setListRevenue] = useState([]);
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
      setListRevenue([]);
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
      amount_spend: listRevenue.reduce(
        (total, curr) => total + parseInt(curr.nowMoney),
        0
      ),
      batch_id: selectPresent.id,
      code: `PC${createCode(preBill.count_bill[0].bill_refund)}`,
      created_by: user.id,
      start_at: moment().format(),
      bill_refund_details: {
        data: listRevenue.map((item) => ({
          batch_id: selectPresent.id,
          amount_spend: parseInt(item.nowMoney),
          created_by: user.id,
          start_at: moment().format(),
          revenue_name: item.name,
        })),
      },
    };
    setMutating(true);
    mutation.mutate(objects);
  }, [listRevenue]);

  return (
    <div className="flex flex-col gap-4">
      <h6>
        Phiếu chi số: {`PC${createCode(preBill.count_bill[0].bill_refund)}`}
      </h6>
      {listRevenue.length ? (
        <>
          <div className="overflow-x-auto">
            <table className="table">
              {/* head */}
              <thead>
                <tr>
                  <th>TT</th>
                  <th>Tên khoản chi</th>
                  <th>Số tiền chi</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {listRevenue.map((item, index) => (
                  <tr key={item.uuid} className="w-full hover">
                    <td className="w-[5%]">{++index}</td>
                    <td className="w-[60%]">
                      <>
                        <input
                          type="text"
                          placeholder="Tên khoản chi"
                          value={item.name}
                          onChange={(e) =>
                            setListRevenue((pre) =>
                              pre.map((el) =>
                                el.uuid === item.uuid
                                  ? { ...el, name: e.target.value }
                                  : el
                              )
                            )
                          }
                          className={`input input-bordered input-sm w-full`}
                        />
                      </>
                    </td>
                    <td className="w-[30%]">
                      <>
                        <CurrencyInput
                          autoComplete="off"
                          intlConfig={{ locale: "vi-VN", currency: "VND" }}
                          className={`input input-bordered input-sm w-full`}
                          placeholder="Số tiền chi"
                          value={item.nowMoney}
                          onValueChange={(value) =>
                            setListRevenue((pre) =>
                              pre.map((el) =>
                                el.uuid === item.uuid
                                  ? { ...el, nowMoney: value }
                                  : el
                              )
                            )
                          }
                          decimalsLimit={2}
                        />
                      </>
                    </td>
                    <td className="w-[5%]">
                      <>
                        <div
                          className="tooltip w-fit self-center cursor-pointer"
                          data-tip="Xoá"
                          onClick={() =>
                            setListRevenue((pre) =>
                              pre.reduce(
                                (total, curr) =>
                                  item.uuid === curr.uuid
                                    ? total
                                    : [...total, curr],
                                []
                              )
                            )
                          }
                        >
                          <CiCircleMinus size={30} />
                        </div>
                      </>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div
            className="tooltip w-fit self-center cursor-pointer"
            data-tip="Thêm khoản chi"
            onClick={() =>
              setListRevenue((pre) => [
                ...pre,
                { uuid: uuidv4(), name: "", nowMoney: "" },
              ])
            }
          >
            <IoIosAddCircleOutline size={30} />
          </div>
        </>
      ) : (
        <div
          className="tooltip w-fit self-center cursor-pointer"
          data-tip="Thêm khoản chi"
          onClick={() =>
            setListRevenue((pre) => [
              ...pre,
              { uuid: uuidv4(), name: "", nowMoney: "" },
            ])
          }
        >
          <IoIosAddCircleOutline size={30} />
        </div>
      )}
      {listRevenue.every((item) => item.nowMoney) && listRevenue.length ? (
        mutating ? (
          <span className="loading loading-spinner loading-md self-center"></span>
        ) : (
          <button
            className="btn w-fit self-center"
            onClick={() => handleOnClick()}
          >
            Lập phiếu chi
          </button>
        )
      ) : (
        <></>
      )}
    </div>
  );
};

export default Other;
