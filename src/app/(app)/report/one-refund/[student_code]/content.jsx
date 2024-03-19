"use client";
import {
  meilisearchGetToken,
  meilisearchReportRefundGet,
  meilisearchReportRefundOneGet,
} from "@/utils/funtionApi";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import moment from "moment";

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

const Content = ({ revenueGroup, student_code, student }) => {
  const [filter, setFilter] = useState({ start_at: null, end_at: null });
  const data = useQuery({
    queryKey: ["report_refund_one", student_code, filter],
    queryFn: async () =>
      meilisearchReportRefundOneGet(
        await meilisearchGetToken(),
        `code = ${student_code}`
      ),
  });

  const handleExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("TH da hoan tra mot hs", {
      pageSetup: { paperSize: 9, orientation: "landscape" },
    });

    const header = revenueGroup.sort((a, b) => a.position - b.position);

    sheet.addRow([]);
    sheet.addRow(["Tổng hợp các khoản đã hoàn trả"]);
    sheet.addRow(["(Theo 1 học sinh)"]);
    sheet.addRow([
      `Mã học sinh: ${student_code}`,
      `Họ tên học sinh: ${student.first_name} ${student.last_name}`,
      `Ngày sinh:`,
      `Lớp`,
      `Mã lớp`,
    ]);
    sheet.addRow([
      "Từ ngày ... tháng ... năm ... đến ngày ... tháng ... năm ...",
    ]);

    sheet.addRow([
      "STT",
      "Ngày thao tác hoàn trả",
      "Nội dung hoàn trả",
      ...header.map((item) => item.name),
      "Tổng tiền phí, học phí hoàn trả",
      "Tổng tiền thu hộ hoàn trả",
      "Tổng tiền hoàn trả",
    ]);

    data?.data?.results.forEach((item, index) => {
      sheet.addRow([
        ++index,
        moment.unix(item.start_at).format("DD-MM-yyyy"),
        "",
        ...sumArrayObjectsById(item.refund_details)
          .sort((a, b) => a.position - b.position)
          .map((item) => (item.amount_spend != null ? item.amount_spend : 0)),
        sumArrayObjectsById(item.refund_details)
          .filter((item) => item.amount_spend != null)
          .reduce(
            (total, curr) =>
              curr.revenue_type_id === 1 ? total + curr.amount_spend : total,
            0
          ),
        sumArrayObjectsById(item.refund_details)
          .filter((item) => item.amount_spend != null)
          .reduce(
            (total, curr) =>
              curr.revenue_type_id === 2 ? total + curr.amount_spend : total,
            0
          ),
        item.amount_spend,
      ]);
    });

    let lastRow = new Array(sheet.columnCount);
    lastRow[2] = "Tổng cộng";

    for (let i = 4; i <= sheet.columnCount; i++) {
      let col = sheet.getColumn(i);
      let sum = 0;
      col.eachCell((cell, rowNumber) => {
        if (rowNumber >= 7) sum = sum + parseInt(cell.text);
      });
      lastRow[i] = sum;
    }

    sheet.addRow(lastRow);

    const buf = await workbook.xlsx.writeBuffer();

    saveAs(new Blob([buf]), "Tong-hop-da-hoan-tra-mot-hs.xlsx");
  };
  return (
    <div className="flex flex-col gap-5 justify-center">
      <h5 className="text-center">Các khoản đã hoàn trả theo một học sinh</h5>
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
                  <th>Ngày thao tác hoàn trả</th>
                  <th>Nội dung hoàn trả</th>
                  {revenueGroup
                    .sort((a, b) => a.position - b.position)
                    .map((item) => (
                      <th key={item.id}>{item.name}</th>
                    ))}
                </tr>
              </thead>
              <tbody>
                {data.data.results.length ? (
                  data.data.results.map((item, index) => (
                    <tr key={index}>
                      <td>{++index}</td>
                      <td>{moment.unix(item.start_at).format("DD-MM-yyyy")}</td>
                      <td></td>
                      {sumArrayObjectsById(item.refund_details)
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
        <h6 className="text-center">
          Hiện tại chưa có thông tin về các khoản đã hoàn trả của học sinh
        </h6>
      )}
    </div>
  );
};

export default Content;
