"use client";

import {
  meilisearchGetToken,
  meilisearchReductionGet,
} from "@/utils/funtionApi";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState, useEffect } from "react";
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

function numberWithCommas(x, config) {
  return x
    .toString()
    .replace(
      /\B(?=(\d{3})+(?!\d))/g,
      config.result[0].config.numberComma.value
    );
}

const handleExportExcel = async (reduction, present, school_year) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(
    "DANH SÁCH HỌC SINH ĐƯỢC HƯỞNG ƯU ĐÃI, MIỄN GIẢM"
  );

  worksheet.mergeCells("B1:C1");
  const tentruong = worksheet.getCell("B1");
  tentruong.value = "TRƯỜNG TH&THCS HỮU NGHỊ QUỐC TẾ";
  tentruong.font = { name: "Times New Roman", size: 11 };
  tentruong.alignment = { vertical: "middle", horizontal: "center" };

  worksheet.mergeCells("C2:J2");
  const titleCell = worksheet.getCell("G2");
  titleCell.value = "DANH SÁCH HỌC SINH ĐƯỢC HƯỞNG ƯU ĐÃI, MIỄN GIẢM";
  titleCell.font = { name: "Times New Roman", size: 16, bold: true };
  titleCell.alignment = { vertical: "middle", horizontal: "center" };

  worksheet.mergeCells("C3:J3");
  const Ghichu = worksheet.getCell("G3");
  Ghichu.value = "(Theo học sinh)";
  Ghichu.font = {
    name: "Times New Roman",
    size: 14,
    color: { argb: "FF0000" },
  };
  Ghichu.alignment = { vertical: "middle", horizontal: "center" };

  worksheet.mergeCells("C4:J4");
  const Taingay = worksheet.getCell("G4");
  Taingay.value = `Tại ngày ${moment().date()} Tháng ${
    moment().month() + 1
  } Năm ${moment().year()}`;
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
    { key: "col7", width: 10 },
    { key: "col8", width: 30 },
    { key: "col9", width: 10 },
    { key: "col10", width: 30 },
    { key: "col11", width: 10 },
    { key: "col12", width: 30 },
    { key: "col13", width: 30 },
  ];
  worksheet.getCell(6, 1).value = "STT";
  worksheet.getCell("A6").border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };
  worksheet.getCell(6, 2).value = "Mã học sinh";
  worksheet.getCell(6, 3).value = "Họ và tên học sinh";
  worksheet.getCell(6, 4).value = "Ngày sinh";
  worksheet.getCell(6, 5).value = "Lớp";
  worksheet.getCell(6, 6).value = "Mã lớp";
  worksheet.getCell(6, 7).value = "% ưu đãi học phí";
  worksheet.getCell(6, 8).value = "Số tiền ưu đãi học phí";
  worksheet.getCell(6, 9).value = "% giảm chính sách";
  worksheet.getCell(6, 10).value = "Số tiền giảm cho đối tượng chính sách";
  worksheet.getCell(6, 11).value = "% giảm do đóng học phí cả năm";
  worksheet.getCell(6, 12).value = "Số tiền giảm do đóng học phí cả năm";
  worksheet.getCell(
    6,
    13
  ).value = `Tổng ưu đãi, miễn giảm kỳ ${present.batch} năm ${school_year}`;

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

  worksheet.getCell("A6").border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
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

  worksheet.getCell(6, 1).font = { bold: true, name: "Times New Roman" };
  worksheet.getCell(6, 2).font = { bold: true, name: "Times New Roman" };
  worksheet.getCell(6, 3).font = { bold: true, name: "Times New Roman" };
  worksheet.getCell(6, 4).font = { bold: true, name: "Times New Roman" };
  worksheet.getCell(6, 5).font = { bold: true, name: "Times New Roman" };
  worksheet.getCell(6, 6).font = { bold: true, name: "Times New Roman" };
  worksheet.getCell(6, 7).font = {
    bold: true,
    name: "Times New Roman",
    color: { argb: "FF0000" },
  };
  worksheet.getCell(6, 8).font = { bold: true, name: "Times New Roman" };
  worksheet.getCell(6, 9).font = {
    bold: true,
    name: "Times New Roman",
    color: { argb: "FF0000" },
  };
  worksheet.getCell(6, 10).font = { bold: true, name: "Times New Roman" };
  worksheet.getCell(6, 11).font = {
    bold: true,
    name: "Times New Roman",
    color: { argb: "FF0000" },
  };
  worksheet.getCell(6, 12).font = { bold: true, name: "Times New Roman" };
  worksheet.getCell(6, 13).font = {
    bold: true,
    name: "Times New Roman",
    color: { argb: "3366FF" },
  };

  reduction.results.forEach((item, index) => {
    worksheet.addRow([
      index + 1,
      item.student_code,
      `${item.first_name} ${item.last_name}`,
      item.date_of_birth.split("-").reverse().join("-"),
      item.class_code[0],
      item.class_code.substring(1),
      item.ud_ratio * 100,
      item.ud_value,
      item.cs_ratio * 100,
      item.cs_value,
      item.tt_ratio * 100,
      item.tt_value,
      item.total,
    ]);
  });

  worksheet.addRow([
    "",
    "",
    "Tổng cộng",
    "",
    "",
    "",
    "",
    reduction.results.reduce((t, c) => t + c.ud_value, 0),
    "",
    reduction.results.reduce((t, c) => t + c.cs_value, 0),
    "",
    reduction.results.reduce((t, c) => t + c.tt_value, 0),
    reduction.results.reduce((t, c) => t + c.total, 0),
  ]);

  // worksheet.addRow({
  //   col3: "Họ và tên học sinh",
  // });

  const buf = await workbook.xlsx.writeBuffer();

  saveAs(new Blob([buf]), "danh-sach-hs-mien-giam.xlsx");
};

const TableView = ({ reduction, isLoading, config, present, school_year }) => {
  const [page, setPage] = useState(1);
  const rowsPerPage = Number(config?.result[0].config.page.value);

  const pages = Math.ceil(reduction?.results?.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return reduction?.results?.slice(start, end);
  }, [page, reduction]);

  useEffect(() => {
    setPage(1);
  }, [reduction]);

  return (
    <Table
      aria-label="reduction table"
      // removeWrapper
      className="h-[450px]"
      isStriped
      isHeaderSticky
      bottomContent={
        !isLoading &&
        items && (
          <div className="flex w-full justify-center">
            <Pagination
              isCompact
              showControls
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
        <TableColumn>mã lớp</TableColumn>
        <TableColumn>& ưu đãi học phí</TableColumn>
        <TableColumn>Số tiền ưu đãi học phí</TableColumn>
        <TableColumn>% giảm chính sách</TableColumn>
        <TableColumn>Số tiền giảm cho đối tượng chính sách</TableColumn>
        <TableColumn>% giảm do đóng HP cả năm</TableColumn>
        <TableColumn>Số tiền giảm do đóng HP cả năm</TableColumn>
        <TableColumn>
          Tổng ưu đãi, miễn giảm kỳ {present.batch} năm {school_year}
        </TableColumn>
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
              <TableCell className="whitespace-nowrap">{`${item.first_name} ${item.last_name}`}</TableCell>
              <TableCell className="whitespace-nowrap">
                {item.date_of_birth.split("-").reverse().join("-")}
              </TableCell>
              <TableCell>{item.class_code[0]}</TableCell>
              <TableCell>{item.class_code.substring(1)}</TableCell>
              <TableCell>{item.ud_ratio * 100}</TableCell>
              <TableCell>{numberWithCommas(item.ud_value, config)}</TableCell>
              <TableCell>{item.cs_ratio * 100}</TableCell>
              <TableCell>{numberWithCommas(item.cs_value, config)}</TableCell>
              <TableCell>{item.tt_ratio * 100}</TableCell>
              <TableCell>{numberWithCommas(item.tt_value, config)}</TableCell>
              <TableCell>{numberWithCommas(item.total, config)}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

const Content = ({ present, config }) => {
  const selectPresent = useMemo(
    () => present.result[0].batchs.find((item) => item.is_active === true),
    []
  );

  const {
    data: reduction,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["reduction", selectPresent.id],
    queryFn: async () =>
      meilisearchReductionGet(
        await meilisearchGetToken(),
        `batch_id = ${selectPresent.id} AND (ud_ratio != "0.00" OR cs_ratio != "0.00" OR tt_ratio != "0.00")`
      ),
  });

  // console.log(reduction);
  return (
    <div className="flex flex-col gap-5 justify-center">
      <h5 className="text-center">
        Danh sách học sinh được ưu đãi, miễn giảm học phí
      </h5>
      <div className={`justify-center items-center flex gap-1 `}>
        <h6>
          Học kỳ {selectPresent.batch} - Năm học {present.result[0].school_year}
        </h6>
      </div>
      <button
        disabled={reduction?.results.length === 0}
        className="btn w-fit self-end"
        onClick={() =>
          handleExportExcel(
            reduction,
            selectPresent,
            present.result[0].school_year
          )
        }
      >
        Xuất Excel
      </button>
      <TableView
        config={config}
        reduction={reduction}
        present={selectPresent}
        school_year={present.result[0].school_year}
        isLoading={isFetching && isLoading}
      />
    </div>
  );
};

export default Content;
