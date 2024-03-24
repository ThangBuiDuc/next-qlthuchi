"use client";
import { createContext, useEffect, useState } from "react";
import moment from "moment";
import "moment/locale/vi";
import SubContent from "./subContent";
import Filter from "@/app/_component/filter";

const conditionFilter = {
  first: [
    { value: 1, label: "Năm dương lịch" },
    { value: 2, label: "Năm học, học kỳ" },
  ],
  second: [
    { value: 1, label: "Khoảng thời gian" },
    { value: 2, label: "Phiếu chi" },
  ],
};

moment.updateLocale("vi", {
  months: [
    "Tháng 1",
    "Tháng 2",
    "Tháng 3",
    "Tháng 4",
    "Tháng 5",
    "Tháng 6",
    "Tháng 7",
    "Tháng 8",
    "Tháng 9",
    "Tháng 10",
    "Tháng 11",
    "Tháng 12",
  ],
  monthsShort: [
    "T1",
    "T2",
    "T3",
    "T4",
    "T5",
    "T6",
    "T7",
    "T8",
    "T9",
    "T10",
    "T11",
    "T12",
  ],
});

export const listContext = createContext();
const Content = ({ listSearch, permission }) => {
  const [selected, setSelected] = useState({});
  const [selectedConditionFilter, setSelectedConditionFilter] = useState({
    first: null,
    second: null,
  });
  const [condition, setCondition] = useState([]);

  // console.log(moment(selected.fromDate).unix());

  useEffect(() => {
    const bill_formality = `${
      selected.formality?.length
        ? `bill_formality_id IN [${selected?.formality
            ?.map((item) => item.value)
            .toString()}]`
        : ""
    }`;

    const users = `${
      selected.users?.length
        ? `created_by IN [${selected?.users
            ?.map((item) => item.value)
            .toString()}]`
        : ""
    }`;

    const year = selected.year ? `start_year = ${selected.year.year()}` : "";

    // const school_year = `${
    //   selected.school_year?.length
    //     ? `schoolyear_student.school_year_id IN [${selected?.school_year
    //         ?.map((item) => item.value)
    //         .toString()}]`
    //     : ""
    // }`;

    const batch = `${
      selected.batch?.length
        ? `batch_id IN [${selected?.batch
            ?.map((item) => item.value)
            .toString()}]`
        : ""
    }`;

    const fromDate = selected.fromDate
      ? `start_date >= ${moment(selected.fromDate).unix()}`
      : "";

    const toDate = selected.toDate
      ? `start_date <= ${moment(selected.toDate).unix()}`
      : "";

    const fromBillRefund = selected.fromReciept
      ? `code >= ${selected.fromReciept}`
      : "";

    const toBillRefund = selected.toReceipt
      ? `code <= ${selected.toReceipt}`
      : "";

    setCondition(
      [
        bill_formality && bill_formality,
        users && users,
        selectedConditionFilter.first
          ? selectedConditionFilter.first.value === 1
            ? year
              ? year
              : ""
            : selectedConditionFilter.first.value === 2
            ? [batch && batch].filter((item) => item)
            : ""
          : "",
        selectedConditionFilter.second
          ? selectedConditionFilter.second.value === 1
            ? [fromDate && fromDate, toDate && toDate].filter((item) => item)
            : selectedConditionFilter.second.value === 2
            ? [
                fromBillRefund && fromBillRefund,
                toBillRefund && toBillRefund,
              ].filter((item) => item)
            : ""
          : "",
      ]
        .filter((item) => item)
        .reduce(
          (total, curr) =>
            typeof curr !== "string" ? [...total, ...curr] : [...total, curr],
          []
        )
    );
  }, [selected, selectedConditionFilter]);

  return (
    <>
      {/* <ToastContainer /> */}
      <listContext.Provider
        value={{
          listSearch,
        }}
      >
        <div className="flex flex-col  gap-3">
          <div className="flex gap-1 justify-center items-center w-full">
            <h4 className="text-center">Quản lý phiếu chi tiền mặt</h4>
          </div>
          {/* <div className="flex flex-col w-full border-opacity-50"> */}

          {/* <div className="flex items-end h-full">
            <button className="btn w-fit" onClick={() => handleOnClick()}>
              Tìm kiếm
            </button>
          </div> */}
          <Filter
            listSearch={listSearch}
            selected={selected}
            setSelected={setSelected}
            selectedConditionFilter={selectedConditionFilter}
            setSelectedConditionFilter={setSelectedConditionFilter}
            condition={condition}
            setCondition={setCondition}
            conditionFilter={conditionFilter}
            bill
            refund
          ></Filter>
          <SubContent condition={condition} permission={permission} />
        </div>
      </listContext.Provider>
    </>
  );
};

export default Content;
