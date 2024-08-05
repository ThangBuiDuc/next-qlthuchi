"use client";
import {
  meilisearchGetToken,
  meilisearchReportReceiptOneGet,
} from "@/utils/funtionApi";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@nextui-org/table";
import { Spinner } from "@nextui-org/spinner";

function mergeElementArray(arr) {
  // console.log(arr);
  let arrReturn = [];
  arr
    ?.sort((a, b) => (a.start_at > b.start_at ? -1 : 1))
    .forEach((item) => {
      let index = arrReturn.findIndex((el) => el.code === item.code);
      if (index === -1) {
        arrReturn.push(item);
      } else {
        arrReturn[index] = {
          ...arrReturn[index],
          amount_collected:
            arrReturn[index].amount_collected + item.amount_collected,
          receipt_details: arrReturn[index].receipt_details.map((el1) => {
            const el2 = item.receipt_details.find((el) => el.id === el1.id);
            return {
              id: el1.id,
              revenue_type_id: el1.revenue_type_id,
              name: el1.name,
              position: el1.position,
              revenue_group_id: el1.revenue_group_id,
              amount_collected: el1.amount_collected + el2.amount_collected,
            };
          }),
        };
      }
    });
  return arrReturn;
}

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

const TableView = ({ isLoading, data, revenueGroup }) => {
  return (
    <Table
      aria-label="One Receipt Table"
      //   removeWrapper
      className="max-h-[450px]"
      isStriped
      isHeaderSticky
    >
      <TableHeader>
        <TableColumn>STT</TableColumn>
        <TableColumn>Mã học sinh</TableColumn>
        <TableColumn>Họ và tên học sinh</TableColumn>
        <TableColumn>Ngày sinh</TableColumn>
        <TableColumn>Lớp</TableColumn>
        <TableColumn>Mã lớp</TableColumn>
        {revenueGroup
          .sort((a, b) => a.position - b.position)
          .map((item) => (
            <TableColumn key={item.id}>{item.name}</TableColumn>
          ))}
      </TableHeader>
      <TableBody
        emptyContent={"Không tìm thấy kết quả"}
        loadingContent={<Spinner color="primary" />}
        isLoading={isLoading}
      >
        {data.map((item, index) => (
          <TableRow key={index}>
            <TableCell>{++index}</TableCell>
            <TableCell>{item.student.student_code}</TableCell>
            <TableCell>{`${item.student.first_name} ${item.student.last_name}`}</TableCell>
            <TableCell>
              {item.student.dob.split("-").reverse().join("-")}
            </TableCell>
            <TableCell>{item.student.class_level_code}</TableCell>
            <TableCell>{item.student.class_code}</TableCell>
            {sumArrayObjectsById(item.receipt_details)
              .sort((a, b) => a.position - b.position)
              .map((item) => (
                <TableCell key={item.id}>{item.amount_collected}</TableCell>
              ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

const handleExcel = async (selectedFilter, revenueGroup, data) => {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("TH da thu nhieu hs", {
    pageSetup: { paperSize: 9, orientation: "landscape" },
  });

  sheet.mergeCells("B1:C1");
  const tentruong = sheet.getCell("B1");
  tentruong.value = "TRƯỜNG TH&THCS HỮU NGHỊ QUỐC TẾ";
  tentruong.font = { name: "Times New Roman", size: 11 };
  tentruong.alignment = { vertical: "middle", horizontal: "center" };

  sheet.mergeCells("C2:J2");
  const titleCell = sheet.getCell("G2");
  titleCell.value = "TỔNG HỢP CÁC KHOẢN ĐÃ THU";
  titleCell.font = { name: "Times New Roman", size: 16, bold: true };
  titleCell.alignment = { vertical: "middle", horizontal: "center" };

  sheet.mergeCells("C3:J3");
  const Ghichu = sheet.getCell("G3");
  Ghichu.value = "(Theo nhiều học sinh)";
  Ghichu.font = {
    name: "Times New Roman",
    size: 14,
    color: { argb: "FF0000" },
  };
  Ghichu.alignment = { vertical: "middle", horizontal: "center" };

  sheet.mergeCells("C4:J4");
  const Taingay = sheet.getCell("G4");
  Taingay.value = "Từ ngày ….. tháng ….. năm …. đến ngày …. tháng ….. năm ….";
  Taingay.font = {
    name: "Times New Roman",
    size: 14,
    color: { argb: "#CC0000" },
  };
  Taingay.alignment = { vertical: "middle", horizontal: "center" };

  const header = revenueGroup.sort((a, b) => a.position - b.position);
  sheet.addRow([]);
  sheet.addRow([
    "STT",
    "Mã học sinh",
    "Họ và tên học sinh",
    "Ngày sinh",
    "lớp",
    "Mã lớp",
    ...header.map((item) => item.name),
    "Tổng tiền phí, học phí thu",
    "Tổng tiền thu hộ thu",
    "Tổng tiền thu",
  ]);

  // console.log(
  //   sumArrayObjectsById(data.data.results[0].receipts).sort(
  //     (a, b) => a.position - b.position
  //   )
  // );

  data.forEach((item, index) => {
    // console.log(item);
    const receipts = item.receipt_details.map((el) =>
      el.amount_spend === null ? { ...el, amount_spend: 0 } : el
    );
    sheet.addRow([
      ++index,
      item.student.student_code,
      `${item.student.first_name} ${item.student.last_name}`,
      `${item.student.dob.split("-").reverse().join("-")}`,
      item.student.class_level_code,
      item.student.class_code,
      ...sumArrayObjectsById(receipts)
        .sort((a, b) => a.position - b.position)
        .map((item) =>
          item.amount_collected != null ? item.amount_collected : 0
        ),
      sumArrayObjectsById(receipts)
        .filter((item) => item.amount_collected != null)
        .reduce(
          (total, curr) =>
            curr.revenue_type_id === 1 ? total + curr.amount_collected : total,
          0
        ),
      sumArrayObjectsById(receipts)
        .filter((item) => item.amount_collected != null)
        .reduce(
          (total, curr) =>
            curr.revenue_type_id === 2 ? total + curr.amount_collected : total,
          0
        ),
      sumArrayObjectsById(receipts)
        .filter((item) => item.amount_collected != null)
        .reduce((total, curr) => total + curr.amount_collected, 0),
    ]);
  });

  let lastRow = new Array(sheet.columnCount);
  lastRow[2] = "Tổng cộng";

  for (let i = 7; i <= sheet.columnCount; i++) {
    let col = sheet.getColumn(i);
    let sum = 0;
    col.eachCell((cell, rowNumber) => {
      if (rowNumber >= 7) sum = sum + parseInt(cell.text);
    });
    lastRow[i] = sum;
  }

  sheet.addRow(lastRow);
  // Thêm dữ liệu vào bảng tính
  sheet.columns = [
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

  sheet.getCell(6, 1).alignment = {
    wrapText: true,
    vertical: "middle",
    horizontal: "center",
  };
  sheet.getCell(6, 2).alignment = {
    wrapText: true,
    vertical: "middle",
    horizontal: "center",
  };
  sheet.getCell(6, 3).alignment = {
    wrapText: true,
    vertical: "middle",
    horizontal: "center",
  };
  sheet.getCell(6, 4).alignment = {
    wrapText: true,
    vertical: "middle",
    horizontal: "center",
  };
  sheet.getCell(6, 5).alignment = {
    wrapText: true,
    vertical: "middle",
    horizontal: "center",
  };
  sheet.getCell(6, 6).alignment = {
    wrapText: true,
    vertical: "middle",
    horizontal: "center",
  };
  sheet.getCell(6, 7).alignment = {
    wrapText: true,
    vertical: "middle",
    horizontal: "center",
  };
  sheet.getCell(6, 8).alignment = {
    wrapText: true,
    vertical: "middle",
    horizontal: "center",
  };
  sheet.getCell(6, 9).alignment = {
    wrapText: true,
    vertical: "middle",
    horizontal: "center",
  };
  sheet.getCell(6, 10).alignment = {
    wrapText: true,
    vertical: "middle",
    horizontal: "center",
  };
  sheet.getCell(6, 11).alignment = {
    wrapText: true,
    vertical: "middle",
    horizontal: "center",
  };
  sheet.getCell(6, 12).alignment = {
    wrapText: true,
    vertical: "middle",
    horizontal: "center",
  };
  sheet.getCell(6, 13).alignment = {
    wrapText: true,
    vertical: "middle",
    horizontal: "center",
  };
  sheet.getCell(6, 14).alignment = {
    wrapText: true,
    vertical: "middle",
    horizontal: "center",
  };
  sheet.getCell(6, 15).alignment = {
    wrapText: true,
    vertical: "middle",
    horizontal: "center",
  };
  sheet.getCell(6, 16).alignment = {
    wrapText: true,
    vertical: "middle",
    horizontal: "center",
  };
  sheet.getCell(6, 17).alignment = {
    wrapText: true,
    vertical: "middle",
    horizontal: "center",
  };
  sheet.getCell(6, 18).alignment = {
    wrapText: true,
    vertical: "middle",
    horizontal: "center",
  };
  sheet.getCell(6, 19).alignment = {
    wrapText: true,
    vertical: "middle",
    horizontal: "center",
  };
  sheet.getCell(6, 20).alignment = {
    wrapText: true,
    vertical: "middle",
    horizontal: "center",
  };
  sheet.getCell(6, 21).alignment = {
    wrapText: true,
    vertical: "middle",
    horizontal: "center",
  };
  sheet.getCell(6, 22).alignment = {
    wrapText: true,
    vertical: "middle",
    horizontal: "center",
  };
  sheet.getCell(6, 23).alignment = {
    wrapText: true,
    vertical: "middle",
    horizontal: "center",
  };
  sheet.getCell(6, 24).alignment = {
    wrapText: true,
    vertical: "middle",
    horizontal: "center",
  };
  sheet.getCell(6, 25).alignment = {
    wrapText: true,
    vertical: "middle",
    horizontal: "center",
  };
  sheet.getCell(6, 26).alignment = {
    wrapText: true,
    vertical: "middle",
    horizontal: "center",
  };
  sheet.getCell(6, 27).alignment = {
    wrapText: true,
    vertical: "middle",
    horizontal: "center",
  };

  // sheet.getCell('A5').border = {
  //   top: {style:'thin'},
  //   left: {style:'thin'},
  //   bottom: {style:'thin'},
  //   right: {style:'thin'}
  // };

  sheet.getCell(6, 1).border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };
  sheet.getCell(6, 2).border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };
  sheet.getCell(6, 3).border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };
  sheet.getCell(6, 4).border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };
  sheet.getCell(6, 5).border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };
  sheet.getCell(6, 6).border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };
  sheet.getCell(6, 7).border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };
  sheet.getCell(6, 8).border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };
  sheet.getCell(6, 9).border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };
  sheet.getCell(6, 10).border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };
  sheet.getCell(6, 11).border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };
  sheet.getCell(6, 12).border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };
  sheet.getCell(6, 13).border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };
  sheet.getCell(6, 14).border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };
  sheet.getCell(6, 15).border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };
  sheet.getCell(6, 16).border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };
  sheet.getCell(6, 17).border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };
  sheet.getCell(6, 18).border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };
  sheet.getCell(6, 19).border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };
  sheet.getCell(6, 20).border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };
  sheet.getCell(6, 21).border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };
  sheet.getCell(6, 22).border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };
  sheet.getCell(6, 23).border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };
  sheet.getCell(6, 24).border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };
  sheet.getCell(6, 25).border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };
  sheet.getCell(6, 26).border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };
  sheet.getCell(6, 27).border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };

  sheet.getCell(6, 1).font = { bold: true, name: "Times New Roman" };
  sheet.getCell(6, 2).font = { bold: true, name: "Times New Roman" };
  sheet.getCell(6, 3).font = { bold: true, name: "Times New Roman" };
  sheet.getCell(6, 4).font = { bold: true, name: "Times New Roman" };
  sheet.getCell(6, 5).font = { bold: true, name: "Times New Roman" };
  sheet.getCell(6, 6).font = { bold: true, name: "Times New Roman" };
  sheet.getCell(6, 7).font = { bold: true, name: "Times New Roman" };
  sheet.getCell(6, 8).font = { bold: true, name: "Times New Roman" };
  sheet.getCell(6, 9).font = { bold: true, name: "Times New Roman" };
  sheet.getCell(6, 10).font = { bold: true, name: "Times New Roman" };
  sheet.getCell(6, 11).font = { bold: true, name: "Times New Roman" };
  sheet.getCell(6, 12).font = { bold: true, name: "Times New Roman" };
  sheet.getCell(6, 13).font = { bold: true, name: "Times New Roman" };
  sheet.getCell(6, 14).font = {
    bold: true,
    name: "Times New Roman",
    color: { argb: "FF00FF" },
  };
  sheet.getCell(6, 15).font = {
    bold: true,
    name: "Times New Roman",
    color: { argb: "FF00FF" },
  };
  sheet.getCell(6, 16).font = { bold: true, name: "Times New Roman" };
  sheet.getCell(6, 17).font = { bold: true, name: "Times New Roman" };
  sheet.getCell(6, 18).font = { bold: true, name: "Times New Roman" };
  sheet.getCell(6, 19).font = {
    bold: true,
    name: "Times New Roman",
    color: { argb: "3366FF" },
  };
  sheet.getCell(6, 20).font = { bold: true, name: "Times New Roman" };
  sheet.getCell(6, 21).font = { bold: true, name: "Times New Roman" };
  sheet.getCell(6, 22).font = { bold: true, name: "Times New Roman" };
  sheet.getCell(6, 23).font = { bold: true, name: "Times New Roman" };
  sheet.getCell(6, 24).font = { bold: true, name: "Times New Roman" };
  sheet.getCell(6, 25).font = { bold: true, name: "Times New Roman" };
  sheet.getCell(6, 26).font = {
    bold: true,
    name: "Times New Roman",
    color: { argb: "3366FF" },
  };
  sheet.getCell(6, 27).font = { bold: true, name: "Times New Roman" };

  sheet.getCell("A2").font = {
    bold: true,
    font: 14,
  };

  const buf = await workbook.xlsx.writeBuffer();

  saveAs(new Blob([buf]), "Tong-hop-da-thu-nhieu-hs.xlsx");
};

const SubContent = ({ revenueGroup, condition, config, selectedFilter }) => {
  //   console.log(revenueGroup);
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["report_receipt_one", condition],
    queryFn: async () =>
      meilisearchReportReceiptOneGet(await meilisearchGetToken(), condition, [
        "student",
        "amount_collected",
        "receipt_details",
      ]),
  });

  return (
    <>
      <button
        disabled={data?.results.length === 0}
        className="self-end btn w-fit"
        onClick={() =>
          handleExcel(
            selectedFilter,
            revenueGroup,
            mergeElementArray(data?.results)
          )
        }
      >
        Xuất Excel
      </button>
      <TableView
        isLoading={isLoading && isFetching}
        data={mergeElementArray(data?.results)}
        revenueGroup={revenueGroup}
        config={config}
      />
    </>
  );
};

export default SubContent;
