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
    { value: 2, label: "Phiếu thu" },
  ],
};

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

    const fromBillReceipt = selected.fromReceipt
      ? selected.fromReceipt.includes("PT")
        ? `code_number >= ${selected.fromReceipt.substring(2)}`
        : `code_number >= ${selected.fromReceipt}`
      : "";

    const toBillReceipt = selected.toReceipt
      ? selected.toReceipt.includes("PT")
        ? `code_number <= ${selected.toReceipt.substring(2)}`
        : `code_number <= ${selected.toReceipt}`
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
            ? batch
              ? batch
              : ""
            : ""
          : "",
        selectedConditionFilter.second
          ? selectedConditionFilter.second.value === 1
            ? [fromDate && fromDate, toDate && toDate].filter((item) => item)
            : selectedConditionFilter.second.value === 2
            ? [
                fromBillReceipt && fromBillReceipt,
                toBillReceipt && toBillReceipt,
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
            <h4 className="text-center">Quản lý phiếu thu tiền mặt</h4>
          </div>
          {/* <div className="flex flex-col w-full border-opacity-50"> */}
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
          />

          {/* <div className="flex items-end h-full">
            <button className="btn w-fit" onClick={() => handleOnClick()}>
              Tìm kiếm
            </button>
          </div> */}

          <SubContent condition={condition} permission={permission} />
        </div>
      </listContext.Provider>
    </>
  );
};

export default Content;
