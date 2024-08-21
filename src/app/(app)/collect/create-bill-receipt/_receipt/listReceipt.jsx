"use client";
import {
  // meilisearchReceiptGet,
  // updateReceipt,
  meilisearchGetToken,
  createBillReceipt,
  meilisearchReportReceiptOneGet,
} from "@/utils/funtionApi";
import { listContext } from "../content";
// import { useState, useContext, useRef, useMemo } from "react";
import moment from "moment-timezone";
import { getText } from "number-to-text-vietnamese";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { TbReload } from "react-icons/tb";
import { useEffect, useContext, useCallback, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import localFont from "next/font/local";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const times = localFont({ src: "../../../../times.ttf" });
// import { IoMdPrint } from "react-icons/io";
// import { IoTrashBinOutline } from "react-icons/io5";
// import { useReactToPrint } from "react-to-print";
// import { getText } from "number-to-text-vietnamese";
// import { useMutation } from "@tanstack/react-query";
import { useAuth, useUser } from "@clerk/nextjs";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function sumArrayObjectsById(arr) {
  const sumMap = {};

  // Iterate through the array
  arr.forEach((obj) => {
    // Check if the object has an 'id' property
    if (obj.hasOwnProperty("id")) {
      const id = obj.id;

      // If the id is already in the sumMap, add the value to it
      if (sumMap.hasOwnProperty(id)) {
        sumMap[id].amount_collected += obj.amount_collected; // Assuming the property to be summed is 'amount_collected'
      } else {
        // If the id is not in the sumMap, create a new entry with the amount_collected
        sumMap[id] = { ...obj };
      }
    }
  });

  // Convert the sumMap back to an array of objects
  const result = Object.values(sumMap);

  return result;
}

function createCode(lastCount) {
  return `${moment().year().toString().slice(-2)}${(
    "0000" +
    (lastCount + 1)
  ).slice(-4)}`;
}

function numberWithCommas(x, config) {
  return x
    .toString()
    .replace(
      /\B(?=(\d{3})+(?!\d))/g,
      config.result[0].config.numberComma.value
    );
}

const PrintComponent = ({ printRef, billReceipt, preBill }) => {
  const { config, bill } = useContext(listContext);
  return (
    <div className="hidden">
      <div className={`flex flex-col ${times.className}`} ref={printRef}>
        <style type="text/css" media="print">
          {"@page { size: A4; margin: 10px;}"}
        </style>
        <p className="text-[13px]">
          TRƯỜNG TIỂU HỌC VÀ TRUNG HỌC CƠ SỞ HỮU NGHỊ QUỐC TẾ
        </p>
        <p className="text-[13px]">
          Địa chỉ Số 50, đường Quán Nam, phường Kênh Dương, quận Lê Chân, thành
          phố Hải Phòng
        </p>
        <p className="uppercase font-semibold text-[27px] text-center">
          phiếu thu
        </p>
        <p className=" text-[18px] text-center">
          Ngày {moment().date()} Tháng {moment().month() + 1} Năm{" "}
          {moment().year()}
        </p>
        <p className=" text-[18px] text-end">
          Số: {`PT${createCode(bill.count_bill[0].bill_receipt)}`}
        </p>
        <p className=" text-[18px]">
          Họ tên người nộp tiền: {billReceipt.payer}
        </p>
        <p className=" text-[18px]">Địa chỉ: {billReceipt.location}</p>
        <p className=" text-[18px]">Lý do nộp: {billReceipt.bill_name}</p>
        <p className=" text-[18px]">
          Số tiền:{" "}
          {billReceipt.nowMoney
            ? numberWithCommas(billReceipt.nowMoney, config)
            : ""}{" "}
          đồng
        </p>
        <p className=" text-[18px]">
          Bằng chữ:{" "}
          {billReceipt.nowMoney
            ? getText(billReceipt.nowMoney).charAt(0).toUpperCase() +
              getText(billReceipt.nowMoney).slice(1) +
              " đồng"
            : ""}{" "}
        </p>
        <p className=" text-[18px]">Kèm theo: {billReceipt.description}</p>
        <p className=" text-[18px] text-end">
          Ngày {moment().date()} Tháng {moment().month() + 1} Năm{" "}
          {moment().year()}
        </p>
        <p className="flex justify-around text-[18px] font-semibold">
          <span>Thủ trưởng</span>
          <span>Kế toán trưởng</span>
          <span>Người nộp tiền</span>
          <span>Người lập phiếu</span>
          <span>Thủ quỹ</span>
        </p>
        <p className=" text-[18px] mt-[120px]">
          {`Đã nhận đủ số tiền (viết bằng chữ): 
        ${
          billReceipt.nowMoney
            ? getText(billReceipt.nowMoney).charAt(0).toUpperCase() +
              getText(billReceipt.nowMoney).slice(1) +
              " đồng"
            : ""
        }`}
        </p>
      </div>
    </div>
  );
};

const SecondPrintComponent = async (data, revenueGroup) => {
  // console.log(data);

  const header = revenueGroup.result.sort((a, b) => a.position - b.position);

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("BẢNG KÊ BIÊN LAI THU TIỀN");

  worksheet.mergeCells("B1:C1");
  const tentruong = worksheet.getCell("B1");
  tentruong.value = "TRƯỜNG TH&THCS HỮU NGHỊ QUỐC TẾ";
  tentruong.font = {
    name: "Times New Roman",
    size: 11,
    color: { argb: "FF0000" },
  };
  tentruong.alignment = { vertical: "middle", horizontal: "center" };

  worksheet.mergeCells("C2:J2");
  const titleCell = worksheet.getCell("G2");
  titleCell.value = "BẢNG KÊ BIÊN LAI THU TIỀN";
  titleCell.font = { name: "Times New Roman", size: 16, bold: true };
  titleCell.alignment = { vertical: "middle", horizontal: "center" };

  worksheet.mergeCells("C3:J3");
  const Ghichu = worksheet.getCell("G3");
  Ghichu.value = "Hình thức thu: Tiền mặt";
  Ghichu.font = { name: "Times New Roman", size: 14 };
  Ghichu.alignment = { vertical: "middle", horizontal: "center" };

  worksheet.mergeCells("C4:J4");
  const Taingay = worksheet.getCell("G4");
  Taingay.value = `Từ ngày ….. tháng ….. năm …. đến ngày …. tháng ….. năm ….`;
  Taingay.font = {
    name: "Times New Roman",
    size: 14,
    color: { argb: "FF0000" },
  };
  Taingay.alignment = { vertical: "middle", horizontal: "center" };
  // Thêm dữ liệu vào bảng tính
  worksheet.columns = [
    { key: "col1", width: 5 },
    { key: "col2", width: 20 },
    { key: "col3", width: 30 },
    { key: "col4", width: 20 },
    { key: "col5", width: 20 },
    { key: "col6", width: 20 },
    { key: "col7", width: 20 },
    { key: "col8", width: 20 },
    { key: "col9", width: 20 },
    { key: "col10", width: 20 },
    { key: "col11", width: 20 },
    { key: "col12", width: 20 },
    { key: "col13", width: 20 },
    { key: "col14", width: 20 },
    { key: "col15", width: 20 },
    { key: "col16", width: 20 },
    { key: "col17", width: 20 },
    { key: "col18", width: 20 },
    { key: "col19", width: 20 },
    { key: "col20", width: 20 },
    { key: "col21", width: 20 },
    { key: "col22", width: 20 },
    { key: "col23", width: 20 },
    { key: "col24", width: 20 },
    { key: "col25", width: 20 },
    { key: "col26", width: 20 },
    { key: "col27", width: 20 },
  ];

  worksheet.addRow([]);
  worksheet.addRow([
    "STT",
    "Mã học sinh",
    "Họ và tên học sinh",
    "Số biên lai",
    "Ngày BL",
    ...header.map((item) => item.name),
    "Tổng tiền thu phí, học phí",
    "Tổng tiền thu hộ",
    "Tổng các khoản tiền thu",
  ]);

  data.forEach((item, index) => {
    worksheet.addRow([
      ++index,
      item.student.student_code,
      `${item.student.first_name} ${item.student.last_name}`,
      item.receipt_code,
      moment.unix(item.start_at).format("DD-MM-yyyy"),
      ...sumArrayObjectsById(item.receipt_details)
        .sort((a, b) => a.position - b.position)
        .map((item) =>
          item.amount_collected != null ? item.amount_collected : 0
        ),
      sumArrayObjectsById(item.receipt_details)
        .filter((item) => item.amount_collected != null)
        .reduce(
          (total, curr) =>
            curr.revenue_type_id === 1 ? total + curr.amount_collected : total,
          0
        ),
      sumArrayObjectsById(item.receipt_details)
        .filter((item) => item.amount_collected != null)
        .reduce(
          (total, curr) =>
            curr.revenue_type_id === 2 ? total + curr.amount_collected : total,
          0
        ),
      item.amount_collected,
    ]);
  });

  let lastRow = new Array(worksheet.columnCount);
  lastRow[3] = "Cộng";

  for (let i = 6; i <= worksheet.columnCount; i++) {
    let col = worksheet.getColumn(i);
    let sum = 0;
    col.eachCell((cell, rowNumber) => {
      if (rowNumber >= 7) sum = sum + parseInt(cell.text);
    });
    lastRow[i] = sum;
  }

  worksheet.addRow(lastRow);
  // worksheet.getCell(6, 1).value = "STT";
  // worksheet.getCell(6, 2).value = "Mã học sinh";
  // worksheet.getCell(6, 3).value = "Họ và tên học sinh";
  // worksheet.getCell(6, 4).value = "Số biên lai";
  // worksheet.getCell(6, 5).value = "Ngày BL";
  // worksheet.getCell(6, 6).value = "Học phí thực thu";
  // worksheet.getCell(6, 7).value = "Phí bán trú";
  // worksheet.getCell(6, 8).value = "Phí dự tuyển";
  // worksheet.getCell(6, 9).value = "Phí học liệu, học phẩm";
  // worksheet.getCell(6, 10).value = "Phí bảo trì CSVC";
  // worksheet.getCell(6, 11).value = "Học phí ôn thi tốt nghiệp";
  // worksheet.getCell(6, 12).value = "Phí thi lại";
  // worksheet.getCell(6, 13).value = "Phí đưa đón học sinh";
  // worksheet.getCell(6, 14).value = "Phí quản lý HS ngoài giờ";
  // worksheet.getCell(6, 15).value = "Phí học tập trải nghiệm, THTT";
  // worksheet.getCell(6, 16).value = "Phí KSK, làm thẻ HS";
  // worksheet.getCell(6, 17).value = "Phí/ học phí khác ";
  // worksheet.getCell(6, 18).value = "Tổng tiền thu phí, học phí ";
  // worksheet.getCell(6, 19).value = "Số vé thu T… /202…";
  // worksheet.getCell(6, 20).value = "Tiền ăn bán trú";
  // worksheet.getCell(6, 21).value = "Bảo hiểm y tế";
  // worksheet.getCell(6, 22).value = "Đồng phục";
  // worksheet.getCell(6, 23).value = "Tiền sách, vở ghi";
  // worksheet.getCell(6, 24).value = "Vé gửi xe";
  // worksheet.getCell(6, 25).value = "Khoản thu hộ khác ";
  // worksheet.getCell(6, 26).value = "Tổng tiền thu hộ";
  // worksheet.getCell(6, 27).value = "Tổng các khoản tiền thu";

  worksheet.getCell(6, 1).alignment = {
    wrapText: true,
    vertical: "middle",
    horizontal: "center",
  };
  worksheet.getCell(6, 2).alignment = {
    wrapText: true,
    vertical: "middle",
    horizontal: "center",
  };
  worksheet.getCell(6, 3).alignment = {
    wrapText: true,
    vertical: "middle",
    horizontal: "center",
  };
  worksheet.getCell(6, 4).alignment = {
    wrapText: true,
    vertical: "middle",
    horizontal: "center",
  };
  worksheet.getCell(6, 5).alignment = {
    wrapText: true,
    vertical: "middle",
    horizontal: "center",
  };
  worksheet.getCell(6, 6).alignment = {
    wrapText: true,
    vertical: "middle",
    horizontal: "center",
  };
  worksheet.getCell(6, 7).alignment = {
    wrapText: true,
    vertical: "middle",
    horizontal: "center",
  };
  worksheet.getCell(6, 8).alignment = {
    wrapText: true,
    vertical: "middle",
    horizontal: "center",
  };
  worksheet.getCell(6, 9).alignment = {
    wrapText: true,
    vertical: "middle",
    horizontal: "center",
  };
  worksheet.getCell(6, 10).alignment = {
    wrapText: true,
    vertical: "middle",
    horizontal: "center",
  };
  worksheet.getCell(6, 11).alignment = {
    wrapText: true,
    vertical: "middle",
    horizontal: "center",
  };
  worksheet.getCell(6, 12).alignment = {
    wrapText: true,
    vertical: "middle",
    horizontal: "center",
  };
  worksheet.getCell(6, 13).alignment = {
    wrapText: true,
    vertical: "middle",
    horizontal: "center",
  };
  worksheet.getCell(6, 14).alignment = {
    wrapText: true,
    vertical: "middle",
    horizontal: "center",
  };
  worksheet.getCell(6, 15).alignment = {
    wrapText: true,
    vertical: "middle",
    horizontal: "center",
  };
  worksheet.getCell(6, 16).alignment = {
    wrapText: true,
    vertical: "middle",
    horizontal: "center",
  };
  worksheet.getCell(6, 17).alignment = {
    wrapText: true,
    vertical: "middle",
    horizontal: "center",
  };
  worksheet.getCell(6, 18).alignment = {
    wrapText: true,
    vertical: "middle",
    horizontal: "center",
  };
  worksheet.getCell(6, 19).alignment = {
    wrapText: true,
    vertical: "middle",
    horizontal: "center",
  };
  worksheet.getCell(6, 20).alignment = {
    wrapText: true,
    vertical: "middle",
    horizontal: "center",
  };
  worksheet.getCell(6, 21).alignment = {
    wrapText: true,
    vertical: "middle",
    horizontal: "center",
  };
  worksheet.getCell(6, 22).alignment = {
    wrapText: true,
    vertical: "middle",
    horizontal: "center",
  };
  worksheet.getCell(6, 23).alignment = {
    wrapText: true,
    vertical: "middle",
    horizontal: "center",
  };
  worksheet.getCell(6, 24).alignment = {
    wrapText: true,
    vertical: "middle",
    horizontal: "center",
  };
  worksheet.getCell(6, 25).alignment = {
    wrapText: true,
    vertical: "middle",
    horizontal: "center",
  };
  worksheet.getCell(6, 26).alignment = {
    wrapText: true,
    vertical: "middle",
    horizontal: "center",
  };
  worksheet.getCell(6, 27).alignment = {
    wrapText: true,
    vertical: "middle",
    horizontal: "center",
  };

  worksheet.getCell(6, 1).border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };
  worksheet.getCell(6, 2).border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };
  worksheet.getCell(6, 3).border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };
  worksheet.getCell(6, 4).border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };
  worksheet.getCell(6, 5).border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };
  worksheet.getCell(6, 6).border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };
  worksheet.getCell(6, 7).border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };
  worksheet.getCell(6, 8).border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };
  worksheet.getCell(6, 9).border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };
  worksheet.getCell(6, 10).border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };
  worksheet.getCell(6, 11).border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };
  worksheet.getCell(6, 12).border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };
  worksheet.getCell(6, 13).border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };
  worksheet.getCell(6, 14).border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };
  worksheet.getCell(6, 15).border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };
  worksheet.getCell(6, 16).border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };
  worksheet.getCell(6, 17).border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };
  worksheet.getCell(6, 18).border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };
  worksheet.getCell(6, 19).border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };
  worksheet.getCell(6, 20).border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };
  worksheet.getCell(6, 21).border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };
  worksheet.getCell(6, 22).border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };
  worksheet.getCell(6, 23).border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };
  worksheet.getCell(6, 24).border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };
  worksheet.getCell(6, 25).border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };
  worksheet.getCell(6, 26).border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };
  worksheet.getCell(6, 27).border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };

  worksheet.getCell(6, 1).font = { bold: true, name: "Times New Roman" };
  worksheet.getCell(6, 2).font = { bold: true, name: "Times New Roman" };
  worksheet.getCell(6, 3).font = { bold: true, name: "Times New Roman" };
  worksheet.getCell(6, 4).font = {
    bold: true,
    name: "Times New Roman",
    // color: { argb: "FF0000" },
  };
  worksheet.getCell(6, 5).font = {
    bold: true,
    name: "Times New Roman",
    // color: { argb: "3366FF" },
  };
  worksheet.getCell(6, 6).font = { bold: true, name: "Times New Roman" };
  worksheet.getCell(6, 7).font = { bold: true, name: "Times New Roman" };
  worksheet.getCell(6, 8).font = { bold: true, name: "Times New Roman" };
  worksheet.getCell(6, 9).font = { bold: true, name: "Times New Roman" };
  worksheet.getCell(6, 10).font = { bold: true, name: "Times New Roman" };
  worksheet.getCell(6, 11).font = { bold: true, name: "Times New Roman" };
  worksheet.getCell(6, 12).font = { bold: true, name: "Times New Roman" };
  worksheet.getCell(6, 13).font = {
    bold: true,
    name: "Times New Roman",
    // color: { argb: "FF00FF" },
  };
  worksheet.getCell(6, 14).font = {
    bold: true,
    name: "Times New Roman",
    // color: { argb: "FF00FF" },
  };
  worksheet.getCell(6, 15).font = { bold: true, name: "Times New Roman" };
  worksheet.getCell(6, 16).font = { bold: true, name: "Times New Roman" };
  worksheet.getCell(6, 17).font = { bold: true, name: "Times New Roman" };
  worksheet.getCell(6, 18).font = {
    bold: true,
    name: "Times New Roman",
    // color: { argb: "3366FF" },
  };
  worksheet.getCell(6, 19).font = {
    bold: true,
    name: "Times New Roman",
    // color: { argb: "3366FF" },
  };
  worksheet.getCell(6, 20).font = { bold: true, name: "Times New Roman" };
  worksheet.getCell(6, 21).font = { bold: true, name: "Times New Roman" };
  worksheet.getCell(6, 22).font = { bold: true, name: "Times New Roman" };
  worksheet.getCell(6, 23).font = { bold: true, name: "Times New Roman" };
  worksheet.getCell(6, 24).font = { bold: true, name: "Times New Roman" };
  worksheet.getCell(6, 25).font = { bold: true, name: "Times New Roman" };
  worksheet.getCell(6, 26).font = {
    bold: true,
    name: "Times New Roman",
    // color: { argb: "3366FF" },
  };
  worksheet.getCell(6, 27).font = { bold: true, name: "Times New Roman" };

  const buf = await workbook.xlsx.writeBuffer();

  saveAs(new Blob([buf]), "Bang-ke-bien-lai-thu.xlsx");

  // return (
  //   <div className="hidden">
  //     <div className={`flex flex-col ${times.className}`} ref={secondPrintRef}>
  //       <style type="text/css" media="print">
  //         {"@page { size: A4 landscape !important;  margin: 10px;}"}
  //       </style>
  //       <div className="flex flex-col">
  //         {/* <p className="text-[12px]">TRƯỜNG TH&THCS HỮU NGHỊ QUỐC TẾ</p> */}
  //         <p className="text-[24px] font-semibold text-center">
  //           BẢNG KÊ BIÊN LAI THU TIỀN
  //         </p>
  //         <p className="text-[16px]">Hình thức thu: Tiền mặt</p>
  //         <p className="text-[16px]">
  //           Từ ngày ….. tháng ….. năm …. đến ngày …. tháng ….. năm ….
  //         </p>
  //         <div className="mt-[4px]"></div>
  //       </div>
  //     </div>
  //   </div>
  // );
};

// function sumDuplicated(arr) {
//   return arr.reduce((acc, curr) => {
//     const objInAcc = acc.find(
//       (o) =>
//         o.expected_revenue.revenue.revenue_group.id ===
//         curr.expected_revenue.revenue.revenue_group.id
//     );
//     if (objInAcc)
//       return [
//         ...acc.map((item) =>
//           item.expected_revenue.revenue.revenue_group.id ===
//           curr.expected_revenue.revenue.revenue_group.id
//             ? {
//                 ...item,
//                 amount_collected: item.amount_collected + curr.amount_collected,
//               }
//             : item
//         ),
//       ];
//     else return [...acc, curr];
//   }, []);
// }

const RowTable = ({ data }) => {
  const { config } = useContext(listContext);
  return (
    <tr className="hover">
      <td>{data.receipt_code}</td>
      <td>{data.code}</td>
      <td>{`${data.student.first_name} ${data.student.last_name}`}</td>
      <td>{numberWithCommas(data.amount_collected, config)}</td>
      <td>{moment.unix(data.start_at).format("DD/MM/yyyy HH:mm:ss")}</td>
      <td>{data.canceled && "✓"}</td>
      <td></td>
    </tr>
  );
};

const ListReceipt = ({
  billReceipt,
  condition,
  setBillReceipt,
  mutating,
  setMutating,
  selected,
}) => {
  const queryClient = useQueryClient();
  const { selectPresent, preBill, permission, revenueGroup, bill } =
    useContext(listContext);
  const { getToken } = useAuth();
  const { user } = useUser();
  const printRef = useRef();
  // const secondPrintRef = useRef();

  // const handleSecondPrint = useReactToPrint({
  //   content: () => secondPrintRef.current,
  // });

  const { data, isFetching, isLoading, isRefetching } = useQuery({
    queryKey: [`searchReceipt`, condition],
    queryFn: async () =>
      meilisearchReportReceiptOneGet(await meilisearchGetToken(), condition),
  });

  useEffect(() => {
    if (data?.results) {
      setBillReceipt((pre) => ({
        ...pre,
        nowMoney: data.results.reduce(
          (total, curr) => total + curr.amount_collected,
          0
        ),
      }));
    }
  }, [data]);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    onAfterPrint: () => SecondPrintComponent(data.results, revenueGroup),
  });

  const mutation = useMutation({
    mutationFn: async (objects) =>
      createBillReceipt(
        await getToken({
          template: process.env.NEXT_PUBLIC_TEMPLATE_USER,
        }),
        objects
      ),
    onSuccess: () => {
      handlePrint();
      setMutating(false);
      setBillReceipt({
        payer: "",
        location: "",
        bill_name: "",
        description: "",
      });
      queryClient.invalidateQueries(["get_pre_bill"]);
      toast.success("Lập phiếu thu thành công!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        theme: "light",
      });
    },
    onError: () => {
      setMutating(false);
      toast.error("Lập phiếu thu không thành công!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        theme: "light",
      });
    },
  });
  const handleOnClick = useCallback(() => {
    const objects = {
      amount_collected: parseInt(billReceipt.nowMoney),
      batch_id: selectPresent.id,
      code: `PT${createCode(bill.count_bill[0].bill_receipt)}`,
      created_by: user.id,
      location: billReceipt.location,
      name: billReceipt.bill_name,
      description: billReceipt.description.trim(),
      start_at: moment().format(),
      bill_formality_id: selected.value,
      payer: billReceipt.payer,
      bill_receipt_details: {
        data: data.results.map((item) => ({
          receipt_code: item.receipt_code,
          batch_id: selectPresent.id,
          amount_collected: item.amount_collected,
          created_by: user.id,
          start_at: moment().format(),
        })),
      },
    };
    setMutating(true);
    mutation.mutate(objects);
  }, [billReceipt, data]);

  return isFetching && isLoading ? (
    <span className="loading loading-spinner loading-lg self-center"></span>
  ) : (
    <>
      <div className="overflow-x-auto">
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              {/* <th></th> */}
              <th>Mã biên lai</th>
              <th>Mã học sinh</th>
              <th>Họ và tên học sinh</th>
              <th>Số tiền thu</th>
              <th>Ngày thu</th>
              <th>Đã huỷ</th>
              <th>
                <>
                  <div
                    className="tooltip items-center flex cursor-pointer w-fit tooltip-left"
                    data-tip="Tải lại danh sách tìm kiếm"
                    onClick={() =>
                      queryClient.invalidateQueries([
                        `searchReceipt`,
                        condition,
                      ])
                    }
                  >
                    <TbReload size={30} />
                  </div>
                </>
              </th>
            </tr>
          </thead>
          <tbody>
            {data.results.length === 0 ? (
              <tr>
                <td colSpan={6} className=" text-center">
                  Không tìm thấy kết quả
                </td>
              </tr>
            ) : (
              data.results
                .sort((a, b) => a.start_at - b.start_at)
                .map((item) => (
                  <RowTable
                    key={item.receipt_code}
                    data={item}
                    isRefetching={isRefetching}
                  />
                ))
            )}
          </tbody>
        </table>
      </div>
      {/* <button onClick={() => handleSecondPrint()} className="btn w-fit">
        In
      </button> */}
      {permission === process.env.NEXT_PUBLIC_PERMISSION_READ_EDIT ? (
        billReceipt.payer.trim() &&
        billReceipt.location.trim() &&
        billReceipt.bill_name.trim() &&
        billReceipt.nowMoney &&
        data.results.length ? (
          mutating || isFetching ? (
            <span className="loading loading-spinner loading-sm bg-primary self-center"></span>
          ) : (
            <button
              className="btn w-fit self-center"
              onClick={() => handleOnClick()}
            >
              Hoàn thành
            </button>
          )
        ) : (
          <></>
        )
      ) : (
        <></>
      )}
      <PrintComponent
        printRef={printRef}
        billReceipt={billReceipt}
        preBill={preBill}
      />
    </>
  );
};

export default ListReceipt;
