"use client";
import { useMemo, useState } from "react";
import { listContext } from "../content";
import SubContent from "./subContent";
import { getPreBill } from "@/utils/funtionApi";
import { useQuery } from "@tanstack/react-query";
import { gql, useSubscription } from "@apollo/client";
import { Spinner } from "@nextui-org/spinner";

const Content = ({
  student,
  present,
  permission,
  config,
  InitialPreBill,
  revenueGroup,
}) => {
  const selectPresent = useMemo(
    () => present.result[0].batchs.find((item) => item.is_active === true),
    []
  );

  const preBill = useQuery({
    queryFn: () => getPreBill(),
    queryKey: ["get_pre_bill"],
    staleTime: Infinity,
    initialData: () => InitialPreBill,
  });

  const bill = useSubscription(gql`
    subscription billRefund {
      count_bill {
        bill_refund
      }
    }
  `);

  return (
    <>
      {/* <ToastContainer /> */}
      <listContext.Provider
        value={{
          selectPresent,
          student,
          permission,
          config,
          preBill: preBill.data,
          bill: bill.data,
          revenueGroup,
        }}
      >
        <div className="flex flex-col  gap-[15px]">
          <div className="flex flex-col gap-[10px]">
            <div className="flex gap-1 justify-center items-center w-full">
              <h4 className="text-center">
                Phiếu chi tiền thừa theo một học sinh
              </h4>
            </div>
          </div>
          <div>
            <p className="font-semibold ">Mã học sinh: {student.code}</p>
            <p className="font-semibold ">
              Học sinh: {`${student.first_name} ${student.last_name}`}
            </p>
          </div>

          {bill.loading ? (
            <Spinner color="primary" />
          ) : (
            <SubContent student={student} selectPresent={selectPresent} />
          )}
        </div>
      </listContext.Provider>
    </>
  );
};

export default Content;
