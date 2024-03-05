"use client";
import { useState, useCallback } from "react";
import CurrencyInput from "react-currency-input-field";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { createCashFund, getCashFund } from "@/utils/funtionApi";
import { useAuth } from "@clerk/nextjs";

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

const Content = ({ cashFund, permission }) => {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  const { data, isRefetching } = useQuery({
    queryKey: ["cash_fund"],
    queryFn: async () =>
      await getCashFund(
        await getToken({
          template: process.env.NEXT_PUBLIC_TEMPLATE_USER,
        })
      ),
    initialData: () => ({ data: cashFund }),
  });

  const [mutating, setMutating] = useState(false);
  const [cash, setCash] = useState(0);

  const mutation = useMutation({
    mutationFn: ({ token, object }) => createCashFund(token, object),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cash_fund"],
      });
      toast.success("Tạo mới quỹ tiền mặt thành công!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        theme: "light",
      });
      setMutating(false);
    },
    onError: () => {
      toast.error("Tạo mới quỹ tiền mặt không thành công!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        theme: "light",
      }),
        setMutating(false);
    },
  });

  const handleCreate = useCallback(async () => {
    if (cash > 0) {
      setMutating(true);
      let object = {
        fund: cash,
        is_active: true,
      };
      let token = await getToken({
        template: process.env.NEXT_PUBLIC_TEMPLATE_USER,
      });

      mutation.mutate({ token, object });
    } else {
      toast.warn("Số tiền nhập cần phải lớn hơn 0!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        theme: "light",
      });
    }
  }, [cash]);

  if (data.data.cash_fund.length === 0) {
    return (
      <div className="flex flex-col gap-2">
        <h5 className="text-center">Hiện tại hệ thống chưa có quỹ tiền mặt</h5>
        {permission === process.env.NEXT_PUBLIC_PERMISSION_READ_EDIT && (
          <>
            <div className="flex flex-col gap-1 w-[50%] self-center">
              <p className="text-xs ">Quỹ tiền mặt:</p>
              <CurrencyInput
                autoComplete="off"
                // id={`price_${norm.id}`}
                intlConfig={{ locale: "vi-VN", currency: "VND" }}
                className={`block px-2.5 pb-2.5 pt-4 w-full text-sm text-black bg-transparent rounded-[5px] border-[1px] border-gray-300 appearance-none dark:text-white dark:border-gray-600  focus:outline-none focus:ring-0  peer`}
                placeholder="Quỹ tiền mặt"
                value={cash}
                decimalsLimit={2}
                onValueChange={(value) => {
                  setCash(parseInt(value));
                }}
              />
            </div>
            {isRefetching || mutating ? (
              <span className="loading loading-spinner loading-sm bg-primary self-center"></span>
            ) : (
              <button
                className="btn w-fit self-center"
                onClick={() => handleCreate()}
              >
                Hoàn thành
              </button>
            )}
          </>
        )}
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-2">
      <h5 className="text-center">
        Quỹ tiền mặt hiện tại: {numberWithCommas(cashFund.cash_fund[0].fund)}{" "}
        đồng
      </h5>
    </div>
  );
};

export default Content;
