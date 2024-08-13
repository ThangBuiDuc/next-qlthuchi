"use client";
import { useEffect, useState } from "react";

import moment from "moment";
import Filter from "@/app/_component/filter";
import SubContent from "./subContent";

const conditionFilter = {
  first: [
    { value: 1, label: "Năm dương lịch" },
    { value: 2, label: "Năm học, học kỳ" },
  ],
  second: [{ value: 1, label: "Khoảng thời gian" }],
};

const Content = ({ revenueGroup, listSearch, config }) => {
  const [selectedFilter, setSelectedFilter] = useState({
    formality: [],
  });
  const [selectedConditionFilter, setSelectedConditionFilter] = useState({
    first: null,
    second: null,
  });
  const [condition, setCondition] = useState([]);

  useEffect(() => {
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

    setCondition(
      [
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
    <div className="flex flex-col gap-5 justify-center">
      <h5 className="text-center">Các khoản đã thu theo nhiều học sinh</h5>
      <Filter
        listSearch={listSearch}
        selected={selectedFilter}
        setSelected={setSelectedFilter}
        selectedConditionFilter={selectedConditionFilter}
        setSelectedConditionFilter={setSelectedConditionFilter}
        condition={condition}
        setCondition={setCondition}
        conditionFilter={conditionFilter}
        reportReceipt
        noStudent={false}
      />
      <SubContent
        condition={condition}
        revenueGroup={revenueGroup}
        selectedFilter={selectedFilter}
        config={config}
      />
    </div>
  );
};

export default Content;
