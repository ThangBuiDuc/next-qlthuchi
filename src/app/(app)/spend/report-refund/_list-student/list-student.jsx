"use client";

import { useContext, useState, useMemo, useEffect } from "react";
import { listContext } from "../content";
import StudentFilter from "@/app/_component/studentFilter";
import { useQuery } from "@tanstack/react-query";
import {
  meilisearchGetToken,
  meilisearchListRefundGet,
} from "@/utils/funtionApi";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@nextui-org/table";
import { Pagination } from "@nextui-org/pagination";
import { Spinner } from "@nextui-org/spinner";
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
        sumMap[id].next_batch_money += obj.next_batch_money; // Assuming the property to be summed is 'amount_collected'
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

const handleExportExcel = async (listRefund, revenueGroup) => {
  const header = revenueGroup.result.sort((a, b) => a.position - b.position);
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("BẢNG KÊ HOÀN TRẢ TIỀN THỪA");

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
  titleCell.value = "BẢNG KÊ HOÀN TRẢ TIỀN THỪA";
  titleCell.font = { name: "Times New Roman", size: 16, bold: true };
  titleCell.alignment = { vertical: "middle", horizontal: "center" };

  worksheet.mergeCells("C3:J3");
  const Ghichu = worksheet.getCell("G3");
  Ghichu.value = "(Theo nhiều học sinh)";
  Ghichu.font = {
    name: "Times New Roman",
    size: 14,
    color: { argb: "FF0000" },
  };
  Ghichu.alignment = { vertical: "middle", horizontal: "center" };

  worksheet.mergeCells("C4:J4");
  const Taingay = worksheet.getCell("G4");
  Taingay.value = `Tại ngày ${moment().date()} tháng ${
    moment().month() + 1
  } năm ${moment().year()}`;
  Taingay.font = {
    name: "Times New Roman",
    size: 14,
    color: { argb: "#CC0000" },
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
  // worksheet.getCell(6, 1).value = "STT";
  // worksheet.getCell(6, 2).value = "Mã học sinh";
  // worksheet.getCell(6, 3).value = "Họ và tên học sinh";
  // worksheet.getCell(6, 4).value = "Ngày tháng năm sinh";
  // worksheet.getCell(6, 5).value = "Lớp";
  // worksheet.getCell(6, 6).value = "Mã lớp";
  // worksheet.getCell(6, 7).value = "Học phí thực thu";
  // worksheet.getCell(6, 8).value = "Phí bán trú";
  // worksheet.getCell(6, 9).value = "Phí dự tuyển";
  // worksheet.getCell(6, 10).value = "Phí học liệu, học phẩm";
  // worksheet.getCell(6, 11).value = "Phí bảo trì CSVC";
  // worksheet.getCell(6, 12).value = "Học phí ôn thi tốt nghiệp";
  // worksheet.getCell(6, 13).value = "Phí thi lại";
  // worksheet.getCell(6, 14).value = "Phí đưa đón học sinh";
  // worksheet.getCell(6, 15).value = "Phí quản lý HS ngoài giờ";
  // worksheet.getCell(6, 16).value = "Phí học tập trải nghiệm, THTT";
  // worksheet.getCell(6, 17).value = "Phí KSK, làm thẻ HS";
  // worksheet.getCell(6, 18).value = "Phí/ học phí khác ";

  // worksheet.getCell(6, 20).value = "Tiền ăn bán trú";
  // worksheet.getCell(6, 21).value = "Bảo hiểm y tế";
  // worksheet.getCell(6, 22).value = "Đồng phục";
  // worksheet.getCell(6, 23).value = "Tiền sách, vở ghi";
  // worksheet.getCell(6, 24).value = "Vé gửi xe";
  // worksheet.getCell(6, 25).value = "Khoản thu hộ khác ";
  // worksheet.getCell(6, 19).value = "Tổng tiền phí, học phí hoàn trả";
  // worksheet.getCell(6, 26).value = "Tổng tiền thu hộ hoàn trả";
  // worksheet.getCell(6, 27).value = "Tổng tiền hoàn trả";
  worksheet.addRow([]);
  worksheet.addRow([
    "STT",
    "Mã học sinh",
    "Họ và tên học sinh",
    "Ngày tháng năm sinh",
    "Lớp",
    "Mã lớp",
    ...header.map((item) => item.name),
    "Tổng tiền thu phí, học phí hoàn trả",
    "Tổng tiền thu hộ hoàn trả",
    "Tổng tiền hoàn trả",
  ]);

  listRefund.forEach((item, index) => {
    worksheet.addRow([
      index + 1,
      item.student_code,
      `${item.first_name} ${item.last_name}`,
      `${item.date_of_birth.split("-").reverse().join("-")}`,
      item.class_code[0],
      item.class_code.substring(1),
      ...sumArrayObjectsById(item.expected_revenues)
        .sort((a, b) => a.position - b.position)
        .map((el) => el.next_batch_money * -1),
      sumArrayObjectsById(item.expected_revenues)
        .filter((el) => el.revenue_type_id === 1)
        .reduce(
          (total, curr) =>
            curr.revenue_type_id === 1
              ? total + curr.next_batch_money * -1
              : total,
          0
        ),
      sumArrayObjectsById(item.expected_revenues)
        .filter((el) => el.revenue_type_id === 2)
        .reduce(
          (total, curr) =>
            curr.revenue_type_id === 2
              ? total + curr.next_batch_money * -1
              : total,
          0
        ),

      item.expected_revenues.reduce((t, c) => t + c.next_batch_money * -1, 0),
    ]);
  });

  let lastRow = new Array(worksheet.columnCount);
  lastRow[3] = "Cộng";

  for (let i = 7; i <= worksheet.columnCount; i++) {
    let col = worksheet.getColumn(i);
    let sum = 0;
    col.eachCell((cell, rowNumber) => {
      if (rowNumber >= 7) sum = sum + parseInt(cell.text);
    });
    lastRow[i] = sum;
  }

  worksheet.addRow(lastRow);
  worksheet.addRow([]);
  worksheet.addRow([]);
  worksheet.addRow([
    ...new Array(25).fill(""),
    `Hải Phòng, ngày ${moment().date()} tháng ${
      moment().month() + 1
    } năm ${moment().year()}`,
  ]);

  worksheet.addRow([
    ...new Array(19).fill(""),
    "Thủ trưởng",
    "",
    "",
    "Kế toán trưởng",
    "",
    "Người lập",
  ]);

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
  worksheet.getCell(6, 4).font = { bold: true, name: "Times New Roman" };
  worksheet.getCell(6, 5).font = { bold: true, name: "Times New Roman" };
  worksheet.getCell(6, 6).font = { bold: true, name: "Times New Roman" };
  worksheet.getCell(6, 7).font = { bold: true, name: "Times New Roman" };
  worksheet.getCell(6, 8).font = { bold: true, name: "Times New Roman" };
  worksheet.getCell(6, 9).font = { bold: true, name: "Times New Roman" };
  worksheet.getCell(6, 10).font = { bold: true, name: "Times New Roman" };
  worksheet.getCell(6, 11).font = { bold: true, name: "Times New Roman" };
  worksheet.getCell(6, 12).font = { bold: true, name: "Times New Roman" };
  worksheet.getCell(6, 13).font = { bold: true, name: "Times New Roman" };
  worksheet.getCell(6, 14).font = {
    bold: true,
    name: "Times New Roman",
    color: { argb: "FF00FF" },
  };
  worksheet.getCell(6, 15).font = {
    bold: true,
    name: "Times New Roman",
    color: { argb: "FF00FF" },
  };
  worksheet.getCell(6, 16).font = { bold: true, name: "Times New Roman" };
  worksheet.getCell(6, 17).font = { bold: true, name: "Times New Roman" };
  worksheet.getCell(6, 18).font = { bold: true, name: "Times New Roman" };
  worksheet.getCell(6, 19).font = {
    bold: true,
    name: "Times New Roman",
    color: { argb: "3366FF" },
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
    color: { argb: "3366FF" },
  };
  worksheet.getCell(6, 27).font = { bold: true, name: "Times New Roman" };

  const buf = await workbook.xlsx.writeBuffer();

  saveAs(new Blob([buf]), "Bang-ke-hoan-tra-tien-thua.xlsx");
};

const TableView = ({
  listRefund,
  isLoading,
  config,
  selectedKeys,
  setSelectedKeys,
}) => {
  const [page, setPage] = useState(1);
  const rowsPerPage = Number(config?.result[0].config.page.value);

  const pages = Math.ceil(listRefund?.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return listRefund?.slice(start, end);
  }, [page, listRefund]);

  useEffect(() => {
    setPage(1);
  }, [listRefund]);

  return (
    <Table
      aria-label="list refund table"
      selectionMode="multiple"
      className="h-[450px]"
      // removeWrapper
      isStriped
      isHeaderSticky
      color="primary"
      selectedKeys={selectedKeys}
      onSelectionChange={setSelectedKeys}
      bottomContent={
        !isLoading &&
        items && (
          <div className="flex w-full justify-center">
            <Pagination
              isCompact
              showControls
              // showShadow
              color="primary"
              page={page}
              total={pages}
              onChange={(page) => setPage(page)}
            />
          </div>
        )
      }
    >
      <TableHeader>
        <TableColumn>STT</TableColumn>
        <TableColumn>Mã học sinh</TableColumn>
        <TableColumn>Họ và tên</TableColumn>
        <TableColumn>Ngày sinh</TableColumn>
        <TableColumn>Lớp</TableColumn>
      </TableHeader>
      <TableBody
        emptyContent="Không tìm thấy kết quả tìm kiếm!"
        loadingContent={<Spinner color="primary" />}
        isLoading={isLoading}
      >
        {items?.map((item, index) => {
          return (
            <TableRow key={item.student_code}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{item.student_code}</TableCell>
              <TableCell>{`${item.first_name} ${item.last_name}`}</TableCell>
              <TableCell>
                {item.date_of_birth.split("-").reverse().join("-")}
              </TableCell>
              <TableCell>{item.class_code}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

const ListStudent = () => {
  const { listSearch, config, selectPresent, revenueGroup } =
    useContext(listContext);
  const [selected, setSelected] = useState({
    school: null,
    class_level: null,
    class: null,
  });
  const [selectedKeys, setSelectedKeys] = useState(new Set([]));
  const {
    data: listRefund,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["listRefund", selected],
    queryFn: async () =>
      meilisearchListRefundGet(await meilisearchGetToken(), {
        ...selected,
        present: selectPresent,
      }),
    // enabled: Object.values(selected).some((el) => el),
  });

  // console.log(listRefund);
  return (
    <div className="flex flex-col gap-5 justify-center">
      <StudentFilter
        selected={selected}
        setSelected={setSelected}
        listSearch={listSearch}
        noQuery
      />
      <button
        disabled={selectedKeys.size === 0}
        className="btn w-fit self-end"
        onClick={() =>
          handleExportExcel(
            selectedKeys === "all"
              ? listRefund
              : listRefund.reduce(
                  (total, curr) =>
                    selectedKeys.has(curr.student_code)
                      ? [...total, curr]
                      : total,
                  []
                ),
            revenueGroup
          )
        }
      >
        Xuất Excel
      </button>
      <TableView
        isLoading={isLoading && isFetching}
        config={config}
        listRefund={listRefund}
        selectedKeys={selectedKeys}
        setSelectedKeys={setSelectedKeys}
      />
    </div>
  );
};

export default ListStudent;
