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

const Content = ({ revenueGroup, student, listSearch }) => {
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

    const studentCode = student ? `code = ${student.code}` : "";

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
  // console.log(revenueGroup);
  // const [filter, setFilter] = useState({ start_at: null, end_at: null });
  // const data = useQuery({
  //   queryKey: ["report_receipt_one", student_code],
  //   queryFn: async () =>
  //     meilisearchReportReceiptOneGet(
  //       await meilisearchGetToken(),
  //       `code = ${student_code}`
  //     ),
  // });
  // return (
  //   <div className="flex flex-col gap-5 justify-center">
  //     <h5 className="text-center">Các khoản đã thu theo một học sinh</h5>
  //     {data.data?.results?.length ? (
  //       <>
  //         <button className="self-end btn w-fit" onClick={() => handleExcel()}>
  //           Xuất Excel
  //         </button>
  //         <div className="overflow-x-auto">
  //           <table className="table table-xs">
  //             <thead>
  //               <tr>
  //                 <th>STT</th>
  //                 <th>Ngày thao tác thu</th>
  //                 <th>Nội dung thu</th>
  //                 {revenueGroup
  //                   .sort((a, b) => a.position - b.position)
  //                   .map((item) => (
  //                     <th key={item.id}>{item.name}</th>
  //                   ))}
  //               </tr>
  //             </thead>
  //             <tbody>
  //               {data.data.results.length ? (
  //                 data.data.results.map((item, index) => (
  //                   <tr key={index}>
  //                     <td>{++index}</td>
  //                     <td>{moment.unix(item.start_at).format("DD-MM-yyyy")}</td>
  //                     <td></td>
  //                     {sumArrayObjectsById(item.receipt_details)
  //                       .sort((a, b) => a.position - b.position)
  //                       .map((item) => (
  //                         <td key={item.id}>
  //                           {item.amount_collected != null
  //                             ? item.amount_collected
  //                             : 0}
  //                         </td>
  //                       ))}
  //                   </tr>
  //                 ))
  //               ) : (
  //                 <></>
  //               )}
  //             </tbody>
  //           </table>
  //         </div>
  //       </>
  //     ) : (
  //       // <span className="loading loading-spinner loading-sm bg-primary self-end"></span>
  //       <h6 className="text-center">Hiện tại chưa có dữ liệu!!</h6>
  //     )}
  //   </div>
  // );
  return (
    <div className="flex flex-col gap-5 justify-center">
      <h5 className="text-center">Các khoản đã thu theo một học sinh</h5>
      <Filter
        listSearch={listSearch}
        selected={selectedFilter}
        setSelected={setSelectedFilter}
        selectedConditionFilter={selectedConditionFilter}
        setSelectedConditionFilter={setSelectedConditionFilter}
        condition={condition}
        setCondition={setCondition}
        conditionFilter={conditionFilter}
        noStudent
        reportReceipt
      />
      <SubContent
        condition={condition}
        revenueGroup={revenueGroup}
        student={student}
        selectedFilter={selectedFilter}
      />
    </div>
  );
};

export default Content;
