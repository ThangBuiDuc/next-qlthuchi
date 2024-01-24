"use client";
import {
  meilisearchGetToken,
  meilisearchReportRefundGet,
} from "@/utils/funtionApi";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

function sumArrayObjectsById(arr) {
  const sumMap = {};

  // Iterate through the array
  arr.forEach((obj) => {
    // Check if the object has an 'id' property
    if (obj.hasOwnProperty("id")) {
      const id = obj.id;

      // If the id is already in the sumMap, add the value to it
      if (sumMap.hasOwnProperty(id)) {
        sumMap[id].amount_spend += obj.amount_spend; // Assuming the property to be summed is 'amount_spend'
      } else {
        // If the id is not in the sumMap, create a new entry with the amount_spend
        sumMap[id] = { ...obj };
      }
    }
  });

  // Convert the sumMap back to an array of objects
  const result = Object.values(sumMap);

  return result;
}

const Content = ({ revenueGroup }) => {
  const [filter, setFilter] = useState({ start_at: null, end_at: null });
  const data = useQuery({
    queryKey: ["report_refund", filter],
    queryFn: async () =>
      meilisearchReportRefundGet(await meilisearchGetToken()),
  });

  const handleExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("TH da hoan tra nhieu hs", {
      pageSetup: { paperSize: 9, orientation: "landscape" },
    });

    const header = revenueGroup.sort((a, b) => a.position - b.position);

    sheet.addRow(new Array(27));
    sheet.addRow(["TỔNG HỢP CÁC KHOẢN ĐÃ HOÀN TRẢ"]);
    sheet.addRow(["(Theo nhiều học sinh)"]);
    sheet.addRow([
      "Từ ngày ... tháng ... năm ... đến ngày ... tháng ... năm ...",
    ]);
    // sheet.addRow(Array.from({ length: 27 }, (_, i) => i + 1));
    sheet.addRow([
      "STT",
      "Mã học sinh",
      "Họ và tên học sinh",
      "Ngày sinh",
      "lớp",
      "Mã lớp",
      ...header.map((item) => item.name),
      "Tổng tiền phí, học phí hoàn trả",
      "Tổng tiền thu hộ hoàn trả",
      "Tổng tiền hoàn trả",
    ]);

    // console.log(
    //   sumArrayObjectsById(data.data.results[0].refunds).sort(
    //     (a, b) => a.position - b.position
    //   )
    // );

    data.data.results.forEach((item, index) => {
      const refunds = item.refunds((el) =>
        el.amount_spend === null ? { ...el, amount_spend: 0 } : el
      );
      sheet.addRow([
        ++index,
        item.code,
        `${item.first_name} ${item.last_name}`,
        `${item.date_of_birth.split("-").reverse().join("/")}`,
        "",
        "",
        ...sumArrayObjectsById(refunds)
          .sort((a, b) => a.position - b.position)
          .map((item) => (item.amount_spend != null ? item.amount_spend : 0)),
        sumArrayObjectsById(refunds)
          .filter((item) => item.amount_spend != null)
          .reduce(
            (total, curr) =>
              curr.revenue_type_id === 1 ? total + curr.amount_spend : total,
            0
          ),
        sumArrayObjectsById(refunds)
          .filter((item) => item.amount_spend != null)
          .reduce(
            (total, curr) =>
              curr.revenue_type_id === 2 ? total + curr.amount_spend : total,
            0
          ),
        sumArrayObjectsById(refunds)
          .filter((item) => item.amount_spend != null)
          .reduce((total, curr) => total + curr.amount_spend, 0),
      ]);
    });

    let lastRow = new Array(sheet.columnCount);
    lastRow[2] = "Tổng cộng";

    for (let i = 7; i <= sheet.columnCount; i++) {
      let col = sheet.getColumn(i);
      let sum = 0;
      col.eachCell((cell, rowNumber) => {
        if (rowNumber >= 6) sum = sum + parseInt(cell.text);
      });
      lastRow[i] = sum;
    }

    sheet.addRow(lastRow);

    sheet.getCell("A2").font = {
      bold: true,
      font: 14,
    };

    const buf = await workbook.xlsx.writeBuffer();

    saveAs(new Blob([buf]), "Tong-hop-da-hoan-tra-nhieu-hs.xlsx");
  };
  return (
    <div className="flex flex-col gap-5 justify-center">
      <h5 className="text-center">Các khoản đã hoàn trả theo nhiều học sinh</h5>
      {data.data?.results?.length ? (
        <>
          <button className="self-end btn w-fit" onClick={() => handleExcel()}>
            Xuất Excel
          </button>
          <div className="overflow-x-auto">
            <table className="table table-xs">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Mã học sinh</th>
                  <th>Họ và tên</th>
                  <th>Ngày sinh</th>
                  <th>Lớp</th>
                  <th>Mã lớp</th>
                  {revenueGroup
                    .sort((a, b) => a.position - b.position)
                    .map((item) => (
                      <th key={item.id}>{item.name}</th>
                    ))}
                  {/* <th>Tổng tiền phí, học phí hoàn trả</th>
                  <th>Tổng tiền phí, học phí hoàn trả</th> */}
                </tr>
              </thead>
              <tbody>
                {data.data.results.length ? (
                  data.data.results.map((item, index) => (
                    <tr key={index}>
                      <td>{++index}</td>
                      <td>{item.code}</td>
                      <td>{`${item.first_name} ${item.last_name}`}</td>
                      <td>
                        {item.date_of_birth.split("-").reverse().join("-")}
                      </td>
                      <td></td>
                      <td></td>
                      {sumArrayObjectsById(item.refunds)
                        .sort((a, b) => a.position - b.position)
                        .map((item) => (
                          <td key={item.id}>
                            {item.amount_spend != null ? item.amount_spend : 0}
                          </td>
                        ))}
                    </tr>
                  ))
                ) : (
                  <></>
                )}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <span className="loading loading-spinner loading-sm bg-primary self-end"></span>
      )}
    </div>
  );
};

export default Content;
