"use client";
import { useState, useContext, useEffect } from "react";
// import { listContext } from "../content";
import CurrencyInput from "react-currency-input-field";
import moment from "moment";
import "react-toastify/dist/ReactToastify.css";
// import Select from "react-select";
import "moment/locale/vi";
// import Datetime from "react-datetime";
// import ListReceipt from "./listReceipt";
import { getText } from "number-to-text-vietnamese";
import Filter from "@/app/_component/filter";
import SubContent from "./subContent";

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

const Content = ({ listSearch, revenueGroup, config }) => {
  //   const { preBill, listSearch } = useContext(listContext);
  //   const [billReceipt, setBillReceipt] = useState({
  //     payer: "",
  //     location: "",
  //     nowMoney: null,
  //     bill_name: "",
  //     description: "",
  //   });
  const [selectedFilter, setSelectedFilter] = useState({});
  const [selectedConditionFilter, setSelectedConditionFilter] = useState({
    first: null,
    second: null,
  });
  const [condition, setCondition] = useState([
    `${
      selectedFilter.formality?.length
        ? `formality_id IN [${selectedFilter?.formality
            ?.map((item) => item.value)
            .toString()}]`
        : ""
    }`,
  ]);

  useEffect(() => {
    const formality = `${
      selectedFilter.formality?.length
        ? `formality_id IN [${selectedFilter?.formality
            ?.map((item) => item.value)
            .toString()}]`
        : ""
    }`;

    const users = `${
      selectedFilter.users?.length
        ? `user.clerk_id IN [${selectedFilter?.users
            ?.map((item) => item.value)
            .toString()}]`
        : ""
    }`;

    // console.log(selectedFilter.year);

    const year = selectedFilter.year
      ? `start_year = ${selectedFilter.year.year()}`
      : "";

    // const school_year = `${
    //   selectedFilter.school_year?.length
    //     ? `schoolyear_student.school_year_id IN [${selectedFilter?.school_year
    //         ?.map((item) => item.value)
    //         .toString()}]`
    //     : ""
    // }`;

    const batch = `${
      selectedFilter.batch?.length
        ? `batch_id IN [${selectedFilter?.batch
            ?.map((item) => item.value)
            .toString()}]`
        : ""
    }`;

    const fromDate = selectedFilter.fromDate
      ? `start_at >= ${moment(selectedFilter.fromDate).unix()}`
      : "";

    const toDate = selectedFilter.toDate
      ? `start_at <= ${moment(selectedFilter.toDate).unix()}`
      : "";

    const fromReceipt = selectedFilter.fromReceipt
      ? selectedFilter.fromReceipt.includes("BM") ||
        selectedFilter.fromReceipt.includes("BK")
        ? `code_number >= ${selectedFilter.fromReceipt.substring(2)}`
        : `code_number >= ${selectedFilter.fromReceipt}`
      : "";

    const toReceipt = selectedFilter.toReceipt
      ? selectedFilter.toReceipt.includes("BM") ||
        selectedFilter.toReceipt.includes("BK")
        ? `code_number <= ${selectedFilter.toReceipt.substring(2)}`
        : `code_number <= ${selectedFilter.toReceipt}`
      : "";

    const school_level = selectedFilter.school_level?.length
      ? `student.school_level_code IN [${selectedFilter.school_level
          .map((item) => item.code)
          .toString()}]`
      : "";

    const class_level = selectedFilter.class_level?.length
      ? `student.class_level_code IN [${selectedFilter.class_level
          .map((item) => item.code)
          .toString()}]`
      : "";

    const classes = selectedFilter.class?.length
      ? `student.class_code IN [${selectedFilter.class
          .map((item) => item.name)
          .toString()}]`
      : "";

    const studentCode = selectedFilter.studentCode
      ? `code = ${selectedFilter.studentCode}`
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
            ? batch
              ? batch
              : ""
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
  }, [selectedConditionFilter, selectedFilter]);

  return (
    <>
      <div className="flex flex-col gap-3 ">
        <h6 className="text-center">Bảng kê biên lai thu</h6>
        <Filter
          listSearch={listSearch}
          selected={selectedFilter}
          setSelected={setSelectedFilter}
          selectedConditionFilter={selectedConditionFilter}
          setSelectedConditionFilter={setSelectedConditionFilter}
          condition={condition}
          setCondition={setCondition}
          //   formality={2}
          conditionFilter={conditionFilter}
        ></Filter>
        <SubContent
          condition={condition}
          revenueGroup={revenueGroup}
          formality={selectedFilter?.formality}
          config={config}
        />
      </div>
    </>
  );
};

export default Content;
