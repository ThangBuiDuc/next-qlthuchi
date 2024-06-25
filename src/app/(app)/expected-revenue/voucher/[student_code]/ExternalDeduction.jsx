"use client";
import CurrencyInput from "react-currency-input-field";
import {
  createExternalDeduction,
  getExternalDeduction,
} from "@/utils/funtionApi";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useAuth } from "@clerk/nextjs";
import { useState, useCallback, useEffect } from "react";

const Skeleton = () => {
  return (
    <table>
      <thead>
        {[...Array(3)].map((_, i) => (
          <tr key={i}>
            {[...Array(3)].map((_, ii) => (
              <td key={ii}>
                <>
                  <div className="skeleton h-4 w-full"></div>
                </>
              </td>
            ))}
          </tr>
        ))}
      </thead>
    </table>
  );
};

export default function ExternalDeduction({ data }) {
  const [value, setValue] = useState(0);
  const [reason, setReason] = useState("");
  const [totalValue, setTotalValue] = useState(0)
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  const data1 = useQuery({
    queryKey: [`get_external_deduction_${data.id}`],
    queryFn: async () =>
      await getExternalDeduction(
        await getToken({
          template: process.env.NEXT_PUBLIC_TEMPLATE_USER,
        }),
        data.id
      ),
  });

  useEffect(() => {
    if(data1?.data?.data?.result?.length > 0 ) {
      const total = data1?.data?.data?.result.reduce((accumulator, currentItem) => accumulator + currentItem.value, 0)
      setTotalValue(total)
    }
  },[data1])

  // console.log(totalValue)

  const mutation = useMutation({
    // mutationFn: ({ token, id, discount, objects }) =>
    //   createExpectedRevenueDiscount(token, id, discount, objects),
    mutationFn: ({ token, objects }) => createExternalDeduction(token, objects),
    onSuccess: () => {
      queryClient.invalidateQueries([`get_external_deduction_${data.id}`]);
      queryClient.invalidateQueries(["get_expected_revenue"]);
      toast.success("Thêm mới số tiền giảm trừ cho khoản thu thành công!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        theme: "light",
      });
    },
    onError: () => {
      toast.error("Thêm mới số tiền giảm trừ cho khoản thu không thành công!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        theme: "light",
      });
    },
  });

  const handleOnSubmit = useCallback(async () => {
    let objects = {
      expected_revenue_id: data.id,
      value: value,
      reason: reason,
    };
    let token = await getToken({
      template: process.env.NEXT_PUBLIC_TEMPLATE_USER,
    });
    mutation.mutate({ token, objects });
  }, [data, value, reason]);

  // console.log(data.id)
  return (
    <>
      <input type="checkbox" id={`modal_${data.id}`} className="modal-toggle" />
      <div className="modal" role="dialog">
        <div
          className="modal-box flex flex-col gap-3 max-w-full w-1/4"
          style={{ overflowY: "unset" }}
        >
          <label
            htmlFor={`modal_${data.id}`}
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 cursor-pointer"
          >
            ✕
          </label>
          <div className="flex flex-col gap-5 m-5">
            <div className="flex flex-col gap-3">
              <div className="w-full">
                <label
                  htmlFor="currency"
                  className="block text-gray-800 font-semibold text-sm mb-1"
                >
                  Số tiền giảm
                </label>
                <CurrencyInput
                  autoComplete="off"
                  name="currency"
                  intlConfig={{ locale: "vi-VN", currency: "VND" }}
                  className={`block rounded-md py-3 px-4 ring-1 ring-inset ring-gray-400 focus:text-gray-800 w-full`}
                  value={value}
                  onValueChange={(value) => setValue(value)}
                  decimalsLimit={2}
                />
              </div>
              <div className="w-full">
                <label
                  htmlFor="reason"
                  className="block text-gray-800 font-semibold text-sm mb-1"
                >
                  Lí do giảm
                </label>
                <textarea
                  name="reason"
                  className="block rounded-md py-3 px-4 ring-1 ring-inset ring-gray-400 focus:text-gray-800 w-full"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
              </div>

              <button
                onClick={() => handleOnSubmit()}
                className="btn w-fit items-center bg-white text-black border-bordercl hover:bg-[#134a9abf] hover:text-white hover:border-bordercl"
              >
                Lưu
              </button>
            </div>
            {data1.isFetching || data1.isLoading ? (
              <Skeleton />
            ) : data1?.data?.data?.length === 0 ? (
              <p>Không có kết quả!</p>
            ) : data1 ? (
              <div className="flex flex-col items-center w-full gap-3">
                <h6>Số tiền giảm trừ</h6>
                <div className="overflow-x-auto w-full">
                  <table className="table table-pin-rows">
                    <thead>
                      <tr>
                        <th>STT</th>
                        <th>Số tiền</th>
                        <th>Lí do giảm</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data1?.data?.data.result.map((item, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{item.value}</td>
                          <td>{item.reason}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <h6>Tổng số tiền giảm trừ: {totalValue}</h6>
              </div>
            ) : (
              <></>
            )}
          </div>
          {/* {data.id} */}
        </div>
      </div>
    </>
  );
}
