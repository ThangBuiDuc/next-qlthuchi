"use client";
import {
  meilisearchGetToken,
  meilisearchReportPaymentHistoryGet,
} from "@/utils/funtionApi";
import { useQuery } from "@tanstack/react-query";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import moment from "moment-timezone";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@nextui-org/table";
import { Spinner } from "@nextui-org/spinner";
import { useMemo, useState } from "react";
import { Pagination } from "@nextui-org/pagination";

function numberWithCommas(x, config) {
  return x
    .toString()
    .replace(
      /\B(?=(\d{3})+(?!\d))/g,
      config.result[0].config.numberComma.value
    );
}
const TableView = ({ data, config, isLoading }) => {
  const header = [
    ...new Map(
      data?.map((item) => [
        item["batch_id"],
        {
          batch_id: item.batch_id,
          batch: item.batch,
          school_year: item.school_year,
        },
      ])
    ).values(),
  ];

  const listStudent = [
    ...new Map(
      data?.map((item) => [
        item["student_code"],
        {
          student_code: item.student_code,
          first_name: item.first_name,
          last_name: item.last_name,
          class_code: item.class_code,
          date_of_birth: item.date_of_birth,
        },
      ])
    ).values(),
  ];

  const [page, setPage] = useState(1);
  const rowsPerPage = Number(config.result[0].config.page.value);

  const pages = Math.ceil(listStudent.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return listStudent.slice(start, end);
  }, [page, data]);

  return (
    // <div className="overflow-x-auto">
    <Table
      aria-label="payment history Table"
      className="max-h-[450px]"
      isStriped
      isHeaderSticky
      bottomContent={
        !isLoading && (
          <div className="flex w-full justify-center">
            <Pagination
              color="primary"
              isCompact
              showControls
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
        <TableColumn>Mã lớp</TableColumn>
        {header
          .reduce(
            (total, curr) => [
              ...total,
              `Ưu đãi, miễn giảm kỳ ${curr.batch} năm ${curr.school_year}`,
              `Số phải nộp kỳ ${curr.batch} năm ${curr.school_year}`,
              `Đã điều chỉnh kỳ ${curr.batch} năm ${curr.school_year}`,
              `Đã hoàn trả kỳ ${curr.batch} năm ${curr.school_year}`,
              `Số đã nộp kỳ ${curr.batch} năm ${curr.school_year}`,
              `Công nợ cuối kỳ ${curr.batch} năm ${curr.school_year}`,
            ],
            []
          )
          .map((item, index) => (
            <TableColumn key={index}>{item}</TableColumn>
          ))}
      </TableHeader>
      <TableBody
        isLoading={isLoading}
        loadingContent={<Spinner color="primary" />}
        emptyContent={"Không có dữ liệu!"}
      >
        {items?.map((item, index) => {
          return (
            <TableRow key={item.student_code}>
              <TableCell>{++index}</TableCell>
              <TableCell>{item.student_code}</TableCell>
              <TableCell className="whitespace-nowrap">{`${item.first_name} ${item.last_name}`}</TableCell>
              <TableCell className="whitespace-nowrap">
                {item.date_of_birth.split("-").reverse().join("-")}
              </TableCell>
              <TableCell>{item.class_code[0]}</TableCell>
              <TableCell>{item.class_code.substring(1)}</TableCell>
              {header
                .reduce((total, curr) => {
                  const detail = data.find(
                    (el) =>
                      el.student_code === item.student_code &&
                      el.batch_id === curr.batch_id
                  );
                  if (detail)
                    return [
                      ...total,
                      detail?.discount,
                      detail?.actual_amount_collected,
                      detail?.amount_edited,
                      detail?.amount_spend,
                      detail?.amount_collected,
                      detail?.next_batch_money,
                    ];

                  return [...total, 0, 0, 0, 0, 0, 0];
                }, [])
                .map((item, index) => (
                  <TableCell key={index}>
                    {numberWithCommas(item, config)}
                  </TableCell>
                ))}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
    // </div>
  );
};

const Content = ({ config }) => {
  // const [filter, setFilter] = useState({ start_at: null, end_at: null });
  const data = useQuery({
    queryKey: ["report_payment_history"],
    queryFn: async () =>
      meilisearchReportPaymentHistoryGet(await meilisearchGetToken()),
  });

  const handleExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("LICH SU THANH TOAN", {
      pageSetup: { paperSize: 9, orientation: "landscape" },
    });

    worksheet.addRow(["", "TRƯỜNG TH&THCS HỮU NGHỊ QUỐC TẾ"]);
    worksheet.mergeCells("B1:C1");
    const tentruong = worksheet.getCell("B1");
    tentruong.font = { name: "Times New Roman", size: 11 };
    tentruong.alignment = { vertical: "middle", horizontal: "center" };

    worksheet.addRow(["", "", "LỊCH SỬ THANH TOÁN"]);
    worksheet.mergeCells("C2:J2");
    const titleCell = worksheet.getCell("C2");
    titleCell.font = { name: "Times New Roman", size: 16, bold: true };
    titleCell.alignment = { vertical: "middle", horizontal: "center" };

    worksheet.addRow(["", "", "(Theo nhiều học sinh)"]);
    worksheet.mergeCells("C3:J3");
    const Ghichu = worksheet.getCell("C3");
    Ghichu.font = {
      name: "Times New Roman",
      size: 14,
      color: { argb: "FF0000" },
    };
    Ghichu.alignment = { vertical: "middle", horizontal: "center" };

    worksheet.addRow([
      "",
      "",
      `Tại ngày ${moment().date()} Tháng ${
        moment().month() + 1
      } Năm ${moment().year()}`,
    ]);
    worksheet.mergeCells("C4:J4");
    const Taingay = worksheet.getCell("C4");
    Taingay.font = {
      name: "Times New Roman",
      size: 14,
      color: { argb: "#CC0000" },
    };
    Taingay.alignment = { vertical: "middle", horizontal: "center" };
    // Thêm dữ liệu vào bảng tính
    // worksheet.columns = [
    //   { key: "col1", width: 5 },
    //   { key: "col2", width: 20 },
    //   { key: "col3", width: 30 },
    //   { key: "col4", width: 20 },
    //   { key: "col5", width: 20 },
    //   { key: "col6", width: 20 },
    //   { key: "col7", width: 20 },
    //   { key: "col8", width: 20 },
    //   { key: "col9", width: 20 },
    //   { key: "col10", width: 20 },
    //   { key: "col11", width: 20 },
    //   { key: "col12", width: 20 },
    //   { key: "col13", width: 20 },
    //   { key: "col14", width: 20 },
    //   { key: "col15", width: 20 },
    //   { key: "col16", width: 20 },
    //   { key: "col17", width: 20 },
    //   { key: "col18", width: 20 },
    //   { key: "col19", width: 20 },
    //   { key: "col20", width: 20 },
    // ];
    // worksheet.getCell(6, 1).value = "STT";
    // worksheet.getCell("A6").border = {
    //   top: { style: "thin" },
    //   left: { style: "thin" },
    //   bottom: { style: "thin" },
    //   right: { style: "thin" },
    // };
    // worksheet.getCell(6, 2).value = "Mã học sinh";
    // worksheet.getCell(6, 3).value = "Họ và tên học sinh";
    // worksheet.getCell(6, 4).value = "Ngày sinh";
    // worksheet.getCell(6, 5).value = "Lớp";
    // worksheet.getCell(6, 6).value = "Mã lớp";
    // worksheet.getCell(6, 7).value = "Ưu đãi, miễn giảm kỳ 1 năm 202…-202…";
    // worksheet.getCell(6, 8).value = "Số phải nộp kỳ 1 năm 202…-202…";
    // worksheet.getCell(6, 9).value = "Đã hoàn trả kỳ 1 năm 202…-202…";
    // worksheet.getCell(6, 10).value = "Số đã nộp kỳ 1 năm 202…-202…";
    // worksheet.getCell(6, 11).value = "Công nợ cuối kỳ 1 năm 202…-202…";
    // worksheet.getCell(6, 12).value = "Ưu đãi, miễn giảm kỳ 2 năm 202…-202…";
    // worksheet.getCell(6, 13).value = "Số phải nộp kỳ 2 năm 202…-202…";
    // worksheet.getCell(6, 14).value = "Đã điều chỉnh kỳ 2 năm 202…-202…";
    // worksheet.getCell(6, 15).value = "Đã hoàn trả kỳ 2 năm 202…-202…";
    // worksheet.getCell(6, 16).value = "Số đã nộp kỳ 2 năm 202…-202…";
    // worksheet.getCell(6, 17).value = "Công nợ cuối kỳ 2 năm 202…-202…";
    // worksheet.getCell(6, 18).value = "Ưu đãi, miễn giảm kỳ n ";
    // worksheet.getCell(6, 19).value = "";
    // worksheet.getCell(6, 20).value = "Công nợ cuối kỳ n";

    const header = [
      ...new Map(
        data.data.results.map((item) => [
          item["batch_id"],
          {
            batch_id: item.batch_id,
            batch: item.batch,
            school_year: item.school_year,
          },
        ])
      ).values(),
    ];

    const listStudent = [
      ...new Map(
        data.data.results.map((item) => [
          item["student_code"],
          {
            student_code: item.student_code,
            first_name: item.first_name,
            last_name: item.last_name,
            class_code: item.class_code,
            date_of_birth: item.date_of_birth,
          },
        ])
      ).values(),
    ];

    worksheet.addRow([
      "STT",
      "Mã học sinh",
      "Họ và tên học sinh",
      "Ngày sinh",
      "Lớp",
      "Mã lớp",
      ...header.reduce(
        (total, curr) => [
          ...total,
          `Ưu đãi, miễn giảm kỳ ${curr.batch} năm ${curr.school_year}`,
          `Số phải nộp kỳ ${curr.batch} năm ${curr.school_year}`,
          `Đã điều chỉnh kỳ ${curr.batch} năm ${curr.school_year}`,
          `Đã hoàn trả kỳ ${curr.batch} năm ${curr.school_year}`,
          `Số đã nộp kỳ ${curr.batch} năm ${curr.school_year}`,
          `Công nợ cuối kỳ ${curr.batch} năm ${curr.school_year}`,
        ],
        []
      ),
    ]);

    listStudent
      .sort((a, b) => a.student_code - b.student_code)
      .forEach((item, index) => {
        worksheet.addRow([
          ++index,
          item.student_code,
          `${item.first_name} ${item.last_name}`,
          item.date_of_birth.split("-").reverse().join("-"),
          item.class_code[0],
          item.class_code.substring(1),
          ...header.reduce((total, curr) => {
            const detail = data.data.results.find(
              (el) =>
                el.student_code === item.student_code &&
                el.batch_id === curr.batch_id
            );
            if (detail)
              return [
                ...total,
                detail?.discount,
                detail?.actual_amount_collected,
                detail?.amount_edited,
                detail?.amount_spend,
                detail?.amount_collected,
                detail?.next_batch_money,
              ];

            return [...total, 0, 0, 0, 0, 0, 0];
          }, []),
        ]);
      });
    const total = [];
    for (let i = 7; i <= worksheet.columnCount; i++) {
      let col = worksheet.getColumn(i);
      let colTotal = 0;
      col.eachCell((cell, rowNumber) => {
        if (rowNumber >= 6) colTotal = colTotal + parseInt(cell.text);
      });
      total.push(colTotal);
    }

    worksheet.addRow(["", "", "Tổng cộng", "", "", "", ...total]);

    // worksheet.getCell(6, 1).alignment = {
    //   wrapText: true,
    //   vertical: "middle",
    //   horizontal: "center",
    // };
    // worksheet.getCell(6, 2).alignment = {
    //   wrapText: true,
    //   vertical: "middle",
    //   horizontal: "center",
    // };
    // worksheet.getCell(6, 3).alignment = {
    //   wrapText: true,
    //   vertical: "middle",
    //   horizontal: "center",
    // };
    // worksheet.getCell(6, 4).alignment = {
    //   wrapText: true,
    //   vertical: "middle",
    //   horizontal: "center",
    // };
    // worksheet.getCell(6, 5).alignment = {
    //   wrapText: true,
    //   vertical: "middle",
    //   horizontal: "center",
    // };
    // worksheet.getCell(6, 6).alignment = {
    //   wrapText: true,
    //   vertical: "middle",
    //   horizontal: "center",
    // };
    // worksheet.getCell(6, 7).alignment = {
    //   wrapText: true,
    //   vertical: "middle",
    //   horizontal: "center",
    // };
    // worksheet.getCell(6, 8).alignment = {
    //   wrapText: true,
    //   vertical: "middle",
    //   horizontal: "center",
    // };
    // worksheet.getCell(6, 9).alignment = {
    //   wrapText: true,
    //   vertical: "middle",
    //   horizontal: "center",
    // };
    // worksheet.getCell(6, 10).alignment = {
    //   wrapText: true,
    //   vertical: "middle",
    //   horizontal: "center",
    // };
    // worksheet.getCell(6, 11).alignment = {
    //   wrapText: true,
    //   vertical: "middle",
    //   horizontal: "center",
    // };
    // worksheet.getCell(6, 12).alignment = {
    //   wrapText: true,
    //   vertical: "middle",
    //   horizontal: "center",
    // };
    // worksheet.getCell(6, 13).alignment = {
    //   wrapText: true,
    //   vertical: "middle",
    //   horizontal: "center",
    // };

    // worksheet.getCell("A6").border = {
    //   top: { style: "thin" },
    //   left: { style: "thin" },
    //   bottom: { style: "thin" },
    //   right: { style: "thin" },
    // };

    // worksheet.getCell(6, 1).border = {
    //   top: { style: "thin" },
    //   left: { style: "thin" },
    //   bottom: { style: "thin" },
    //   right: { style: "thin" },
    // };
    // worksheet.getCell(6, 2).border = {
    //   top: { style: "thin" },
    //   left: { style: "thin" },
    //   bottom: { style: "thin" },
    //   right: { style: "thin" },
    // };
    // worksheet.getCell(6, 3).border = {
    //   top: { style: "thin" },
    //   left: { style: "thin" },
    //   bottom: { style: "thin" },
    //   right: { style: "thin" },
    // };
    // worksheet.getCell(6, 4).border = {
    //   top: { style: "thin" },
    //   left: { style: "thin" },
    //   bottom: { style: "thin" },
    //   right: { style: "thin" },
    // };
    // worksheet.getCell(6, 5).border = {
    //   top: { style: "thin" },
    //   left: { style: "thin" },
    //   bottom: { style: "thin" },
    //   right: { style: "thin" },
    // };
    // worksheet.getCell(6, 6).border = {
    //   top: { style: "thin" },
    //   left: { style: "thin" },
    //   bottom: { style: "thin" },
    //   right: { style: "thin" },
    // };
    // worksheet.getCell(6, 7).border = {
    //   top: { style: "thin" },
    //   left: { style: "thin" },
    //   bottom: { style: "thin" },
    //   right: { style: "thin" },
    // };
    // worksheet.getCell(6, 8).border = {
    //   top: { style: "thin" },
    //   left: { style: "thin" },
    //   bottom: { style: "thin" },
    //   right: { style: "thin" },
    // };
    // worksheet.getCell(6, 9).border = {
    //   top: { style: "thin" },
    //   left: { style: "thin" },
    //   bottom: { style: "thin" },
    //   right: { style: "thin" },
    // };
    // worksheet.getCell(6, 10).border = {
    //   top: { style: "thin" },
    //   left: { style: "thin" },
    //   bottom: { style: "thin" },
    //   right: { style: "thin" },
    // };
    // worksheet.getCell(6, 11).border = {
    //   top: { style: "thin" },
    //   left: { style: "thin" },
    //   bottom: { style: "thin" },
    //   right: { style: "thin" },
    // };
    // worksheet.getCell(6, 12).border = {
    //   top: { style: "thin" },
    //   left: { style: "thin" },
    //   bottom: { style: "thin" },
    //   right: { style: "thin" },
    // };
    // worksheet.getCell(6, 13).border = {
    //   top: { style: "thin" },
    //   left: { style: "thin" },
    //   bottom: { style: "thin" },
    //   right: { style: "thin" },
    // };

    // worksheet.getCell(6, 1).font = { bold: true, name: "Times New Roman" };
    // worksheet.getCell(6, 2).font = { bold: true, name: "Times New Roman" };
    // worksheet.getCell(6, 3).font = { bold: true, name: "Times New Roman" };
    // worksheet.getCell(6, 4).font = { bold: true, name: "Times New Roman" };
    // worksheet.getCell(6, 5).font = { bold: true, name: "Times New Roman" };
    // worksheet.getCell(6, 6).font = { bold: true, name: "Times New Roman" };
    // worksheet.getCell(6, 7).font = {
    //   bold: true,
    //   name: "Times New Roman",
    //   color: { argb: "FF0000" },
    // };
    // worksheet.getCell(6, 8).font = { bold: true, name: "Times New Roman" };
    // worksheet.getCell(6, 9).font = {
    //   bold: true,
    //   name: "Times New Roman",
    //   color: { argb: "FF0000" },
    // };
    // worksheet.getCell(6, 10).font = { bold: true, name: "Times New Roman" };
    // worksheet.getCell(6, 11).font = {
    //   bold: true,
    //   name: "Times New Roman",
    //   color: { argb: "FF0000" },
    // };
    // worksheet.getCell(6, 12).font = { bold: true, name: "Times New Roman" };
    // worksheet.getCell(6, 13).font = {
    //   bold: true,
    //   name: "Times New Roman",
    //   color: { argb: "3366FF" },
    // };

    const buf = await workbook.xlsx.writeBuffer();

    saveAs(new Blob([buf]), "Tong-hop-da-thu-nhieu-hs.xlsx");
  };
  return (
    <div className="flex flex-col gap-5 justify-center">
      <h5 className="text-center">Lịch sử thanh toán theo nhiều học sinh</h5>
      {/* {data.data?.results?.length && (
        <button className="self-end btn w-fit" onClick={() => handleExcel()}>
          Xuất Excel
        </button>
      )} */}

      <button
        className="self-end btn w-fit"
        onClick={() => handleExcel()}
        disabled={data.isLoading && data.isFetching}
      >
        Xuất Excel
      </button>
      <TableView
        data={data.data?.results}
        config={config}
        isLoading={data.isLoading && data.isFetching}
      />
    </div>
  );
};

export default Content;
