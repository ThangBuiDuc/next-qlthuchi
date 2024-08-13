"use client";
import { createContext, useState, useMemo } from "react";
import Select from "react-select";
import Other from "./_other/other";
import { getPreBill } from "@/utils/funtionApi";
// import Main from "./_filter/main";
import { useQuery } from "@tanstack/react-query";
import Refund from "./_refund/refund";
import { gql, useSubscription } from "@apollo/client";
import { Spinner } from "@nextui-org/spinner";

export const listContext = createContext();

const Content = ({
  listSearch,
  InitialPreBill,
  present,
  permission,
  revenueGroup,
  config,
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

  const [selected, setSelected] = useState();
  return (
    <>
      {/* <ToastContainer /> */}
      <listContext.Provider
        value={{
          listSearch,
          revenueGroup,
          preBill: preBill.data,
          selectPresent,
          permission,
          config,
          bill: bill.data,
        }}
      >
        <div className="flex flex-col  gap-3">
          <div className="flex gap-1 justify-center items-center w-full">
            <h4 className="text-center">Lập phiếu chi tiền mặt</h4>
          </div>
          <div className="flex gap-1 items-center w-full justify-center">
            <h6>Học kỳ: </h6>
            <h6>{selectPresent.batch} - </h6>
            <h6>Năm học: {present.result[0].school_year}</h6>
          </div>
          <div className="flex items-center gap-1">
            <h6>Hình thức chi:</h6>
            <Select
              noOptionsMessage={() => "Không tìm thấy kết quả phù hợp!"}
              placeholder="Hình thức chi!"
              options={preBill.data.bill_formality.map((item) => ({
                value: item.id,
                label: item.name,
              }))}
              value={selected}
              onChange={setSelected}
              className="text-black w-52"
            />
          </div>

          {bill.loading ? (
            <Spinner color="primary" />
          ) : (
            <>
              {selected?.value === 1 && <Other selected={selected} />}
              {selected?.value === 2 && <Refund selected={selected} />}
            </>
          )}
        </div>
      </listContext.Provider>
    </>
  );
};

export default Content;
