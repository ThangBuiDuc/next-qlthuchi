"use client";
import { createContext, useState } from "react";
import SubContent from "./subContent";
import Filter from "@/app/_component/filter";
import moment from "moment";
import "moment/locale/vi";

const conditionFilter = {
  first: [
    { value: 1, label: "Năm dương lịch" },
    { value: 2, label: "Năm học, học kỳ" },
  ],
  second: [
    { value: 1, label: "Khoảng thời gian" },
    { value: 2, label: "Biên lai" },
  ],
};

// moment.updateLocale("vi", {
//   months: [
//     "Tháng 1",
//     "Tháng 2",
//     "Tháng 3",
//     "Tháng 4",
//     "Tháng 5",
//     "Tháng 6",
//     "Tháng 7",
//     "Tháng 8",
//     "Tháng 9",
//     "Tháng 10",
//     "Tháng 11",
//     "Tháng 12",
//   ],
//   monthsShort: [
//     "T1",
//     "T2",
//     "T3",
//     "T4",
//     "T5",
//     "T6",
//     "T7",
//     "T8",
//     "T9",
//     "T10",
//     "T11",
//     "T12",
//   ],
// });

export const listContext = createContext();
const Content = ({ listSearch, preReceipt, permission }) => {
  const [selected, setSelected] = useState({});
  const [selectedConditionFilter, setSelectedConditionFilter] = useState({
    first: null,
    second: null,
  });
  const [condition, setCondition] = useState([]);

  const handleOnClick = () => {
    const formality = `${
      selected.formality?.length
        ? `formality.id IN [${selected?.formality
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

    const school_year = `${
      selected.school_year?.length
        ? `schoolyear_student.school_year_id IN [${selected?.school_year
            ?.map((item) => item.value)
            .toString()}]`
        : ""
    }`;

    const batch = `${
      !selected.batch?.length
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

    const fromReceipt = selected.fromReceipt
      ? selected.fromReceipt.includes("BM") ||
        selected.fromReceipt.includes("BK")
        ? `code_number >= ${selected.fromReceipt.substring(2)}`
        : `code_number >= ${selected.fromReceipt}`
      : "";

    const toReceipt = selected.toReceipt
      ? selected.toReceipt.includes("BM") || selected.toReceipt.includes("BK")
        ? `code_number <= ${selected.toReceipt.substring(2)}`
        : `code_number <= ${selected.toReceipt}`
      : "";

    const school_level = selected.school_level?.length
      ? `schoolyear_student.class.school_level_code IN [${selected.school_level
          .map((item) => item.code)
          .toString()}]`
      : "";

    const class_level = selected.class_level?.length
      ? `schoolyear_student.class.class_level_code IN [${selected.class_level
          .map((item) => item.code)
          .toString()}]`
      : "";

    const classes = selected.class?.length
      ? `schoolyear_student.class_code IN [${selected.class
          .map((item) => item.name)
          .toString()}]`
      : "";

    const studentCode = selected.studentCode
      ? `student.code = ${selected.studentCode}`
      : "";

    setCondition(
      [
        formality && formality,
        users && users,
        selectedConditionFilter.first
          ? selectedConditionFilter.first.value === 1
            ? year
              ? year
              : ""
            : selectedConditionFilter.first.value === 2
            ? [school_year && school_year, batch && batch].filter(
                (item) => item
              )
            : ""
          : "",
        selectedConditionFilter.second
          ? selectedConditionFilter.second.value === 1
            ? [fromDate && fromDate, toDate && toDate].filter((item) => item)
            : selectedConditionFilter.second.value === 2
            ? [fromReceipt && fromReceipt, toReceipt && toReceipt].filter(
                (item) => item
              )
            : ""
          : "",
        school_level && school_level,
        class_level && class_level,
        classes && classes,
        studentCode && studentCode,
      ]
        .filter((item) => item)
        .reduce(
          (total, curr) =>
            typeof curr !== "string" ? [...total, ...curr] : [...total, curr],
          []
        )
    );
  };

  // console.log(moment(selected.fromDate).unix());

  return (
    <>
      {/* <ToastContainer /> */}
      <listContext.Provider
        value={{
          listSearch,
          selected,
          preReceipt,
        }}
      >
        <div className="flex flex-col  gap-3">
          <div className="flex gap-1 justify-center items-center w-full">
            <h4 className="text-center">Quản lý biên lai thu</h4>
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
            // handleOnClick={handleOnClick}
            conditionFilter={conditionFilter}
          >
            <div className="flex items-end h-full">
              <button className="btn w-fit" onClick={() => handleOnClick()}>
                Tìm kiếm
              </button>
            </div>
          </Filter>
          <SubContent condition={condition} permission={permission} />
        </div>
      </listContext.Provider>
    </>
  );
};

export default Content;
